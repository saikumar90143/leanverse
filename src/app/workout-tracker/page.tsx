'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { 
  ArrowLeft, Plus, Check, Trash2, Timer, Flame, Dumbbell, 
  Play, Pause, RotateCcw, Search, X
} from 'lucide-react';
import StreakBadge from '@/components/shared/StreakBadge';
import { playSetComplete, playTimerEnd } from '@/lib/sounds';
import { getUserStorageKey } from '@/lib/storage';

// ── Exercise Library ──────────────────────────────────────────────────────────
const EXERCISE_LIBRARY: { name: string; muscle: string; category: string; emoji: string }[] = [
  // Chest
  { name: 'Bench Press', muscle: 'Chest', category: 'Push', emoji: '🏋️' },
  { name: 'Incline Bench Press', muscle: 'Chest', category: 'Push', emoji: '🏋️' },
  { name: 'Decline Bench Press', muscle: 'Chest', category: 'Push', emoji: '🏋️' },
  { name: 'Dumbbell Flyes', muscle: 'Chest', category: 'Push', emoji: '🤸' },
  { name: 'Cable Crossover', muscle: 'Chest', category: 'Push', emoji: '💪' },
  { name: 'Push Up', muscle: 'Chest', category: 'Push', emoji: '🔄' },
  { name: 'Chest Dips', muscle: 'Chest', category: 'Push', emoji: '💪' },
  // Shoulders
  { name: 'Overhead Press', muscle: 'Shoulders', category: 'Push', emoji: '🏋️' },
  { name: 'Lateral Raises', muscle: 'Shoulders', category: 'Push', emoji: '🤸' },
  { name: 'Front Raises', muscle: 'Shoulders', category: 'Push', emoji: '🤸' },
  { name: 'Arnold Press', muscle: 'Shoulders', category: 'Push', emoji: '💪' },
  { name: 'Face Pulls', muscle: 'Shoulders', category: 'Pull', emoji: '💪' },
  { name: 'Rear Delt Flyes', muscle: 'Shoulders', category: 'Pull', emoji: '🤸' },
  // Back
  { name: 'Deadlift', muscle: 'Back', category: 'Pull', emoji: '🏋️' },
  { name: 'Pull Up', muscle: 'Back', category: 'Pull', emoji: '💪' },
  { name: 'Barbell Row', muscle: 'Back', category: 'Pull', emoji: '🏋️' },
  { name: 'Seated Cable Row', muscle: 'Back', category: 'Pull', emoji: '💪' },
  { name: 'Lat Pulldown', muscle: 'Back', category: 'Pull', emoji: '💪' },
  { name: 'T-Bar Row', muscle: 'Back', category: 'Pull', emoji: '🏋️' },
  { name: 'Single Arm Dumbbell Row', muscle: 'Back', category: 'Pull', emoji: '🤸' },
  // Biceps
  { name: 'Barbell Curl', muscle: 'Biceps', category: 'Pull', emoji: '💪' },
  { name: 'Dumbbell Curl', muscle: 'Biceps', category: 'Pull', emoji: '💪' },
  { name: 'Hammer Curl', muscle: 'Biceps', category: 'Pull', emoji: '💪' },
  { name: 'Preacher Curl', muscle: 'Biceps', category: 'Pull', emoji: '💪' },
  { name: 'Cable Curl', muscle: 'Biceps', category: 'Pull', emoji: '💪' },
  { name: 'Concentration Curl', muscle: 'Biceps', category: 'Pull', emoji: '💪' },
  // Triceps
  { name: 'Tricep Pushdown', muscle: 'Triceps', category: 'Push', emoji: '💪' },
  { name: 'Skull Crusher', muscle: 'Triceps', category: 'Push', emoji: '🏋️' },
  { name: 'Overhead Tricep Extension', muscle: 'Triceps', category: 'Push', emoji: '🤸' },
  { name: 'Close Grip Bench Press', muscle: 'Triceps', category: 'Push', emoji: '🏋️' },
  { name: 'Diamond Push Up', muscle: 'Triceps', category: 'Push', emoji: '🔄' },
  // Legs
  { name: 'Squat', muscle: 'Quads', category: 'Legs', emoji: '🏋️' },
  { name: 'Front Squat', muscle: 'Quads', category: 'Legs', emoji: '🏋️' },
  { name: 'Leg Press', muscle: 'Quads', category: 'Legs', emoji: '🦵' },
  { name: 'Bulgarian Split Squat', muscle: 'Quads', category: 'Legs', emoji: '🤸' },
  { name: 'Leg Extension', muscle: 'Quads', category: 'Legs', emoji: '🦵' },
  { name: 'Romanian Deadlift', muscle: 'Hamstrings', category: 'Legs', emoji: '🏋️' },
  { name: 'Leg Curl', muscle: 'Hamstrings', category: 'Legs', emoji: '🦵' },
  { name: 'Hip Thrust', muscle: 'Glutes', category: 'Legs', emoji: '🏋️' },
  { name: 'Sumo Deadlift', muscle: 'Glutes', category: 'Legs', emoji: '🏋️' },
  { name: 'Standing Calf Raise', muscle: 'Calves', category: 'Legs', emoji: '🦵' },
  { name: 'Seated Calf Raise', muscle: 'Calves', category: 'Legs', emoji: '🦵' },
  { name: 'Lunges', muscle: 'Quads', category: 'Legs', emoji: '🤸' },
  // Core
  { name: 'Plank', muscle: 'Core', category: 'Core', emoji: '🧘' },
  { name: 'Crunches', muscle: 'Core', category: 'Core', emoji: '🤸' },
  { name: 'Leg Raise', muscle: 'Core', category: 'Core', emoji: '🤸' },
  { name: 'Russian Twist', muscle: 'Core', category: 'Core', emoji: '🔄' },
  { name: 'Ab Wheel Rollout', muscle: 'Core', category: 'Core', emoji: '🔄' },
  { name: 'Cable Crunch', muscle: 'Core', category: 'Core', emoji: '💪' },
  { name: 'Hanging Knee Raise', muscle: 'Core', category: 'Core', emoji: '🤸' },
  // Cardio
  { name: 'Treadmill Run', muscle: 'Cardio', category: 'Cardio', emoji: '🏃' },
  { name: 'Cycling', muscle: 'Cardio', category: 'Cardio', emoji: '🚴' },
  { name: 'Rowing Machine', muscle: 'Cardio', category: 'Cardio', emoji: '🚣' },
  { name: 'Jump Rope', muscle: 'Cardio', category: 'Cardio', emoji: '🏃' },
  { name: 'Burpees', muscle: 'Cardio', category: 'Cardio', emoji: '🔄' },
  { name: 'Stair Climber', muscle: 'Cardio', category: 'Cardio', emoji: '🏃' },
];

