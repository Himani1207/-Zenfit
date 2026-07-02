const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trainer = require('../models/Trainer');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const WorkoutSession = require('../models/WorkoutSession');
const WorkoutProgram = require('../models/WorkoutProgram');

dotenv.config();

const trainersData = [
  {
    name: 'Jane Smith',
    specialty: 'Yoga & Pilates',
    experience: 5,
    image: 'jane.jpg',
    rating: 4.9,
    languages: ['English', 'Spanish'],
    certificates: ['RYS-500 Certified Yoga Alliance Instructor', 'Precision Nutrition Level 1'],
    reviews: [
      { userName: 'Himani', rating: 5, comment: 'Amazing yoga session! Very peaceful and centering.', date: new Date() }
    ],
    availability: ['9:00 AM - 10:00 AM', '11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM']
  },
  {
    name: 'John Doe',
    specialty: 'HIIT & Functional Fitness',
    experience: 4,
    image: 'john.jpg',
    rating: 4.8,
    languages: ['English'],
    certificates: ['NASM Certified Personal Trainer', 'ACE Group Fitness Instructor'],
    reviews: [
      { userName: 'Kunal', rating: 5, comment: 'Super intense workout. John really pushes your limits!', date: new Date() }
    ],
    availability: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM', '3:00 PM - 4:00 PM']
  }
];

// Fallback old Workouts Data
const workoutsData = [
  {
    title: '10 Min Full Body Workout',
    targetMuscles: ['Abs', 'Glutes', 'Legs', 'Arms'],
    difficulty: 'Beginner',
    duration: '10 mins',
    caloriesBurned: 110,
    equipment: ['No Equipment'],
    benefits: ['Improves cardiovascular endurance'],
    commonMistakes: ['Rushing the movements without control'],
    instructions: ['Perform bodyweight squats for 45 seconds.'],
    videoId: '2pLT-olgUJs',
    rating: 4.8,
    trainer: 'Chloe Ting'
  }
];

