
export const MOCK_FEEDBACK_DATA = [
    // Dubai Mall - Nike & Adidas
    { id: '1', date: '2023-11-01', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 9, sentiment: 'Positive', category: 'Product Quality', comment: 'Great running shoes.' },
    { id: '2', date: '2023-11-02', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 2, sentiment: 'Negative', category: 'Billing Time', comment: 'Queue was too long.' },
    { id: '3', date: '2023-11-03', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 8, sentiment: 'Positive', category: 'Store Ambience', comment: 'Loved the lighting.' },
    { id: '4', date: '2023-11-04', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 3, sentiment: 'Negative', category: 'Staff Behavior', comment: 'Staff was ignoring me.' },

    // City Center
    { id: '5', date: '2023-11-05', store_name: 'City Center', brand_name: 'Nike', nps_score: 7, sentiment: 'Neutral', category: 'Inventory', comment: 'Size was missing.' },
    { id: '6', date: '2023-11-06', store_name: 'City Center', brand_name: 'Adidas', nps_score: 10, sentiment: 'Positive', category: 'Billing Time', comment: 'Fast checkout!' },

    // Mall of Emirates
    { id: '7', date: '2023-11-07', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 1, sentiment: 'Negative', category: 'Product Quality', comment: 'Sole came off.' },
    { id: '8', date: '2023-11-08', store_name: 'Mall of Emirates', brand_name: 'Adidas', nps_score: 9, sentiment: 'Positive', category: 'Staff Behavior', comment: 'Very helpful team.' },

    // More Data for trends
    { id: '9', date: '2023-11-09', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 8, sentiment: 'Positive', category: 'Inventory', comment: 'Found everything.' },
    { id: '10', date: '2023-11-10', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 4, sentiment: 'Negative', category: 'Billing Time', comment: 'Slow registers.' },
    { id: '11', date: '2023-11-11', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Store Ambience', comment: 'Clean store.' },
    { id: '12', date: '2023-11-12', store_name: 'City Center', brand_name: 'Adidas', nps_score: 2, sentiment: 'Negative', category: 'Product Quality', comment: 'Faded after wash.' },

    // Filling up to ~20 for demo
    { id: '13', date: '2023-11-13', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 9, sentiment: 'Positive', category: 'Billing Time', comment: 'Good service.' },
    { id: '14', date: '2023-11-14', store_name: 'City Center', brand_name: 'Adidas', nps_score: 6, sentiment: 'Neutral', category: 'Staff Behavior', comment: 'Okay service.' },
    { id: '15', date: '2023-11-15', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 0, sentiment: 'Negative', category: 'Billing Time', comment: 'Worst experience ever.' }
];

// Add rating/customer_segment if needed logic relies on it, but for now simple structure is fine.
// I'll ensure fields exist if referenced.
