import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/layout/AuthProvider';
import { getUserStorageKey, formatLocalDate } from '@/lib/storage';
import { ACTIVITY_LEVELS, GOALS, TIMELINES, DIET_STYLES, FOOD_PREFS, BUDGETS, MEALS, WORKOUT_TYPES, WORKOUT_DAYS, FoodItem } from './constants';

export function useDietPlanner() {
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

 // Scroll to top on every step change
 useEffect(() => {
   window.scrollTo({ top: 0, behavior: 'smooth' });
 }, [step]);
 
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
 const [isPremiumPlanUsed, setIsPremiumPlanUsed] = useState(false);

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
 const [customFoodsDatabase, setCustomFoodsDatabase] = useState<Record<string, { cals: number; protein: number; carbs: number; fat: number; alternative: string; warning?: string; icon: string; category: string; unit: string; baseQty: number; servingWeight?: number; hidden?: boolean }>>(() => {
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

 // AI Scanner State
 const [showScanner, setShowScanner] = useState(false);
  const handleAIFoodScan = (items: any[]) => {
    setShowScanner(false);
    
    items.forEach(item => {
      const baseFoodId = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      setCustomFoodsDatabase(prev => ({
        ...prev,
        [baseFoodId]: {
          cals: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          alternative: item.healthy_alternative,
          icon: '🍽️',
          category: item.mealSlot,
          unit: 'g',
          baseQty: item.weight_grams
        }
      }));
      
      setSelectedFoods(prev => {
        const entry = `${baseFoodId}|${item.mealSlot}`;
        if (!prev.includes(entry)) {
          return [...prev, entry];
        }
        return prev;
      });
    });
    
    alert(`Added ${items.length} AI detected items to your plan!`);
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
 // Migrate guest data → user key when user just logged in
 const guestKey = 'leanverse_diet_plan_guest';
 const userRaw = localStorage.getItem(DIET_PLAN_KEY);
 const guestRaw = localStorage.getItem(guestKey);
 if (!userRaw && guestRaw && DIET_PLAN_KEY !== guestKey) {
 // Copy guest progress into user key, then clean up
 localStorage.setItem(DIET_PLAN_KEY, guestRaw);
 localStorage.removeItem(guestKey);
 }

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
 if (saved.isPremiumPlanUsed === true) setIsPremiumPlanUsed(true);
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
  const toSave = { age, gender, height, weight, goal, activity, budget, foodPref, allergies, selectedFoods, customQty, mealAssignments, planGenerated, step, isPremiumPlanUsed };
  localStorage.setItem(DIET_PLAN_KEY, JSON.stringify(toSave));
  } catch {
  // quota exceeded or private mode — ignore
  }
  }, [age, gender, height, weight, goal, activity, budget, foodPref, allergies, selectedFoods, customQty, mealAssignments, planGenerated, step, isPremiumPlanUsed]);

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
 const [dbFoodsLoading, setDbFoodsLoading] = useState(true);
 
 useEffect(() => {
 setDbFoodsLoading(true);
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
 dietStyles: f.dietStyle || [],
 servingWeight: f.servingWeight || 100
 };
 return acc;
 }, {});
 setDbFoods(formatted);
 }
 }).catch(err => console.error(err))
 .finally(() => setDbFoodsLoading(false));

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
  
  const newSelectedFoods: string[] = [];
  const newCustomQty: Record<string, number> = {};
  const newMealAssignments: Record<string, string> = {};

  plan.meals.forEach((meal: any) => {
  const mealName = meal.name.toLowerCase();
  meal.foods.forEach((f: any) => {
  if (!f.foodItem) return;
  const foodBaseName = f.foodItem.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const compositeKey = `${foodBaseName}|${mealName}`;
  
  // f.quantity is the number of servings defined in the admin dashboard.
  // We use it directly because dbFoods have baseQty=1.
  const totalQty = f.quantity;

  if (!newSelectedFoods.includes(compositeKey)) {
  newSelectedFoods.push(compositeKey);
  }
  newCustomQty[compositeKey] = totalQty;
  newMealAssignments[compositeKey] = mealName;
  });
  });

  setSelectedFoods(newSelectedFoods);
  setCustomQty(newCustomQty);
  setEatenMeals({});
  setIsPremiumPlanUsed(true);
  
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
    if (!selectedFoods.includes(compositeKey)) {
      setSearchFood(''); // Clear search when adding new food
    }
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
 router.push('/login?redirect=%2Fdiet-planner');
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
 setIsPremiumPlanUsed(false);
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

 

 

  return {
    isMounted,
    setIsMounted,
    isStateLoaded,
    setIsStateLoaded,
    user,
    router,
    step,
    setStep,
    age,
    setAge,
    gender,
    setGender,
    height,
    setHeight,
    weight,
    setWeight,
    goal,
    setGoal,
    activity,
    setActivity,
    budget,
    setBudget,
    timeline,
    setTimeline,
    dietStyles,
    setDietStyles,
    foodPref,
    setFoodPref,
    allergies,
    setAllergies,
    selectedFoods,
    setSelectedFoods,
    searchFood,
    setSearchFood,
    homeFoodCals,
    setHomeFoodCals,
    homeFoodProtein,
    setHomeFoodProtein,
    warningMessage,
    setWarningMessage,
    proteinTip,
    setProteinTip,
    planGenerated,
    setPlanGenerated,
    premiumPlans,
    setPremiumPlans,
    planSelectionMode,
    setPlanSelectionMode,
    generating,
    setGenerating,
    isPremiumPlanUsed,
    setIsPremiumPlanUsed,
    macroQuery,
    setMacroQuery,
    macroLoading,
    setMacroLoading,
    macroError,
    setMacroError,
    macroResult,
    setMacroResult,
    macroAddedKey,
    setMacroAddedKey,
    searchMacros,
    addMacroResultToPlan,
    customQty,
    setCustomQty,
    mealAssignments,
    setMealAssignments,
    activeMealTab,
    setActiveMealTab,
    viewDateOffset,
    setViewDateOffset,
    getDisplayDate,
    copiedGrocery,
    setCopiedGrocery,
    handleCopyGrocery,
    shareText,
    shareWhatsapp,
    shareX,
    getActiveDateStr,
    activeDateStr,
    toggleEaten,
    safeWeight,
    safeHeight,
    safeAge,
    bmr,
    actMult,
    tdee,
    bmi,
    bmiCategory,
    getTargetCalories,
    eatenMeals,
    setEatenMeals,
    dbFoods,
    setDbFoods,
    dbFoodsLoading,
    setDbFoodsLoading,
    allFoods,
    handleSelectPremiumPlan,
    toggleDietStyle,
    toggleFood,
    handleAddCustomFood,
    handleGenerate,
    getDietCalorieTarget,
    calsTarget,
    proteinTarget,
    currentBmi,
    maxProteinCals,
    fatsTarget,
    carbsTarget,
    rawQtys,
    getSmartDefaultQty,
    actualCals,
    actualProtein,
    actualCarbs,
    actualFats,
    eatenCals,
    eatenProtein,
    eatenCarbs,
    eatenFats,
    isOver,
    isUnder,
    showCustomForm,
    setShowCustomForm,
    cfName,
    setCfName,
    cfCals,
    setCfCals,
    cfProtein,
    setCfProtein,
    cfCarbs,
    setCfCarbs,
    cfFats,
    setCfFats,
    cfMeal,
    setCfMeal,
    customFoodsDatabase,
    setCustomFoodsDatabase,
    handleAIFoodScan
  };
}
