class WorkoutRecommendationService {
  static filterWorkouts(workouts, { search = '', difficulty = '', equipment = '', targetMuscle = '' }) {
    let filtered = workouts;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(q) || 
        w.targetMuscles.some(m => m.toLowerCase().includes(q))
      );
    }

    if (difficulty) {
      filtered = filtered.filter(w => w.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (equipment) {
      const eq = equipment.toLowerCase();
      filtered = filtered.filter(w => 
        w.equipment.some(e => e.toLowerCase().includes(eq))
      );
    }

    if (targetMuscle) {
      const tm = targetMuscle.toLowerCase();
      filtered = filtered.filter(w => 
        w.targetMuscles.some(m => m.toLowerCase().includes(tm))
      );
    }

    return filtered;
  }
}

module.exports = WorkoutRecommendationService;
