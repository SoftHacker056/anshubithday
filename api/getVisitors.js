// ============================================
// VERCEL SERVERLESS FUNCTION
// Get Visitors & Photos API Endpoint
// Admin-only access
// Educational / Demo Purpose Only
// ============================================

// Note: In production, query from database
// For demo, photos are stored client-side in localStorage
// Serverless functions are stateless, so we rely on client storage

// Vercel serverless function handler
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // In production, add authentication check here
        // For demo: basic check via query parameter
        const adminKey = req.query.key;
        const expectedKey = 'kimiry@123'; // In production, use environment variable
        
        if (adminKey !== expectedKey) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }
        
        // Get visitor data from localStorage (passed from client)
        // In production, fetch from database
        const visitorsData = req.query.visitors || '[]';
        let visitors = [];
        
        try {
            visitors = JSON.parse(visitorsData);
        } catch (e) {
            console.error('Error parsing visitors data:', e);
        }
        
        // Get photos from request (client sends from localStorage)
        // In production, fetch from database
        const photosData = req.query.photos || '[]';
        let photos = [];
        
        try {
            photos = JSON.parse(photosData);
        } catch (e) {
            console.error('Error parsing photos data:', e);
        }
        
        return res.status(200).json({
            success: true,
            visitors: visitors,
            photos: photos,
            totalVisitors: visitors.length,
            totalPhotos: photos.length
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
