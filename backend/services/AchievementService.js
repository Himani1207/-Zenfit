class AchievementService {
  static checkMilestones(user) {
    let unlockedNew = [];

    const addBadge = (badgeName) => {
      if (!user.badges.includes(badgeName)) {
        user.badges.push(badgeName);
        unlockedNew.push(badgeName);
      }
    };

    // Streak Badges
    if (user.streak >= 1) addBadge('First Step');
    if (user.streak >= 3) addBadge('Streak Enthusiast');
    if (user.streak >= 7) addBadge('Zen Warrior');

    // Level Badges
    if (user.level >= 5) addBadge('Powerhouse');
    if (user.level >= 10) addBadge('Iron Legend');

    return { user, unlockedNew };
  }

  static getBadgeDetails(badgeName) {
    const details = {
      'First Step': { description: 'Completed your first daily checklist!', icon: '🏆' },
      'Streak Enthusiast': { description: 'Maintained a 3-day active fitness streak.', icon: '🔥' },
      'Zen Warrior': { description: 'Maintained a 7-day perfect fitness streak.', icon: '🛡️' },
      'Powerhouse': { description: 'Reached Level 5 in progression.', icon: '⚡' },
      'Iron Legend': { description: 'Reached Level 10 in progression.', icon: '👑' },
      'Coached Athlete': { description: 'Subscribed to a premium ZenFit membership.', icon: '🏆' }
    };
    return details[badgeName] || { description: 'Fitness Milestone Achieved', icon: '⭐' };
  }
}

module.exports = AchievementService;
