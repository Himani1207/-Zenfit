const mongoose = require('mongoose');

const CompletedWorkoutSchema = new mongoose.Schema({
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
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  exercisesCompleted: {
    type: Number,
    required: true
  },
  xpEarned: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CompletedWorkout', CompletedWorkoutSchema);
