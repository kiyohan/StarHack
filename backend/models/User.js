const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- NEW: Define a schema for individual rewards ---
const rewardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateEarned: {
    type: Date,
    default: Date.now,
  },
  redeemed: {
    type: Boolean,
    default: false,
  },
});


const userSchema = new Schema({
  // --- Basic Information (no changes here) ---
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  
    // --- App-Specific Stats ---
  points: { type: Number, required: true, default: 0 },
  streak: { type: Number, required: true, default: 0 },
  lastTaskCompletionDate: { type: Date },

  // --- NEW: Track individual task completions ---
  dailyTasks: {
    Meditation: { type: Date },
    Jogging: { type: Date },
    Journal: { type: Date },
  },
    // --- NEW: User Preferences ---
  preferences: {
    preferredMental: { type: String, default: 'Meditation' },
    preferredPhysical: { type: String, default: 'Jogging' },
  },

  // --- NEW: Rewards Array ---
  rewards: [rewardSchema], // Embed the reward schema here

}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);