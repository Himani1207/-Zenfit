const mongoose = require('mongoose');

const WorkoutSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Abs',
      'Full Body', 'Fat Loss', 'Strength', 'Home Workout', 'Gym Workout',
      'Flexibility', 'Cardio'
    ]
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number, // estimated time in minutes, e.g. 15
    required: true
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
      },
      duration: {
        type: Number, // duration of this exercise in seconds, e.g. 30
        required: true
      },
      rest: {
        type: Number, // rest after this exercise in seconds, e.g. 15
        default: 15
      }
    }
  ],
  xpReward: {
    type: Number,
    default: 50
  }
});

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);
