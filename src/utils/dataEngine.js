import alasql from 'alasql';
import { MOCK_FEEDBACK_DATA, INVENTORY_DATA } from '../data/mockData';
import Groq from 'groq-sdk';

// Initialize Groq SDK with the API key from environment variables
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Required for frontend usage
});

const SYSTEM_PROMPT = `
You are a CX Analytics Expert. Convert natural language to AlaSQL for execution on a JSON dataset.
You have access to TWO tables:
1. FEEDBACK_DATA (Customer Sentiment)
2. INVENTORY_DATA (Stock Levels)

Schema:
Table: FEEDBACK_DATA
- date (YYYY-MM-DD)
- store_name ("Dubai Mall", "City Center", "Mall of Emirates")
- brand_name ("Nike", "Adidas", "Puma", "Under Armour")
- discount_applied (Boolean)
- nps_score (0-10)
- rating (1-5) 
- sentiment ("Positive", "Neutral", "Negative")
- category ("Billing Time", "Staff Behavior", "Product Quality", "Store Ambience", "Inventory")
- customer_segment ("Gold", "Silver", "Bronze")
- comment (String)

Table: INVENTORY_DATA
- date (YYYY-MM-DD)
- store_name ("Dubai Mall", "City Center", "Mall of Emirates")
- product_id (String, e.g. "Air Jordan", "Stan Smith")
- stock_level (Number, e.g. 0, 5, 50)
- stock_status ("In Stock", "Low Stock", "Out of Stock")
- category ("Shoes", "Apparel", "Accessories")
- brand_name ("Nike", "Adidas", "Puma", "Under Armour")

Output Format (STRICT JSON):
{
  "sql": "SELECT ...",
  "chart_type": "bar" | "line" | "stat" | "pie",
  "xKey": "column_for_xaxis_or_labels",
  "dataKey": "column_for_yaxis_or_values",
  "summary_hint": "Natural language summary",
  "filters": { "field": "value" }
}

Rules:
1. Table Selection:
   - Queries about 'complaints', 'nps', 'ratings', 'sentiment' -> Use FEEDBACK_DATA.
   - Queries about 'stock', 'availability', 'supply', 'inventory' -> Use INVENTORY_DATA.
   - For correlation, use JOIN or subqueries. For comparisons (e.g. Stock vs Complaints), use UNION ALL with a 'metric' label column.
2. SQL Aliases: Use descriptive names like [average_rating], [nps_avg], [total_stock], [count_items]. 
   IMPORTANT: NEVER use 'value' as an alias as it is a reserved word in AlaSQL. Use brackets like [value] or [total] instead.
3. Chart Selection:
   - Use "pie" only for distribution.
   - Use "line" for trends over time ([date]).
   - Use "stat" for single numbers.
   - Use "bar" for comparison.
4. For "Top", "Which" questions: SELECT both dimension and metric.
5. Boolean Filters: [discount_applied] = true or false.
6. Sentiment Mapping:
   - "complaints", "issues", "unhappy" -> sentiment = 'Negative'
   - "praise", "happy" -> sentiment = 'Positive'
7. dataKey: MUST match the metric alias used in SQL.
8. Use single quotes for strings: 'Nike'.
9. DRILL-DOWN: Use "Previous Intent" to maintain context.

Answer ONLY with JSON. No prose.
`;

const INSIGHT_PROMPT = `
You are a Senior Data Analyst. Interpret the provided JSON data and answer the user's question concisely in ONE or TWO sentences.

Constraints:
1. Do not describe the table structure (e.g., "The table shows...").
2. Go straight to the "Why" and the key takeaway.
3. Highlight outliers, biggest numbers, or significant trends.
4. If the data is empty, say "No relevant data found for this specific query."
5. Use a professional yet conversational tone.
`;

export const processQuery = async (query, context = null) => {
    try {
        let promptText = query;
        if (context) {
            promptText = `Previous Intent: ${JSON.stringify(context)}. New follow-up: "${query}"`;
        }

        // Pass 1: Intent Generation
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: promptText }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const text = chatCompletion.choices[0]?.message?.content || "";

        try {
            const intent = JSON.parse(text);

            // Local Execution
            const executionResult = executeIntent(intent);

            // Pass 2: Insight Generation
            const insight = await generateInsight(query, executionResult.chartConfig.data);

            return {
                ...executionResult,
                answerText: insight,
                intent
            };
        } catch (parseErr) {
            console.error("Failed to parse LLM response as JSON:", parseErr);
            throw parseErr;
        }

    } catch (error) {
        console.error("Query processing failed:", error);
        return {
            answerText: "I'm having trouble connecting to the analytics engine.",
            chartConfig: { type: 'none', data: [] },
            evidence: []
        };
    }
};

