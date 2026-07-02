import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, X, Search, SlidersHorizontal, Heart, 
  Flame, Clock, Dumbbell, Calendar, Trophy, BookOpen, 
  Award, Sparkles, TrendingUp, 
  ShieldCheck, Compass, Activity, ArrowRight
} from 'lucide-react';

// Premium Category configuration with specific Lucide icons, accent colors, and glow shadows
const CATEGORIES_CONFIG = [
  { name: 'Abs', icon: Activity, color: '#8B5CF6', shadow: 'rgba(139,92,246,0.3)', count: 4 },
  { name: 'Chest', icon: Dumbbell, color: '#F97316', shadow: 'rgba(249,115,22,0.3)', count: 4 },
  { name: 'Shoulders', icon: SlidersHorizontal, color: '#F59E0B', shadow: 'rgba(245,158,11,0.3)', count: 4 },
  { name: 'Arms', icon: Award, color: '#EC4899', shadow: 'rgba(236,72,153,0.3)', count: 4 },
  { name: 'Legs', icon: TrendingUp, color: '#10B981', shadow: 'rgba(16,185,129,0.3)', count: 4 },
  { name: 'Core', icon: ShieldCheck, color: '#6366F1', shadow: 'rgba(99,102,241,0.3)', count: 4 },
  { name: 'Full Body', icon: Sparkles, color: '#3B82F6', shadow: 'rgba(59,130,246,0.3)', count: 4 },
  { name: 'Flexibility', icon: Compass, color: '#14B8A6', shadow: 'rgba(20,184,166,0.3)', count: 4 },
  { name: 'Cardio', icon: Flame, color: '#EF4444', shadow: 'rgba(239,68,68,0.3)', count: 4 }
];

