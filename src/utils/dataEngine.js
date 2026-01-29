
import alasql from 'alasql';
import { MOCK_FEEDBACK_DATA } from '../data/mockData';
import Groq from 'groq-sdk';

// Initialize Groq SDK with the API key from environment variables
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Required for frontend usage
});

const SYSTEM_PROMPT = `
You are a CX Analytics Expert. Convert natural language to AlaSQL for execution on a JSON dataset.
Table name is ALWAYS ?.

Schema:
- date (YYYY-MM-DD)
- store_name ("Dubai Mall", "City Center", "Mall of Emirates")
- brand_name ("Nike", "Adidas", "Puma", "Under Armour")
- basket_value (Number, e.g. 250.50)
- items_purchased (Array of strings, e.g. ["Air Max", "Cap"])
- discount_applied (Boolean)
- nps_score (0-10)
- rating (1-5) 
- sentiment ("Positive", "Neutral", "Negative")
- category ("Billing Time", "Staff Behavior", "Product Quality", "Store Ambience", "Inventory")
- customer_segment ("Gold", "Silver", "Bronze")

Output Format (STRICT JSON):
{
  "sql": "SELECT ... FROM ?",
  "chart_type": "bar" | "line" | "stat" | "pie",
  "xKey": "column_for_xaxis_or_labels",
  "dataKey": "column_for_yaxis_or_values",
  "summary_hint": "Natural language summary",
  "filters": { "field": "value" }
}

Rules:
1. SQL Aliases: Use descriptive names like [average_rating], [nps_avg], [total_revenue], or [total_feedback].
2. Chart Selection:
   - Use "pie" only for distribution or share of a total (e.g., revenue share, count by brand).
   - Use "line" for trends over time ([date]).
   - Use "stat" for single numbers.
   - Use "bar" for everything else.
3. For "Top", "Which", or "Best" questions (e.g., "Which store has most feedback?"), always SELECT both the dimension and the metric: SELECT [store_name], COUNT(*) AS [total_feedback]...
4. Financials: Use SUM([basket_value]) for revenue and AVG([basket_value]) for average spend.
5. Boolean Filters: For "discounts", use [discount_applied] = true or false.
6. Sentiment Mapping:
   - "complaints", "issues", "unhappy", "poor reviews", "bad", "problems" -> sentiment = 'Negative'
   - "praise", "happy", "great reviews", "good", "satisfied", "positive" -> sentiment = 'Positive'
7. dataKey: MUST match the metric alias alias (not the dimension).
8. For comparisons/breakdowns, use GROUP BY.
9. Use single quotes for strings: 'Nike'.
10. DRILL-DOWN: Use "Previous Intent" to maintain context.

Answer ONLY with JSON. No prose. No markdown code blocks.
`;

export const processQuery = async (query, context = null) => {
    try {
        let promptText = query;
        if (context) {
            promptText = `Previous Intent: ${JSON.stringify(context)}. New follow-up: "${query}"`;
        }

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
        console.log("Groq Response:", text);

        const intent = JSON.parse(text);
        console.log("AI Intent:", intent);

        const result = executeIntent(intent);
        return { ...result, intent };

    } catch (error) {
        console.error("Query processing failed:", error);
        return {
            answerText: "I'm having trouble connecting to the analytics engine.",
            chartConfig: { type: 'none', data: [] },
            evidence: []
        };
    }
};

const executeIntent = (intent) => {
    if (!intent || !intent.sql) {
        return { answerText: "No query generated.", chartConfig: { type: 'none', data: [] }, evidence: [] };
    }

    let sql = intent.sql;

    // --- SQL SELF-HEALING (Phi-3 Hallucination Strip) ---
    // Remove common hallucinations like .com' or weird trailing nonsense
    if (sql.includes('.com')) {
        console.warn("Self-healing: Removed hallucination from SQL");
        // Regex to find things like "OR something.com'" or "AND something.com'"
        sql = sql.replace(/(OR|AND)\s+[^']*?\.com.*?'/gi, '');
        // Clean up any double-closed parentheses if they were left over
        sql = sql.replace(/\(\s*\)/g, '(TRUE)');
    }
    // Ensure table name is Correct
    sql = sql.replace(/FROM\s+\S+/i, 'FROM ?');

    try {
        // 1. Execute SQL using AlaSQL
        const chartData = alasql(sql, [MOCK_FEEDBACK_DATA]);
        console.log("AlaSQL Results:", chartData);

        // 2. Get Evidence (Raw filtered data)
        let evidence = [];
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+GROUP BY|\s+ORDER BY|$)/i);
        if (whereMatch) {
            const evidenceSql = `SELECT * FROM ? WHERE ${whereMatch[1]}`;
            evidence = alasql(evidenceSql, [MOCK_FEEDBACK_DATA]);
        } else {
            evidence = MOCK_FEEDBACK_DATA;
        }

        return {
            answerText: intent.summary_hint || "Analysis complete.",
            chartConfig: {
                type: intent.chart_type || 'bar',
                data: chartData,
                xKey: intent.xKey || 'name',
                dataKey: intent.dataKey || 'count'
            },
            evidence: evidence
        };
    } catch (err) {
        console.error("AlaSQL Execution Error:", err);
        return {
            answerText: `I encountered an error executing your query: ${err.message}. This usually happens if the AI generates slightly incorrect SQL. Please try rephrasing or clearing the session.`,
            chartConfig: { type: 'none', data: [] },
            evidence: []
        };
    }
};