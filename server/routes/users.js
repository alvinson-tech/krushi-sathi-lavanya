import express from 'express';
import { createUser, getUserByEmail } from '../database.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                error: 'All fields are required' 
            });
        }
        
        // Check if user already exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'An account with this email already exists.' 
            });
        }
        
        // Create user
        const newUser = createUser(name, email, password, role);
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Failed to register user' 
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }
        
        // Find user
        const user = getUserByEmail(email);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ 
                error: 'Invalid email or password.' 
            });
        }
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({ 
            message: 'Login successful',
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Failed to login' 
        });
    }
});

export default router;
