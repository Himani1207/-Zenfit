const User = require('../models/User');
const Exercise = require('../models/Exercise');
const WorkoutSession = require('../models/WorkoutSession');
const CompletedWorkout = require('../models/CompletedWorkout');
const WorkoutHistory = require('../models/WorkoutHistory');
const FavoriteWorkout = require('../models/FavoriteWorkout');
const XPService = require('./XPService');
const AchievementService = require('./AchievementService');

class WorkoutSessionService {
  static async getExercises({ search = '', difficulty = '', equipment = '', targetMuscle = '' }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { targetMuscles: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (equipment) {
      query.equipment = { $in: [new RegExp(equipment, 'i')] };
    }

    if (targetMuscle) {
      query.targetMuscles = { $in: [new RegExp(targetMuscle, 'i')] };
    }

    return await Exercise.find(query);
  }

  static async getSessions({ category = '', difficulty = '' }) {
    const query = {};
    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    return await WorkoutSession.find(query).populate('exercises.exercise');
  }

  static async getSessionDetails(id) {
    return await WorkoutSession.findById(id).populate('exercises.exercise');
  }

  static async toggleFavoriteSession(userId, sessionId) {
    const existing = await FavoriteWorkout.findOne({ userId, sessionId });
    if (existing) {
      await FavoriteWorkout.deleteOne({ userId, sessionId });
      return { isFavorite: false, message: 'Removed from bookmarks' };
    } else {
      await FavoriteWorkout.create({ userId, sessionId });
      // Award minor XP (+10 XP) for saving
      const user = await User.findById(userId);
      if (user) {
        const result = XPService.addXP(user, 10);
        await User.updateOne(
          { _id: userId },
          { 
            $set: { 
              level: result.user.level, 
              xp: result.user.xp, 
              xpToNextLevel: result.user.xpToNextLevel 
            } 
          }
        );
        return { 
          isFavorite: true, 
          message: 'Saved to bookmarks', 
          xpGained: 10, 
          leveledUp: result.leveledUp 
        };
      }
      return { isFavorite: true, message: 'Saved to bookmarks' };
    }
  }

  static async getFavoriteSessions(userId) {
    const favs = await FavoriteWorkout.find({ userId });
    const sessionIds = favs.map(f => f.sessionId);
    return await WorkoutSession.find({ _id: { $in: sessionIds } }).populate('exercises.exercise');
  }

  static async getWorkoutHistory(userId) {
    return await WorkoutHistory.find({ userId }).sort({ date: -1 });
  }

  static async completeSession(userId, sessionId, durationSec, exercisesCompleted) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const session = await WorkoutSession.findById(sessionId).populate('exercises.exercise');
    if (!session) throw new Error('Workout session not found');

    // Calculate Completion Percentage
    const totalExercises = session.exercises.length;
    const completionPercentage = totalExercises > 0 
      ? Math.round((exercisesCompleted / totalExercises) * 100) 
      : 100;

    // Calculate Calories Burned (proportional to completion and duration)
    const caloriesBurned = Math.round((session.caloriesBurned * completionPercentage) / 100);

    const xpEarned = session.xpReward;

    // Save logs
    const completedWorkout = await CompletedWorkout.create({
      userId,
      sessionId,
      sessionTitle: session.title,
      timeTaken: durationSec,
      caloriesBurned,
      exercisesCompleted,
      xpEarned
    });

    await WorkoutHistory.create({
      userId,
      sessionId,
      sessionTitle: session.title,
      duration: Math.round(durationSec / 60),
      calories: caloriesBurned,
      completionPercentage
    });

    // Mark daily checklist workout complete
    if (!user.checklist.workout) {
      user.checklist.workout = true;
    }

    // Award XP
    const xpResult = XPService.addXP(user, xpEarned);
    user.level = xpResult.user.level;
    user.xp = xpResult.user.xp;
    user.xpToNextLevel = xpResult.user.xpToNextLevel;

    // Unlock badges check
    let unlockedBadges = [];
    const addBadge = (badgeName) => {
      if (!user.badges.includes(badgeName)) {
        user.badges.push(badgeName);
        unlockedBadges.push(badgeName);
      }
    };

    // First Workout badge
    addBadge('First Workout');

    // Specific category badges
    if (session.category === 'Abs' || session.category === 'Core') {
      addBadge('Abs Master');
    }
    if (session.category === 'Strength') {
      addBadge('Strength Builder');
    }

    // Check milestones (streak level, etc.)
    const milestoneResult = AchievementService.checkMilestones(user);
    unlockedBadges = [...unlockedBadges, ...milestoneResult.unlockedNew];

    // Log Activity
    const ActivityService = require('./ActivityService');
    const { mission, missionCompletedNow } = await ActivityService.syncDailyMission(user, xpEarned);

    await user.save();

    return {
      completedWorkout,
      xpGained: xpEarned,
      leveledUp: xpResult.leveledUp,
      level: user.level,
      xp: user.xp,
      xpToNextLevel: user.xpToNextLevel,
      unlockedBadges,
      streak: user.streak,
      dailyMission: mission,
      missionCompletedNow
    };
  }
}

module.exports = WorkoutSessionService;