const MUSCLES = ['All', 'Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Cardio'];

interface SetData {
  id: string;
  weight: number | '';
  reps: number | '';
  completed: boolean;
}

interface ExerciseData {
  id: string;
  name: string;
  sets: SetData[];
}

interface WorkoutState {
  name: string;
  date: string;
  exercises: ExerciseData[];
}

interface ExerciseHistory {
  date: string;
  bestSet: { weight: number; reps: number };
  allSets: { weight: number; reps: number }[];
  totalVolume: number;
  setCount: number;
}

/** Scan the workouts DB for past sessions containing an exercise with this name.
 *  Returns the last 3 matching entries, most recent first.
 *  Case-insensitive, trims whitespace, returns [] if no match or invalid name.
 */
function getExerciseHistory(name: string, currentDate: string): ExerciseHistory[] {
  if (typeof window === 'undefined') return [];
  const trimmed = name.trim().toLowerCase();
  if (trimmed.length < 2) return [];

  try {
    const raw = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
    if (!raw) return [];
    const db = JSON.parse(raw);
    if (typeof db !== 'object' || db === null) return [];

    const results: ExerciseHistory[] = [];

    // Sort dates descending to get most recent first
    const dates = Object.keys(db).sort((a, b) => b.localeCompare(a));

    for (const date of dates) {
      if (date === currentDate) continue; // skip the currently viewed session
      if (results.length >= 3) break;

      const entry = db[date];
      if (!entry || !Array.isArray(entry.exercises)) continue;

      for (const ex of entry.exercises) {
        if (!ex || typeof ex.name !== 'string') continue;
        if (ex.name.trim().toLowerCase() !== trimmed) continue;
        if (!Array.isArray(ex.sets)) continue;

        const completedSets = ex.sets.filter(
          (s: SetData) => s.completed && typeof s.weight === 'number' && typeof s.reps === 'number'
        );
        if (completedSets.length === 0) continue;

        const bestSet = completedSets.reduce(
          (best: SetData, s: SetData) => {
            const vol = (s.weight as number) * (s.reps as number);
            const bestVol = (best.weight as number) * (best.reps as number);
            return vol > bestVol ? s : best;
          },
          completedSets[0]
        );

        const totalVolume = completedSets.reduce(
          (sum: number, s: SetData) => sum + (s.weight as number) * (s.reps as number), 0
        );

        results.push({
          date,
          bestSet: { weight: bestSet.weight as number, reps: bestSet.reps as number },
          allSets: completedSets.map((s: SetData) => ({ weight: s.weight as number, reps: s.reps as number })),
          totalVolume: Math.round(totalVolume),
          setCount: completedSets.length,
        });
        break; // one entry per date
      }
    }

    return results;
  } catch {
    return [];
  }
}

