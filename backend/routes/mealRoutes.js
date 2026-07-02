const express = require('express');
const router = express.Router();
const {
  generateMealPlan,
  swapMeal,
  saveMealPlan,
  getSavedMealPlans,
  getMealHistory
} = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateMealPlan);
router.post('/swap', protect, swapMeal);
router.post('/save', protect, saveMealPlan);
router.get('/favorites', protect, getSavedMealPlans);
router.get('/history', protect, getMealHistory);

module.exports = router;
