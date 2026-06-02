'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, Dumbbell, ArrowRight, Calculator, Star, ChevronDown, 
  Flame, TrendingUp, Calendar, Target, Activity, Clock, Shield,
  CheckCircle2, Zap, Trophy, Play, X
} from 'lucide-react';
import AdContainer from '@/components/ads/AdContainer';
import { getStreak, getLifetimeVolume, getLevelProgress } from '@/lib/gamification';
import { useAuth } from '@/components/layout/AuthProvider';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Quick Start Wizard State
  const [qsGoal, setQsGoal] = useState('muscle');
  const [qsLocation, setQsLocation] = useState('gym');
  const [qsExperience, setQsExperience] = useState('beginner');

  const handleQuickStart = (overrides?: { goal?: string, location?: string, experience?: string, timelineDays?: number }) => {
    // Store pending configuration in localStorage to be picked up by the planner after login
    try {
      localStorage.setItem('leanverse_pending_wizard', JSON.stringify({
        goal: overrides?.goal || qsGoal,
        location: overrides?.location || qsLocation,
        experience: overrides?.experience || qsExperience,
        timelineDays: overrides?.timelineDays || 90
      }));
    } catch {}
    // The workout planner route is protected, so this will ultimately force a login
    // then redirect back to the planner!
    router.push('/workout-planner');
  };

  // Gamification Mock Data for Hero Visual
  const [mounted, setMounted] = useState(false);
  const [dynamicStats, setDynamicStats] = useState({ streak: 0, progress: 0 });
  
  useEffect(() => {
    setMounted(true);
    try {
      const vol = getLifetimeVolume();
      setDynamicStats({
        streak: user?.streak ?? getStreak(),
        progress: Math.round(getLevelProgress(vol) * 100)
      });
    } catch {}
  }, [user]);

  return (
    <div className="space-y-0 pb-20">
      
      {/* 1. HERO & QUICK START WIZARD */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800/50 dark:bg-white/5 border border-slate-700/50 dark:border-white/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300 dark:text-slate-300 tracking-wider uppercase">AI-Powered Fitness Engine</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Transform Your Body With <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">AI Plans</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
              Get personalized workout plans, diet plans, calorie tracking, and transformation programs designed specifically for your goals, experience level, available equipment, and timeline.
            </p>

            {/* Quick Trust Stats */}
            <div className="grid grid-cols-2 gap-4 py-4 max-w-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">1000+ Exercises</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">AI Personalized</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Home & Gym Workouts</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Custom Diet Plans</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => handleQuickStart()}
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
              >
                <span>Generate Free Plan</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link 
                href="/calculators/maintenance"
                className="px-8 py-4 rounded-2xl glass hover:bg-slate-800/10 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-lg transition-all border border-slate-200 dark:border-white/10 text-center flex items-center justify-center"
              >
                Calculate Calories
              </Link>
            </div>
          </motion.div>

          {/* Right: Quick Start Wizard & Dashboard Mock */}
          <motion.div 
            id="quick-start-wizard"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            {/* The Floating UI Dashboard Mock */}
            <div className="relative z-10 glass bg-white/60 dark:bg-zinc-900/80 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 shadow-2xl shadow-emerald-500/10">
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-200/50 dark:border-white/10 pb-4">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  Quick Start Wizard
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md">
                  Takes 30s
                </span>
              </div>

              <div className="space-y-5">
                {/* Goal */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Primary Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setQsGoal('fat_loss')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsGoal === 'fat_loss' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>Lose Fat</button>
                    <button onClick={() => setQsGoal('muscle')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsGoal === 'muscle' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>Build Muscle</button>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Workout Location</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setQsLocation('gym')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsLocation === 'gym' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>Commercial Gym</button>
                    <button onClick={() => setQsLocation('home')} className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all ${qsLocation === 'home' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>Home Workout</button>
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Experience Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'advanced'].map(exp => (
                      <button key={exp} onClick={() => setQsExperience(exp)} className={`py-2 px-2 rounded-xl font-bold text-xs border transition-all capitalize ${qsExperience === exp ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => handleQuickStart()} className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-lg rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate AI Transformation
                </button>
              </div>
            </div>

            {/* Dynamic Floating Mock Stats */}
            {mounted && (
              <>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 -right-6 z-20 glass bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dynamicStats.streak} Day Streak</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">{dynamicStats.streak > 0 ? 'Unstoppable!' : 'Start Today!'}</p>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-8 -left-6 z-20 glass bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Target className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level Progress</p>
                    <p className="text-sm font-black text-emerald-500 leading-none">{dynamicStats.progress}% Completed</p>
                  </div>
                </motion.div>
              </>
            )}

          </motion.div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50 dark:border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Your Journey To A Better Physique</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-cyan-500/0 -z-10 -translate-y-1/2" />

          <div className="glass p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
              <span className="text-2xl font-black">1</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Tell Us About Yourself</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Share your specific goal, experience level, workout location, and timeline. The more we know, the better the plan.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 text-center space-y-4 hover:-translate-y-2 transition-transform shadow-xl shadow-emerald-500/5">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Creates Your Plan</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Our advanced engine instantly generates personalized workouts, comprehensive diet plans, and daily calorie targets.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 text-center space-y-4 hover:-translate-y-2 transition-transform">
            <div className="w-16 h-16 mx-auto bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6">
              <span className="text-2xl font-black">3</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Track Progress Daily</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Complete your daily missions, log weights for progressive overload, earn streaks, and watch your body transform.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GOAL SELECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">What's Your Primary Goal?</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Select your objective to see what LeanVerse can do for you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'fat', title: 'Lose Fat', desc: 'Burn stubborn fat, lower body fat percentage, and reveal muscle definition with calorie-deficit diets.', icon: <Flame className="w-6 h-6 text-orange-500" /> },
            { id: 'muscle', title: 'Build Muscle', desc: 'Pack on solid mass with hypertrophy-focused progressive overload and high-protein nutrition plans.', icon: <Dumbbell className="w-6 h-6 text-emerald-500" /> },
            { id: 'bulk', title: 'Lean Bulk', desc: 'Gain size without excessive fat gain by utilizing precise surplus calculations and heavy lifting.', icon: <TrendingUp className="w-6 h-6 text-cyan-500" /> },
            { id: 'strength', title: 'Get Stronger', desc: 'Focus on low-rep, heavy compound movements to maximize central nervous system adaptation.', icon: <Shield className="w-6 h-6 text-purple-500" /> }
          ].map(g => (
            <div key={g.id} className="group glass p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 hover:border-emerald-500/30 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {g.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{g.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRANSFORMATION PROGRAMS SECTION */}
      <section className="bg-slate-50 dark:bg-zinc-900/50 py-24 border-y border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Structured Challenges</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Complete Transformation Programs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { days: 30, title: 'Kickstarter', diff: 'Beginner', success: '94%' },
              { days: 60, title: 'Momentum', diff: 'Intermediate', success: '88%' },
              { days: 90, title: 'Transformation', diff: 'Advanced', success: '91%', highlight: true },
              { days: 120, title: 'Evolution', diff: 'Elite', success: '85%' }
            ].map(prog => (
              <div key={prog.days} className={`glass p-6 rounded-3xl border transition-all hover:-translate-y-2 flex flex-col ${prog.highlight ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10' : 'border-slate-200/50 dark:border-white/5'}`}>
                {prog.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">{prog.days} <span className="text-lg text-slate-500">Days</span></h3>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">{prog.title}</p>
                </div>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Difficulty</span>
                    <span className="font-bold text-slate-900 dark:text-white">{prog.diff}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Success Rate</span>
                    <span className="font-bold text-emerald-500">{prog.success}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Structure</span>
                    <span className="font-bold text-slate-900 dark:text-white">Phased</span>
                  </div>
                </div>

                <button onClick={() => handleQuickStart({ 
                  timelineDays: prog.days, 
                  goal: 'muscle', 
                  experience: prog.diff === 'Beginner' ? 'beginner' : prog.diff === 'Elite' ? 'advanced' : 'intermediate' 
                })} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${prog.highlight ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg' : 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white'}`}>
                  Start Program
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI DIET & WORKOUT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        
        {/* Diet Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">Diet Plans Built Around <br/><span className="text-emerald-500">Foods You Already Eat</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              No more forcing down boiled chicken and broccoli if you hate it. Our AI builds comprehensive meal plans utilizing ingredients you actually enjoy, perfectly balancing calories and macros.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Eggs', 'Chicken', 'Paneer', 'Rice', 'Oats', 'Roti', 'Idli', 'Whey'].map(food => (
                <span key={food} className="px-3 py-1.5 glass rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/10">{food}</span>
              ))}
            </div>
            <div className="pt-4">
              <Link href="/diet-planner" className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-sm transition-all flex items-center justify-center space-x-2 inline-flex">
                <span>Generate Diet Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 glass p-6 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden bg-white/50 dark:bg-slate-900/50">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-slate-900 dark:text-white">Today's Macros</h3>
               <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">2400 kcal</span>
             </div>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Protein</span><span className="text-slate-900 dark:text-white">160g</span></div>
                 <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[80%]" /></div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Carbs</span><span className="text-slate-900 dark:text-white">250g</span></div>
                 <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-[60%]" /></div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold mb-1"><span className="text-slate-500">Fats</span><span className="text-slate-900 dark:text-white">70g</span></div>
                 <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-orange-500 w-[90%]" /></div>
               </div>
             </div>
          </div>
        </div>

        {/* Workout Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="glass p-6 rounded-3xl border border-cyan-500/20 shadow-2xl bg-white/50 dark:bg-slate-900/50">
             <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
               <div>
                 <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest block">Phase 2: Hypertrophy</span>
                 <h3 className="font-black text-slate-900 dark:text-white text-lg">Push Day (Chest, Shoulders, Triceps)</h3>
               </div>
               <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                 <Dumbbell className="w-5 h-5 text-slate-500" />
               </div>
             </div>
             <div className="space-y-3">
               {[
                 { name: 'Barbell Bench Press', sets: '4', reps: '8-10' },
                 { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12' },
                 { name: 'Overhead Press', sets: '3', reps: '8-10' },
                 { name: 'Tricep Pushdown', sets: '3', reps: '12-15' }
               ].map((ex, i) => (
                 <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-transparent">
                   <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{ex.name}</span>
                   <span className="text-xs font-black text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md">{ex.sets} x {ex.reps}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">Never Wonder <br/><span className="text-cyan-500">What To Train Again</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Step into the gym with absolute confidence. The AI engine programs your exercises, sets, reps, and rest times based on your experience level and ensures you are hitting every muscle group perfectly.
            </p>
            <ul className="space-y-3 pt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500" /> Progressive Overload Tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500" /> Automatic Exercise Rotation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500" /> Warmup & Cooldown Protocols</li>
            </ul>
            <div className="pt-4">
              <button onClick={() => handleQuickStart()} className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center space-x-2">
                <span>Build Workout Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </section>
      {/* 6. CALCULATORS HUB */}
      <section className="bg-slate-900 dark:bg-zinc-900/80 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black text-cyan-500 uppercase tracking-widest block">Free Resources</span>
            <h2 className="text-3xl md:text-5xl font-black">Fitness Calculators Hub</h2>
            <p className="text-slate-400 font-medium leading-relaxed">Calculate your body metrics instantly. No signup required.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'BMI Calculator', icon: <Activity className="w-5 h-5" />, path: '/calculators/bmi' },
              { name: 'TDEE Calories', icon: <Flame className="w-5 h-5" />, path: '/calculators/maintenance' },
              { name: 'Macro Splitter', icon: <Calculator className="w-5 h-5" />, path: '/calculators/macro' },
              { name: 'Body Fat', icon: <Target className="w-5 h-5" />, path: '/calculators/body-fat' },
              { name: 'Water Intake', icon: <Clock className="w-5 h-5" />, path: '/calculators/water' },
            ].map(calc => (
              <Link key={calc.name} href={calc.path} className="group glass bg-white/5 border border-white/10 p-6 rounded-2xl text-center hover:bg-white/10 hover:border-cyan-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {calc.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-100">{calc.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MOTIVATION & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">Stay Consistent. <br/><span className="text-orange-500">Transform Faster.</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Fitness is a marathon, not a sprint. We use game design psychology to keep you hooked on building healthy habits.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center"><Flame className="w-5 h-5" /></div>
                <h4 className="font-black text-slate-900 dark:text-white">Daily Streaks</h4>
                <p className="text-xs text-slate-500 font-medium">Don't break the chain. Complete workouts to keep your fire alive.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center"><Trophy className="w-5 h-5" /></div>
                <h4 className="font-black text-slate-900 dark:text-white">Earn Badges</h4>
                <p className="text-xs text-slate-500 font-medium">Unlock exclusive achievements for hitting personal records.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <h4 className="font-black text-slate-900 dark:text-white">Level Up XP</h4>
                <p className="text-xs text-slate-500 font-medium">Gain experience points and rank up from Beginner to Elite.</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5" /></div>
                <h4 className="font-black text-slate-900 dark:text-white">Heatmaps</h4>
                <p className="text-xs text-slate-500 font-medium">Visualize your effort over the last 30 days with activity charts.</p>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 space-y-6">
            <h3 className="font-black text-center text-slate-900 dark:text-white">Real Results from Real People</h3>
            {[
              { text: "Lost 12kg in 90 days. The progressive overload tracking was exactly what I needed.", name: "David M." },
              { text: "Built 5kg of lean muscle on a vegetarian diet. The diet planner is incredible.", name: "Arjun K." },
              { text: "Finally hit a 225lb bench press. The AI phased my workouts perfectly to break my plateau.", name: "Sarah J." }
            ].map((review, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex text-amber-400 mb-2">{[...Array(5)].map((_,j) => <Star key={j} className="w-4 h-4 fill-current" />)}</div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic mb-3">"{review.text}"</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST ARTICLES (BLOG) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50 dark:border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Latest from the Blog</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium mt-2">Actionable fitness advice and science-backed nutrition protocols.</p>
          </div>
          <Link href="/blog" className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold transition-colors inline-flex items-center space-x-2">
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { cat: 'Nutrition', read: '5 min read', title: 'The Truth About Protein Synthesis: How Much Can You Actually Absorb?', desc: 'Discover the exact mechanisms of muscle protein synthesis and why the "30g per meal" limit is a complete myth.', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
            { cat: 'Workout Plans', read: '8 min read', title: 'Push/Pull/Legs vs Upper/Lower: Which Split Builds More Muscle?', desc: 'A deep dive into training volume, frequency, and central nervous system recovery to determine the optimal split for natural lifters.', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
            { cat: 'Weight Loss', read: '6 min read', title: 'How to Break Through a Weight Loss Plateau (Without Starving)', desc: 'Learn how to utilize diet breaks, refeed days, and neat adjustments to reignite your metabolism when fat loss stalls.', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80' }
          ].map((blog, i) => (
            <Link key={i} href="/blog" className="group flex flex-col rounded-3xl overflow-hidden glass border border-slate-200/50 dark:border-white/5 hover:border-emerald-500/30 transition-all hover:shadow-xl hover:-translate-y-2">
              <div className="h-56 w-full relative overflow-hidden bg-slate-800">
                <Image src={blog.img} alt={blog.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">{blog.cat}</span>
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.read}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-500 transition-colors">{blog.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-1">{blog.desc}</p>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-emerald-500">Read Article <ArrowRight className="w-4 h-4 ml-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. PREMIUM COMPARISON */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50 dark:border-white/5">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Choose Your Path</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 text-center flex flex-col">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Free Plan</h3>
            <p className="text-slate-500 font-medium mb-8">Everything you need to get started.</p>
            <ul className="space-y-4 mb-8 flex-1 text-left">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Basic AI Workout Planner</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Free Fitness Calculators</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Single Diet Generation</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-400 dark:text-slate-600"><X className="w-5 h-5" /> Detailed Analytics</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-400 dark:text-slate-600"><X className="w-5 h-5" /> Priority AI Coach</li>
            </ul>
            <button onClick={() => handleQuickStart()} className="w-full py-4 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">Start Free</button>
          </div>

          <div className="glass p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 text-center flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-bl-full blur-[30px]" />
            <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full absolute top-4 left-1/2 -translate-x-1/2">Recommended</span>
            
            <h3 className="text-2xl font-black text-emerald-500 mt-4 mb-2">Pro Access</h3>
            <p className="text-slate-500 font-medium mb-8">Unlock maximum results.</p>
            <ul className="space-y-4 mb-8 flex-1 text-left">
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Advanced Phased AI Plans</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Unlimited Regenerations</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Interactive Progress Graphs</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Detailed Exercise Analytics</li>
              <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Priority 24/7 AI Coach Access</li>
            </ul>
            <Link href="/pricing" className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 inline-block">Upgrade to Pro</Link>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA & FOOTER SEO */}
      <section className="bg-slate-900 py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Your Transformation <br/>Starts Today</h2>
          <p className="text-lg text-slate-400 font-medium">Join thousands of users following personalized fitness plans built specifically for their unique goals, diets, and environments.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button onClick={() => handleQuickStart()} className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg transition-all shadow-xl shadow-emerald-500/25">Generate Free Plan</button>
            <Link href="/calculators/maintenance" className="px-8 py-4 rounded-2xl glass bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10 flex items-center justify-center">Calculate Calories</Link>
          </div>
        </div>
      </section>

      {/* Footer SEO Links */}
      <footer className="bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h5 className="text-white font-black uppercase text-sm tracking-wider">Features</h5>
            <ul className="space-y-2 text-slate-400 text-sm font-medium">
              <li><Link href="/workout-planner" className="hover:text-emerald-500 transition-colors">AI Workout Generator</Link></li>
              <li><Link href="/diet-planner" className="hover:text-emerald-500 transition-colors">Indian Diet Planner</Link></li>
              <li><Link href="/calculators" className="hover:text-emerald-500 transition-colors">Fitness Calculators</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-500 transition-colors">Progress Tracking</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-black uppercase text-sm tracking-wider">Calculators</h5>
            <ul className="space-y-2 text-slate-400 text-sm font-medium">
              <li><Link href="/calculators/bmi" className="hover:text-emerald-500 transition-colors">BMI Calculator</Link></li>
              <li><Link href="/calculators/maintenance" className="hover:text-emerald-500 transition-colors">TDEE Calculator</Link></li>
              <li><Link href="/calculators/macro" className="hover:text-emerald-500 transition-colors">Macro Calculator</Link></li>
              <li><Link href="/calculators/body-fat" className="hover:text-emerald-500 transition-colors">Body Fat Calculator</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-black uppercase text-sm tracking-wider">Goals</h5>
            <ul className="space-y-2 text-slate-400 text-sm font-medium">
              <li><span className="cursor-pointer hover:text-emerald-500 transition-colors">Lose Belly Fat</span></li>
              <li><span className="cursor-pointer hover:text-emerald-500 transition-colors">Build Muscle Fast</span></li>
              <li><span className="cursor-pointer hover:text-emerald-500 transition-colors">Home Workouts</span></li>
              <li><span className="cursor-pointer hover:text-emerald-500 transition-colors">Gym Workout Plans</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-black uppercase text-sm tracking-wider">Legal</h5>
            <ul className="space-y-2 text-slate-400 text-sm font-medium">
              <li><Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-xs text-slate-600 border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} LeanVerse. Building dream physiques through AI-powered workout plans, macro calculators, and progressive overload tracking.</p>
        </div>
      </footer>

    </div>
  );
}