export default function WorkoutTracker() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const [workout, setWorkout] = useState<WorkoutState>({
    name: 'My Daily Workout',
    date: new Date().toISOString().split('T')[0],
    exercises: [
      {
        id: crypto.randomUUID(),
        name: 'Bench Press',
        sets: [
          { id: crypto.randomUUID(), weight: 60, reps: 10, completed: false },
          { id: crypto.randomUUID(), weight: 65, reps: 8, completed: false },
        ]
      }
    ]
  });

  const [mounted, setMounted] = useState(false);
  const [hasFiredConfetti, setHasFiredConfetti] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(90);
  const [exerciseHistories, setExerciseHistories] = useState<Record<string, ExerciseHistory[]>>({});
  // Exercise search modal state
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from local storage
  useEffect(() => {
    setMounted(true);
    
    // Check if there is an imported workout from the AI Planner
    const importedWorkoutStr = localStorage.getItem(getUserStorageKey('leanverse_workout_tracker'));
    if (importedWorkoutStr) {
      try {
        const imported = JSON.parse(importedWorkoutStr);
        setWorkout(imported);
        localStorage.removeItem(getUserStorageKey('leanverse_workout_tracker')); // Clear import flag
        return;
      } catch (e) {
        console.error('Failed to load imported workout data', e);
      }
    }

    // Normal load: Check DB for today's workout
    const today = new Date().toISOString().split('T')[0];
    const savedDb = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
    if (savedDb) {
      try {
        const db = JSON.parse(savedDb);
        if (db[today]) {
          const loadedWorkout = db[today];
          setWorkout(loadedWorkout);
          // Seed histories for all exercises in today's saved workout
          const histories: Record<string, ExerciseHistory[]> = {};
          (loadedWorkout.exercises || []).forEach((ex: ExerciseData) => {
            if (ex.name) histories[ex.id] = getExerciseHistory(ex.name, today);
          });
          setExerciseHistories(histories);
        } else {
          setWorkout(prev => ({ ...prev, date: today, exercises: [] }));
          setExerciseHistories({});
        }
      } catch (e) {
        console.error('Failed to load DB', e);
      }
    }
  }, []);

  // Save to local DB on every change
  useEffect(() => {
    if (mounted) {
      const savedDb = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
      const db = savedDb ? JSON.parse(savedDb) : {};
      db[workout.date] = workout;
      localStorage.setItem(getUserStorageKey('leanverse_workouts_db'), JSON.stringify(db));
    }
  }, [workout, mounted]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const savedDb = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
    const db = savedDb ? JSON.parse(savedDb) : {};
    
    if (db[newDate]) {
      const loaded = db[newDate];
      setWorkout(loaded);
      // Seed histories for loaded exercises
      const histories: Record<string, ExerciseHistory[]> = {};
      (loaded.exercises || []).forEach((ex: ExerciseData) => {
        if (ex.name) histories[ex.id] = getExerciseHistory(ex.name, newDate);
      });
      setExerciseHistories(histories);
    } else {
      setWorkout({
        name: 'My Daily Workout',
        date: newDate,
        exercises: []
      });
      setExerciseHistories({});
    }
  };

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playTimerEnd().catch(() => {}); // non-fatal
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timer]);

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const addExercise = () => {
    setWorkout(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id: crypto.randomUUID(),
          name: '',
          sets: [{ id: crypto.randomUUID(), weight: '', reps: '', completed: false }]
        }
      ]
    }));
  };

  const addExerciseByName = (name: string) => {
    // Prevent adding duplicates
    if (workout.exercises.some(ex => ex.name.toLowerCase().trim() === name.toLowerCase().trim())) {
      setShowExerciseSearch(false);
      setExerciseSearch('');
      return;
    }

    const id = crypto.randomUUID();
    const history = getExerciseHistory(name, workout.date);
    let initialSets: SetData[] = [{ id: crypto.randomUUID(), weight: '', reps: '', completed: false }];

    // If we have history for this exercise, pre-fill all sets with exactly what they did last time
    if (history.length > 0 && history[0].allSets && history[0].allSets.length > 0) {
      initialSets = history[0].allSets.map(s => ({
        id: crypto.randomUUID(),
        weight: s.weight, // Keep exact previous weight
        reps: s.reps, // Keep exact previous reps
        completed: false
      }));
    }

    setWorkout(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          id,
          name,
          sets: initialSets
        }
      ]
    }));
    // Immediately seed history for this exercise so the progressive overload panel shows up
    setExerciseHistories(prev => ({ ...prev, [id]: history }));
    setShowExerciseSearch(false);
    setExerciseSearch('');
    setMuscleFilter('All');
  };

  const updateExerciseName = (exId: string, name: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => ex.id === exId ? { ...ex, name } : ex)
    }));
    // Immediately refresh history for this exercise
    setExerciseHistories(prev => ({ ...prev, [exId]: getExerciseHistory(name, workout.date) }));
  };

  const removeExercise = (exId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exId)
    }));
  };

  const addSet = (exId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id === exId) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [...ex.sets, { 
              id: crypto.randomUUID(), 
              weight: lastSet ? lastSet.weight : '', 
              reps: lastSet ? lastSet.reps : '', 
              completed: false 
            }]
          };
        }
        return ex;
      })
    }));
  };

  const updateSet = (exId: string, setId: string, field: keyof SetData, value: any) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id === exId) {
          return {
            ...ex,
            sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
          };
        }
        return ex;
      })
    }));
  };

  const toggleSetCompletion = (exId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id === exId) {
          return {
            ...ex,
            sets: ex.sets.map(s => {
              if (s.id === setId) {
                const newCompleted = !s.completed;
                // If just completed, auto-start timer and play sound
                if (newCompleted) {
                  playSetComplete().catch(() => {}); // non-fatal
                  if (!isTimerRunning) startTimer(timerDuration);
                }
                return { ...s, completed: newCompleted };
              }
              return s;
            })
          };
        }
        return ex;
      })
    }));
  };

  useEffect(() => {
    if (!mounted || workout.exercises.length === 0) return;
    
    let allCompleted = true;
    let hasSets = false;
    
    workout.exercises.forEach(ex => {
      if (ex.sets.length > 0) hasSets = true;
      ex.sets.forEach(s => {
        if (!s.completed || typeof s.weight !== 'number' || typeof s.reps !== 'number') {
          allCompleted = false;
        }
      });
    });

    if (hasSets && allCompleted && !hasFiredConfetti) {
      setHasFiredConfetti(true);
      (async () => {
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#f59e0b'],
            zIndex: 9999
          });
        } catch (e) {
          console.error('Confetti failed to trigger', e);
        }
      })();
    } else if (!allCompleted && hasFiredConfetti) {
      // Reset if user unmarks a set so they can get confetti again if they re-complete it
      setHasFiredConfetti(false);
    }
  }, [workout, mounted, hasFiredConfetti]);

  const removeSet = (exId: string, setId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => {
        if (ex.id === exId) {
          return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
        }
        return ex;
      })
    }));
  };

  // Calculate stats
  const totalVolume = workout.exercises.reduce((total, ex) => {
    return total + ex.sets.reduce((setTotal, s) => {
      if (s.completed && typeof s.weight === 'number' && typeof s.reps === 'number') {
        return setTotal + (s.weight * s.reps);
      }
      return setTotal;
    }, 0);
  }, 0);

  const completedSets = workout.exercises.reduce((total, ex) => {
    return total + ex.sets.filter(s => s.completed).length;
  }, 0);

  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Return link */}
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-2 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to LeanVerse Home</span>
      </Link>

      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <input 
            type="text" 
            value={workout.name}
            onChange={(e) => setWorkout({...workout, name: e.target.value})}
            className="text-4xl sm:text-5xl font-black bg-transparent border-0 p-0 text-slate-800 dark:text-slate-100 focus:ring-0 w-full tracking-tight"
            placeholder="Workout Name"
          />
          <div className="flex flex-wrap items-center gap-3">
            <input 
              type="date"
              value={workout.date}
              onChange={handleDateChange}
              className="bg-slate-200/50 dark:bg-white/5 border-none rounded-xl px-4 py-2 font-bold text-sm text-slate-600 dark:text-slate-300 focus:ring-emerald-500"
            />
            <StreakBadge />
          </div>
        </div>

        {/* Stats Widget */}
        <div className="glass rounded-3xl p-5 border border-slate-200/10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -z-10" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Volume</span>
              <span className="text-emerald-500 font-bold text-xs"><Flame className="w-3.5 h-3.5 inline mr-1"/>Burn</span>
            </div>
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-tighter">
              {totalVolume.toLocaleString()} <span className="text-sm text-slate-500 font-bold">kg</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${totalSets === 0 ? 0 : (completedSets / totalSets) * 100}%` }}
              />
            </div>
            <div className="text-right text-[10px] font-bold text-slate-500">
              {completedSets} / {totalSets} sets completed
            </div>
          </div>
        </div>
      </div>

      {/* Rest Timer Widget - Sticky */}
      <div className="sticky top-24 z-40 glass shadow-2xl shadow-emerald-500/5 rounded-2xl p-4 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTimerRunning ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-200/50 dark:bg-white/10 text-slate-400'}`}>
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block leading-tight">Rest Timer</span>
            <span className="text-xl font-black font-mono tracking-tighter text-slate-800 dark:text-slate-100">{formatTime(timer)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick presets */}
          {[60, 90, 120].map(secs => (
            <button 
              key={secs}
              onClick={() => { setTimerDuration(secs); startTimer(secs); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timerDuration === secs ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200/50 dark:bg-white/5 hover:bg-slate-300/50 text-slate-600 dark:text-slate-300'}`}
            >
              {secs}s
            </button>
          ))}

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />

          {isTimerRunning ? (
            <button aria-label="Pause timer" onClick={stopTimer} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button aria-label="Start timer" onClick={() => startTimer(timerDuration)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
              <Play className="w-4 h-4" />
            </button>
          )}
          <button aria-label="Reset timer" onClick={() => { stopTimer(); setTimer(0); }} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6">
        {workout.exercises.map((exercise, index) => (
          <div key={exercise.id} className="glass rounded-3xl p-5 border border-slate-200/10 space-y-4 relative group">
            {/* Exercise Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-white/5 flex items-center justify-center font-black text-slate-400 text-xs">
                  {index + 1}
                </div>
                <input 
                  type="text"
                  value={exercise.name}
                  onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                  placeholder="Exercise Name"
                  className="flex-1 bg-transparent border-none text-xl font-black text-slate-800 dark:text-slate-100 focus:ring-0 p-0 placeholder-slate-300 dark:placeholder-slate-700"
                />
              </div>
              <button 
                aria-label="Remove exercise"
                onClick={() => removeExercise(exercise.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500"
                title="Remove Exercise"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Progressive Overload History Panel */}
            {(() => {
              const history = exerciseHistories[exercise.id] || [];
              if (history.length === 0 || !exercise.name || exercise.name.trim().length < 2) return null;

              const latest = history[0];
              // Smart suggestion: recommend +2.5kg or +1 rep based on most recent session
              const suggestedWeight = (latest.bestSet.weight + 2.5).toFixed(1);
              const suggestedReps = latest.bestSet.reps + 1;

              return (
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                      <span>📈</span> Progressive Overload History
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Last {history.length} session{history.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* History rows */}
                  <div className="space-y-1.5">
                    {history.map((h, i) => (
                      <div key={h.date} className={`flex items-center justify-between text-xs rounded-xl px-3 py-1.5 ${i === 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-100/50 dark:bg-white/5'}`}>
                        <span className={`font-bold ${i === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                          {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <div className="flex items-center gap-3 font-mono font-black">
                          <span className={i === 0 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500'}>
                            {h.bestSet.weight}kg × {h.bestSet.reps}
                          </span>
                          <span className={`text-[10px] ${i === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {h.setCount} sets · {h.totalVolume}kg vol
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestion */}
                  <div className="flex items-center gap-2 pt-1 border-t border-emerald-500/10">
                    <span className="text-sm">🎯</span>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      <span className="text-emerald-500 font-black">Suggested today:</span> Try{' '}
                      <span className="font-black text-slate-800 dark:text-slate-100">{suggestedWeight}kg × {latest.bestSet.reps}</span>{' '}
                      or <span className="font-black text-slate-800 dark:text-slate-100">{latest.bestSet.weight}kg × {suggestedReps}</span>
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Sets Header - Desktop only */}
            <div className="grid grid-cols-12 gap-3 sm:gap-4 px-2 pt-2 pb-1 border-b border-slate-200/10">
              <div className="col-span-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Set</div>
              <div className="col-span-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Weight <span className="hidden sm:inline">(kg)</span></div>
              <div className="col-span-4 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reps</div>
              <div className="col-span-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Done</div>
            </div>

            {/* Sets Rows */}
            <div className="space-y-2 mt-2">
              {exercise.sets.map((set, setIndex) => (
                <div 
                  key={set.id} 
                  className={`grid grid-cols-12 gap-3 sm:gap-4 items-center p-2 rounded-xl transition-colors ${set.completed ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20' : 'hover:bg-slate-50 dark:hover:bg-white/5'} border border-transparent group/set`}
                >
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-slate-200/50 dark:bg-white/5 text-center leading-6 sm:leading-8 text-xs font-bold text-slate-500">{setIndex + 1}</span>
                  </div>

                  <div className="col-span-4 relative">
                    <input 
                      type="number" 
                      value={set.weight}
                      onChange={(e) => updateSet(exercise.id, set.id, 'weight', e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-2 sm:px-3 py-2 text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-4 relative">
                    <input 
                      type="number" 
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, set.id, 'reps', e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-2 sm:px-3 py-2 text-center font-bold text-slate-800 dark:text-slate-100 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-center sm:justify-center relative">
                    <button
                      aria-label={set.completed ? "Mark set incomplete" : "Mark set complete"}
                      onClick={() => toggleSetCompletion(exercise.id, set.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                        set.completed 
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                          : 'bg-slate-200/80 dark:bg-white/10 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-500'
                      }`}
                    >
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </button>
                    
                    {/* Delete Set Button - visible on hover */}
                    <button 
                      aria-label="Delete set"
                      onClick={() => removeSet(exercise.id, set.id)}
                      className="absolute -right-8 opacity-0 group-hover/set:opacity-100 transition-opacity p-2 text-slate-400 hover:text-red-500 hidden sm:block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Set Button */}
            <div className="pt-2">
              <button 
                onClick={() => addSet(exercise.id)}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-500 font-bold text-xs hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Set</span>
              </button>
            </div>
          </div>
        ))}

        {/* Exercise Search Modal */}
        {showExerciseSearch && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowExerciseSearch(false); setExerciseSearch(''); setMuscleFilter('All'); } }}
          >
            <div className="w-full max-w-lg bg-slate-50 dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200/10">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 dark:text-slate-100 text-sm">Exercise Library</h2>
                    <p className="text-[10px] text-slate-400 font-bold">{EXERCISE_LIBRARY.length} exercises · tap to add</p>
                  </div>
                </div>
                <button
                  aria-label="Close search"
                  onClick={() => { setShowExerciseSearch(false); setExerciseSearch(''); setMuscleFilter('All'); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Input */}
              <div className="px-5 pt-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search exercises... e.g. Squat, Curl"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  {exerciseSearch && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setExerciseSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Muscle Filter Pills */}
              <div className="flex items-center gap-1.5 px-5 py-2 overflow-x-auto no-scrollbar">
                {MUSCLES.map(m => (
                  <button
                    key={m}
                    onClick={() => setMuscleFilter(m)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                      muscleFilter === m
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md'
                        : 'bg-slate-100/80 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Results */}
              {(() => {
                const query = exerciseSearch.toLowerCase().trim();
                const filtered = EXERCISE_LIBRARY.filter(ex => {
                  const matchesMuscle = muscleFilter === 'All' || ex.muscle === muscleFilter;
                  const matchesSearch = !query || ex.name.toLowerCase().includes(query) || ex.muscle.toLowerCase().includes(query);
                  return matchesMuscle && matchesSearch;
                });

                // Check which ones user has past history for
                const alreadyInSession = new Set(workout.exercises.map(e => e.name.toLowerCase()));

                return (
                  <div className="overflow-y-auto flex-1 px-5 pb-5 pt-1 space-y-1">
                    {filtered.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-slate-400 font-bold text-sm">No exercises found</p>
                        <button
                          onClick={() => { if (exerciseSearch.trim().length > 1) addExerciseByName(exerciseSearch.trim()); }}
                          className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          + Add "{exerciseSearch}" as custom exercise
                        </button>
                      </div>
                    ) : (
                      filtered.map(ex => {
                        const hasHistory = getExerciseHistory(ex.name, workout.date).length > 0;
                        const inSession = alreadyInSession.has(ex.name.toLowerCase());
                        return (
                          <button
                            key={ex.name}
                            onClick={() => !inSession && addExerciseByName(ex.name)}
                            disabled={inSession}
                            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${inSession ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-white/5' : 'hover:bg-emerald-500/8 dark:hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent cursor-pointer group/ex'}`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xl w-8 text-center">{ex.emoji}</span>
                              <div>
                                <span className="font-black text-sm text-slate-800 dark:text-slate-100 group-hover/ex:text-emerald-600 dark:group-hover/ex:text-emerald-400 transition-colors block">
                                  {ex.name}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{ex.muscle}</span>
                                  <span className="text-[9px] text-slate-300 dark:text-slate-600">·</span>
                                  <span className={`text-[9px] font-bold uppercase ${
                                    ex.category === 'Push' ? 'text-orange-400' :
                                    ex.category === 'Pull' ? 'text-blue-400' :
                                    ex.category === 'Legs' ? 'text-purple-400' :
                                    ex.category === 'Core' ? 'text-cyan-400' : 'text-pink-400'
                                  }`}>{ex.category}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {hasHistory && (
                                <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">📈 History</span>
                              )}
                              {inSession && (
                                <span className="text-[9px] font-black text-slate-400 bg-slate-100/80 dark:bg-white/5 px-2 py-0.5 rounded-full">Added</span>
                              )}
                              <Plus className="w-4 h-4 text-slate-300 group-hover/ex:text-emerald-500 transition-colors" />
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Add Exercise Button — opens search modal */}
        <button
          onClick={() => { setShowExerciseSearch(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
          className="w-full py-5 rounded-3xl glass border border-slate-200/20 dark:border-white/10 text-slate-700 dark:text-slate-300 font-black text-sm hover:border-emerald-500/50 hover:text-emerald-500 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>Search &amp; Add Exercise</span>
        </button>
      </div>
    </div>
  );
}
