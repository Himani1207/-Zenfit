const mongoose = require('mongoose');

const MealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  calories: { type: Number, default: 0 },
  ingredients: { type: [String], default: [] },
  recipe: { type: [String], default: [] }
});

const MealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  breakfast: MealItemSchema,
  lunch: MealItemSchema,
  dinner: MealItemSchema,
  snacks: MealItemSchema,
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 }, // in grams
  totalCarbs: { type: Number, default: 0 }, // in grams
  totalFat: { type: Number, default: 0 }, // in grams
  waterRecommendation: { type: Number, default: 2000 }, // in ml
  dietPreference: { type: String, default: 'Any' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
