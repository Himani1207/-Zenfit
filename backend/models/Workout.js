const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  targetMuscles: {
    type: [String],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: String, // e.g. "12 mins"
    required: true
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  equipment: {
    type: [String],
    default: ['No Equipment']
  },
  benefits: {
    type: [String],
    default: []
  },
  commonMistakes: {
    type: [String],
    default: []
  },
  instructions: {
    type: [String],
    default: []
  },
  videoId: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 4.5
  },
  trainer: {
    type: String,
    default: 'ZenFit Expert'
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
