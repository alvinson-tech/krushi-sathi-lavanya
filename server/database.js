import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'krushi-sathi.db');

let db = null;

// Initialize database
export async function initDatabase() {
    const SQL = await initSqlJs();
    
    // Check if database file exists
    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
        console.log('✓ Database loaded from file');
    } else {
        db = new SQL.Database();
        console.log('✓ New database created');
        
        // Create tables
        createTables();
        
        // Save to file
        saveDatabase();
    }
    
    return db;
}

// Create database tables
function createTables() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('FARMER', 'SELLER', 'LABOURER')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Equipment table
    db.run(`
        CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            price_per_day REAL NOT NULL,
            owner_id INTEGER,
            available BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
        )
    `);
    
    // Labour requests table
    db.run(`
        CREATE TABLE IF NOT EXISTS labour_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            job_description TEXT NOT NULL,
            wage REAL NOT NULL,
            duration TEXT,
            status TEXT DEFAULT 'OPEN',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES users(id)
        )
    `);
    
    // Market prices table
    db.run(`
        CREATE TABLE IF NOT EXISTS market_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT NOT NULL,
            price REAL NOT NULL,
            unit TEXT NOT NULL,
            market_location TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Admin credentials table
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Insert default admin user (username: admin, password: admin123)
    db.run(`
        INSERT INTO admin_users (username, password) 
        VALUES ('admin', 'admin123')
    `);
    
    console.log('✓ Database tables created');
}

// Save database to file
export function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// Get database instance
export function getDatabase() {
    return db;
}

// User operations
export function createUser(name, email, password, role) {
    try {
        const stmt = db.prepare(`
            INSERT INTO users (name, email, password, role) 
            VALUES (?, ?, ?, ?)
        `);
        stmt.run([name, email, password, role]);
        stmt.free();
        saveDatabase();
        
        // Get the created user
        const result = db.exec(`SELECT * FROM users WHERE email = ?`, [email]);
        if (result.length > 0) {
            const columns = result[0].columns;
            const values = result[0].values[0];
            return columns.reduce((obj, col, idx) => {
                obj[col] = values[idx];
                return obj;
            }, {});
        }
        return null;
    } catch (error) {
        throw error;
    }
}

export function getUserByEmail(email) {
    const result = db.exec(`SELECT * FROM users WHERE email = ?`, [email]);
    if (result.length > 0) {
        const columns = result[0].columns;
        const values = result[0].values[0];
        return columns.reduce((obj, col, idx) => {
            obj[col] = values[idx];
            return obj;
        }, {});
    }
    return null;
}

export function getAllUsers() {
    const result = db.exec(`SELECT id, name, email, role, created_at FROM users`);
    if (result.length > 0) {
        const columns = result[0].columns;
        return result[0].values.map(values => {
            return columns.reduce((obj, col, idx) => {
                obj[col] = values[idx];
                return obj;
            }, {});
        });
    }
    return [];
}

// Admin operations
export function verifyAdmin(username, password) {
    const result = db.exec(`SELECT * FROM admin_users WHERE username = ? AND password = ?`, [username, password]);
    return result.length > 0;
}

// Get all records from all tables
export function getAllRecords() {
    const tables = ['users', 'equipment', 'labour_requests', 'market_prices'];
    const records = {};
    
    tables.forEach(table => {
        const result = db.exec(`SELECT * FROM ${table}`);
        if (result.length > 0) {
            const columns = result[0].columns;
            records[table] = result[0].values.map(values => {
                return columns.reduce((obj, col, idx) => {
                    obj[col] = values[idx];
                    return obj;
                }, {});
            });
        } else {
            records[table] = [];
        }
    });
    
    return records;
}

// Delete record from any table
export function deleteRecord(tableName, recordId) {
    try {
        // Validate table name to prevent SQL injection
        const validTables = ['users', 'equipment', 'labour_requests', 'market_prices'];
        if (!validTables.includes(tableName)) {
            throw new Error('Invalid table name');
        }
        
        const stmt = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`);
        stmt.run([recordId]);
        stmt.free();
        saveDatabase();
        
        return { success: true, message: 'Record deleted successfully' };
    } catch (error) {
        throw error;
    }
}
