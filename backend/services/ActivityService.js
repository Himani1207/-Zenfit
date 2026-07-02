const User = require('../models/User');
const DailyMission = require('../models/DailyMission');

class ActivityService {
  static getTodayString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Fetches or creates today's DailyMission document.
   */
  static async getTodayMission(userId) {
    const todayStr = this.getTodayString();
    let mission = await DailyMission.findOne({ userId, date: todayStr });
    
    if (!mission) {
      mission = await DailyMission.create({
        userId,
        date: todayStr,
        workoutCompleted: false,
        mealCompleted: false,
        programCompleted: false,
        waterCompleted: false,
        stretchCompleted: false,
        sleepCompleted: false,
        progressPercentage: 0,
        missionCompleted: false,
        xpEarned: 0,
        streakOnDay: 0,
        completionTime: null
      });
    }
    
    return mission;
  }

  /**
   * Syncs the user's current checklist state with the DailyMission collection.
   * @param {Object} user User document
   * @param {Number} xpGained XP earned to log
   */
  static async syncDailyMission(user, xpGained = 0) {
    if (!user) return null;
    const userId = user._id;
    const todayStr = this.getTodayString();

    // 1. Get or create today's mission
    let mission = await DailyMission.findOne({ userId, date: todayStr });
    if (!mission) {
      mission = new DailyMission({
        userId,
        date: todayStr,
        workoutCompleted: false,
        mealCompleted: false,
        programCompleted: false,
        waterCompleted: false,
        stretchCompleted: false,
        sleepCompleted: false,
        progressPercentage: 0,
        missionCompleted: false,
        xpEarned: 0,
        streakOnDay: user.currentStreak || 0,
        completionTime: null
      });
    }

    // 2. Map checklist items
    mission.workoutCompleted = !!user.checklist.workout;
    mission.mealCompleted = !!user.checklist.meal;
    mission.waterCompleted = !!user.checklist.water;
    mission.stretchCompleted = !!user.checklist.stretch;
    mission.sleepCompleted = !!user.checklist.sleep;

    // Optional compatibility field
    mission.programCompleted = !!user.checklist.workout;

    mission.xpEarned += xpGained;

    // 3. Compute progress percentage based on 5 items
    const checklistItems = [
      user.checklist.workout,
      user.checklist.meal,
      user.checklist.water,
      user.checklist.stretch,
      user.checklist.sleep
    ];
    const completedCount = checklistItems.filter(Boolean).length;
    mission.progressPercentage = Math.round((completedCount / 5) * 100);

    // Initialize user streak fields
    if (user.currentStreak === undefined) user.currentStreak = 0;
    if (user.longestStreak === undefined) user.longestStreak = 0;
    if (user.lastCompletedDate === undefined) user.lastCompletedDate = null;

    const isNowCompleted = mission.progressPercentage === 100;
    const wasAlreadyCompleted = mission.missionCompleted;
    let missionCompletedNow = false;

    // 4. Handle 100% completion events
    if (isNowCompleted && !wasAlreadyCompleted) {
      mission.missionCompleted = true;
      mission.completionTime = new Date();
      missionCompletedNow = true;

      // Handle streak updates
      const yesterdayStr = this.getYesterdayString();
      if (user.lastCompletedDate === yesterdayStr) {
        user.currentStreak += 1;
      } else {
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }

      user.lastCompletedDate = todayStr;
      user.streak = user.currentStreak; // keep legacy streak synchronized
      
      await user.save();
    }

    mission.streakOnDay = user.currentStreak;
    await mission.save();

    console.log(`🎯 Mission Saved Successfully: Date: ${mission.date}, Progress: ${mission.progressPercentage}%, Completed: ${mission.missionCompleted} inside zenfit.dailymissions`);

    return { mission, user, missionCompletedNow };
  }

  /**
   * Checks if user missed a day and resets streak to zero if they did.
   * Also resets checklist if date rolled over to a new day.
   */
  static async checkAndResetStreak(user) {
    if (!user) return user;
    
    if (user.currentStreak === undefined) user.currentStreak = user.streak || 0;
    if (user.longestStreak === undefined) user.longestStreak = 0;
    if (user.lastCompletedDate === undefined) user.lastCompletedDate = null;

    const todayStr = this.getTodayString();
    const yesterdayStr = this.getYesterdayString();

    // 1. Checklist Rollover Reset
    if (user.lastChecklistDate !== todayStr) {
      user.checklist = {
        workout: false,
        meal: false,
        water: false,
        stretch: false,
        sleep: false
      };
      user.waterIntake = 0;
      user.lastChecklistDate = todayStr;
      
      // Reset weekly calendar today cell
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDayName = days[new Date().getDay()];
      const dayItem = user.weeklyCalendar.find(d => d.day === currentDayName);
      if (dayItem) {
        dayItem.completed = false;
      }
      
      await user.save();
    }

    // 2. Streak Missed Day Reset
    if (user.lastCompletedDate && user.lastCompletedDate !== todayStr && user.lastCompletedDate !== yesterdayStr) {
      user.currentStreak = 0;
      user.streak = 0;
      await user.save();
    }

    return user;
  }
}

module.exports = ActivityService;
