const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  gif: {
    type: String,
    default: ''
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
    type: String, // e.g. "30 sec"
    required: true
  },
  equipment: {
    type: [String],
    default: ['No Equipment']
  },
  caloriesBurned: {
    type: Number,
    required: true
  },
  benefits: {
    type: [String],
    default: []
  },
  commonMistakes: {
    type: [String],
    default: []
  },
  correctFormTips: {
    type: [String],
    default: []
  },
  instructions: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
