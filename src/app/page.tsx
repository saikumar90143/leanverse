'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Dumbbell, ArrowRight, Calculator, 
  Star, ChevronDown, Flame, TrendingUp, Calendar
} from 'lucide-react';
import AdContainer from '@/components/ads/AdContainer';
import { 
  getStreak, getLifetimeVolume, getUserLevel, getTodayWorkoutSummary,
  getHeatmapData, getDailyChallenge
} from '@/lib/gamification';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const initialReviews: Review[] = [
  {
    id: '1',
    name: 'Karan Malhotra',
    rating: 5,
    text: "Being on an Indian vegetarian diet, hitting 140g of protein felt impossible. LeanVerse’s AI Diet Planner automatically suggested low-fat paneer and egg-white alternatives and calculated my exact macro split. Shredded 8kg in 12 weeks!",
    date: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    rating: 5,
    text: "The workout planner is incredible. I've always struggled with programming my gym splits, but the AI instantly generated a structured Push/Pull/Legs routine perfectly tailored to my gym's equipment.",
    date: new Date().toISOString()
  }
];

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  
  // Testimonial States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');

  // Live dashboard data — loaded client-side to avoid SSR/hydration issues
  const [dashData, setDashData] = useState<{
    streak: number;
    levelName: string;
    levelEmoji: string;
    levelColor: string;
    workout: { name: string; completedSets: number; totalSets: number; caloriesBurned: number };
    heatmap: { date: string; hasWorkout: boolean; volume: number; calories: number }[];
    challenge: { title: string; desc: string; icon: string; completed: boolean };
  } | null>(null);

  useEffect(() => {
    try {
      const vol = getLifetimeVolume();
      const level = getUserLevel(vol);
      const streak = getStreak();
      const workout = getTodayWorkoutSummary();
      const heatmap = getHeatmapData(28); // 4 weeks
      const challenge = getDailyChallenge();

      setDashData({
        streak,
        levelName: level.name,
        levelEmoji: level.emoji,
        levelColor: level.color,
        workout,
        heatmap,
        challenge
      });
    } catch {
      // localStorage unavailable — leave dashData as null
    }

    try {
      const storedReviews = localStorage.getItem('leanverse_testimonials');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        setReviews(initialReviews);
      }
    } catch {
      setReviews(initialReviews);
    }
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newReviewName.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      name: newReviewName,
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    try {
      localStorage.setItem('leanverse_testimonials', JSON.stringify(updatedReviews));
    } catch {}
    
    setShowReviewForm(false);
    setNewReviewText('');
    setNewReviewRating(5);
    setNewReviewName('');
  };

  // Daily motivational quotes
  const quotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "No pain, no gain. Push through the discomfort.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Small steps every day lead to giant leaps over time.",
    "The only bad workout is the one that didn't happen.",
    "Eat clean. Train mean. Live lean.",
    "Results happen over time, not overnight. Stay consistent.",
  ];
  const [clientTime, setClientTime] = useState<{ quote: string; greeting: string; dateStr: string } | null>(null);

  useEffect(() => {
    const d = new Date();
    const hour = d.getHours();
    let g = 'Good evening';
    if (hour < 12) g = 'Good morning';
    else if (hour < 18) g = 'Good afternoon';
    
    setClientTime({
      quote: quotes[d.getDay() % quotes.length],
      greeting: g,
      dateStr: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    });
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const calcs = [
    { name: 'BMI Calculator', path: '/calculators/bmi', desc: 'Compute height-to-weight index.' },
    { name: 'TDEE Calories', path: '/calculators/maintenance', desc: 'Find daily maintenance burn.' },
    { name: 'Macro Splitter', path: '/calculators/macro', desc: 'Divide macros by specific goal.' },
    { name: 'Navy Body Fat', path: '/calculators/body-fat', desc: 'Calculate fat percentage.' },
    { name: 'Water Hydrator', path: '/calculators/water', desc: 'Track daily hydration volume.' },
  ];

  const staticBlogs = [
    {
      title: 'The Ultimate Guide to Indian Diet Plans for Fat Loss',
      slug: 'ultimate-indian-diet-plan-fat-loss',
      summary: 'Struggling to hit your protein targets on a traditional Indian diet? Discover how to combine paneer, dal, chicken, and brown rice to shred fat sustainably.',
      category: 'Indian diet plans',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    },
    {
      title: 'Gym Workouts: Designing a Perfect Push/Pull/Legs Split',
      slug: 'gym-workouts-perfect-push-pull-legs-split',
      summary: 'PPL is one of the most effective weekly training programs. Learn how to sequence movements to optimize muscle recovery and progressive overload.',
      category: 'Gym workouts',
      coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does LeanVerse generate customized diet plans?',
      a: 'LeanVerse utilizes mathematical biometrics (Mifflin-St Jeor and TDEE formulas) adjusted for your food preferences (e.g., South Indian, keto, high-protein) and home food pickers. This allows our AI algorithm to build complete daily meal timings, macro limits, and custom grocery lists.',
    },
    {
      q: 'Can I track my progressive overload and workouts here?',
      a: 'Absolutely! Our AI Workout Planner creates specific day-split exercise cards (sets, reps, rest periods). You can record weights on the planner or use the User Dashboard weight tracker graphs to monitor performance over time.',
    },
    {
      q: 'Is there a fee for using LeanVerse?',
      a: 'LeanVerse offers a comprehensive Free tier containing fully-functional fitness calculators, standard blog CMS, and basic AI generators. To unlock unlimited PDF downloads, ad-free UI, and advanced AI chatbot tracking, explore our premium pricing plans.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* 1. HERO SECTION */}
      <section className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70" />
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <motion.div 
          className="lg:col-span-7 space-y-8 text-left relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Next-Gen AI Fitness Ecosystem</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-[5rem] font-black text-slate-800 dark:text-slate-100 leading-[1.05] tracking-tight">
            Build your <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
              dream physique,
            </span><br />
            powered by AI.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
            LeanVerse instantly generates personalized diets, creates custom gym splits, tracks progressive overload, and gamifies your fitness journey. Health has never been this beautiful.
          </p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link 
              href="/diet-planner"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 hover:shadow-cyan-500/40 text-center flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <span>Start Free AI Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/workout-planner"
              className="px-8 py-4 rounded-2xl glass hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base transition-all border border-slate-200/50 dark:border-white/10 text-center flex items-center justify-center cursor-pointer active:scale-95 shadow-lg"
            >
              <span>Explore Dashboard</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Interactive — Premium Today Dashboard */}
        <motion.div 
          className="lg:col-span-5 relative group z-10 mt-8 lg:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative Floating Elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-4 sm:-right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Burn</p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none">420 <span className="text-xs text-slate-500">kcal</span></p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-4 sm:-left-8 bg-white dark:bg-slate-800 px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-20 flex items-center gap-3"
          >
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Protein Goal <span className="text-emerald-500">Hit!</span></p>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 rounded-full blur-[80px] -z-10 transition-all duration-700 group-hover:bg-emerald-500/20 group-hover:scale-110 pointer-events-none" />
          
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-emerald-500/5 space-y-6 w-full max-w-md mx-auto relative overflow-hidden transition-all duration-500 hover:shadow-cyan-500/10 hover:border-emerald-500/30">
            {/* Header / Greeting */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{clientTime?.greeting || 'Welcome'}!</h2>
                <div className="flex items-center space-x-1.5 mt-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{clientTime?.dateStr || '...'}</span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Streak & Level Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 hover:bg-orange-500/5 transition-colors group/streak">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${dashData && dashData.streak > 0 ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Streak</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {dashData?.streak ?? 0} <span className="text-sm font-bold text-slate-400">Days</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 hover:bg-cyan-500/5 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-500">
                    <Star className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Rank</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl">{dashData?.levelEmoji ?? '🌱'}</span>
                  <span className={`text-sm font-black ${dashData?.levelColor ?? 'text-emerald-500'}`}>
                    {dashData?.levelName ?? 'Beginner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Today's Workout Progress */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-500" /> Today's Workout
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> {dashData?.workout.caloriesBurned ?? 0} kcal
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {dashData?.workout.completedSets ?? 0} / {dashData?.workout.totalSets ?? 0} Sets
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200 block truncate mb-2">
                  {dashData?.workout.name ?? 'No workout logged today'}
                </span>
                
                <div className="relative w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-cyan-500 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.round(((dashData?.workout.completedSets ?? 0) / (dashData?.workout.totalSets ?? 1)) * 100)}%` }}
                  />
                </div>
              </div>

              <Link href="/workout-tracker" className="block w-full py-2.5 mt-2 bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black text-center transition-colors shadow-md">
                {(dashData?.workout.totalSets ?? 0) > 0 ? 'Resume Workout' : 'Start New Workout'}
              </Link>
            </div>

            {/* Daily Challenge (WOD) */}
            {dashData?.challenge && (
              <div className={`p-4 rounded-2xl border transition-colors ${dashData.challenge.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-orange-500/5 border-orange-500/10'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${dashData.challenge.completed ? 'text-emerald-500' : 'text-orange-500'}`}>
                    <span>{dashData.challenge.icon}</span> Daily Challenge
                  </span>
                  {dashData.challenge.completed && (
                    <span className="text-[9px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded-md uppercase">Completed</span>
                  )}
                </div>
                <h4 className={`text-sm font-black ${dashData.challenge.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
                  {dashData.challenge.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{dashData.challenge.desc}</p>
              </div>
            )}

            {/* 7-Day Calorie Burn Chart */}
            {dashData?.heatmap && (
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Active Burn
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Last 7 Days</span>
                </div>
                
                <div className="h-28 flex items-end space-x-2 pt-4">
                  {dashData.heatmap.slice(-7).map((day, i) => {
                    const maxCal = Math.max(...dashData.heatmap.slice(-7).map(d => d.calories), 500);
                    const heightPercent = day.calories > 0 ? Math.max((day.calories / maxCal) * 100, 10) : 0;
                    
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full group">
                        {/* Calorie Label */}
                        <div className="text-[7px] sm:text-[8px] font-black text-orange-500/80 mb-1 transition-colors group-hover:text-orange-500 text-center leading-tight">
                          {day.calories > 0 ? `${day.calories} kcal` : ''}
                        </div>
                        {/* Bar */}
                        <div className="w-full relative rounded-t-md bg-slate-200 dark:bg-white/10 flex items-end justify-center overflow-hidden transition-all group-hover:bg-slate-300 dark:group-hover:bg-white/20">
                          <div 
                            className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-amber-400 transition-all duration-1000 ease-out"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        {/* Day label */}
                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
                          {(() => {
                            const [y, m, d] = day.date.split('-');
                            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                            return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                          })()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Daily Quote */}
            {clientTime?.quote && (
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-2xl border border-emerald-500/10">
                <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">"{clientTime.quote}"</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Ad slot */}
      <AdContainer slot="home-hero-bottom" format="horizontal" />

      {/* 2. CALCULATORS SUITE grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Interactive Tools</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            Free Health Tools
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">Not sure where to start? Use these quick, simple tools to figure out your ideal weight, calories, and hydration needs.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {calcs.map((c) => (
            <Link 
              key={c.name}
              href={c.path}
              className="glass p-5 rounded-2xl border border-slate-200/10 hover:border-emerald-500/20 text-center space-y-2 block hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-850 dark:text-slate-200 block">{c.name}</span>
              <span className="text-[10px] text-slate-500 block leading-tight">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIALS SLIDER SECTION */}
      <section className="bg-slate-200/30 dark:bg-slate-900/40 py-16 border-t border-b border-slate-250/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
            <div className="space-y-4">
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Success Stories</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                Real Transformations <br />
                Powered by LeanVerse
              </h2>
              <div className="flex items-center space-x-2 pt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current text-amber-400" />)}
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 ml-2">4.9 / 5 Rating ({3500 + reviews.length}+ members)</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm transition-transform active:scale-95 shadow-md flex-shrink-0"
            >
              {showReviewForm ? 'Cancel' : 'Leave a Review'}
            </button>
          </div>

          {/* Leave Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="glass p-6 sm:p-8 rounded-3xl border border-emerald-500/20 shadow-xl max-w-2xl animate-fade-in space-y-5">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Share your experience</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Your Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star className={`w-8 h-8 ${newReviewRating >= star ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
                <textarea
                  placeholder="How did LeanVerse help you hit your goals?"
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer">
                Submit Review
              </button>
            </form>
          )}

          {/* Testimonial Cards */}
          <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-6 snap-x">
            {reviews.map((review) => (
              <div key={review.id} className="glass rounded-3xl p-6 md:p-8 border border-slate-200/10 space-y-5 min-w-[320px] max-w-[400px] w-full shrink-0 flex flex-col justify-between snap-start">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-sm italic text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                    "{review.text}"
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-5 border-t border-slate-200/10 mt-auto">
                  <div>
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 block">{review.name}</span>
                    <span className="text-[10px] text-emerald-500 font-bold block uppercase tracking-wider mt-0.5">Verified Member</span>
                  </div>
                  <span className="text-xs font-black text-slate-400 font-mono">
                    {new Date(review.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BLOGS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-250/10 pb-4">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Knowledge Feed</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Trending Fitness Studies</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-emerald-500 hover:underline flex items-center space-x-1">
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staticBlogs.map((b) => (
            <div key={b.slug} className="glass rounded-3xl overflow-hidden border border-slate-200/10 shadow-lg flex flex-col justify-between glow-card">
              <div className="relative w-full h-44 overflow-hidden bg-slate-800">
                <Image src={b.coverImage} alt={b.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-80" />
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded-md">
                  {b.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm leading-snug">{b.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{b.summary}</p>
              </div>
              <div className="px-5 pb-5 pt-2 flex justify-end">
                <Link href={`/blog/${b.slug}`} className="text-xs font-black text-emerald-500 hover:text-emerald-400 flex items-center">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ACCORDION FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Support Desk</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const open = !!faqOpen[idx];
            return (
              <div key={idx} className="glass rounded-2xl border border-slate-200/10 overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left font-extrabold text-sm text-slate-850 dark:text-slate-200 hover:bg-slate-200/10 dark:hover:bg-white/5 flex justify-between items-center cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
