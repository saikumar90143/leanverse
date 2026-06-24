'use client';

import React, { useState } from 'react';
import { Zap, Dumbbell, Sparkles } from 'lucide-react';
import { useQuickStart } from '@/hooks/useQuickStart';

export default function QuickStartWizard() {
  const { handleQuickStart } = useQuickStart();

  // Quick Start Wizard State
  const [qsMode, setQsMode] = useState('ai');
  const [qsGoal, setQsGoal] = useState('muscle');
  const [qsLocation, setQsLocation] = useState('gym');
  const [qsExperience, setQsExperience] = useState('beginner');
  const [qsEquipment, setQsEquipment] = useState<string[]>(['dumbbells', 'bodyweight']);
  const [qsDuration, setQsDuration] = useState(60);
  const [qsDaysPerWeek, setQsDaysPerWeek] = useState(4);
  const [qsTimelineDays, setQsTimelineDays] = useState(90);

  const toggleQsEquipment = (eq: string) => {
    setQsEquipment((prev) => prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]);
  };

  const submitWizard = () => {
    handleQuickStart(undefined, {
      qsMode, qsGoal, qsLocation, qsExperience, qsTimelineDays, qsDuration, qsDaysPerWeek, qsEquipment
    });
  };

  return (
    <div id="quick-start-wizard" className="lg:col-span-6 relative">
      <div className="relative z-10 glass bg-card/60 backdrop-blur-3xl border border-border/50 dark:border-border rounded-3xl p-6 shadow-2xl shadow-emerald-500/10">
        
        <div className="flex items-center justify-between mb-6 border-b border-border/50 dark:border-border pb-4">
          <h2 className="text-xl font-black flex items-center md:text-lg text-xs gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Create Your Workout Plan
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md">
            Takes 30s
          </span>
        </div>

        <div className="flex bg-secondary dark:bg-card/5 p-1 rounded-xl mb-6 border border-border/50 dark:border-border">
          <button onClick={() => setQsMode('ai')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${qsMode === 'ai' ? 'bg-card dark:bg-secondary text-emerald-500 shadow-sm' : 'text-muted hover:text-foreground dark:hover:text-slate-300'}`}>AI Generated</button>
          <button onClick={() => setQsMode('custom')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${qsMode === 'custom' ? 'bg-card dark:bg-secondary text-emerald-500 shadow-sm' : 'text-muted hover:text-foreground dark:hover:text-slate-300'}`}>Custom Plan</button>
        </div>

        <div className="space-y-5">
          {/* Goal (AI Only) */}
          {qsMode === 'ai' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">1. Primary Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button onClick={() => setQsGoal('fatloss')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsGoal === 'fatloss' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-background dark:bg-card/5 border-border/30 dark:border-border text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>Fat Loss</button>
                <button onClick={() => setQsGoal('muscle')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsGoal === 'muscle' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-background dark:bg-card/5 border-border/30 dark:border-border text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>Build Muscle</button>
              </div>
            </div>
          )}

          {/* Location (AI Only) */}
          {qsMode === 'ai' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">2. Workout Location</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setQsLocation('gym')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsLocation === 'gym' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'bg-background dark:bg-card/5 border-border/30 dark:border-border text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>Commercial Gym</button>
                <button onClick={() => setQsLocation('home')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsLocation === 'home' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'bg-background dark:bg-card/5 border-border/30 dark:border-border text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>Home Workout</button>
              </div>
              {qsLocation === 'home' && (
                <div className="pt-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2 block">Home Equipment</label>
                  <div className="flex flex-wrap gap-2">
                    {[{id: 'dumbbells', name: 'Dumbbells'}, {id: 'barbell', name: 'Barbell'}, {id: 'cables', name: 'Cables'}, {id: 'bodyweight', name: 'Bodyweight'}].map((eq) => (
                      <button
                        key={eq.id} onClick={() => toggleQsEquipment(eq.id)}
                        className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${qsEquipment.includes(eq.id) ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'border-border/50 bg-background dark:bg-card/5 text-muted hover:bg-secondary dark:hover:bg-card/10'}`}
                      >
                        <Dumbbell className="w-3 h-3 shrink-0" />
                        <span>{eq.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline (Both Modes) */}
          <div className="space-y-2">
            <label htmlFor="qsTimelineDays" className="text-xs font-bold text-muted uppercase tracking-wider">
              {qsMode === 'ai' ? '3. Timeline' : '1. Transformation Period'}
            </label>
            <select id="qsTimelineDays" value={qsTimelineDays} onChange={(e) => setQsTimelineDays(parseInt(e.target.value))} className="w-full bg-background dark:bg-card/5 border border-border/50 dark:border-border rounded-xl px-4 py-3 text-sm font-bold text-black dark:text-muted focus:outline-none focus:border-emerald-500">
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
              <option value={120}>120 Days</option>
            </select>
          </div>

          {/* AI Only Options */}
          {qsMode === 'ai' && (
            <>
              {/* Experience */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">4. Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map(exp => (
                    <button key={exp} onClick={() => setQsExperience(exp)} className={`py-2 px-2 rounded-xl font-bold text-xs border transition-all capitalize ${qsExperience === exp ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-background dark:bg-card/5 border-transparent text-muted hover:bg-secondary dark:hover:bg-card/10'}`}>
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div className="space-y-2">
                  <label htmlFor="qsDuration" className="text-[10px] font-bold text-muted uppercase tracking-wider">5. Duration</label>
                  <select id="qsDuration" value={qsDuration} onChange={(e) => setQsDuration(parseInt(e.target.value))} className="w-full bg-background dark:bg-card/5 border border-border/50 dark:border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground dark:text-muted focus:outline-none focus:border-emerald-500">
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>

                {/* Days per week */}
                <div className="space-y-2">
                  <label htmlFor="qsDaysPerWeek" className="text-[10px] font-bold text-muted uppercase tracking-wider">6. Days/Week</label>
                  <select id="qsDaysPerWeek" value={qsDaysPerWeek} onChange={(e) => setQsDaysPerWeek(parseInt(e.target.value))} className="w-full bg-background dark:bg-card/5 border border-border/50 dark:border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground dark:text-muted focus:outline-none focus:border-emerald-500">
                    <option value={3}>3 Days</option>
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={6}>6 Days</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button aria-label={qsMode === 'ai' ? 'Generate AI Transformation' : 'Build Custom Plan'} onClick={submitWizard} className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-lg rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2">
            {qsMode === 'ai' ? (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Transformation
              </>
            ) : (
              <>
                <Dumbbell className="w-5 h-5" />
                Build Custom Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
