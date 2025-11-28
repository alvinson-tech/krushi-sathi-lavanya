import express from 'express';
import { 
    getAllEquipment,
    createEquipmentBooking,
    createLabourJob,
    getLabourJobsByFarmer,
    getApplicationsByJob,
    updateApplicationStatus
} from '../database.js';

const router = express.Router();

// Get all available equipment
router.get('/equipment', async (req, res) => {
    try {
        const equipment = getAllEquipment();
        res.json(equipment);
    } catch (error) {
        console.error('Get equipment error:', error);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
});

// Book equipment
router.post('/equipment/book', async (req, res) => {
    try {
        const bookingData = req.body;
        const result = createEquipmentBooking(bookingData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Book equipment error:', error);
        res.status(500).json({ error: 'Failed to book equipment' });
    }
});

// Post a labour job
router.post('/jobs', async (req, res) => {
    try {
        const jobData = req.body;
        const newJob = createLabourJob(jobData);
        res.status(201).json({ 
            message: 'Job posted successfully',
            job: newJob 
        });
    } catch (error) {
        console.error('Post job error:', error);
        res.status(500).json({ error: 'Failed to post job' });
    }
});

// Get farmer's job postings
router.get('/jobs/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        const jobs = getLabourJobsByFarmer(parseInt(farmerId));
        res.json(jobs);
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Get applications for a job
router.get('/applications/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = getApplicationsByJob(parseInt(jobId));
        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Accept an application
router.patch('/applications/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;
        updateApplicationStatus(parseInt(id), 'ACCEPTED');
        res.json({ message: 'Application accepted successfully' });
    } catch (error) {
        console.error('Accept application error:', error);
        res.status(500).json({ error: 'Failed to accept application' });
    }
});

// Reject an application
router.patch('/applications/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        updateApplicationStatus(parseInt(id), 'REJECTED');
        res.json({ message: 'Application rejected successfully' });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ error: 'Failed to reject application' });
    }
});

export default router;
