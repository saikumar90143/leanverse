'use client';

import React, { useState, useEffect } from 'react';
import { Apple, AlertTriangle, Printer, Sparkles, RefreshCw, CheckCircle2, ChevronRight, ChevronLeft, CalendarDays, Camera, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import MacroRings from '@/components/shared/MacroRings';
import { getUserStorageKey } from '@/lib/storage';

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
  useEffect(() => setIsMounted(true), []);

  // Input states
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(70); // kg
  const [goal, setGoal] = useState('fatloss');
  const [activity, setActivity] = useState('moderate');
  const [budget, setBudget] = useState('medium');
  const [foodPref, setFoodPref] = useState('vegetarian');
  const [allergies, setAllergies] = useState('');
  
  // Selected ingredients at home
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [searchFood, setSearchFood] = useState('');

  // Hot-patch legacy snack items in memory (prevents requiring a page refresh)
  useEffect(() => {
    if (selectedFoods.some(f => f.includes('|snack'))) {
      setSelectedFoods(prev => prev.map(f => typeof f === 'string' ? f.replace(/\|snack$/, '|pre-workout') : f));
      
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
  const [generating, setGenerating] = useState(false);
  const [customQty, setCustomQty] = useState<Record<string, number>>({});
  const [mealAssignments, setMealAssignments] = useState<Record<string, string>>({});
  const [activeMealTab, setActiveMealTab] = useState('breakfast');
  
  // Date Navigation State
  const [viewDateOffset, setViewDateOffset] = useState(0);
  const getDisplayDate = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
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

  const shareText = encodeURIComponent("I just built my custom AI Diet Plan on LeanVerse! 🔥");
  const shareWhatsapp = `https://wa.me/?text=${shareText}`;
  const shareX = `https://twitter.com/intent/tweet?text=${shareText}`;
  const getActiveDateStr = (offset: number) => {
    return new Date(Date.now() + offset * 86400000).toISOString().split('T')[0];
  };
  const activeDateStr = getActiveDateStr(viewDateOffset);

  // Tracks which food items have been eaten (checked off) for the active date
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
  const [customFoodsDatabase, setCustomFoodsDatabase] = useState<Record<string, { cals: number; protein: number; carbs: number; fat: number; alternative: string; warning?: string; icon: string; category: string; unit: string; baseQty: number }>>(() => {
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
      '0123456789': { cals: 190, protein: 21, carbs: 22, fat: 8, alternative: 'MusclePharm Combat Crunch', icon: '🍫', category: 'protein', unit: 'bar', baseQty: 1 },
      '8901030911': { cals: 100, protein: 15, carbs: 10, fat: 0, alternative: 'Chobani Zero Sugar', icon: '🥣', category: 'dairy', unit: 'cup', baseQty: 1 },
      'DEFAULT': { cals: 250, protein: 10, carbs: 30, fat: 10, alternative: 'Healthy Snack', icon: '📦', category: 'snack', unit: 'serving', baseQty: 1 }
    };
    
    const scannedName = mockDb[decodedText] ? (decodedText === '0123456789' ? 'Quest Protein Bar' : 'Greek Yogurt (Oikos)') : `Scanned Item (${decodedText.slice(-4)})`;
    const food = mockDb[decodedText] || mockDb['DEFAULT'];
    
    setCustomFoodsDatabase(prev => ({
      ...prev,
      [scannedName]: food
    }));
    
    setSelectedFoods(prev => {
      const entry = `${scannedName}|snack`;
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
        setSelectedFoods(migratedFoods);
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
      
      if (saved.planGenerated === true) setPlanGenerated(true);
    } catch {
      // corrupted data — start fresh
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save logic removed. We now save instantaneously on toggleEaten.

  // Save full plan state whenever it changes
  useEffect(() => {
    if (!planGenerated) return; // only save once a plan has been generated
    try {
      const toSave = { age, gender, height, weight, goal, activity, budget, foodPref, allergies, selectedFoods, customQty, mealAssignments, planGenerated };
      localStorage.setItem(DIET_PLAN_KEY, JSON.stringify(toSave));
    } catch {
      // quota exceeded or private mode — ignore
    }
  }, [age, gender, height, weight, goal, activity, budget, foodPref, allergies, selectedFoods, customQty, mealAssignments, planGenerated]);

  const toggleEaten = (item: string) => {
    setEatenMeals(prev => {
      const next = { ...prev, [item]: !prev[item] };
      try {
        localStorage.setItem(getUserStorageKey(`leanverse_eaten_${activeDateStr}`), JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Common food data database
  const commonFoods: Record<string, { cals: number; protein: number; carbs: number; fat: number; alternative: string; warning?: string; icon: string; category: string; unit: string; baseQty: number }> = {
    // Grains & Carbs
    rice: { cals: 130, protein: 2.7, carbs: 28, fat: 0.3, alternative: 'Brown Rice / Quinoa', warning: 'White rice has high glycemic indexes.', icon: '🍚', category: 'lunch', unit: 'g', baseQty: 100 },
    'brown rice': { cals: 111, protein: 2.6, carbs: 23, fat: 0.9, alternative: 'Quinoa', icon: '🍛', category: 'lunch', unit: 'g', baseQty: 100 },
    roti: { cals: 120, protein: 3.8, carbs: 17, fat: 3.7, alternative: 'Multigrain Roti', icon: '🫓', category: 'dinner', unit: 'rotis', baseQty: 1 },
    oats: { cals: 389, protein: 16.9, carbs: 66, fat: 6.9, alternative: 'Steel-Cut Oats', icon: '🥣', category: 'breakfast', unit: 'g', baseQty: 100 },
    sweetpotato: { cals: 86, protein: 1.6, carbs: 20, fat: 0.1, alternative: 'Yam', icon: '🍠', category: 'lunch', unit: 'g', baseQty: 100 },
    'brown bread': { cals: 250, protein: 10, carbs: 43, fat: 4, alternative: 'Sourdough', icon: '🍞', category: 'breakfast', unit: 'slices', baseQty: 3 },
    ricecake: { cals: 35, protein: 0.7, carbs: 7.3, fat: 0.3, alternative: 'Makhana', icon: '🍘', category: 'pre-workout', unit: 'cakes', baseQty: 1 },

    // Proteins (Animal & Dairy)
    chicken: { cals: 165, protein: 31, carbs: 0, fat: 3.6, alternative: 'Turkey / Lean Beef', icon: '🍗', category: 'lunch', unit: 'g', baseQty: 100 },
    fish: { cals: 206, protein: 22, carbs: 0, fat: 12, alternative: 'Tuna / Tilapia', icon: '🐟', category: 'dinner', unit: 'g', baseQty: 100 },
    eggs: { cals: 155, protein: 13, carbs: 1.1, fat: 11, alternative: 'Egg Whites', icon: '🥚', category: 'breakfast', unit: 'large eggs', baseQty: 2 },
    paneer: { cals: 265, protein: 18, carbs: 1.2, fat: 20, alternative: 'Low-Fat Paneer / Tofu', warning: 'High fat load.', icon: '🧀', category: 'dinner', unit: 'g', baseQty: 100 },
    wheyprotein: { cals: 120, protein: 24, carbs: 3, fat: 1.5, alternative: 'Plant Protein Blend', icon: '🥤', category: 'post-workout', unit: 'scoops', baseQty: 1 },
    milk: { cals: 60, protein: 3.2, carbs: 4.8, fat: 3.3, alternative: 'Almond Milk', icon: '🥛', category: 'breakfast', unit: 'ml', baseQty: 100 },
    curd: { cals: 98, protein: 11, carbs: 3.4, fat: 4.3, alternative: 'Greek Yogurt', icon: '🥣', category: 'pre-workout', unit: 'g', baseQty: 100 },
    yogurt: { cals: 59, protein: 10, carbs: 3.6, fat: 0.4, alternative: 'Kefir', icon: '🍦', category: 'pre-workout', unit: 'g', baseQty: 100 },

    // Legumes & Pulses
    dal: { cals: 340, protein: 24, carbs: 60, fat: 1, alternative: 'Sprouted Moong Dal', icon: '🍲', category: 'lunch', unit: 'g (uncooked)', baseQty: 100 },
    rajma: { cals: 333, protein: 24, carbs: 60, fat: 0.8, alternative: 'Lobia / Chole', icon: '🍛', category: 'lunch', unit: 'g (uncooked)', baseQty: 100 },
    chana: { cals: 364, protein: 19, carbs: 61, fat: 6, alternative: 'Roasted Makhana', icon: '🧆', category: 'pre-workout', unit: 'g', baseQty: 100 },

    // Fats & Nuts
    'peanut butter': { cals: 588, protein: 25, carbs: 20, fat: 50, alternative: 'Almond Butter', warning: 'Extremely calorie dense.', icon: '🥜', category: 'breakfast', unit: 'tbsp', baseQty: 6 },
    badam: { cals: 579, protein: 21, carbs: 22, fat: 50, alternative: 'Walnuts', icon: '🌰', category: 'pre-workout', unit: 'g', baseQty: 100 },
    cashew: { cals: 553, protein: 18, carbs: 30, fat: 44, alternative: 'Pistachios', icon: '🥜', category: 'pre-workout', unit: 'g', baseQty: 100 },
    pista: { cals: 562, protein: 20, carbs: 28, fat: 45, alternative: 'Pumpkin Seeds', icon: '🟢', category: 'pre-workout', unit: 'g', baseQty: 100 },

    // Fruits
    banana: { cals: 89, protein: 1.1, carbs: 23, fat: 0.3, alternative: 'Apple / Berries', icon: '🍌', category: 'breakfast', unit: 'medium bananas', baseQty: 1 },
    apple: { cals: 52, protein: 0.3, carbs: 14, fat: 0.2, alternative: 'Pear', icon: '🍎', category: 'pre-workout', unit: 'g', baseQty: 100 },
    orange: { cals: 47, protein: 0.9, carbs: 12, fat: 0.1, alternative: 'Grapefruit', icon: '🍊', category: 'pre-workout', unit: 'g', baseQty: 100 },
    watermelon: { cals: 30, protein: 0.6, carbs: 7.6, fat: 0.2, alternative: 'Muskmelon', icon: '🍉', category: 'pre-workout', unit: 'g', baseQty: 100 },
    papaya: { cals: 43, protein: 0.5, carbs: 11, fat: 0.3, alternative: 'Pineapple', icon: '🥭', category: 'breakfast', unit: 'g', baseQty: 100 },
    dates: { cals: 282, protein: 2.5, carbs: 75, fat: 0.4, alternative: 'Raisins', warning: 'High sugar density.', icon: '🌴', category: 'pre-workout', unit: 'dates', baseQty: 10 },

    // Vegetables
    broccoli: { cals: 34, protein: 2.8, carbs: 6.6, fat: 0.4, alternative: 'Cauliflower', icon: '🥦', category: 'lunch', unit: 'g', baseQty: 100 },
    spinach: { cals: 23, protein: 2.9, carbs: 3.6, fat: 0.4, alternative: 'Kale', icon: '🥬', category: 'dinner', unit: 'g', baseQty: 100 },
    carrot: { cals: 41, protein: 0.9, carbs: 10, fat: 0.2, alternative: 'Beetroot', icon: '🥕', category: 'lunch', unit: 'g', baseQty: 100 },
    tomato: { cals: 18, protein: 0.9, carbs: 3.9, fat: 0.2, alternative: 'Bell Pepper', icon: '🍅', category: 'lunch', unit: 'g', baseQty: 100 },
    potato: { cals: 77, protein: 2, carbs: 17, fat: 0.1, alternative: 'Sweet Potato', icon: '🥔', category: 'dinner', unit: 'g', baseQty: 100 },
    cucumber: { cals: 15, protein: 0.7, carbs: 3.6, fat: 0.1, alternative: 'Zucchini', icon: '🥒', category: 'lunch', unit: 'g', baseQty: 100 },
    onion: { cals: 40, protein: 1.1, carbs: 9.3, fat: 0.1, alternative: 'Garlic', icon: '🧅', category: 'lunch', unit: 'g', baseQty: 100 },

    // Breakfast Extras
    dosa: { cals: 168, protein: 3.9, carbs: 29, fat: 3.7, alternative: 'Oats Dosa', icon: '🥞', category: 'breakfast', unit: 'dosas', baseQty: 1 },
    idli: { cals: 58, protein: 1.6, carbs: 12, fat: 0.2, alternative: 'Oats Idli', icon: '🥟', category: 'breakfast', unit: 'idlis', baseQty: 1 },
  };

  const allFoods = { ...commonFoods, ...customFoodsDatabase };

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
        icon: '🍽️',
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
    let base = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
    const mult = activity === 'extreme' ? 1.9 : activity === 'heavy' ? 1.725 : activity === 'moderate' ? 1.55 : 1.375;
    let tdee = Math.round(base * mult);

    if (goal === 'fatloss') return tdee - 500;
    if (goal === 'leanbulk') return tdee + 250;
    if (goal === 'muscle') return tdee + 500;
    return tdee;
  };

  const calsTarget = getDietCalorieTarget();
  const proteinTarget = Math.round(weight * 2.0); // 2g per kg
  const fatsTarget = Math.round((calsTarget * 0.25) / 9);
  const carbsTarget = Math.round((calsTarget - (proteinTarget * 4 + fatsTarget * 9)) / 4);

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
    let correctedQty = rawQtys[item] * allFoods[baseFood].baseQty;
    correctedQty = Math.max(correctedQty, 1); // Minimum 1g/1ml
    return Math.round(correctedQty); // Exact integer
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
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/20 dark:border-white/10 max-w-2xl mx-auto">
          {/* Header */}
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

          {/* Form Wizard Navigation */}
          <div className="flex items-center space-x-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
          </div>

          {/* Step 1: Personal Biometrics */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Step 1: Your Biometrics</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block ml-1">Age</label>
                  <input
                    type="number" min="0"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Gender</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block ml-1">Height (cm)</label>
                  <input
                    type="number" min="0"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block ml-1">Weight (kg)</label>
                  <input
                    type="number" min="0"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Goal & Preferences */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Step 2: Goal & Habits</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Target Goal</span>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fatloss">Fat Loss</option>
                    <option value="leanbulk">Lean Bulk</option>
                    <option value="muscle">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Diet Style</span>
                  <select
                    value={foodPref}
                    onChange={(e) => setFoodPref(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="nonveg">Non-Veg</option>
                    <option value="southindian">South Indian</option>
                    <option value="northindian">North Indian</option>
                    <option value="telugumeals">Telugu Meals</option>
                    <option value="keto">Keto Diet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Activity Multiplier</span>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="normal">Normal (weekly once)</option>
                    <option value="moderate">Moderate (3-4 days a week)</option>
                    <option value="heavy">Heavy (5-6 days)</option>
                    <option value="extreme">Extreme (7 days)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block ml-1">Allergies (e.g. Gluten, Nuts)</span>
                  <input
                    type="text"
                    placeholder="None"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl font-bold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Raw Foods Available & Immediate Warn Logic */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Step 3: Home Foods Picker</span>
              <p className="text-xs text-slate-500 mb-4">Select items you currently have in your kitchen. Categorize them into meals to customize your generated plan.</p>
              
              <div className="flex space-x-3 mb-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
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
                      <AlertTriangle className="w-4 h-4 mr-1 opacity-50" />
                      <span>Select {5 - selectedFoods.length} more item{5 - selectedFoods.length !== 1 ? 's' : ''}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current mr-1 text-amber-300" />
                      <span>Generate Plan</span>
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
                  className="flex-1 bg-slate-100/50 dark:bg-white/5 border border-slate-300/20 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-bold"
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
                  .filter((food) => food.includes(searchFood.toLowerCase()))
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
                onClick={() => { setPlanGenerated(false); try { localStorage.removeItem(DIET_PLAN_KEY); } catch {} }}
                className="px-4 py-2.5 rounded-xl border border-slate-300/10 bg-slate-100/50 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-500 dark:text-slate-300 hover:text-emerald-500 font-bold transition-all cursor-pointer flex items-center space-x-1 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Modify Data</span>
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-3.5 border-b border-slate-200/10">
                        <div className="flex flex-wrap items-center gap-2 sm:space-x-3 sm:gap-0">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] sm:text-xs font-bold font-mono">
                            {mealStr === 'breakfast' ? '08:00 AM' : mealStr === 'lunch' ? '01:30 PM' : mealStr === 'pre-workout' ? '04:30 PM' : mealStr === 'post-workout' ? '07:00 PM' : '08:30 PM'}
                          </span>
                          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg capitalize">{mealStr.replace('-', ' ')} Split</h3>
                        </div>
                        <button onClick={() => { setShowCustomForm(mealStr); setCfMeal(mealStr); }} className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-full transition-all cursor-pointer group border border-emerald-500/20 hover:border-emerald-500 self-start sm:self-center" title="Add Custom Food">
                          <span className="text-xs font-bold">Add Item</span>
                          <span className="text-sm font-black leading-none pb-0.5">+</span>
                        </button>
                      </div>

                      {showCustomForm === mealStr && (
                        <form onSubmit={handleAddCustomFood} className="space-y-4 animate-fade-in bg-slate-100/50 dark:bg-white/5 p-4 rounded-2xl border border-emerald-500/20 my-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">Add Custom Item to {mealStr.replace('-', ' ')}</span>
                            <button type="button" onClick={() => setShowCustomForm(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">Cancel</button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Food Name (e.g. Mom's Pasta)" value={cfName} onChange={(e) => setCfName(e.target.value)} required className="col-span-2 bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500" />
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cals (kcal)</label>
                              <input type="number" min="0" placeholder="0" value={cfCals} onChange={(e) => setCfCals(e.target.value)} required className="w-full bg-white dark:bg-zinc-900 border border-slate-300/20 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500" />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1">Protein (g)</label>
                              <input type="number" min="0" step="0.1" placeholder="0" value={cfProtein} onChange={(e) => setCfProtein(e.target.value)} required className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-emerald-500" />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1">Carbs (g)</label>
                              <input type="number" min="0" step="0.1" placeholder="0" value={cfCarbs} onChange={(e) => setCfCarbs(e.target.value)} required className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-cyan-500" />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest ml-1">Fats (g)</label>
                              <input type="number" min="0" step="0.1" placeholder="0" value={cfFats} onChange={(e) => setCfFats(e.target.value)} required className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-500" />
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

                            const stepSize = (fData.unit.startsWith('g') || fData.unit === 'ml') ? 10 : 1;

                            const adjustQty = (amount: number) => {
                              setCustomQty((prev) => ({
                                ...prev,
                                [item]: Math.max(1, (prev[item] !== undefined ? prev[item] : defaultQty) + amount),
                              }));
                            };

                            const eaten = !!eatenMeals[item];

                            return (
                              <li key={item} className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300 ${
                                eaten
                                  ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
                                  : 'bg-slate-100/50 dark:bg-white/5 border-slate-200/10 dark:border-white/5'
                              }`}>
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
                                  <span className={`text-2xl transition-all ${eaten ? 'grayscale' : ''}`}>{fData.icon}</span>
                                  <div className="min-w-0">
                                    <span className={`font-bold block leading-tight truncate ${eaten ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>{baseFood.toUpperCase()}</span>
                                    <div className="flex items-center space-x-1.5 mt-1">
                                      <button aria-label="Decrease quantity" onClick={() => adjustQty(-stepSize)} className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer leading-none font-black text-sm">-</button>
                                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest min-w-[45px] text-center">{exactQty} {fData.unit}</span>
                                      <button aria-label="Increase quantity" onClick={() => adjustQty(stepSize)} className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer leading-none font-black text-sm">+</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-2">
                                  <span className="font-mono text-sm font-black text-slate-800 dark:text-slate-100 block leading-tight">{finalCals} <span className="text-[10px] text-slate-400">kcal</span></span>
                                  <span className="font-mono text-[10px] font-bold text-slate-500 block">
                                    {finalProtein}g P • {finalCarbs}g C • {finalFat}g F
                                  </span>
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

              {/* Macro Rings — Eaten Progress */}
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
              onClick={() => { setPlanGenerated(false); setStep(3); }}
              className="flex-1 py-4 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all border border-slate-300/10 cursor-pointer"
            >
              <span>Modify Parameters</span>
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