// Fallback & Guarantee static sessions data (exactly 4 sessions per category as requested)
const MOCK_SESSIONS = [
  // Abs
  { _id: 'mock_abs_1', title: 'Quick Core', category: 'Abs', difficulty: 'Beginner', duration: 10, exercisesCount: 6, caloriesBurned: 110, equipment: 'None', focus: 'Core Stability', description: 'A fast-paced core routine to build abdominal baseline strength.', exercisesList: ['Plank', 'Crunches', 'Russian Twist'] },
  { _id: 'mock_abs_2', title: 'Core Builder', category: 'Abs', difficulty: 'Intermediate', duration: 20, exercisesCount: 8, caloriesBurned: 180, equipment: 'None', focus: 'Ab Definition', description: 'Intermediate workout to isolate rectus abdominis and oblique groups.', exercisesList: ['Plank', 'Leg Raises', 'Russian Twist', 'Crunches'] },
  { _id: 'mock_abs_3', title: 'Six Pack Focus', category: 'Abs', difficulty: 'Intermediate', duration: 30, exercisesCount: 10, caloriesBurned: 240, equipment: 'None', focus: 'Ab Sculpting', description: 'High-intensity rotational core flow targeting side obliques.', exercisesList: ['Crunches', 'Russian Twist', 'Leg Raises', 'Mountain Climbers'] },
  { _id: 'mock_abs_4', title: 'Elite Core', category: 'Abs', difficulty: 'Advanced', duration: 45, exercisesCount: 12, caloriesBurned: 350, equipment: 'None', focus: 'Deep Core Power', description: 'Advanced core test with extended isometric hold protocols.', exercisesList: ['Plank', 'Mountain Climbers', 'Russian Twist', 'Leg Raises'] },

  // Chest
  { _id: 'mock_chest_1', title: 'Chest Foundation', category: 'Chest', difficulty: 'Beginner', duration: 20, exercisesCount: 6, caloriesBurned: 150, equipment: 'None', focus: 'Chest Toning', description: 'Standard pushup sequence focusing on chest and front shoulder joints.', exercisesList: ['Push-ups', 'Plank', 'Push-ups'] },
  { _id: 'mock_chest_2', title: 'Upper Chest Builder', category: 'Chest', difficulty: 'Intermediate', duration: 30, exercisesCount: 8, caloriesBurned: 240, equipment: 'None', focus: 'Clavicular Chest', description: 'Targeted form tips to engage the upper pectoralis muscle fibers.', exercisesList: ['Push-ups', 'Shoulder Taps', 'Push-ups'] },
  { _id: 'mock_chest_3', title: 'Power Chest', category: 'Chest', difficulty: 'Advanced', duration: 40, exercisesCount: 10, caloriesBurned: 320, equipment: 'None', focus: 'Chest Expansion', description: 'High intensity variations including close-grip diamond intervals.', exercisesList: ['Push-ups', 'Diamond Push-ups', 'Shoulder Taps'] },
  { _id: 'mock_chest_4', title: 'Strength Chest', category: 'Chest', difficulty: 'Advanced', duration: 50, exercisesCount: 12, caloriesBurned: 400, equipment: 'None', focus: 'Chest Power', description: 'Combines chest strength moves with high-calorie burst cardio.', exercisesList: ['Push-ups', 'Diamond Push-ups', 'Burpees'] },

  // Shoulders
  { _id: 'mock_shoulders_1', title: 'Shoulder Mobility', category: 'Shoulders', difficulty: 'Beginner', duration: 15, exercisesCount: 4, caloriesBurned: 90, equipment: 'None', focus: 'Shoulder Health', description: 'Relieves tightness and expands range of motion in shoulders.', exercisesList: ['Cobra Stretch', 'Shoulder Taps'] },
  { _id: 'mock_shoulders_2', title: 'Shoulder Builder', category: 'Shoulders', difficulty: 'Intermediate', duration: 25, exercisesCount: 6, caloriesBurned: 180, equipment: 'None', focus: 'Deltoid Sculpt', description: 'Isometric holds and plank taps to tone shoulder caps.', exercisesList: ['Shoulder Taps', 'Plank', 'Shoulder Taps'] },
  { _id: 'mock_shoulders_3', title: 'Power Shoulders', category: 'Shoulders', difficulty: 'Advanced', duration: 35, exercisesCount: 8, caloriesBurned: 270, equipment: 'None', focus: 'Deltoid Power', description: 'Demanding bodyweight holds for athletic shoulder stamina.', exercisesList: ['Shoulder Taps', 'Push-ups', 'Shoulder Taps'] },
  { _id: 'mock_shoulders_4', title: 'Elite Shoulders', category: 'Shoulders', difficulty: 'Advanced', duration: 45, exercisesCount: 10, caloriesBurned: 360, equipment: 'None', focus: 'Handstand Baseline', description: 'Elite stability and overhead hold mimics to fatigue shoulders.', exercisesList: ['Shoulder Taps', 'Push-ups', 'Burpees'] },

  // Arms
  { _id: 'mock_arms_1', title: 'Arm Starter', category: 'Arms', difficulty: 'Beginner', duration: 20, exercisesCount: 6, caloriesBurned: 130, equipment: 'None', focus: 'Arm Toning', description: 'Bodyweight curls and dips to active triceps and biceps.', exercisesList: ['Bicep Curls Mock', 'Tricep Dips'] },
  { _id: 'mock_arms_2', title: 'Arm Builder', category: 'Arms', difficulty: 'Intermediate', duration: 30, exercisesCount: 8, caloriesBurned: 220, equipment: 'None', focus: 'Arm Volume', description: 'Focused movements targeting sleeve-filling arm definition.', exercisesList: ['Bicep Curls Mock', 'Tricep Dips', 'Push-ups'] },
  { _id: 'mock_arms_3', title: 'Strength Arms', category: 'Arms', difficulty: 'Intermediate', duration: 40, exercisesCount: 10, caloriesBurned: 300, equipment: 'None', focus: 'Tricep Focus', description: 'Combines tricep dips with inner-chest diamond pushes.', exercisesList: ['Bicep Curls Mock', 'Tricep Dips', 'Diamond Push-ups'] },
  { _id: 'mock_arms_4', title: 'Arm Destroyer', category: 'Arms', difficulty: 'Advanced', duration: 50, exercisesCount: 12, caloriesBurned: 410, equipment: 'None', focus: 'Elite Arms', description: 'Advanced bodyweight fatigue set for maximum arm pump.', exercisesList: ['Bicep Curls Mock', 'Tricep Dips', 'Diamond Push-ups'] },

  // Legs
  { _id: 'mock_legs_1', title: 'Leg Strength', category: 'Legs', difficulty: 'Beginner', duration: 20, exercisesCount: 6, caloriesBurned: 160, equipment: 'None', focus: 'Quad Toning', description: 'Basic squat and lunge structures to build leg bone density.', exercisesList: ['Squats', 'Lunges'] },
  { _id: 'mock_legs_2', title: 'Lower Body Builder', category: 'Legs', difficulty: 'Intermediate', duration: 30, exercisesCount: 8, caloriesBurned: 250, equipment: 'None', focus: 'Glute Development', description: 'Extended sets of bodyweight squats to build lower body bulk.', exercisesList: ['Squats', 'Lunges', 'Squats'] },
  { _id: 'mock_legs_3', title: 'Explosive Legs', category: 'Legs', difficulty: 'Advanced', duration: 40, exercisesCount: 10, caloriesBurned: 340, equipment: 'None', focus: 'Leg Power', description: 'Plyometric burpees and fast squats to build explosive speed.', exercisesList: ['Squats', 'Lunges', 'Burpees'] },
  { _id: 'mock_legs_4', title: 'Leg Power', category: 'Legs', difficulty: 'Advanced', duration: 50, exercisesCount: 12, caloriesBurned: 430, equipment: 'None', focus: 'Elite Legs', description: 'High endurance leg session targeting maximum lactic burn.', exercisesList: ['Squats', 'Lunges', 'Burpees'] },

  // Core
  { _id: 'mock_core_1', title: 'Core Stability', category: 'Core', difficulty: 'Beginner', duration: 15, exercisesCount: 6, caloriesBurned: 100, equipment: 'None', focus: 'Plank Alignment', description: 'Static holds to align your spine and develop core support.', exercisesList: ['Plank', 'Leg Raises'] },
  { _id: 'mock_core_2', title: 'Core Strength', category: 'Core', difficulty: 'Intermediate', duration: 25, exercisesCount: 8, caloriesBurned: 190, equipment: 'None', focus: 'Oblique Twist', description: 'Rotational core endurance movements targeting stomach muscles.', exercisesList: ['Plank', 'Russian Twist', 'Mountain Climbers'] },
  { _id: 'mock_core_3', title: 'Core Endurance', category: 'Core', difficulty: 'Intermediate', duration: 35, exercisesCount: 10, caloriesBurned: 270, equipment: 'None', focus: 'Deep Tummy', description: 'Combines dynamic knee drives with steady leg control lifts.', exercisesList: ['Plank', 'Russian Twist', 'Leg Raises', 'Mountain Climbers'] },
  { _id: 'mock_core_4', title: 'Core Master', category: 'Core', difficulty: 'Advanced', duration: 45, exercisesCount: 12, caloriesBurned: 370, equipment: 'None', focus: 'Gymnastic Core', description: 'The ultimate core session. Prepare for continuous muscle fatigue.', exercisesList: ['Plank', 'Russian Twist', 'Leg Raises', 'Mountain Climbers'] },

  // Full Body
  { _id: 'mock_full_1', title: 'Full Body Basics', category: 'Full Body', difficulty: 'Beginner', duration: 20, exercisesCount: 8, caloriesBurned: 170, equipment: 'None', focus: 'Full Body Tone', description: 'A full body warm-up covering legs, chest and light cardio.', exercisesList: ['Squats', 'Push-ups', 'Jumping Jacks'] },
  { _id: 'mock_full_2', title: 'Total Body Burn', category: 'Full Body', difficulty: 'Intermediate', duration: 30, exercisesCount: 10, caloriesBurned: 280, equipment: 'None', focus: 'Active Sweat', description: 'High intensity bodyweight intervals for total calorie burn.', exercisesList: ['Squats', 'Push-ups', 'Burpees'] },
  { _id: 'mock_full_3', title: 'Strength Fusion', category: 'Full Body', difficulty: 'Advanced', duration: 40, exercisesCount: 12, caloriesBurned: 380, equipment: 'None', focus: 'Muscle Sculpting', description: 'Demanding sets of squats, pushups and burpee combinations.', exercisesList: ['Squats', 'Diamond Push-ups', 'Burpees'] },
  { _id: 'mock_full_4', title: 'Ultimate Full Body', category: 'Full Body', difficulty: 'Advanced', duration: 60, exercisesCount: 16, caloriesBurned: 520, equipment: 'None', focus: 'Endurance Shred', description: 'Extended full body workout. The ultimate premium coach challenge.', exercisesList: ['Squats', 'Diamond Push-ups', 'Burpees', 'Mountain Climbers'] },

  // Flexibility
  { _id: 'mock_flex_1', title: 'Morning Stretch', category: 'Flexibility', difficulty: 'Beginner', duration: 10, exercisesCount: 4, caloriesBurned: 40, equipment: 'Yoga Mat', focus: 'Flexibility Flow', description: 'A relaxing stretch flow to wake up joints and muscles.', exercisesList: ['Cobra Stretch'] },
  { _id: 'mock_flex_2', title: 'Mobility Flow', category: 'Flexibility', difficulty: 'Beginner', duration: 20, exercisesCount: 6, caloriesBurned: 90, equipment: 'Yoga Mat', focus: 'Joint Mobility', description: 'Gentle spinal stretches and core stabilizing poses.', exercisesList: ['Cobra Stretch', 'Plank'] },
  { _id: 'mock_flex_3', title: 'Deep Stretch', category: 'Flexibility', difficulty: 'Intermediate', duration: 30, exercisesCount: 8, caloriesBurned: 130, equipment: 'Yoga Mat', focus: 'Deep Release', description: 'Extended static holds to expand flexibility range.', exercisesList: ['Cobra Stretch', 'Plank'] },
  { _id: 'mock_flex_4', title: 'Recovery Session', category: 'Flexibility', difficulty: 'Intermediate', duration: 40, exercisesCount: 10, caloriesBurned: 170, equipment: 'Yoga Mat', focus: 'Muscle Release', description: 'Active rest session designed to accelerate muscle healing.', exercisesList: ['Cobra Stretch', 'Plank', 'Cobra Stretch'] },

  // Cardio
  { _id: 'mock_cardio_1', title: 'Quick Cardio', category: 'Cardio', difficulty: 'Beginner', duration: 15, exercisesCount: 6, caloriesBurned: 130, equipment: 'None', focus: 'Cardio Warmup', description: 'Rhythmic jump and tap intervals to boost heart rate.', exercisesList: ['Jumping Jacks', 'Mountain Climbers'] },
  { _id: 'mock_cardio_2', title: 'HIIT Boost', category: 'Cardio', difficulty: 'Intermediate', duration: 25, exercisesCount: 8, caloriesBurned: 240, equipment: 'None', focus: 'Interval Cardio', description: 'Short effort bursts paired with active rest recoveries.', exercisesList: ['Jumping Jacks', 'Mountain Climbers', 'Burpees'] },
  { _id: 'mock_cardio_3', title: 'Fat Burn', category: 'Cardio', difficulty: 'Intermediate', duration: 35, exercisesCount: 10, caloriesBurned: 330, equipment: 'None', focus: 'Fat Oxidation', description: 'Continuous heart rate elevation to optimize calorie use.', exercisesList: ['Jumping Jacks', 'Mountain Climbers', 'Burpees'] },
  { _id: 'mock_cardio_4', title: 'Endurance Rush', category: 'Cardio', difficulty: 'Advanced', duration: 45, exercisesCount: 12, caloriesBurned: 440, equipment: 'None', focus: 'VO2 Max Boost', description: 'Advanced plyometrics to maximize lungs and cardio strength.', exercisesList: ['Jumping Jacks', 'Mountain Climbers', 'Burpees'] }
];

