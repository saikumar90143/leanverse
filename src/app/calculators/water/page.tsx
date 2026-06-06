'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, Heart, Droplet, Plus, RefreshCw, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70); // kg
  const [exercise, setExercise] = useState(30); // minutes
  const [climate, setClimate] = useState<'cold' | 'moderate' | 'hot'>('moderate');

  const [waterGoal, setWaterGoal] = useState(2.8); // Liters
  const [cupsGoal, setCupsGoal] = useState(11);
  const [cupsConsumed, setCupsConsumed] = useState(0);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Standard hydration formulas
    // Baseline: 35ml per kg of bodyweight
    let totalMl = weight * 35;
    
    // Add 350ml for every 30 minutes of exercise
    totalMl += (exercise / 30) * 350;

    // Climate additions
    if (climate === 'moderate') {
      totalMl += 350;
    } else if (climate === 'hot') {
      totalMl += 700;
    }

    const liters = parseFloat((totalMl / 1000).toFixed(1));
    setWaterGoal(liters);
    setCupsGoal(Math.ceil(totalMl / 250)); // 250ml per cup
  }, [weight, exercise, climate]);

  const handleAddCup = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setCupsConsumed((prev) => Math.min(prev + 1, cupsGoal));
  };

  const handleRemoveCup = () => {
    setCupsConsumed((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCupsConsumed(0);
  };

  const getPercentFill = () => {
    return Math.min((cupsConsumed / cupsGoal) * 100, 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Return link */}
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted hover:text-emerald-500 transition-colors mb-6 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to LeanVerse Home</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core inputs card */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <Droplet className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-foreground">
                Water Intake Calculator
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Calculate and log your daily fluid intake requirements.
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Weight inputs */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted">My Weight</span>
                <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">{weight} kg</span>
              </div>
              <input
                type="range"
                min="35"
                max="150"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary dark:bg-card/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Exercise inputs */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted">Daily Exercise Duration</span>
                <span className="text-sm font-black text-cyan-500 dark:text-cyan-400">{exercise} Minutes</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={exercise}
                onChange={(e) => setExercise(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary dark:bg-card/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Climate Select */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-muted block ml-1">Weather / Climate Type</span>
              <div className="grid grid-cols-3 gap-2 p-1 bg-secondary/50 dark:bg-card/5 border border-border/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setClimate('cold')}
                  className={`py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    climate === 'cold' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted'
                  }`}
                >
                  Cold
                </button>
                <button
                  type="button"
                  onClick={() => setClimate('moderate')}
                  className={`py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    climate === 'moderate' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted'
                  }`}
                >
                  Moderate
                </button>
                <button
                  type="button"
                  onClick={() => setClimate('hot')}
                  className={`py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    climate === 'hot' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted'
                  }`}
                >
                  Hot / Humid
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Dynamic beaker fill log outputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-2xl -z-10" />

            <span className="text-xs font-black text-muted uppercase tracking-widest block mb-1">Fluid Requirement</span>
            <div className="flex items-baseline space-x-1 mb-6">
              <span className="text-5xl font-black text-foreground">{waterGoal}</span>
              <span className="text-lg font-bold text-muted">Liters / {cupsGoal} Cups</span>
            </div>

            {/* Visual cup tracker - beaker styling */}
            <div className="relative w-28 h-40 border-4 border-border rounded-b-2xl rounded-t-lg overflow-hidden bg-secondary/20 dark:bg-card/5 shadow-inner mb-6">
              {/* Liquid */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400 transition-all duration-500 shadow-md"
                style={{ height: `${getPercentFill()}%` }}
              >
                {/* Simulated wave */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-cyan-300/40 animate-pulse" />
              </div>

              {/* Centered progress text */}
              <div className="absolute inset-0 flex items-center justify-center font-black text-sm z-10 text-foreground dark:text-muted mix-blend-difference">
                {cupsConsumed} / {cupsGoal} Cups
              </div>
            </div>

            {/* Click Log button widgets */}
            <div className="w-full flex space-x-2">
              <button
                onClick={handleRemoveCup}
                className="w-12 py-3 bg-secondary/50 dark:bg-card/5 hover:bg-slate-300/50 dark:hover:bg-card/10 text-muted font-bold rounded-2xl border border-border/10 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                title="Remove 1 Cup"
              >
                <span className="text-lg font-black">-</span>
              </button>
              <button
                onClick={handleAddCup}
                disabled={cupsConsumed >= cupsGoal}
                className={`flex-1 py-3 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 ${cupsConsumed >= cupsGoal ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 hover:shadow-cyan-500/10 active:scale-95 cursor-pointer'}`}
              >
                {cupsConsumed >= cupsGoal ? (
                  <>
                    <Trophy className="w-4 h-4" />
                    <span>Goal Completed!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Log 1 Cup (250ml)</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="p-3 bg-secondary/50 dark:bg-card/5 hover:bg-red-500/15 text-muted hover:text-red-500 rounded-2xl border border-border/10 transition-all active:scale-95 cursor-pointer"
                title="Reset log"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Completion Badge milestone */}
            {cupsConsumed >= cupsGoal && (
              <div className="mt-4 flex items-center space-x-1.5 text-xs text-amber-500 font-extrabold animate-bounce">
                <Trophy className="w-4 h-4 fill-current" />
                <span>Daily Hydration Goal Completed!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO information on Hydration */}
      <section className="mt-16 border-t border-border/10 pt-10 space-y-6">
        <h2 className="text-lg font-black text-foreground flex items-center">
          <Heart className="w-5 h-5 mr-2 text-rose-500" />
          The Critical Importance of Hydration
        </h2>
        <div className="prose dark:prose-invert text-sm text-muted space-y-4 leading-relaxed">
          <p>
            Water represents approximately 60% of absolute adult body mass. It forms the biological medium for cellular nutrient delivery, joint lubrication, thermal regulation via perspiration, and biochemical cellular waste disposal.
          </p>
          <p>
            <strong>Hydration & Performance:</strong> A dehydration state of as little as 2% of body mass can trigger significant decrements in cognitive focus, athletic power, and physical strength. This calculator dynamically scales fluid recommendations, accounting for sweat losses incurred during physical exercise and ambient temperature variations (humid weather triggers rich respiration fluid losses).
          </p>
          <p>
            <strong>Practical Fluid Milestones:</strong> Drink systematically throughout the day instead of chugging. Consume 250-500ml upon waking, and maintain a hydration log using our cup-tracker. Consistent intake prevents muscle cramps, sustains blood pressure, and improves renal clearance of metabolites.
          </p>
        </div>
      </section>
    </div>
  );
}
