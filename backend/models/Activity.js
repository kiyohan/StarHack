const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Mental', 'Physical'], // The two categories
  },
  description: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    required: true,
    default: 45,
  },
  duration: {
    type: String, // e.g., "15 min"
    default: "15 min",
  },
});

module.exports = mongoose.model('Activity', activitySchema);