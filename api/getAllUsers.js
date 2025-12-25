// ============================================
// VERCEL SERVERLESS FUNCTION
// Get All Users API Endpoint
// Admin-only access
// Educational / Demo Purpose Only
// ============================================

// Note: In production, query from database
// For demo, users are stored client-side in localStorage
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
        
        // Get user data from request (client sends from localStorage)
        // In production, fetch from database
        const usersData = req.query.users || '[]';
        let users = [];
        
        try {
            users = JSON.parse(usersData);
        } catch (e) {
            console.error('Error parsing users data:', e);
        }
        
        // Separate users by access type
        const mainSiteUsers = users.filter(u => u.accessType === 'Main Site (Anshu)');
        const birthdaySiteUsers = users.filter(u => u.accessType === 'Birthday Site');
        
        return res.status(200).json({
            success: true,
            allUsers: users,
            mainSiteUsers: mainSiteUsers,
            birthdaySiteUsers: birthdaySiteUsers,
            totalUsers: users.length,
            totalMainSite: mainSiteUsers.length,
            totalBirthdaySite: birthdaySiteUsers.length
        });
        
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
