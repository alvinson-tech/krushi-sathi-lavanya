import express from 'express';
import { 
    createEquipment, 
    getEquipmentBySeller, 
    updateEquipment,
    getBookingsBySeller,
    updateBookingStatus
} from '../database.js';

const router = express.Router();

// Get all equipment for a seller
router.get('/equipment/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        const equipment = getEquipmentBySeller(parseInt(sellerId));
        res.json(equipment);
    } catch (error) {
        console.error('Get equipment error:', error);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
});

// Add new equipment
router.post('/equipment', async (req, res) => {
    try {
        const equipmentData = req.body;
        const newEquipment = createEquipment(equipmentData);
        res.status(201).json({ 
            message: 'Equipment added successfully',
            equipment: newEquipment 
        });
    } catch (error) {
        console.error('Add equipment error:', error);
        res.status(500).json({ error: 'Failed to add equipment' });
    }
});

// Update equipment
router.put('/equipment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        updateEquipment(parseInt(id), updates);
        res.json({ message: 'Equipment updated successfully' });
    } catch (error) {
        console.error('Update equipment error:', error);
        res.status(500).json({ error: 'Failed to update equipment' });
    }
});

// Update equipment status (pause/resume)
router.patch('/equipment/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        updateEquipment(parseInt(id), { status });
        res.json({ message: 'Equipment status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Get all booking requests for a seller
router.get('/bookings/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        const bookings = getBookingsBySeller(parseInt(sellerId));
        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Accept a booking
router.patch('/bookings/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;
        updateBookingStatus(parseInt(id), 'ACCEPTED');
        res.json({ message: 'Booking accepted successfully' });
    } catch (error) {
        console.error('Accept booking error:', error);
        res.status(500).json({ error: 'Failed to accept booking' });
    }
});

// Reject a booking
router.patch('/bookings/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        updateBookingStatus(parseInt(id), 'REJECTED');
        res.json({ message: 'Booking rejected successfully' });
    } catch (error) {
        console.error('Reject booking error:', error);
        res.status(500).json({ error: 'Failed to reject booking' });
    }
});

export default router;
