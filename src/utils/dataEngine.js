
import alasql from 'alasql';
import { MOCK_FEEDBACK_DATA } from '../data/mockData';

const BASE_URL = 'http://localhost:3000/api/analyze';

export const processQuery = async (query, context = null) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: query, context: context })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const intent = await response.json();
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
            evidence: evidence.slice(0, 50)
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