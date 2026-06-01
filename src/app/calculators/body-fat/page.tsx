'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, Heart, Scale, Activity } from 'lucide-react';
import Link from 'next/link';

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState(170); // cm
  const [neck, setNeck] = useState(38); // cm
  const [waist, setWaist] = useState(82); // cm
  const [hip, setHip] = useState(90); // cm (used for females)

  const [bodyFat, setBodyFat] = useState(15.4);
  const [category, setCategory] = useState('Fit');

  useEffect(() => {
    // US Navy Body Fat Formulas (using inches)
    const hInch = height / 2.54;
    const nInch = neck / 2.54;
    const wInch = waist / 2.54;
    const hipInch = hip / 2.54;

    let bfVal = 15;

    if (gender === 'male') {
      const logDiff = Math.log10(wInch - nInch);
      const logH = Math.log10(hInch);
      if (wInch > nInch) {
        bfVal = 86.010 * logDiff - 70.041 * logH + 36.76;
      }
    } else {
      const logDiff = Math.log10(wInch + hipInch - nInch);
      const logH = Math.log10(hInch);
      if ((wInch + hipInch) > nInch) {
        bfVal = 163.205 * logDiff - 97.684 * logH - 78.387;
      }
    }

    const roundedBf = parseFloat(Math.max(2, Math.min(60, bfVal)).toFixed(1));
    setBodyFat(roundedBf);

    // Calculate Category
    if (gender === 'male') {
      if (roundedBf < 6) setCategory('Essential Fat');
      else if (roundedBf >= 6 && roundedBf < 14) setCategory('Athletic');
      else if (roundedBf >= 14 && roundedBf < 18) setCategory('Fit');
      else if (roundedBf >= 18 && roundedBf < 25) setCategory('Average');
      else setCategory('Excessive');
    } else {
      if (roundedBf < 14) setCategory('Essential Fat');
      else if (roundedBf >= 14 && roundedBf < 21) setCategory('Athletic');
      else if (roundedBf >= 21 && roundedBf < 25) setCategory('Fit');
      else if (roundedBf >= 25 && roundedBf < 32) setCategory('Average');
      else setCategory('Excessive');
    }
  }, [gender, height, neck, waist, hip]);

  const getCategoryColor = () => {
    switch (category) {
      case 'Essential Fat': return 'text-sky-400';
      case 'Athletic': return 'text-emerald-400';
      case 'Fit': return 'text-teal-400';
      case 'Average': return 'text-amber-400';
      case 'Excessive': return 'text-rose-500';
      default: return 'text-emerald-400';
    }
  };

  const getBfAdvice = () => {
    switch (category) {
      case 'Essential Fat':
        return 'Your body fat is at extremely low levels. While common in competitive bodybuilders, maintaining this long-term can impair hormone profiles, bone density, and energy levels.';
      case 'Athletic':
      case 'Fit':
        return 'Excellent visual conditioning. Your body fat is in the ideal range for peak metabolic efficiency, cardiovascular health, and physical athleticism.';
      case 'Average':
        return 'A solid healthy baseline. To improve vascularity or muscular definition, try executing a progressive hypertrophy routine paired with a minor calorie deficit (300 kcal).';
      case 'Excessive':
        return 'Reducing adipose fat tissue will substantially improve systemic insulin sensitivity, metabolic function, and cardiac health. Use our AI Diet and Workout tools to build a fat-loss split.';
      default:
        return '';
    }
  };

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
              <Scale className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
                Body Fat Calculator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calculate your precise fat percentage using the Navy Circumference Method.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Gender toggle */}
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

            {/* Height and Neck Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block ml-1">Height (cm)</label>
                <input
                  type="number" min="0"
                  value={height}
                  onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block ml-1">Neck Circumference (cm)</label>
                <input
                  type="number" min="0"
                  value={neck}
                  onChange={(e) => setNeck(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            {/* Waist and Hip Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block ml-1">Waist Circumference (cm)</label>
                <input
                  type="number" min="0"
                  value={waist}
                  onChange={(e) => setWaist(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {gender === 'female' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block ml-1">Hip Circumference (cm)</label>
                  <input
                    type="number" min="0"
                    value={hip}
                    onChange={(e) => setHip(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold animate-fade-in"
                  />
                </div>
              ) : (
                <div className="space-y-1 opacity-40">
                  <label className="text-xs font-bold text-slate-400 block ml-1">Hip Circumference (cm)</label>
                  <input
                    type="text"
                    disabled
                    value="Not required for males"
                    className="w-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none font-bold text-slate-400"
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Calculations Display Output */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10" />

            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Calculated body fat</span>
            
            {/* Massive Percentage Display */}
            <div className="text-center py-6">
              <span className="text-6xl font-black tracking-tight text-slate-800 dark:text-slate-100">{bodyFat}%</span>
              <span className={`text-lg font-bold uppercase block mt-2 ${getCategoryColor()}`}>{category}</span>
            </div>

            {/* Custom suggestion alert block */}
            <div className="w-full border-t border-slate-200/15 dark:border-white/5 pt-6 space-y-4">
              <div className="flex items-start space-x-2.5">
                <Heart className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Composition Advice</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {getBfAdvice()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO guidelines on Navy Body Fat Method */}
      <section className="mt-16 border-t border-slate-200/10 pt-10 space-y-6">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-cyan-400" />
          The US Navy Circumference Method
        </h2>
        <div className="prose dark:prose-invert text-sm text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            The **US Navy Circumference Method** is a standardized body composition estimation formula designed to determine an individual\'s relative percentage of skeletal fat to lean muscle tissue without the need for expensive DEXA scans or hydrostatic weighing.
          </p>
          <p>
            Developed by the Naval Health Research Center, this method correlates body fat percentage with structural tape-measure circumferences. For males, it factors in neck and waist measurements; for females, hip circumferences are integrated to account for gynoid fat distributions standard in female biometrics.
          </p>
          <p>
            <strong>Standard Body Fat Ratios:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Fat:</strong> Men: 2-5%, Women: 10-13%. Required for physiological survival, neurological function, and internal organ padding.</li>
            <li><strong>Athletes:</strong> Men: 6-13%, Women: 14-20%. Correlated with maximum cardiovascular conditioning, power production, and speed.</li>
            <li><strong>Fitness Range:</strong> Men: 14-17%, Women: 21-24%. Represents a balanced aesthetic, strong abdominal definition, and premium metabolic function.</li>
            <li><strong>Average Limits:</strong> Men: 18-24%, Women: 25-31%. Standard wellness bounds.</li>
            <li><strong>Excessive (Obese):</strong> Men: &gt;= 25%, Women: &gt;= 32%. Characterized by elevated lipid accumulation, increasing systemic insulin resistance.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
