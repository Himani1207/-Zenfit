const mongoose = require('mongoose');

const WorkoutHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutSession',
    required: true
  },
  sessionTitle: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // duration in minutes
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  completionPercentage: {
    type: Number, // e.g. 100
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutHistory', WorkoutHistorySchema);
