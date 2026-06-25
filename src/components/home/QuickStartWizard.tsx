'use client';

import React from 'react';
import { Calculator, Droplet, Activity, Scale, Percent, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function QuickStartWizard() {
  const calculators = [
    {
      name: 'Maintenance Calories',
      desc: 'Calculate your daily energy expenditure (TDEE)',
      path: '/calculators/maintenance',
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-500/10'
    },
    {
      name: 'Macro Split',
      desc: 'Find the perfect protein, carbs, and fats split',
      path: '/calculators/macro',
      icon: <Scale className="w-6 h-6 text-cyan-500" />,
      color: 'bg-cyan-500/10'
    },
    {
      name: 'Body Fat Percentage',
      desc: 'Estimate your body fat using body measurements',
      path: '/calculators/body-fat',
      icon: <Percent className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500/10'
    },
    {
      name: 'Water Intake',
      desc: 'Calculate your optimal daily hydration needs',
      path: '/calculators/water',
      icon: <Droplet className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500/10'
    },
    {
      name: 'BMI Calculator',
      desc: 'Check your Body Mass Index score',
      path: '/calculators/bmi',
      icon: <Calculator className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-500/10'
    }
  ];

  return (
    <div id="quick-start-wizard" className="lg:col-span-6 relative">
      <div className="relative z-10 glass bg-card/60 backdrop-blur-3xl border border-border/50 dark:border-border rounded-3xl p-6 shadow-2xl shadow-emerald-500/10 h-full flex flex-col">
        
        <div className="flex items-center justify-between mb-6 border-b border-border/50 dark:border-border pb-4">
          <h2 className="text-xl font-black flex items-center md:text-lg text-xs gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Calculators
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md">
            Tools
          </span>
        </div>

        <div className="flex-1 space-y-3">
          {calculators.map((calc) => (
            <Link 
              key={calc.name}
              href={calc.path}
              className="group flex items-center p-3 rounded-2xl bg-secondary/30 dark:bg-card/5 border border-border/50 dark:border-border hover:bg-secondary dark:hover:bg-card/20 transition-all cursor-pointer"
            >
              <div className={`p-3 rounded-xl ${calc.color} mr-4`}>
                {calc.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-sm mb-0.5">{calc.name}</h3>
                <p className="text-xs text-muted font-medium">{calc.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted group-hover:text-foreground transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
}
