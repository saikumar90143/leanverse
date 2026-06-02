'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Sparkles, Play, Pause, RotateCcw, Trash, Plus, CheckCircle2, ChevronRight, Activity, Clock, Flame, Share2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { getUserStorageKey } from '@/lib/storage';
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number; // in seconds
  notes: string;
}

export default function AIWorkoutPlanner() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<'gym' | 'home'>('gym');
  const [experience, setExperience] = useState('intermediate');
  const [duration, setDuration] = useState(60);
  const [goal, setGoal] = useState('muscle');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [equipment, setEquipment] = useState<string[]>(['dumbbells']);
  const [weeklyRoutine, setWeeklyRoutine] = useState<any[]>([]);

  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Workout Timer States
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMax, setTimerMax] = useState(60);

  // Progressive Overload logging
  const [overloadLog, setOverloadLog] = useState<Record<string, { weight: string; reps: string }>>({});

  const shareText = encodeURIComponent("I just generated my AI Workout Split on LeanVerse! 💪");
  const shareWhatsapp = `https://wa.me/?text=${shareText}`;
  const shareX = `https://twitter.com/intent/tweet?text=${shareText}`;

  // Smart Exercise Swapping
  const [swaps, setSwaps] = useState<Record<string, number>>({
    BenchPress: 0, OHP: 0, LateralRaises: 0, TricepExtension: 0,
    Pullups: 0, BarbellRow: 0, FacePulls: 0, BicepCurls: 0,
    Squats: 0, RDLs: 0, LegExtensions: 0, Calves: 0
  });

  const alternatives = {
    BenchPress: ['Barbell Flat Bench Press', 'Dumbbell Flat Bench Press', 'Machine Chest Press', 'Push-ups'],
    OHP: ['Standing Barbell Overhead Press (OHP)', 'Seated Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Pike Push-ups'],
    LateralRaises: ['Dumbbell Lateral Raises', 'Cable Lateral Raises', 'Machine Lateral Raises', 'Resistance Band Raises'],
    TricepExtension: ['Cable Tricep Overhead Extension', 'EZ Bar Skullcrushers', 'Dumbbell Kickbacks', 'Diamond Push-ups'],
    Pullups: ['Pull-ups', 'Lat Pulldown', 'Assisted Pull-ups', 'Resistance Band Pulldowns'],
    BarbellRow: ['Barbell Row', 'Seated Cable Row', 'Dumbbell Row', 'Bodyweight Inverted Row'],
    FacePulls: ['Face Pulls', 'Rear Delt Flyes', 'Reverse Pec Deck', 'Band Face Pulls'],
    BicepCurls: ['Barbell Bicep Curls', 'Dumbbell Bicep Curls', 'Cable Curls', 'Resistance Band Curls'],
    Squats: ['Barbell Back Squats', 'Leg Press', 'Dumbbell Goblet Squats', 'Bodyweight Squats'],
    RDLs: ['Romanian Deadlifts (RDL)', 'Hamstring Curls', 'Dumbbell RDLs', 'Glute Bridges'],
    LegExtensions: ['Leg Extensions', 'Bulgarian Split Squats', 'Walking Lunges', 'Bodyweight Lunges'],
    Calves: ['Standing Calf Raises', 'Seated Calf Raises', 'Leg Press Calf Raises', 'Bodyweight Calf Raises']
  };

  const handleSwap = (slot: keyof typeof alternatives) => {
    setSwaps(prev => ({
      ...prev,
      [slot]: (prev[slot] + 1) % alternatives[slot].length
    }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      // Play a quick chime (using synth audio helper)
      if (typeof window !== 'undefined') {
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.connect(gain);
          gain.connect(context.destination);
          osc.frequency.setValueAtTime(587.33, context.currentTime); // D5 note
          gain.gain.setValueAtTime(0.1, context.currentTime);
          osc.start();
          osc.stop(context.currentTime + 0.3);
        } catch (e) {}
      }
      setTimerSeconds(timerMax);
      alert('Rest session finished! Get back to lifting.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const toggleEquipment = (eq: string) => {
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]
    );
  };

  const getBestVariationIndex = (key: keyof typeof alternatives) => {
    const list = alternatives[key];
    const isBodyweight = equipment.length === 1 && equipment.includes('bodyweight');
    if (isBodyweight) {
      const idx = list.findIndex(name => name.toLowerCase().includes('bodyweight') || name.toLowerCase().includes('push-up') || name.toLowerCase().includes('pull-up') || name.toLowerCase().includes('bridge') || name.toLowerCase().includes('lunges'));
      if (idx !== -1) return idx;
    }
    if (equipment.includes('dumbbells')) {
      const idx = list.findIndex(name => name.toLowerCase().includes('dumbbell') || name.toLowerCase().includes('goblet'));
      if (idx !== -1) return idx;
    }
    if (equipment.includes('barbell')) {
      const idx = list.findIndex(name => name.toLowerCase().includes('barbell'));
      if (idx !== -1) return idx;
    }
    if (equipment.includes('cables') || equipment.includes('resistance_bands')) {
      const idx = list.findIndex(name => name.toLowerCase().includes('cable') || name.toLowerCase().includes('band') || name.toLowerCase().includes('machine'));
      if (idx !== -1) return idx;
    }
    return 0; // fallback to the first option
  };

  const getExerciseImage = (key: string) => {
    const map: Record<string, string> = {
      BenchPress: 'push.png',
      OHP: 'ohp.png',
      LateralRaises: 'lateralraises.png',
      TricepExtension: 'tricepextension.png',
      Pullups: 'pull.png',
      BarbellRow: 'barbellrow.png',
      FacePulls: 'facepulls.png',
      BicepCurls: 'arms.png',
      Squats: 'legs.png',
      RDLs: 'rdls.png',
      LegExtensions: 'legextensions.png',
      Calves: 'calves.png'
    };
    return `/images/exercises/${map[key] || 'arms.png'}`;
  };

  const generateRoutine = () => {
    // Smart Defaults based on equipment
    const initialSwaps: Record<string, number> = {};
    (Object.keys(alternatives) as Array<keyof typeof alternatives>).forEach(key => {
      initialSwaps[key] = getBestVariationIndex(key);
    });
    setSwaps(initialSwaps);

    const pushExercises = [
      { key: 'BenchPress', target: 'Pectoralis Major', sets: '4 Sets x 8-10 Reps' },
      { key: 'OHP', target: 'Anterior Deltoids', sets: '3 Sets x 8-10 Reps' },
      { key: 'LateralRaises', target: 'Lateral Deltoids', sets: '4 Sets x 12-15 Reps' },
      { key: 'TricepExtension', target: 'Triceps Long Head', sets: '3 Sets x 10-12 Reps' },
    ];
    const pullExercises = [
      { key: 'Pullups', target: 'Latissimus Dorsi', sets: '4 Sets x 8-12 Reps' },
      { key: 'BarbellRow', target: 'Rhomboids & Mid Back', sets: '3 Sets x 8-10 Reps' },
      { key: 'FacePulls', target: 'Rear Deltoids', sets: '3 Sets x 12-15 Reps' },
      { key: 'BicepCurls', target: 'Biceps Brachii', sets: '4 Sets x 10-12 Reps' },
    ];
    const legExercises = [
      { key: 'Squats', target: 'Quadriceps & Glutes', sets: '4 Sets x 6-8 Reps' },
      { key: 'RDLs', target: 'Hamstrings', sets: '3 Sets x 8-10 Reps' },
      { key: 'LegExtensions', target: 'Quadriceps', sets: '3 Sets x 12-15 Reps' },
      { key: 'Calves', target: 'Calves', sets: '4 Sets x 15-20 Reps' },
    ];
    
    // Derived Days
    const upperExercises = [pushExercises[0], pullExercises[0], pushExercises[1], pullExercises[1], pushExercises[2], pullExercises[3]];
    const lowerExercises = legExercises;
    const fullBodyExercises = [legExercises[0], pushExercises[0], pullExercises[1], pushExercises[1], legExercises[1], pullExercises[3]];

    const pushDay = { dayType: "Push Day", exercises: pushExercises, isRest: false };
    const pullDay = { dayType: "Pull Day", exercises: pullExercises, isRest: false };
    const legDay = { dayType: "Leg Day", exercises: legExercises, isRest: false };
    const upperDay = { dayType: "Upper Body", exercises: upperExercises, isRest: false };
    const lowerDay = { dayType: "Lower Body", exercises: lowerExercises, isRest: false };
    const fullBodyDay = { dayType: "Full Body", exercises: fullBodyExercises, isRest: false };
    const restDay = { dayType: "Rest Day", exercises: [], isRest: true };

    const routine: Array<{ dayType: string, exercises: any[], isRest: boolean }> = [];
    if (daysPerWeek === 2) {
      routine.push(fullBodyDay, restDay, restDay, fullBodyDay, restDay, restDay, restDay);
    } else if (daysPerWeek === 3) {
      routine.push(pushDay, restDay, pullDay, restDay, legDay, restDay, restDay);
    } else if (daysPerWeek === 4) {
      routine.push(upperDay, lowerDay, restDay, upperDay, lowerDay, restDay, restDay);
    } else if (daysPerWeek === 5) {
      routine.push(upperDay, lowerDay, restDay, pushDay, pullDay, legDay, restDay);
    } else if (daysPerWeek === 6) {
      routine.push(pushDay, pullDay, legDay, pushDay, pullDay, legDay, restDay);
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return routine.map((r, i) => ({
      day: `${daysOfWeek[i]} - ${r.dayType}`,
      dayType: r.dayType,
      burn: r.isRest ? "0 kcal (Recovery)" : `~ ${r.exercises.length * 110} kcal Burned`,
      exercises: r.exercises,
      isRest: r.isRest
    }));
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(async () => {
      setWeeklyRoutine(generateRoutine());
      setLoading(false);
      setGenerated(true);
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ['#06b6d4', '#10b981'],
      });
    }, 1500);
  };

  const handleTimerStart = (secs: number) => {
    setTimerMax(secs);
    setTimerSeconds(secs);
    setTimerActive(true);
  };

  const handleLogChange = (exerciseName: string, field: 'weight' | 'reps', val: string) => {
    setOverloadLog((prev) => ({
      ...prev,
      [exerciseName]: {
        ...prev[exerciseName],
        [field]: val,
      },
    }));
  };

  const handleSendToTracker = () => {
    if (!user) {
      alert('Please log in first to track and save your workouts.');
      router.push('/login');
      return;
    }

    const firstActiveDay = weeklyRoutine.find(d => !d.isRest);
    if (!firstActiveDay) return;

    const workoutToSave = {
      name: firstActiveDay.day.split(' - ')[1] || firstActiveDay.day,
      date: new Date().toISOString().split('T')[0],
      exercises: firstActiveDay.exercises.map((ex: any) => ({
        id: crypto.randomUUID(),
        name: alternatives[ex.key as keyof typeof alternatives][swaps[ex.key]],
        sets: Array.from({ length: parseInt(ex.sets.charAt(0)) || 3 }).map(() => ({
          id: crypto.randomUUID(),
          weight: overloadLog[ex.key]?.weight || '',
          reps: overloadLog[ex.key]?.reps || parseInt(ex.sets.split('x ')[1]?.split('-')[0]) || 10,
          completed: false
        }))
      }))
    };

    localStorage.setItem(getUserStorageKey('leanverse_workout_tracker'), JSON.stringify(workoutToSave));
    router.push('/workout-tracker');
  };

  const gearOptions = [
    { id: 'dumbbells', name: 'Dumbbells' },
    { id: 'barbell', name: 'Barbells' },
    { id: 'cables', name: 'Cable Stations' },
    { id: 'resistance_bands', name: 'Resistance Bands' },
    { id: 'bodyweight', name: 'Bodyweight Only' },
  ];



  if (!isMounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {!generated ? (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
                AI Workout split Builder
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generate highly tailored gym splits and progressive overload logs.
              </p>
            </div>
          </div>

          {/* Wizard step dots */}
          <div className="flex items-center space-x-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
          </div>

          {/* Step 1: Location & Goals */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Step 1: Focus & Target</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Training Target Location</span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 dark:bg-white/5 border border-slate-200/10 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setLocation('gym')}
                      className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        location === 'gym' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Commercial Gym
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation('home')}
                      className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        location === 'home' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Home Training
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Workout Goal</span>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="muscle">Muscle Building (Hypertrophy)</option>
                    <option value="fatloss">Fat Loss & Conditioning</option>
                    <option value="hiit">HIIT Cardio Circuits</option>
                    <option value="yoga">Yoga & Mobility splits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Experience Level</span>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="beginner">Beginner (1-6 months)</option>
                    <option value="intermediate">Intermediate (1-2 years)</option>
                    <option value="advanced">Advanced (3+ years lifting)</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Duration Cap</span>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Days Per Week</span>
                  <select
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="2">2 Days (Full Body)</option>
                    <option value="3">3 Days (Push/Pull/Legs)</option>
                    <option value="4">4 Days (Upper/Lower Split)</option>
                    <option value="5">5 Days (Upper/Lower/PPL)</option>
                    <option value="6">6 Days (PPL x 2)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Available Gear */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Step 2: Available Equipment</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {gearOptions.map((eq) => (
                  <button
                    type="button"
                    key={eq.id}
                    onClick={() => toggleEquipment(eq.id)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                      equipment.includes(eq.id)
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : 'border-slate-300/10 bg-slate-100/50 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4 shrink-0" />
                    <span>{eq.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin mr-1" />
                      <span>Drafting splits...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current mr-1 text-amber-300 animate-pulse" />
                      <span>Assemble Routine</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Generated split view layout */
        <div className="space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden print-card">
            <div>
              <div className="flex items-center space-x-1 text-emerald-500 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                <span>Custom split mapped successfully</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                Weekly training Split: PPL routine
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Hypertrophy split optimized for a **{experience}** lifter training for **{duration} minutes** using **{location === 'gym' ? 'commercial gym gear' : 'home setups'}**.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 no-print">
              <button
                onClick={() => setGenerated(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300/10 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-500 dark:text-slate-300 hover:text-emerald-500 font-bold transition-all text-sm cursor-pointer"
              >
                <span>Re-build</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-300/10 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-500 dark:text-slate-300 hover:text-emerald-500 font-bold transition-all text-sm cursor-pointer flex items-center space-x-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handleSendToTracker}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold transition-all shadow-md text-sm cursor-pointer flex items-center space-x-1.5"
              >
                <Flame className="w-4 h-4" />
                <span>Track this Workout</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Core Exercise sheets */}
            <div className="lg:col-span-8 space-y-6 print-card">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Weekly Blueprint</span>
              
              {/* Horizontal Day Pills Selector */}
              <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4 snap-x">
                {weeklyRoutine.map((dayPlan, idx) => {
                  const isActive = idx === activeDayIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveDayIndex(idx)}
                      className={`flex flex-col items-center min-w-[85px] p-3 rounded-2xl transition-all border snap-center shrink-0 cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-105 z-10' 
                          : 'glass border-slate-200/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:scale-105'
                      }`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Day {idx + 1}
                      </span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'}`}>
                        {dayPlan.isRest ? '🧘' : dayPlan.dayType.includes('Push') ? '💪' : dayPlan.dayType.includes('Pull') ? '🏋️' : dayPlan.dayType.includes('Legs') ? '🦵' : '🔥'}
                      </div>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{dayPlan.dayType}</span>
                      <span className={`text-[9px] mt-1 font-bold ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {dayPlan.isRest ? 'Recovery' : `${dayPlan.exercises.length} Exercises`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Day Content */}
              {weeklyRoutine[activeDayIndex] && (
                <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-5 animate-fade-in relative">
                  <div className="pb-3 border-b border-slate-200/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className={`font-extrabold text-xl ${weeklyRoutine[activeDayIndex].isRest ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                      {weeklyRoutine[activeDayIndex].day}
                    </h3>
                    <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full font-extrabold uppercase tracking-wide">
                      {weeklyRoutine[activeDayIndex].burn}
                    </span>
                  </div>

                  {!weeklyRoutine[activeDayIndex].isRest ? (
                    <div className="space-y-4">
                      {weeklyRoutine[activeDayIndex].exercises.map((ex: any) => (
                        <div key={ex.key} className="p-4 bg-slate-100/40 dark:bg-white/5 rounded-2xl border border-slate-300/5 space-y-3 relative group transition-all hover:border-emerald-500/20">
                          {/* Complete Checkmark Button */}
                          <div className="absolute top-4 right-4 z-10">
                             <button className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/20 transition-colors text-transparent hover:text-emerald-500 cursor-pointer group-hover:border-slate-400">
                               <CheckCircle2 className="w-4 h-4 fill-current" />
                             </button>
                          </div>
                          
                          <div className="flex flex-row items-start gap-3 pr-8">
                            <img 
                              src={ex?.key ? getExerciseImage(ex.key) : '/images/exercises/arms.png'} 
                              alt="Exercise preview" 
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm border border-slate-200/50 dark:border-white/10 shrink-0 bg-slate-200/30 dark:bg-white/5 p-1"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            
                            <div className="flex-1">
                              <span className="font-black text-slate-800 dark:text-slate-200 text-sm sm:text-base block">
                                {ex?.key && alternatives[ex.key as keyof typeof alternatives] 
                                  ? alternatives[ex.key as keyof typeof alternatives][swaps[ex.key] || 0] 
                                  : "Unknown Exercise"}
                              </span>
                              <span className="text-[10px] sm:text-xs text-slate-400 block mt-0.5 font-semibold">Primary Target: {ex?.target || "Unknown"}</span>
                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md border border-slate-200/50 dark:border-white/5">{ex?.sets || "Unknown"}</span>
                                <button onClick={() => ex?.key && handleSwap(ex.key as keyof typeof alternatives)} className="text-[10px] px-2 py-1 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-md font-bold transition-all text-slate-500 cursor-pointer border border-slate-300/10">
                                  Swap 🔄
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Log block */}
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2.5 border-t border-slate-300/10 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400 font-bold">Log weight:</span>
                              <input
                                type="text"
                                placeholder="e.g. 80 kg"
                                value={ex?.key ? overloadLog[ex.key]?.weight || '' : ''}
                                onChange={(e) => ex?.key && handleLogChange(ex.key, 'weight', e.target.value)}
                                className="w-20 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-150"
                              />
                            </div>
                            <div className="flex items-center space-x-2 justify-end">
                              <span className="text-slate-400 font-bold">Reps Done:</span>
                              <input
                                type="text"
                                placeholder="e.g. 9"
                                value={ex?.key ? overloadLog[ex.key]?.reps || '' : ''}
                                onChange={(e) => ex?.key && handleLogChange(ex.key, 'reps', e.target.value)}
                                className="w-14 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-150"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-100/30 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                      <div className="text-4xl mb-3">🧘‍♂️</div>
                      <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">Active Recovery & Rest</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">Focus on mobility, stretching, and hydration today. Muscle grows when you rest!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Workout countdown timer & progressive explanation widgets */}
            <div className="lg:col-span-4 space-y-6 print-card">
              {/* Workout Rest Timer */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 text-center relative overflow-hidden flex flex-col items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Rest countdown timer</span>
                
                <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center mb-6 relative">
                  {/* Rotating visual border */}
                  <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin [animation-duration:12s]" style={{ animationPlayState: timerActive ? 'running' : 'paused' }} />
                  <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{timerSeconds}s</span>
                </div>

                {/* Control buttons */}
                <div className="flex space-x-2.5 w-full">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 text-xs"
                  >
                    {timerActive ? <Pause className="w-3.5 h-3.5 mr-0.5" /> : <Play className="w-3.5 h-3.5 mr-0.5 fill-current" />}
                    <span>{timerActive ? 'Pause' : 'Start'}</span>
                  </button>
                  <button
                    onClick={() => { setTimerSeconds(timerMax); setTimerActive(false); }}
                    className="p-2.5 bg-slate-200/50 dark:bg-white/5 border border-slate-300/10 rounded-xl text-slate-500 dark:text-slate-350 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick select presets */}
                <div className="flex space-x-1.5 w-full mt-4 justify-center">
                  <button onClick={() => handleTimerStart(45)} className="text-[10px] font-bold text-slate-500 bg-slate-200/40 dark:bg-white/5 border border-slate-300/10 px-2 py-1 rounded-lg">45s</button>
                  <button onClick={() => handleTimerStart(60)} className="text-[10px] font-bold text-slate-500 bg-slate-200/40 dark:bg-white/5 border border-slate-300/10 px-2 py-1 rounded-lg">60s</button>
                  <button onClick={() => handleTimerStart(90)} className="text-[10px] font-bold text-slate-500 bg-slate-200/40 dark:bg-white/5 border border-slate-300/10 px-2 py-1 rounded-lg">90s</button>
                </div>
              </div>

              {/* Progressive overload explanation */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-500">
                  <Activity className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-widest block">Progressive Overload Rules</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  To trigger muscular growth (hypertrophy), you must systematically increase structural load intensity over time. 
                </p>
                <ul className="space-y-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <li className="flex items-start">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5 shrink-0" />
                    <span>Always target the upper bound of your rep ranges (e.g. 10 reps) before increasing weight.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5 shrink-0" />
                    <span>Ensure strict mechanical form to prevent secondary joint structural shear.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-1.5 shrink-0" />
                    <span>Add log records weekly on your LeanVerse User Dashboard.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 print-hide">
            <button 
              onClick={() => { setGenerated(false); setStep(1); }}
              className="flex-1 py-4 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all border border-slate-300/10 cursor-pointer"
            >
              <span>Modify Parameters</span>
            </button>
            
            <div className="flex gap-4">
              <a 
                href={shareWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-slate-200/50 hover:bg-[#25D366]/10 text-slate-600 hover:text-[#25D366] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-[#25D366]/20 border border-slate-300/10 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={shareX}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-slate-200/50 hover:bg-[#1DA1F2]/10 text-slate-600 hover:text-[#1DA1F2] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-[#1DA1F2]/20 border border-slate-300/10 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.925H5.022z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
