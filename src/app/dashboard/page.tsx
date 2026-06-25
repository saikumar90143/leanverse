'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/layout/AuthProvider';
import { 
 Flame, Trophy, Apple, Dumbbell, Droplet, Scale, Sparkles, 
 Plus, CheckCircle2, ChevronRight, LayoutDashboard, Bookmark, Target, Search,
 Newspaper, Gem
} from 'lucide-react';
import Link from 'next/link';
import { getTodayWorkoutSummary } from '@/lib/gamification';
import { getUserStorageKey, getUserId, formatLocalDate } from '@/lib/storage';
import MacroRings from '@/components/shared/MacroRings';

const WorkoutStreakCard = dynamic(() => import('@/components/shared/WorkoutStreakCard'), { ssr: false });
const WeeklyWorkoutTracker = dynamic(() => import('@/components/shared/WeeklyWorkoutTracker'), { ssr: false });
const StreakMilestonePopup = dynamic(() => import('@/components/shared/StreakMilestonePopup'), { ssr: false });
export default function UserDashboard() {
 const { user, updateUserSession } = useAuth();
 
 // Local state for dashboard logging metrics
  const [weightInput, setWeightInput] = useState('');
  const [loggedWeight, setLoggedWeight] = useState([74.5, 74.0, 73.6, 73.1, 72.8]);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  const [targetWeightInput, setTargetWeightInput] = useState('');
  const [waterCups, setWaterCups] = useState(0);
 const [caloriesLogged, setCaloriesLogged] = useState(0);
 const [activeCalorieGoal, setActiveCalorieGoal] = useState(2000);
 const [workoutProgress, setWorkoutProgress] = useState({ completed: 0, total: 0 });
 const [targetMacros, setTargetMacros] = useState({ protein: 150, carbs: 200, fats: 55 });
 const [eatenMacros, setEatenMacros] = useState({ protein: 0, carbs: 0, fats: 0 });

 const isOver = (actual: number, target: number) => actual > target * 1.05;
 const isUnder = (actual: number, target: number) => actual < target * 0.9;
 
 // Real data state
 const [dietPlanTitle, setDietPlanTitle] = useState('No active diet plan');
 const [dietPlanDetails, setDietPlanDetails] = useState('Generate a plan to see it here');
 const [lastWorkoutName, setLastWorkoutName] = useState('No recent workout');
 const [lastWorkoutDetails, setLastWorkoutDetails] = useState('Track a workout to see it here');
 const [hasDietPlan, setHasDietPlan] = useState(false);
 const [hasWorkout, setHasWorkout] = useState(false);
 const [greeting, setGreeting] = useState('');
 const [bgClass, setBgClass] = useState('');

 React.useEffect(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    setGreeting('Good Morning');
    setBgClass('from-orange-500/10 to-amber-500/5 dark:from-orange-500/20 dark:to-amber-500/10 border-orange-500/20');
  } else if (hour >= 12 && hour < 17) {
    setGreeting('Good Afternoon');
    setBgClass('from-emerald-500/10 to-cyan-500/5 dark:from-emerald-500/20 dark:to-cyan-500/10 border-emerald-500/20');
  } else if (hour >= 17 && hour < 21) {
    setGreeting('Good Evening');
    setBgClass('from-purple-500/10 to-pink-500/5 dark:from-purple-500/20 dark:to-pink-500/10 border-purple-500/20');
  } else {
    setGreeting('Late Night Grind');
    setBgClass('from-blue-600/10 to-indigo-600/5 dark:from-blue-600/20 dark:to-indigo-600/10 border-blue-500/20');
  }

 try {
 // Load Diet Plan
 const dietRaw = localStorage.getItem(getUserStorageKey('leanverse_diet_plan'));
 if (dietRaw) {
 const diet = JSON.parse(dietRaw);
 if (diet.planGenerated) {
 setHasDietPlan(true);
 setDietPlanTitle(`${diet.goal} Diet Blueprint`);
 
 // Calculate total target calories from the plan
 let totalTdee = 2000;
 if (diet.selectedFoods && Array.isArray(diet.selectedFoods)) {
 const total = diet.selectedFoods.reduce((sum: number, f: any) => sum + (f.calories || 0), 0);
 if (total > 0) totalTdee = total;
 }
 setActiveCalorieGoal(Math.round(totalTdee));
 
 // Recreate macro split
 const protein = Math.round((diet.weight || 75) * 2.0);
 const fats = Math.round((totalTdee * 0.25) / 9);
 const carbs = Math.round((totalTdee - (protein * 4 + fats * 9)) / 4);
 setTargetMacros({ protein, carbs, fats });

 setDietPlanDetails(`${Math.round(totalTdee)} kcal • ${diet.foodPref} • ${diet.goal}`);
 }
 }

 // Load Transformation Journey
 const journeyRaw = localStorage.getItem(getUserStorageKey('leanverse_transformation'));
 if (journeyRaw) {
 const journey = JSON.parse(journeyRaw);
 setHasWorkout(true);
 setLastWorkoutName(`Journey Day ${journey.currentDay} of ${journey.totalDays}`);
 
 const currentDay = journey.schedule?.[journey.currentDay - 1];
 if (currentDay) {
 setLastWorkoutDetails(`${currentDay.phaseName} • ${currentDay.workoutName}`);
 }
 
 setWorkoutProgress({ completed: journey.workoutsCompleted || 0, total: journey.totalDays || 30 });
 } else {
 setWorkoutProgress({ completed: 0, total: 30 });
 }

 // Load Today Diet Eaten Cals & Macros
 const today = formatLocalDate();
 const eatenCalsRaw = localStorage.getItem(getUserStorageKey(`leanverse_eaten_cals_${today}`));
 const quickCalsRaw = localStorage.getItem(getUserStorageKey(`leanverse_quick_cals_${today}`));
 const eatenCals = eatenCalsRaw ? parseInt(eatenCalsRaw, 10) : 0;
 const quickCals = quickCalsRaw ? parseInt(quickCalsRaw, 10) : 0;
 setCaloriesLogged(eatenCals + quickCals);
 
 const eatenMacrosRaw = localStorage.getItem(getUserStorageKey(`leanverse_eaten_macros_${today}`));
 if (eatenMacrosRaw) {
 setEatenMacros(JSON.parse(eatenMacrosRaw));
 }

 // Load Plan Targets (overrides theoretical TDEE)
 const planTargetsRaw = localStorage.getItem(getUserStorageKey(`leanverse_plan_targets_${today}`));
 if (planTargetsRaw) {
 const targets = JSON.parse(planTargetsRaw);
 setActiveCalorieGoal(targets.calories);
 setTargetMacros({ protein: targets.protein, carbs: targets.carbs, fats: targets.fats });
 }

 // Load Water Cups
 const waterRaw = localStorage.getItem(getUserStorageKey(`leanverse_water_cups_${today}`));
 if (waterRaw) {
 setWaterCups(parseInt(waterRaw, 10));
      }
      
      // Load Target Weight
      const targetRaw = localStorage.getItem(getUserStorageKey('leanverse_target_weight'));
      if (targetRaw) {
        setTargetWeight(parseFloat(targetRaw));
      }
    } catch (e) {
      // ignore
    }
 }, []);

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightInput) {
      const val = parseFloat(weightInput);
      if (!isNaN(val)) {
        setLoggedWeight((prev) => [...prev.slice(1), val]);
        setWeightInput('');
      }
    }
  };

  const handleSetTargetWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetWeightInput) {
      const val = parseFloat(targetWeightInput);
      if (!isNaN(val)) {
        setTargetWeight(val);
        setTargetWeightInput('');
        try {
          localStorage.setItem(getUserStorageKey('leanverse_target_weight'), String(val));
        } catch(e) {}
      }
    }
  };

 const incrementWater = () => {
 setWaterCups((prev) => {
 const next = Math.min(prev + 1, 8);
 try {
 const today = formatLocalDate();
 localStorage.setItem(getUserStorageKey(`leanverse_water_cups_${today}`), String(next));
 } catch (e) {}
 return next;
 });
 };

 const decrementWater = () => {
 setWaterCups((prev) => {
 const next = Math.max(prev - 1, 0);
 try {
 const today = formatLocalDate();
 localStorage.setItem(getUserStorageKey(`leanverse_water_cups_${today}`), String(next));
 } catch (e) {}
 return next;
 });
 };

  // SVG Chart rendering dimensions
  const chartHeight = 100;
  const chartWidth = 350;
  const padding = 15;
  const allChartWeights = [...loggedWeight];
  if (targetWeight !== null) allChartWeights.push(targetWeight);
  const maxWeight = Math.max(...allChartWeights) + 1;
  const minWeight = Math.min(...allChartWeights) - 1;

  const points = loggedWeight.map((w, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (loggedWeight.length - 1);
    const y = chartHeight - padding - ((w - minWeight) * (chartHeight - padding * 2)) / (maxWeight - minWeight);
    return { x, y, val: w };
  });

  const pathD = points.reduce((acc, curr, index) => {
    return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  let targetY: number | null = null;
  if (targetWeight !== null) {
    targetY = chartHeight - padding - ((targetWeight - minWeight) * (chartHeight - padding * 2)) / (maxWeight - minWeight);
  }

  let weightProgressPct = 0;
  if (targetWeight !== null && loggedWeight.length > 0) {
    const startW = loggedWeight[0];
    const currentW = loggedWeight[loggedWeight.length - 1];
    const totalDiff = Math.abs(startW - targetWeight);
    const currentDiff = Math.abs(startW - currentW);
    const isCutting = targetWeight < startW;
    const movingRightDir = isCutting ? currentW <= startW : currentW >= startW;
    
    if (totalDiff > 0 && movingRightDir) {
      weightProgressPct = Math.min(100, Math.max(0, (currentDiff / totalDiff) * 100));
    }
  }

 // Static list of possible badges
 const badgeDatabase = [
 { name: 'New Joiner', desc: 'Registered your accounts.', unlocked: true },
 { name: 'Consistent Logger', desc: 'Sustained 5 days streak.', unlocked: user ? user.streak >= 5 : false },
 { name: 'Streak Champion', desc: 'Sustained 10 days streak.', unlocked: user ? user.streak >= 10 : false },
 { name: 'Hydration Master', desc: 'Completed daily water cups goal.', unlocked: waterCups >= 8 },
 ];

 const handleClearData = () => {
 if (window.confirm("Are you sure you want to clear all your local LeanVerse data? This cannot be undone.")) {
 const currentUserId = getUserId();
 for (let i = 0; i < localStorage.length; i++) {
 const key = localStorage.key(i);
 if (key && key.startsWith('leanverse_') && key.endsWith(`_${currentUserId}`)) {
 localStorage.removeItem(key);
 }
 }
 window.location.reload();
 }
 };

 const handleExportData = () => {
 const data: Record<string, string> = {};
 const currentUserId = getUserId();
 for (let i = 0; i < localStorage.length; i++) {
 const key = localStorage.key(i);
 if (key && key.startsWith('leanverse_') && key.endsWith(`_${currentUserId}`)) {
 data[key] = localStorage.getItem(key) || '';
 }
 }
 const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `leanverse_data_export_${new Date().toISOString().split('T')[0]}.json`;
 a.click();
 URL.revokeObjectURL(url);
 };

 const fileInputRef = React.useRef<HTMLInputElement>(null);
 const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 const reader = new FileReader();
 reader.onload = (event) => {
 try {
 const data = JSON.parse(event.target?.result as string);
 const currentUserId = getUserId();
 const knownBaseKeys = ['leanverse_workouts_db', 'leanverse_diet_plan', 'leanverse_workout_tracker', 'leanverse_custom_foods'];
 
 Object.keys(data).forEach((key) => {
 if (!key.startsWith('leanverse_')) return;
 let newKey = key;
 // Upgrade old un-namespaced keys to the current user's namespace
 if (knownBaseKeys.includes(key)) {
 newKey = `${key}_${currentUserId}`;
 }
 localStorage.setItem(newKey, data[key]);
 });
 alert('Data imported successfully! Reloading...');
 window.location.reload();
 } catch (err) {
 alert("Failed to parse JSON backup.");
 }
 };
 reader.readAsText(file);
 if (fileInputRef.current) fileInputRef.current.value = '';
 };


 if (!user) {
 return (
 <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
 <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
 <Trophy className="w-8 h-8" />
 </div>
 <h2 className="text-xl font-black text-foreground">Welcome to LeanVerse Dashboard</h2>
 <p className="text-sm text-muted">Sign in to initialize calorie logs, achievements, weight curves, and custom diet splits.</p>
 <Link href="/login" className="inline-block py-3 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-md">Get Started / Log In</Link>
 </div>
 );
 }

 return (
 <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
  {/* Milestone Popup */}
  <StreakMilestonePopup />
 {/* Welcome banner */}
 <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-colors duration-1000 bg-gradient-to-br ${bgClass || 'from-emerald-500/5 to-cyan-500/5 border-emerald-500/20'}`}>
 <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full blur-2xl -z-10" />

 <div className="flex items-center space-x-4">
 <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg font-black text-xl">
 {user.name.charAt(0).toUpperCase()}
 </div>
 <div>
 <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center">
 {greeting ? `${greeting}, ${user.name}!` : `Welcome back, ${user.name}!`}
 <Sparkles className="w-5 h-5 ml-1.5 text-amber-400 animate-bounce" />
 </h1>
 <p className="text-xs text-muted mt-0.5">
 Account status: <span className="font-extrabold uppercase text-emerald-500">{user.tier} membership</span>
 </p>
 </div>
 </div>

 <div className="flex items-center space-x-3.5">
 {/* Active streak */}
 <div className="flex items-center space-x-1 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs shadow-sm">
 <Flame className="w-4 h-4 fill-current animate-pulse" />
 <span>{user.streak} Days Streak</span>
 </div>
 {/* Dashboard badge count */}
 <div className="flex items-center space-x-1 px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-bold text-xs shadow-sm">
 <Trophy className="w-4 h-4 fill-current" />
 <span>{badgeDatabase.filter((b) => b.unlocked).length} Badges</span>
 </div>
 </div>
 </div>
  {/* Streak Card - compact */}
  <WorkoutStreakCard compact weeklyGoal={4} />

  {/* Weekly Workout Tracker */}
  <WeeklyWorkoutTracker weeklyGoal={4} />


  {/* Grid trackers */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

 {/* Diet Completion Chart */}
 <div className="glass rounded-3xl p-6 border border-border/10 flex flex-col justify-between items-center text-center group hover:border-emerald-500/20 transition-all shadow-sm">
 <div className="flex items-center space-x-1.5 mb-2 w-full justify-center">
 <Apple className="w-4 h-4 text-emerald-500" />
 <span className="text-xs font-black text-muted uppercase tracking-widest">Today Eat Progress</span>
 </div>
 
 <div className="w-full flex justify-center scale-90 -my-2 transform origin-center">
 <MacroRings
 protein={eatenMacros.protein}
 carbs={eatenMacros.carbs}
 fats={eatenMacros.fats}
 calories={caloriesLogged}
 proteinTarget={targetMacros.protein}
 carbsTarget={targetMacros.carbs}
 fatsTarget={targetMacros.fats}
 calsTarget={activeCalorieGoal}
 />
 </div>
 </div>

 {/* Water logger fluid */}
 <div className="glass rounded-3xl p-6 border border-border/10 flex flex-col justify-between">
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center space-x-2">
 <Droplet className="w-5 h-5 text-cyan-500" />
 <span className="text-xs font-black text-muted uppercase tracking-widest">Daily Water log</span>
 </div>
 <span className="text-xs font-bold text-muted">{waterCups} / 8 Cups</span>
 </div>

 <div className="space-y-4">
 <div className="grid grid-cols-8 gap-1 p-1 bg-secondary/40 dark:bg-card/5 rounded-xl border border-border/5">
 {[...Array(8)].map((_, i) => (
 <div 
 key={i} 
 className={`h-5 rounded-md ${
 i < waterCups ? 'bg-cyan-500 shadow-sm' : 'bg-slate-300/40 dark:bg-card/5'
 }`} 
 />
 ))}
 </div>

 <div className="flex gap-2">
 <button
 onClick={decrementWater}
 className="w-10 py-2 bg-secondary/50 dark:bg-card/5 hover:bg-slate-300/50 dark:hover:bg-card/10 text-muted font-bold rounded-xl flex items-center justify-center cursor-pointer"
 title="Remove Cup"
 >
 <span className="text-sm font-black">-</span>
 </button>
 <button
 onClick={incrementWater}
 disabled={waterCups >= 8}
 className={`flex-1 py-2 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all ${waterCups >= 8 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 cursor-pointer'}`}
 >
 {waterCups >= 8 ? (
 <>
 <Trophy className="w-3.5 h-3.5" />
 <span>Goal Completed!</span>
 </>
 ) : (
 <>
 <Plus className="w-3.5 h-3.5" />
 <span>Log Water Cup (250ml)</span>
 </>
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Weight Tracker Graph */}
 <div className="glass rounded-3xl p-6 border border-border/10 flex flex-col justify-between group hover:border-emerald-500/20 transition-all shadow-sm">
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center space-x-2">
 <Scale className="w-5 h-5 text-cyan-500 animate-pulse" />
 <span className="text-xs font-black text-muted uppercase tracking-widest">Weight Goal</span>
 </div>
 
 {targetWeight !== null && (
 <div className="flex items-center space-x-2">
 <div className="text-right">
 <span className="text-xs font-bold text-muted block leading-tight">Target: {targetWeight}kg</span>
 <span className="text-[10px] font-black text-emerald-500">{weightProgressPct.toFixed(0)}%</span>
 </div>
 {/* Mini Radial Ring */}
 <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
 <svg className="w-full h-full transform -rotate-90">
 <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200 dark:text-card/40" />
 <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" 
 strokeDasharray={2 * Math.PI * 14} 
 strokeDashoffset={(2 * Math.PI * 14) - (weightProgressPct / 100) * (2 * Math.PI * 14)} 
 strokeLinecap="round"
 className="text-emerald-500 transition-all duration-1000 ease-out" 
 />
 </svg>
 </div>
 </div>
 )}
 </div>

 <div className="space-y-4">
 {/* Mini SVG graph */}
 <div className="w-full h-16 flex items-end relative">
 <svg className="w-full h-full">
 {/* Target Line */}
 {targetY !== null && (
 <line x1={0} y1={targetY} x2={chartWidth} y2={targetY} stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
 )}
 {/* Underline area gradient */}
 <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
 {/* Dots */}
 {points.map((p, i) => (
 <circle key={i} cx={p.x} cy={p.y} r="3" fill={i === points.length - 1 ? "#10b981" : "#06b6d4"} />
 ))}
 </svg>
 </div>

 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-muted">Current: <span className="text-foreground font-black">{loggedWeight[loggedWeight.length - 1]} kg</span></span>
 </div>

 {/* Inputs */}
 {targetWeight === null ? (
 <form onSubmit={handleSetTargetWeight} className="flex space-x-2">
 <input
 type="text"
 inputMode="decimal"
 maxLength={5}
 placeholder="Set Target kg"
 value={targetWeightInput}
 onChange={(e) => setTargetWeightInput(e.target.value)}
 className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-bold text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-500/50"
 />
 <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 px-3.5 cursor-pointer font-bold text-xs flex items-center">
 Set
 </button>
 </form>
 ) : (
 <form onSubmit={handleLogWeight} className="flex space-x-2">
 <input
 type="text"
 inputMode="decimal"
 maxLength={5}
 placeholder="Log Weight kg"
 value={weightInput}
 onChange={(e) => setWeightInput(e.target.value)}
 className="flex-1 bg-secondary/50 dark:bg-card/5 border border-slate-350/20 dark:border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-bold text-foreground dark:text-slate-150"
 />
 <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl py-2 px-3.5 cursor-pointer font-bold text-xs flex items-center">
 <Plus className="w-3.5 h-3.5" />
 </button>
 </form>
 )}
 </div>
 </div>
 </div>


 {/* Personal Records Section */}
 <div className="glass rounded-3xl p-6 md:p-8 border border-border/10">
 <div className="flex items-center justify-between border-b border-border/10 pb-4 mb-6">
 <div className="flex items-center space-x-2">
 <Target className="w-5 h-5 text-rose-500" />
 <h3 className="font-extrabold text-foreground text-base">Personal Records</h3>
 </div>
 <Link href="/personal-records" className="text-xs font-bold text-muted hover:text-rose-500 transition-colors flex items-center">
 View All <ChevronRight className="w-4 h-4 ml-1" />
 </Link>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { exercise: 'Bench Press', weight: '100 kg', date: '2 days ago', improvement: '+2.5kg' },
 { exercise: 'Squat', weight: '140 kg', date: '1 week ago', improvement: '+5kg' },
 { exercise: 'Deadlift', weight: '160 kg', date: '3 weeks ago', improvement: '+10kg' },
 { exercise: 'Overhead Press', weight: '65 kg', date: '1 month ago', improvement: '+2.5kg' },
 ].map((pr) => (
 <div key={pr.exercise} className="bg-secondary/30 dark:bg-card/5 border border-border/50 dark:border-border rounded-2xl p-4 flex flex-col hover:bg-secondary/50 dark:hover:bg-card/10 transition-all cursor-default">
 <span className="text-xs font-bold text-muted mb-1">{pr.exercise}</span>
 <div className="flex items-end justify-between mt-auto">
 <span className="text-lg font-black text-foreground">{pr.weight}</span>
 <div className="flex flex-col items-end">
 <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md mb-1">{pr.improvement}</span>
 <span className="text-[9px] text-muted font-semibold">{pr.date}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Saved Blueprints & Badges section */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-8">


 {/* Achievements list */}
 <div className="md:col-span-5 glass rounded-3xl p-6 border border-border/10 space-y-6">
 <div className="flex items-center space-x-2 border-b border-border/10 pb-4">
 <Trophy className="w-5 h-5 text-amber-500" />
 <h3 className="font-extrabold text-slate-850 dark:text-foreground text-base">Achieved Badge Closet</h3>
 </div>

 <div className="grid grid-cols-2 gap-3">
 {badgeDatabase.map((badge) => (
 <div 
 key={badge.name} 
 className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
 badge.unlocked 
 ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' 
 : 'border-border/10 bg-secondary/10 text-muted opacity-40'
 }`}
 >
 <Trophy className="w-6 h-6 mx-auto mb-1 shrink-0" />
 <span className="text-xs font-black block">{badge.name}</span>
 <span className="text-[9px] block leading-tight font-bold text-muted">{badge.desc}</span>
 </div>
 ))}
 </div>
 </div>
 </div>


 {/* Discover & Upgrade Section */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Blog Section */}
 <div className="glass rounded-3xl p-6 md:p-8 border border-border/10 flex flex-col justify-between group hover:border-emerald-500/20 transition-all shadow-sm relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:to-cyan-500/10">
 <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
 <div className="flex items-center space-x-4 mb-4 relative z-10">
 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
 <Newspaper className="w-6 h-6" />
 </div>
 <div>
 <h3 className="font-black text-foreground text-lg">Fitness Insights & Blog</h3>
 <span className="text-xs font-bold text-muted block mt-0.5">Learn, grow, adapt</span>
 </div>
 </div>
 <p className="text-sm font-medium text-muted mb-6 relative z-10">Dive into evidence-based articles, workout strategies, and nutrition tips to accelerate your lean journey.</p>
 <Link href="/blog" className="mt-auto block w-full py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white text-center font-bold transition-all shadow-sm border border-emerald-500/20">
 Read the Blog
 </Link>
 </div>

 {/* Pricing Section */}
 <div className="glass rounded-3xl p-6 md:p-8 border border-border/10 flex flex-col justify-between group hover:border-amber-500/20 transition-all shadow-sm relative overflow-hidden bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10">
 <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
 <div className="flex items-center space-x-4 mb-4 relative z-10">
 <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
 <Gem className="w-6 h-6" />
 </div>
 <div>
 <h3 className="font-black text-foreground text-lg">Unlock Premium Features</h3>
 <span className="text-xs font-bold text-muted block mt-0.5">Take your training to the max</span>
 </div>
 </div>
 <p className="text-sm font-medium text-muted mb-6 relative z-10">Get VIP access to personalized AI blueprints, unlimited diet generation, and advanced analytics tracking.</p>
 <Link href="/pricing" className="mt-auto block w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-center font-bold transition-all shadow-lg shadow-amber-500/20 scale-100 hover:scale-[1.02] active:scale-[0.98]">
 View Plans
 </Link>
 </div>
 </div>

 </div>
 );
}
