import { 
  UserProfile, 
  TransformationState, 
  DailyWorkout, 
  WorkoutExercise
} from './types/transformation';
import { transformationExercises as fallbackExercises } from './transformationExercises';

export const areExercisesSimilar = (name1: string, name2: string) => {
  const normalize = (name: string) => {
    return name.toLowerCase()
      .replace(/barbell|dumbbell|machine|cable|weighted|db|bb|ez/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  if (n1 === n2) return true;
  
  if (n1.includes('bench press') && n2.includes('bench press')) {
    const isN1Flat = !n1.includes('incline') && !n1.includes('decline') && !n1.includes('close');
    const isN2Flat = !n2.includes('incline') && !n2.includes('decline') && !n2.includes('close');
    if (isN1Flat && isN2Flat) return true;
  }
  
  if (n1.includes('fly') && n2.includes('fly')) return true;
  
  return false;
};

function getWeeklySplit(experience: string, daysPerWeek: number, currentDayInJourney: number, goal?: string): string[] {
  if (goal === 'custom plan') {
    return Array(7).fill('Custom Workout');
  }

  // Beginner
  if (experience === 'beginner') {
    if (currentDayInJourney <= 30) {
      if (daysPerWeek >= 6) return ['Chest', 'Back', 'Shoulders', 'Legs', 'Biceps', 'Triceps + Abs', 'Rest'];
      if (daysPerWeek === 5) return ['Chest', 'Back', 'Rest', 'Shoulders', 'Legs', 'Cardio', 'Rest'];
      if (daysPerWeek === 4) return ['Chest', 'Back', 'Rest', 'Shoulders', 'Legs', 'Cardio', 'Rest'];
      return ['Chest', 'Cardio', 'Back', 'Rest', 'Legs', 'Cardio', 'Rest'];
    } else if (currentDayInJourney <= 90) {
      if (daysPerWeek >= 6) return ['Chest + Triceps', 'Back + Biceps', 'Shoulders + Abs', 'Legs', 'Chest + Triceps', 'Back + Biceps', 'Rest'];
      if (daysPerWeek === 5) return ['Chest + Triceps', 'Back + Biceps', 'Rest', 'Shoulders', 'Legs', 'Cardio', 'Rest'];
      if (daysPerWeek === 4) return ['Chest + Triceps', 'Back + Biceps', 'Rest', 'Shoulders', 'Legs', 'Rest', 'Cardio'];
      return ['Chest + Triceps', 'Cardio', 'Back + Biceps', 'Rest', 'Legs + Shoulders', 'Cardio', 'Rest'];
    } else {
      if (daysPerWeek >= 6) return ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs + Abs', 'Rest'];
      if (daysPerWeek === 5) return ['Push', 'Pull', 'Rest', 'Legs', 'Push', 'Cardio', 'Rest'];
      if (daysPerWeek === 4) return ['Push', 'Pull', 'Rest', 'Legs', 'Cardio', 'Rest', 'Cardio'];
      return ['Push', 'Cardio', 'Pull', 'Rest', 'Legs', 'Cardio', 'Rest'];
    }
  } 
  // Intermediate
  else if (experience === 'intermediate') {
    if (currentDayInJourney <= 15) {
      if (daysPerWeek >= 6) return ['Chest + Triceps', 'Back + Biceps', 'Shoulders + Abs', 'Legs', 'Chest + Triceps', 'Back + Biceps', 'Rest'];
      if (daysPerWeek === 5) return ['Chest + Triceps', 'Back + Biceps', 'Rest', 'Shoulders', 'Legs', 'Cardio', 'Rest'];
      if (daysPerWeek === 4) return ['Chest + Triceps', 'Back + Biceps', 'Rest', 'Shoulders', 'Legs', 'Rest', 'Cardio'];
      return ['Chest + Triceps', 'Cardio', 'Back + Biceps', 'Rest', 'Legs + Shoulders', 'Cardio', 'Rest'];
    } else if (currentDayInJourney <= 60) {
      if (daysPerWeek >= 6) return ['Push', 'Pull', 'Legs + Abs', 'Push', 'Pull', 'Legs + Abs', 'Rest'];
      if (daysPerWeek === 5) return ['Push', 'Pull', 'Rest', 'Legs + Abs', 'Push', 'Cardio', 'Rest'];
      if (daysPerWeek === 4) return ['Push', 'Pull', 'Rest', 'Legs + Abs', 'Cardio', 'Rest', 'Cardio'];
      return ['Push', 'Cardio', 'Pull', 'Rest', 'Legs + Abs', 'Cardio', 'Rest'];
    } else {
      if (daysPerWeek >= 6) return ['Push Advanced', 'Pull Advanced', 'Legs Advanced', 'Push Advanced', 'Pull Advanced', 'Legs + Abs', 'Rest'];
      if (daysPerWeek === 5) return ['Push Advanced', 'Pull Advanced', 'Rest', 'Legs Advanced', 'Push Advanced', 'Cardio', 'Rest'];
      if (daysPerWeek === 4) return ['Push Advanced', 'Pull Advanced', 'Rest', 'Legs Advanced', 'Cardio', 'Rest', 'Cardio'];
      return ['Push Advanced', 'Cardio', 'Pull Advanced', 'Rest', 'Legs Advanced', 'Cardio', 'Rest'];
    }
  } 
  // Advanced
  else {
    if (currentDayInJourney <= 30) {
      if (daysPerWeek >= 6) return ['Push', 'Pull', 'Legs + Abs', 'Rest', 'Upper', 'Lower', 'Rest'];
      if (daysPerWeek === 5) return ['Push', 'Pull', 'Legs + Abs', 'Cardio', 'Upper', 'Rest', 'Rest'];
      if (daysPerWeek === 4) return ['Push', 'Pull', 'Rest', 'Legs + Abs', 'Cardio', 'Rest', 'Rest'];
      return ['Push', 'Cardio', 'Pull', 'Rest', 'Legs + Abs', 'Cardio', 'Rest'];
    } else if (currentDayInJourney <= 60) {
      if (daysPerWeek >= 6) return ['Push', 'Pull', 'Legs + Abs', 'Upper', 'Lower', 'Cardio', 'Rest'];
      if (daysPerWeek === 5) return ['Push', 'Pull', 'Legs + Abs', 'Upper', 'Lower', 'Rest', 'Rest'];
      if (daysPerWeek === 4) return ['Push', 'Pull', 'Rest', 'Legs + Abs', 'Upper', 'Rest', 'Rest'];
      return ['Push', 'Cardio', 'Pull', 'Rest', 'Legs + Abs', 'Cardio', 'Rest'];
    } else {
      if (daysPerWeek >= 6) return ['Chest Specialized', 'Back Specialized', 'Legs Specialized', 'Weak Point', 'Upper', 'Lower', 'Rest'];
      if (daysPerWeek === 5) return ['Chest Specialized', 'Back Specialized', 'Legs Specialized', 'Weak Point', 'Upper', 'Rest', 'Rest'];
      if (daysPerWeek === 4) return ['Chest Specialized', 'Back Specialized', 'Rest', 'Legs Specialized', 'Weak Point', 'Rest', 'Rest'];
      return ['Chest Specialized', 'Cardio', 'Back Specialized', 'Rest', 'Legs Specialized', 'Cardio', 'Rest'];
    }
  }
}

function parseMuscles(workoutName: string): string[] {
  const n = workoutName.toLowerCase();
  if (n.includes('rest')) return [];
  if (n.includes('cardio')) return ['Cardio'];
  
  if (n.includes('push')) return ['Chest', 'Shoulders', 'Triceps'];
  if (n.includes('pull')) return ['Back', 'Biceps'];
  if (n.includes('legs') && n.includes('abs')) return ['Legs', 'Abs'];
  if (n.includes('legs') && n.includes('shoulders')) return ['Legs', 'Shoulders'];
  if (n.includes('legs')) return ['Legs'];
  if (n.includes('upper')) return ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'];
  if (n.includes('lower')) return ['Legs', 'Abs'];
  
  if (n.includes('chest') && n.includes('triceps')) return ['Chest', 'Triceps'];
  if (n.includes('back') && n.includes('biceps')) return ['Back', 'Biceps'];
  if (n.includes('shoulders') && n.includes('abs')) return ['Shoulders', 'Abs'];
  if (n.includes('triceps') && n.includes('abs')) return ['Triceps', 'Abs'];
  
  if (n.includes('chest')) return ['Chest'];
  if (n.includes('back')) return ['Back'];
  if (n.includes('shoulders')) return ['Shoulders'];
  if (n.includes('biceps')) return ['Biceps'];
  if (n.includes('triceps')) return ['Triceps'];
  if (n.includes('abs')) return ['Abs'];
  
  if (n.includes('weak point')) return ['Shoulders', 'Abs', 'Biceps', 'Triceps']; // Fallback

  return ['Chest', 'Back', 'Legs']; // Default
}

const getPhaseForDay = (day: number, total: number) => {
  const percent = day / total;
  if (percent < 0.25) return 'Foundation Phase';
  if (percent < 0.50) return 'Adaptation Phase';
  if (percent < 0.75) return 'Growth & Overload Phase';
  return 'Peak Performance Phase';
};

// Generate a brand new Transformation Journey
export function generateTransformationJourney(profile: UserProfile): TransformationState {
  const totalDays = profile.timelineDays;
  const schedule: DailyWorkout[] = [];

  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1;
    const weeklySplit = getWeeklySplit(profile.experience, profile.daysPerWeek, dayNumber, profile.goal);
    const workoutName = weeklySplit[i % 7];
    
    const isRest = workoutName === 'Rest';
    const isCardio = workoutName === 'Cardio';
    const phase = getPhaseForDay(i, totalDays);

    let warmup = ['Jumping Jacks (2 mins)', 'Dynamic Stretching (3 mins)'];
    let cooldown = ['Static Stretching (5 mins)'];
    let finisher = 'Core Plank Challenge (3 sets x 60s)';
    
    if (isRest) {
      warmup = [];
      cooldown = ['Light Walking', 'Hydration'];
      finisher = '';
    } else if (isCardio) {
      warmup = ['Brisk Walking (5 mins)'];
      cooldown = ['Walking (5 mins)', 'Calf Stretches'];
      finisher = 'Heart Rate Peak (60s sprint)';
    }

    schedule.push({
      id: `day_${dayNumber}`,
      dayNumber: dayNumber,
      phaseName: phase,
      workoutName: workoutName === 'Rest' ? 'Active Recovery' : workoutName,
      isRestDay: isRest,
      warmup,
      mainExercises: [], // Populate dynamically later
      finisher,
      cooldown,
      estimatedMinutes: isRest ? 15 : (isCardio ? 30 : profile.sessionDuration),
      completed: false,
      skipped: false,
      rescheduled: false,
      dateScheduled: ''
    });
  }

  return {
    profile,
    startDate: new Date().toISOString(),
    currentDay: 1,
    totalDays,
    xp: 0,
    level: 1,
    levelName: 'Rookie',
    streak: 0,
    longestStreak: 0,
    badges: [],
    schedule,
    exerciseHistory: {},
    workoutsCompleted: 0,
    workoutsSkipped: 0
  };
}

// Generate the specific exercises for a day, handling rotation and progressive overload
export function populateExercisesForDay(state: TransformationState, dayIndex: number, dbExercises?: any[]): DailyWorkout {
  const day = state.schedule[dayIndex];
  if (day.isRestDay || day.mainExercises.length > 0 || day.workoutName === 'Custom Workout') return day;

  // Determine target exercise count based on logic map
  // Beginners & Cardio get less exercises than advanced
  const isCardio = day.workoutName === 'Cardio';
  let targetExerciseCount = 5;
  if (isCardio) targetExerciseCount = 2;
  else if (state.profile.experience === 'advanced') targetExerciseCount = 6;
  
  // Advanced Hypertrophy sets might have more volume
  const isAdvancedHypertrophy = state.profile.experience === 'advanced' && dayIndex >= 60;
  if (isAdvancedHypertrophy) targetExerciseCount = 7;

  const targetMuscles = parseMuscles(day.workoutName);
  const newExercises: WorkoutExercise[] = [];
  let muscleIndex = 0;
  
  const exerciseSource = dbExercises && dbExercises.length > 0 ? dbExercises : fallbackExercises;
  
  // Create a pool of available exercises matching the equipment profile
  let availablePool = exerciseSource.filter(e => 
    e.requiredEquipment?.some((eq: string) => state.profile.equipment.includes(eq) || eq === 'bodyweight') || 
    (e.equipment && (state.profile.equipment.includes(e.equipment.toLowerCase()) || e.equipment.toLowerCase() === 'bodyweight' || e.equipment.toLowerCase() === 'none'))
  );

  // We want to pick `targetExerciseCount` unique exercises
  while (newExercises.length < targetExerciseCount) {
    const muscle = targetMuscles[muscleIndex % targetMuscles.length];
    
    // Filter the pool for the current muscle group, excluding exercises already added
    const availableForMuscle = availablePool.filter(
      e => e.muscleGroup === muscle && !newExercises.some(ex => ex.exerciseId === e.id)
    );

    if (availableForMuscle.length > 0) {
      // ROTATION ENGINE: Find the exercise least recently done
      availableForMuscle.sort((a, b) => {
        const historyA = state.exerciseHistory[a.id];
        const historyB = state.exerciseHistory[b.id];
        const dateA = historyA ? new Date(historyA[historyA.length - 1].date).getTime() : 0;
        const dateB = historyB ? new Date(historyB[historyB.length - 1].date).getTime() : 0;
        return dateA - dateB;
      });

      const chosen = availableForMuscle[0];

      // Prevent selecting similar exercises (e.g. Barbell Bench Press & Dumbbell Bench Press)
      if (newExercises.some(ex => areExercisesSimilar(ex.name, chosen.name))) {
        // Remove it from the main pool so it isn't picked again
        const idx = availablePool.findIndex(e => e.id === chosen.id);
        if (idx !== -1) availablePool.splice(idx, 1);
        continue;
      }

      // PROGRESSIVE OVERLOAD ENGINE
      const history = state.exerciseHistory[chosen.id];
      let targetReps = '10-12';
      let targetWeight = 'Auto-regulate';
      let targetSets = 3;

      if (isCardio) {
        targetSets = 1;
        targetReps = '15-20 mins';
        targetWeight = 'Bodyweight';
      } else if (isAdvancedHypertrophy) {
        targetSets = 4;
        targetReps = '8-10 + Drop Set';
      } else if (history && history.length > 0) {
        const lastSession = history[history.length - 1];
        if (lastSession.completionPercentage >= 90) {
          // Progressive overload: bump reps or note weight increase
          targetReps = '12-15';
          targetWeight = 'Increase weight by 5%';
        } else {
          // Keep same or reduce
          targetReps = '8-10';
          targetWeight = 'Maintain or drop 5%';
        }
      }

      newExercises.push({
        id: crypto.randomUUID(),
        exerciseId: chosen.id || chosen._id,
        name: chosen.name,
        muscleGroup: chosen.muscleGroup,
        pattern: chosen.pattern || chosen.category || '',
        imageUrl: chosen.imageUrl,
        targetSets,
        targetReps,
        targetWeight,
        restSeconds: isCardio ? 0 : (isAdvancedHypertrophy ? 90 : 60),
        completed: false,
        loggedSets: []
      });
    } else {
      // If no more exercises for this muscle, and we've looped completely without finding anything, break
      if (muscleIndex >= targetMuscles.length * 3) break; 
    }
    muscleIndex++;
  }

  day.mainExercises = newExercises;
  return day;
}

export function logWorkoutCompletion(
  state: TransformationState, 
  dayIndex: number, 
  logs: { exerciseId: string; sets: { reps: number; weight: string }[] }[]
): TransformationState {
  const newState = { ...state, schedule: [...state.schedule] };
  const day = newState.schedule[dayIndex];
  
  day.completed = true;
  day.dateCompleted = new Date().toISOString();
  newState.workoutsCompleted++;
  newState.streak++;
  if (newState.streak > newState.longestStreak) newState.longestStreak = newState.streak;
  
  // Award XP
  const xpEarned = day.isRestDay ? 50 : 250;
  newState.xp += xpEarned;

  // Level up logic
  const levels = [
    { threshold: 0, name: 'Rookie' },
    { threshold: 1000, name: 'Athlete' },
    { threshold: 3000, name: 'Warrior' },
    { threshold: 6000, name: 'Beast' },
    { threshold: 10000, name: 'Elite' },
  ];
  
  const newLevel = levels.slice().reverse().find(l => newState.xp >= l.threshold);
  if (newLevel) {
    newState.level = levels.indexOf(newLevel) + 1;
    newState.levelName = newLevel.name;
  }

  // Update exercise history for progressive overload
  if (!newState.exerciseHistory) newState.exerciseHistory = {};
  
  logs.forEach(log => {
    if (!newState.exerciseHistory[log.exerciseId]) {
      newState.exerciseHistory[log.exerciseId] = [];
    }
    
    newState.exerciseHistory[log.exerciseId].push({
      date: new Date().toISOString(),
      repsAchieved: log.sets.map(s => s.reps),
      weightUsed: log.sets.map(s => s.weight),
      completionPercentage: 100 // Simplified for MVP
    });
  });

  return newState;
}

// Missed workout recovery logic
export function reshuffleMissedWorkouts(state: TransformationState): TransformationState {
  // If the user missed yesterday, we push all scheduled workouts forward by 1 day
  // (In a real app, we'd compare dates. Here we just provide the utility)
  const newState = { ...state, schedule: [...state.schedule] };
  return newState;
}
