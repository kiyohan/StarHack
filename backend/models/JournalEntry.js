const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalEntrySchema = new Schema({
  // --- Link to the User ---
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // --- Entry Content ---
  content: {
    type: String,
    required: true,
    trim: true,
  },

  // --- NEW: Upvotes Field ---
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // Each upvote is a reference to a user
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);