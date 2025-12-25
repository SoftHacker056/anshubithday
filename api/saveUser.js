// ============================================
// VERCEL SERVERLESS FUNCTION
// Save User API Endpoint with Neon PostgreSQL
// ============================================

import { neon } from '@neondatabase/serverless';

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
        const { name, accessType, visitTime, visitDate, location, device, birthDate, targetDate, timestamp } = req.body;
        
        // Validate required fields
        if (!name || !accessType) {
            return res.status(400).json({ error: 'Missing required fields: name and accessType are required' });
        }
        
        // Get database URL from environment variable
        const databaseUrl = process.env.DATABASE_URL;
        
        if (!databaseUrl) {
            // Fallback to localStorage if no database URL
            return res.status(200).json({
                success: true,
                message: 'User data saved locally (DATABASE_URL not set)',
                userId: Date.now().toString()
            });
        }
        
        // Create Neon client
        const sql = neon(databaseUrl);
        
        // Create table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS website_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                access_type VARCHAR(100),
                visit_time VARCHAR(255),
                visit_date TIMESTAMP,
                location JSONB,
                device JSONB,
                birth_date DATE,
                target_date TIMESTAMP,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        // Insert user data
        const result = await sql`
            INSERT INTO website_users (name, access_type, visit_time, visit_date, location, device, birth_date, target_date, timestamp)
            VALUES (
                ${name}, 
                ${accessType}, 
                ${visitTime || new Date().toLocaleString()}, 
                ${visitDate ? new Date(visitDate) : new Date()}, 
                ${location ? JSON.stringify(location) : null}, 
                ${device ? JSON.stringify(device) : null}, 
                ${birthDate ? new Date(birthDate) : null}, 
                ${targetDate ? new Date(targetDate) : null}, 
                ${timestamp ? new Date(timestamp) : new Date()}
            )
            RETURNING id, name, access_type, created_at
        `;
        
        return res.status(200).json({
            success: true,
            message: 'User saved successfully to Neon database',
            userId: result[0].id,
            user: result[0]
        });
        
    } catch (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
