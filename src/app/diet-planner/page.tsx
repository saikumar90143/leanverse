'use client';

import React, { useState, useEffect } from 'react';
import { Apple, AlertTriangle, Printer, TrendingDown, TrendingUp, Scale, UtensilsCrossed, Target, Info, Flame, Droplets, RefreshCw, CheckCircle2, ChevronRight, ChevronLeft, CalendarDays, Camera, Copy, Check, Share2, MessageCircle, User, Search, Plus, X, Activity, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import MacroRings from '@/components/shared/MacroRings';
import { getUserStorageKey, formatLocalDate } from '@/lib/storage';



import { ACTIVITY_LEVELS, GOALS, TIMELINES, DIET_STYLES, FOOD_PREFS, BUDGETS, MEALS, WORKOUT_TYPES, WORKOUT_DAYS, FoodItem } from './constants';
import { useDietPlanner } from './useDietPlanner';
import DietWizard from './components/DietWizard';
import DietPlanViewer from './components/DietPlanViewer';
const AIFoodScanner = dynamic(() => import('@/components/shared/AIFoodScanner'), { ssr: false });

export default function AIDietPlanner() {
  const p = useDietPlanner();
  if (!p || !p.isMounted) return null;
  const { step, setStep, age, setAge, gender, setGender, height, setHeight, weight, setWeight, goal, setGoal, activity, setActivity, budget, setBudget, timeline, setTimeline, dietStyles, setDietStyles, foodPref, setFoodPref, allergies, setAllergies, selectedFoods, setSelectedFoods, searchFood, setSearchFood, homeFoodCals, setHomeFoodCals, homeFoodProtein, setHomeFoodProtein, warningMessage, setWarningMessage, proteinTip, setProteinTip, planGenerated, setPlanGenerated, premiumPlans, setPremiumPlans, planSelectionMode, setPlanSelectionMode, generating, setGenerating, isPremiumPlanUsed, setIsPremiumPlanUsed, macroQuery, setMacroQuery, macroLoading, setMacroLoading, macroError, setMacroError, macroResult, setMacroResult, macroAddedKey, setMacroAddedKey, searchMacros, addMacroResultToPlan, customQty, setCustomQty, mealAssignments, setMealAssignments, activeMealTab, setActiveMealTab, viewDateOffset, setViewDateOffset, getDisplayDate, copiedGrocery, setCopiedGrocery, handleCopyGrocery, shareText, shareWhatsapp, shareX, getActiveDateStr, activeDateStr, toggleEaten, safeWeight, safeHeight, safeAge, bmr, actMult, tdee, bmi, bmiCategory, getTargetCalories, eatenMeals, setEatenMeals, dbFoods, setDbFoods, dbFoodsLoading, setDbFoodsLoading, allFoods, handleSelectPremiumPlan, toggleDietStyle, toggleFood, handleAddCustomFood, handleGenerate, getDietCalorieTarget, calsTarget, proteinTarget, currentBmi, maxProteinCals, fatsTarget, carbsTarget, rawQtys, getSmartDefaultQty, actualCals, actualProtein, actualCarbs, actualFats, eatenCals, eatenProtein, eatenCarbs, eatenFats, isOver, isUnder, showCustomForm, setShowCustomForm, cfName, setCfName, cfCals, setCfCals, cfProtein, setCfProtein, cfCarbs, setCfCarbs, cfFats, setCfFats, cfMeal, setCfMeal, customFoodsDatabase, setCustomFoodsDatabase, handleAIFoodScan, user, router, isMounted, setIsMounted } = p;
 return (
 <div className="max-w-5xl mx-auto px-4 py-8">
 {!planGenerated ? <DietWizard p={p} /> : <DietPlanViewer p={p} />}
 </div>
  );
}