
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is not set in environment variables.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `
You are a CX Analytics Expert. Convert natural language to AlaSQL for execution on a JSON dataset.
Table name is ALWAYS ?.

**Schema:**
- date (YYYY-MM-DD)
- store_name ("Dubai Mall", "City Center", "Mall of Emirates")
- brand_name ("Nike", "Adidas")
- nps_score (0-10)
- rating (1-5) 
- sentiment ("Positive", "Neutral", "Negative")
- category ("Billing Time", "Staff Behavior", "Product Quality", "Store Ambience", "Inventory")
- customer_segment ("Gold", "Silver", "Bronze")

**Output Format (STRICT JSON):**
{
  "sql": "SELECT ... FROM ?",
  "chart_type": "bar" | "line" | "stat",
  "xKey": "column_for_xaxis",
  "dataKey": "column_for_yaxis",
  "summary_hint": "Natural language summary of what is being shown",
  "filters": { "field": "value" }
}

**Rules:**
1. Use AVG(rating), AVG(nps_score), or COUNT(*).
2. For comparisons/breakdowns, use GROUP BY.
3. Use single quotes for strings: 'Nike'.
4. DRILL-DOWN: You will receive the "Previous Intent". Merge new filters onto old ones or pivot as requested.

Answer ONLY with JSON. No prose.
`;

app.post('/api/analyze', async (req, res) => {
    try {
        const { question, context } = req.body;
        if (!question) return res.status(400).json({ error: 'Question is required' });

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        let prompt = question;
        if (context) {
            prompt = `Previous Intent: ${JSON.stringify(context)}. New follow-up: "${question}"`;
        }

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "{\"status\": \"ready\"}" }] }
            ]
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Response:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No valid JSON found");

        res.json(JSON.parse(jsonMatch[0]));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`CX Analytics Server (Gemini Powered) running at http://localhost:${port}`);
});
