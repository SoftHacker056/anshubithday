// ============================================
// VERCEL SERVERLESS FUNCTION
// Save User to Neon PostgreSQL
// POST /api/save-user
// ============================================

import { getNeonClient } from './db.js';

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
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed',
            message: 'Only POST requests are allowed'
        });
    }
    
    try {
        // Log request for debugging
        console.log('Save user request received:', {
            method: req.method,
            hasBody: !!req.body,
            bodyKeys: req.body ? Object.keys(req.body) : []
        });
        
        // Get data from request body
        const { name, device, latitude, longitude, visit_time } = req.body;
        
        console.log('Parsed request data:', { name, device, latitude, longitude, visit_time });
        
        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Validation error',
                message: 'Name is required and must be a non-empty string'
            });
        }
        
        // Get Neon client using reusable function
        const sql = getNeonClient();
        
        // Create table if it doesn't exist
        // Using IF NOT EXISTS to avoid errors on subsequent calls
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                device VARCHAR(255),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        // Insert user data with parameterized query (prevents SQL injection)
        const result = await sql`
            INSERT INTO users (name, device, latitude, longitude, visit_time)
            VALUES (
                ${name.trim()}, 
                ${device || null}, 
                ${latitude ? parseFloat(latitude) : null}, 
                ${longitude ? parseFloat(longitude) : null}, 
                ${visit_time ? new Date(visit_time) : new Date()}
            )
            RETURNING id, name, device, latitude, longitude, visit_time, created_at
        `;
        
        if (!result || result.length === 0) {
            throw new Error('Failed to insert user - no data returned');
        }
        
        return res.status(200).json({
            success: true,
            message: 'User saved successfully to Neon database',
            user: result[0]
        });
        
    } catch (error) {
        console.error('Error saving user:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Handle specific database errors
        if (error.message && error.message.includes('DATABASE_URL')) {
            return res.status(500).json({
                success: false,
                error: 'Database configuration error',
                message: error.message,
                hint: 'Please set DATABASE_URL in Vercel environment variables'
            });
        }
        
        // Handle connection errors
        if (error.message && (error.message.includes('connection') || error.message.includes('ECONNREFUSED'))) {
            return res.status(500).json({
                success: false,
                error: 'Database connection failed',
                message: error.message,
                hint: 'Check your DATABASE_URL and network connection'
            });
        }
        
        return res.status(500).json({
            success: false,
            error: 'Failed to save user',
            message: error.message || 'Unknown error occurred',
            errorType: error.name || 'Error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
