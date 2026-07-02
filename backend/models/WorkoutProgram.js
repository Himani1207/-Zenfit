const mongoose = require('mongoose');

const WorkoutProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  durationDays: {
    type: Number, // e.g. 21, 30
    required: true
  },
  xpReward: {
    type: Number,
    default: 150
  },
  schedule: [
    {
      day: {
        type: Number, // Day 1, Day 2, etc.
        required: true
      },
      week: {
        type: Number, // Week 1, Week 2, etc.
        required: true
      },
      session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutSession',
        default: null // Null indicates a Rest Day if restDay is true
      },
      restDay: {
        type: Boolean,
        default: false
      }
    }
  ]
});

module.exports = mongoose.model('WorkoutProgram', WorkoutProgramSchema);
