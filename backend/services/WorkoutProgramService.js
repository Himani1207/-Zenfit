const User = require('../models/User');
const WorkoutProgram = require('../models/WorkoutProgram');
const UserProgress = require('../models/UserProgress');
const XPService = require('./XPService');

class WorkoutProgramService {
  static async getPrograms() {
    return await WorkoutProgram.find({}).populate('schedule.session');
  }

  static async getProgramDetails(id) {
    return await WorkoutProgram.findById(id).populate('schedule.session');
  }

  static async enrollInProgram(userId, programId) {
    const program = await WorkoutProgram.findById(programId);
    if (!program) throw new Error('Program not found');

    let progress = await UserProgress.findOne({ userId, programId });
    if (progress) {
      // Re-initialize progress if they want to restart
      progress.currentDay = 1;
      progress.completedDays = [];
      progress.progressPercentage = 0;
      progress.lastActive = new Date();
      await progress.save();
    } else {
      progress = await UserProgress.create({
        userId,
        programId,
        currentDay: 1,
        completedDays: [],
        progressPercentage: 0
      });
    }

    return progress;
  }

  static async getUserProgramProgress(userId) {
    const progressList = await UserProgress.find({ userId }).populate({
      path: 'programId',
      populate: { path: 'schedule.session' }
    });
    return progressList;
  }

  static async completeProgramDay(userId, programId, day) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const program = await WorkoutProgram.findById(programId);
    if (!program) throw new Error('Program not found');

    const progress = await UserProgress.findOne({ userId, programId });
    if (!progress) throw new Error('Not enrolled in this program');

    if (!progress.completedDays.includes(day)) {
      progress.completedDays.push(day);
    }

    // Recalculate progress percentage
    progress.progressPercentage = Math.round((progress.completedDays.length / program.durationDays) * 100);
    progress.lastActive = new Date();

    // Set next day
    let nextDay = day + 1;
    while (nextDay <= program.durationDays) {
      // Find if next day is a rest day, if it is, maybe auto skip or just set it
      break;
    }
    progress.currentDay = Math.min(program.durationDays, nextDay);

    // Award daily program XP (+40 XP)
    let totalXpGained = 40;
    let unlockedBadges = [];

    // Check if program is fully completed
    let programCompleted = progress.completedDays.length >= program.durationDays;
    if (programCompleted) {
      totalXpGained += program.xpReward; // e.g. +150 XP bonus
      
      const badgeName = `${program.title} Graduate`;
      if (!user.badges.includes(badgeName)) {
        user.badges.push(badgeName);
        unlockedBadges.push(badgeName);
      }
    }

    const xpResult = XPService.addXP(user, totalXpGained);
    user.level = xpResult.user.level;
    user.xp = xpResult.user.xp;
    user.xpToNextLevel = xpResult.user.xpToNextLevel;

    // Mark daily checklist workout complete
    if (!user.checklist.workout) {
      user.checklist.workout = true;
    }

    // Log Activity
    const ActivityService = require('./ActivityService');
    const { mission, missionCompletedNow } = await ActivityService.syncDailyMission(user, totalXpGained);

    await user.save();
    await progress.save();

    return {
      progress,
      xpGained: totalXpGained,
      leveledUp: xpResult.leveledUp,
      level: user.level,
      xp: user.xp,
      programCompleted,
      unlockedBadges,
      dailyMission: mission,
      missionCompletedNow
    };
  }
}

module.exports = WorkoutProgramService;
