const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware');
const JournalEntry = require('../models/JournalEntry');
const User = require('../models/User');
const Activity = require('../models/Activity'); // We need this now
const Task = require('../models/Task'); // And this for logging

// @route   POST /api/journal
// @desc    Create a new journal entry AND complete the 'Journal' task
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ msg: 'Content cannot be empty' });
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const taskType = 'Journal'; // Hard-code the task type

    if (!user) {
        return res.status(404).json({ msg: 'User not found.' });
    }

    // --- TASK COMPLETION LOGIC IS NOW HERE ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.dailyTasks && user.dailyTasks[taskType]) {
        const lastCompletionForTask = new Date(user.dailyTasks[taskType]);
        lastCompletionForTask.setHours(0, 0, 0, 0);
        if (lastCompletionForTask.getTime() === today.getTime()) {
            return res.status(400).json({ msg: `You have already completed '${taskType}' today.` });
        }
    }
    
    // --- Save the new journal entry ---
    const newEntry = new JournalEntry({ userId, content });
    await newEntry.save();

    // --- Now, update the user stats ---
    const activity = await Activity.findOne({ name: taskType });
    const pointsToEarn = activity ? activity.points : 45; // Fallback to 45

    // Streak Logic
    const lastCompletion = user.lastTaskCompletionDate ? new Date(user.lastTaskCompletionDate) : null;
    if (lastCompletion) lastCompletion.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (lastCompletion && lastCompletion.getTime() === yesterday.getTime()) {
        user.streak += 1;
    } else if (!lastCompletion || lastCompletion.getTime() < yesterday.getTime()) {
        user.streak = 1;
    }

    user.points += pointsToEarn;
    user.lastTaskCompletionDate = new Date();
    if (!user.dailyTasks) user.dailyTasks = {};
    user.dailyTasks[taskType] = new Date();
    
    // Log the task completion
    const newTaskLog = new Task({ userId, taskType, pointsEarned: pointsToEarn });
    await newTaskLog.save();

    // Save all changes to the user
    await user.save();
    
    // Return the updated user object so the frontend can update its state
    const updatedUser = await User.findById(userId).select('-password');
    res.status(201).json({ updatedUser, newEntry });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/journal
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all entries for the logged-in user and sort by newest first
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... (keep all the existing code in journal.js)

// @route   PUT /api/journal/upvote/:id
// @desc    Upvote or remove upvote from a journal entry
// @access  Private
router.put('/upvote/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Journal entry not found' });
    }

    // Check if the user has already upvoted this post
    const isUpvoted = entry.upvotes.some(
      (upvote) => upvote.toString() === req.user.id
    );

    if (isUpvoted) {
      // User has already upvoted, so remove the upvote (downvote)
      entry.upvotes = entry.upvotes.filter(
        (upvote) => upvote.toString() !== req.user.id
      );
    } else {
      // User has not upvoted, so add the upvote
      entry.upvotes.push(req.user.id);
    }

    await entry.save();
    res.json(entry);

  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Journal entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE for Community Feed ---
// @route   GET /api/journal/community
// @desc    Get all journal entries for the community feed (anonymized)
// @access  Private
router.get('/community', authMiddleware, async (req, res) => {
    try {
        // Fetch latest 50 entries, populate author info but only get the username
        const entries = await JournalEntry.find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('userId', 'username'); // Fetch the username of the author

        // Anonymize the usernames
        const anonymizedEntries = entries.map(entry => {
            // A simple way to create a fun anonymous name
            const anonymousName = `User-${entry.userId._id.toString().slice(-4)}`;
            return {
                _id: entry._id,
                content: entry.content,
                upvotes: entry.upvotes,
                createdAt: entry.createdAt,
                // Replace the original author info with an anonymous one
                author: { anonymousName }
            };
        });
        
        res.json(anonymizedEntries);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;