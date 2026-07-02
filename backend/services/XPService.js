class XPService {
  static REWARDS = {
    WORKOUT: 50,
    MEAL_PLAN: 30,
    BOOKING: 40,
    CHECKLIST_ITEM: 15,
    ALL_CHECKLIST_COMPLETE: 50
  };

  static addXP(user, xpAmount) {
    user.xp += xpAmount;
    let leveledUp = false;
    
    // Level up thresholds, e.g. Level 1 needs 200 XP, Level 2 needs 250 XP, Level 3 needs 312 XP (1.25x scaling)
    while (user.xp >= user.xpToNextLevel) {
      user.xp -= user.xpToNextLevel;
      user.level += 1;
      user.xpToNextLevel = Math.round(user.xpToNextLevel * 1.25);
      leveledUp = true;
    }
    
    return { user, leveledUp };
  }

  static getLevelName(level) {
    if (level < 3) return 'Fitness Starter';
    if (level < 6) return 'Fitness Explorer';
    if (level < 10) return 'Athletic Catalyst';
    if (level < 15) return 'Iron Warrior';
    return 'Zen Master';
  }
}

module.exports = XPService;
