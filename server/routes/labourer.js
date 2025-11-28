import express from 'express';
import { 
    getAllLabourJobs,
    createJobApplication,
    getApplicationsByLabourer,
    createLabourerProfile,
    getLabourerProfile,
    updateLabourerProfile
} from '../database.js';

const router = express.Router();

// Get all available jobs
router.get('/jobs', async (req, res) => {
    try {
        const jobs = getAllLabourJobs();
        res.json(jobs);
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Get jobs by skill
router.get('/jobs/skill/:skill', async (req, res) => {
    try {
        const { skill } = req.params;
        const allJobs = getAllLabourJobs();
        const filteredJobs = allJobs.filter(job => 
            job.skill_required.toLowerCase() === skill.toLowerCase()
        );
        res.json(filteredJobs);
    } catch (error) {
        console.error('Get jobs by skill error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Apply for a job
router.post('/apply/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { labourer_id, message } = req.body;
        
        const result = createJobApplication({
            job_id: parseInt(jobId),
            labourer_id,
            message
        });
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Apply for job error:', error);
        res.status(500).json({ error: 'Failed to apply for job' });
    }
});

// Get all applications for a labourer
router.get('/applications/:labourerId', async (req, res) => {
    try {
        const { labourerId } = req.params;
        const applications = getApplicationsByLabourer(parseInt(labourerId));
        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Create or update labourer profile
router.post('/profile', async (req, res) => {
    try {
        const profileData = req.body;
        const existingProfile = getLabourerProfile(profileData.user_id);
        
        if (existingProfile) {
            // Update existing profile
            updateLabourerProfile(profileData.user_id, profileData);
            res.json({ message: 'Profile updated successfully' });
        } else {
            // Create new profile
            const result = createLabourerProfile(profileData);
            res.status(201).json(result);
        }
    } catch (error) {
        console.error('Profile operation error:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

// Get labourer profile
router.get('/profile/:labourerId', async (req, res) => {
    try {
        const { labourerId } = req.params;
        const profile = getLabourerProfile(parseInt(labourerId));
        
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

export default router;
