import express from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();
console.log('✓ Database initialized');

// Routes
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Krushi Sathi API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Krushi Sathi Backend Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`\n✓ Ready to accept requests\n`);
});
