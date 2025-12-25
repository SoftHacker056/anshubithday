// ============================================
// NEON DATABASE CLIENT - REUSABLE
// Server-side only - NEVER import in frontend
// ============================================

import { neon } from '@neondatabase/serverless';

// Get database URL from environment variable
// This should be set in Vercel dashboard: Settings > Environment Variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL environment variable is not set');
}

/**
 * Get Neon SQL client instance
 * Uses connection pooling automatically with Neon serverless driver
 * 
 * @returns {Function} Neon SQL client function
 * @throws {Error} If DATABASE_URL is not set
 */
export function getNeonClient() {
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set. Please configure it in Vercel dashboard.');
    }
    
    // Create Neon client with connection pooling
    // The @neondatabase/serverless package automatically handles pooling
    const sql = neon(databaseUrl);
    
    return sql;
}

/**
 * Test database connection
 * 
 * @returns {Promise<Object>} Connection test result
 */
export async function testConnection() {
    try {
        const sql = getNeonClient();
        const result = await sql`SELECT version() as version, current_database() as database, current_user as user`;
        
        return {
            success: true,
            version: result[0]?.version || 'Unknown',
            database: result[0]?.database || 'Unknown',
            user: result[0]?.user || 'Unknown'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            details: error.toString()
        };
    }
}

