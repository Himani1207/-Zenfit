const XPService = require('./XPService');
const AchievementService = require('./AchievementService');

class ProgressService {
  static async updateChecklist(user, item) {
    if (user.checklist[item] === undefined) return { user, xpGained: 0, leveledUp: false, unlockedBadges: [] };
    
    // Check if today's Daily Mission is already completed (100% checklist done)
    const ActivityService = require('./ActivityService');
    const todayMission = await ActivityService.getTodayMission(user._id);
    if (todayMission && todayMission.missionCompleted) {
      // Prevent modifications to checklist once Daily Mission is completed
      return { 
        user, 
        xpGained: 0, 
        leveledUp: false, 
        unlockedBadges: [], 
        dailyMission: todayMission, 
        missionCompletedNow: false 
      };
    }

    // Toggle item
    const wasCompleted = user.checklist[item];
    user.checklist[item] = !wasCompleted;
    
    let xpGained = 0;
    let leveledUp = false;
    let unlockedBadges = [];
    
    if (user.checklist[item]) {
      // Award XP for ticking item
      const result = XPService.addXP(user, XPService.REWARDS.CHECKLIST_ITEM);
      user = result.user;
      leveledUp = result.leveledUp;
      xpGained += XPService.REWARDS.CHECKLIST_ITEM;
    }

    // Check if daily checklist is now fully complete (all 5 items true)
    const allDone = Object.values(user.checklist).every(v => v === true);
    
    // Find current day of week to highlight in weeklyCalendar
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = days[new Date().getDay()];
    
    const dayItem = user.weeklyCalendar.find(d => d.day === currentDayName);
    const dayWasCompleted = dayItem ? dayItem.completed : false;

    if (allDone && !dayWasCompleted) {
      if (dayItem) dayItem.completed = true;
      
      // Award bonus XP
      const result = XPService.addXP(user, XPService.REWARDS.ALL_CHECKLIST_COMPLETE);
      user = result.user;
      leveledUp = leveledUp || result.leveledUp;
      xpGained += XPService.REWARDS.ALL_CHECKLIST_COMPLETE;

      // Check achievements
      const achResult = AchievementService.checkMilestones(user);
      user = achResult.user;
      unlockedBadges = achResult.unlockedNew;
    } else if (!allDone && dayWasCompleted) {
      // If user unchecked something, revert calendar completion
      if (dayItem) dayItem.completed = false;
    }

    // Sync to DailyMission document
    const syncResult = await ActivityService.syncDailyMission(user, xpGained);

    return { 
      user, 
      xpGained, 
      leveledUp, 
      unlockedBadges, 
      dailyMission: syncResult?.mission, 
      missionCompletedNow: syncResult?.missionCompletedNow 
    };
  }
}

module.exports = ProgressService;