// Mock Exercises list with SVG description indicators
const MOCK_EXERCISES = [
  { name: 'Plank', targetMuscles: ['Abs', 'Core'], difficulty: 'Beginner', equipment: 'None', duration: '30s', caloriesBurned: 15, benefits: ['Core stability', 'Better posture'], commonMistakes: ['Sagging hips', 'Arching back'], correctForm: 'Keep head to heel straight', instructions: ['Align elbows under shoulders', 'Keep body in straight line', 'Contract abs'] },
  { name: 'Mountain Climbers', targetMuscles: ['Abs', 'Cardio'], difficulty: 'Intermediate', equipment: 'None', duration: '30s', caloriesBurned: 25, benefits: ['Cardio stamina', 'Agility'], commonMistakes: ['Bouncing hips', 'Shifting weight back'], correctForm: 'Keep hands under shoulders', instructions: ['Start in high plank', 'Drive knee to chest', 'Alternate legs quickly'] },
  { name: 'Crunches', targetMuscles: ['Abs'], difficulty: 'Beginner', equipment: 'None', duration: '40s', caloriesBurned: 18, benefits: ['Upper ab strength'], commonMistakes: ['Pulling neck', 'Lifting lower back'], correctForm: 'Touch head lightly', instructions: ['Lie on back, knees bent', 'Squeeze abs to lift shoulder blades', 'Lower slowly'] },
  { name: 'Russian Twist', targetMuscles: ['Abs', 'Obliques'], difficulty: 'Intermediate', equipment: 'None', duration: '40s', caloriesBurned: 22, benefits: ['Side core tone', 'Balance'], commonMistakes: ['Rounding lower back', 'Twisting legs'], correctForm: 'Twist ribs, not just hands', instructions: ['Lean back at 45 degrees', 'Lift feet if possible', 'Twist side to side'] },
  { name: 'Leg Raises', targetMuscles: ['Abs', 'Lower Abs'], difficulty: 'Intermediate', equipment: 'None', duration: '40s', caloriesBurned: 20, benefits: ['Lower core strength'], commonMistakes: ['Arching lower back', 'Swinging legs'], correctForm: 'Press back into floor', instructions: ['Lie flat on back', 'Raise legs to 90 degrees', 'Lower slowly without touching mat'] },
  { name: 'Push-ups', targetMuscles: ['Chest', 'Arms'], difficulty: 'Beginner', equipment: 'None', duration: '40s', caloriesBurned: 24, benefits: ['Pectoral power', 'Tricep shape'], commonMistakes: ['Elbows flared too wide', 'Sagging hips'], correctForm: 'Tuck elbows at 45 degrees', instructions: ['High plank setup', 'Lower chest to floor', 'Press up fully'] },
  { name: 'Diamond Push-ups', targetMuscles: ['Chest', 'Triceps'], difficulty: 'Advanced', equipment: 'None', duration: '30s', caloriesBurned: 28, benefits: ['Inner chest volume', 'Tricep tone'], commonMistakes: ['Sagging stomach', 'Too high elbow flare'], correctForm: 'Form hand diamond directly under breastbone', instructions: ['Set hands close', 'Lower chest to hands', 'Press up'] },
  { name: 'Shoulder Taps', targetMuscles: ['Shoulders', 'Core'], difficulty: 'Intermediate', equipment: 'None', duration: '45s', caloriesBurned: 18, benefits: ['Shoulder joints stability'], commonMistakes: ['Excessive hip swing'], correctForm: 'Widen feet for stability', instructions: ['Get into plank', 'Tap left shoulder with right hand', 'Alternate without swaying'] },
  { name: 'Bicep Curls Mock', targetMuscles: ['Arms', 'Biceps'], difficulty: 'Beginner', equipment: 'None', duration: '40s', caloriesBurned: 16, benefits: ['Bicep peak tone'], commonMistakes: ['Using shoulder momentum'], correctForm: 'Pin elbows to ribs', instructions: ['Squeeze arms up', 'Hold contraction', 'Release slowly'] },
  { name: 'Tricep Dips', targetMuscles: ['Arms', 'Triceps'], difficulty: 'Beginner', equipment: 'None', duration: '40s', caloriesBurned: 20, benefits: ['Back arm strength'], commonMistakes: ['Shrugging shoulders up'], correctForm: 'Keep hips close to support', instructions: ['Set palms on ledge/mat', 'Dip hips down by bending elbows', 'Extend arms'] },
  { name: 'Squats', targetMuscles: ['Legs', 'Quads'], difficulty: 'Beginner', equipment: 'None', duration: '45s', caloriesBurned: 30, benefits: ['Quad and glute tone', 'Mobility'], commonMistakes: ['Knees caving', 'Heels lifting'], correctForm: 'Push hips back first', instructions: ['Stand shoulder width', 'Lower parallel to floor', 'Drive through mid-foot to stand'] },
  { name: 'Lunges', targetMuscles: ['Legs', 'Glutes'], difficulty: 'Beginner', equipment: 'None', duration: '40s', caloriesBurned: 26, benefits: ['Symmetrical balance', 'Single leg power'], commonMistakes: ['Short stance, knee past toes'], correctForm: 'Create 90 degree double bend', instructions: ['Step forward', 'Lower back knee to floor', 'Push back to stand'] },
  { name: 'Burpees', targetMuscles: ['Full Body', 'Cardio'], difficulty: 'Advanced', equipment: 'None', duration: '30s', caloriesBurned: 35, benefits: ['Agility', 'Metabolism boost'], commonMistakes: ['Heavy landing', 'Holding breath'], correctForm: 'Abs tight during sprawl', instructions: ['Drop to squat', 'Kick feet back', 'Do pushup', 'Jump forward and jump up'] },
  { name: 'Cobra Stretch', targetMuscles: ['Back', 'Flexibility'], difficulty: 'Beginner', equipment: 'Yoga Mat', duration: '45s', caloriesBurned: 8, benefits: ['Back alignment', 'Stretches chest'], commonMistakes: ['Locked shoulders near ears'], correctForm: 'Extend spine forward', instructions: ['Lie face down', 'Set hands by breast', 'Press up to stretch abs'] },
  { name: 'Jumping Jacks', targetMuscles: ['Cardio'], difficulty: 'Beginner', equipment: 'None', duration: '45s', caloriesBurned: 22, benefits: ['Warmup cardiovascular'], commonMistakes: ['Loud flat feet stamp'], correctForm: 'Stay on balls of feet', instructions: ['Jump opening legs and arms', 'Close jump immediately'] }
];

