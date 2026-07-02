const User = require('../models/User');
const WorkoutSession = require('../models/WorkoutSession');
const CompletedWorkout = require('../models/CompletedWorkout');
const FavoriteWorkout = require('../models/FavoriteWorkout');
const AchievementService = require('./AchievementService');

class DashboardService {
  static async getDashboardData(userId) {
    const ActivityService = require('./ActivityService');
    let user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Check and reset streak if they missed a day
    user = await ActivityService.checkAndResetStreak(user);

    // Get today's daily mission
    const dailyMission = await ActivityService.getTodayMission(userId);

    // 1. Compute today's progress based on Daily Mission
    const progressPercent = dailyMission.progressPercentage || 0;

    // 2. Recommend Today's Workout Focus based on User Goal
    const goal = user.fitnessGoal || 'Stay Healthy';
    let targetCategory = 'Full Body';
    if (goal === 'Weight Loss') targetCategory = 'Fat Loss';
    else if (goal === 'Muscle Gain') targetCategory = 'Strength';
    else if (goal === 'Strength') targetCategory = 'Strength';
    else if (goal === 'Flexibility') targetCategory = 'Flexibility';
    else if (goal === 'Cardio') targetCategory = 'Cardio';

    let workoutFocus = await WorkoutSession.findOne({ category: targetCategory }).populate('exercises.exercise');
    if (!workoutFocus) {
      workoutFocus = await WorkoutSession.findOne({}).populate('exercises.exercise');
    }

    // 3. Today's Meal Recommendation
    let mealRec = {
      title: 'Avocado Toast with Poached Eggs',
      calories: 380,
      summary: 'High protein, healthy fats to power your workout sessions.'
    };
    if (goal === 'Weight Loss') {
      mealRec = {
        title: 'Grilled Salmon with Steamed Broccoli',
        calories: 320,
        summary: 'Low-carb, high-protein lean dinner for fat loss.'
      };
    } else if (goal === 'Muscle Gain' || goal === 'Strength') {
      mealRec = {
        title: 'Chicken Breast, Sweet Potatoes & Quinoa',
        calories: 580,
        summary: 'Complex carbs and high lean protein to optimize muscle recovery.'
      };
    }

    // 4. Weekly Challenge Status
    const completedDaysCount = (user.weeklyCalendar || []).filter(d => d.completed).length;
    const weeklyChallenge = {
      title: 'Complete 4 active daily checklists',
      current: completedDaysCount,
      goal: 4,
      percentage: Math.min(100, Math.round((completedDaysCount / 4) * 100))
    };

    // 5. Recent Achievement
    let recentAchievement = null;
    if (user.badges && user.badges.length > 0) {
      const lastBadge = user.badges[user.badges.length - 1];
      const details = AchievementService.getBadgeDetails(lastBadge);
      recentAchievement = {
        badgeName: lastBadge,
        description: details.description,
        icon: details.icon,
        xpEarned: 50, // default reward
        unlockedAt: new Date() // mockup or read from User/Achievement schema
      };
    }

    // 6. Generate Dynamic Insights
    const completedWorkoutsCount = await CompletedWorkout.countDocuments({ userId });
    const insights = [];

    insights.push(`Your current active fitness streak is ${user.streak} days.`);
    
    if (completedWorkoutsCount > 0) {
      insights.push(`You have completed ${completedWorkoutsCount} guided workouts on ZenFit!`);
    } else {
      insights.push('Start your first guided workout session today to earn bonus XP!');
    }

    if (user.waterIntake < 2000) {
      insights.push(`Drink ${2000 - user.waterIntake}ml more water today to reach your hydration target.`);
    } else {
      insights.push('Hydration check: You have met your water goal today, fantastic!');
    }

    if (workoutFocus) {
      insights.push(`Your recommended workout today focuses on ${workoutFocus.title}.`);
    }

    insights.push('Try doing 5 minutes of stretching after exercises to reduce muscle soreness.');

    // Pick 3 random insights
    const shuffled = insights.sort(() => 0.5 - Math.random());
    const selectedInsights = shuffled.slice(0, 3);

    // 7. Recent Activity Timeline (Newest first)
    const timeline = [];

    // Get completed workouts
    const workouts = await CompletedWorkout.find({ userId }).sort({ completedAt: -1 }).limit(5);
    workouts.forEach(w => {
      timeline.push({
        time: w.completedAt,
        type: 'workout',
        text: `Completed "${w.sessionTitle}" (+${w.xpEarned} XP)`
      });
    });

    // Get bookmarks
    const favorites = await FavoriteWorkout.find({ userId }).sort({ createdAt: -1 }).limit(3);
    for (const f of favorites) {
      const sess = await WorkoutSession.findById(f.sessionId);
      if (sess) {
        timeline.push({
          time: f.createdAt,
          type: 'bookmark',
          text: `Saved workout session: "${sess.title}"`
        });
      }
    }

    // Get bookings (Disabled)
    const bookings = [];

    // Sort timeline items newest first
    timeline.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Formatted time label helper
    const formattedTimeline = timeline.slice(0, 8).map(t => {
      const diffMs = new Date() - new Date(t.time);
      const diffMins = Math.floor(diffMs / 60000);
      let timeLabel = 'Just now';
      if (diffMins > 0 && diffMins < 60) {
        timeLabel = `${diffMins}m ago`;
      } else if (diffMins >= 60 && diffMins < 1440) {
        timeLabel = `${Math.floor(diffMins / 60)}h ago`;
      } else if (diffMins >= 1440) {
        timeLabel = `${Math.floor(diffMins / 1440)}d ago`;
      }
      return {
        time: timeLabel,
        type: t.type,
        text: t.text
      };
    });

    // Fallback timeline
    if (formattedTimeline.length === 0) {
      formattedTimeline.push({
        time: 'Today',
        type: 'info',
        text: 'Enrolled in ZenFit Premium and set fitness goals!'
      });
    }

    return {
      user: {
        name: user.name,
        fitnessGoal: user.fitnessGoal,
        streak: user.streak,
        currentStreak: user.currentStreak || 0,
        longestStreak: user.longestStreak || 0,
        lastCompletedDate: user.lastCompletedDate || null,
        level: user.level,
        xp: user.xp,
        xpToNextLevel: user.xpToNextLevel,
        badges: user.badges,
        checklist: user.checklist,
        weeklyCalendar: user.weeklyCalendar,
        waterIntake: user.waterIntake,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi
      },
      progressPercent,
      workoutFocus,
      mealRec,
      weeklyChallenge,
      recentAchievement,
      insights: selectedInsights,
      timeline: formattedTimeline,
      dailyMission
    };
  }
}

module.exports = DashboardService;
