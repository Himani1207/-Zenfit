const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 25
  },
  height: {
    type: Number,
    default: 170 // in cm
  },
  weight: {
    type: Number,
    default: 70 // in kg
  },
  bmi: {
    type: Number,
    default: 24.2
  },
  fitnessGoal: {
    type: String,
    default: 'Stay Healthy' // 'Weight Loss', 'Muscle Gain', 'Strength', 'Flexibility'
  },
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  xpToNextLevel: {
    type: Number,
    default: 200
  },
  streak: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastCompletedDate: {
    type: String,
    default: null
  },
  badges: {
    type: [String],
    default: []
  },
  checklist: {
    workout: { type: Boolean, default: false },
    meal: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    stretch: { type: Boolean, default: false },
    sleep: { type: Boolean, default: false }
  },
  waterIntake: {
    type: Number, // in ml
    default: 0
  },
  weeklyCalendar: {
    type: [
      {
        day: { type: String, required: true }, // 'Mon', 'Tue', etc.
        completed: { type: Boolean, default: false }
      }
    ],
    default: [
      { day: 'Mon', completed: false },
      { day: 'Tue', completed: false },
      { day: 'Wed', completed: false },
      { day: 'Thu', completed: false },
      { day: 'Fri', completed: false },
      { day: 'Sat', completed: false },
      { day: 'Sun', completed: false }
    ]
  },
  savedWorkouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }],
  savedMeals: {
    type: Array, // Custom saved recipes or generated meal objects
    default: []
  },
  weightHistory: [
    {
      weight: Number,
      date: { type: Date, default: Date.now }
    }
  ],
  membershipType: {
    type: String,
    default: 'Starter'
  },
  membershipStatus: {
    type: String,
    default: 'Active'
  },
  membershipStartDate: {
    type: Date,
    default: Date.now
  },
  membershipEndDate: {
    type: Date,
    default: null
  },
  membershipHistory: {
    type: Array,
    default: []
  },
  lastChecklistDate: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
