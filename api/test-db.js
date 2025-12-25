// ============================================
// VERCEL SERVERLESS FUNCTION
// Test Neon PostgreSQL Connection
// GET /api/test-db
// ============================================

import { getNeonClient, testConnection } from './db.js';

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
        // Test database connection using reusable client
        const result = await testConnection();
        
        if (result.success) {
            return res.status(200).json({
                success: true,
                status: 'connected',
                version: result.version,
                database: result.database,
                user: result.user,
                message: 'Successfully connected to Neon PostgreSQL!'
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Database connection failed',
                message: result.error,
                details: result.details
            });
        }
        
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(500).json({
            success: false,
            error: 'Database connection failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
