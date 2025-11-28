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
    
    // Equipment table (updated for seller functionality)
    db.run(`
        CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            unit TEXT NOT NULL,
            owner_id INTEGER NOT NULL,
            image_url TEXT,
            availability TEXT,
            rating REAL DEFAULT 0,
            bookings INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id)
        )
    `);
    
    // Labour jobs table (updated from labour_requests)
    db.run(`
        CREATE TABLE IF NOT EXISTS labour_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            skill_required TEXT NOT NULL,
            description TEXT,
            wage REAL NOT NULL,
            duration TEXT,
            location TEXT,
            status TEXT DEFAULT 'OPEN',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES users(id)
        )
    `);
    
    // Job applications table
    db.run(`
        CREATE TABLE IF NOT EXISTS job_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER NOT NULL,
            labourer_id INTEGER NOT NULL,
            status TEXT DEFAULT 'PENDING',
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES labour_jobs(id),
            FOREIGN KEY (labourer_id) REFERENCES users(id)
        )
    `);
    
    // Equipment bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS equipment_bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER NOT NULL,
            farmer_id INTEGER NOT NULL,
            seller_id INTEGER NOT NULL,
            slot TEXT NOT NULL,
            price REAL NOT NULL,
            status TEXT DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (equipment_id) REFERENCES equipment(id),
            FOREIGN KEY (farmer_id) REFERENCES users(id),
            FOREIGN KEY (seller_id) REFERENCES users(id)
        )
    `);
    
    // Labourer profiles table
    db.run(`
        CREATE TABLE IF NOT EXISTS labourer_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            skills TEXT NOT NULL,
            experience_years INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            hourly_rate REAL,
            location TEXT,
            phone TEXT,
            availability TEXT DEFAULT 'Available',
            completed_jobs INTEGER DEFAULT 0,
            languages TEXT,
            bio TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
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
    const tables = ['users', 'equipment', 'labour_jobs', 'job_applications', 'equipment_bookings', 'labourer_profiles', 'market_prices'];
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
        const validTables = ['users', 'equipment', 'labour_jobs', 'job_applications', 'equipment_bookings', 'labourer_profiles', 'market_prices'];
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
// Equipment CRUD operations
export function createEquipment(equipmentData) {
    try {
        const { name, category, description, price, unit, owner_id, image_url, availability, status } = equipmentData;
        const stmt = db.prepare(`
            INSERT INTO equipment (name, category, description, price, unit, owner_id, image_url, availability, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run([name, category, description || '', price, unit, owner_id, image_url || '', availability || 'Available now', status || 'Available']);
        stmt.free();
        saveDatabase();
        
        const result = db.exec(`SELECT * FROM equipment WHERE id = (SELECT MAX(id) FROM equipment)`);
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

export function getEquipmentBySeller(sellerId) {
    const result = db.exec(`SELECT * FROM equipment WHERE owner_id = ? ORDER BY created_at DESC`, [sellerId]);
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

export function getAllEquipment() {
    const result = db.exec(`SELECT * FROM equipment WHERE status != 'Paused' ORDER BY created_at DESC`);
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

export function updateEquipment(id, updates) {
    try {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const stmt = db.prepare(`UPDATE equipment SET ${fields} WHERE id = ?`);
        stmt.run([...values, id]);
        stmt.free();
        saveDatabase();
        return { success: true };
    } catch (error) {
        throw error;
    }
}

// Labour jobs CRUD operations
export function createLabourJob(jobData) {
    try {
        const { farmer_id, title, skill_required, description, wage, duration, location } = jobData;
        const stmt = db.prepare(`
            INSERT INTO labour_jobs (farmer_id, title, skill_required, description, wage, duration, location) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run([farmer_id, title, skill_required, description || '', wage, duration || '', location || '']);
        stmt.free();
        saveDatabase();
        
        const result = db.exec(`SELECT * FROM labour_jobs WHERE id = (SELECT MAX(id) FROM labour_jobs)`);
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

export function getAllLabourJobs() {
    const result = db.exec(`SELECT * FROM labour_jobs WHERE status = 'OPEN' ORDER BY created_at DESC`);
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

export function getLabourJobsByFarmer(farmerId) {
    const result = db.exec(`SELECT * FROM labour_jobs WHERE farmer_id = ? ORDER BY created_at DESC`, [farmerId]);
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

// Job applications CRUD operations
export function createJobApplication(applicationData) {
    try {
        const { job_id, labourer_id, message } = applicationData;
        const stmt = db.prepare(`
            INSERT INTO job_applications (job_id, labourer_id, message) 
            VALUES (?, ?, ?)
        `);
        stmt.run([job_id, labourer_id, message || '']);
        stmt.free();
        saveDatabase();
        return { success: true, message: 'Application submitted successfully' };
    } catch (error) {
        throw error;
    }
}

export function getApplicationsByLabourer(labourerId) {
    const result = db.exec(`
        SELECT ja.*, lj.title, lj.wage, lj.location, lj.skill_required 
        FROM job_applications ja 
        JOIN labour_jobs lj ON ja.job_id = lj.id 
        WHERE ja.labourer_id = ? 
        ORDER BY ja.created_at DESC
    `, [labourerId]);
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

export function getApplicationsByJob(jobId) {
    const result = db.exec(`
        SELECT ja.*, u.name as labourer_name, u.email 
        FROM job_applications ja 
        JOIN users u ON ja.labourer_id = u.id 
        WHERE ja.job_id = ? 
        ORDER BY ja.created_at DESC
    `, [jobId]);
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

export function updateApplicationStatus(id, status) {
    try {
        const stmt = db.prepare(`UPDATE job_applications SET status = ? WHERE id = ?`);
        stmt.run([status, id]);
        stmt.free();
        saveDatabase();
        return { success: true };
    } catch (error) {
        throw error;
    }
}

// Equipment bookings CRUD operations
export function createEquipmentBooking(bookingData) {
    try {
        const { equipment_id, farmer_id, seller_id, slot, price } = bookingData;
        const stmt = db.prepare(`
            INSERT INTO equipment_bookings (equipment_id, farmer_id, seller_id, slot, price) 
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run([equipment_id, farmer_id, seller_id, slot, price]);
        stmt.free();
        saveDatabase();
        return { success: true, message: 'Booking request sent successfully' };
    } catch (error) {
        throw error;
    }
}

export function getBookingsBySeller(sellerId) {
    const result = db.exec(`
        SELECT eb.*, e.name as equipment_name, u.name as farmer_name, u.email as farmer_email 
        FROM equipment_bookings eb 
        JOIN equipment e ON eb.equipment_id = e.id 
        JOIN users u ON eb.farmer_id = u.id 
        WHERE eb.seller_id = ? 
        ORDER BY eb.created_at DESC
    `, [sellerId]);
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

export function updateBookingStatus(id, status) {
    try {
        const stmt = db.prepare(`UPDATE equipment_bookings SET status = ? WHERE id = ?`);
        stmt.run([status, id]);
        stmt.free();
        saveDatabase();
        return { success: true };
    } catch (error) {
        throw error;
    }
}

// Labourer profile CRUD operations
export function createLabourerProfile(profileData) {
    try {
        const { user_id, skills, experience_years, hourly_rate, location, phone, languages, bio } = profileData;
        const stmt = db.prepare(`
            INSERT INTO labourer_profiles (user_id, skills, experience_years, hourly_rate, location, phone, languages, bio) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run([
            user_id, 
            JSON.stringify(skills), 
            experience_years || 0, 
            hourly_rate || 0, 
            location || '', 
            phone || '', 
            JSON.stringify(languages || []), 
            bio || ''
        ]);
        stmt.free();
        saveDatabase();
        return { success: true, message: 'Profile created successfully' };
    } catch (error) {
        throw error;
    }
}

export function getLabourerProfile(userId) {
    const result = db.exec(`SELECT * FROM labourer_profiles WHERE user_id = ?`, [userId]);
    if (result.length > 0) {
        const columns = result[0].columns;
        const values = result[0].values[0];
        const profile = columns.reduce((obj, col, idx) => {
            obj[col] = values[idx];
            return obj;
        }, {});
        
        // Parse JSON fields
        if (profile.skills) profile.skills = JSON.parse(profile.skills);
        if (profile.languages) profile.languages = JSON.parse(profile.languages);
        
        return profile;
    }
    return null;
}

export function updateLabourerProfile(userId, updates) {
    try {
        // Convert arrays to JSON strings
        if (updates.skills) updates.skills = JSON.stringify(updates.skills);
        if (updates.languages) updates.languages = JSON.stringify(updates.languages);
        
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        const stmt = db.prepare(`UPDATE labourer_profiles SET ${fields} WHERE user_id = ?`);
        stmt.run([...values, userId]);
        stmt.free();
        saveDatabase();
        return { success: true };
    } catch (error) {
        throw error;
    }
}
