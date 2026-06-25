import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
 Sparkles, Dumbbell, ArrowRight, Calculator, Star, ChevronDown, 
 Flame, TrendingUp, Calendar, Target, Activity, Clock, Shield,
 CheckCircle2, Zap, Trophy, Play, X
} from 'lucide-react';

import dbConnect from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';
import QuickStartWizardWrapper from '@/components/home/QuickStartWizardWrapper';
import TransformationPrograms from '@/components/home/TransformationPrograms';
import PremiumComparison from '@/components/home/PremiumComparison';
import ReviewButton from '@/components/home/ReviewButton';
import AdContainer from '@/components/ads/AdContainer';


export default async function HomePage() {
  let formattedBlogs: any[] = [];
  try {
    await dbConnect();
    const latestBlogs = await BlogPost.find({ status: 'published' })
      .select('title slug summary category coverImage author publishedAt createdAt')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .lean();
      
    formattedBlogs = latestBlogs.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      category: p.category || 'Fitness',
      coverImage: p.coverImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
      date: p.publishedAt
        ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: p.author || 'LeanVerse Team',
    }));
  } catch (e) {
    console.error('Failed to fetch blogs', e);
  }

  return (
 <div className="space-y-0 pb-20">
 
 {/* 1. HERO & QUICK START WIZARD */}
 <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden px-4 sm:px-6 lg:px-8">
 {/* Background Gradients */}
 <div className="absolute inset-0 z-0 pointer-events-none">
 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen" />
 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
 </div>

 <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
 
 {/* Left: Copy & CTA */}
 <div className="lg:col-span-6 space-y-8">
 <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-foreground/50 dark:bg-card/5 border border-slate-700/50 dark:border-border backdrop-blur-md">
 <Sparkles className="w-4 h-4 text-emerald-400" />
 <span className="text-xs font-bold text-muted tracking-wider uppercase">The Ultimate Workout Tracker</span>
 </div>

 <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
 Stop Forgetting Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Weights</span>
 </h1>

 <p className="text-lg text-muted font-medium max-w-xl leading-relaxed">
 Tired of getting to the gym and guessing what you lifted last week? LeanVerse automatically tracks your previous weights, reps, and PRs so you can focus purely on progressive overload without the mental tension.
 </p>

 {/* Quick Trust Stats */}
 <div className="grid grid-cols-2 gap-4 py-4 max-w-lg">
 <div className="flex items-center space-x-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
 <span className="text-sm font-bold text-foreground dark:text-muted">Auto Weight Memory</span>
 </div>
 <div className="flex items-center space-x-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
 <span className="text-sm font-bold text-foreground dark:text-muted">Never Guess Again</span>
 </div>
 <div className="flex items-center space-x-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
 <span className="text-sm font-bold text-foreground dark:text-muted">Progressive Overload</span>
 </div>
 <div className="flex items-center space-x-2">
 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
 <span className="text-sm font-bold text-foreground dark:text-muted">AI Powered Plans</span>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 pt-2">
 <Link 
 href="/workout-planner"
 className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
 >
 <span>Track Your Workout</span>
 <ArrowRight className="w-5 h-5" />
 </Link>
 <Link 
 href="/diet-planner"
 className="px-8 py-4 rounded-2xl bg-transparent text-foreground font-bold text-lg transition-all border-2 border-foreground/30 hover:border-emerald-500 hover:text-emerald-500 text-center flex items-center justify-center"
 >
 Generate Diet Plans
 </Link>
 </div>
 </div>

 {/* Right: Quick Start Wizard & Dashboard Mock */}
 <QuickStartWizardWrapper />
 
 </div>
 </section>

  

  {/* ═══════════════════════════════════════════════════ */}
  {/* HOW LEANVERSE WORKS — Full 8-Step Walkthrough      */}
  {/* ═══════════════════════════════════════════════════ */}
  <section className="relative bg-background overflow-hidden">

    {/* Top gradient fade */}
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

    {/* Background grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Platform Walkthrough</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
          🚀 How LeanVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Works</span>
        </h2>
        <p className="text-lg text-muted font-medium leading-relaxed">
          Everything you need for fitness in one platform.<br />
          Track workouts, follow personalized diet plans, monitor progress, and achieve your transformation goals.
        </p>
      </div>

      {/* Steps — alternating layout */}
      <div className="space-y-24">

        {/* STEP 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center">1</span>
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest">First Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              👤 Create Your <span className="text-blue-400">Fitness Profile</span>
            </h3>
            <p className="text-muted font-medium">Enter your personal stats and LeanVerse instantly calculates your body metrics to build your baseline.</p>
            <div className="grid grid-cols-2 gap-3">
              {[['Age & Gender', 'Your biological baseline'], ['Height & Weight', 'BMI calculation'], ['Activity Level', 'Calorie adjustment'], ['Health Goals', 'Personalized plan']].map(([title, desc]) => (
                <div key={title} className="glass p-4 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-colors">
                  <p className="text-sm font-black text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {[['BMI', 'Body Mass Index'], ['BMR', 'Base Metabolic Rate'], ['TDEE', 'Maintenance Calories']].map(([label, full]) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="font-black text-blue-400 text-sm">{label}</span>
                  <span className="text-xs text-muted">{full}</span>
                </div>
              ))}
            </div>
            <Link href="/calculators/maintenance" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-sm transition-all shadow-lg shadow-blue-500/20">
              Calculate My TDEE <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass p-8 rounded-3xl border border-blue-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <h4 className="font-black text-foreground mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Your Body Stats</h4>
            <div className="space-y-4">
              {[['Age', '24 years', '🧑'], ['Height', '175 cm', '📏'], ['Weight', '75 kg', '⚖️'], ['Activity', 'Moderately Active', '🏃']].map(([label, val, emoji]) => (
                <div key={label} className="flex items-center justify-between bg-secondary/50 dark:bg-card/10 p-3 rounded-xl border border-border/30">
                  <span className="text-sm font-bold text-muted flex items-center gap-2"><span>{emoji}</span>{label}</span>
                  <span className="text-sm font-black text-foreground">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[['BMI', '24.5', 'text-emerald-400'], ['BMR', '1,820 kcal', 'text-blue-400'], ['TDEE', '2,520 kcal', 'text-cyan-400']].map(([label, val, color]) => (
                <div key={label} className="text-center p-3 rounded-xl bg-secondary/50 dark:bg-card/5 border border-border/20">
                  <p className={`text-lg font-black ${color}`}>{val}</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 glass p-8 rounded-3xl border border-emerald-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <h4 className="font-black text-foreground mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-emerald-400" /> Choose Your Goal</h4>
            <div className="grid grid-cols-2 gap-3">
              {[['🔥 Fat Loss', 'Calorie deficit plan', true], ['💪 Muscle Gain', 'Surplus + protein', false], ['⚖️ Recomposition', 'Lose fat, gain muscle', false], ['🏋️ Strength', 'Heavy compound lifts', false], ['🌿 General Fitness', 'Balanced approach', false], ['📉 Weight Loss', 'Gradual sustainable cut', false]].map(([title, desc, active]) => (
                <div key={title as string} className={`p-4 rounded-2xl border cursor-pointer transition-all ${active ? 'border-emerald-500 bg-emerald-500/10' : 'border-border/30 hover:border-emerald-500/30 bg-secondary/30 dark:bg-card/5'}`}>
                  <p className="text-sm font-black text-foreground mb-0.5">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">Calories & workouts automatically adjusted for your goal.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">2</span>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Second Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              🎯 Choose Your <span className="text-emerald-500">Goal</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">Select what you want to achieve. LeanVerse automatically adjusts your daily calorie targets, macros split, and workout intensity to align with your specific objective.</p>
            <ul className="space-y-3">
              {['Calorie targets recalculated instantly', 'Macro split optimized for your goal', 'Workout intensity matched to objective', 'Plan adapts as you progress'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/workout-planner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm transition-all shadow-lg shadow-emerald-500/20">
              Build My Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">3</span>
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Third Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              🍛 Select Foods You <span className="text-orange-500">Actually Like</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">No boring diets forced on you. Pick the foods you love and our AI builds a complete, macro-balanced meal plan exclusively from your choices.</p>
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-orange-600 dark:text-orange-400 font-black text-sm italic">"No boring diets. No foods you hate."</p>
            </div>
            <Link href="/diet-planner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black text-sm transition-all shadow-lg shadow-orange-500/20">
              Create My Diet Plan <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex flex-wrap gap-2">
              {['🍚 Rice', '🍗 Chicken', '🥚 Eggs', '🧀 Paneer', '🍌 Fruits', '🌾 Oats', '🫓 Roti', '🥛 Whey', '🐟 Fish', '🥦 Broccoli', '🥜 Peanuts', '🍳 Dal'].map(food => (
                <span key={food} className="px-3 py-2 glass rounded-xl text-sm font-bold text-foreground border border-orange-500/20 hover:border-orange-500/50 transition-colors cursor-default">{food}</span>
              ))}
            </div>
          </div>
          <div className="glass p-8 rounded-3xl border border-orange-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <h4 className="font-black text-foreground mb-2">Your Personalized Meal Plan</h4>
            <p className="text-xs text-muted mb-5">Generated using your selected foods</p>
            <div className="space-y-3">
              {[['Breakfast', 'Oats + Eggs + Banana', '420 kcal', '28g protein'], ['Lunch', 'Rice + Chicken Curry + Dal', '680 kcal', '48g protein'], ['Snack', 'Paneer + Fruits', '280 kcal', '18g protein'], ['Dinner', 'Roti + Chicken + Veggies', '560 kcal', '42g protein']].map(([meal, foods, cals, prot]) => (
                <div key={meal} className="bg-secondary/50 dark:bg-card/10 p-4 rounded-xl border border-border/30">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-black text-orange-500 uppercase tracking-wider">{meal}</span>
                    <span className="text-xs font-bold text-muted">{cals}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{foods}</p>
                  <p className="text-xs text-emerald-500 font-bold mt-1">{prot}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-sm font-black text-foreground">Total Today</span>
              <div className="flex gap-4 text-xs font-black">
                <span className="text-foreground">1,940 kcal</span>
                <span className="text-emerald-400">136g P</span>
                <span className="text-cyan-400">210g C</span>
                <span className="text-amber-400">58g F</span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 glass p-8 rounded-3xl border border-cyan-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest block">Phase 2 · Hypertrophy · Week 4</span>
                <h4 className="font-black text-foreground text-lg">Push Day — Chest, Shoulders, Triceps</h4>
              </div>
              <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-cyan-500" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              {[['🏠 / 🏋️', 'Location'], ['Intermediate', 'Level'], ['4 Days/wk', 'Schedule']].map(([val, label]) => (
                <div key={label} className="p-2 rounded-lg bg-secondary/50 border border-border/20">
                  <p className="text-xs font-black text-foreground">{val}</p>
                  <p className="text-[9px] text-muted uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[['Barbell Bench Press', '4', '8-10', '75kg'], ['Incline DB Press', '3', '10-12', '30kg'], ['Overhead Press', '3', '8-10', '50kg'], ['Lateral Raises', '4', '15-20', '12kg'], ['Tricep Pushdown', '3', '12-15', 'Cable']].map(([name, sets, reps, weight]) => (
                <div key={name} className="flex items-center justify-between bg-secondary/50 dark:bg-card/5 p-3 rounded-xl border border-border/20">
                  <span className="text-sm font-bold text-foreground">{name}</span>
                  <div className="flex gap-2 text-xs font-black">
                    <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-md">{sets}×{reps}</span>
                    <span className="bg-secondary text-muted px-2 py-0.5 rounded-md">{weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-black flex items-center justify-center">4</span>
              <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">Fourth Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              🏋️ Get Your <span className="text-cyan-500">Workout Plan</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">Customize exactly how you want to train. The AI generates daily workouts with exact exercises, sets, reps, rest periods, and cardio schedules.</p>
            <div className="grid grid-cols-2 gap-3">
              {[['🏠 Home / 🏋️ Gym', 'Your location'], ['Beginner → Elite', 'All levels'], ['3–6 Days/Week', 'Flexible schedule'], ['30–90 Min', 'Your time budget']].map(([title, desc]) => (
                <div key={title} className="glass p-4 rounded-2xl border border-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                  <p className="text-sm font-black text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/workout-planner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm transition-all shadow-lg shadow-cyan-500/20">
              Get My Workout Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* STEP 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-black flex items-center justify-center">5</span>
              <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Fifth Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              📈 Track Every <span className="text-purple-500">Workout</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">Most gym-goers fail because they don't remember their last weights or reps. LeanVerse automatically tracks everything and tells you exactly what to lift today.</p>
            <ul className="space-y-3">
              {['Weight lifted per exercise', 'Reps and sets history', 'Progressive overload cues', 'Personal record alerts'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/workout-planner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-sm transition-all shadow-lg shadow-purple-500/20">
              Start Tracking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass p-8 rounded-3xl border border-purple-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-foreground">Progressive Overload Tracker</h4>
              <span className="text-[10px] font-black bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md uppercase tracking-wider">Live</span>
            </div>
            <div className="space-y-4">
              {[['Barbell Bench Press', '65 kg × 8', '67.5 kg × 8', '+2.5kg'], ['Squat', '90 kg × 6', '92.5 kg × 6', '+2.5kg'], ['Deadlift', '110 kg × 5', '115 kg × 5', '+5kg']].map(([exercise, last, today, increase]) => (
                <div key={exercise} className="p-4 rounded-2xl bg-secondary/50 dark:bg-card/10 border border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-foreground">{exercise}</span>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{increase}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded-lg bg-secondary/80 dark:bg-card/20 border border-border/30">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Last Workout</p>
                      <p className="text-sm font-black text-muted">{last}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Today's Goal</p>
                      <p className="text-sm font-black text-foreground">{today}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black text-purple-400">Progressive Overload Active — You're getting stronger! 💪</span>
            </div>
          </div>
        </div>

        {/* STEP 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 glass p-8 rounded-3xl border border-amber-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <h4 className="font-black text-foreground mb-6 flex items-center gap-2">
              <span className="text-xl">📸</span> AI Food Scanner
            </h4>
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/80 to-card/20 border border-amber-500/20 flex flex-col items-center justify-center gap-4 mb-6 relative overflow-hidden">
              <div className="absolute inset-4 border-2 border-amber-400/50 rounded-2xl" style={{boxShadow: 'inset 0 0 20px rgba(245,158,11,0.1)'}}>
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br" />
              </div>
              <span className="text-6xl">🍱</span>
              <span className="text-sm font-bold text-amber-400 animate-pulse">Scanning...</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted font-bold uppercase tracking-wider mb-3">AI Detected: Dal Makhani + Rice</p>
              <div className="grid grid-cols-4 gap-2">
                {[['520', 'Calories', 'text-foreground'], ['24g', 'Protein', 'text-emerald-400'], ['68g', 'Carbs', 'text-cyan-400'], ['18g', 'Fat', 'text-amber-400']].map(([val, label, color]) => (
                  <div key={label} className="text-center p-3 rounded-xl bg-secondary/50 dark:bg-card/10 border border-border/20">
                    <p className={`text-lg font-black ${color}`}>{val}</p>
                    <p className="text-[9px] text-muted font-bold uppercase">{label}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-3 bg-amber-500 hover:bg-amber-400 text-white font-black rounded-xl transition-colors text-sm">✓ Add to Today's Diet</button>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">6</span>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Sixth Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              📸 Scan Food <span className="text-amber-500">Instantly</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">Take a photo of any meal and our AI instantly estimates calories, protein, carbs, and fat. Log your meals in seconds — no manual searching required.</p>
            <ul className="space-y-3">
              {['Instant photo-to-macros analysis', 'Supports Indian & global cuisines', 'Add to daily diet in one tap', 'Flashlight support for dark environments'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/food-scanner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-black text-sm transition-all shadow-lg shadow-amber-500/20">
              Try AI Scanner <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* STEP 7 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">7</span>
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Seventh Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              🔥 Maintain Your <span className="text-orange-500">Workout Streak</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">Consistency is the #1 predictor of fitness success. LeanVerse gamifies your journey so you stay accountable and motivated every single day.</p>
            <ul className="space-y-3">
              {['Daily streak counter to build habits', 'Weekly workout goal tracking', 'XP rewards for every session', 'Badge unlocks for milestones'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-foreground dark:text-muted">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/workout-planner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black text-sm transition-all shadow-lg shadow-orange-500/20">
              View My Streaks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass p-8 rounded-3xl border border-orange-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
            <h4 className="font-black text-foreground mb-6">Consistency Dashboard</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30">
                <p className="text-5xl font-black text-orange-500">🔥</p>
                <p className="text-3xl font-black text-foreground mt-2">18</p>
                <p className="text-xs text-muted font-bold uppercase tracking-wider mt-1">Day Streak</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-secondary/50 dark:bg-card/10 border border-border/30">
                <p className="text-5xl font-black">📅</p>
                <p className="text-3xl font-black text-foreground mt-2">4/5</p>
                <p className="text-xs text-muted font-bold uppercase tracking-wider mt-1">Weekly Goal</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted font-bold uppercase tracking-wider">This Week</p>
              <div className="grid grid-cols-7 gap-1.5">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-black ${i < 4 ? 'bg-orange-500 text-white' : i === 4 ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-500' : 'bg-secondary/50 text-muted border border-border/20'}`}>{day}</div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm font-black text-foreground">3-Week Warrior Badge Unlocked! 🏆</p>
                <p className="text-xs text-muted">Keep going to unlock the Iron Consistency badge at 30 days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 8 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 glass p-8 rounded-3xl border border-teal-500/20 shadow-2xl bg-card/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <h4 className="font-black text-foreground mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-teal-400" />Transformation Dashboard</h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/50 dark:bg-card/10 border border-border/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-muted uppercase tracking-wider">Body Weight Progress</span>
                  <span className="text-xs font-black text-emerald-500">-6.5 kg</span>
                </div>
                <div className="flex items-end gap-1 h-12">
                  {[85, 83.5, 82, 81, 80, 79.2, 78.5].map((v, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{height: `${((v - 76) / 12) * 100}%`, background: i === 6 ? 'linear-gradient(to top, #10b981, #06b6d4)' : 'rgba(16,185,129,0.2)'}} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted">85 kg start</span>
                  <span className="text-xs font-black text-emerald-500">78.5 kg now</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Chest', '98 → 94 cm', 'text-teal-400'], ['Waist', '86 → 80 cm', 'text-emerald-400'], ['Workouts', '48 Sessions', 'text-cyan-400'], ['Avg Cals', '1,940 kcal', 'text-blue-400']].map(([label, val, color]) => (
                  <div key={label} className="p-3 rounded-xl bg-secondary/50 dark:bg-card/10 border border-border/20">
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-sm font-black ${color}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <Shield className="w-5 h-5 text-teal-400 shrink-0" />
                <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">On track for 90-day transformation goal. Keep it up! 🎉</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-black flex items-center justify-center">8</span>
              <span className="text-xs font-black text-teal-400 uppercase tracking-widest">Eighth Step</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
              📊 Monitor Your <span className="text-teal-500">Transformation</span>
            </h3>
            <p className="text-muted font-medium leading-relaxed">Data doesn't lie. Track every measurement, every photo, every workout performance metric in one beautiful dashboard and watch your transformation unfold.</p>
            <div className="grid grid-cols-2 gap-3">
              {[['📉 Weight', 'Progress graphs'], ['📏 Measurements', 'Body metrics'], ['📷 Photos', 'Visual progress'], ['💪 Performance', 'Strength gains']].map(([title, desc]) => (
                <div key={title} className="glass p-4 rounded-2xl border border-teal-500/10 hover:border-teal-500/30 transition-colors">
                  <p className="text-sm font-black text-foreground mb-1">{title}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/workout-planner" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-black text-sm transition-all shadow-lg shadow-teal-500/20">
              Track My Progress <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>{/* end steps */}
    </div>{/* end container */}

   

  

  </section>

 


 {/* 4. TRANSFORMATION PROGRAMS SECTION */}
 <section className="bg-background py-24 border-y border-border/50 dark:border-border">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
 <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Structured Challenges</span>
 <h2 className="text-3xl md:text-5xl font-black text-foreground">Complete Transformation Programs</h2>
 </div>

 <TransformationPrograms />
 </div>
 </section>

 
 {/* 6. CALCULATORS HUB */}

 {/* 7. MOTIVATION & SOCIAL PROOF */}
 <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20">
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
 <div className="space-y-6">
 <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">Stay Consistent. <br/><span className="text-orange-500">Transform Faster.</span></h2>
 <p className="text-lg text-muted font-medium leading-relaxed">
 Fitness is a marathon, not a sprint. We use game design psychology to keep you hooked on building healthy habits.
 </p>
 <div className="grid grid-cols-2 gap-6 pt-4">
 <div className="space-y-2">
 <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center"><Flame className="w-5 h-5" /></div>
 <h3 className="font-black text-foreground">Daily Streaks</h3>
 <p className="text-xs text-muted font-medium">Don't break the chain. Complete workouts to keep your fire alive.</p>
 </div>
 <div className="space-y-2">
 <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center"><Trophy className="w-5 h-5" /></div>
 <h3 className="font-black text-foreground">Earn Badges</h3>
 <p className="text-xs text-muted font-medium">Unlock exclusive achievements for hitting personal records.</p>
 </div>
 <div className="space-y-2">
 <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
 <h3 className="font-black text-foreground">Level Up XP</h3>
 <p className="text-xs text-muted font-medium">Gain experience points and rank up from Beginner to Elite.</p>
 </div>
 <div className="space-y-2">
 <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5" /></div>
 <h3 className="font-black text-foreground">Heatmaps</h3>
 <p className="text-xs text-muted font-medium">Visualize your effort over the last 30 days with activity charts.</p>
 </div>
 </div>
 </div>
 
 <div className="glass p-8 rounded-3xl border border-border/50 dark:border-border bg-background/50 dark:bg-secondary/50 space-y-6">
 <h3 className="font-black text-center text-foreground">Real Results from Real People</h3>
 {[
 { text: "Lost 12kg in 90 days. The progressive overload tracking was exactly what I needed.", name: "David M." },
 { text: "Built 5kg of lean muscle on a vegetarian diet. The diet planner is incredible.", name: "Arjun K." },
 { text: "Finally hit a 225lb bench press. The AI phased my workouts perfectly to break my plateau.", name: "Sarah J." }
 ].map((review, i) => (
 <div key={i} className="bg-card dark:bg-secondary p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
 <div className="flex text-amber-400 mb-2">{[...Array(5)].map((_,j) => <Star key={j} className="w-4 h-4 fill-current" />)}</div>
 <p className="text-sm font-medium text-muted italic mb-3">"{review.text}"</p>
 <p className="text-xs font-black text-foreground">— {review.name}</p>
 </div>
 ))}
 <ReviewButton />
 </div>
 </div>
 </section>

 {/* 8. LATEST ARTICLES (BLOG) */}
 <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/50 dark:border-border">
 <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-4 md:space-y-0">
 <div>
 <h2 className="text-3xl md:text-5xl font-black text-foreground">Latest from the Blog</h2>
 <p className="text-muted font-medium mt-2">Actionable fitness advice and science-backed nutrition protocols.</p>
 </div>
 <Link href="/blog" className="px-6 py-3 rounded-xl bg-secondary dark:bg-card/10 hover:bg-secondary dark:hover:bg-card/20 text-foreground font-bold transition-colors inline-flex items-center space-x-2">
 <span>View All Articles</span>
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>

 {formattedBlogs.length === 0 ? (
 <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-3xl">
 <p className="text-muted font-bold text-sm">No articles published yet. Check back soon!</p>
 <Link href="/blog" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-colors">
 Visit Blog <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {formattedBlogs.map((blog) => (
 <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group flex flex-col rounded-3xl overflow-hidden glass border border-border/50 dark:border-border hover:border-emerald-500/30 transition-all hover:shadow-xl hover:-translate-y-2">
 <div className="h-56 w-full relative overflow-hidden bg-secondary">
 <Image src={blog.coverImage} alt={blog.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
 <div className="absolute top-4 left-4 flex gap-2">
 <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">{blog.category}</span>
 </div>
 </div>
 <div className="p-6 flex flex-col flex-1">
 <span className="text-[10px] text-muted font-bold block mb-2">{blog.date} · {blog.author}</span>
 <h3 className="text-xl font-black text-foreground mb-3 leading-snug group-hover:text-emerald-500 transition-colors line-clamp-2">{blog.title}</h3>
 <p className="text-sm text-muted font-medium leading-relaxed mb-6 flex-1 line-clamp-3">{blog.summary}</p>
 <span className="text-sm font-bold text-foreground flex items-center gap-1 group-hover:text-emerald-500">Read Article <ArrowRight className="w-4 h-4 ml-1" /></span>
 </div>
 </Link>
 ))}
 </div>
 )}
 </section>

 {/* 9. PREMIUM COMPARISON */}
 <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/50 dark:border-border">
 <div className="text-center mb-12 space-y-4">
 <h2 className="text-3xl md:text-5xl font-black text-foreground">Choose Your Path</h2>
 </div>

 <PremiumComparison />
 </section>



 </div>
 );
}
