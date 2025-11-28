import express from 'express';
import { verifyAdmin, getAllRecords, deleteRecord } from '../database.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }
        
        const isValid = verifyAdmin(username, password);
        
        if (!isValid) {
            return res.status(401).json({ 
                error: 'Invalid admin credentials' 
            });
        }
        
        res.json({ 
            message: 'Admin login successful',
            admin: { username }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            error: 'Failed to login' 
        });
    }
});

// Get all database records (protected route)
router.post('/records', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Verify admin credentials
        const isValid = verifyAdmin(username, password);
        
        if (!isValid) {
            return res.status(401).json({ 
                error: 'Unauthorized access' 
            });
        }
        
        const records = getAllRecords();
        res.json(records);
    } catch (error) {
        console.error('Get records error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch records' 
        });
    }
});

// Delete a record (protected route)
router.post('/delete', async (req, res) => {
    try {
        const { username, password, tableName, recordId } = req.body;
        
        // Verify admin credentials
        const isValid = verifyAdmin(username, password);
        
        if (!isValid) {
            return res.status(401).json({ 
                error: 'Unauthorized access' 
            });
        }
        
        if (!tableName || !recordId) {
            return res.status(400).json({ 
                error: 'Table name and record ID are required' 
            });
        }
        
        const result = deleteRecord(tableName, recordId);
        res.json(result);
    } catch (error) {
        console.error('Delete record error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to delete record' 
        });
    }
});

export default router;
