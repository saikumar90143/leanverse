'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, Heart, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BMICalculator() {
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(170); // cm
  const [bmi, setBmi] = useState(24.2);
  const [category, setCategory] = useState('Normal');

  useEffect(() => {
    const heightInMeters = height / 100;
    const bmiVal = weight / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(bmiVal.toFixed(1));
    setBmi(roundedBmi);

    if (roundedBmi < 18.5) {
      setCategory('Underweight');
    } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
      setCategory('Normal');
    } else if (roundedBmi >= 25 && roundedBmi < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  }, [weight, height]);

  const getCategoryColor = () => {
    switch (category) {
      case 'Underweight': return 'text-cyan-400';
      case 'Normal': return 'text-emerald-400';
      case 'Overweight': return 'text-amber-400';
      case 'Obese': return 'text-rose-500';
      default: return 'text-emerald-400';
    }
  };

  const getCategoryRecommendation = () => {
    switch (category) {
      case 'Underweight':
        return 'We recommend a slight calorie surplus focused on complex carbohydrates and clean fats. Build core muscle strength with a 3-day full-body split in our Workout Planner.';
      case 'Normal':
        return 'Incredible job! Maintain your current habits, prioritize high protein intake (1.6g-2.0g per kg), and continue standard hypertrophy or cardiovascular routines.';
      case 'Overweight':
        return 'Achieving a mild calorie deficit (300-500 kcal TDEE reduction) paired with progressive home or gym workouts will support sustainable fat shredding.';
      case 'Obese':
        return 'Prioritize low-impact aerobic activities (e.g. brisk walking, swimming) combined with high-protein, calorie-restricted meal combinations. Use our Diet Planner for meal guidelines.';
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
        {/* Core interactive calculator */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 relative">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
                Body Mass Index (BMI)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calculate your height-to-weight ratio instantly.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Height input slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Height</span>
                <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">{height} cm</span>
              </div>
              <input
                type="range"
                min="120"
                max="220"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Weight input slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Weight</span>
                <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">{weight} kg</span>
              </div>
              <input
                type="range"
                min="35"
                max="150"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Visual Scale bar */}
          <div className="mt-8 space-y-4">
            <span className="text-xs font-bold text-slate-400 block ml-1">Visual BMI Metric</span>
            <div className="relative pt-6 pb-2">
              {/* Pointer */}
              <div 
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                style={{ left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%` }}
              >
                <span className={`text-xs font-black px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md mb-1`}>
                  {bmi}
                </span>
                <div className="w-2 h-2 rotate-45 bg-slate-900 dark:bg-white" />
              </div>

              {/* Bar segments */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-white/5 border border-slate-200/10">
                <div className="h-full bg-cyan-400" style={{ width: '15%' }} title="Underweight (< 18.5)" />
                <div className="h-full bg-emerald-400" style={{ width: '25%' }} title="Normal (18.5 - 24.9)" />
                <div className="h-full bg-amber-400" style={{ width: '20%' }} title="Overweight (25 - 29.9)" />
                <div className="h-full bg-rose-500" style={{ width: '40%' }} title="Obese (>= 30)" />
              </div>
              
              {/* Scale Labels */}
              <div className="flex justify-between text-[10px] text-slate-500 font-extrabold mt-2 px-1">
                <span>15.0</span>
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>40.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Output Recommendations card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10" />
            
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Your Calculation</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">{bmi}</span>
              <span className={`text-lg font-bold uppercase ${getCategoryColor()}`}>{category}</span>
            </div>

            <div className="border-t border-slate-200/15 dark:border-white/5 my-6 pt-6 space-y-4">
              <div className="flex items-start space-x-2.5">
                <Heart className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Health Suggestion</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {getCategoryRecommendation()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Next Level Tip</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    Ready to operationalize these stats? Jump into our <Link href="/diet-planner" className="text-emerald-500 dark:text-emerald-400 font-bold hover:underline">AI Diet Planner</Link> or build a customized split using the <Link href="/workout-planner" className="text-cyan-500 dark:text-cyan-400 font-bold hover:underline">AI Workout Planner</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links to other calculators */}
          <div className="glass rounded-2xl p-5 border border-slate-200/10 space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">More Calculators</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/calculators/maintenance" className="p-3 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 rounded-xl font-bold transition-all border border-slate-200/10 block text-center">TDEE Calories</Link>
              <Link href="/calculators/macro" className="p-3 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 rounded-xl font-bold transition-all border border-slate-200/10 block text-center">Macro Splits</Link>
              <Link href="/calculators/body-fat" className="p-3 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 rounded-xl font-bold transition-all border border-slate-200/10 block text-center">Body Fat %</Link>
              <Link href="/calculators/water" className="p-3 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 rounded-xl font-bold transition-all border border-slate-200/10 block text-center">Water Dial</Link>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Explanations Section */}
      <section className="mt-16 border-t border-slate-200/10 pt-10 space-y-6">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-cyan-500" />
          Understanding Body Mass Index (BMI)
        </h2>
        <div className="prose dark:prose-invert text-sm text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            Body Mass Index (BMI) is a standardized screening metric utilized by healthcare practitioners to classify weight status relative to skeletal height. Initially formulated by Adolphe Quetelet in the 19th century, BMI provides a statistical weight index that correlates with body fat percentages.
          </p>
          <p>
            <strong>Standard Health Categories:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>BMI under 18.5:</strong> Classified as Underweight. May suggest nutritional gaps or muscle deficiencies.</li>
            <li><strong>BMI between 18.5 and 24.9:</strong> Classified as Healthy Weight. Correlated with lower cardiac and metabolic risks.</li>
            <li><strong>BMI between 25.0 and 29.9:</strong> Classified as Overweight. Incorporating dynamic muscle strengthening and calorie deficit schedules is often recommended.</li>
            <li><strong>BMI of 30.0 or greater:</strong> Classified as Obese. Correlated with higher risks of chronic conditions like type 2 diabetes and hypertension.</li>
          </ul>
          <p>
            While BMI is an excellent baseline, it does not distinguish between muscle tissue and adipose tissue. For instance, athletes and bodybuilders with high lean muscle mass may register as "overweight" while maintaining very low body fat ratios. For a more comprehensive evaluation, combine your BMI results with our <strong>Body Fat Calculator</strong> and <strong>Macro split guidelines</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}
