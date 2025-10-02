const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware');

// Bring in models
const User = require('../models/User');
const Task = require('../models/Task');

const Activity = require('../models/Activity');


// in backend/routes/tasks.js

// @route   POST /api/tasks/complete
// @desc    Log a completed task and update user stats
// @access  Private
router.post('/complete', authMiddleware, async (req, res) => {
  const { taskType } = req.body;

  // Instead of a hard-coded array, check if the task exists in the database.
    const activity = await Activity.findOne({ name: taskType });
    if (!activity) {
      return res.status(400).json({ msg: 'Invalid task type provided.' });
    }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // --- FIX: Declare and normalize 'today' ONCE at the top ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    // --- END OF FIX ---

    // Check if this specific task was already completed today
    if (user.dailyTasks && user.dailyTasks[taskType]) {
      const lastCompletionForTask = new Date(user.dailyTasks[taskType]);
      lastCompletionForTask.setHours(0, 0, 0, 0);

      if (lastCompletionForTask.getTime() === today.getTime()) {
        return res.status(400).json({ msg: `You have already completed '${taskType}' today.` });
      }
    }

    const pointsToEarn = activity.points;

    // --- Streak Logic (now uses the 'today' variable from above) ---
    const lastCompletion = user.lastTaskCompletionDate ? new Date(user.lastTaskCompletionDate) : null;
    if (lastCompletion) {
        lastCompletion.setHours(0, 0, 0, 0);
    }

    const yesterday = new Date(today); // Uses 'today'
    yesterday.setDate(today.getDate() - 1);
    
    if (lastCompletion && lastCompletion.getTime() === yesterday.getTime()) {
      user.streak += 1;
    } else if (!lastCompletion || lastCompletion.getTime() < yesterday.getTime()) {
      user.streak = 1;
    }
    
    // --- Update User Stats ---
    user.points += pointsToEarn;
    user.lastTaskCompletionDate = new Date();
    if (!user.dailyTasks) user.dailyTasks = {};
    user.dailyTasks[taskType] = new Date();

    // --- Log the Task ---
    const newTaskLog = new Task({
      userId,
      taskType,
      pointsEarned: pointsToEarn,
    });

    await newTaskLog.save();
    await user.save();

    const updatedUser = await User.findById(userId).select('-password');
    res.json(updatedUser);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;