// Standard Exercise sets
const exercisesData = [
  {
    name: 'Plank',
    image: '',
    gif: '',
    targetMuscles: ['Abs', 'Core'],
    difficulty: 'Beginner',
    duration: '30 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 15,
    benefits: ['Strengthens deep core muscles', 'Improves posture'],
    commonMistakes: ['Arching the lower back', 'Sagging hips'],
    correctFormTips: ['Keep glutes engaged', 'Create straight line head-to-heel'],
    instructions: ['Hold a perfectly flat body line, keeping core braced.']
  },
  {
    name: 'Mountain Climbers',
    image: '',
    gif: '',
    targetMuscles: ['Abs', 'Cardio'],
    difficulty: 'Intermediate',
    duration: '30 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 25,
    benefits: ['Boosts heart rate', 'Improves agility'],
    commonMistakes: ['Bouncing hips up and down'],
    correctFormTips: ['Maintain strong plank alignment'],
    instructions: ['Drive knees quickly to chest in running motion.']
  },
  {
    name: 'Crunches',
    image: '',
    gif: '',
    targetMuscles: ['Abs'],
    difficulty: 'Beginner',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 18,
    benefits: ['Isolates upper abs'],
    commonMistakes: ['Yanking the neck forward'],
    correctFormTips: ['Place fingertips lightly behind ears'],
    instructions: ['Contract abs to lift shoulder blades off floor.']
  },
  {
    name: 'Russian Twist',
    image: '',
    gif: '',
    targetMuscles: ['Abs', 'Obliques'],
    difficulty: 'Intermediate',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 22,
    benefits: ['Tones obliques'],
    commonMistakes: ['Slouching lower back'],
    correctFormTips: ['Lean back at 45-degree angle'],
    instructions: ['Sit with knees bent, rotate shoulders side-to-side.']
  },
  {
    name: 'Leg Raises',
    image: '',
    gif: '',
    targetMuscles: ['Abs', 'Lower Abs'],
    difficulty: 'Intermediate',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 20,
    benefits: ['Targets lower abs'],
    commonMistakes: ['Arching lower back off floor'],
    correctFormTips: ['Press lower back firmly into mat'],
    instructions: ['Slowly lift straight legs to 90 degrees, lower slowly.']
  },
  {
    name: 'Push-ups',
    image: '',
    gif: '',
    targetMuscles: ['Chest', 'Arms'],
    difficulty: 'Beginner',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 24,
    benefits: ['Builds upper body strength'],
    commonMistakes: ['Flaring elbows out too wide'],
    correctFormTips: ['Keep elbows tucked at 45 degrees'],
    instructions: ['Lower chest to floor, push back up keeping straight line.']
  },
  {
    name: 'Diamond Push-ups',
    image: '',
    gif: '',
    targetMuscles: ['Chest', 'Triceps'],
    difficulty: 'Advanced',
    duration: '30 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 28,
    benefits: ['Isolates triceps and inner chest'],
    commonMistakes: ['Hips sagging'],
    correctFormTips: ['Form a diamond shape with thumbs and index fingers'],
    instructions: ['Lower chest to your hands and press up.']
  },
  {
    name: 'Shoulder Taps',
    image: '',
    gif: '',
    targetMuscles: ['Shoulders', 'Core'],
    difficulty: 'Intermediate',
    duration: '45 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 18,
    benefits: ['Builds shoulder stability'],
    commonMistakes: ['Swinging hips side to side'],
    correctFormTips: ['Keep hips as steady as possible'],
    instructions: ['In high plank, tap right shoulder with left hand, then switch.']
  },
  {
    name: 'Bicep Curls Mock',
    image: '',
    gif: '',
    targetMuscles: ['Arms', 'Biceps'],
    difficulty: 'Beginner',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 16,
    benefits: ['Strengthens biceps'],
    commonMistakes: ['Swinging elbows'],
    correctFormTips: ['Keep elbows glued to sides'],
    instructions: ['Squeeze biceps to curl arms up and release slowly.']
  },
  {
    name: 'Tricep Dips',
    image: '',
    gif: '',
    targetMuscles: ['Arms', 'Triceps'],
    difficulty: 'Beginner',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 20,
    benefits: ['Tones triceps'],
    commonMistakes: ['Shrugging shoulders'],
    correctFormTips: ['Keep back close to the bench/floor'],
    instructions: ['Bend elbows to lower hips, push through palms to rise.']
  },
  {
    name: 'Squats',
    image: '',
    gif: '',
    targetMuscles: ['Legs', 'Quads'],
    difficulty: 'Beginner',
    duration: '45 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 30,
    benefits: ['Builds leg strength'],
    commonMistakes: ['Knees caving inward'],
    correctFormTips: ['Push knees outward as you descend'],
    instructions: ['Squat down as if sitting in chair, return to stand.']
  },
  {
    name: 'Lunges',
    image: '',
    gif: '',
    targetMuscles: ['Legs', 'Glutes'],
    difficulty: 'Beginner',
    duration: '40 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 26,
    benefits: ['Tones glutes and thighs'],
    commonMistakes: ['Step too short'],
    correctFormTips: ['Keep front knee aligned over ankle'],
    instructions: ['Step forward and lower hips until both knees are 90 degrees.']
  },
  {
    name: 'Burpees',
    image: '',
    gif: '',
    targetMuscles: ['Full Body', 'Cardio'],
    difficulty: 'Advanced',
    duration: '30 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 35,
    benefits: ['Extreme calorie burn'],
    commonMistakes: ['Landing on heels stiffly'],
    correctFormTips: ['Brace core as you jump back'],
    instructions: ['Squat, kick feet back, pushup, jump forward, jump up.']
  },
  {
    name: 'Cobra Stretch',
    image: '',
    gif: '',
    targetMuscles: ['Back', 'Flexibility'],
    difficulty: 'Beginner',
    duration: '45 sec',
    equipment: ['Yoga Mat'],
    caloriesBurned: 8,
    benefits: ['Relieves lower back stiffness'],
    commonMistakes: ['Locking elbows aggressively'],
    correctFormTips: ['Pull shoulders down away from ears'],
    instructions: ['Lie face down, press palms down and lift chest up.']
  },
  {
    name: 'Jumping Jacks',
    image: '',
    gif: '',
    targetMuscles: ['Cardio'],
    difficulty: 'Beginner',
    duration: '45 sec',
    equipment: ['No Equipment'],
    caloriesBurned: 22,
    benefits: ['Warms up full body'],
    commonMistakes: ['Landing heavily on feet'],
    correctFormTips: ['Land soft on the balls of your feet'],
    instructions: ['Jump spreading legs and raising arms, return to start.']
  }
];

