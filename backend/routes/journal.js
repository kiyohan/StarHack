const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware');

// Bring in the JournalEntry model
const JournalEntry = require('../models/JournalEntry');
const User = require('../models/User'); // We need User for the task completion logic

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ msg: 'Content cannot be empty' });
  }

  try {
    // --- NEW: Check if Journal task was already completed today ---
    const user = await User.findById(req.user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.dailyTasks && user.dailyTasks.Journal) {
    const lastCompletionForTask = new Date(user.dailyTasks.Journal);
    lastCompletionForTask.setHours(0, 0, 0, 0);

    if (lastCompletionForTask.getTime() === today.getTime()) {
        return res.status(400).json({ msg: "You have already completed your journal entry for today." });
    }
    }

    const newEntry = new JournalEntry({
      userId: req.user.id,
      content,
    });

    const entry = await newEntry.save();

    // Optional: You can also trigger the task completion logic here
    // This is a good place to ensure journaling also updates points/streaks
    // For simplicity, we'll assume the frontend calls /api/tasks/complete separately
    // but in a real app, you might bundle this logic here.

    res.json(entry);
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