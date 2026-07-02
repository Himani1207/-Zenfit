class MealGeneratorService {
  // Master Recipe Database using the 8 pantry ingredients + standard options
  static RECIPE_DATABASE = [
    // Pantry Recipes (only uses Milk, Paneer, Rice, Curd, Tomatoes, Oats, Bananas, Eggs)
    {
      name: 'Banana Oatmeal Shake',
      description: 'A creamy, high-fiber shake to fuel your morning.',
      calories: 320,
      protein: 12,
      carbs: 55,
      fat: 6,
      ingredients: ['Milk', 'Oats', 'Bananas'],
      recipe: ['Blend oats into a fine powder.', 'Add milk and sliced bananas.', 'Blend until smooth and serve cold.'],
      mealTime: 'breakfast',
      pantry: true
    },
    {
      name: 'Scrambled Eggs with Herbs',
      description: 'Quick protein-packed breakfast made with whole eggs.',
      calories: 220,
      protein: 14,
      carbs: 2,
      fat: 16,
      ingredients: ['Eggs'],
      recipe: ['Whisk eggs in a bowl.', 'Pour into a warm non-stick pan.', 'Stir gently until fully cooked.'],
      mealTime: 'breakfast',
      pantry: true
    },
    {
      name: 'Paneer Rice Stir-Fry',
      description: 'Sautéed paneer blocks mixed with fluffy steamed rice and juicy tomatoes.',
      calories: 510,
      protein: 22,
      carbs: 65,
      fat: 18,
      ingredients: ['Paneer', 'Rice', 'Tomatoes'],
      recipe: ['Sauté chopped tomatoes in a pan.', 'Add cubed paneer and cook for 3 minutes.', 'Stir in pre-cooked rice and mix well.'],
      mealTime: 'lunch',
      pantry: true
    },
    {
      name: 'Classic Curd Rice',
      description: 'Cooling and light fermented rice dish popular for digestion.',
      calories: 380,
      protein: 9,
      carbs: 68,
      fat: 5,
      ingredients: ['Curd', 'Rice'],
      recipe: ['Mash warm cooked rice slightly.', 'Mix in fresh curd thoroughly.', 'Season with a pinch of salt.'],
      mealTime: 'lunch',
      pantry: true
    },
    {
      name: 'Paneer Bhurji',
      description: 'Scrambled cottage cheese cooked with chopped tomatoes and mild spices.',
      calories: 290,
      protein: 18,
      carbs: 8,
      fat: 20,
      ingredients: ['Paneer', 'Tomatoes'],
      recipe: ['Crumble the paneer block.', 'Cook chopped tomatoes in a pan until soft.', 'Add paneer, salt, and spices, stir for 5 minutes.'],
      mealTime: 'dinner',
      pantry: true
    },
    {
      name: 'Boiled Eggs with Tomatoes',
      description: 'Hard-boiled eggs sliced and seasoned, paired with fresh tomatoes.',
      calories: 180,
      protein: 13,
      carbs: 5,
      fat: 11,
      ingredients: ['Eggs', 'Tomatoes'],
      recipe: ['Boil eggs for 9-10 minutes, peel and slice.', 'Arrange on a plate with sliced tomatoes.', 'Season with salt and pepper.'],
      mealTime: 'dinner',
      pantry: true
    },
    {
      name: 'Banana Curd Bowl',
      description: 'Fresh sliced banana topped with cool whipped curd.',
      calories: 210,
      protein: 6,
      carbs: 38,
      fat: 3,
      ingredients: ['Curd', 'Bananas'],
      recipe: ['Whip curd in a small bowl until smooth.', 'Slice bananas and stir them in.', 'Serve chilled.'],
      mealTime: 'snacks',
      pantry: true
    },
    {
      name: 'Oats Curd Porridge',
      description: 'Savory oats mixed with thick curd for a quick gut-friendly snack.',
      calories: 240,
      protein: 8,
      carbs: 42,
      fat: 4,
      ingredients: ['Oats', 'Curd'],
      recipe: ['Cook oats in a small amount of water.', 'Let them cool down to room temperature.', 'Mix in fresh curd and salt.'],
      mealTime: 'snacks',
      pantry: true
    },

    // Standard Healthy Recipes (Fallback / Non-pantry)
    {
      name: 'Avocado Toast with Eggs',
      description: 'Smashed avocado on toasted multigrain bread topped with a sunny side up egg.',
      calories: 340,
      protein: 16,
      carbs: 24,
      fat: 18,
      ingredients: ['Avocado', 'Bread', 'Eggs'],
      recipe: ['Toast the bread.', 'Smash avocado and spread it on toast.', 'Top with a fried egg and salt.'],
      mealTime: 'breakfast',
      pantry: false
    },
    {
      name: 'Greek Yogurt Berry Bowl',
      description: 'Thick greek yogurt topped with a handful of fresh berries and honey.',
      calories: 280,
      protein: 18,
      carbs: 30,
      fat: 4,
      ingredients: ['Greek Yogurt', 'Berries', 'Honey'],
      recipe: ['Scoop yogurt into a bowl.', 'Wash and place berries on top.', 'Drizzle with honey.'],
      mealTime: 'breakfast',
      pantry: false
    },
    {
      name: 'Grilled Chicken & Rice',
      description: 'Lean grilled chicken breast served alongside steamed white rice and broccoli.',
      calories: 480,
      protein: 38,
      carbs: 50,
      fat: 10,
      ingredients: ['Chicken Breast', 'Rice', 'Broccoli'],
      recipe: ['Season chicken breast with salt and herbs.', 'Grill chicken until cooked through.', 'Serve with rice and steamed broccoli.'],
      mealTime: 'lunch',
      pantry: false
    },
    {
      name: 'Quinoa Tofu Salad',
      description: 'Nutritious quinoa salad combined with roasted tofu cubes and cucumbers.',
      calories: 410,
      protein: 20,
      carbs: 48,
      fat: 12,
      ingredients: ['Quinoa', 'Tofu', 'Cucumber', 'Lemon'],
      recipe: ['Boil quinoa and let it cool.', 'Pan-fry tofu cubes until lightly brown.', 'Toss quinoa, tofu, chopped cucumbers, and lemon juice.'],
      mealTime: 'lunch',
      pantry: false
    },
    {
      name: 'Baked Salmon with Asparagus',
      description: 'Succulent baked salmon fillet served with tender roasted asparagus.',
      calories: 450,
      protein: 34,
      carbs: 8,
      fat: 26,
      ingredients: ['Salmon', 'Asparagus', 'Olive Oil'],
      recipe: ['Preheat oven to 200°C.', 'Place salmon and asparagus on a baking sheet.', 'Drizzle with oil, season, and bake for 12-15 minutes.'],
      mealTime: 'dinner',
      pantry: false
    },
    {
      name: 'Lentil Soup with Roasted Veggies',
      description: 'Warm, filling yellow lentil stew with a side of mixed roasted squash.',
      calories: 390,
      protein: 24,
      carbs: 58,
      fat: 5,
      ingredients: ['Lentils', 'Carrots', 'Zucchini'],
      recipe: ['Boil lentils with turmeric and salt.', 'Roast chopped vegetables in a pan.', 'Combine and garnish with fresh parsley.'],
      mealTime: 'dinner',
      pantry: false
    },
    {
      name: 'Apple and Peanut Butter',
      description: 'Sweet apple slices dipped in rich natural peanut butter.',
      calories: 220,
      protein: 7,
      carbs: 25,
      fat: 12,
      ingredients: ['Apple', 'Peanut Butter'],
      recipe: ['Core and slice the apple.', 'Serve with 2 tablespoons of peanut butter.'],
      mealTime: 'snacks',
      pantry: false
    },
    {
      name: 'Mixed Nuts and Seeds',
      description: 'A handful of unsalted almonds, walnuts, and pumpkin seeds.',
      calories: 160,
      protein: 5,
      carbs: 8,
      fat: 14,
      ingredients: ['Almonds', 'Walnuts', 'Pumpkin Seeds'],
      recipe: ['Measure 30g of mixed nuts.', 'Enjoy as a quick energy-boosting snack.'],
      mealTime: 'snacks',
      pantry: false
    }
  ];

  static generatePlan({ goal, activityLevel, dietPreference, pantryIngredients = [] }) {
    let matches = [];
    const isPantryMode = pantryIngredients && pantryIngredients.length > 0;

    if (isPantryMode) {
      // Filter recipes where ALL ingredients are present in user's pantry list
      matches = this.RECIPE_DATABASE.filter(recipe => {
        if (!recipe.pantry) return false;
        return recipe.ingredients.every(ing => 
          pantryIngredients.some(userIng => userIng.toLowerCase() === ing.toLowerCase())
        );
      });
    } else {
      // Standard Filter based on diet preference (can expand to vegeterian filtering if needed)
      matches = this.RECIPE_DATABASE;
    }

    // Helper to pick one meal for a specific slot
    const getMealForSlot = (slot) => {
      let slotRecipes = matches.filter(r => r.mealTime === slot);
      if (slotRecipes.length === 0) {
        // Fallback to any recipe of that slot in database
        slotRecipes = this.RECIPE_DATABASE.filter(r => r.mealTime === slot);
      }
      const randomIndex = Math.floor(Math.random() * slotRecipes.length);
      return slotRecipes[randomIndex];
    };

    const breakfast = getMealForSlot('breakfast');
    const lunch = getMealForSlot('lunch');
    const dinner = getMealForSlot('dinner');
    const snacks = getMealForSlot('snacks');

    const totalCalories = breakfast.calories + lunch.calories + dinner.calories + snacks.calories;
    const totalProtein = breakfast.protein + lunch.protein + dinner.protein + snacks.protein;
    const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs + snacks.carbs;
    const totalFat = breakfast.fat + lunch.fat + dinner.fat + snacks.fat;

    // Water recommendation: base is 2000ml, +500ml for high activity, +300ml for weight loss
    let waterRecommendation = 2000;
    if (activityLevel === 'High') waterRecommendation += 600;
    if (activityLevel === 'Moderate') waterRecommendation += 300;
    if (goal === 'Weight Loss') waterRecommendation += 400;

    return {
      breakfast,
      lunch,
      dinner,
      snacks,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      waterRecommendation,
      dietPreference: isPantryMode ? 'Pantry Matches' : dietPreference
    };
  }
}

module.exports = MealGeneratorService;
