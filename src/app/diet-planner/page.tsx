'use client';

import React, { useState, useEffect } from 'react';
import { Apple, AlertTriangle, Printer, TrendingDown, TrendingUp, Scale, UtensilsCrossed, Target, Info, Flame, Droplets, RefreshCw, CheckCircle2, ChevronRight, ChevronLeft, CalendarDays, Camera, Copy, Check, Share2, MessageCircle, User, Search, Plus, X, Activity, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import MacroRings from '@/components/shared/MacroRings';
import { getUserStorageKey, formatLocalDate } from '@/lib/storage';



const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', mult: 1.2 },
  { id: 'light', label: 'Lightly Active', desc: '1-3 workouts/week', mult: 1.375 },
  { id: 'moderate', label: 'Moderately Active', desc: '3-5 workouts/week', mult: 1.55 },
  { id: 'active', label: 'Very Active', desc: '6-7 workouts/week', mult: 1.725 },
  { id: 'athlete', label: 'Athlete', desc: 'Intense training', mult: 1.9 },
];

const GOALS = [
  { id: 'fat_loss', label: 'Fat Loss', desc: 'Burn body fat while preserving muscle', icon: TrendingDown },
  { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Build lean muscle mass', icon: TrendingUp },
  { id: 'recomp', label: 'Body Recomposition', desc: 'Lose fat & gain muscle simultaneously', icon: Activity },
  { id: 'maintenance', label: 'Maintenance', desc: 'Maintain current weight and stay healthy', icon: Scale },
];

const TIMELINES = [
  { id: 30, label: '30 Days' },
  { id: 60, label: '60 Days' },
  { id: 90, label: '90 Days' },
  { id: 120, label: '120 Days' },
  { id: 180, label: '180 Days' },
];

const DIET_STYLES = [
  'Vegetarian', 'Non-Vegetarian'
];

const FOOD_PREFS = [
  {
    category: 'Protein Sources',
    items: ['Chicken', 'Eggs', 'Fish', 'Paneer', 'Tofu', 'Whey Protein', 'Soya Chunks', 'Lentils/Dal']
  },
  {
    category: 'Carbohydrates',
    items: ['Rice', 'Brown Rice', 'Oats', 'Roti', 'Dosa', 'Idli', 'Sweet Potato', 'Quinoa']
  },
  {
    category: 'Fats',
    items: ['Peanut Butter', 'Almonds', 'Cashews', 'Olive Oil', 'Ghee', 'Avocado']
  },
  {
    category: 'Fruits & Vegetables',
    items: ['Banana', 'Apple', 'Orange', 'Watermelon', 'Broccoli', 'Spinach', 'Beans', 'Carrot']
  }
];

const BUDGETS = ['Budget Friendly', 'Moderate', 'Premium'];
const MEALS = [3, 4, 5, 6];
const WORKOUT_TYPES = ['Gym', 'Home Workout', 'No Workout'];
const WORKOUT_DAYS = [0, 3, 4, 5, 6, 7];


const BarcodeScanner = dynamic(() => import('@/components/shared/BarcodeScanner'), { ssr: false });
interface FoodItem {
  name: string;
  qty: string;
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  alternative: string;
}

export default function AIDietPlanner() {
  const [isMounted, setIsMounted] = useState(false);
  const [isStateLoaded, setIsStateLoaded] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('leanverse_diet_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.age) setAge(parsed.age);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.height) setHeight(parsed.height);
        if (parsed.weight) setWeight(parsed.weight);
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.activity) setActivity(parsed.activity);
        if (parsed.dietStyles) setDietStyles(parsed.dietStyles);
      }
    } catch {}
    setIsMounted(true);
  }, []);

  // Input states
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | string>(25);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState<number | string>(170); // cm
  const [weight, setWeight] = useState<number | string>(70); // kg
  const [goal, setGoal] = useState('fatloss');
  const [activity, setActivity] = useState('moderate');
  const [budget, setBudget] = useState('medium');
  const [timeline, setTimeline] = useState(90);
  const [dietStyles, setDietStyles] = useState<string[]>([]);
  const [foodPref, setFoodPref] = useState('vegetarian');
  const [allergies, setAllergies] = useState('');

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      sessionStorage.setItem('leanverse_diet_state', JSON.stringify({
        step, age, gender, height, weight, goal, activity, dietStyles
      }));
    } catch {}
  }, [isMounted, step, age, gender, height, weight, goal, activity, dietStyles]);
  
  // Selected ingredients at home
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [searchFood, setSearchFood] = useState('');

  // Hot-patch legacy snack items in memory (prevents requiring a page refresh)
  useEffect(() => {
    if (selectedFoods.some(f => f.includes('|snack'))) {
      setSelectedFoods(prev => Array.from(new Set(prev.map(f => typeof f === 'string' ? f.replace(/\|snack$/, '|pre-workout') : f))));
      
      setCustomQty(prev => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(next)) {
          if (k.endsWith('|snack')) {
            next[k.replace(/\|snack$/, '|pre-workout')] = v;
            delete next[k];
          }
        }
        return next;
      });

      setEatenMeals(prev => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(next)) {
          if (k.endsWith('|snack')) {
            next[k.replace(/\|snack$/, '|pre-workout')] = v;
            delete next[k];
          }
        }
        return next;
      });
    }
  }, [selectedFoods]);
  
  // Ingredient warnings / stats
  const [homeFoodCals, setHomeFoodCals] = useState(0);
  const [homeFoodProtein, setHomeFoodProtein] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [proteinTip, setProteinTip] = useState('');

  // Generated Plan State
  const [planGenerated, setPlanGenerated] = useState(false);
  const [premiumPlans, setPremiumPlans] = useState<any[]>([]);
  const [planSelectionMode, setPlanSelectionMode] = useState<'ai' | 'premium' | null>(null);
  const [generating, setGenerating] = useState(false);

  // ΓöÇΓöÇ Macro Search State ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  const [macroQuery, setMacroQuery] = useState('');
  const [macroLoading, setMacroLoading] = useState(false);
  const [macroError, setMacroError] = useState('');
  const [macroResult, setMacroResult] = useState<{
    calories: number; protein: number; carbs: number; fats: number;
    ingredients: string[];
  } | null>(null);
  const [macroAddedKey, setMacroAddedKey] = useState('');

  const searchMacros = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macroQuery.trim()) return;
    setMacroLoading(true);
    setMacroError('');
    setMacroResult(null);
    setMacroAddedKey('');
    try {
      const res = await fetch(`/api/food-search?q=${encodeURIComponent(macroQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Food not found');
      setMacroResult(data);
    } catch (err: any) {
      setMacroError(err.message);
    } finally {
      setMacroLoading(false);
    }
  };

  const addMacroResultToPlan = (mealSlot: string) => {
    if (!macroResult) return;
    // Build a custom food key: name|mealSlot|custom
    const key = `${macroQuery.toLowerCase().trim()}|${mealSlot}|custom`;
    if (!selectedFoods.includes(key)) {
      setSelectedFoods(prev => [...prev, key]);
      setCustomQty(prev => ({ ...prev, [key]: 1 }));
    }
    setMacroAddedKey(mealSlot);
  };
  const [customQty, setCustomQty] = useState<Record<string, number>>({});
  const [mealAssignments, setMealAssignments] = useState<Record<string, string>>({});
  const [activeMealTab, setActiveMealTab] = useState('breakfast');
  
  // Date Navigation State
  const [viewDateOffset, setViewDateOffset] = useState(0);
  const getDisplayDate = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return formatLocalDate(d);
  };

  const [copiedGrocery, setCopiedGrocery] = useState(false);
  const handleCopyGrocery = async () => {
    const text = `LeanVerse Weekly Grocery List:
- Steel-cut Oats (500g)
- Lean Chicken Breast (1kg) or Low-fat Tofu
- High-Fiber brown rice (1kg)
- Organic Eggs (2 dozen)
- Broccoli, Zucchini, and Spinach (fresh)
- Whey Protein Isolate (1 tub)

Built with LeanVerse AI`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedGrocery(true);
      setTimeout(() => setCopiedGrocery(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareText = encodeURIComponent("I just built my custom AI Diet Plan on LeanVerse! ≡ƒöÑ");
  const shareWhatsapp = `https://wa.me/?text=${shareText}`;
  const shareX = `https://twitter.com/intent/tweet?text=${shareText}`;
  const getActiveDateStr = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return formatLocalDate(d);
  };
  const activeDateStr = getActiveDateStr(viewDateOffset);

  // Tracks which food items have been eaten (checked off) for the active date
  
  // Safe math bounds to prevent NaN or crashes if DOM validation is bypassed
  const safeWeight = Math.max(30, Number(weight) || 30);
  const safeHeight = Math.max(50, Number(height) || 150);
  const safeAge = Math.max(10, Number(age) || 20);

  const bmr = Math.round(
    gender === 'male' 
      ? 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5
      : 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161
  );
  
  const actMult = ACTIVITY_LEVELS.find(a => a.id === activity)?.mult || 1.55;
  const tdee = Math.round(bmr * actMult);
  
  const bmi = (safeWeight / Math.pow(safeHeight / 100, 2)).toFixed(1);
  const bmiCategory = 
    parseFloat(bmi) < 18.5 ? 'Underweight' :
    parseFloat(bmi) < 25 ? 'Normal Weight' :
    parseFloat(bmi) < 30 ? 'Overweight' : 'Obese';

  const getTargetCalories = () => {
    if (goal === 'fat_loss') return tdee - 500;
    if (goal === 'muscle_gain') return tdee + 300;
    if (goal === 'recomp') return tdee - 200;
    return tdee;
  };

  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(getUserStorageKey(`leanverse_eaten_${activeDateStr}`));
        if (saved) {
          const parsed = JSON.parse(saved);
          const migrated: Record<string, boolean> = {};
          for (const [k, v] of Object.entries(parsed)) {
            migrated[k.replace(/\|snack$/, '|pre-workout')] = v as boolean;
          }
          return migrated;
        }
      } catch {}
    }
    return {};
  });

  const changeDate = (delta: number) => {
    const newOffset = viewDateOffset + delta;
    if (newOffset > 0) return; // Cannot go into the future
    
    const newDateStr = getActiveDateStr(newOffset);
    setViewDateOffset(newOffset);
    
    try {
      const saved = localStorage.getItem(getUserStorageKey(`leanverse_eaten_${newDateStr}`));
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated: Record<string, boolean> = {};
        for (const [k, v] of Object.entries(parsed)) {
          migrated[k.replace(/\|snack$/, '|pre-workout')] = v as boolean;
        }
        setEatenMeals(migrated);
      } else {
        setEatenMeals({});
      }
    } catch {
      setEatenMeals({});
    }
  };

  // Tracks custom macro foods added by the user
  const [customFoodsDatabase, setCustomFoodsDatabase] = useState<Record<string, { cals: number; protein: number; carbs: number; fat: number; alternative: string; warning?: string; icon: string; category: string; unit: string; baseQty: number; hidden?: boolean }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(getUserStorageKey('leanverse_custom_foods'));
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(getUserStorageKey('leanverse_custom_foods'), JSON.stringify(customFoodsDatabase));
    } catch {}
  }, [customFoodsDatabase]);

  // Barcode Scanner State
  const [showScanner, setShowScanner] = useState(false);

  const handleBarcodeScan = (decodedText: string) => {
    setShowScanner(false);
    // Mock barcode database mapping for premium demo
    const mockDb: Record<string, any> = {
      '0123456789': { cals: 190, protein: 21, carbs: 22, fat: 8, alternative: 'MusclePharm Combat Crunch', icon: '≡ƒì½', category: 'post-workout', unit: 'bar', baseQty: 1 },
      '8901030911': { cals: 100, protein: 15, carbs: 10, fat: 0, alternative: 'Chobani Zero Sugar', icon: '≡ƒÑú', category: 'breakfast', unit: 'cup', baseQty: 1 },
      'DEFAULT': { cals: 250, protein: 10, carbs: 30, fat: 10, alternative: 'Healthy Snack', icon: '≡ƒôª', category: 'pre-workout', unit: 'serving', baseQty: 1 }
    };
    
    const scannedName = mockDb[decodedText] ? (decodedText === '0123456789' ? 'Quest Protein Bar' : 'Greek Yogurt (Oikos)') : `Scanned Item (${decodedText.slice(-4)})`;
    const food = mockDb[decodedText] || mockDb['DEFAULT'];
    
    setCustomFoodsDatabase(prev => ({
      ...prev,
      [scannedName]: food
    }));
    
    setSelectedFoods(prev => {
      const entry = `${scannedName}|pre-workout`;
      if (!prev.includes(entry)) {
        return [...prev, entry];
      }
      return prev;
    });
    
    alert(`Scanned: ${scannedName}! Added to your plan.`);
  };

  // Inline custom form state
  const [showCustomForm, setShowCustomForm] = useState<string | null>(null);
  const [cfName, setCfName] = useState('');
  const [cfCals, setCfCals] = useState('');
  const [cfProtein, setCfProtein] = useState('');
  const [cfCarbs, setCfCarbs] = useState('');
  const [cfFats, setCfFats] = useState('');
  const [cfMeal, setCfMeal] = useState('lunch');

  const DIET_PLAN_KEY = getUserStorageKey('leanverse_diet_plan');

  // Restore full saved plan on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DIET_PLAN_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved !== 'object' || saved === null) return;

      if (typeof saved.age === 'number') setAge(saved.age);
      if (typeof saved.gender === 'string') setGender(saved.gender);
      if (typeof saved.height === 'number') setHeight(saved.height);
      if (typeof saved.weight === 'number') setWeight(saved.weight);
      if (typeof saved.goal === 'string') setGoal(saved.goal);
      if (typeof saved.activity === 'string') setActivity(saved.activity);
      if (typeof saved.budget === 'string') setBudget(saved.budget);
      if (typeof saved.foodPref === 'string') setFoodPref(saved.foodPref);
      if (typeof saved.allergies === 'string') setAllergies(saved.allergies);
      if (Array.isArray(saved.selectedFoods)) {
        const migratedFoods = saved.selectedFoods.map((f: any) => 
          typeof f === 'string' ? f.replace(/\|snack$/, '|pre-workout') : f
        );
        setSelectedFoods(Array.from(new Set(migratedFoods)));
      }
      if (typeof saved.customQty === 'object' && saved.customQty !== null) {
        const migratedQty: Record<string, number> = {};
        for (const [k, v] of Object.entries(saved.customQty)) {
          const newKey = k.replace(/\|snack$/, '|pre-workout');
          migratedQty[newKey] = v as number;
        }
        setCustomQty(migratedQty);
      }
      
      if (typeof saved.mealAssignments === 'object' && saved.mealAssignments !== null) {
        setMealAssignments(saved.mealAssignments);
      }
      
      if (typeof saved.step === 'number') setStep(saved.step);
      if (saved.planGenerated === true) setPlanGenerated(true);
    } catch {
      // corrupted data — start fresh
    } finally {
      setIsStateLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save logic removed. We now save instantaneously on toggleEaten.

  // Save full plan state whenever it changes
  useEffect(() => {
    if (!isStateLoaded) return;
    try {
      const toSave = { age, gender, height, weight, goal, activity, budget, foodPref, allergies, selectedFoods, customQty, mealAssignments, planGenerated, step };
      localStorage.setItem(DIET_PLAN_KEY, JSON.stringify(toSave));
    } catch {
      // quota exceeded or private mode — ignore
    }
  }, [age, gender, height, weight, goal, activity, budget, foodPref, allergies, selectedFoods, customQty, mealAssignments, planGenerated, step]);

  const toggleEaten = (item: string) => {
    setEatenMeals(prev => {
      const next = { ...prev, [item]: !prev[item] };
      try {
        localStorage.setItem(getUserStorageKey(`leanverse_eaten_${activeDateStr}`), JSON.stringify(next));
      } catch {}
      return next;
    });
  };



  const [dbFoods, setDbFoods] = useState<Record<string, any>>({});
  
  useEffect(() => {
    fetch(`/api/admin/foods?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.foods) {
          const formatted = data.foods.reduce((acc: any, f: any) => {
            acc[f.name.toLowerCase().replace(/[^a-z0-9]/g, '_')] = {
              cals: f.calories,
              protein: f.protein,
              carbs: f.carbs,
              fat: f.fat,
              alternative: 'Various',
              icon: f.emoji || '❓',
              category: f.mealTypes?.map((m: string) => m.toLowerCase().replace(' ', '-')) || ['lunch', 'dinner'],
              unit: f.servingUnit || '1 serving',
              baseQty: 1,
              dietStyles: f.dietStyle || []
            };
            return acc;
          }, {});
          setDbFoods(formatted);
        }
      }).catch(err => console.error(err));

    fetch(`/api/admin/diet-plans?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.plans) setPremiumPlans(data.plans);
      }).catch(err => console.error(err));
  }, []);

  const allFoods: any = new Proxy({ ...customFoodsDatabase, ...dbFoods }, { 
    get: (target: any, prop) => { 
      if (typeof prop === 'string' && prop in target) return target[prop]; 
      return { cals: 0, protein: 0, carbs: 0, fat: 0, baseQty: 100, category: ['unmapped'], icon: '❓', hidden: true }; 
    } 
  });

  const handleSelectPremiumPlan = (plan: any) => {
    setGenerating(true);
    const calsTarget = getDietCalorieTarget();
    const scaleFactor = plan.targetCalories > 0 ? calsTarget / plan.targetCalories : 1;
    
    const newSelectedFoods: string[] = [];
    const newCustomQty: Record<string, number> = {};
    const newMealAssignments: Record<string, string> = {};

    plan.meals.forEach((meal: any) => {
      const mealName = meal.name.toLowerCase();
      meal.foods.forEach((f: any) => {
        if (!f.foodItem) return;
        const foodBaseName = f.foodItem.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const compositeKey = `${foodBaseName}|${mealName}`;
        
        const baseQty = parseFloat(f.foodItem.servingUnit) || 100;
        const scaledTotalQty = Math.round((f.quantity * baseQty) * scaleFactor);

        if (!newSelectedFoods.includes(compositeKey)) {
          newSelectedFoods.push(compositeKey);
        }
        newCustomQty[compositeKey] = scaledTotalQty;
        newMealAssignments[compositeKey] = mealName;
      });
    });

    setSelectedFoods(newSelectedFoods);
    setCustomQty(newCustomQty);
    setEatenMeals({});
    
    setTimeout(() => {
      setGenerating(false);
      setPlanGenerated(true);
    }, 1000);
  };

  // Monitor selected ingredients and compute macro alerts
  useEffect(() => {
    let tempCals = 0;
    let tempProtein = 0;
    let warnings: string[] = [];
    let tips: string[] = [];

    selectedFoods.forEach((foodKey) => {
      const food = foodKey.split('|')[0];
      const data = allFoods[food];
      if (data) {
        tempCals += data.cals;
        tempProtein += data.protein;
        if (data.warning) {
          warnings.push(`${food.toUpperCase()}: ${data.warning}`);
        }
      }
    });

    setHomeFoodCals(tempCals);
    setHomeFoodProtein(tempProtein);

    // Alerts logic
    if (tempCals > 600) {
      warnings.unshift('CRITICAL CALORIE ALERT: Your selected raw ingredients exceed 600 kcal. Keep portion sizes monitored to prevent spilling over calorie caps.');
    }
    
    if (tempProtein < 15 && selectedFoods.length > 0) {
      tips.push('PROTEIN BOOSTER TIP: Your selected ingredients are low in protein. Consider adding Egg Whites, Chicken Breast, Lean Tofu, or Whey Protein to meet lean hypertrophy metrics.');
    } else if (tempProtein >= 25) {
      tips.push('EXCELLENT CHOICE: You have included rich protein blocks in your available foods. This ensures muscle preservation during deficit cycles.');
    }

    setWarningMessage(warnings.join(' | '));
    setProteinTip(tips.join(' | '));
  }, [selectedFoods]);

  const toggleDietStyle = (style: string) => {
    setDietStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleFood = (food: string) => {
    const compositeKey = `${food}|${activeMealTab}`;
    setSelectedFoods((prev) => {
      if (prev.includes(compositeKey)) {
        return prev.filter((f) => f !== compositeKey);
      } else {
        return [...prev, compositeKey];
      }
    });
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfName || !cfCals || !cfProtein || !cfCarbs || !cfFats) return;

    const baseFoodId = cfName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Add to custom database
    setCustomFoodsDatabase(prev => ({
      ...prev,
      [baseFoodId]: {
        cals: parseFloat(cfCals),
        protein: parseFloat(cfProtein),
        carbs: parseFloat(cfCarbs),
        fat: parseFloat(cfFats),
        alternative: 'Custom Entry',
        icon: '≡ƒì╜∩╕Å',
        category: cfMeal,
        unit: 'g',
        baseQty: 100
      }
    }));

    // Add to selected foods
    const compositeKey = `${baseFoodId}|${cfMeal}`;
    setSelectedFoods(prev => {
      if (!prev.includes(compositeKey)) {
        return [...prev, compositeKey];
      }
      return prev;
    });

    // Reset form
    setCfName('');
    setCfCals('');
    setCfProtein('');
    setCfCarbs('');
    setCfFats('');
    setShowCustomForm(null);
  };

  const handleGenerate = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    const nAge = Number(age);
    const nWeight = Number(weight);
    const nHeight = Number(height);

    if (nAge < 10 || nAge > 120) {
      alert('Please enter a valid age between 10 and 120.');
      return;
    }
    if (nWeight < 30 || nWeight > 300) {
      alert('Please enter a valid weight between 30kg and 300kg.');
      return;
    }
    if (nHeight < 100 || nHeight > 250) {
      alert('Please enter a valid height between 100cm and 250cm.');
      return;
    }

    setGenerating(true);
    setCustomQty({}); // reset custom adjustments on new generation
    setEatenMeals({}); // reset eaten state on new generation
    setTimeout(async () => {
      setGenerating(false);
      setPlanGenerated(true);
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#0ea5e9']
      });
    }, 1500);
  };

  const getDietCalorieTarget = () => {
    // Mifflin-St Jeor estimate
    let base = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + (gender === 'male' ? 5 : -161);
    const mult = activity === 'extreme' ? 1.9 : activity === 'heavy' ? 1.725 : activity === 'moderate' ? 1.55 : 1.375;
    let tdee = Math.round(base * mult);

    if (goal === 'fatloss') return tdee - 500;
    if (goal === 'leanbulk') return tdee + 250;
    if (goal === 'muscle') return tdee + 500;
    return tdee;
  };

  const calsTarget = getDietCalorieTarget();
  
  // Protein logic: use Lean Body Mass (LBM) for obese individuals to avoid dangerous protein levels
  let proteinTarget = Math.round(Number(weight) * 2.0); // Default 2g per kg
  const currentBmi = Number(weight) / Math.pow(Number(height) / 100, 2);
  if (currentBmi > 30) {
    // Estimate body fat percentage (rough formula)
    const bodyFatPct = (1.20 * currentBmi) + (0.23 * Number(age)) - (10.8 * (gender === 'male' ? 1 : 0)) - 5.4;
    const lbm = Number(weight) * (1 - (bodyFatPct / 100));
    proteinTarget = Math.round(lbm * 2.2); // 2.2g per kg of LBM
  }
  
  // Ensure protein doesn't exceed 35% of daily calories to protect renal function
  const maxProteinCals = calsTarget * 0.35;
  if (proteinTarget * 4 > maxProteinCals) {
    proteinTarget = Math.round(maxProteinCals / 4);
  }
  
  // Absolute maximum protein ceiling to prevent kidney strain in extreme obesity scenarios
  if (proteinTarget > 250) {
    proteinTarget = 250;
  }

  const fatsTarget = Math.round((calsTarget * 0.25) / 9);
  const carbsTarget = Math.max(0, Math.round((calsTarget - (proteinTarget * 4 + fatsTarget * 9)) / 4));

  // Iterative Proportional Fitting Solver for perfectly balanced macros
  const rawQtys: Record<string, number> = {};
  selectedFoods.forEach(item => rawQtys[item] = 1); // Start with 1x multiplier

  for (let iter = 0; iter < 15; iter++) {
    let curP = 0, curC = 0, curF = 0;
    selectedFoods.forEach(item => {
      const f = allFoods[item.split('|')[0]];
      curP += f.protein * rawQtys[item];
      curC += f.carbs * rawQtys[item];
      curF += f.fat * rawQtys[item];
    });

    const pRatio = proteinTarget / Math.max(1, curP);
    const cRatio = carbsTarget / Math.max(1, curC);
    const fRatio = fatsTarget / Math.max(1, curF);

    selectedFoods.forEach(item => {
      const f = allFoods[item.split('|')[0]];
      const pCals = f.protein * 4;
      const cCals = f.carbs * 4;
      const fCals = f.fat * 9;
      const max = Math.max(pCals, cCals, fCals);
      
      // Scale food based on its dominant macro's deficit/surplus
      if (max === pCals) {
         rawQtys[item] *= pRatio;
      } else if (max === fCals) {
         rawQtys[item] *= fRatio;
      } else {
         rawQtys[item] *= cRatio;
      }
    });
  }

  const getSmartDefaultQty = (item: string) => {
    const baseFood = item.split('|')[0];
    const unit = (allFoods[baseFood]?.unit || '').toLowerCase();
    const isDiscrete = unit.includes('slice') || unit.includes('egg') || unit.includes('piece') || unit.includes('roti') || unit.includes('chapati') || unit.includes('idli') || unit.includes('dosa');
    
    let correctedQty = rawQtys[item] * allFoods[baseFood].baseQty;
    
    if (isDiscrete) {
      return Math.max(Math.round(correctedQty), 1);
    }
    
    correctedQty = Math.max(correctedQty, 0.1); // Minimum 0.1
    return Math.round(correctedQty * 10) / 10; // 1 decimal place
  };

  // Calculate actual dynamically adjusted macros
  let actualCals = 0;
  let actualProtein = 0;
  let actualCarbs = 0;
  let actualFats = 0;

  selectedFoods.forEach(item => {
    const fData = allFoods[item.split('|')[0]];
    const defaultQty = getSmartDefaultQty(item);
    const exactQty = customQty[item] !== undefined ? customQty[item] : defaultQty;
    const itemMultiplier = exactQty / fData.baseQty;

    actualCals += Math.round(fData.cals * itemMultiplier);
    actualProtein += Math.round(fData.protein * itemMultiplier);
    actualCarbs += Math.round(fData.carbs * itemMultiplier);
    actualFats += Math.round(fData.fat * itemMultiplier);
  });

  // Calculate eaten macros from checked items
  let eatenCals = 0;
  let eatenProtein = 0;
  let eatenCarbs = 0;
  let eatenFats = 0;

  selectedFoods.forEach(item => {
    if (!eatenMeals[item]) return;
    const fData = allFoods[item.split('|')[0]];
    const defaultQty = getSmartDefaultQty(item);
    const exactQty = customQty[item] !== undefined ? customQty[item] : defaultQty;
    const itemMul = exactQty / fData.baseQty;
    eatenCals += Math.round(fData.cals * itemMul);
    eatenProtein += Math.round(fData.protein * itemMul);
    eatenCarbs += Math.round(fData.carbs * itemMul);
    eatenFats += Math.round(fData.fat * itemMul);
  });

  useEffect(() => {
    if (planGenerated) {
      try {
        localStorage.setItem(getUserStorageKey(`leanverse_eaten_cals_${activeDateStr}`), eatenCals.toString());
        localStorage.setItem(getUserStorageKey(`leanverse_eaten_macros_${activeDateStr}`), JSON.stringify({
          protein: eatenProtein,
          carbs: eatenCarbs,
          fats: eatenFats
        }));
        localStorage.setItem(getUserStorageKey(`leanverse_plan_targets_${activeDateStr}`), JSON.stringify({
          calories: actualCals,
          protein: actualProtein,
          carbs: actualCarbs,
          fats: actualFats
        }));
      } catch {}
    }
  }, [eatenCals, eatenProtein, eatenCarbs, eatenFats, planGenerated, activeDateStr, actualCals, actualProtein, actualCarbs, actualFats]);

  const isOver = (actual: number, target: number) => actual > target * 1.05;
  const isUnder = (actual: number, target: number) => actual < target * 0.9;

  if (!isMounted) return null;

  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {!planGenerated ? (
        <div id="blueprint-card" className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 max-w-2xl mx-auto scroll-mt-24">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              <Apple className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-800 dark:text-slate-100">
                AI Diet Plan Blueprint
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Build your complete clinical macro and grocery schedule instantly.
              </p>
            </div>
          </div>
          <div className="max-w-xs mx-auto mt-6 bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden mb-8">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
          </div>
{/* Step 1: Biometrics */}
      {step === 1 && (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 animate-fade-in max-w-xl mx-auto">
          <h2 className="text-xl font-black mb-6 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-500" /> Body Metrics & Activity</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Age</label>
              <input type="number" inputMode="numeric" pattern="[0-9]*" min="10" value={age} onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-black text-base sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-black focus:outline-none focus:border-emerald-500 transition-colors">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Height (cm)</label>
              <input type="number" inputMode="numeric" pattern="[0-9]*" min="50" value={height} onChange={e => setHeight(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-black text-base sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Weight (kg)</label>
              <input type="number" inputMode="numeric" pattern="[0-9]*" min="30" value={weight} onChange={e => setWeight(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-black text-base sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
          </div>

          <div className="space-y-1.5 mb-8">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map(act => (
                <button key={act.id} onClick={() => setActivity(act.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${activity === act.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 hover:border-emerald-500/50'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-black ${activity === act.id ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-200'}`}>{act.label}</span>
                    <span className="text-xs font-medium text-slate-400">{act.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setStep(2)} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all flex items-center justify-center">
            Calculate My Maintenance Calories <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}

      {/* Step 2: Maintenance Calories & TDEE (The Hook) */}
      {step === 2 && (
        <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <Info className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-2">Your Profile Analysis</h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">
              Based on your age, weight, and activity level, your body needs approximately <strong className="text-lg">{tdee} calories</strong> per day to maintain your current weight. Let's look at your baseline metrics before we set a goal.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-2xl border border-slate-200/20 dark:border-white/10 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">BMI</span>
              <span className="text-xl font-black text-slate-800 dark:text-white block">{bmi}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${bmiCategory === 'Normal Weight' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{bmiCategory}</span>
            </div>
            <div className="glass p-4 rounded-2xl border border-slate-200/20 dark:border-white/10 text-center">
              <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">BMR</span>
              <span className="text-xl font-black text-slate-800 dark:text-white block">{bmr}</span>
              <span className="text-xs font-medium text-slate-500 mt-1 block">kcal/day</span>
            </div>
            <div className="glass p-4 rounded-2xl border border-slate-200/20 dark:border-white/10 text-center sm:col-span-2 bg-slate-800 text-white dark:bg-white/5 border-none">
              <span className="text-[10px] uppercase font-black text-emerald-400 block mb-1">Maintenance (TDEE)</span>
              <span className="text-3xl font-black block">{tdee}</span>
              <span className="text-xs font-medium text-slate-300 mt-1 block">Calories to stay exactly {weight}kg</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-2xl border border-slate-200/20 dark:border-white/10">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide mb-4 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2 text-emerald-500" /> Weight Projection Matrix
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Lose 0.75 kg/week', cal: tdee - 750, color: 'text-emerald-500' },
                { label: 'Lose 0.5 kg/week', cal: tdee - 500, color: 'text-emerald-500' },
                { label: 'Lose 0.25 kg/week', cal: tdee - 250, color: 'text-emerald-500' },
                { label: 'Maintain Current Weight', cal: tdee, color: 'text-slate-400' },
                { label: 'Gain 0.25 kg/week', cal: tdee + 250, color: 'text-amber-500' },
                { label: 'Gain 0.5 kg/week', cal: tdee + 500, color: 'text-amber-500' },
              ].map((proj, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{proj.label}</span>
                  <span className={`text-sm font-black ${proj.color}`}>{proj.cal} kcal/day</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all flex items-center justify-center">
              Choose My Goal <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Goal Selection */}
      {step === 3 && (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 animate-fade-in max-w-xl mx-auto">
          <h2 className="text-xl font-black mb-6 flex items-center"><Target className="w-5 h-5 mr-2 text-emerald-500" /> What is your primary goal?</h2>
          <div className="grid grid-cols-1 gap-3 mb-8">
            {GOALS.map(g => {
              const Icon = g.icon;
              const active = goal === g.id;
              return (
                <button key={g.id} onClick={() => setGoal(g.id)} aria-pressed={active}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${active ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-white/5 hover:border-emerald-500/30'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${active ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${active ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}>{g.label}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{g.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setStep(4)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all">Continue</button>
          </div>
        </div>
      )}

      {/* Step 4: Timeline */}
      {step === 4 && (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 animate-fade-in max-w-xl mx-auto">
          <h2 className="text-xl font-black mb-2 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-emerald-500" /> Transformation Timeline</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">How quickly do you want to reach your goal?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {TIMELINES.map(t => (
              <button key={t.id} onClick={() => setTimeline(t.id)} aria-pressed={timeline === t.id}
                className={`py-4 rounded-2xl border-2 transition-all font-black ${timeline === t.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 mb-8 flex items-start">
            <Sparkles className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-black text-emerald-600 block mb-1">AI Estimation</span>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                In {timeline} days, you can expect to {goal === 'fat_loss' ? 'lose' : goal === 'muscle_gain' ? 'gain' : 'transform'} approximately 
                <span className="text-lg ml-1">
                  {goal === 'maintenance' ? 'your physique with better definition' : 
                   goal === 'recomp' ? 'fat while building new muscle tissue' : 
                   `${Math.abs(Math.round(((tdee - getTargetCalories()) * 7 / 7700) * (timeline / 7)))} - ${Math.abs(Math.round(((tdee - getTargetCalories()) * 7 / 7700) * (timeline / 7)) + 2)} kg`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 sticky bottom-4 z-10 pt-4">
            <button onClick={() => setStep(3)} className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setStep(5)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20">Continue</button>
          </div>
        </div>
      )}

      {/* Step 5: Diet Style */}
      {step === 5 && (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 animate-fade-in max-w-xl mx-auto">
          <h2 className="text-xl font-black mb-2 flex items-center"><UtensilsCrossed className="w-5 h-5 mr-2 text-emerald-500" /> Diet Style Preferences</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">Select all that apply.</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {DIET_STYLES.map(style => {
              const active = dietStyles.includes(style);
              return (
                <button key={style} onClick={() => toggleDietStyle(style)}
                  className={`px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all flex items-center ${active ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50'}`}>
                  {active && <Check className="w-4 h-4 mr-1" />}
                  {style}
                </button>
              )
            })}
          </div>

          <div className="flex gap-3 sticky bottom-4 z-10 pt-4">
            <button onClick={() => setStep(4)} className="px-6 py-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setStep(6)} disabled={dietStyles.length === 0} className="flex-1 py-4 bg-emerald-500 disabled:opacity-50 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20">Continue</button>
          </div>
        </div>
      )}

      {/* Step 6: Branching Logic */}
      {step === 6 && !planSelectionMode && (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 animate-fade-in max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-6 text-slate-800 dark:text-white">How would you like to build your plan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button onClick={() => setPlanSelectionMode('premium')} className="p-6 rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-black text-lg mb-1 text-slate-800 dark:text-white">Premium Plans</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Choose an expertly crafted plan. It will automatically scale perfectly to your target.</p>
            </button>
            
            <button onClick={() => setPlanSelectionMode('ai')} className="p-6 rounded-2xl border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-left">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="font-black text-lg mb-1 text-slate-800 dark:text-white">Custom AI Plan</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Pick your exact favorite ingredients. The AI will compute perfect macros for you from scratch.</p>
            </button>
          </div>
          <button onClick={() => setStep(5)} className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors">Back</button>
        </div>
      )}

      {step === 6 && planSelectionMode === 'premium' && (
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 animate-fade-in max-w-2xl mx-auto">
          <h2 className="text-xl font-black mb-2 flex items-center text-slate-800 dark:text-white"><Star className="w-6 h-6 mr-2 text-amber-500" /> LeanVerse Premium Plans</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">Our Auto-Scaling Engine will mathematically adjust these pre-made plans to perfectly hit your exact TDEE calories.</p>
          
          <div className="space-y-3 mb-8">
            {premiumPlans.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-medium bg-slate-50 dark:bg-white/5 rounded-2xl">No premium plans available right now.</p>
            ) : (
              premiumPlans.map(plan => (
                <button key={plan._id} onClick={() => handleSelectPremiumPlan(plan)}
                  className="w-full text-left p-4 bg-white dark:bg-zinc-800 border-2 border-slate-100 dark:border-white/5 rounded-2xl flex justify-between items-center hover:border-emerald-500 hover:shadow-lg transition-all group">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-lg">{plan.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{plan.goal}</span>
                      <span className="text-xs font-bold text-slate-400">{plan.durationDays} Days</span>
                      <span className="text-xs font-bold text-amber-500">• Auto-Scales</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
          
          <button onClick={() => setPlanSelectionMode(null)} className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors">Back</button>
        </div>
      )}

      {step === 6 && planSelectionMode === 'ai' && (
        <div className="space-y-5 animate-fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Step 6: Your Food Preferences</span>
              <p className="text-xs text-slate-500 mb-4">We are creating a highly-customized diet plan specifically for you. Select the exact foods you want to eat for each meal below, and our AI will calculate the perfect portions to hit your goals!</p>
              
              <div className="flex space-x-3 mb-6">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="flex-1 py-3 bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-350 rounded-2xl font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || selectedFoods.length < 5}
                  className={`flex-1 py-3 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 ${
                    generating || selectedFoods.length < 5 
                      ? 'bg-slate-200/80 dark:bg-zinc-800 text-slate-400 cursor-not-allowed border border-slate-300/10' 
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white cursor-pointer'
                  }`}
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                      <span>Synthesizing...</span>
                    </>
                  ) : selectedFoods.length < 5 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-1 opacity-50 shrink-0" />
                      <span className="text-[11px] sm:text-sm whitespace-nowrap">Pick {5 - selectedFoods.length} more</span>
                    </>
                  ) : !user ? (
                    <>
                      <User className="w-4 h-4 mr-1 shrink-0" />
                      <span className="text-sm sm:text-base whitespace-nowrap">Login to Generate</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current mr-1 text-amber-300 shrink-0" />
                      <span className="text-sm sm:text-base whitespace-nowrap">Generate Plan</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 mb-4">
                 {['breakfast', 'lunch', 'pre-workout', 'post-workout', 'dinner'].map(meal => (
                    <button key={meal} type="button" onClick={() => setActiveMealTab(meal)} className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-colors ${activeMealTab === meal ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-200/50 dark:bg-white/5 text-slate-500 hover:bg-slate-300/50 dark:hover:bg-white/10'}`}>
                       {meal}
                    </button>
                 ))}
              </div>

              <div className="mb-4 flex space-x-2">
                <input
                  type="text"
                  placeholder={`Search foods to add to ${activeMealTab}...`}
                  value={searchFood}
                  onChange={(e) => setSearchFood(e.target.value)}
                  className="flex-1 bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:border-emerald-500 font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl px-4 flex items-center justify-center transition-colors cursor-pointer"
                  title="Scan Barcode"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {Object.keys(allFoods)
                  .filter((food) => {
                    if (allFoods[food].hidden) return false;

                    let matchesDiet = true;
                    if (dietStyles.includes('Vegetarian') && !dietStyles.includes('Non-Vegetarian')) {
                      const fStyles = allFoods[food].dietStyles;
                      if (fStyles && fStyles.length > 0) {
                        matchesDiet = fStyles.includes('Vegetarian');
                      } else {
                        matchesDiet = !['chicken', 'fish', 'egg', 'beef', 'mutton', 'pork'].some(meat => food.toLowerCase().includes(meat));
                      }
                    }
                    if (!matchesDiet) return false;

                    const matchesSearch = food.toLowerCase().includes(searchFood.toLowerCase().trim());
                    const foodCat = allFoods[food].category;
                    const matchesTab = Array.isArray(foodCat) 
                      ? foodCat.some(c => c?.toLowerCase() === activeMealTab.toLowerCase())
                      : typeof foodCat === 'string'
                        ? foodCat.toLowerCase() === activeMealTab.toLowerCase()
                        : false;
                    
                    // If the user is actively searching, show all matches regardless of category
                    if (searchFood.trim() !== '') return matchesSearch;
                    // Otherwise, only show foods belonging to the active meal tab
                    return matchesTab;
                  })
                  .map((food) => {
                  const compositeKey = `${food}|${activeMealTab}`;
                  return (
                  <button
                    key={food}
                    type="button"
                    onClick={() => toggleFood(food)}
                    className={`py-3 px-1 rounded-2xl border font-bold text-xs transition-all flex flex-col items-center justify-center cursor-pointer ${
                      selectedFoods.includes(compositeKey)
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : 'border-slate-300/10 bg-slate-100/50 dark:bg-white/5 text-slate-500 hover:border-slate-500/20'
                    }`}
                  >
                    <span className="text-xl mb-1">{allFoods[food].icon}</span>
                    <span className="text-center px-1 break-words w-full">{food.toUpperCase()}</span>
                  </button>
                  );
                })}
              </div>

              {/* Dynamic Warning Alert Overlay */}
              {selectedFoods.length > 0 && (
                <div className="space-y-3.5 border-t border-slate-200/10 pt-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4 text-xs font-extrabold p-3 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-300/5">
                    <div>Selected Raw Calories: <span className="text-emerald-500">{homeFoodCals} kcal</span></div>
                    <div>Selected Raw Protein: <span className="text-cyan-500">{homeFoodProtein}g</span></div>
                  </div>

                  {warningMessage && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold p-3.5 rounded-2xl flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 animate-bounce" />
                      <p className="leading-relaxed">{warningMessage}</p>
                    </div>
                  )}

                  {proteinTip && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold p-3.5 rounded-2xl flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <p className="leading-relaxed">{proteinTip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Plan Output Interface */
        <div className="space-y-8 animate-fade-in">
          {/* Printable Blueprint Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden print-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10" />

            <div>
              <div className="flex items-center space-x-1 text-emerald-500 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI Diet Blueprint Synthesized</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                LeanVerse Custom Meal Split
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Caloric metrics generated using dynamic Mifflin formulas tailored specifically for a {age}-year old {gender} targeting **{goal === 'fatloss' ? 'Fat Loss Deficit' : goal === 'muscle' ? 'Lean Mass Growth' : 'Maintenance'}**.
              </p>
            </div>

            <div className="flex space-x-3.5 no-print">
              <button
                onClick={() => { setPlanGenerated(false); setStep(6); setPlanSelectionMode('ai'); }}
                className="px-4 py-2.5 rounded-xl border border-slate-300/10 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-500 dark:text-slate-300 hover:text-emerald-500 font-bold transition-all cursor-pointer flex items-center space-x-1 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Adjust Foods</span>
              </button>
              <button
                onClick={() => { setPlanGenerated(false); setStep(1); setSelectedFoods([]); setCustomQty({}); setMealAssignments({}); try { localStorage.removeItem(DIET_PLAN_KEY); } catch {} }}
                className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all cursor-pointer flex items-center space-x-1 text-sm"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleCopyGrocery}
                className="px-4 py-2.5 rounded-xl border border-slate-300/10 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-500 dark:text-slate-300 hover:text-emerald-500 font-bold transition-all cursor-pointer flex items-center space-x-1 text-sm"
              >
                {copiedGrocery ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedGrocery ? 'Copied' : 'Grocery List'}</span>
              </button>
            </div>
          </div>

          {/* Macro Breakdown cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print-card">
            <div className={`glass p-5 rounded-2xl border transition-colors duration-300 ${isOver(actualCals, calsTarget) ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200/10'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Calories</span>
                <span className="text-[10px] text-slate-500 font-bold block">Target: {calsTarget}</span>
              </div>
              <span className={`text-2xl sm:text-3xl font-black mt-1 block ${isOver(actualCals, calsTarget) ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
                {actualCals} <span className="text-xs text-slate-500 font-bold">kcal</span>
              </span>
            </div>
            
            <div className={`glass p-5 rounded-2xl border transition-colors duration-300 ${isUnder(actualProtein, proteinTarget) ? 'border-amber-500/50 bg-amber-500/5' : isOver(actualProtein, proteinTarget * 1.3) ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200/10'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block">Protein</span>
                <span className="text-[10px] text-slate-500 font-bold block">Target: {proteinTarget}g</span>
              </div>
              <span className={`text-2xl sm:text-3xl font-black mt-1 block ${isUnder(actualProtein, proteinTarget) ? 'text-amber-500' : isOver(actualProtein, proteinTarget * 1.3) ? 'text-red-500' : 'text-emerald-500'}`}>
                {actualProtein}g
              </span>
            </div>
            
            <div className={`glass p-5 rounded-2xl border transition-colors duration-300 ${isOver(actualCarbs, carbsTarget) ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200/10'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-cyan-500 font-extrabold uppercase tracking-widest block">Carbs</span>
                <span className="text-[10px] text-slate-500 font-bold block">Target: {carbsTarget}g</span>
              </div>
              <span className={`text-2xl sm:text-3xl font-black mt-1 block ${isOver(actualCarbs, carbsTarget) ? 'text-red-500' : 'text-cyan-500'}`}>
                {actualCarbs}g
              </span>
            </div>
            
            <div className={`glass p-5 rounded-2xl border transition-colors duration-300 ${isOver(actualFats, fatsTarget) ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200/10'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest block">Fats</span>
                <span className="text-[10px] text-slate-500 font-bold block">Target: {fatsTarget}g</span>
              </div>
              <span className={`text-2xl sm:text-3xl font-black mt-1 block ${isOver(actualFats, fatsTarget) ? 'text-red-500' : 'text-amber-500'}`}>
                {actualFats}g
              </span>
            </div>
          </div>

          {/* Over Target Warning */}
          {(isOver(actualCals, calsTarget) || isOver(actualProtein, proteinTarget * 1.3) || isOver(actualCarbs, carbsTarget) || isOver(actualFats, fatsTarget)) && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-amber-600 dark:text-amber-400 animate-fade-in print-hide">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-bold leading-snug">
                Note: Some of your macros exceed the target values. Please use the <span className="font-black text-amber-500">-</span> and <span className="font-black text-amber-500">+</span> buttons on individual food items to fine-tune your portions until you hit your targets!
              </div>
            </div>
          )}

          {/* Core Meals Schedules */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Meal detail blocks */}
            <div className="lg:col-span-8 space-y-6 print-card">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest self-start sm:self-center">Your Daily Meal Splits</span>
                
                <div className="flex items-center space-x-3 bg-slate-100/50 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/10 self-start sm:self-center">
                  <button 
                    aria-label="Previous Day"
                    onClick={() => changeDate(-1)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-zinc-800 text-slate-400 hover:text-emerald-500 transition-colors shadow-sm cursor-pointer"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center space-x-2 px-2">
                    <CalendarDays className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      {viewDateOffset === 0 ? 'Today' : viewDateOffset === -1 ? 'Yesterday' : activeDateStr}
                    </span>
                  </div>
                  
                  <button 
                    aria-label="Next Day"
                    onClick={() => changeDate(1)} 
                    disabled={viewDateOffset >= 0}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors shadow-sm ${
                      viewDateOffset >= 0 
                        ? 'opacity-30 cursor-not-allowed text-slate-400' 
                        : 'hover:bg-white dark:hover:bg-zinc-800 text-slate-400 hover:text-emerald-500 cursor-pointer'
                    }`}
                    title="Next Day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {selectedFoods.length === 0 ? (
                <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-slate-500 font-bold">You didn't select any foods from your kitchen.</p>
                  <button 
                    onClick={() => { setPlanGenerated(false); setStep(3); }}
                    className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all cursor-pointer"
                  >
                    Go Back and Pick Foods
                  </button>
                </div>
              ) : (
                ['breakfast', 'lunch', 'pre-workout', 'post-workout', 'dinner'].map((mealStr) => {
                  const mealItems = selectedFoods.filter(f => (f.includes('|') ? f.split('|')[1] : allFoods[f].category) === mealStr);
                  
                  return (
                    <div key={mealStr} className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4">
                      <div className="flex flex-row justify-between items-center gap-2 pb-3.5 border-b border-slate-200/10">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="px-2 sm:px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] sm:text-xs font-bold font-mono">
                            {mealStr === 'breakfast' ? '08:00 AM' : mealStr === 'lunch' ? '01:30 PM' : mealStr === 'pre-workout' ? '04:30 PM' : mealStr === 'post-workout' ? '07:00 PM' : '08:30 PM'}
                          </span>
                          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm sm:text-lg capitalize">{mealStr.replace('-', ' ')} Split</h3>
                        </div>
                        <button onClick={() => { setShowCustomForm(mealStr); setCfMeal(mealStr); }} className="flex items-center justify-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-full transition-all cursor-pointer group border border-emerald-500/20 hover:border-emerald-500 shrink-0" title="Add Custom Food">
                          <span className="text-[10px] sm:text-xs font-bold">Add Item</span>
                          <span className="text-xs sm:text-sm font-black leading-none pb-0.5">+</span>
                        </button>
                      </div>

                      {showCustomForm === mealStr && (
                        <form onSubmit={handleAddCustomFood} className="space-y-4 animate-fade-in bg-slate-100/50 dark:bg-white/5 p-4 rounded-2xl border border-emerald-500/20 my-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">Add Custom Item to {mealStr.replace('-', ' ')}</span>
                            <button type="button" onClick={() => setShowCustomForm(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Cancel</button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <input type="text" placeholder="Food Name (e.g. Mom's Pasta)" value={cfName} onChange={(e) => setCfName(e.target.value)} required className="col-span-2 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-emerald-500" />
                            <div className="col-span-2 flex space-x-2">
                              <input type="number" inputMode="numeric" pattern="[0-9]*" min="0" placeholder="0" value={cfCals} onChange={(e) => setCfCals(e.target.value)} required className="w-full bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-emerald-500" />
                              <span className="flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 text-xs font-bold rounded-xl px-4">kcal</span>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1">Protein (g)</label>
                              <input type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={cfProtein} onChange={(e) => setCfProtein(e.target.value)} required className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1">Carbs (g)</label>
                              <input type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={cfCarbs} onChange={(e) => setCfCarbs(e.target.value)} required className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-cyan-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Fats (g)</label>
                              <input type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={cfFats} onChange={(e) => setCfFats(e.target.value)} required className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-amber-500" />
                            </div>
                          </div>

                          <button type="submit" className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer">
                            Add to {mealStr.replace('-', ' ')}
                          </button>
                        </form>
                      )}

                      {mealItems.length === 0 ? (
                        <p className="text-xs text-slate-400 font-bold px-2 py-2 italic opacity-50">No items assigned to this meal.</p>
                      ) : (
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                          {mealItems.map((item) => {
                            const baseFood = item.split('|')[0];
                            const fData = allFoods[baseFood];
                            const defaultQty = getSmartDefaultQty(item);
                            const exactQty = customQty[item] !== undefined ? customQty[item] : defaultQty;
                            const itemMultiplier = exactQty / fData.baseQty;

                            const finalCals = Math.round(fData.cals * itemMultiplier);
                            const finalProtein = Math.round(fData.protein * itemMultiplier);
                            const finalCarbs = Math.round(fData.carbs * itemMultiplier);
                            const finalFat = Math.round(fData.fat * itemMultiplier);

                            const isGrams = fData.unit === 'g' || fData.unit === 'ml';
                            const u = (fData.unit || '').toLowerCase();
                            const isDiscrete = u.includes('slice') || u.includes('egg') || u.includes('piece') || u.includes('roti') || u.includes('chapati') || u.includes('idli') || u.includes('dosa');
                            const stepSize = isGrams ? 10 : (isDiscrete ? 1 : 0.1);

                            const adjustQty = (amount: number) => {
                              setCustomQty((prev) => {
                                const current = prev[item] !== undefined ? prev[item] : defaultQty;
                                const next = isDiscrete ? Math.round(current + amount) : Math.round((current + amount) * 10) / 10;
                                return {
                                  ...prev,
                                  [item]: Math.max(isGrams || isDiscrete ? 1 : 0.1, next),
                                };
                              });
                            };

                            const eaten = !!eatenMeals[item];

                            return (
                              <li key={item} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-xl border transition-all duration-300 gap-2 sm:gap-0 ${
                                eaten
                                  ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
                                  : 'bg-slate-100/50 dark:bg-white/5 border-slate-200/10 dark:border-white/5'
                              }`}>
                                <div className="flex items-center w-full sm:w-auto flex-1 min-w-0">
                                  {/* Eaten checkbox */}
                                  <button
                                    aria-label={eaten ? "Mark as not eaten" : "Mark as eaten"}
                                    onClick={() => toggleEaten(item)}
                                    className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mr-3 transition-all cursor-pointer ${
                                      eaten
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-300 dark:border-white/20 hover:border-emerald-400'
                                    }`}
                                    title={eaten ? 'Mark as not eaten' : 'Mark as eaten'}
                                  >
                                    {eaten && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </button>

                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <span className={`text-2xl transition-all shrink-0 ${eaten ? 'grayscale' : ''}`}>{fData.icon}</span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex justify-between items-start gap-2">
                                        <span className={`font-bold block leading-tight truncate ${eaten ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{baseFood.toUpperCase()}</span>
                                        <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-100 block leading-tight sm:hidden shrink-0">{finalCals} <span className="text-[10px] text-slate-400">kcal</span></span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <div className="flex items-center space-x-1">
                                          <button aria-label="Decrease quantity" onClick={() => adjustQty(-stepSize)} className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer leading-none font-black text-sm">-</button>
                                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest min-w-[25px] text-center">{exactQty}</span>
                                          <button aria-label="Increase quantity" onClick={() => adjustQty(stepSize)} className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer leading-none font-black text-sm">+</button>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-1">{fData.unit}</span>
                                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200/50 dark:bg-white/5 px-2 py-0.5 rounded-md truncate max-w-full">
                                          {finalProtein}g P • {finalCarbs}g C • {finalFat}g F
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-2 shrink-0 hidden sm:block">
                                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-100 block leading-tight">{finalCals} <span className="text-[10px] text-slate-400">kcal</span></span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Side column: MacroRings + Swaps + Grocery + Supplements */}
            <div className="lg:col-span-4 space-y-6 print-card">

              {/* Macro Rings ΓÇö Eaten Progress */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 flex flex-col items-center space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block self-start">Today's Eaten Progress</span>
                <MacroRings
                  protein={eatenProtein}
                  carbs={eatenCarbs}
                  fats={eatenFats}
                  calories={eatenCals}
                  proteinTarget={actualProtein}
                  carbsTarget={actualCarbs}
                  fatsTarget={actualFats}
                  calsTarget={actualCals}
                />
                <p className="text-[10px] text-slate-400 font-semibold text-center">
                  Check off each food item as you eat it to track your rings.
                </p>
              </div>
              {/* Swap list */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Alternative Swaps</span>
                <div className="space-y-3.5 text-xs">
                  <div className="pb-3 border-b border-slate-200/10">
                    <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">Dosa & Idli alternate</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">Swap for Oats Dosa or Moong Dal Chilla to increase fiber, protein, and lower insulin spiking.</p>
                  </div>
                  <div className="pb-3 border-b border-slate-200/10">
                    <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">White Rice alternate</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">Swap for Cauliflower Rice, Quinoa, or high-fiber Basmati brown rice.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide block mb-1">Standard Paneer alternate</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">Swap for Low-Fat Paneer or Organic Tofu to cut lipid fats in half.</p>
                  </div>
                </div>
              </div>

              {/* Grocery list */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Weekly Grocery List</span>
                  <button
                    onClick={handleCopyGrocery}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors text-xs font-bold"
                  >
                    {copiedGrocery ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGrocery ? 'Copied!' : 'Copy List'}</span>
                  </button>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Steel-cut Oats (500g)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Lean Chicken Breast (1kg) or Low-fat Tofu</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>High-Fiber brown rice (1kg)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Organic Eggs (2 dozen)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Broccoli, Zucchini, and Spinach (fresh)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span>Whey Protein Isolate (1 tub)</span>
                  </li>
                </ul>
              </div>

              {/* Supplements suggested */}
              <div className="glass p-6 rounded-3xl border border-slate-200/10 space-y-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Suggested Supplements</span>
                <ul className="space-y-3.5 text-xs">
                  <li className="flex items-center justify-between pb-2.5 border-b border-slate-200/10">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Whey Protein Isolate</span>
                      <span className="text-slate-400 font-bold block mt-0.5">1 scoop post-workout</span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between pb-2.5 border-b border-slate-200/10">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Creatine Monohydrate</span>
                      <span className="text-slate-400 font-bold block mt-0.5">3g daily for strength</span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Multivitamins & Omega-3</span>
                      <span className="text-slate-400 font-bold block mt-0.5">1 softgel with breakfast</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 print-hide">
            <button 
              onClick={() => { setPlanGenerated(false); setStep(6); setPlanSelectionMode('ai'); }}
              className="flex-1 py-4 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all border border-slate-300/10 cursor-pointer"
            >
              <span>Adjust Foods</span>
            </button>
            <button 
              onClick={() => { setPlanGenerated(false); setStep(1); setSelectedFoods([]); setCustomQty({}); setMealAssignments({}); try { localStorage.removeItem(DIET_PLAN_KEY); } catch {} }}
              className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all border border-red-500/20 cursor-pointer"
            >
              <span>Start New Plan</span>
            </button>
            
            <div className="flex gap-4">
              <a 
                href={shareWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-slate-200/50 hover:bg-[#25D366]/10 text-slate-600 hover:text-[#25D366] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-[#25D366]/20 border border-slate-300/10 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={shareX}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-slate-200/50 hover:bg-[#1DA1F2]/10 text-slate-600 hover:text-[#1DA1F2] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-[#1DA1F2]/20 border border-slate-300/10 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.925H5.022z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {showScanner && (
        <BarcodeScanner onResult={handleBarcodeScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}
