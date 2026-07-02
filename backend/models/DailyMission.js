const mongoose = require('mongoose');

const DailyMissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // String format 'YYYY-MM-DD'
    required: true
  },
  workoutCompleted: {
    type: Boolean,
    default: false
  },
  mealCompleted: {
    type: Boolean,
    default: false
  },
  programCompleted: {
    type: Boolean,
    default: false
  },
  waterCompleted: {
    type: Boolean,
    default: false
  },
  stretchCompleted: {
    type: Boolean,
    default: false
  },
  sleepCompleted: {
    type: Boolean,
    default: false
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  missionCompleted: {
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
  completionTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure one Daily Mission document per user per day
DailyMissionSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyMission', DailyMissionSchema);
