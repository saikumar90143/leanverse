import React from 'react';
import { ArrowLeft, User, Ruler, Activity, Crosshair, Wallet, Calendar, Apple, Scale, Utensils, WheatOff, HeartPulse, ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, Share2, Printer, Search, Plus, X, Info, Flame, Target, Star, Sparkles, AlertTriangle, RefreshCw, CalendarDays, Camera, Copy, Check, MessageCircle, Droplets, TrendingDown, UtensilsCrossed, CheckCircle } from 'lucide-react';
import { ACTIVITY_LEVELS, GOALS, TIMELINES, DIET_STYLES, FOOD_PREFS, BUDGETS, MEALS } from '../constants';

export default function DietWizard({ p }: { p: any }) {
  const { step, setStep, age, setAge, gender, setGender, height, setHeight, weight, setWeight, goal, setGoal, activity, setActivity, budget, setBudget, timeline, setTimeline, dietStyles, setDietStyles, foodPref, setFoodPref, allergies, setAllergies, selectedFoods, setSelectedFoods, searchFood, setSearchFood, homeFoodCals, setHomeFoodCals, homeFoodProtein, setHomeFoodProtein, warningMessage, setWarningMessage, proteinTip, setProteinTip, planGenerated, setPlanGenerated, premiumPlans, setPremiumPlans, planSelectionMode, setPlanSelectionMode, generating, setGenerating, isPremiumPlanUsed, setIsPremiumPlanUsed, macroQuery, setMacroQuery, macroLoading, setMacroLoading, macroError, setMacroError, macroResult, setMacroResult, macroAddedKey, setMacroAddedKey, searchMacros, addMacroResultToPlan, customQty, setCustomQty, mealAssignments, setMealAssignments, activeMealTab, setActiveMealTab, viewDateOffset, setViewDateOffset, getDisplayDate, copiedGrocery, setCopiedGrocery, handleCopyGrocery, shareText, shareWhatsapp, shareX, getActiveDateStr, activeDateStr, toggleEaten, safeWeight, safeHeight, safeAge, bmr, actMult, tdee, bmi, bmiCategory, getTargetCalories, eatenMeals, setEatenMeals, dbFoods, setDbFoods, dbFoodsLoading, setDbFoodsLoading, allFoods, handleSelectPremiumPlan, toggleDietStyle, toggleFood, handleAddCustomFood, handleGenerate, getDietCalorieTarget, calsTarget, proteinTarget, currentBmi, maxProteinCals, fatsTarget, carbsTarget, rawQtys, getSmartDefaultQty, actualCals, actualProtein, actualCarbs, actualFats, eatenCals, eatenProtein, eatenCarbs, eatenFats, isOver, isUnder, showCustomForm, setShowCustomForm, cfName, setCfName, cfCals, setCfCals, cfProtein, setCfProtein, cfCarbs, setCfCarbs, cfFats, setCfFats, cfMeal, setCfMeal, customFoodsDatabase, setCustomFoodsDatabase, handleAIFoodScan, user, router, isMounted, setIsMounted, showScanner, setShowScanner, AIFoodScanner, DIET_PLAN_KEY } = p;
  
  return (
    <div id="blueprint-card" className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border max-w-2xl mx-auto scroll-mt-24">
 <div className="flex items-center space-x-3 mb-6">
 <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
 <Apple className="w-6 h-6 animate-pulse" />
 </div>
 <div>
 <h1 className="text-xl sm:text-2xl font-black tracking-wide text-foreground">
 AI Diet Plan Blueprint
 </h1>
 <p className="text-xs text-muted mt-0.5">
 Build your complete clinical macro and grocery schedule instantly.
 </p>
 </div>
 </div>
 <div className="max-w-xs mx-auto mt-6 bg-secondary dark:bg-card/5 rounded-full h-1.5 overflow-hidden mb-8">
 <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
 </div>
{/* Step 1: Biometrics */}
 {step === 1 && (
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in max-w-xl mx-auto">
 <h2 className="text-xl font-black mb-6 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-500" /> Body Metrics & Activity</h2>
 
 <div className="grid grid-cols-2 gap-4 mb-5">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-muted uppercase tracking-wide">Age</label>
 <input type="text" inputMode="numeric" maxLength={3} value={age} onChange={e => setAge(e.target.value.replace(/[^0-9]/g, ''))}
 className="w-full bg-background border border-border rounded-xl px-4 py-3 font-black text-base sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-muted uppercase tracking-wide">Gender</label>
 <select value={gender} onChange={e => setGender(e.target.value)}
 className="w-full bg-background border border-border rounded-xl px-4 py-3 font-black focus:outline-none focus:border-emerald-500 transition-colors">
 <option value="male">Male</option>
 <option value="female">Female</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-muted uppercase tracking-wide">Height (cm)</label>
 <input type="text" inputMode="decimal" maxLength={5} value={height} onChange={e => setHeight(e.target.value.replace(/[^0-9.]/g, ''))}
 className="w-full bg-background border border-border rounded-xl px-4 py-3 font-black text-base sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-muted uppercase tracking-wide">Weight (kg)</label>
 <input type="text" inputMode="decimal" maxLength={5} value={weight} onChange={e => setWeight(e.target.value.replace(/[^0-9.]/g, ''))}
 className="w-full bg-background border border-border rounded-xl px-4 py-3 font-black text-base sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
 </div>
 </div>

 <div className="space-y-1.5 mb-8">
 <label className="text-xs font-bold text-muted uppercase tracking-wide">Activity Level</label>
 <div className="space-y-2">
 {ACTIVITY_LEVELS.map(act => (
 <button key={act.id} onClick={() => setActivity(act.id)}
 className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${activity === act.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-border hover:border-emerald-500/50'}`}>
 <div className="flex justify-between items-center">
 <span className={`font-black ${activity === act.id ? 'text-emerald-500' : 'text-foreground'}`}>{act.label}</span>
 <span className="text-xs font-medium text-muted">{act.desc}</span>
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
 <div className="glass p-4 rounded-2xl border border-border/20 dark:border-border text-center">
 <span className="text-[10px] uppercase font-black text-muted block mb-1">BMI</span>
 <span className="text-xl font-black text-foreground block">{bmi}</span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${bmiCategory === 'Normal Weight' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{bmiCategory}</span>
 </div>
 <div className="glass p-4 rounded-2xl border border-border/20 dark:border-border text-center">
 <span className="text-[10px] uppercase font-black text-muted block mb-1">BMR</span>
 <span className="text-xl font-black text-foreground block">{bmr}</span>
 <span className="text-xs font-medium text-muted mt-1 block">kcal/day</span>
 </div>
 <div className="glass p-4 rounded-2xl border border-border/20 dark:border-border text-center sm:col-span-2 bg-foreground text-white dark:bg-card/5 border-none">
 <span className="text-[10px] uppercase font-black text-emerald-400 block mb-1">Maintenance (TDEE)</span>
 <span className="text-3xl font-black block">{tdee}</span>
 <span className="text-xs font-medium text-slate-300 mt-1 block">Calories to stay exactly {weight}kg</span>
 </div>
 </div>

 <div className="glass rounded-3xl p-6 shadow-2xl border border-border/20 dark:border-border">
 <h3 className="text-sm font-black text-foreground uppercase tracking-wide mb-4 flex items-center">
 <TrendingDown className="w-4 h-4 mr-2 text-emerald-500" /> Weight Projection Matrix
 </h3>
 <div className="space-y-2">
 {[
 { label: 'Lose 0.75 kg/week', cal: tdee - 750, color: 'text-emerald-500' },
 { label: 'Lose 0.5 kg/week', cal: tdee - 500, color: 'text-emerald-500' },
 { label: 'Lose 0.25 kg/week', cal: tdee - 250, color: 'text-emerald-500' },
 { label: 'Maintain Current Weight', cal: tdee, color: 'text-muted' },
 { label: 'Gain 0.25 kg/week', cal: tdee + 250, color: 'text-amber-500' },
 { label: 'Gain 0.5 kg/week', cal: tdee + 500, color: 'text-amber-500' },
 ].map((proj, i) => (
 <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-background dark:bg-card/5 border border-slate-100 dark:border-border">
 <span className="text-sm font-bold text-foreground">{proj.label}</span>
 <span className={`text-sm font-black ${proj.color}`}>{proj.cal} kcal/day</span>
 </div>
 ))}
 </div>
 </div>

 <div className="flex gap-3">
 <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl bg-secondary dark:bg-card/5 text-muted font-bold hover:bg-secondary dark:hover:bg-card/10 transition-colors">
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
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in max-w-xl mx-auto">
 <h2 className="text-xl font-black mb-6 flex items-center"><Target className="w-5 h-5 mr-2 text-emerald-500" /> What is your primary goal?</h2>
 <div className="grid grid-cols-1 gap-3 mb-8">
 {GOALS.map(g => {
 const Icon = g.icon;
 const active = goal === g.id;
 return (
 <button key={g.id} onClick={() => setGoal(g.id)} aria-pressed={active}
 className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${active ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-border hover:border-emerald-500/30'}`}>
 <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${active ? 'bg-emerald-500 text-white' : 'bg-secondary dark:bg-card/10 text-muted'}`}>
 <Icon className="w-6 h-6" />
 </div>
 <div>
 <h3 className={`font-black text-lg ${active ? 'text-emerald-500' : 'text-foreground'}`}>{g.label}</h3>
 <p className="text-xs text-muted font-medium mt-0.5">{g.desc}</p>
 </div>
 </button>
 )
 })}
 </div>
 <div className="flex gap-3">
 <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl bg-secondary dark:bg-card/5 text-muted font-bold hover:bg-secondary transition-colors"><ChevronLeft className="w-5 h-5" /></button>
 <button onClick={() => setStep(4)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all">Continue</button>
 </div>
 </div>
 )}

 {/* Step 4: Timeline */}
 {step === 4 && (
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in max-w-xl mx-auto">
 <h2 className="text-xl font-black mb-2 flex items-center"><CalendarDays className="w-5 h-5 mr-2 text-emerald-500" /> Transformation Timeline</h2>
 <p className="text-sm text-muted font-medium mb-6">How quickly do you want to reach your goal?</p>
 
 <div className="grid grid-cols-2 gap-3 mb-8">
 {TIMELINES.map(t => (
 <button key={t.id} onClick={() => setTimeline(t.id)} aria-pressed={timeline === t.id}
 className={`py-4 rounded-2xl border-2 transition-all font-black ${timeline === t.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-100 dark:border-border text-muted hover:border-emerald-500/30'}`}>
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
 <button onClick={() => setStep(3)} className="px-6 py-4 rounded-xl bg-secondary text-muted font-bold hover:bg-secondary transition-colors shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
 <button onClick={() => setStep(5)} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20">Continue</button>
 </div>
 </div>
 )}

 {/* Step 5: Diet Style */}
 {step === 5 && (
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in max-w-xl mx-auto">
 <h2 className="text-xl font-black mb-2 flex items-center"><UtensilsCrossed className="w-5 h-5 mr-2 text-emerald-500" /> Diet Style Preferences</h2>
 <p className="text-sm text-muted font-medium mb-6">Select all that apply.</p>
 
 <div className="flex flex-wrap gap-2 mb-8">
 {DIET_STYLES.map(style => {
 const active = dietStyles.includes(style);
 return (
 <button key={style} onClick={() => toggleDietStyle(style)}
 className={`px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all flex items-center ${active ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'border-border text-muted hover:border-emerald-500/50'}`}>
 {active && <Check className="w-4 h-4 mr-1" />}
 {style}
 </button>
 )
 })}
 </div>

 <div className="flex gap-3 sticky bottom-4 z-10 pt-4">
 <button onClick={() => setStep(4)} className="px-6 py-4 rounded-xl bg-secondary text-muted font-bold hover:bg-secondary transition-colors shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
 <button onClick={() => setStep(6)} disabled={dietStyles.length === 0} className="flex-1 py-4 bg-emerald-500 disabled:opacity-50 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20">Continue</button>
 </div>
 </div>
 )}

 {/* Step 6: Branching Logic */}
 {step === 6 && !planSelectionMode && (
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in max-w-xl mx-auto text-center">
 <h2 className="text-2xl font-black mb-6 text-foreground">How would you like to build your plan?</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
 <button 
    onClick={() => {
      if (user?.tier === 'free') {
        router.push('/pricing');
      } else {
        setPlanSelectionMode('premium');
      }
    }} 
    className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${user?.tier === 'free' ? 'border-border/10 bg-card/5 hover:border-emerald-500/50 hover:shadow-emerald-500/10' : 'border-slate-100 dark:border-border bg-background dark:bg-card/5 hover:border-emerald-500 hover:bg-emerald-500/5'}`}
  >
  {user?.tier === 'free' && (
    <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-md text-[9px] font-black uppercase flex items-center">
      <Star className="w-3 h-3 mr-1" /> Pro Feature
    </div>
  )}
  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${user?.tier === 'free' ? 'bg-muted/10' : 'bg-amber-500/10'}`}>
  <Star className={`w-6 h-6 ${user?.tier === 'free' ? 'text-muted' : 'text-amber-500'}`} />
  </div>
  <h3 className="font-black text-lg mb-1 text-foreground">Premium Plans</h3>
  <p className="text-xs text-muted font-medium leading-relaxed">Choose an expertly crafted plan. {user?.tier === 'free' ? 'Upgrade to access.' : 'It will automatically scale perfectly to your target.'}</p>
  </button>
 
 <button onClick={() => setPlanSelectionMode('ai')} className="p-6 rounded-2xl border-2 border-slate-100 dark:border-border bg-background dark:bg-card/5 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-left">
 <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
 <Sparkles className="w-6 h-6 text-cyan-500" />
 </div>
 <h3 className="font-black text-lg mb-1 text-foreground">Custom AI Plan</h3>
 <p className="text-xs text-muted font-medium leading-relaxed">Pick your exact favorite ingredients. The AI will compute perfect macros for you from scratch.</p>
 </button>
 </div>
 <button onClick={() => setStep(5)} className="px-8 py-3 rounded-xl bg-secondary dark:bg-card/5 text-muted font-bold hover:bg-secondary transition-colors">Back</button>
 </div>
 )}

 {step === 6 && planSelectionMode === 'premium' && (
 <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 dark:border-border animate-fade-in max-w-2xl mx-auto">
 <h2 className="text-xl font-black mb-2 flex items-center text-foreground"><Star className="w-6 h-6 mr-2 text-amber-500" /> LeanVerse Premium Plans</h2>
 <p className="text-sm text-muted font-medium mb-6">Our Auto-Scaling Engine will mathematically adjust these pre-made plans to perfectly hit your exact TDEE calories.</p>
 
 <div className="space-y-3 mb-8">
  {(() => {
    const filteredPremiumPlans = (premiumPlans || []).filter((plan: any) => {
      if (!plan.dietStyle || plan.dietStyle === 'Any') return true;
      return (dietStyles || []).includes(plan.dietStyle);
    });

    return filteredPremiumPlans.length === 0 ? (
      <p className="text-center text-muted py-10 font-medium bg-background dark:bg-card/5 rounded-2xl">No premium plans available right now.</p>
    ) : (
      <>
        {filteredPremiumPlans.map((plan: any) => (
          <button key={plan._id} onClick={() => handleSelectPremiumPlan(plan)}
          className="w-full text-left p-4 bg-card border-2 border-slate-100 dark:border-border rounded-2xl flex justify-between items-center hover:border-emerald-500 hover:shadow-lg transition-all group">
            <div>
              <h3 className="font-black text-foreground text-lg">{plan.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">{plan.goal}</span>
                <span className="text-xs font-bold text-muted">{plan.durationDays} Days</span>
                <span className="text-xs font-bold text-amber-500">• Auto-Scales</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <ChevronRight className="text-muted group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </>
    );
  })()}
 </div>
 
 <button onClick={() => setPlanSelectionMode(null)} className="px-8 py-3 rounded-xl bg-secondary dark:bg-card/5 text-muted font-bold hover:bg-secondary transition-colors">Back</button>
 </div>
 )}

 {step === 6 && planSelectionMode === 'ai' && (
 <div className="space-y-5 animate-fade-in">
 <span className="text-xs font-black text-muted uppercase tracking-widest block mb-1">Step 6: Your Food Preferences</span>
 <p className="text-xs text-muted mb-4">We are creating a highly-customized diet plan specifically for you. Select the exact foods you want to eat for each meal below, and our AI will calculate the perfect portions to hit your goals!</p>
 
 <div className="flex space-x-3 mb-6">
 <button
 type="button"
 onClick={() => setPlanSelectionMode(null)}
 className="flex-1 py-3 bg-secondary/50 dark:bg-card/5 text-muted dark:text-slate-350 rounded-2xl font-bold transition-all cursor-pointer"
 >
 Back
 </button>
 <button
 type="button"
 onClick={handleGenerate}
 disabled={generating || selectedFoods.length < 5}
 className={`flex-1 py-3 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1 ${
 generating || selectedFoods.length < 5 
 ? 'bg-secondary/80 text-muted cursor-not-allowed border border-border/10' 
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
 <button key={meal} type="button" onClick={() => setActiveMealTab(meal)} className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-colors ${activeMealTab === meal ? 'bg-emerald-500 text-white shadow-md' : 'bg-secondary/50 dark:bg-card/5 text-muted hover:bg-slate-300/50 dark:hover:bg-card/10'}`}>
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
 className="flex-1 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:border-emerald-500 font-bold"
 />
 <button
 type="button"
 onClick={() => setShowScanner(true)}
 className="bg-secondary/50 hover:bg-secondary dark:bg-card/5 dark:hover:bg-card/10 text-muted rounded-xl px-4 flex items-center justify-center transition-colors cursor-pointer"
 title="AI Food Recognition"
 >
 <Camera className="w-5 h-5" />
 </button>
 </div>

 <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
 {dbFoodsLoading ? (
    <div className="col-span-full py-10 flex flex-col items-center justify-center text-muted">
      <RefreshCw className="w-6 h-6 animate-spin mb-3 text-emerald-500" />
      <span className="font-bold text-sm">Loading food database...</span>
    </div>
  ) : Object.keys(allFoods)
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
 
 const isSelected = selectedFoods.includes(`${food}|${activeMealTab}`);
 if (isSelected) return true;

 // If the user is actively searching, show all matches regardless of category
 if (searchFood.trim() !== '') return matchesSearch;
 // Otherwise, only show foods belonging to the active meal tab
 return matchesTab;
 })
 .sort((a, b) => {
    const aSelected = selectedFoods.includes(`${a}|${activeMealTab}`);
    const bSelected = selectedFoods.includes(`${b}|${activeMealTab}`);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.localeCompare(b);
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
 : 'border-border/10 bg-secondary/50 dark:bg-card/5 text-muted hover:border-slate-500/20'
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
 <div className="space-y-3.5 border-t border-border/10 pt-4 animate-fade-in">
 <div className="grid grid-cols-2 gap-4 text-xs font-extrabold p-3 bg-secondary/50 dark:bg-card/5 rounded-2xl border border-border/5">
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
  );
}