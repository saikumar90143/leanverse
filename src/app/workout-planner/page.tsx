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
  const [equipment, setEquipment] = useState<string[]>(['dumbbells']);

  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

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
    BenchPress: 0,
    OHP: 0,
    LateralRaises: 0,
    TricepExtension: 0,
  });

  const alternatives = {
    BenchPress: ['1. Barbell Flat Bench Press', '1. Dumbbell Flat Bench Press', '1. Machine Chest Press'],
    OHP: ['2. Standing Barbell Overhead Press (OHP)', '2. Seated Dumbbell Shoulder Press', '2. Machine Shoulder Press'],
    LateralRaises: ['3. Standing Dumbbell Lateral Raises', '3. Cable Lateral Raises', '3. Machine Lateral Raises'],
    TricepExtension: ['4. Cable Tricep Overhead Extension', '4. EZ Bar Skullcrushers', '4. Tricep Rope Pushdowns']
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

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(async () => {
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

    const workoutToSave = {
      name: 'Push Day (Chest & Tris)',
      date: new Date().toISOString().split('T')[0],
      exercises: [
        {
          id: crypto.randomUUID(),
          name: 'Barbell Flat Bench Press',
          sets: Array.from({ length: 4 }).map(() => ({ id: crypto.randomUUID(), weight: '', reps: 10, completed: false }))
        },
        {
          id: crypto.randomUUID(),
          name: 'Standing Barbell Overhead Press (OHP)',
          sets: Array.from({ length: 3 }).map(() => ({ id: crypto.randomUUID(), weight: '', reps: 10, completed: false }))
        },
        {
          id: crypto.randomUUID(),
          name: 'Standing Dumbbell Lateral Raises',
          sets: Array.from({ length: 4 }).map(() => ({ id: crypto.randomUUID(), weight: '', reps: 15, completed: false }))
        },
        {
          id: crypto.randomUUID(),
          name: 'Cable Tricep Overhead Extension',
          sets: Array.from({ length: 3 }).map(() => ({ id: crypto.randomUUID(), weight: '', reps: 12, completed: false }))
        }
      ]
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Day Split Exercises & logs</span>
              
              {/* Day 1 Card */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-5">
                <div className="pb-3 border-b border-slate-200/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">Monday - Push Day (Chest & Tris)</h3>
                  <span className="text-xs text-emerald-500 font-extrabold uppercase">~ 480 kcal Burned</span>
                </div>

                <div className="space-y-4">
                  {/* Bench Press */}
                  <div className="p-4 bg-slate-100/40 dark:bg-white/5 rounded-2xl border border-slate-300/5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm block">{alternatives['BenchPress'][swaps['BenchPress']]}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Primary Target: Pectoralis Major</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleSwap('BenchPress')} className="text-[10px] px-2 py-1 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-md font-bold transition-all text-slate-500 cursor-pointer">
                          Swap 🔄
                        </button>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">4 Sets x 8-10 Reps</span>
                      </div>
                    </div>
                    {/* Log block */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2.5 border-t border-slate-300/10 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 font-bold">Log weight:</span>
                        <input
                          type="text"
                          placeholder="e.g. 80 kg"
                          value={overloadLog['BenchPress']?.weight || ''}
                          onChange={(e) => handleLogChange('BenchPress', 'weight', e.target.value)}
                          className="w-20 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-150"
                        />
                      </div>
                      <div className="flex items-center space-x-2 justify-end">
                        <span className="text-slate-400 font-bold">Reps Done:</span>
                        <input
                          type="text"
                          placeholder="e.g. 9"
                          value={overloadLog['BenchPress']?.reps || ''}
                          onChange={(e) => handleLogChange('BenchPress', 'reps', e.target.value)}
                          className="w-14 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-150"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Overhead Press */}
                  <div className="p-4 bg-slate-100/40 dark:bg-white/5 rounded-2xl border border-slate-300/5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm block">{alternatives['OHP'][swaps['OHP']]}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Primary Target: Anterior Deltoids</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleSwap('OHP')} className="text-[10px] px-2 py-1 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-md font-bold transition-all text-slate-500 cursor-pointer">
                          Swap 🔄
                        </button>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">3 Sets x 8-10 Reps</span>
                      </div>
                    </div>
                    {/* Log block */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2.5 border-t border-slate-300/10 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 font-bold">Log weight:</span>
                        <input
                          type="text"
                          placeholder="e.g. 45 kg"
                          value={overloadLog['OHP']?.weight || ''}
                          onChange={(e) => handleLogChange('OHP', 'weight', e.target.value)}
                          className="w-20 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-150"
                        />
                      </div>
                      <div className="flex items-center space-x-2 justify-end">
                        <span className="text-slate-400 font-bold">Reps Done:</span>
                        <input
                          type="text"
                          placeholder="e.g. 8"
                          value={overloadLog['OHP']?.reps || ''}
                          onChange={(e) => handleLogChange('OHP', 'reps', e.target.value)}
                          className="w-14 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-lg px-2 py-1 text-center font-bold text-slate-800 dark:text-slate-150"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dumbbell Lateral Raises */}
                  <div className="p-4 bg-slate-100/40 dark:bg-white/5 rounded-2xl border border-slate-300/5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm block">{alternatives['LateralRaises'][swaps['LateralRaises']]}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Primary Target: Lateral Deltoids</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleSwap('LateralRaises')} className="text-[10px] px-2 py-1 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-md font-bold transition-all text-slate-500 cursor-pointer">
                          Swap 🔄
                        </button>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">4 Sets x 12-15 Reps</span>
                      </div>
                    </div>
                  </div>

                  {/* Cable Tricep Pushdowns */}
                  <div className="p-4 bg-slate-100/40 dark:bg-white/5 rounded-2xl border border-slate-300/5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <span className="font-black text-slate-800 dark:text-slate-200 text-sm block">{alternatives['TricepExtension'][swaps['TricepExtension']]}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Primary Target: Triceps Long Head</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleSwap('TricepExtension')} className="text-[10px] px-2 py-1 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-md font-bold transition-all text-slate-500 cursor-pointer">
                          Swap 🔄
                        </button>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">3 Sets x 10-12 Reps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
