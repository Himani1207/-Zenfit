const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true // e.g. "Yoga", "Cardio", "Strength"
  },
  experience: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'trainer_placeholder.jpg'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  languages: {
    type: [String],
    default: ['English']
  },
  certificates: {
    type: [String],
    default: ['Certified Personal Trainer (CPT)']
  },
  reviews: [
    {
      userName: String,
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ],
  availability: {
    type: [String],
    default: [
      '9:00 AM - 10:00 AM',
      '11:00 AM - 12:00 PM',
      '2:00 PM - 3:00 PM',
      '4:00 PM - 5:00 PM'
    ]
  }
});

module.exports = mongoose.model('Trainer', TrainerSchema);
