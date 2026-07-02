const MealPlan = require('../models/MealPlan');
const User = require('../models/User');
const MealGeneratorService = require('../services/MealGeneratorService');
const XPService = require('../services/XPService');

const generateMealPlan = async (req, res) => {
  try {
    const { goal, activityLevel, dietPreference, pantryIngredients } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Call service to build plan
    const planDetails = MealGeneratorService.generatePlan({
      goal: goal || user.fitnessGoal,
      activityLevel: activityLevel || 'Moderate',
      dietPreference: dietPreference || 'Any',
      pantryIngredients: pantryIngredients || []
    });

    // Create meal plan entry in DB
    const mealPlan = await MealPlan.create({
      userId: user._id,
      ...planDetails
    });

    console.log(`🥗 Meal Saved Successfully: Meal Plan generated for Goal: ${mealPlan.goal} inside zenfit.mealplans`);

    // Award XP (+30 XP)
    const result = XPService.addXP(user, XPService.REWARDS.MEAL_PLAN);
    user.level = result.user.level;
    user.xp = result.user.xp;
    user.xpToNextLevel = result.user.xpToNextLevel;
    
    // Automatically check checklist item for meals
    user.checklist.meal = true;

    // Log Activity
    const ActivityService = require('../services/ActivityService');
    const { mission, missionCompletedNow } = await ActivityService.syncDailyMission(user, XPService.REWARDS.MEAL_PLAN);

    await user.save();

    res.status(201).json({
      message: 'Meal plan generated successfully',
      mealPlan,
      xpGained: XPService.REWARDS.MEAL_PLAN,
      leveledUp: result.leveledUp,
      checklist: user.checklist,
      dailyMission: mission,
      missionCompletedNow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const swapMeal = async (req, res) => {
  try {
    const { mealPlanId, mealTime } = req.body; // e.g. 'breakfast', 'lunch'
    const plan = await MealPlan.findById(mealPlanId);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Find a random different recipe for this slot
    let available = MealGeneratorService.RECIPE_DATABASE.filter(r => r.mealTime === mealTime && r.name !== plan[mealTime].name);
    if (available.length === 0) {
      available = MealGeneratorService.RECIPE_DATABASE.filter(r => r.mealTime === mealTime);
    }

    const newMeal = available[Math.floor(Math.random() * available.length)];
    plan[mealTime] = newMeal;

    // Recalculate totals
    plan.totalCalories = plan.breakfast.calories + plan.lunch.calories + plan.dinner.calories + plan.snacks.calories;
    plan.totalProtein = plan.breakfast.protein + plan.lunch.protein + plan.dinner.protein + plan.snacks.protein;
    plan.totalCarbs = plan.breakfast.carbs + plan.lunch.carbs + plan.dinner.carbs + plan.snacks.carbs;
    plan.totalFat = plan.breakfast.fat + plan.lunch.fat + plan.dinner.fat + plan.snacks.fat;

    await plan.save();
    res.status(200).json({ message: 'Meal swapped successfully', mealPlan: plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveMealPlan = async (req, res) => {
  try {
    const { mealPlanId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const plan = await MealPlan.findById(mealPlanId);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Save to user favorites if not already present
    const exists = user.savedMeals.some(m => m._id.toString() === mealPlanId);
    if (!exists) {
      user.savedMeals.push(plan);
      
      const result = XPService.addXP(user, 15);
      user.level = result.user.level;
      user.xp = result.user.xp;
      
      await user.save();
      return res.status(200).json({ message: 'Meal plan saved to favorites', savedMeals: user.savedMeals, xpGained: 15, leveledUp: result.leveledUp });
    }

    res.status(200).json({ message: 'Meal plan already saved', savedMeals: user.savedMeals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedMealPlans = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.savedMeals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMealHistory = async (req, res) => {
  try {
    const history = await MealPlan.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateMealPlan,
  swapMeal,
  saveMealPlan,
  getSavedMealPlans,
  getMealHistory
};
