'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { 
  Flame, Trophy, Apple, Dumbbell, Droplet, Scale, Sparkles, 
  Plus, CheckCircle2, ChevronRight, LayoutDashboard, Bookmark, Target, Search
} from 'lucide-react';
import Link from 'next/link';
import { getTodayWorkoutSummary } from '@/lib/gamification';
import { getUserStorageKey, getUserId } from '@/lib/storage';
import MacroRings from '@/components/shared/MacroRings';
export default function UserDashboard() {
  const { user, updateUserSession } = useAuth();
  
  // Local state for dashboard logging metrics
  const [weightInput, setWeightInput] = useState('');
  const [waterCups, setWaterCups] = useState(4);
  const [loggedWeight, setLoggedWeight] = useState([74.5, 74.0, 73.6, 73.1, 72.8]);
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

  // Macro Search State
  const [macroQuery, setMacroQuery] = useState('');
  const [macroLoading, setMacroLoading] = useState(false);
  const [macroError, setMacroError] = useState('');
  const [macroResult, setMacroResult] = useState<{ calories: number; protein: number; carbs: number; fats: number; fiber: number; ingredients: string[] } | null>(null);

  const [macroLogged, setMacroLogged] = useState(false);

  const searchMacros = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macroQuery.trim()) return;
    
    setMacroLoading(true);
    setMacroError('');
    setMacroResult(null);
    setMacroLogged(false);

    try {
      const res = await fetch(`/api/food-search?q=${encodeURIComponent(macroQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch macros');
      setMacroResult(data);
    } catch (err: any) {
      setMacroError(err.message);
    } finally {
      setMacroLoading(false);
    }
  };

  const logMacrosToTracker = () => {
    if (!macroResult) return;
    const today = new Date().toISOString().split('T')[0];

    // Update calories in localStorage (additive)
    const prevCalsRaw = localStorage.getItem(getUserStorageKey(`leanverse_quick_cals_${today}`));
    const prevCals = prevCalsRaw ? parseInt(prevCalsRaw, 10) : 0;
    const newCals = prevCals + macroResult.calories;
    localStorage.setItem(getUserStorageKey(`leanverse_quick_cals_${today}`), String(newCals));

    // Update macros in localStorage (additive)
    const prevMacrosRaw = localStorage.getItem(getUserStorageKey(`leanverse_eaten_macros_${today}`));
    const prevMacros = prevMacrosRaw ? JSON.parse(prevMacrosRaw) : { protein: 0, carbs: 0, fats: 0 };
    const newMacros = {
      protein: (prevMacros.protein || 0) + macroResult.protein,
      carbs:   (prevMacros.carbs   || 0) + macroResult.carbs,
      fats:    (prevMacros.fats    || 0) + macroResult.fats,
    };
    localStorage.setItem(getUserStorageKey(`leanverse_eaten_macros_${today}`), JSON.stringify(newMacros));

    // Update live UI state instantly
    setCaloriesLogged(prev => prev + macroResult.calories);
    setEatenMacros(newMacros);
    setMacroLogged(true);
  };

  React.useEffect(() => {
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

      // Load Workouts DB
      const workoutsRaw = localStorage.getItem(getUserStorageKey('leanverse_workouts_db'));
      if (workoutsRaw) {
        const db = JSON.parse(workoutsRaw);
        const dates = Object.keys(db).sort((a, b) => b.localeCompare(a));
        if (dates.length > 0) {
          const last = db[dates[0]];
          setHasWorkout(true);
          setLastWorkoutName(last.name || 'Custom Workout');
          setLastWorkoutDetails(`${last.exercises?.length || 0} exercises • ${dates[0]}`);
        }
      }

      // Load Today Workout Progress
      const summary = getTodayWorkoutSummary();
      setWorkoutProgress({ completed: summary.completedSets, total: summary.totalSets });

      // Load Today Diet Eaten Cals & Macros
      const today = new Date().toISOString().split('T')[0];
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
        alert('Weight logged successfully!');
      }
    }
  };

  const incrementWater = () => {
    setWaterCups((prev) => prev + 1);
  };

  // SVG Chart rendering dimensions
  const chartHeight = 100;
  const chartWidth = 350;
  const padding = 15;
  const points = loggedWeight.map((w, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (loggedWeight.length - 1);
    const maxWeight = 76;
    const minWeight = 71;
    const y = chartHeight - padding - ((w - minWeight) * (chartHeight - padding * 2)) / (maxWeight - minWeight);
    return { x, y, val: w };
  });

  const pathD = points.reduce((acc, curr, index) => {
    return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

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
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Welcome to LeanVerse Dashboard</h2>
        <p className="text-sm text-slate-500">Sign in to initialize calorie logs, achievements, weight curves, and custom diet splits.</p>
        <Link href="/login" className="inline-block py-3 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-md">Get Started / Log In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10" />

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg font-black text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center">
              Welcome back, {user.name}!
              <Sparkles className="w-5 h-5 ml-1.5 text-amber-400 animate-bounce" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400 mt-0.5">
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

      {/* Grid trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Diet Completion Chart */}
        <div className="glass rounded-3xl p-6 border border-slate-200/10 flex flex-col justify-between items-center text-center group hover:border-emerald-500/20 transition-all shadow-sm">
          <div className="flex items-center space-x-1.5 mb-2 w-full justify-center">
            <Apple className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Today Eat Progress</span>
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

        {/* Workout Completion Chart */}
        <div className="glass rounded-3xl p-6 border border-slate-200/10 flex flex-col justify-between items-center text-center group hover:border-cyan-500/20 transition-all shadow-sm">
          <div className="flex items-center space-x-1.5 mb-4 w-full justify-center">
            <Dumbbell className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Workout Progress</span>
          </div>
          
          <div className="relative flex items-center justify-center mb-4">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-white/5" />
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray={2 * Math.PI * 48} 
                strokeDashoffset={(2 * Math.PI * 48) - (workoutProgress.total > 0 ? (workoutProgress.completed / workoutProgress.total) : 0) * (2 * Math.PI * 48)} 
                strokeLinecap="round"
                className="text-cyan-500 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                {workoutProgress.total > 0 ? Math.round((workoutProgress.completed / workoutProgress.total) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div className="w-full">
            <span className="text-xs font-bold text-slate-500 mb-2 block">{workoutProgress.completed} / {workoutProgress.total || 0} Sets Done</span>
            <Link href="/workout-tracker" className="block w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl py-2 font-bold text-xs transition-colors cursor-pointer">
              Open Tracker
            </Link>
          </div>
        </div>

        {/* Water logger fluid */}
        <div className="glass rounded-3xl p-6 border border-slate-200/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-cyan-500" />
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Daily Water log</span>
            </div>
            <span className="text-xs font-bold text-slate-500">{waterCups} / 8 Cups</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-1 p-1 bg-slate-200/40 dark:bg-white/5 rounded-xl border border-slate-300/5">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-5 rounded-md ${
                    i < waterCups ? 'bg-cyan-500 shadow-sm' : 'bg-slate-300/40 dark:bg-white/5'
                  }`} 
                />
              ))}
            </div>

            <button
              onClick={incrementWater}
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Water Cup (250ml)</span>
            </button>
          </div>
        </div>

        {/* Weight Tracker Graph */}
        <div className="glass rounded-3xl p-6 border border-slate-200/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-cyan-500 animate-pulse" />
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Weight scale log</span>
            </div>
            <span className="text-xs font-bold text-slate-500">Current: {loggedWeight[loggedWeight.length - 1]} kg</span>
          </div>

          <div className="space-y-4">
            {/* Mini SVG graph */}
            <div className="w-full h-16 flex items-end">
              <svg className="w-full h-full">
                {/* Underline area gradient */}
                <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots */}
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10b981" />
                ))}
              </svg>
            </div>

            {/* Quick Weight logger */}
            <form onSubmit={handleLogWeight} className="flex space-x-2">
              <input
                type="text"
                placeholder="Log Weight kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 bg-slate-100/50 dark:bg-white/5 border border-slate-350/20 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-bold text-slate-800 dark:text-slate-150"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl py-2 px-3.5 cursor-pointer font-bold text-xs flex items-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>


      {/* Macro Search Widget */}
      <div className="glass rounded-3xl p-6 border border-slate-200/10 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10" />
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base">AI Macro Search</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-lg leading-relaxed">
          Powered by Edamam Natural Language AI. Type any food or meal (e.g., "1 large chicken shawarma and a diet coke") to instantly calculate its macronutrient profile.
        </p>

        <form onSubmit={searchMacros} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="E.g., 2 slices pepperoni pizza"
              value={macroQuery}
              onChange={(e) => setMacroQuery(e.target.value)}
              className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-350/20 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-bold text-slate-800 dark:text-slate-150 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={macroLoading || !macroQuery.trim()}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white rounded-2xl py-3.5 px-6 font-black text-sm flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {macroLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </span>
            ) : (
              'Analyze Food'
            )}
          </button>
        </form>

        {macroError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold mb-4">
            {macroError}
          </div>
        )}

        {macroResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Calories</span>
                <span className="text-2xl font-black text-emerald-500">{macroResult.calories}</span>
              </div>
              <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Protein</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">{macroResult.protein}g</span>
              </div>
              <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Carbs</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">{macroResult.carbs}g</span>
              </div>
              <div className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fats</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">{macroResult.fats}g</span>
              </div>
            </div>
            
            {macroResult.ingredients && macroResult.ingredients.length > 0 && (
              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Detected Items</span>
                <div className="flex flex-wrap gap-1.5">
                  {macroResult.ingredients.map((ing, i) => (
                    <span key={i} className="px-2 py-1 bg-white dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              onClick={logMacrosToTracker}
              disabled={macroLogged}
              className={`w-full py-3 text-xs font-black rounded-xl transition-all mt-2 ${
                macroLogged
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 cursor-pointer active:scale-95'
              }`}
            >
              {macroLogged ? '✅ Logged! Check Calorie Ring Above ↑' : '+ Log to Today\'s Tracker'}
            </button>
          </div>
        )}
      </div>

      {/* Saved Blueprints & Badges section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Saved blueprints list */}
        <div className="md:col-span-7 glass rounded-3xl p-6 border border-slate-200/10 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-4">
            <Bookmark className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base">Active Saved Blueprints</h3>
          </div>

          <div className="space-y-4">
            {hasDietPlan ? (
              <div className="p-4 bg-slate-100/40 dark:bg-white/5 border border-slate-300/5 rounded-2xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Apple className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-slate-800 dark:text-slate-100 text-sm block">{dietPlanTitle}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mt-0.5">{dietPlanDetails}</span>
                  </div>
                </div>
                <Link href="/diet-planner" className="p-2 bg-slate-200/50 dark:bg-white/5 group-hover:bg-emerald-500/10 rounded-xl group-hover:text-emerald-500 transition-all text-slate-500 dark:text-slate-400">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <Link href="/diet-planner" className="p-6 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col items-center justify-center text-center transition-all group cursor-pointer shadow-sm">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                  <Apple className="w-6 h-6" />
                </div>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">Generate Diet Blueprint</span>
                <span className="text-xs font-bold text-slate-500 mt-1">Setup your personalized meal splits</span>
              </Link>
            )}

            {hasWorkout ? (
              <div className="p-4 bg-slate-100/40 dark:bg-white/5 border border-slate-300/5 rounded-2xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-black text-slate-800 dark:text-slate-100 text-sm block">{lastWorkoutName}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mt-0.5">{lastWorkoutDetails}</span>
                  </div>
                </div>
                <Link href="/workout-tracker" className="p-2 bg-slate-200/50 dark:bg-white/5 group-hover:bg-cyan-500/10 rounded-xl group-hover:text-cyan-500 transition-all text-slate-500 dark:text-slate-400">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <Link href="/workout-planner" className="p-6 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 rounded-3xl flex flex-col items-center justify-center text-center transition-all group cursor-pointer shadow-sm">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 mb-3 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="font-black text-cyan-600 dark:text-cyan-400 text-sm">Create Workout Split</span>
                <span className="text-xs font-bold text-slate-500 mt-1">Design your structural muscle plan</span>
              </Link>
            )}
          </div>
        </div>

        {/* Achievements list */}
        <div className="md:col-span-5 glass rounded-3xl p-6 border border-slate-200/10 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base">Achieved Badge Closet</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badgeDatabase.map((badge) => (
              <div 
                key={badge.name} 
                className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                  badge.unlocked 
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' 
                    : 'border-slate-300/10 bg-slate-100/10 text-slate-500 dark:text-slate-400 opacity-40'
                }`}
              >
                <Trophy className="w-6 h-6 mx-auto mb-1 shrink-0" />
                <span className="text-xs font-black block">{badge.name}</span>
                <span className="text-[9px] block leading-tight font-bold text-slate-500 dark:text-slate-500 dark:text-slate-400">{badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local Data Management */}
      <div className="glass rounded-3xl p-6 border border-slate-200/10 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-4">
          <Target className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-base">Local Data Management</h3>
        </div>
        <p className="text-xs font-bold text-slate-500">
          Manage your locally saved plans, diets, and workouts.
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleExportData} className="px-4 py-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white font-bold rounded-xl text-xs transition-all border border-indigo-500/20">
            Export Data (JSON)
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImportData} 
            className="hidden" 
          />
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white font-bold rounded-xl text-xs transition-all border border-indigo-500/20">
            Import Data
          </button>
          <button onClick={handleClearData} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-bold rounded-xl text-xs transition-all border border-red-500/20">
            Clear Local Data
          </button>
        </div>
      </div>
    </div>
  );
}
