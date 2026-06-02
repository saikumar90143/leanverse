'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Sparkles, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Activity, Clock, Flame, Trophy, Star, Shield, ArrowRight, Target, Plus, Search, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { getUserStorageKey, formatLocalDate } from '@/lib/storage';
import { TransformationState, UserProfile, Goal, WorkoutLocation, ExperienceLevel, WorkoutExercise } from '@/lib/types/transformation';
import { generateTransformationJourney, populateExercisesForDay, logWorkoutCompletion, areExercisesSimilar } from '@/lib/workoutEngine';
import { transformationExercises } from '@/lib/transformationExercises';

export default function AIWorkoutPlanner() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Transformation State
  const [state, setState] = useState<TransformationState | null>(null);
  
  // Wizard States
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<WorkoutLocation>('gym');
  const [experience, setExperience] = useState<ExperienceLevel>('intermediate');
  const [duration, setDuration] = useState<20|30|45|60|90>(60);
  const [goal, setGoal] = useState<Goal>('muscle');
  const [daysPerWeek, setDaysPerWeek] = useState<3|4|5|6|7>(4);
  const [timelineDays, setTimelineDays] = useState(30);
  const [equipment, setEquipment] = useState<string[]>(['dumbbells']);
  const [loading, setLoading] = useState(false);

  // Active Workout State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMax, setTimerMax] = useState(60);
  const [logs, setLogs] = useState<Record<string, { reps: string; weight: string }[]>>({});
  
  // Exercise Search Modal
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if we arrived here from the Quick Start wizard on the home page
    try {
      const pendingStr = localStorage.getItem('leanverse_pending_wizard');
      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        if (pending.goal) setGoal(pending.goal as Goal);
        if (pending.location) setLocation(pending.location as WorkoutLocation);
        if (pending.experience) setExperience(pending.experience as ExperienceLevel);
        if (pending.timelineDays) setTimelineDays(pending.timelineDays as 30|60|90|120);
        localStorage.removeItem('leanverse_pending_wizard');
      }
    } catch {}

    if (!user) return; // Don't load guest state if we are about to redirect
    
    // Load state from local storage
    const storageKey = getUserStorageKey('leanverse_transformation');
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Ensure today's workout is populated
        if (parsed && parsed.currentDay <= parsed.totalDays) {
          const updatedState = { ...parsed };
          updatedState.schedule[parsed.currentDay - 1] = populateExercisesForDay(updatedState, parsed.currentDay - 1);
          setState(updatedState);
        } else {
          setState(parsed);
        }
      } catch (e) {
        console.error('Failed to parse transformation state', e);
      }
    }
  }, [user]);

  useEffect(() => {
    if (state && isMounted) {
      localStorage.setItem(getUserStorageKey('leanverse_transformation'), JSON.stringify(state));
    }
  }, [state, isMounted, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      setTimerSeconds(timerMax);
      alert('Rest session finished! Get back to lifting.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds, timerMax]);

  const toggleEquipment = (eq: string) => {
    setEquipment((prev) => prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]);
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(async () => {
      const profile: UserProfile = {
        age: 25, // Mock default
        gender: 'male',
        height: 175,
        weight: 75,
        goal,
        location,
        experience,
        daysPerWeek,
        sessionDuration: duration,
        timelineDays,
        injuries: [],
        equipment: location === 'gym' ? ['gym', 'barbell', 'dumbbells', 'cables', 'bodyweight'] : equipment
      };
      
      let newState = generateTransformationJourney(profile);
      newState.schedule[0] = populateExercisesForDay(newState, 0); // Populate day 1
      setState(newState);
      setLoading(false);
      
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  const handleLogChange = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', val: string) => {
    setLogs((prev) => {
      const exLogs = prev[exerciseId] ? [...prev[exerciseId]] : [];
      if (!exLogs[setIndex]) exLogs[setIndex] = { weight: '', reps: '' };
      exLogs[setIndex] = { ...exLogs[setIndex], [field]: val };
      return { ...prev, [exerciseId]: exLogs };
    });
  };

  const handleCompleteWorkout = () => {
    if (!state) return;
    
    const dayIndex = state.currentDay - 1;
    const prevDay = dayIndex > 0 ? state.schedule[dayIndex - 1] : null;
    
    if (prevDay && prevDay.dateCompleted && new Date(prevDay.dateCompleted).toDateString() === new Date().toDateString()) {
      alert("You've already conquered today's mission! Rest up and come back tomorrow.");
      return;
    }

    const day = state.schedule[dayIndex];
    
    const completionLogs = day.mainExercises.map(ex => ({
      exerciseId: ex.exerciseId,
      sets: Array.from({ length: ex.targetSets }).map((_, i) => ({
        reps: parseInt(logs[ex.id]?.[i]?.reps || ex.targetReps.split('-')[0] || '10'),
        weight: logs[ex.id]?.[i]?.weight || 'Bodyweight'
      }))
    }));

    let newState = logWorkoutCompletion(state, dayIndex, completionLogs);
    
    // Move to next day
    if (newState.currentDay < newState.totalDays) {
      newState.currentDay++;
      newState.schedule[newState.currentDay - 1] = populateExercisesForDay(newState, newState.currentDay - 1);
    }
    
    setState(newState);
    setLogs({}); // Clear logs for next day
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddExtraExercise = (dbExerciseId: string) => {
    if (!state) return;
    const dbExercise = transformationExercises.find(e => e.id === dbExerciseId);
    if (!dbExercise) return;
    
    const dayIndex = state.currentDay - 1;
    const newState = { ...state, schedule: [...state.schedule] };
    const day = { ...newState.schedule[dayIndex] };
    
    if (day.mainExercises.some(ex => ex.exerciseId === dbExerciseId)) {
      alert('This exercise is already in your routine today.');
      return;
    }
    
    if (day.mainExercises.some(ex => areExercisesSimilar(ex.name, dbExercise.name))) {
      alert('A very similar exercise is already in your routine today. Pick something different for better muscle stimulation!');
      return;
    }

    const newEx: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId: dbExercise.id,
      name: dbExercise.name,
      targetSets: 3,
      targetReps: '10-12',
      targetWeight: 'Auto-regulate',
      restSeconds: 60,
      completed: false,
      loggedSets: []
    };
    
    day.mainExercises = [...day.mainExercises, newEx];
    newState.schedule[dayIndex] = day;
    
    setState(newState);
    setShowExerciseSearch(false);
    setExerciseSearch('');
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (!state || !confirm('Remove this exercise?')) return;
    const dayIndex = state.currentDay - 1;
    const newState = { ...state, schedule: [...state.schedule] };
    const day = { ...newState.schedule[dayIndex] };
    
    day.mainExercises = day.mainExercises.filter(ex => ex.id !== exerciseId);
    newState.schedule[dayIndex] = day;
    setState(newState);
  };

  const handleToggleExerciseComplete = (exerciseId: string) => {
    if (!state) return;
    const dayIndex = state.currentDay - 1;
    const newState = { ...state, schedule: [...state.schedule] };
    const day = { ...newState.schedule[dayIndex] };
    
    const targetEx = day.mainExercises.find(ex => ex.id === exerciseId);
    if (!targetEx) return;

    if (!targetEx.completed) {
      const exLogs = logs[exerciseId] || [];
      const isComplete = Array.from({ length: targetEx.targetSets }).every((_, i) => {
        const setLog = exLogs[i];
        return setLog && setLog.weight.trim() !== '' && String(setLog.reps).trim() !== '';
      });

      if (!isComplete) {
        alert('Please log all weights and reps before marking this exercise as complete.');
        return;
      }
    }
    
    day.mainExercises = day.mainExercises.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    );
    newState.schedule[dayIndex] = day;
    setState(newState);
  };

  const resetJourney = () => {
    if (confirm('Are you sure you want to discard your current transformation journey? All progress will be lost.')) {
      setState(null);
      setStep(1);
      localStorage.removeItem(getUserStorageKey('leanverse_transformation'));
    }
  };

  const getExerciseImage = (muscleGroup?: string, pattern?: string) => {
    if (pattern) {
      const p = pattern.toLowerCase();
      if (p.includes('horizontal_push')) return '/images/chest.png';
      if (p.includes('chest_isolation')) return '/images/chest_isolation.png';
      if (p.includes('vertical_pull')) return '/images/vertical_pull.png';
      if (p.includes('horizontal_pull')) return '/images/horizontal_pull.png';
      if (p.includes('hinge')) return '/images/back.png';
      if (p.includes('vertical_push')) return '/images/vertical_push.png';
      if (p.includes('shoulder_isolation')) return '/images/shoulders.png';
      if (p.includes('bicep_isolation')) return '/images/arms.png';
      if (p.includes('tricep_isolation')) return '/images/tricep_isolation.png';
      if (p.includes('squat')) return '/images/legs.png';
      if (p.includes('lunge')) return '/images/lunge.png';
      if (p.includes('leg_isolation')) return '/images/leg_isolation.png';
      if (p.includes('core_flexion')) return '/images/core_flexion.png';
      if (p.includes('core_iso')) return '/images/abs.png';
      if (p.includes('cardio')) return '/images/cardio.png';
    }

    if (!muscleGroup) return '/images/chest.png';
    const mg = muscleGroup.toLowerCase();
    if (mg.includes('chest')) return '/images/chest.png';
    if (mg.includes('back')) return '/images/back.png';
    if (mg.includes('shoulder')) return '/images/shoulders.png';
    if (mg.includes('bicep') || mg.includes('tricep') || mg.includes('arm')) return '/images/arms.png';
    if (mg.includes('leg')) return '/images/legs.png';
    if (mg.includes('abs') || mg.includes('core')) return '/images/abs.png';
    if (mg.includes('cardio')) return '/images/cardio.png';
    return '/images/chest.png';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RotateCcw className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }
  
  if (!user || !isMounted) return null;

  const renderWizard = () => (
    <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
            Transformation Journey Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Build a personalized, gamified, multi-phase fitness journey.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
      </div>

      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Step 1: Focus & Timeline</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block ml-1">Transformation Goal</span>
              <select value={goal} onChange={(e) => setGoal(e.target.value as Goal)} className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
                <option value="muscle">Muscle Building</option>
                <option value="fatloss">Fat Loss</option>
                <option value="leanbulk">Lean Bulk</option>
                <option value="strength">Strength</option>
                <option value="recomp">Body Recomposition</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block ml-1">Journey Length</span>
              <select value={timelineDays} onChange={(e) => setTimelineDays(parseInt(e.target.value))} className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
                <option value="30">30 Days (Quick Reset)</option>
                <option value="60">60 Days (Transformation)</option>
                <option value="90">90 Days (Complete Rebuild)</option>
                <option value="120">120 Days (Elite Journey)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block ml-1">Experience</span>
              <select value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)} className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block ml-1">Days / Week</span>
              <select value={daysPerWeek} onChange={(e) => setDaysPerWeek(parseInt(e.target.value) as any)} className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block ml-1">Duration</span>
              <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value) as any)} className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500">
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
          </div>

          <button onClick={() => setStep(2)} className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer">
            <span>Next Phase</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Step 2: Environment & Gear</span>
          
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 dark:bg-white/5 border border-slate-200/10 rounded-2xl mb-4">
            <button onClick={() => setLocation('gym')} className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${location === 'gym' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}>Commercial Gym</button>
            <button onClick={() => setLocation('home')} className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${location === 'home' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}>Home Setup</button>
          </div>

          {location === 'home' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[{id: 'dumbbells', name: 'Dumbbells'}, {id: 'barbell', name: 'Barbell'}, {id: 'cables', name: 'Cables'}, {id: 'bodyweight', name: 'Bodyweight Only'}].map((eq) => (
                <button
                  key={eq.id} onClick={() => toggleEquipment(eq.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${equipment.includes(eq.id) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-300/10 bg-slate-100/50 dark:bg-white/5 text-slate-500'}`}
                >
                  <Dumbbell className="w-4 h-4 shrink-0" />
                  <span>{eq.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Commercial Gym Selected: All equipment unlocked!</span>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all cursor-pointer">Back</button>
            <button onClick={handleGenerate} disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 cursor-pointer">
              {loading ? <RotateCcw className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1 text-amber-300" />}
              <span>Build Journey</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => {
    if (!state) return null;
    
    const activeDay = state.schedule[state.currentDay - 1] || state.schedule[state.totalDays - 1];
    const progressPercent = Math.round((state.currentDay / state.totalDays) * 100);
    const allCompleted = activeDay.isRestDay || activeDay.mainExercises.every(ex => ex.completed);
    
    const prevDay = state.currentDay > 1 ? state.schedule[state.currentDay - 2] : null;
    const isAlreadyWorkedOutToday = prevDay?.dateCompleted ? new Date(prevDay.dateCompleted).toDateString() === new Date().toDateString() : false;
    
    const canComplete = allCompleted && !isAlreadyWorkedOutToday;

    return (
      <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-emerald-500 font-extrabold text-xs uppercase tracking-widest mb-2">
                <Target className="w-4 h-4" />
                <span>{activeDay.phaseName}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
                Day {state.currentDay} <span className="text-slate-400">/ {state.totalDays}</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Keep pushing. Your {state.profile.goal} transformation is {progressPercent}% complete.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto mt-6 md:mt-0">
              <div className="bg-slate-100/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/10">
                <div className="flex items-center space-x-1.5 text-amber-500 mb-1">
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">{state.streak} Days</div>
              </div>
              <div className="bg-slate-100/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/10 min-w-[120px]">
                <div className="flex items-center space-x-1.5 text-blue-500 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">XP Points</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white">{state.xp}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-2xl shadow-lg text-white col-span-2 sm:col-span-1">
                <div className="flex items-center space-x-1.5 mb-1 text-emerald-100">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Rank</span>
                </div>
                <div className="text-2xl font-black">{state.levelName}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Daily Mission */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="truncate">Today's Mission: {activeDay.workoutName}</span>
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-200/50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-300/10 w-fit">
                ~{activeDay.estimatedMinutes} mins
              </span>
            </div>

            <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200/10 space-y-6">
              {activeDay.isRestDay ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🧘</div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Active Recovery Day</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Your muscles grow outside the gym. Focus on hydration, light mobility, and sleep today.
                  </p>
                  <button 
                    onClick={handleCompleteWorkout} 
                    disabled={isAlreadyWorkedOutToday}
                    className={`px-8 py-4 font-bold rounded-2xl shadow-lg transition-all cursor-pointer text-lg ${isAlreadyWorkedOutToday ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                  >
                    {isAlreadyWorkedOutToday ? 'Come Back Tomorrow!' : 'Mark Rest Day Complete (+50 XP)'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Warmup Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 1: Warmup</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeDay.warmup.map((w, i) => (
                        <span key={i} className="text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20">{w}</span>
                      ))}
                    </div>
                  </div>

                  {/* Main Workout Exercises */}
                  <div className="space-y-4 pt-4 border-t border-slate-200/10">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 2: Main Routine</h4>
                    {activeDay.mainExercises.map((ex, idx) => (
                      <div key={ex.id} className={`p-4 sm:p-5 rounded-2xl space-y-4 group transition-all ${ex.completed ? 'bg-emerald-500/5 border border-emerald-500/30' : 'bg-slate-100/40 dark:bg-white/5 border border-slate-300/5'}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className={`flex gap-4 items-start ${ex.completed ? 'opacity-60' : ''}`}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200/10 shadow-inner bg-slate-200 dark:bg-zinc-800 relative group-hover:scale-105 transition-transform duration-500">
                               <img src={getExerciseImage(ex.muscleGroup, ex.pattern)} alt={ex.name} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                               <span className="absolute bottom-2 right-2 text-[10px] font-black tracking-widest uppercase text-white/90">{ex.muscleGroup || 'Exercise'}</span>
                            </div>
                            <div>
                              <span className="text-xs font-black text-emerald-500 mb-1 block">EXERCISE 0{idx + 1}</span>
                              <h5 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight mb-1">{ex.name}</h5>
                              <p className="text-xs text-slate-500 font-semibold">{ex.targetSets} Sets • {ex.targetReps} Reps • {ex.restSeconds}s Rest</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 shrink-0 text-center">
                              Target: {ex.targetWeight}
                            </div>
                            <button onClick={() => handleToggleExerciseComplete(ex.id)} className={`p-2 rounded-lg transition-colors hidden sm:block ${ex.completed ? 'text-emerald-500 bg-emerald-500/10 opacity-100' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 opacity-0 group-hover:opacity-100'}`}>
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleRemoveExercise(ex.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors hidden sm:block opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Logging UI */}
                        <div className={`space-y-2 pt-3 border-t border-slate-200/10 transition-opacity ${ex.completed ? 'opacity-50 pointer-events-none' : ''}`}>
                          {Array.from({ length: ex.targetSets }).map((_, setIdx) => (
                            <div key={setIdx} className="flex items-center gap-2 w-full">
                              <div className="bg-slate-200/50 dark:bg-white/5 rounded-lg w-8 h-9 flex items-center justify-center shrink-0">
                                <span className="text-xs font-black text-slate-500">{setIdx + 1}</span>
                              </div>
                              <input 
                                type="text" 
                                placeholder="Weight" 
                                value={logs[ex.id]?.[setIdx]?.weight || ''}
                                onChange={(e) => handleLogChange(ex.id, setIdx, 'weight', e.target.value)}
                                className="min-w-0 flex-1 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-emerald-500 text-center sm:text-left"
                              />
                              <span className="text-slate-300 dark:text-slate-600 font-bold shrink-0">×</span>
                              <input 
                                type="number" 
                                placeholder="Reps" 
                                value={logs[ex.id]?.[setIdx]?.reps || ''}
                                onChange={(e) => handleLogChange(ex.id, setIdx, 'reps', e.target.value)}
                                className="min-w-0 w-16 sm:w-20 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-2 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-emerald-500 text-center shrink-0"
                              />
                            </div>
                          ))}
                        </div>
                        {/* Mobile actions */}
                        <div className="flex gap-2 mt-2 sm:hidden">
                          <button onClick={() => handleToggleExerciseComplete(ex.id)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors ${ex.completed ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-200/50 dark:bg-white/5'}`}>
                            {ex.completed ? 'Completed' : 'Mark Complete'}
                          </button>
                          <button onClick={() => handleRemoveExercise(ex.id)} className="flex-1 py-2 text-xs font-bold text-red-500 bg-red-500/5 rounded-xl">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setShowExerciseSearch(true)}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-500 font-bold text-xs hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Extra Exercise</span>
                    </button>
                  </div>

                  {/* Finisher & Cooldown */}
                  <div className="space-y-3 pt-4 border-t border-slate-200/10">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 3: Finisher & Cooldown</h4>
                    <div className="flex flex-col gap-2">
                      <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-500/20 text-sm font-bold">🔥 Finisher: {activeDay.finisher}</div>
                      <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-xl border border-blue-500/20 text-sm font-bold">❄️ Cooldown: {activeDay.cooldown.join(', ')}</div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCompleteWorkout} 
                    disabled={!canComplete}
                    className={`w-full mt-4 py-4 font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 ${canComplete ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white cursor-pointer' : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed opacity-50'}`}
                  >
                    <span>{isAlreadyWorkedOutToday ? 'Come Back Tomorrow!' : allCompleted ? 'Mission Complete (+250 XP)' : 'Complete All Exercises First'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 order-first lg:order-last">
            {/* Rest Timer */}
            <div className="glass p-6 rounded-3xl border border-slate-200/10 text-center flex flex-col items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Rest Timer</span>
              <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin [animation-duration:12s]" style={{ animationPlayState: timerActive ? 'running' : 'paused' }} />
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{timerSeconds}s</span>
              </div>
              <div className="flex space-x-2 w-full mb-4">
                <button onClick={() => setTimerActive(!timerActive)} className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold cursor-pointer text-sm flex justify-center items-center">
                  {timerActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1 fill-current" />} {timerActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={() => { setTimerSeconds(timerMax); setTimerActive(false); }} className="px-4 py-3 bg-slate-200/50 dark:bg-white/5 rounded-xl cursor-pointer">
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="flex space-x-2 w-full">
                {[45, 60, 90].map(s => (
                  <button key={s} onClick={() => { setTimerMax(s); setTimerSeconds(s); setTimerActive(true); }} className="flex-1 py-1.5 text-xs font-bold text-slate-500 bg-slate-200/40 dark:bg-white/5 rounded-lg border border-slate-300/10 cursor-pointer">{s}s</button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="glass p-6 rounded-3xl border border-slate-200/10 text-center">
               <button onClick={resetJourney} className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-all cursor-pointer text-sm">
                 Abandon Journey & Reset
               </button>
            </div>
          </div>
        </div>

        {/* Exercise Search Modal */}
        {showExerciseSearch && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowExerciseSearch(false); setExerciseSearch(''); } }}
          >
            <div className="w-full max-w-lg bg-slate-50 dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200/10">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 dark:text-slate-100 text-sm">Add Extra Exercise</h2>
                    <p className="text-[10px] text-slate-400 font-bold">Search from database</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowExerciseSearch(false); setExerciseSearch(''); }}
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
                      onClick={() => setExerciseSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results */}
              <div className="overflow-y-auto p-2">
                {transformationExercises
                  .filter(ex => exerciseSearch === '' || ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()))
                  .slice(0, 50)
                  .map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => handleAddExtraExercise(ex.id)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group cursor-pointer text-left"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{ex.name}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{ex.muscleGroup} • {ex.requiredEquipment.join(', ')}</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {state ? renderDashboard() : renderWizard()}
    </div>
  );
}
