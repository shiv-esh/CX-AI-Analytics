
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
You are an analytics orchestrator for a Customer Experience (CX) dashboard.
You translate natural language into structured JSON intent.

Dataset fields:
- date (YYYY-MM-DD)
- store_name ("Dubai Mall", "City Center", "Mall of Emirates")
- brand_name ("Nike", "Adidas")
- nps_score (0-10)
- sentiment ("Positive", "Neutral", "Negative")
- category ("Billing Time", "Staff Behavior", "Product Quality", "Store Ambience", "Inventory")

Rules:
1. metric: "count", "avg_nps", or "avg_rating".
2. group_by: "date", "store_name", "brand_name", "category", or null.
3. chart_type: "line" (for trends), "bar" (comparisons), or "stat" (single value).
4. filters: An object where keys match field names.

Expected JSON schema:
{
  "filters": {
    "store_name": string | null,
    "brand_name": string | null,
    "sentiment": string | null,
    "category": string | null,
    "date_range": string | null
  },
  "metric": "count" | "avg_nps",
  "group_by": "date" | "store_name" | "brand_name" | "category" | null,
  "chart_type": "line" | "bar" | "stat",
  "summary_hint": string
}

Return ONLY JSON.
`;

app.post('/api/analyze', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ error: 'Question is required' });

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "{\"status\": \"ready\"}" }] }
            ]
        });

        const result = await chat.sendMessage(question);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Response:", text);

        // Extract JSON from potential markdown blocks or stray text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in AI response");
        }

        res.json(JSON.parse(jsonMatch[0]));

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
