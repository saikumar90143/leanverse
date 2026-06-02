export type Goal = 
  | 'muscle' | 'fatloss' | 'leanbulk' | 'strength' 
  | 'athletic' | 'recomp' | 'yoga' | 'mobility' | 'general';

export type WorkoutLocation = 
  | 'gym' | 'home' | 'home_dumbbells' | 'home_bands' | 'home_full';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  location: WorkoutLocation;
  experience: ExperienceLevel;
  daysPerWeek: 3 | 4 | 5 | 6 | 7;
  sessionDuration: 20 | 30 | 45 | 60 | 90;
  timelineDays: number; // 30, 60, 90, 120, 180, etc.
  injuries: string[];
  equipment: string[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: string;
  pattern: string; // e.g., 'horizontal_push', 'vertical_pull', 'squat', 'hinge'
  difficulty: number; // 1-10
  requiredEquipment: string[];
  progressionNext?: string; // ID of the next harder exercise
  progressionPrev?: string; // ID of the easier exercise
  videoUrl?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  muscleGroup?: string;
  pattern?: string;
  targetSets: number;
  targetReps: string; // e.g., "8-10", "12", "Till Failure"
  targetWeight?: string; // Optional, dynamically calculated
  restSeconds: number;
  notes?: string;
  completed: boolean;
  loggedSets: {
    reps: number;
    weight: string;
  }[];
}

export interface DailyWorkout {
  id: string;
  dayNumber: number;
  phaseName: string;
  workoutName: string; // e.g., "Push Day: Chest Focus", "Active Recovery"
  isRestDay: boolean;
  warmup: string[];
  mainExercises: WorkoutExercise[];
  finisher: string;
  cooldown: string[];
  estimatedMinutes: number;
  completed: boolean;
  skipped: boolean;
  rescheduled: boolean;
  dateScheduled: string;
  dateCompleted?: string;
}

export interface ExerciseHistoryRecord {
  date: string;
  repsAchieved: number[];
  weightUsed: string[];
  completionPercentage: number;
}

export interface TransformationState {
  profile: UserProfile;
  startDate: string;
  currentDay: number;
  totalDays: number;
  
  // Gamification
  xp: number;
  level: number;
  levelName: string; // Rookie, Athlete, Warrior, Beast, Elite
  streak: number;
  longestStreak: number;
  badges: string[];
  
  // Schedule
  schedule: DailyWorkout[];
  
  // History for rotation and progressive overload
  exerciseHistory: Record<string, ExerciseHistoryRecord[]>; // Key is exerciseId
  
  // Analytics
  workoutsCompleted: number;
  workoutsSkipped: number;
}
