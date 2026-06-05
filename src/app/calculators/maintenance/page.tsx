'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Heart, Info, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MaintenanceCaloriesCalculator() {
  const [age, setAge] = useState<number | ''>(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number | ''>(70); // kg
  const [height, setHeight] = useState<number | ''>(170); // cm
  const [activity, setActivity] = useState<string>('1.375'); // Lightly Active default

  const [bmr, setBmr] = useState(1630);
  const [tdee, setTdee] = useState(2240);

  useEffect(() => {
    const ageNum = Number(age) || 0;
    const weightNum = Number(weight) || 0;
    const heightNum = Number(height) || 0;

    // Mifflin-St Jeor Equation
    let bmrVal = 10 * weightNum + 6.25 * heightNum - 5 * ageNum;
    if (gender === 'male') {
      bmrVal += 5;
    } else {
      bmrVal -= 161;
    }
    
    const roundedBmr = Math.round(bmrVal);
    const multiplier = parseFloat(activity);
    const roundedTdee = Math.round(roundedBmr * multiplier);

    setBmr(roundedBmr);
    setTdee(roundedTdee);
  }, [age, gender, weight, height, activity]);

  const activityOptions = [
    { name: 'Sedentary (Little/no exercise)', value: '1.2' },
    { name: 'Lightly Active (1-3 days/week)', value: '1.375' },
    { name: 'Moderately Active (3-5 days/week)', value: '1.55' },
    { name: 'Very Active (6-7 days intense/week)', value: '1.725' },
    { name: 'Athlete / Extra Active (twice daily)', value: '1.9' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Return link */}
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-6 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to LeanVerse Home</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input parameters card */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
                Maintenance Calories & TDEE
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Determine your Total Daily Energy Expenditure instantly.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Gender Toggle */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block ml-1">Gender</span>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-200/50 dark:bg-white/5 border border-slate-200/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 text-sm font-black rounded-xl cursor-pointer transition-all ${
                    gender === 'male' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 text-sm font-black rounded-xl cursor-pointer transition-all ${
                    gender === 'female' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age & Height & Weight grids */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block ml-1">Age</label>
                <input
                  type="number" min="0"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block ml-1">Height (cm)</label>
                <input
                  type="number" min="0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block ml-1">Weight (kg)</label>
                <input
                  type="number" min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            {/* Activity Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 block ml-1">Activity Multiplier</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                {activityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-50 dark:bg-zinc-900">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Calculations display outputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-2xl -z-10" />

            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Maintenance Target (TDEE)</span>
            
            {/* Circular Gauge */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              {/* Outer SVG circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="76" stroke="rgba(16,185,129,0.06)" strokeWidth="12" fill="transparent" />
                <circle cx="88" cy="88" r="76" stroke="#06b6d4" strokeWidth="10" fill="transparent" 
                  strokeDasharray="478"
                  strokeDashoffset="119" // 75% display
                  className="transition-all duration-500"
                />
              </svg>
              {/* Absolute Center Content */}
              <div className="absolute flex flex-col items-center justify-center">
                <span key={tdee} className="text-3xl font-black text-slate-800 dark:text-slate-100 transform-gpu">{tdee}</span>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mt-1">Kcal / Day</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-200/15 dark:border-white/5 pt-6 text-left">
              <div className="p-3 bg-slate-100/40 dark:bg-white/5 border border-slate-200/5 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">BMR Baseline</span>
                <span key={bmr} className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1 block transform-gpu">{bmr} kcal</span>
              </div>
              <div className="p-3 bg-slate-100/40 dark:bg-white/5 border border-slate-200/5 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Active Burn</span>
                <span key={tdee - bmr} className="text-lg font-black text-emerald-500 dark:text-emerald-400 mt-1 block transform-gpu">{tdee - bmr} kcal</span>
              </div>
            </div>
          </div>

          {/* Goals split adjustments card */}
          <div className="glass rounded-2xl p-6 border border-slate-200/10 space-y-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Diet Strategy Baselines</span>
            <div className="space-y-2.5 text-sm font-semibold">
              <div className="flex justify-between items-center py-2 border-b border-slate-200/10">
                <span className="text-rose-500">Fat Loss (-500 kcal)</span>
                <span key={tdee - 500} className="font-extrabold text-slate-800 dark:text-slate-200 transform-gpu">{tdee - 500} kcal/day</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/10">
                <span className="text-emerald-500">Lean Bulk (+300 kcal)</span>
                <span key={tdee + 300} className="font-extrabold text-slate-800 dark:text-slate-200 transform-gpu">{tdee + 300} kcal/day</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-cyan-500">Maintenance (Balanced)</span>
                <span key={tdee} className="font-extrabold text-slate-800 dark:text-slate-200 transform-gpu">{tdee} kcal/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO text explaining TDEE */}
      <section className="mt-16 border-t border-slate-200/10 pt-10 space-y-6">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center">
          <Info className="w-5 h-5 mr-2 text-cyan-400" />
          What is BMR and TDEE?
        </h2>
        <div className="prose dark:prose-invert text-sm text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            Your **Basal Metabolic Rate (BMR)** represents the minimum caloric count your body requires to maintain homeostatic cellular operations (heart rate, respiration, tissue regeneration, cellular transport) while at rest in a temperate environment. This calculator uses the Mifflin-St Jeor formula, widely recognized in clinical nutrition as a highly accurate baseline.
          </p>
          <p>
            **Total Daily Energy Expenditure (TDEE)** accounts for BMR adjusted by your average physical activity multiplier, yielding the total number of calories you burn daily. This multiplier factors in the energy cost of general movement and formal exercise routines.
          </p>
          <p>
            <strong>Caloric Strategy:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>To Lose Weight:</strong> Maintain a caloric deficit (consuming less than your TDEE). A deficit of 500 kcal per day translates mathematically to approximately 0.5 kg of fat loss weekly.</li>
            <li><strong>To Gain Weight (Lean Bulk):</strong> Consume a slight caloric surplus (typically 250-500 kcal over TDEE) combined with hypertrophy-based resistance training to optimize skeletal muscle synthesis rather than fat accumulation.</li>
            <li><strong>To Maintain Weight:</strong> Consume calories matching your TDEE while balancing daily macro splits.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