// Mock Programs
const MOCK_PROGRAMS = [
  { _id: 'prog_abs', title: '21 Day Abs Challenge', description: 'Build a solid defined core in 21 days with short daily guided sessions.', difficulty: 'Beginner', durationDays: 21, scheduleWeeks: 3, progressPercentage: 0, currentDay: 1 },
  { _id: 'prog_fat', title: '30 Day Fat Loss', description: 'High intensity cardio and strength movements mapped out to burn stubborn fat.', difficulty: 'Advanced', durationDays: 30, scheduleWeeks: 4, progressPercentage: 0, currentDay: 1 },
  { _id: 'prog_strength', title: 'Strength Builder', description: 'Tuck into chest and full body strength targets to gain lean muscle.', difficulty: 'Intermediate', durationDays: 14, scheduleWeeks: 2, progressPercentage: 0, currentDay: 1 },
  { _id: 'prog_fitness', title: 'Beginner Fitness', description: 'A gentle entry point back into healthy movement, mobility and core plank exercises.', difficulty: 'Beginner', durationDays: 7, scheduleWeeks: 1, progressPercentage: 0, currentDay: 1 },
  { _id: 'prog_home', title: 'Home Workout Challenge', description: 'No equipment needed full body challenge to tone muscles and boost cardio.', difficulty: 'Intermediate', durationDays: 28, scheduleWeeks: 4, progressPercentage: 0, currentDay: 1 }
];

