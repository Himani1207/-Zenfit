const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // String format 'YYYY-MM-DD' for timezone-independent daily uniqueness
    required: true
  },
  workoutCompleted: {
    type: Boolean,
    default: false
  },
  mealGenerated: {
    type: Boolean,
    default: false
  },
  programCompleted: {
    type: Boolean,
    default: false
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  streakOnDay: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure one log per user per day
ActivityLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
