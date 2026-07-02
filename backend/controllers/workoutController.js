const WorkoutSessionService = require('../services/WorkoutSessionService');
const WorkoutProgramService = require('../services/WorkoutProgramService');

const getExercises = async (req, res) => {
  try {
    const { search, difficulty, equipment, targetMuscle } = req.query;
    const exercises = await WorkoutSessionService.getExercises({ search, difficulty, equipment, targetMuscle });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkoutSessions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const sessions = await WorkoutSessionService.getSessions({ category, difficulty });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkoutSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await WorkoutSessionService.getSessionDetails(id);
    if (!session) {
      return res.status(404).json({ message: 'Workout session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFavoriteSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const result = await WorkoutSessionService.toggleFavoriteSession(req.user.id, sessionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavoriteSessions = async (req, res) => {
  try {
    const sessions = await WorkoutSessionService.getFavoriteSessions(req.user.id);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkoutHistory = async (req, res) => {
  try {
    const history = await WorkoutSessionService.getWorkoutHistory(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeWorkoutSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { durationSec, exercisesCompleted } = req.body;
    const result = await WorkoutSessionService.completeSession(req.user.id, id, durationSec, exercisesCompleted);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkoutPrograms = async (req, res) => {
  try {
    const programs = await WorkoutProgramService.getPrograms();
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkoutProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await WorkoutProgramService.getProgramDetails(id);
    if (!program) {
      return res.status(404).json({ message: 'Workout program not found' });
    }
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollInWorkoutProgram = async (req, res) => {
  try {
    const { programId } = req.body;
    const progress = await WorkoutProgramService.enrollInProgram(req.user.id, programId);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserWorkoutProgramProgress = async (req, res) => {
  try {
    const progressList = await WorkoutProgramService.getUserProgramProgress(req.user.id);
    res.status(200).json(progressList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeWorkoutProgramDay = async (req, res) => {
  try {
    const { programId } = req.params;
    const { day } = req.body;
    const result = await WorkoutProgramService.completeProgramDay(req.user.id, programId, Number(day));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExercises,
  getWorkoutSessions,
  getWorkoutSessionById,
  toggleFavoriteSession,
  getFavoriteSessions,
  getWorkoutHistory,
  completeWorkoutSession,
  getWorkoutPrograms,
  getWorkoutProgramById,
  enrollInWorkoutProgram,
  getUserWorkoutProgramProgress,
  completeWorkoutProgramDay
};
