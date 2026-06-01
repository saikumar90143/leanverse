'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, Heart, Apple, Activity, Flame } from 'lucide-react';
import Link from 'next/link';

export default function MacroCalculator() {
  const [calories, setCalories] = useState(2000);
  const [dietStyle, setDietStyle] = useState<'balanced' | 'lowcarb' | 'highprotein'>('balanced');
  
  const [protein, setProtein] = useState({ grams: 150, cals: 600, pct: 30 });
  const [carbs, setCarbs] = useState({ grams: 200, cals: 800, pct: 40 });
  const [fats, setFats] = useState({ grams: 67, cals: 600, pct: 30 });

  useEffect(() => {
    let pPct = 30;
    let cPct = 40;
    let fPct = 30;

    if (dietStyle === 'lowcarb') {
      pPct = 35;
      cPct = 15;
      fPct = 50;
    } else if (dietStyle === 'highprotein') {
      pPct = 40;
      cPct = 35;
      fPct = 25;
    }

    const pCals = Math.round(calories * (pPct / 100));
    const cCals = Math.round(calories * (cPct / 100));
    const fCals = Math.round(calories * (fPct / 100));

    // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fats: 9 kcal/g
    setProtein({ grams: Math.round(pCals / 4), cals: pCals, pct: pPct });
    setCarbs({ grams: Math.round(cCals / 4), cals: cCals, pct: cPct });
    setFats({ grams: Math.round(fCals / 9), cals: fCals, pct: fPct });
  }, [calories, dietStyle]);

  // Dash calculations for the SVG circular donut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  const pOffset = circumference - (protein.pct / 100) * circumference;
  const cOffset = circumference - (carbs.pct / 100) * circumference;
  const fOffset = circumference - (fats.pct / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Return link */}
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-6 no-print">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to LeanVerse Home</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core inputs card */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <Apple className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
                Macro split Calculator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calculate daily targets for Protein, Carbs, and Fats.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Calories count slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Daily Calorie Target</span>
                <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">{calories} Kcal</span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="50"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Diet preferences toggles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 block ml-1">Macro Strategy Preset</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200/40 dark:bg-white/5 border border-slate-200/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setDietStyle('balanced')}
                  className={`py-3 px-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    dietStyle === 'balanced'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-255'
                  }`}
                >
                  Balanced (30/40/30)
                </button>
                <button
                  type="button"
                  onClick={() => setDietStyle('lowcarb')}
                  className={`py-3 px-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    dietStyle === 'lowcarb'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-255'
                  }`}
                >
                  Keto / Low Carb
                </button>
                <button
                  type="button"
                  onClick={() => setDietStyle('highprotein')}
                  className={`py-3 px-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    dietStyle === 'highprotein'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-255'
                  }`}
                >
                  High Protein (40/35/25)
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Dynamic visual dashboard outputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
            
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Grams Breakdown</span>

            {/* Circular Donut Diagram */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                {/* Back drop circle */}
                <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.02)" strokeWidth="12" fill="transparent" />
                {/* Fats arc */}
                <circle cx="80" cy="80" r={radius} stroke="#f59e0b" strokeWidth="10" fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={fOffset}
                  className="transition-all duration-500"
                />
                {/* Carbs arc - offset by fats percent */}
                <circle cx="80" cy="80" r={radius} stroke="#06b6d4" strokeWidth="10" fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={cOffset}
                  style={{ transform: `rotate(${(fats.pct / 100) * 360}deg)`, transformOrigin: '80px 80px' }}
                  className="transition-all duration-500"
                />
                {/* Protein arc - offset by carbs + fats */}
                <circle cx="80" cy="80" r={radius} stroke="#10b981" strokeWidth="10" fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={pOffset}
                  style={{ transform: `rotate(${((fats.pct + carbs.pct) / 100) * 360}deg)`, transformOrigin: '80px 80px' }}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-black text-slate-400 uppercase">Protein Target</span>
                <span className="text-2xl font-black text-emerald-500">{protein.grams}g</span>
              </div>
            </div>

            {/* Segment legends with specific numbers */}
            <div className="w-full space-y-3.5 border-t border-slate-200/15 dark:border-white/5 pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Protein ({protein.pct}%)</span>
                </div>
                <div className="text-right font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  {protein.grams}g <span className="text-[10px] text-slate-400 font-bold ml-1">({protein.cals} kcal)</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-cyan-500" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Carbohydrates ({carbs.pct}%)</span>
                </div>
                <div className="text-right font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  {carbs.grams}g <span className="text-[10px] text-slate-400 font-bold ml-1">({carbs.cals} kcal)</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Fats ({fats.pct}%)</span>
                </div>
                <div className="text-right font-extrabold text-sm text-slate-800 dark:text-slate-200">
                  {fats.grams}g <span className="text-[10px] text-slate-400 font-bold ml-1">({fats.cals} kcal)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO guidelines on macros */}
      <section className="mt-16 border-t border-slate-200/10 pt-10 space-y-6">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-rose-500" />
          The Science of Macronutrient Ratios
        </h2>
        <div className="prose dark:prose-invert text-sm text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            While hitting your daily calorie target determines weight changes, the **macronutrient ratio (macro split)** dictates the composition of that weight shift (e.g. losing adipose fat tissue vs. conserving or synthesizing skeletal muscle tissue).
          </p>
          <p>
            <strong>Understanding Each Macro:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Protein (4 kcal/g):</strong> Essential for skeletal repair, immune cells, and muscle protein synthesis. High-protein diets prevent lean tissue depletion in a deficit and improve satiety.</li>
            <li><strong>Carbohydrates (4 kcal/g):</strong> The preferred metabolic substrate for high-intensity muscular work and cognitive processes. Muscle glycogen reserves are crucial for peak athletic strength.</li>
            <li><strong>Fats (9 kcal/g):</strong> Essential for lipid hormone production, cognitive health, fat-soluble vitamin absorption, and structural cellular membrane integrity.</li>
          </ul>
          <p>
            <strong>Which split should you choose?</strong> For hypertrophy or fat loss splits, maintaining high-protein bounds (35-40%) is often advised to prevent catabolic tissue breakdown. For cardiovascular athletes, a balanced (30/40/30) ratio supports rich glycogen storage. For those looking to control insulin curves, a ketogenic low-carb setup helps trigger fat-to-ketone conversion.
          </p>
        </div>
      </section>
    </div>
  );
}