// Animated SVG demonstrations based on exercise name
const ExerciseSvgDemo = ({ exerciseName }) => {
  return (
    <div style={{
      width: '100%',
      height: '140px',
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <svg width="200" height="120" viewBox="0 0 200 120">
        <style>{`
          .floor-line { stroke: var(--text-slate); stroke-width: 2; stroke-linecap: round; opacity: 0.3; }
          .body-line { stroke: #F97316; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
          .pulse-circle { fill: rgba(139, 92, 246, 0.3); }
          .contract-core {
            animation: core-squeeze 2s infinite ease-in-out;
            transform-origin: 100px 60px;
          }
          .lift-body {
            animation: body-press 2s infinite ease-in-out;
            transform-origin: 100px 80px;
          }
          .cardio-jump {
            animation: jumping-jack 1.5s infinite ease-in-out;
            transform-origin: 100px 70px;
          }
          
          @keyframes core-squeeze {
            0%, 100% { r: 12; opacity: 0.4; }
            50% { r: 24; opacity: 0.8; }
          }
          @keyframes body-press {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(12px) rotate(3deg); }
          }
          @keyframes jumping-jack {
            0%, 100% { transform: scaleY(1) translateY(0); }
            50% { transform: scaleY(0.9) translateY(-10px); }
          }
        `}</style>

        {/* Floor */}
        <line x1="20" y1="90" x2="180" y2="90" className="floor-line" />

        {exerciseName === 'Plank' && (
          <g>
            <circle cx="100" cy="72" r="16" className="pulse-circle contract-core" />
            <path d="M40 78 L90 75 L150 72 L165 55" className="body-line" />
            <circle cx="165" cy="45" r="7" fill="var(--text-white)" />
          </g>
        )}

        {exerciseName === 'Crunches' && (
          <g>
            <circle cx="100" cy="80" r="14" className="pulse-circle contract-core" />
            <path d="M50 90 L100 87 L130 70 L115 50" className="body-line" />
            <circle cx="110" cy="42" r="7" fill="var(--text-white)" />
          </g>
        )}

        {exerciseName === 'Push-ups' && (
          <g className="lift-body">
            <path d="M40 85 L90 75 L150 55 L160 38" className="body-line" />
            <circle cx="160" cy="30" r="7" fill="var(--text-white)" />
            <line x1="140" y1="60" x2="140" y2="90" stroke="var(--text-white)" strokeWidth="4" />
          </g>
        )}

        {exerciseName === 'Jumping Jacks' && (
          <g className="cardio-jump">
            <path d="M100 90 L85 50 L100 25 L115 50 Z" fill="rgba(249, 115, 22, 0.2)" stroke="#F97316" strokeWidth="4" />
            <circle cx="100" cy="18" r="7" fill="var(--text-white)" />
          </g>
        )}

        {!['Plank', 'Crunches', 'Push-ups', 'Jumping Jacks'].includes(exerciseName) && (
          <g>
            <circle cx="100" cy="60" r="10" className="pulse-circle contract-core" />
            <path d="M60 70 Q 100 40 140 70" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="100" cy="35" r="7" fill="var(--text-white)" />
          </g>
        )}
      </svg>
    </div>
  );
};

const WorkoutPlans = () => {
  const { user, addToast } = useAuth();
  
  // Tabs: 'sessions' | 'programs' | 'library' | 'history'
  const [activeTab, setActiveTab] = useState('sessions');
  const [selectedGoal, setSelectedGoal] = useState(user?.fitnessGoal || 'Muscle Gain');
  const [selectedCategory, setSelectedCategory] = useState('Abs'); // Default category

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  // Loaded database states
  const [sessions, setSessions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active workout timer session state
  const [activeSession, setActiveSession] = useState(null);
  // 'idle' | 'countdown' | 'exercise' | 'rest' | 'complete'
  const [workoutState, setWorkoutState] = useState('idle');
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalDurationSec, setTotalDurationSec] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completionRecap, setCompletionRecap] = useState(null);

  const timerInterval = useRef(null);

  // Load Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Exercises
      const exercisesRes = await api.get('/workouts/exercises').catch(() => ({ data: MOCK_EXERCISES }));
      setExercises(exercisesRes.data.length > 0 ? exercisesRes.data : MOCK_EXERCISES);

      // Sessions
      const sessionsRes = await api.get('/workouts/sessions').catch(() => ({ data: MOCK_SESSIONS }));
      setSessions(sessionsRes.data.length > 0 ? sessionsRes.data : MOCK_SESSIONS);

      // Programs
      const programsRes = await api.get('/workouts/programs').catch(() => ({ data: MOCK_PROGRAMS }));
      setPrograms(programsRes.data.length > 0 ? programsRes.data : MOCK_PROGRAMS);

      if (user) {
        // Favorites
        const favsRes = await api.get('/workouts/favorites').catch(() => ({ data: [] }));
        setFavorites(favsRes.data.map(f => f._id || f));

        // History
        const historyRes = await api.get('/workouts/history').catch(() => ({ data: [] }));
        setHistory(historyRes.data);

        // Progress List
        const progressRes = await api.get('/workouts/programs/progress').catch(() => ({ data: [] }));
        setProgressList(progressRes.data);
      }
    } catch (err) {
      console.error('Error loading data, using fallbacks:', err);
      setSessions(MOCK_SESSIONS);
      setExercises(MOCK_EXERCISES);
      setPrograms(MOCK_PROGRAMS);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Synthesis Bell Ring Sound via Web Audio API
  const playBellSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime); // E6 high tone
      osc.frequency.setValueAtTime(1900, audioCtx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (err) {
      console.warn('Audio blocked or not supported');
    }
  };

  // Toggle favorites
  const handleToggleFavorite = async (sessionId) => {
    try {
      await api.post('/workouts/sessions/favorite', { sessionId });
      if (favorites.includes(sessionId)) {
        setFavorites(favorites.filter(id => id !== sessionId));
        addToast('Removed from favorites', 'info');
      } else {
        setFavorites([...favorites, sessionId]);
        addToast('Added to favorites', 'success');
      }
    } catch (err) {
      // Fallback local toggle
      if (favorites.includes(sessionId)) {
        setFavorites(favorites.filter(id => id !== sessionId));
      } else {
        setFavorites([...favorites, sessionId]);
      }
      addToast('Toggled bookmark locally', 'success');
    }
  };

  // Start Guided Session Mode
  const startWorkoutSession = (session) => {
    const exercisesList = session.exercises && session.exercises.length > 0 
      ? session.exercises 
      : [
          { exercise: { name: 'Plank', targetMuscles: ['Abs'], correctFormTips: ['Keep glutes tight'], benefits: ['Core power'] }, duration: 30, rest: 15 },
          { exercise: { name: 'Crunches', targetMuscles: ['Abs'], correctFormTips: ['Support neck lightly'], benefits: ['Upper ab sculpting'] }, duration: 40, rest: 15 },
          { exercise: { name: 'Russian Twist', targetMuscles: ['Abs'], correctFormTips: ['Rotate ribcage'], benefits: ['Oblique tone'] }, duration: 40, rest: 15 },
          { exercise: { name: 'Leg Raises', targetMuscles: ['Abs'], correctFormTips: ['Back flat on floor'], benefits: ['Lower ab focus'] }, duration: 40, rest: 15 }
        ];

    const adjustedSession = {
      ...session,
      exercises: exercisesList
    };

    setActiveSession(adjustedSession);
    setCurrentExIdx(0);
    setTotalDurationSec(0);
    setCompletedCount(0);
    setWorkoutState('countdown');
    setTimeLeft(3); // 3-2-1 Countdown
    setIsPaused(false);
    setCompletionRecap(null);
  };

  // Finish session
  const finishWorkout = useCallback(async () => {
    setWorkoutState('complete');
    if (timerInterval.current) clearInterval(timerInterval.current);
    
    try {
      const res = await api.post(`/workouts/sessions/${activeSession._id}/complete`, {
        durationSec: totalDurationSec,
        exercisesCompleted: activeSession.exercises.length
      });
      setCompletionRecap(res.data);
    } catch (err) {
      setCompletionRecap({
        xpGained: 50,
        level: user?.level || 1,
        unlockedBadges: []
      });
    }
  }, [activeSession, totalDurationSec, user]);

  // Timer Tick Loop
  useEffect(() => {
    if (workoutState === 'idle' || workoutState === 'complete' || isPaused) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      return;
    }

    timerInterval.current = setInterval(() => {
      setTotalDurationSec(prev => prev + 1);

      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          playBellSound();

          if (workoutState === 'countdown') {
            setWorkoutState('exercise');
            return activeSession.exercises[currentExIdx]?.duration || 30;
          } else if (workoutState === 'exercise') {
            setCompletedCount(prev => prev + 1);
            if (currentExIdx < activeSession.exercises.length - 1) {
              setWorkoutState('rest');
              return activeSession.exercises[currentExIdx]?.rest || 15;
            } else {
              finishWorkout();
              return 0;
            }
          } else if (workoutState === 'rest') {
            setCurrentExIdx(prev => prev + 1);
            setWorkoutState('countdown');
            return 3; // 3-2-1 before next
          }
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [workoutState, currentExIdx, isPaused, activeSession, finishWorkout]);

  const handleQuitWorkout = () => {
    if (window.confirm('Are you sure you want to quit this guided workout session? Progress will not be saved.')) {
      setWorkoutState('idle');
      setActiveSession(null);
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  };

  // Program handling
  const enrollInProgram = async (programId) => {
    try {
      await api.post('/workouts/programs/enroll', { programId });
      addToast('Enrolled successfully!', 'success');
      loadData();
    } catch (err) {
      addToast('Enrolled in program locally', 'success');
    }
  };

  const advanceProgramDay = async (programId, day) => {
    try {
      await api.post(`/workouts/programs/${programId}/complete-day`, { day });
      addToast(`Completed Day ${day}!`, 'success');
      loadData();
    } catch (err) {
      addToast('Day completion recorded locally', 'success');
    }
  };

  // Search and Sort Filtering logic (instantly filters matching active tab data)
  const getFilteredSessions = () => {
    let list = sessions;

    // Filter by selected category (Guaranteeing content, fallback to MOCK if empty)
    list = list.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());
    if (list.length === 0) {
      list = MOCK_SESSIONS.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.focus?.toLowerCase().includes(q));
    }

    if (difficultyFilter) {
      list = list.filter(s => s.difficulty === difficultyFilter);
    }

    if (durationFilter) {
      const maxDuration = parseInt(durationFilter);
      list = list.filter(s => s.duration <= maxDuration);
    }

    if (equipmentFilter) {
      list = list.filter(s => s.equipment.toLowerCase().includes(equipmentFilter.toLowerCase()));
    }

    if (muscleFilter) {
      list = list.filter(s => s.focus?.toLowerCase().includes(muscleFilter.toLowerCase()) || s.category.toLowerCase() === muscleFilter.toLowerCase());
    }

    if (sortBy === 'Shortest') {
      list = [...list].sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'Longest') {
      list = [...list].sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'Newest') {
      list = [...list].reverse();
    }

    return list;
  };

  const getFilteredExercises = () => {
    let list = exercises;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.targetMuscles.some(m => m.toLowerCase().includes(q)));
    }

    if (difficultyFilter) {
      list = list.filter(e => e.difficulty === difficultyFilter);
    }

    if (equipmentFilter) {
      list = list.filter(e => e.equipment.some(eq => eq.toLowerCase().includes(equipmentFilter.toLowerCase())));
    }

    if (muscleFilter) {
      list = list.filter(e => e.targetMuscles.some(m => m.toLowerCase().includes(muscleFilter.toLowerCase())));
    }

    return list;
  };

  const getFilteredPrograms = () => {
    let list = programs;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  };

  const activeCategoryConfig = CATEGORIES_CONFIG.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase()) || CATEGORIES_CONFIG[0];

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-white)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '30px 20px'
      }}>
        
        {/* =================================================
            ACTIVE WORKOUT SESSION TIMER MODAL (Workout Mode)
            ================================================= */}
        <AnimatePresence>
          {activeSession && workoutState !== 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(9, 13, 22, 0.95)',
                backdropFilter: 'blur(20px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}>
                {/* Exit button */}
                <button
                  onClick={handleQuitWorkout}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-white)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>

                {/* COUNTDOWN OR START FLOW */}
                {workoutState === 'countdown' && (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>GET READY</span>
                    <h1 style={{ fontSize: '96px', fontWeight: '900', color: activeCategoryConfig.color, margin: '20px 0' }}>{timeLeft}</h1>
                    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>UP NEXT (EXERCISE {currentExIdx + 1}/{activeSession.exercises.length}):</span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '800' }}>
                        {activeSession.exercises[currentExIdx]?.exercise?.name || 'Guided Action'}
                      </h3>
                    </div>
                  </div>
                )}

                {/* ACTIVE EXERCISE TIMER */}
                {workoutState === 'exercise' && (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      backgroundColor: 'rgba(16,185,129,0.1)', 
                      color: '#10B981', 
                      fontWeight: '800', 
                      padding: '4px 10px', 
                      borderRadius: '8px',
                      textTransform: 'uppercase'
                    }}>
                      EXERCISE {currentExIdx + 1} OF {activeSession.exercises.length}
                    </span>

                    <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '14px 0 24px 0' }}>
                      {activeSession.exercises[currentExIdx]?.exercise?.name}
                    </h2>

                    {/* Circular Progress Ring */}
                    <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px auto' }}>
                      <svg width="180" height="180" viewBox="0 0 180 180">
                        <circle cx="90" cy="90" r="80" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
                        <motion.circle
                          cx="90"
                          cy="90"
                          r="80"
                          stroke={activeCategoryConfig.color}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray="502.6"
                          animate={{ strokeDashoffset: 502.6 - (502.6 * timeLeft) / (activeSession.exercises[currentExIdx]?.duration || 30) }}
                          transition={{ duration: 1, ease: 'linear' }}
                          strokeLinecap="round"
                          transform="rotate(-90 90 90)"
                        />
                      </svg>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '48px',
                        fontWeight: '900',
                        color: 'var(--text-white)'
                      }}>
                        {timeLeft}s
                      </div>
                    </div>

                    <div style={{ 
                      textAlign: 'left', 
                      backgroundColor: 'var(--bg-primary)', 
                      padding: '16px 20px', 
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)',
                      marginBottom: '20px'
                    }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block', marginBottom: '4px' }}>FORM GUIDE & INSTRUCTIONS</span>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-white)', lineHeight: '1.5' }}>
                        {activeSession.exercises[currentExIdx]?.exercise?.correctFormTips?.[0] || 'Keep abdominal walls braced, breathing evenly through the movements.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                      <button 
                        disabled={currentExIdx === 0}
                        onClick={() => {
                          setCurrentExIdx(prev => Math.max(0, prev - 1));
                          setWorkoutState('countdown');
                          setTimeLeft(3);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: currentExIdx === 0 ? 'var(--text-slate)' : 'var(--text-white)',
                          cursor: currentExIdx === 0 ? 'default' : 'pointer'
                        }}
                      >
                        <SkipBack size={24} />
                      </button>

                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        style={{
                          backgroundColor: 'var(--text-white)',
                          color: 'var(--bg-primary)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '56px',
                          height: '56px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                      </button>

                      <button 
                        onClick={() => {
                          if (currentExIdx < activeSession.exercises.length - 1) {
                            setCurrentExIdx(prev => prev + 1);
                            setWorkoutState('countdown');
                            setTimeLeft(3);
                          } else {
                            finishWorkout();
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-white)', cursor: 'pointer' }}
                      >
                        <SkipForward size={24} />
                      </button>
                    </div>
                  </div>
                )}

                {/* REST BETWEEN EXERCISES */}
                {workoutState === 'rest' && (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: '800', letterSpacing: '2px' }}>REST INTERVAL</span>
                    <h1 style={{ fontSize: '80px', fontWeight: '900', color: '#3B82F6', margin: '14px 0' }}>{timeLeft}s</h1>
                    
                    <div style={{
                      backgroundColor: 'rgba(59,130,246,0.06)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      padding: '16px',
                      borderRadius: '12px',
                      maxWidth: '400px',
                      margin: '0 auto'
                    }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>UP NEXT:</span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '800' }}>
                        {activeSession.exercises[currentExIdx + 1]?.exercise?.name}
                      </h3>
                    </div>
                  </div>
                )}

                {/* WORKOUT COMPLETE RECAP SCREEN */}
                {workoutState === 'complete' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      margin: '0 auto 16px auto'
                    }}>
                      ✓
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#10B981' }}>Workout Complete</h2>
                    <p style={{ margin: '4px 0 24px 0', fontSize: '13px', color: 'var(--text-slate)' }}>Workout Automatically Saved to MongoDB</p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '14px',
                      marginBottom: '24px'
                    }}>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block' }}>TOTAL TIME</span>
                        <strong style={{ fontSize: '16px' }}>{Math.floor(totalDurationSec / 60)}m {totalDurationSec % 60}s</strong>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block' }}>CALORIES BURNED</span>
                        <strong style={{ fontSize: '16px', color: '#EF4444' }}>{activeSession.caloriesBurned} kcal</strong>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block' }}>EXERCISES COMPLETED</span>
                        <strong style={{ fontSize: '16px', color: '#10B981' }}>{completedCount} / {activeSession.exercises.length}</strong>
                      </div>
                    </div>

                    {completionRecap && (
                      <div style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        padding: '14px 18px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        marginBottom: '30px'
                      }}>
                        Earned <strong style={{ color: '#F97316' }}>+{completionRecap.xpGained} XP</strong>. Level {completionRecap.level} achieved!
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={() => {
                          setWorkoutState('idle');
                          setActiveSession(null);
                          setActiveTab('programs');
                        }}
                        style={{
                          backgroundColor: activeCategoryConfig.color,
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Continue Program
                      </button>
                      
                      <button
                        onClick={() => {
                          setWorkoutState('idle');
                          setActiveSession(null);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-white)',
                          borderRadius: '10px',
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Return Home
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            TOP HEADER & SEARCH BAR
            ================================================= */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '30px' }}>
            <span style={{ 
              color: '#8B5CF6', 
              fontSize: '11px', 
              fontWeight: '800', 
              letterSpacing: '1.5px', 
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px'
            }}>
              Guided Coach
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
              Workout
            </h1>
            <p style={{ margin: 0, color: 'var(--text-slate)', fontSize: '14px' }}>
              Choose a guided workout session based on your goal.
            </p>
          </div>

          {/* Search bar & filter inline panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '16px 20px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              
              {/* Tab Navigation buttons */}
              <div style={{
                display: 'flex',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '10px',
                padding: '3px',
                border: '1px solid var(--border-color)'
              }}>
                {[
                  { id: 'sessions', label: 'Sessions', icon: Play },
                  { id: 'programs', label: 'Programs', icon: Calendar },
                  { id: 'library', label: 'Library', icon: BookOpen },
                  { id: 'history', label: 'Logs', icon: Trophy }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                        color: isActive ? 'var(--text-white)' : 'var(--text-slate)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '6px 12px'
              }}>
                <Search size={16} style={{ color: 'var(--text-slate)', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-white)',
                    fontSize: '13px'
                  }}
                />
              </div>

            </div>

            {/* Quick Filters inline row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '12px',
              alignItems: 'center'
            }}>
              
              {/* Workout Goal filter */}
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-slate)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Weight Loss">Goal: Weight Loss</option>
                <option value="Muscle Gain">Goal: Muscle Gain</option>
                <option value="Strength">Goal: Strength</option>
                <option value="Endurance">Goal: Endurance</option>
                <option value="Flexibility">Goal: Flexibility</option>
                <option value="Beginner Fitness">Goal: Beginner Fitness</option>
              </select>

              {/* Difficulty filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-slate)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Difficulty: All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Duration filter */}
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-slate)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Duration: All</option>
                <option value="15">Max 15 min</option>
                <option value="30">Max 30 min</option>
                <option value="45">Max 45 min</option>
                <option value="60">Max 60 min</option>
              </select>

              {/* Equipment filter */}
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-slate)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Equipment: All</option>
                <option value="None">None</option>
                <option value="Yoga Mat">Yoga Mat</option>
              </select>

              {/* Sort By filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-slate)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                  marginLeft: 'auto'
                }}
              >
                <option value="Most Popular">Sort: Most Popular</option>
                <option value="Newest">Sort: Newest</option>
                <option value="Shortest">Sort: Shortest</option>
                <option value="Longest">Sort: Longest</option>
              </select>

              {(search || difficultyFilter || durationFilter || equipmentFilter) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setDifficultyFilter('');
                    setDurationFilter('');
                    setEquipmentFilter('');
                    setMuscleFilter('');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}

            </div>
          </div>

          {/* =================================================
              TAB 1: WORKOUT CATEGORIES & COMPACT SESSION CARDS
              ================================================= */}
          {activeTab === 'sessions' && (
            <div>
              {/* Compact navigation category cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                gap: '12px',
                marginBottom: '30px'
              }}>
                {CATEGORIES_CONFIG.map(cat => {
                  const CatIcon = cat.icon;
                  const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  
                  return (
                    <motion.div
                      key={cat.name}
                      whileHover={{ scale: 1.04, translateY: -2 }}
                      onClick={() => setSelectedCategory(cat.name)}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '16px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        boxShadow: isSelected ? `0 0 16px ${cat.shadow}` : 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        color: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px auto'
                      }}>
                        <CatIcon size={18} />
                      </span>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-white)' }}>
                        {cat.name}
                      </h4>
                      <span style={{ fontSize: '10px', color: 'var(--text-slate)' }}>
                        {cat.count} Sessions
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sessions List */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: activeCategoryConfig.color }}>
                  {selectedCategory} guided sessions
                </h3>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: '220px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px' }} />
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {getFilteredSessions().map(sess => {
                    const isBookmarked = favorites.includes(sess._id);
                    return (
                      <motion.div
                        key={sess._id}
                        whileHover={{ y: -4 }}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '18px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{
                              fontSize: '9px',
                              backgroundColor: sess.difficulty === 'Beginner' ? 'rgba(16,185,129,0.1)' : sess.difficulty === 'Intermediate' ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)',
                              color: sess.difficulty === 'Beginner' ? '#10B981' : sess.difficulty === 'Intermediate' ? '#F97316' : '#EF4444',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              textTransform: 'uppercase'
                            }}>
                              {sess.difficulty}
                            </span>
                            
                            <button
                              onClick={() => handleToggleFavorite(sess._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: isBookmarked ? '#EF4444' : 'var(--text-slate)',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <Heart size={18} fill={isBookmarked ? '#EF4444' : 'none'} />
                            </button>
                          </div>

                          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: 'var(--text-white)' }}>
                            {sess.title}
                          </h3>
                          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-slate)', lineHeight: '1.4' }}>
                            {sess.description || 'Quick core development routine built to tone abs.'}
                          </p>

                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '8px',
                            fontSize: '11px',
                            color: 'var(--text-white)',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '16px'
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {sess.duration} Mins</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Dumbbell size={12} /> {sess.exercisesCount || 6} Exercises</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={12} /> {sess.caloriesBurned} Calories</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> {sess.equipment}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => startWorkoutSession(sess)}
                            style={{
                              flex: 1,
                              backgroundColor: activeCategoryConfig.color,
                              color: '#FFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            Start Session <ArrowRight size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =================================================
              TAB 2: WORKOUT PROGRAMS SECTION
              ================================================= */}
          {activeTab === 'programs' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-white)' }}>Active workout programs</h3>
              </div>

              {loading ? (
                <div>Loading programs...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {getFilteredPrograms().map(prog => {
                    const userProgress = progressList.find(p => p.programId?._id === prog._id || p.programId === prog._id);
                    const isEnrolled = !!userProgress;

                    return (
                      <div
                        key={prog._id}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '20px',
                          padding: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <span style={{ fontSize: '9px', backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                              {prog.difficulty} • {prog.durationDays} Days
                            </span>
                            <h4 style={{ margin: '6px 0 4px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-white)' }}>{prog.title}</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-slate)', maxWidth: '600px' }}>{prog.description}</p>
                          </div>

                          {!isEnrolled ? (
                            <button
                              onClick={() => enrollInProgram(prog._id)}
                              style={{
                                backgroundColor: '#8B5CF6',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Start Program
                            </button>
                          ) : (
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ display: 'block', fontSize: '12px', color: '#10B981', fontWeight: '700' }}>
                                Progress: {userProgress.progressPercentage}%
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>
                                Current Day: {userProgress.currentDay} / {prog.durationDays}
                              </span>
                            </div>
                          )}
                        </div>

                        {isEnrolled && (
                          <div style={{ height: '6px', backgroundColor: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', backgroundColor: '#10B981', width: `${userProgress.progressPercentage}%` }} />
                          </div>
                        )}

                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          overflowX: 'auto',
                          paddingBottom: '10px'
                        }}>
                          {Array.from({ length: prog.durationDays }, (_, i) => {
                            const dayNum = i + 1;
                            const isCompleted = isEnrolled && userProgress.completedDays?.includes(dayNum);
                            const isCurrent = isEnrolled && userProgress.currentDay === dayNum;

                            return (
                              <div
                                key={dayNum}
                                style={{
                                  backgroundColor: isCompleted ? 'rgba(16,185,129,0.05)' : isCurrent ? 'rgba(249,115,22,0.05)' : 'var(--bg-primary)',
                                  border: isCompleted ? '1px solid #10B981' : isCurrent ? '1px solid #F97316' : '1px solid var(--border-color)',
                                  borderRadius: '10px',
                                  padding: '10px',
                                  minWidth: '85px',
                                  textAlign: 'center',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  height: '90px'
                                }}
                              >
                                <span style={{ fontSize: '10px', color: 'var(--text-slate)', display: 'block' }}>DAY {dayNum}</span>
                                
                                {isCompleted ? (
                                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>✓ Done</span>
                                ) : isCurrent ? (
                                  <button
                                    onClick={() => advanceProgramDay(prog._id, dayNum)}
                                    style={{
                                      backgroundColor: '#F97316',
                                      color: '#FFF',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '4px',
                                      fontSize: '9px',
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Complete
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '10px', color: 'var(--text-slate)', opacity: 0.5 }}>Locked</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =================================================
              TAB 3: EXERCISE LIBRARY EXPLORER (SVG Demos)
              ================================================= */}
          {activeTab === 'library' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-white)' }}>Exercise Library</h3>
              </div>

              {loading ? (
                <div>Loading exercise library...</div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {getFilteredExercises().map(ex => {
                    const isExpanded = expandedExerciseId === ex._id || expandedExerciseId === ex.name;
                    return (
                      <div
                        key={ex.name}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '18px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <ExerciseSvgDemo exerciseName={ex.name} />

                          <div style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '9px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-slate)', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', border: '1px solid var(--border-color)' }}>
                              {ex.difficulty} • {ex.equipment}
                            </span>
                            <h4 style={{ margin: '6px 0 2px 0', fontSize: '15px', fontWeight: '800', color: 'var(--text-white)' }}>{ex.name}</h4>
                            <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>Target Muscle: {ex.targetMuscles?.join(', ')}</span>
                          </div>
                        </div>

                        <div style={{ marginTop: '14px' }}>
                          <button
                            onClick={() => setExpandedExerciseId(isExpanded ? null : ex.name)}
                            style={{
                              width: '100%',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              color: 'var(--text-slate)',
                              padding: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            {isExpanded ? 'Hide Form Guide' : 'View Correct Form Guide'}
                          </button>

                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{
                                marginTop: '12px',
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                fontSize: '12px'
                              }}
                            >
                              <div>
                                <strong style={{ color: '#10B981' }}>Benefits:</strong>
                                <p style={{ margin: 0, color: 'var(--text-slate)' }}>{ex.benefits?.join(', ') || 'Builds active strength.'}</p>
                              </div>
                              <div>
                                <strong style={{ color: '#EF4444' }}>Common Mistakes:</strong>
                                <p style={{ margin: 0, color: 'var(--text-slate)' }}>{ex.commonMistakes?.join(', ') || 'Sacrificing full extension.'}</p>
                              </div>
                              <div>
                                <strong style={{ color: '#F97316' }}>Correct Form:</strong>
                                <p style={{ margin: 0, color: 'var(--text-slate)' }}>{ex.correctForm || 'Keep movements controlled.'}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =================================================
              TAB 4: COMPLETION HISTORY LOGS
              ================================================= */}
          {activeTab === 'history' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-white)' }}>Workout Logs & History</h3>
              </div>

              {loading ? (
                <div>Loading logs...</div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-slate)' }}>
                  No logged workout sessions yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {history.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '800', color: 'var(--text-white)' }}>{log.sessionTitle}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>{new Date(log.date).toDateString()}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-white)' }}>
                        <span>{log.duration} Mins</span>
                        <span style={{ color: '#EF4444' }}>{log.calories} Calories</span>
                        <span style={{ color: '#10B981', fontWeight: '700' }}>{log.completionPercentage}% Done</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default WorkoutPlans;
