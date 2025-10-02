const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  // --- Link to the User ---
  userId: {
    type: Schema.Types.ObjectId, // This is how we link this document to a specific user
    ref: 'User', // This refers to the 'User' model we just created
    required: true,
    index: true, // Adds an index to this field for faster queries
  },

  // --- Task Details ---
  taskType: {
    type: String,
    required: true,
  },
  pointsEarned: {
    type: Number,
    required: true,
  },
}, {
  // The `createdAt` field from timestamps will serve as the `completedAt` date
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);