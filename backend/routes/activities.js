const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authMiddleware = require('./middleware');

// --- Seeder Route to add default activities ---
// @route   POST /api/activities/seed
// @desc    (DEV) Create default activities in the DB
// @access  Public (for ease of setup)
router.post('/seed', async (req, res) => {
    const defaultActivities = [
        { name: 'Meditation', type: 'Mental', points: 45, duration: '15 min' },
        { name: 'Yoga', type: 'Mental', points: 50, duration: '20 min' },
        { name: 'Deep Breathing', type: 'Mental', points: 30, duration: '5 min' },
        { name: 'Jogging', type: 'Physical', points: 45, duration: '15 min' },
        { name: 'Stretching', type: 'Physical', points: 35, duration: '10 min' },
        { name: 'Push-ups', type: 'Physical', points: 55, duration: '10 min' },
    ];
    try {
        await Activity.deleteMany({}); // Clear existing activities to prevent duplicates
        await Activity.insertMany(defaultActivities);
        res.status(201).send('Default activities created successfully!');
    } catch (err) {
        res.status(500).json({ msg: 'Server error during seeding', error: err.message });
    }
});

// --- Route to get all activities ---
// @route   GET /api/activities
// @desc    Get all available activities
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const activities = await Activity.find({});
        res.json(activities);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;