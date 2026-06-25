import React from 'react';
import { ArrowLeft, User, Ruler, Activity, Crosshair, Wallet, Calendar, Apple, Scale, Utensils, WheatOff, HeartPulse, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, Share2, Printer, Search, Plus, X, Info, Flame, Target, Star, Sparkles, AlertTriangle, RefreshCw, CalendarDays, Camera, Copy, Check, MessageCircle, Droplets, TrendingDown, UtensilsCrossed, CheckCircle } from 'lucide-react';
import MacroRings from '@/components/shared/MacroRings';
import { MEALS } from '../constants';

export default function DietPlanViewer({ p }: { p: any }) {
  const { planGenerated, setPlanGenerated, setStep, setPlanSelectionMode, setIsPremiumPlanUsed, isPremiumPlanUsed, setCopiedGrocery, getDisplayDate, activeDateStr, changeDate, actualCals, calsTarget, actualProtein, proteinTarget, actualCarbs, carbsTarget, actualFats, fatsTarget, isOver, isUnder, homeFoodCals, homeFoodProtein, warningMessage, proteinTip, activeMealTab, setActiveMealTab, allFoods, customQty, eatenMeals, toggleEaten, showCustomForm, setShowCustomForm, cfMeal, setCfMeal, cfName, setCfName, cfCals, setCfCals, cfProtein, setCfProtein, cfCarbs, setCfCarbs, cfFats, setCfFats, handleAddCustomFood, searchFood, setSearchFood, macroQuery, setMacroQuery, searchMacros, macroLoading, macroError, macroResult, addMacroResultToPlan, macroAddedKey, toggleFood, mealAssignments, selectedFoods, copiedGrocery, handleCopyGrocery, shareWhatsapp, shareX, getDietCalorieTarget, AIFoodScanner, handleAIFoodScan, showScanner, setShowScanner, age, gender, goal, DIET_PLAN_KEY, setSelectedFoods, setCustomQty, setMealAssignments, viewDateOffset, eatenProtein, eatenCarbs, eatenFats, eatenCals, getSmartDefaultQty } = p;
  
  return ( <>
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
 <h1 className="text-2xl sm:text-3xl font-black text-foreground">
 LeanVerse Custom Meal Split
 </h1>
 <p className="text-xs text-muted mt-1 max-w-xl leading-relaxed">
 Caloric metrics generated using dynamic Mifflin formulas tailored specifically for a {age}-year old {gender} targeting <span className="font-bold">{goal === 'fat_loss' ? 'Fat Loss Deficit' : goal === 'muscle' ? 'Lean Mass Growth' : 'Maintenance'}</span>.
 </p>
 </div>

 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 no-print">
 <div className="flex flex-wrap gap-3">
 <button
 onClick={() => { setPlanGenerated(false); setStep(6); setPlanSelectionMode('ai'); }}
 className="px-4 py-2.5 rounded-xl border border-border/10 bg-secondary/50 dark:bg-card/5 hover:bg-emerald-500/10 text-muted hover:text-emerald-500 font-bold transition-all cursor-pointer flex items-center space-x-1 text-sm"
 >
 <RefreshCw className="w-4 h-4" />
 <span className="whitespace-nowrap">Adjust Foods</span>
 </button>
 <button
 onClick={() => { setPlanGenerated(false); setStep(1); setSelectedFoods([]); setCustomQty({}); setMealAssignments({}); try { localStorage.removeItem(DIET_PLAN_KEY); } catch {} }}
 className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all cursor-pointer flex items-center space-x-1 text-sm"
 >
 <X className="w-4 h-4" />
 <span className="whitespace-nowrap">Reset</span>
 </button>

 </div>
 </div>
 </div>

  {/* Macro Rings + Macro Breakdown cards Side by Side */}
  <div className="flex flex-row gap-2 sm:gap-4 print-card mt-4">
    <div className="flex-1 grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4">
  <div className={`glass p-3 sm:p-5 rounded-2xl border transition-colors duration-300 flex flex-col justify-center ${isOver(actualCals, calsTarget) ? 'border-red-500/50 bg-red-500/5' : 'border-border/10'}`}>
  <span className="text-[9px] sm:text-[10px] text-muted font-extrabold uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Calories</span>
  <span className={`text-lg sm:text-2xl md:text-3xl font-black block leading-none ${isOver(actualCals, calsTarget) ? 'text-red-500' : 'text-foreground'}`}>
  {actualCals} <span className="text-[10px] sm:text-base md:text-xl text-muted font-bold block sm:inline">/ {calsTarget}</span> <span className="hidden sm:inline text-[10px] sm:text-xs text-muted font-bold ml-1">kcal</span>
  </span>
  </div>
  
  <div className={`glass p-3 sm:p-5 rounded-2xl border transition-colors duration-300 flex flex-col justify-center ${isUnder(actualProtein, proteinTarget) ? 'border-amber-500/50 bg-amber-500/5' : isOver(actualProtein, proteinTarget * 1.3) ? 'border-red-500/50 bg-red-500/5' : 'border-border/10'}`}>
  <span className="text-[9px] sm:text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Protein</span>
  <span className={`text-lg sm:text-2xl md:text-3xl font-black block leading-none ${isUnder(actualProtein, proteinTarget) ? 'text-amber-500' : isOver(actualProtein, proteinTarget * 1.3) ? 'text-red-500' : 'text-emerald-500'}`}>
  {actualProtein} <span className="text-[10px] sm:text-base md:text-xl text-muted font-bold block sm:inline">/ {proteinTarget}g</span>
  </span>
  </div>
  
  <div className={`glass p-3 sm:p-5 rounded-2xl border transition-colors duration-300 flex flex-col justify-center ${isOver(actualCarbs, carbsTarget) ? 'border-red-500/50 bg-red-500/5' : 'border-border/10'}`}>
  <span className="text-[9px] sm:text-[10px] text-cyan-500 font-extrabold uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Carbs</span>
  <span className={`text-lg sm:text-2xl md:text-3xl font-black block leading-none ${isOver(actualCarbs, carbsTarget) ? 'text-red-500' : 'text-cyan-500'}`}>
  {actualCarbs} <span className="text-[10px] sm:text-base md:text-xl text-muted font-bold block sm:inline">/ {carbsTarget}g</span>
  </span>
  </div>
  
  <div className={`glass p-3 sm:p-5 rounded-2xl border transition-colors duration-300 flex flex-col justify-center ${isOver(actualFats, fatsTarget) ? 'border-red-500/50 bg-red-500/5' : 'border-border/10'}`}>
  <span className="text-[9px] sm:text-[10px] text-amber-500 font-extrabold uppercase tracking-widest block mb-0.5 sm:mb-1 truncate">Fats</span>
  <span className={`text-lg sm:text-2xl md:text-3xl font-black block leading-none ${isOver(actualFats, fatsTarget) ? 'text-red-500' : 'text-amber-500'}`}>
  {actualFats} <span className="text-[10px] sm:text-base md:text-xl text-muted font-bold block sm:inline">/ {fatsTarget}g</span>
  </span>
  </div>
  </div>
  <div className="w-[38%] sm:w-1/3 md:w-1/4 glass rounded-2xl sm:rounded-3xl border border-border/10 flex flex-col items-center justify-center py-4 px-1 shadow-sm shrink-0">
  <span className="text-[10px] font-black text-muted uppercase tracking-widest block mb-2 text-center">Today's Eaten</span>
  <div className="scale-[0.55] sm:scale-75 md:scale-90 origin-top -mb-16 sm:-mb-10 md:-mb-4">
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
  </div>
  </div>

  
  </div>

  {/* Premium Plan Warning */}
  {isPremiumPlanUsed && (
  <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start space-x-3 text-cyan-600 dark:text-cyan-400 animate-fade-in print-hide">
  <Info className="w-5 h-5 shrink-0 mt-0.5" />
  <div className="text-sm font-bold leading-snug">
  Note: You are viewing a Premium Plan with its original serving sizes. Please adjust foods according to your daily target using the <span className="font-black text-cyan-500">-</span> and <span className="font-black text-cyan-500">+</span> buttons!
  </div>
  </div>
  )}

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
 <span className="text-xs font-black text-muted uppercase tracking-widest self-start sm:self-center">Your Daily Meal Splits</span>
 
 <div className="flex items-center space-x-3 bg-secondary/50 dark:bg-card/5 p-1 rounded-full border border-border/50 dark:border-border self-start sm:self-center">
 <button 
 aria-label="Previous Day"
 onClick={() => changeDate(-1)} 
 className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card dark:hover:bg-secondary text-muted hover:text-emerald-500 transition-colors shadow-sm cursor-pointer"
 title="Previous Day"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 
 <div className="flex items-center space-x-2 px-2">
 <CalendarDays className="w-4 h-4 text-emerald-500" />
 <span className="text-xs font-black text-foreground uppercase tracking-wider">
 {viewDateOffset === 0 ? 'Today' : viewDateOffset === -1 ? 'Yesterday' : activeDateStr}
 </span>
 </div>
 
 <button 
 aria-label="Next Day"
 onClick={() => changeDate(1)} 
 disabled={viewDateOffset >= 0}
 className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors shadow-sm ${
 viewDateOffset >= 0 
 ? 'opacity-30 cursor-not-allowed text-muted' 
 : 'hover:bg-card dark:hover:bg-secondary text-muted hover:text-emerald-500 cursor-pointer'
 }`}
 title="Next Day"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 
 {selectedFoods.length === 0 ? (
 <div className="glass p-6 rounded-3xl border border-border/10 space-y-4 text-center">
 <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
 <p className="text-muted font-bold">You didn't select any foods from your kitchen.</p>
 <button 
 onClick={() => { setPlanGenerated(false); setStep(3); }}
 className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all cursor-pointer"
 >
 Go Back and Pick Foods
 </button>
 </div>
 ) : (
 ['breakfast', 'lunch', 'pre-workout', 'post-workout', 'dinner'].map((mealStr: string) => {
 const mealItems = selectedFoods.filter((f: any) => (f.includes('|') ? f.split('|')[1] : allFoods[f].category) === mealStr);
 
 return (
 <div key={mealStr} className="glass p-6 rounded-3xl border border-border/10 space-y-4">
 <div className="flex flex-row justify-between items-center gap-2 pb-3.5 border-b border-border/10">
 <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
 <span className="px-2 sm:px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] sm:text-xs font-bold font-mono">
 {mealStr === 'breakfast' ? '08:00 AM' : mealStr === 'lunch' ? '01:30 PM' : mealStr === 'pre-workout' ? '04:30 PM' : mealStr === 'post-workout' ? '07:00 PM' : '08:30 PM'}
 </span>
 <h3 className="font-extrabold text-foreground text-sm sm:text-lg capitalize">{mealStr.replace('-', ' ')} Split</h3>
 </div>
 <button onClick={() => { setShowCustomForm(showCustomForm === mealStr ? null : mealStr); setCfMeal(mealStr); }} className={`flex items-center justify-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-full transition-all cursor-pointer group border shrink-0 ${showCustomForm === mealStr ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border-emerald-500/20 hover:border-emerald-500'}`} title="Add Custom Food">
 <span className="text-[10px] sm:text-xs font-bold">{showCustomForm === mealStr ? 'Cancel' : 'Add Item'}</span>
 <span className={`text-xs sm:text-sm font-black leading-none pb-0.5 transition-transform duration-300 ${showCustomForm === mealStr ? 'rotate-45' : ''}`}>+</span>
 </button>
 </div>

 {showCustomForm === mealStr && (
 <form onSubmit={handleAddCustomFood} className="space-y-4 animate-fade-in bg-secondary/50 dark:bg-card/5 p-4 rounded-2xl border border-emerald-500/20 my-4">
 <div className="flex justify-between items-center mb-2">
 <span className="text-sm font-black text-foreground">Add Custom Item to {mealStr.replace('-', ' ')}</span>
 </div>
 <div className="grid grid-cols-2 gap-3 mb-4">
 <input type="text" placeholder="Food Name (e.g. Mom's Pasta)" value={cfName} onChange={(e) => setCfName(e.target.value)} required className="col-span-2 bg-card border border-border/20 dark:border-border rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-emerald-500" />
 <div className="col-span-2 flex space-x-2">
 <input type="number" inputMode="numeric" pattern="[0-9]*" min="0" placeholder="0" value={cfCals} onChange={(e) => setCfCals(e.target.value)} required className="w-full bg-card border border-border/20 dark:border-border rounded-xl px-3 py-2 text-base sm:text-sm font-bold focus:outline-none focus:border-emerald-500" />
 <span className="flex-shrink-0 flex items-center justify-center bg-secondary dark:bg-card/5 text-muted text-xs font-bold rounded-xl px-4">kcal</span>
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
 <p className="text-xs text-muted font-bold px-2 py-2 italic opacity-50">No items assigned to this meal.</p>
 ) : (
 <ul className="space-y-3 text-sm text-muted">
 {mealItems.map((item: any) => {
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
 setCustomQty((prev: any) => {
 const current = prev[item] !== undefined ? prev[item] : defaultQty;
 const next = isDiscrete ? Math.round(current + amount) : Math.round((current + amount) * 10) / 10;
 return {
 ...prev,
 [item]: Math.max(isGrams || isDiscrete ? 1 : 0.1, next),
 };
 });
 };
 
 const sw = fData.servingWeight || 100;
 const isLiquid = u.includes('ml') || u.includes('cup') || u.includes('glass') || baseFood.includes('milk') || baseFood.includes('juice') || baseFood.includes('water') || baseFood.includes('shake') || baseFood.includes('oil');
 const weightStr = (sw > 0 && !isGrams) ? ` (${sw}${isLiquid ? 'ml' : 'g'})` : '';

 const eaten = !!eatenMeals[item];

 return (
 <li key={item} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-xl border transition-all duration-300 gap-2 sm:gap-0 ${
 eaten
 ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
 : 'bg-secondary/50 dark:bg-card/5 border-border/10 dark:border-border'
 }`}>
 <div className="flex items-center w-full sm:w-auto flex-1 min-w-0">
 {/* Eaten checkbox */}
 <button
 aria-label={eaten ? "Mark as not eaten" : "Mark as eaten"}
 onClick={() => toggleEaten(item)}
 className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center mr-3 transition-all cursor-pointer ${
 eaten
 ? 'bg-emerald-500 border-emerald-500 text-white'
 : 'border-border dark:border-white/20 hover:border-emerald-400'
 }`}
 title={eaten ? 'Mark as not eaten' : 'Mark as eaten'}
 >
 {eaten && <CheckCircle2 className="w-3.5 h-3.5" />}
 </button>

 <div className="flex items-center space-x-3 flex-1 min-w-0">
 <span className={`text-2xl transition-all shrink-0 ${eaten ? 'grayscale' : ''}`}>{fData.icon}</span>
 <div className="min-w-0 flex-1">
 <div className="flex justify-between items-start gap-2">
 <span className={`font-bold block leading-tight truncate ${eaten ? 'line-through text-muted' : 'text-foreground'}`}>{baseFood.toUpperCase()}</span>
 <span className="font-mono text-sm font-black text-foreground block leading-tight sm:hidden shrink-0">{finalCals} <span className="text-[10px] text-muted">kcal</span></span>
 </div>
 <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
 <div className="flex items-center space-x-1">
 <button aria-label="Decrease quantity" onClick={() => adjustQty(-stepSize)} className="w-5 h-5 flex items-center justify-center rounded-md bg-secondary/80 dark:bg-card/10 text-muted hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer leading-none font-black text-sm">-</button>
 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest min-w-[25px] text-center">{exactQty}</span>
 <button aria-label="Increase quantity" onClick={() => adjustQty(stepSize)} className="w-5 h-5 flex items-center justify-center rounded-md bg-secondary/80 dark:bg-card/10 text-muted hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer leading-none font-black text-sm">+</button>
 </div>
 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-1">{fData.unit}{weightStr}</span>
 <span className="font-mono text-[10px] font-bold text-muted bg-secondary/50 dark:bg-card/5 px-2 py-0.5 rounded-md truncate max-w-full">
 {finalProtein}g P • {finalCarbs}g C • {finalFat}g F
 </span>
 </div>
 </div>
 </div>
 </div>
 <div className="text-right ml-2 shrink-0 hidden sm:block">
 <span className="font-mono text-sm font-black text-foreground block leading-tight">{finalCals} <span className="text-[10px] text-muted">kcal</span></span>
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
  {/* Swap list */}
  <div className="glass p-6 rounded-3xl border border-border/10 space-y-4">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Alternative Swaps</span>
 <div className="space-y-3.5 text-xs">
 <div className="pb-3 border-b border-border/10">
 <span className="font-bold text-muted uppercase tracking-wide block mb-1">Dosa & Idli alternate</span>
 <p className="text-muted leading-relaxed font-semibold">Swap for Oats Dosa or Moong Dal Chilla to increase fiber, protein, and lower insulin spiking.</p>
 </div>
 <div className="pb-3 border-b border-border/10">
 <span className="font-bold text-muted uppercase tracking-wide block mb-1">White Rice alternate</span>
 <p className="text-muted leading-relaxed font-semibold">Swap for Cauliflower Rice, Quinoa, or high-fiber Basmati brown rice.</p>
 </div>
 <div>
 <span className="font-bold text-muted uppercase tracking-wide block mb-1">Standard Paneer alternate</span>
 <p className="text-muted leading-relaxed font-semibold">Swap for Low-Fat Paneer or Organic Tofu to cut lipid fats in half.</p>
 </div>
 </div>
 </div>

 {/* Supplements suggested */}
 <div className="glass p-6 rounded-3xl border border-border/10 space-y-4">
 <span className="text-xs font-black text-muted uppercase tracking-widest block">Suggested Supplements</span>
 <ul className="space-y-3.5 text-xs">
 <li className="flex items-center justify-between pb-2.5 border-b border-border/10">
 <div>
 <span className="font-extrabold text-foreground block">Whey Protein Isolate</span>
 <span className="text-muted font-bold block mt-0.5">1 scoop post-workout</span>
 </div>
 </li>
 <li className="flex items-center justify-between pb-2.5 border-b border-border/10">
 <div>
 <span className="font-extrabold text-foreground block">Creatine Monohydrate</span>
 <span className="text-muted font-bold block mt-0.5">3g daily for strength</span>
 </div>
 </li>
 <li className="flex items-center justify-between">
 <div>
 <span className="font-extrabold text-foreground block">Multivitamins & Omega-3</span>
 <span className="text-muted font-bold block mt-0.5">1 softgel with breakfast</span>
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
 className="flex-1 py-4 bg-secondary/50 hover:bg-secondary dark:bg-card/5 dark:hover:bg-card/10 text-foreground rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all border border-border/10 cursor-pointer"
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
 className="px-6 py-4 bg-secondary/50 hover:bg-[#25D366]/10 text-muted hover:text-[#25D366] dark:bg-card/5 dark:text-muted dark:hover:bg-[#25D366]/20 border border-border/10 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer"
 >
 <MessageCircle className="w-5 h-5" />
 </a>
 <a 
 href={shareX}
 target="_blank"
 rel="noopener noreferrer"
 className="px-6 py-4 bg-secondary/50 hover:bg-[#1DA1F2]/10 text-muted hover:text-[#1DA1F2] dark:bg-card/5 dark:text-muted dark:hover:bg-[#1DA1F2]/20 border border-border/10 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer"
 >
 <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.925H5.022z"></path></svg>
 </a>
 </div>
 </div>
 </div>

 {showScanner && (
 <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm overflow-y-auto pt-10 px-4 pb-20">
   <div className="max-w-2xl mx-auto relative">
     <button onClick={() => setShowScanner(false)} className="absolute -top-4 right-0 p-2 bg-secondary rounded-full z-[110] shadow-md hover:bg-red-500 hover:text-white transition-colors">
       <X className="w-5 h-5" />
     </button>
     <AIFoodScanner onResult={handleAIFoodScan} onClose={() => setShowScanner(false)} />
   </div>
 </div>
 )}
  </>
  );
}