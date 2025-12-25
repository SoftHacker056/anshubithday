// ============================================
// VERCEL SERVERLESS FUNCTION
// Save Photo API Endpoint
// Educational / Demo Purpose Only
// ============================================

// In-memory storage for demo (in production, use a database)
// Note: This resets on serverless function restart
// For persistence, use Vercel KV, MongoDB, or similar
let photoStorage = [];

// Vercel serverless function handler
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { image, timestamp, location, device } = req.body;
        
        // Validate required fields
        if (!image || !timestamp) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Create photo record
        const photoRecord = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
            image: image, // Base64 encoded image
            timestamp: timestamp,
            visitTime: new Date(timestamp).toLocaleString(),
            location: location || null,
            device: device || {},
            createdAt: new Date().toISOString()
        };
        
        // In production, save to database (e.g., MongoDB, PostgreSQL, etc.)
        // For demo: store in memory (will be lost on function restart)
        photoStorage.push(photoRecord);
        
        // Also save to localStorage equivalent (for persistence across requests)
        // Note: In Vercel, you'd use a database or file storage
        // This is a simplified demo version
        
        console.log('Photo saved:', photoRecord.id);
        
        return res.status(200).json({
            success: true,
            message: 'Photo saved successfully',
            photoId: photoRecord.id
        });
        
    } catch (error) {
        console.error('Error saving photo:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

// Note: In production, use a shared database (MongoDB, PostgreSQL, etc.)
// For Vercel, consider using Vercel KV or a database service
