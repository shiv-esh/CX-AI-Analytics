
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const MODEL = 'openai/gpt-oss-120b';

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

app.post('/api/analyze', async (req, res) => {
    try {
        const { question, context } = req.body;
        if (!question) return res.status(400).json({ error: 'Question is required' });

        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is missing in your .env file");
        }

        let promptText = question;
        if (context) {
            promptText = `Previous Intent: ${JSON.stringify(context)}. New follow-up: "${question}"`;
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: promptText }
            ],
            model: MODEL,
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const text = chatCompletion.choices[0]?.message?.content || "";
        console.log("Groq Response:", text);

        // Fallback parsing in case the model returns markdown or other text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No valid JSON found in model response");

        res.json(JSON.parse(jsonMatch[0]));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`CX Analytics Server (Groq Powered) running at http://localhost:${port}`);
});