const seedDatabase = async (clear = true) => {
  try {
    if (clear) {
      // Clear existing
      await Trainer.deleteMany({});
      await Workout.deleteMany({});
      await Exercise.deleteMany({});
      await WorkoutSession.deleteMany({});
      await WorkoutProgram.deleteMany({});
      console.log('🗑️ Cleared existing Trainer, Workout, Exercise, Session, and Program records.');
    }

    // Seed trainers and fallback workouts
    await Trainer.insertMany(trainersData);
    console.log('✅ Seeded Trainers successfully.');

    await Workout.insertMany(workoutsData);
    console.log('✅ Seeded Fallback Workouts successfully.');

    // Seed Exercises
    const seededExercises = await Exercise.insertMany(exercisesData);
    console.log(`✅ Seeded ${seededExercises.length} Exercises successfully.`);

    const plank = seededExercises.find(e => e.name === 'Plank')._id;
    const climbers = seededExercises.find(e => e.name === 'Mountain Climbers')._id;
    const crunches = seededExercises.find(e => e.name === 'Crunches')._id;
    const twist = seededExercises.find(e => e.name === 'Russian Twist')._id;
    const raises = seededExercises.find(e => e.name === 'Leg Raises')._id;
    const pushups = seededExercises.find(e => e.name === 'Push-ups')._id;
    const diamond = seededExercises.find(e => e.name === 'Diamond Push-ups')._id;
    const taps = seededExercises.find(e => e.name === 'Shoulder Taps')._id;
    const curl = seededExercises.find(e => e.name === 'Bicep Curls Mock')._id;
    const dips = seededExercises.find(e => e.name === 'Tricep Dips')._id;
    const squats = seededExercises.find(e => e.name === 'Squats')._id;
    const lunges = seededExercises.find(e => e.name === 'Lunges')._id;
    const burpees = seededExercises.find(e => e.name === 'Burpees')._id;
    const cobra = seededExercises.find(e => e.name === 'Cobra Stretch')._id;
    const jacks = seededExercises.find(e => e.name === 'Jumping Jacks')._id;

    // Define 36 sessions (4 per category for Abs, Chest, Shoulders, Arms, Legs, Core, Full Body, Flexibility, Cardio)
    const sessionsData = [
      // ================= ABS =================
      {
        title: 'Quick Core',
        category: 'Abs',
        difficulty: 'Beginner',
        duration: 10,
        caloriesBurned: 110,
        exercises: [
          { exercise: plank, duration: 30, rest: 15 },
          { exercise: crunches, duration: 30, rest: 15 },
          { exercise: twist, duration: 30, rest: 15 },
          { exercise: raises, duration: 30, rest: 15 }
        ],
        xpReward: 50
      },
      {
        title: 'Core Builder',
        category: 'Abs',
        difficulty: 'Intermediate',
        duration: 20,
        caloriesBurned: 180,
        exercises: [
          { exercise: plank, duration: 40, rest: 15 },
          { exercise: climbers, duration: 40, rest: 15 },
          { exercise: twist, duration: 40, rest: 15 },
          { exercise: raises, duration: 40, rest: 15 }
        ],
        xpReward: 70
      },
      {
        title: 'Six Pack Focus',
        category: 'Abs',
        difficulty: 'Intermediate',
        duration: 30,
        caloriesBurned: 240,
        exercises: [
          { exercise: crunches, duration: 45, rest: 15 },
          { exercise: twist, duration: 45, rest: 15 },
          { exercise: raises, duration: 45, rest: 15 },
          { exercise: climbers, duration: 45, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Elite Core',
        category: 'Abs',
        difficulty: 'Advanced',
        duration: 45,
        caloriesBurned: 350,
        exercises: [
          { exercise: plank, duration: 60, rest: 15 },
          { exercise: climbers, duration: 60, rest: 15 },
          { exercise: twist, duration: 60, rest: 15 },
          { exercise: raises, duration: 60, rest: 15 }
        ],
        xpReward: 100
      },

      // ================= CHEST =================
      {
        title: 'Chest Foundation',
        category: 'Chest',
        difficulty: 'Beginner',
        duration: 20,
        caloriesBurned: 150,
        exercises: [
          { exercise: pushups, duration: 30, rest: 15 },
          { exercise: plank, duration: 30, rest: 15 },
          { exercise: pushups, duration: 30, rest: 15 }
        ],
        xpReward: 60
      },
      {
        title: 'Upper Chest Builder',
        category: 'Chest',
        difficulty: 'Intermediate',
        duration: 30,
        caloriesBurned: 240,
        exercises: [
          { exercise: pushups, duration: 40, rest: 15 },
          { exercise: taps, duration: 40, rest: 15 },
          { exercise: pushups, duration: 40, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Power Chest',
        category: 'Chest',
        difficulty: 'Advanced',
        duration: 40,
        caloriesBurned: 320,
        exercises: [
          { exercise: pushups, duration: 45, rest: 15 },
          { exercise: diamond, duration: 40, rest: 15 },
          { exercise: taps, duration: 45, rest: 15 }
        ],
        xpReward: 90
      },
      {
        title: 'Strength Chest',
        category: 'Chest',
        difficulty: 'Advanced',
        duration: 50,
        caloriesBurned: 400,
        exercises: [
          { exercise: pushups, duration: 50, rest: 15 },
          { exercise: diamond, duration: 45, rest: 15 },
          { exercise: burpees, duration: 30, rest: 15 }
        ],
        xpReward: 110
      },

      // ================= SHOULDERS =================
      {
        title: 'Shoulder Mobility',
        category: 'Shoulders',
        difficulty: 'Beginner',
        duration: 15,
        caloriesBurned: 90,
        exercises: [
          { exercise: cobra, duration: 30, rest: 15 },
          { exercise: taps, duration: 30, rest: 15 }
        ],
        xpReward: 50
      },
      {
        title: 'Shoulder Builder',
        category: 'Shoulders',
        difficulty: 'Intermediate',
        duration: 25,
        caloriesBurned: 180,
        exercises: [
          { exercise: taps, duration: 40, rest: 15 },
          { exercise: plank, duration: 45, rest: 15 },
          { exercise: taps, duration: 40, rest: 15 }
        ],
        xpReward: 70
      },
      {
        title: 'Power Shoulders',
        category: 'Shoulders',
        difficulty: 'Advanced',
        duration: 35,
        caloriesBurned: 270,
        exercises: [
          { exercise: taps, duration: 45, rest: 15 },
          { exercise: pushups, duration: 45, rest: 15 },
          { exercise: taps, duration: 45, rest: 15 }
        ],
        xpReward: 90
      },
      {
        title: 'Elite Shoulders',
        category: 'Shoulders',
        difficulty: 'Advanced',
        duration: 45,
        caloriesBurned: 360,
        exercises: [
          { exercise: taps, duration: 50, rest: 15 },
          { exercise: pushups, duration: 50, rest: 15 },
          { exercise: burpees, duration: 30, rest: 15 }
        ],
        xpReward: 100
      },

      // ================= ARMS =================
      {
        title: 'Arm Starter',
        category: 'Arms',
        difficulty: 'Beginner',
        duration: 20,
        caloriesBurned: 130,
        exercises: [
          { exercise: curl, duration: 30, rest: 15 },
          { exercise: dips, duration: 30, rest: 15 }
        ],
        xpReward: 60
      },
      {
        title: 'Arm Builder',
        category: 'Arms',
        difficulty: 'Intermediate',
        duration: 30,
        caloriesBurned: 220,
        exercises: [
          { exercise: curl, duration: 45, rest: 15 },
          { exercise: dips, duration: 45, rest: 15 },
          { exercise: pushups, duration: 30, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Strength Arms',
        category: 'Arms',
        difficulty: 'Intermediate',
        duration: 40,
        caloriesBurned: 300,
        exercises: [
          { exercise: curl, duration: 50, rest: 15 },
          { exercise: dips, duration: 50, rest: 15 },
          { exercise: diamond, duration: 30, rest: 15 }
        ],
        xpReward: 95
      },
      {
        title: 'Arm Destroyer',
        category: 'Arms',
        difficulty: 'Advanced',
        duration: 50,
        caloriesBurned: 410,
        exercises: [
          { exercise: curl, duration: 60, rest: 15 },
          { exercise: dips, duration: 60, rest: 15 },
          { exercise: diamond, duration: 45, rest: 15 }
        ],
        xpReward: 110
      },

      // ================= LEGS =================
      {
        title: 'Leg Strength',
        category: 'Legs',
        difficulty: 'Beginner',
        duration: 20,
        caloriesBurned: 160,
        exercises: [
          { exercise: squats, duration: 35, rest: 15 },
          { exercise: lunges, duration: 35, rest: 15 }
        ],
        xpReward: 60
      },
      {
        title: 'Lower Body Builder',
        category: 'Legs',
        difficulty: 'Intermediate',
        duration: 30,
        caloriesBurned: 250,
        exercises: [
          { exercise: squats, duration: 45, rest: 15 },
          { exercise: lunges, duration: 45, rest: 15 },
          { exercise: squats, duration: 45, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Explosive Legs',
        category: 'Legs',
        difficulty: 'Advanced',
        duration: 40,
        caloriesBurned: 340,
        exercises: [
          { exercise: squats, duration: 50, rest: 15 },
          { exercise: lunges, duration: 50, rest: 15 },
          { exercise: burpees, duration: 30, rest: 15 }
        ],
        xpReward: 95
      },
      {
        title: 'Leg Power',
        category: 'Legs',
        difficulty: 'Advanced',
        duration: 50,
        caloriesBurned: 430,
        exercises: [
          { exercise: squats, duration: 60, rest: 15 },
          { exercise: lunges, duration: 60, rest: 15 },
          { exercise: burpees, duration: 40, rest: 15 }
        ],
        xpReward: 110
      },

      // ================= CORE =================
      {
        title: 'Core Stability',
        category: 'Core',
        difficulty: 'Beginner',
        duration: 15,
        caloriesBurned: 100,
        exercises: [
          { exercise: plank, duration: 30, rest: 15 },
          { exercise: raises, duration: 30, rest: 15 }
        ],
        xpReward: 50
      },
      {
        title: 'Core Strength',
        category: 'Core',
        difficulty: 'Intermediate',
        duration: 25,
        caloriesBurned: 190,
        exercises: [
          { exercise: plank, duration: 45, rest: 15 },
          { exercise: twist, duration: 45, rest: 15 },
          { exercise: climbers, duration: 45, rest: 15 }
        ],
        xpReward: 75
      },
      {
        title: 'Core Endurance',
        category: 'Core',
        difficulty: 'Intermediate',
        duration: 35,
        caloriesBurned: 270,
        exercises: [
          { exercise: plank, duration: 50, rest: 15 },
          { exercise: twist, duration: 50, rest: 15 },
          { exercise: raises, duration: 50, rest: 15 },
          { exercise: climbers, duration: 50, rest: 15 }
        ],
        xpReward: 90
      },
      {
        title: 'Core Master',
        category: 'Core',
        difficulty: 'Advanced',
        duration: 45,
        caloriesBurned: 370,
        exercises: [
          { exercise: plank, duration: 60, rest: 15 },
          { exercise: twist, duration: 60, rest: 15 },
          { exercise: raises, duration: 60, rest: 15 },
          { exercise: climbers, duration: 60, rest: 15 }
        ],
        xpReward: 110
      },

      // ================= FULL BODY =================
      {
        title: 'Full Body Basics',
        category: 'Full Body',
        difficulty: 'Beginner',
        duration: 20,
        caloriesBurned: 170,
        exercises: [
          { exercise: squats, duration: 30, rest: 15 },
          { exercise: pushups, duration: 30, rest: 15 },
          { exercise: jacks, duration: 30, rest: 15 }
        ],
        xpReward: 60
      },
      {
        title: 'Total Body Burn',
        category: 'Full Body',
        difficulty: 'Intermediate',
        duration: 30,
        caloriesBurned: 280,
        exercises: [
          { exercise: squats, duration: 45, rest: 15 },
          { exercise: pushups, duration: 45, rest: 15 },
          { exercise: burpees, duration: 30, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Strength Fusion',
        category: 'Full Body',
        difficulty: 'Advanced',
        duration: 40,
        caloriesBurned: 380,
        exercises: [
          { exercise: squats, duration: 50, rest: 15 },
          { exercise: diamond, duration: 45, rest: 15 },
          { exercise: burpees, duration: 40, rest: 15 }
        ],
        xpReward: 95
      },
      {
        title: 'Ultimate Full Body',
        category: 'Full Body',
        difficulty: 'Advanced',
        duration: 60,
        caloriesBurned: 520,
        exercises: [
          { exercise: squats, duration: 60, rest: 15 },
          { exercise: diamond, duration: 60, rest: 15 },
          { exercise: burpees, duration: 50, rest: 15 },
          { exercise: climbers, duration: 60, rest: 15 }
        ],
        xpReward: 120
      },

      // ================= FLEXIBILITY =================
      {
        title: 'Morning Stretch',
        category: 'Flexibility',
        difficulty: 'Beginner',
        duration: 10,
        caloriesBurned: 40,
        exercises: [
          { exercise: cobra, duration: 45, rest: 15 }
        ],
        xpReward: 40
      },
      {
        title: 'Mobility Flow',
        category: 'Flexibility',
        difficulty: 'Beginner',
        duration: 20,
        caloriesBurned: 90,
        exercises: [
          { exercise: cobra, duration: 50, rest: 15 },
          { exercise: plank, duration: 30, rest: 15 }
        ],
        xpReward: 60
      },
      {
        title: 'Deep Stretch',
        category: 'Flexibility',
        difficulty: 'Intermediate',
        duration: 30,
        caloriesBurned: 130,
        exercises: [
          { exercise: cobra, duration: 60, rest: 15 },
          { exercise: plank, duration: 45, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Recovery Session',
        category: 'Flexibility',
        difficulty: 'Intermediate',
        duration: 40,
        caloriesBurned: 170,
        exercises: [
          { exercise: cobra, duration: 60, rest: 15 },
          { exercise: plank, duration: 60, rest: 15 },
          { exercise: cobra, duration: 60, rest: 15 }
        ],
        xpReward: 95
      },

      // ================= CARDIO =================
      {
        title: 'Quick Cardio',
        category: 'Cardio',
        difficulty: 'Beginner',
        duration: 15,
        caloriesBurned: 130,
        exercises: [
          { exercise: jacks, duration: 45, rest: 15 },
          { exercise: climbers, duration: 30, rest: 15 }
        ],
        xpReward: 50
      },
      {
        title: 'HIIT Boost',
        category: 'Cardio',
        difficulty: 'Intermediate',
        duration: 25,
        caloriesBurned: 240,
        exercises: [
          { exercise: jacks, duration: 50, rest: 15 },
          { exercise: climbers, duration: 45, rest: 15 },
          { exercise: burpees, duration: 30, rest: 15 }
        ],
        xpReward: 80
      },
      {
        title: 'Fat Burn',
        category: 'Cardio',
        difficulty: 'Intermediate',
        duration: 35,
        caloriesBurned: 330,
        exercises: [
          { exercise: jacks, duration: 60, rest: 15 },
          { exercise: climbers, duration: 50, rest: 15 },
          { exercise: burpees, duration: 40, rest: 15 }
        ],
        xpReward: 95
      },
      {
        title: 'Endurance Rush',
        category: 'Cardio',
        difficulty: 'Advanced',
        duration: 45,
        caloriesBurned: 440,
        exercises: [
          { exercise: jacks, duration: 60, rest: 15 },
          { exercise: climbers, duration: 60, rest: 15 },
          { exercise: burpees, duration: 50, rest: 15 }
        ],
        xpReward: 110
      }
    ];

    const seededSessions = await WorkoutSession.insertMany(sessionsData);
    console.log(`✅ Seeded ${seededSessions.length} Workout Sessions successfully.`);

    // Find Session IDs for Programs
    const quickCore = seededSessions.find(s => s.title === 'Quick Core')._id;
    const coreBuilder = seededSessions.find(s => s.title === 'Core Builder')._id;
    const chestFoundation = seededSessions.find(s => s.title === 'Chest Foundation')._id;
    const totalBodyBurn = seededSessions.find(s => s.title === 'Total Body Burn')._id;

    // Create Workout Programs
    const programsData = [
      {
        title: '21 Day Abs Challenge',
        description: 'Build a solid defined core in 21 days with short daily guided sessions.',
        difficulty: 'Beginner',
        durationDays: 21,
        xpReward: 200,
        schedule: Array.from({ length: 21 }, (_, i) => {
          const day = i + 1;
          const week = Math.ceil(day / 7);
          const isRest = day % 4 === 0;
          return {
            day,
            week,
            session: isRest ? null : (day % 2 === 0 ? coreBuilder : quickCore),
            restDay: isRest
          };
        })
      },
      {
        title: '30 Day Fat Loss',
        description: 'High intensity cardio and strength movements mapped out to burn stubborn fat.',
        difficulty: 'Advanced',
        durationDays: 30,
        xpReward: 300,
        schedule: Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const week = Math.ceil(day / 7);
          const isRest = day % 5 === 0;
          return {
            day,
            week,
            session: isRest ? null : totalBodyBurn,
            restDay: isRest
          };
        })
      },
      {
        title: 'Strength Builder',
        description: 'Tuck into chest and full body strength targets to gain lean muscle.',
        difficulty: 'Intermediate',
        durationDays: 14,
        xpReward: 250,
        schedule: Array.from({ length: 14 }, (_, i) => {
          const day = i + 1;
          const week = Math.ceil(day / 7);
          const isRest = day % 3 === 0;
          return {
            day,
            week,
            session: isRest ? null : chestFoundation,
            restDay: isRest
          };
        })
      },
      {
        title: 'Beginner Fitness',
        description: 'A gentle entry point back into healthy movement, mobility and core plank exercises.',
        difficulty: 'Beginner',
        durationDays: 7,
        xpReward: 100,
        schedule: Array.from({ length: 7 }, (_, i) => {
          const day = i + 1;
          const week = 1;
          const isRest = day === 3 || day === 6;
          return {
            day,
            week,
            session: isRest ? null : quickCore,
            restDay: isRest
          };
        })
      },
      {
        title: 'Home Workout Challenge',
        description: 'No equipment needed full body challenge to tone muscles and boost cardio.',
        difficulty: 'Intermediate',
        durationDays: 28,
        xpReward: 250,
        schedule: Array.from({ length: 28 }, (_, i) => {
          const day = i + 1;
          const week = Math.ceil(day / 7);
          const isRest = day % 4 === 0;
          return {
            day,
            week,
            session: isRest ? null : coreBuilder,
            restDay: isRest
          };
        })
      }
    ];

    const seededPrograms = await WorkoutProgram.insertMany(programsData);
    console.log(`✅ Seeded ${seededPrograms.length} Workout Programs successfully.`);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    throw error;
  }
};

const seedDatabaseStandalone = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/zenfit';
    console.log('🌱 Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);
    await seedDatabase(true);
    await mongoose.connection.close();
    console.log('🔌 Database connection closed. Seeding complete!');
  } catch (err) {
    console.error('Standalone Seeding Failed:', err.message);
    process.exit(1);
  }
};

const seedIfNeeded = async () => {
  try {
    const count = await Exercise.countDocuments();
    if (count === 0) {
      console.log('📋 Exercise collection is empty. Starting automatic database seed...');
      await seedDatabase(false);
      console.log('🌱 Automatic database seeding finished successfully.');
    } else {
      console.log('📋 Database collections already populated. Skipping auto-seed.');
    }
  } catch (err) {
    console.error('❌ Automatic Seeding Failed:', err.message);
  }
};

if (require.main === module) {
  seedDatabaseStandalone();
} else {
  module.exports = { seedIfNeeded };
}
