
export const MOCK_FEEDBACK_DATA = [
    // --- DUBAI MALL (Focus: Billing Time Negative, Staff Positive, Inventory Mixed) ---
    { id: 'dm-1', date: '2023-11-01', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 2, sentiment: 'Negative', category: 'Billing Time', comment: 'Waiting time at checkout is unbearable.', rating: 1, customer_segment: 'Gold' },
    { id: 'dm-2', date: '2023-11-01', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 9, sentiment: 'Positive', category: 'Staff Behavior', comment: 'Staff was extremely helpful.', rating: 5, customer_segment: 'Silver' },
    { id: 'dm-3', date: '2023-11-02', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 1, sentiment: 'Negative', category: 'Billing Time', comment: 'Only two counters open on a busy day.', rating: 1, customer_segment: 'Bronze' },
    { id: 'dm-4', date: '2023-11-02', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 10, sentiment: 'Positive', category: 'Staff Behavior', comment: 'The manager helped me find the right size.', rating: 5, customer_segment: 'Gold' },
    { id: 'dm-5', date: '2023-11-03', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 4, sentiment: 'Neutral', category: 'Inventory', comment: 'Out of stock for most new arrivals.', rating: 3, customer_segment: 'Silver' },
    { id: 'dm-6', date: '2023-11-04', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 1, sentiment: 'Negative', category: 'Billing Time', comment: 'Took 45 mins to pay for one t-shirt.', rating: 1, customer_segment: 'Gold' },
    { id: 'dm-7', date: '2023-11-05', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 7, sentiment: 'Positive', category: 'Store Ambience', comment: 'Great music and lighting.', rating: 4, customer_segment: 'Silver' },
    { id: 'dm-8', date: '2023-11-06', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 3, sentiment: 'Negative', category: 'Billing Time', comment: 'Billing system was down.', rating: 2, customer_segment: 'Bronze' },
    { id: 'dm-9', date: '2023-11-07', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 8, sentiment: 'Positive', category: 'Product Quality', comment: 'Best shoes I have ever bought.', rating: 5, customer_segment: 'Gold' },
    { id: 'dm-10', date: '2023-11-08', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 2, sentiment: 'Negative', category: 'Billing Time', comment: 'Terrible queue management.', rating: 1, customer_segment: 'Silver' },
    { id: 'dm-11', date: '2023-11-09', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 9, sentiment: 'Positive', category: 'Staff Behavior', comment: 'Very polite staff.', rating: 5, customer_segment: 'Bronze' },
    { id: 'dm-12', date: '2023-11-10', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 0, sentiment: 'Negative', category: 'Billing Time', comment: 'Left the store because the line was too long.', rating: 1, customer_segment: 'Gold' },
    { id: 'dm-13', date: '2023-11-11', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 10, sentiment: 'Positive', category: 'Staff Behavior', comment: 'Loved the personalized service.', rating: 5, customer_segment: 'Silver' },
    { id: 'dm-14', date: '2023-11-12', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 3, sentiment: 'Negative', category: 'Billing Time', comment: 'Need more staff at the desk.', rating: 2, customer_segment: 'Bronze' },
    { id: 'dm-15', date: '2023-11-13', store_name: 'Dubai Mall', brand_name: 'Adidas', nps_score: 5, sentiment: 'Neutral', category: 'Inventory', comment: 'Couldn\'t find my size in store.', rating: 3, customer_segment: 'Gold' },

    // --- CITY CENTER (Focus: Staff Behavior Negative, Inventory Positive, Product Mixed) ---
    { id: 'cc-1', date: '2023-11-01', store_name: 'City Center', brand_name: 'Nike', nps_score: 8, sentiment: 'Positive', category: 'Inventory', comment: 'Lots of options available.', rating: 4, customer_segment: 'Gold' },
    { id: 'cc-2', date: '2023-11-02', store_name: 'City Center', brand_name: 'Adidas', nps_score: 1, sentiment: 'Negative', category: 'Staff Behavior', comment: 'Staff was very rude and uninterested.', rating: 1, customer_segment: 'Silver' },
    { id: 'cc-3', date: '2023-11-03', store_name: 'City Center', brand_name: 'Nike', nps_score: 9, sentiment: 'Positive', category: 'Inventory', comment: 'Found the latest collection here.', rating: 5, customer_segment: 'Bronze' },
    { id: 'cc-4', date: '2023-11-04', store_name: 'City Center', brand_name: 'Adidas', nps_score: 2, sentiment: 'Negative', category: 'Staff Behavior', comment: 'Had to wait for 15 mins for someone to assist.', rating: 1, customer_segment: 'Gold' },
    { id: 'cc-5', date: '2023-11-05', store_name: 'City Center', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Product Quality', comment: 'Highly recommended!', rating: 5, customer_segment: 'Silver' },
    { id: 'cc-6', date: '2023-11-06', store_name: 'City Center', brand_name: 'Adidas', nps_score: 3, sentiment: 'Negative', category: 'Staff Behavior', comment: 'Staff didn\'t know the product details.', rating: 2, customer_segment: 'Bronze' },
    { id: 'cc-7', date: '2023-11-07', store_name: 'City Center', brand_name: 'Nike', nps_score: 4, sentiment: 'Neutral', category: 'Product Quality', comment: 'Average quality shoes.', rating: 3, customer_segment: 'Gold' },
    { id: 'cc-8', date: '2023-11-08', store_name: 'City Center', brand_name: 'Adidas', nps_score: 1, sentiment: 'Negative', category: 'Staff Behavior', comment: 'Rude talk with the cashier.', rating: 1, customer_segment: 'Silver' },
    { id: 'cc-9', date: '2023-11-09', store_name: 'City Center', brand_name: 'Nike', nps_score: 8, sentiment: 'Positive', category: 'Inventory', comment: 'Stock is always full.', rating: 4, customer_segment: 'Bronze' },
    { id: 'cc-10', date: '2023-11-10', store_name: 'City Center', brand_name: 'Adidas', nps_score: 2, sentiment: 'Negative', category: 'Staff Behavior', comment: 'Ignored when I asked for help.', rating: 1, customer_segment: 'Gold' },

    // --- MALL OF EMIRATES (Focus: Product Quality Negative, Ambience Positive, NPS Trend High) ---
    { id: 'moe-1', date: '2023-11-01', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Store Ambience', comment: 'Beautiful store layout.', rating: 5, customer_segment: 'Gold' },
    { id: 'moe-2', date: '2023-11-02', store_name: 'Mall of Emirates', brand_name: 'Adidas', nps_score: 2, sentiment: 'Negative', category: 'Product Quality', comment: 'Seams opened after 1 use.', rating: 1, customer_segment: 'Silver' },
    { id: 'moe-3', date: '2023-11-03', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 9, sentiment: 'Positive', category: 'Store Ambience', comment: 'Best shopping atmosphere.', rating: 5, customer_segment: 'Bronze' },
    { id: 'moe-4', date: '2023-11-04', store_name: 'Mall of Emirates', brand_name: 'Adidas', nps_score: 3, sentiment: 'Negative', category: 'Product Quality', comment: 'Color faded after first wash.', rating: 2, customer_segment: 'Gold' },
    { id: 'moe-5', date: '2023-11-05', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Store Ambience', comment: 'Clean and elite.', rating: 5, customer_segment: 'Silver' },
    { id: 'moe-6', date: '2023-11-06', store_name: 'Mall of Emirates', brand_name: 'Adidas', nps_score: 2, sentiment: 'Negative', category: 'Product Quality', comment: 'Defective piece delivered.', rating: 1, customer_segment: 'Bronze' },
    { id: 'moe-7', date: '2023-11-07', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 8, sentiment: 'Positive', category: 'Store Ambience', comment: 'Premium feel.', rating: 4, customer_segment: 'Gold' },
    { id: 'moe-8', date: '2023-11-08', store_name: 'Mall of Emirates', brand_name: 'Adidas', nps_score: 1, sentiment: 'Negative', category: 'Product Quality', comment: 'Durability is poor.', rating: 1, customer_segment: 'Silver' },
    { id: 'moe-9', date: '2023-11-09', store_name: 'Mall of Emirates', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Billing Time', comment: 'Fast as always.', rating: 5, customer_segment: 'Bronze' },
    { id: 'moe-10', date: '2023-11-10', store_name: 'Mall of Emirates', brand_name: 'Adidas', nps_score: 3, sentiment: 'Negative', category: 'Product Quality', comment: 'Sole broke in a week.', rating: 2, customer_segment: 'Gold' },

    // --- TREND DATA (Multiple Dates to see peaks/valley) ---
    { id: 'tr-1', date: '2023-10-25', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Product Quality', comment: 'Great!', rating: 5, customer_segment: 'Gold' },
    { id: 'tr-2', date: '2023-10-26', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 9, sentiment: 'Positive', category: 'Product Quality', comment: 'Great!', rating: 5, customer_segment: 'Gold' },
    { id: 'tr-3', date: '2023-10-27', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 8, sentiment: 'Positive', category: 'Product Quality', comment: 'Great!', rating: 4, customer_segment: 'Gold' },
    { id: 'tr-4', date: '2023-10-28', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 2, sentiment: 'Negative', category: 'Billing Time', comment: 'Checkout bad.', rating: 1, customer_segment: 'Gold' },
    { id: 'tr-5', date: '2023-10-29', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 1, sentiment: 'Negative', category: 'Billing Time', comment: 'Slow.', rating: 1, customer_segment: 'Gold' },
    { id: 'tr-6', date: '2023-10-30', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 5, sentiment: 'Neutral', category: 'Inventory', comment: 'Ok.', rating: 3, customer_segment: 'Gold' },
    { id: 'tr-7', date: '2023-10-31', store_name: 'Dubai Mall', brand_name: 'Nike', nps_score: 10, sentiment: 'Positive', category: 'Store Ambience', comment: 'Cool.', rating: 5, customer_segment: 'Gold' },

    // Adding 30 more random records to reach ~100
    ...Array.from({ length: 40 }).map((_, i) => ({
        id: `rand-${i}`,
        date: `2023-11-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`,
        store_name: ['Dubai Mall', 'City Center', 'Mall of Emirates'][Math.floor(Math.random() * 3)],
        brand_name: ['Nike', 'Adidas'][Math.floor(Math.random() * 2)],
        nps_score: Math.floor(Math.random() * 11),
        sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
        category: ['Staff Behavior', 'Product Quality', 'Billing Time', 'Store Ambience', 'Inventory'][Math.floor(Math.random() * 5)],
        comment: 'Randomly generated feedback for testing volume.',
        rating: Math.floor(Math.random() * 5) + 1,
        customer_segment: ['Gold', 'Silver', 'Bronze'][Math.floor(Math.random() * 3)]
    }))
];
