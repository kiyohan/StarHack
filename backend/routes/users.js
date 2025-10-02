const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware');

const User = require('../models/User');

// @route   PUT /api/users/rewards/redeem/:rewardId
// @desc    Mark a user's reward as redeemed
// @access  Private
router.put('/rewards/redeem/:rewardId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Find the specific reward in the user's rewards array
    const reward = user.rewards.id(req.params.rewardId);

    if (!reward) {
      return res.status(404).json({ msg: 'Reward not found' });
    }

    if (reward.redeemed) {
      return res.status(400).json({ msg: 'Reward has already been redeemed' });
    }

    // Mark as redeemed and save the user document
    reward.redeemed = true;
    await user.save();

    // Return the updated user object (without password)
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE for Leaderboard ---
// @route   GET /api/users/leaderboard
// @desc    Get top 10 users by streak
// @access  Private
router.get('/leaderboard', authMiddleware, async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .sort({ streak: -1 }) // Sort by streak, highest first
            .limit(10) // Get the top 10
            .select('username streak'); // Only select the fields we need

        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/users/preferences
// @desc    Update a user's task preferences
// @access  Private
router.put('/preferences', authMiddleware, async (req, res) => {
    const { preferredMental, preferredPhysical } = req.body;

    // Basic validation
    if (!preferredMental || !preferredPhysical) {
        return res.status(400).json({ msg: 'Please select one mental and one physical task.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the preferences and save
        user.preferences.preferredMental = preferredMental;
        user.preferences.preferredPhysical = preferredPhysical;
        await user.save();

        // Return the full, updated user object
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const { REWARDS_LIST } = require('../constants'); // <-- Import the rewards list

// @route   POST /api/users/rewards/claim
// @desc    Spend points to claim a new reward
// @access  Private
router.post('/rewards/claim', authMiddleware, async (req, res) => {
    const { rewardName } = req.body;

    try {
        // Find the reward in our hard-coded list to get its cost and description
        const rewardToClaim = REWARDS_LIST.find(r => r.name === rewardName);

        if (!rewardToClaim) {
            return res.status(404).json({ msg: 'Reward not found.' });
        }

        const user = await User.findById(req.user.id);

        // Check if user has enough points
        if (user.points < rewardToClaim.cost) {
            return res.status(400).json({ msg: 'You do not have enough points to claim this reward.' });
        }

        // Deduct points and add the new reward to the user's array
        user.points -= rewardToClaim.cost;
        user.rewards.push({
            name: rewardToClaim.name,
            description: rewardToClaim.description,
        });

        await user.save();

        // Return the full, updated user object
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;