'use client';

import React, { useState } from 'react';
import { Apple, Search, Sparkles, RefreshCw, Clock, Flame, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Recipe {
  name: string;
  category: string;
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  ingredients: string[];
  instructions: string[];
}

export default function MealRecipesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // AI Generator state
  const [rawInput, setRawInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const staticRecipes: Recipe[] = [
    {
      name: 'High-Protein Garlic Paneer Tikka',
      category: 'highprotein',
      cals: 320,
      protein: 22,
      carbs: 6,
      fat: 21,
      time: '20 mins',
      ingredients: ['Low-fat Paneer (150g)', 'Greek Yogurt (2 tbsp)', 'Garlic paste (1 tsp)', 'Kashmiri Chili powder', 'Garam Masala'],
      instructions: ['Cut paneer into thick cubes.', 'Mix Greek yogurt with garlic paste and dry spices to form marinade.', 'Coat paneer cubes with marinade and let sit for 10 minutes.', 'Grill on non-stick pan until golden brown on all sides.'],
    },
    {
      name: 'Lean Chicken Breast & Brown Rice Bowl',
      category: 'leanbulk',
      cals: 550,
      protein: 42,
      carbs: 55,
      fat: 8,
      time: '30 mins',
      ingredients: ['Chicken Breast (150g)', 'Brown Rice (80g raw)', 'Broccoli florets (1 cup)', 'Olive oil (1 tsp)', 'Soy sauce'],
      instructions: ['Boil brown rice according to packaging guidelines.', 'Dice chicken breast and sauté in olive oil with garlic until cooked through.', 'Steam broccoli for 4 minutes until vibrant green.', 'Assemble in a glass bowl, splash soy sauce, and serve hot.'],
    },
    {
      name: 'Fiber-Rich Sprouted Moong Dal Salad',
      category: 'fatloss',
      cals: 210,
      protein: 12,
      carbs: 38,
      fat: 1.5,
      time: '10 mins',
      ingredients: ['Sprouted Moong Dal (1 cup)', 'Onion (half, chopped)', 'Tomato (half, chopped)', 'Lemon juice (1 tbsp)', 'Pink Salt & Chaat Masala'],
      instructions: ['Rinse sprouted moong dal in warm water.', 'Toss sprouts with chopped onion and tomato in a serving bowl.', 'Squeeze fresh lemon juice over the mixture.', 'Season with pink salt, pepper, and chaat masala. Mix and serve.'],
    },
  ];

  const handleGenerateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim()) return;

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      
      // Dynamic synthesis matching their input
      const items = rawInput.toLowerCase();
      let rName = 'Custom AI Fitness Fusion';
      let rCals = 380;
      let rProt = 28;
      let rCarb = 30;
      let rFat = 10;
      let rIngs = rawInput.split(',').map((x) => x.trim());
      let rInsts = [
        'Clean and prep your select ingredients thoroughly.',
        'Sauté in a non-stick pan using 1 tsp of olive oil or cook in a rapid pressure cooker.',
        'Add clinical spice profiles (turmeric, black pepper, pink salt) to optimize metabolism.',
        'Pair with green salad and serve immediately hot.',
      ];

      if (items.includes('chicken') || items.includes('egg')) {
        rName = 'AI Gourmet High-Protein Plate';
        rProt = 38;
        rCals = 410;
        rCarb = 10;
        rFat = 12;
      } else if (items.includes('paneer') || items.includes('tofu')) {
        rName = 'AI Low-Fat Cottage Cheese Grill';
        rProt = 24;
        rCals = 340;
        rCarb = 8;
        rFat = 16;
      } else if (items.includes('oats') || items.includes('dal')) {
        rName = 'AI Fiber-Rich Complex Carb Mash';
        rProt = 14;
        rCals = 290;
        rCarb = 48;
        rFat = 4;
      }

      setGeneratedRecipe({
        name: rName,
        category: 'ai_gen',
        cals: rCals,
        protein: rProt,
        carbs: rCarb,
        fat: rFat,
        time: '15 mins',
        ingredients: rIngs,
        instructions: rInsts,
      });

      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#10b981', '#fbbf24'],
      });
    }, 1500);
  };

  const filteredRecipes = staticRecipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center">
          LeanVerse Meal Recipes
          <Apple className="w-6 h-6 ml-2 text-emerald-500 animate-bounce" />
        </h1>
        <p className="text-xs text-slate-500">Search healthy diet plates or input raw ingredients in our AI Generator to get a complete macro recipe card instantly!</p>
      </div>

      {/* AI Recipe Generator Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
        
        <div className="flex items-center space-x-2 border-b border-slate-200/10 pb-4 mb-6">
          <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
          <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Instant AI Recipe Generator</h2>
        </div>

        <form onSubmit={handleGenerateRecipe} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 block ml-1">What ingredients are in your kitchen? (Comma-separated)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. Chicken, Broccoli, Egg, Spinach, Oats"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                required
                className="flex-1 bg-slate-100/50 dark:bg-white/5 border border-slate-350/20 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-medium text-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={generating}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl py-3 px-6 shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer text-sm"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current mr-1.5 text-amber-300" />
                    <span>Generate Recipe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* AI Generated Output Display */}
        {generatedRecipe && (
          <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/10">
              <div>
                <span className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-widest block">AI Generated Health plate</span>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mt-1">{generatedRecipe.name}</h3>
              </div>
              <div className="flex items-center space-x-1 text-slate-400 font-bold text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{generatedRecipe.time}</span>
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-200/20 dark:bg-white/5 rounded-xl border border-slate-300/5">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Calories</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{generatedRecipe.cals}</span>
              </div>
              <div>
                <span className="text-[9px] text-emerald-500 font-bold block uppercase">Protein</span>
                <span className="text-sm font-black text-emerald-500 mt-0.5 block">{generatedRecipe.protein}g</span>
              </div>
              <div>
                <span className="text-[9px] text-cyan-500 font-bold block uppercase">Carbs</span>
                <span className="text-sm font-black text-cyan-500 mt-0.5 block">{generatedRecipe.carbs}g</span>
              </div>
              <div>
                <span className="text-[9px] text-amber-500 font-bold block uppercase">Fat</span>
                <span className="text-sm font-black text-amber-500 mt-0.5 block">{generatedRecipe.fat}g</span>
              </div>
            </div>

            {/* Ingredients & Prep */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Ingredients Used</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-350">
                  {generatedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Preparation steps</span>
                <ol className="space-y-1.5 text-slate-600 dark:text-slate-350 list-decimal pl-4">
                  {generatedRecipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Static recipe search and card grid directory */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Diet Plates Directory</span>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search meals or ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-200/50 dark:bg-white/5 border border-slate-350/15 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
            
            {/* Categories filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-200/50 dark:bg-zinc-900 border border-slate-350/15 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-bold"
            >
              <option value="all">All Presets</option>
              <option value="highprotein">High Protein</option>
              <option value="leanbulk">Lean Bulk</option>
              <option value="fatloss">Fat Loss</option>
            </select>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRecipes.map((r, idx) => (
            <div key={idx} className="glass rounded-3xl p-6 border border-slate-200/10 flex flex-col justify-between space-y-4 glow-card">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                    r.category === 'highprotein' ? 'bg-emerald-500/10 text-emerald-500' :
                    r.category === 'leanbulk' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {r.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-0.5" />
                    {r.time}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-snug">{r.name}</h3>
              </div>

              {/* Macro info */}
              <div className="grid grid-cols-4 gap-1 p-2 bg-slate-200/20 dark:bg-white/5 rounded-xl border border-slate-300/5 text-center text-[10px] font-black">
                <div>
                  <span className="text-slate-400 block font-bold text-[8px] uppercase">Cal</span>
                  <span className="text-slate-700 dark:text-slate-350">{r.cals}</span>
                </div>
                <div>
                  <span className="text-emerald-500 block font-bold text-[8px] uppercase">P</span>
                  <span className="text-emerald-500">{r.protein}g</span>
                </div>
                <div>
                  <span className="text-cyan-500 block font-bold text-[8px] uppercase">C</span>
                  <span className="text-cyan-500">{r.carbs}g</span>
                </div>
                <div>
                  <span className="text-amber-500 block font-bold text-[8px] uppercase">F</span>
                  <span className="text-amber-500">{r.fat}g</span>
                </div>
              </div>

              {/* Ingredients list summary */}
              <div className="text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-400">Key Ingredients:</span>
                <p className="leading-snug truncate">{r.ingredients.join(', ')}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/10">
                <button 
                  onClick={() => alert(`Instructions:\n${r.instructions.map((inst, i) => `${i+1}. ${inst}`).join('\n')}`)}
                  className="w-full py-2 bg-slate-200/50 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 hover:text-emerald-500 rounded-xl font-bold transition-all text-xs flex items-center justify-center cursor-pointer"
                >
                  <span>View Full cooking steps</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredRecipes.length === 0 && (
            <div className="col-span-3 text-center py-10 text-xs text-slate-400 font-bold">
              No matching recipes found. Try using our AI Generator to synthesize a custom meal split card!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
