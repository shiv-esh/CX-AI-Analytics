
import { MOCK_FEEDBACK_DATA } from '../data/mockData';

const BASE_URL = 'http://localhost:3000/api/analyze';

export const processQuery = async (query) => {
    try {
        // 1. Get Intent from Backend
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: query })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const intent = await response.json();
        console.log("AI Intent:", intent);

        return executeIntent(intent);

    } catch (error) {
        console.error("Query processing failed:", error);
        // Fallback or error state
        return {
            answerText: "I'm having trouble connecting to the AI brain. Please make sure the backend is running.",
            chartConfig: { type: 'none', data: [] },
            evidence: []
        };
    }
};

const executeIntent = (intent) => {
    if (!intent) return { answerText: "Error: No intent received.", chartConfig: { type: 'none', data: [] }, evidence: [] };

    // Normalize Intent Structure (Gemini sometimes varies)
    let { filters = {}, metric = 'count', group_by, chart_type, summary_hint } = intent;

    // Handle Array Filters (conversion to object)
    if (Array.isArray(filters)) {
        const objFilters = {};
        filters.forEach(f => {
            if (f.field && f.value) objFilters[f.field] = f.value;
        });
        filters = objFilters;
    }

    // Handle Array Group By
    if (Array.isArray(group_by)) group_by = group_by[0];

    // Normalize Metric Names
    if (metric === 'nps_score') metric = 'avg_nps';

    // Normalize Chart Type
    if (chart_type === 'line_chart') chart_type = 'line';

    console.log("Normalized Intent:", { filters, metric, group_by, chart_type });

    // 1. Filter Data
    let filteredData = MOCK_FEEDBACK_DATA.filter(item => {
        // Multi-field check
        for (const [key, value] of Object.entries(filters)) {
            if (!value) continue;

            // Handle specific field aliases if any
            const dataKey = key === 'brand' ? 'brand_name' : key;

            if (item[dataKey]) {
                if (String(item[dataKey]).toLowerCase() !== String(value).toLowerCase()) return false;
            }
        }

        // Date Range Logic
        if (filters.date_range) {
            const itemDate = new Date(item.date);
            const today = new Date('2023-11-15');

            if (filters.date_range === 'last_7_days') {
                const cutoff = new Date(today);
                cutoff.setDate(today.getDate() - 7);
                if (itemDate < cutoff || itemDate > today) return false;
            } else if (filters.date_range === 'this_month') {
                if (itemDate.getMonth() !== today.getMonth() || itemDate.getFullYear() !== today.getFullYear()) return false;
            }
        }
        return true;
    });

    console.log(`Matched ${filteredData.length} records.`);

    // 2. Grouping & Metrics
    let chartData = [];
    let xKey = 'name';

    if (group_by && filteredData.length > 0) {
        xKey = (group_by === 'date' || group_by === 'time') ? 'date' : 'name';

        const groups = filteredData.reduce((acc, item) => {
            const key = (group_by === 'date' || group_by === 'time') ? item.date : item[group_by] || 'Unknown';
            if (!acc[key]) acc[key] = { count: 0, totalNps: 0, totalRating: 0 };

            acc[key].count += 1;
            acc[key].totalNps += (item.nps_score || 0);
            acc[key].totalRating += (item.rating || 0);
            return acc;
        }, {});

        chartData = Object.keys(groups).map(key => {
            const g = groups[key];
            let value = 0;
            if (metric === 'count') value = g.count;
            else if (metric === 'avg_nps') value = Number((g.totalNps / g.count).toFixed(1));
            else if (metric === 'avg_rating') value = Number((g.totalRating / g.count).toFixed(1));

            return { [xKey]: key, value, name: key };
        });

        if (xKey === 'date') {
            chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    } else {
        let value = 0;
        const count = filteredData.length;
        if (count > 0) {
            if (metric === 'count') value = count;
            else if (metric === 'avg_nps') value = Number((filteredData.reduce((s, i) => s + (i.nps_score || 0), 0) / count).toFixed(1));
            else if (metric === 'avg_rating') value = Number((filteredData.reduce((s, i) => s + (i.rating || 0), 0) / count).toFixed(1));
        }
        chartData = [{ name: 'Total', value }];
    }

    // 3. Answer Text
    let answerText = summary_hint;
    if (!answerText || answerText.includes("analysis based on your query")) {
        const metricName = metric === 'avg_nps' ? 'Avg NPS' : 'Feedback count';
        const storeStr = filters.store_name ? ` at ${filters.store_name}` : '';
        const brandStr = filters.brand_name ? ` for ${filters.brand_name}` : '';
        answerText = `Found ${filteredData.length} records. Showing ${metricName}${brandStr}${storeStr}.`;
    }

    return {
        answerText: filteredData.length === 0 ? "No records found for this selection." : answerText,
        chartConfig: {
            type: chart_type || (group_by === 'date' ? 'line' : 'bar'),
            data: chartData,
            xKey: xKey,
            dataKey: 'value'
        },
        evidence: filteredData
    };
};
