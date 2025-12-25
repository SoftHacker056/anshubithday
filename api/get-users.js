// ============================================
// VERCEL SERVERLESS FUNCTION
// Get All Users from Neon PostgreSQL
// GET /api/get-users
// ============================================

import { getNeonClient } from './db.js';

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
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed',
            message: 'Only GET requests are allowed'
        });
    }
    
    try {
        // Get Neon client using reusable function
        const sql = getNeonClient();
        
        // Fetch all users, ordered by most recent first
        // Limit to 100 for performance
        const users = await sql`
            SELECT 
                id,
                name,
                device,
                latitude,
                longitude,
                visit_time,
                created_at
            FROM users
            ORDER BY visit_time DESC
            LIMIT 100
        `;
        
        return res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });
        
    } catch (error) {
        console.error('Error fetching users:', error);
        
        // If table doesn't exist, return empty array (graceful handling)
        if (error.message && error.message.includes('does not exist')) {
            return res.status(200).json({
                success: true,
                count: 0,
                users: [],
                message: 'Table does not exist yet. Save a user first!'
            });
        }
        
        // Handle database configuration errors
        if (error.message && error.message.includes('DATABASE_URL')) {
            return res.status(500).json({
                success: false,
                error: 'Database configuration error',
                message: error.message
            });
        }
        
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch users',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