const generateInsight = async (query, data) => {
    if (!data || data.length === 0) {
        return "No relevant data found for this specific query.";
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: INSIGHT_PROMPT },
                {
                    role: "user",
                    content: `The user asked: "${query}".\nThe data results are: ${JSON.stringify(data.slice(0, 15))}`
                }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0.5,
        });

        return chatCompletion.choices[0]?.message?.content || "Analysis complete.";
    } catch (error) {
        console.error("Insight generation failed:", error);
        return "Analysis complete (Insight generation failed).";
    }
};

const executeIntent = (intent) => {
    if (!intent || !intent.sql) {
        return { answerText: "No query generated.", chartConfig: { type: 'none', data: [] }, evidence: [] };
    }

    let sql = intent.sql;

    // --- SQL SELF-HEALING ---
    if (sql.includes('.com')) {
        sql = sql.replace(/(OR|AND)\s+[^']*?\.com.*?'/gi, '');
        sql = sql.replace(/\(\s*\)/g, '(TRUE)');
    }

    if (/\s+AS\s+value(\s+|,|$)/gi.test(sql)) {
        sql = sql.replace(/\s+AS\s+value(\s+|,|$)/gi, ' AS [value]$1');
    }

    const mysqldb = new alasql.Database();

    try {
        mysqldb.exec('CREATE TABLE FEEDBACK_DATA');
        mysqldb.exec('INSERT INTO FEEDBACK_DATA SELECT * FROM ?', [MOCK_FEEDBACK_DATA]);

        mysqldb.exec('CREATE TABLE INVENTORY_DATA');
        mysqldb.exec('INSERT INTO INVENTORY_DATA SELECT * FROM ?', [INVENTORY_DATA]);

        const chartData = mysqldb.exec(sql);

        // --- ENHANCED EVIDENCE COLLECTION (Multi-table supported) ---
        let evidence = [];
        const tablesInSql = [...sql.matchAll(/\b(FEEDBACK_DATA|INVENTORY_DATA)\b/gi)].map(m => m[0]);
        const uniqueTables = [...new Set(tablesInSql)];

        uniqueTables.forEach(tableName => {
            // Find WHERE clause for this table
            const whereMatch = sql.match(new RegExp(`WHERE\\s+([\\s\\S]+?)(?:\\s+GROUP BY|\\s+ORDER BY|\\s+UNION|\\s+JOIN|$)`, 'i'));
            const aliasMatch = sql.match(new RegExp(`FROM\\s+${tableName}\\s+([a-z0-9_]+)`, 'i'));
            const alias = aliasMatch ? aliasMatch[1] : '';

            let evidenceSql = `SELECT * FROM ${tableName}`;
            if (whereMatch) {
                let whereClause = whereMatch[1];
                // If the user's WHERE used aliases but this table query doesn't, we need to be careful.
                // For simplicity, if it's a multi-table query, we'll try to execute a limited version of the original query or a filtered sample.
                evidenceSql += alias ? ` AS ${alias} WHERE ${whereClause}` : ` WHERE ${whereClause.replace(/[a-z0-9_]+\./gi, '')}`;
            }
            evidenceSql += ' LIMIT 20';

            try {
                const rows = mysqldb.exec(evidenceSql);
                evidence = [...evidence, ...rows.map(r => ({ ...r, __source: tableName.replace('_DATA', '') }))];
            } catch (e) {
                // Fallback to random sample if where clause fail
                try {
                    const rows = mysqldb.exec(`SELECT * FROM ${tableName} LIMIT 5`);
                    evidence = [...evidence, ...rows.map(r => ({ ...r, __source: tableName.replace('_DATA', '') }))];
                } catch (e2) { }
            }
        });

        return {
            answerText: "Analyzing data...",
            chartConfig: {
                type: intent.chart_type || 'bar',
                data: chartData,
                xKey: intent.xKey || (chartData[0] ? Object.keys(chartData[0])[0] : 'name'),
                dataKey: intent.dataKey || (chartData[0] ? Object.keys(chartData[0]).find(k => k !== intent.xKey && typeof chartData[0][k] === 'number') : 'count')
            },
            evidence: evidence
        };
    } catch (err) {
        console.error("AlaSQL Execution Error:", err);
        return {
            answerText: `I encountered an error: ${err.message}.`,
            chartConfig: { type: 'none', data: [] },
            evidence: []
        };
    }
};