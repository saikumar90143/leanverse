'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, X, Check, Edit2, AlertTriangle, Plus, Trash2, ArrowRight } from 'lucide-react';
import { formatLocalDate, getUserStorageKey } from '@/lib/storage';

interface RecognizedFood {
  id: string;
  name: string;
  weight_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
  healthy_alternative: string;
  mealSlot: string;
}

interface AIFoodScannerProps {
  onClose?: () => void;
  onResult?: (items: RecognizedFood[]) => void;
}

export default function AIFoodScanner({ onClose, onResult }: AIFoodScannerProps = {}) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecognizedFood[]>([]);
  const [error, setError] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Could not access camera. Please upload an image instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setImage(dataUrl);
        stopCamera();
        analyzeImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        analyzeImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/food-recognition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.items && data.items.length > 0) {
        const formattedItems = data.items.map((item: any) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          mealSlot: 'lunch' // default
        }));
        setResults(formattedItems);
      } else {
        setError('Could not identify any food items. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setResults([]);
    setError('');
  };

  const updateItemQty = (id: string, delta: number) => {
    setResults(prev => prev.map(item => {
      if (item.id === id) {
        const factor = (item.weight_grams + delta) / item.weight_grams;
        if (item.weight_grams + delta <= 0) return item; // Don't go below 0
        return {
          ...item,
          weight_grams: Math.round(item.weight_grams * factor),
          calories: Math.round(item.calories * factor),
          protein: Math.round(item.protein * factor * 10) / 10,
          carbs: Math.round(item.carbs * factor * 10) / 10,
          fat: Math.round(item.fat * factor * 10) / 10,
          fiber: Math.round(item.fiber * factor * 10) / 10,
        };
      }
      return item;
    }));
  };

  const updateMealSlot = (id: string, slot: string) => {
    setResults(prev => prev.map(item => item.id === id ? { ...item, mealSlot: slot } : item));
  };

  const removeItem = (id: string) => {
    setResults(prev => prev.filter(item => item.id !== id));
  };

  const handleLogMeal = () => {
    if (results.length === 0) return;

    if (onResult) {
      onResult(results);
      if (onClose) onClose();
      return;
    }

    // Check if user has a generated diet plan
    let hasDietPlan = false;
    try {
      const planKey = getUserStorageKey('leanverse_diet_plan');
      const savedPlan = localStorage.getItem(planKey);
      if (savedPlan) {
        const plan = JSON.parse(savedPlan);
        if (plan && plan.planGenerated) {
          hasDietPlan = true;
        }
      }
    } catch {}

    if (!hasDietPlan) {
      alert('Note: Please create a diet plan first to log your foods.');
      return;
    }

    // We will save these to local storage (or integrate with diet-planner)
    // Diet planner uses `leanverse_custom_foods` and `leanverse_diet_plan`
    
    // 1. Add to custom database so it shows up in search
    let customFoodsDb: any = {};
    try {
      const saved = localStorage.getItem(getUserStorageKey('leanverse_custom_foods'));
      if (saved) customFoodsDb = JSON.parse(saved);
    } catch {}

    const newKeys: string[] = [];
    const newQty: Record<string, number> = {};

    results.forEach(item => {
      const baseFoodId = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      customFoodsDb[baseFoodId] = {
        cals: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        alternative: item.healthy_alternative,
        icon: '🍽️',
        category: item.mealSlot,
        unit: 'g',
        baseQty: item.weight_grams
      };

      const compositeKey = `${baseFoodId}|${item.mealSlot}`;
      newKeys.push(compositeKey);
      newQty[compositeKey] = item.weight_grams;
    });

    localStorage.setItem(getUserStorageKey('leanverse_custom_foods'), JSON.stringify(customFoodsDb));

    // 2. Add to diet plan selected foods
    try {
      const planKey = getUserStorageKey('leanverse_diet_plan');
      const savedPlan = localStorage.getItem(planKey);
      if (savedPlan) {
        const plan = JSON.parse(savedPlan);
        const existingFoods = new Set(plan.selectedFoods || []);
        newKeys.forEach(k => existingFoods.add(k));
        plan.selectedFoods = Array.from(existingFoods);
        
        plan.customQty = plan.customQty || {};
        Object.keys(newQty).forEach(k => {
          plan.customQty[k] = newQty[k];
        });

        localStorage.setItem(planKey, JSON.stringify(plan));
      }
    } catch (err) {
      console.error(err);
    }

    // 3. Mark them as eaten for today
    const activeDateStr = formatLocalDate(new Date());
    try {
      const eatenKey = getUserStorageKey(`leanverse_eaten_${activeDateStr}`);
      let eatenDb: any = {};
      const savedEaten = localStorage.getItem(eatenKey);
      if (savedEaten) eatenDb = JSON.parse(savedEaten);
      
      newKeys.forEach(k => { eatenDb[k] = true; });
      localStorage.setItem(eatenKey, JSON.stringify(eatenDb));
    } catch {}

    // Save history
    saveToHistory(results);

    alert('Meals successfully logged!');
    resetScanner();
  };

  const saveToHistory = (items: RecognizedFood[]) => {
    try {
      const historyKey = getUserStorageKey('leanverse_scan_history');
      let history: any[] = [];
      const saved = localStorage.getItem(historyKey);
      if (saved) history = JSON.parse(saved);
      
      history.unshift({
        date: new Date().toISOString(),
        items: items
      });
      
      // Keep last 50 scans
      if (history.length > 50) history = history.slice(0, 50);
      
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      
      {!image && !cameraActive && (
        <div className="glass p-8 rounded-3xl border border-border/10 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black">AI Food Recognition</h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Snap a picture of your plate or upload an image. Our AI will instantly estimate calories, macros, and weight for all items, including Indian cuisine!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button 
              onClick={startCamera}
              className="py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center transition-all shadow-lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Open Camera
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="py-4 bg-secondary dark:bg-card/5 border border-border/10 hover:border-emerald-500 text-foreground font-black rounded-2xl flex items-center justify-center transition-all"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Image
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </div>
        </div>
      )}

      {cameraActive && (
        <div className="relative rounded-3xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-4 border-emerald-500/30 m-4 rounded-2xl pointer-events-none"></div>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-6">
            <button onClick={stopCamera} className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
              <X className="w-6 h-6" />
            </button>
            <button onClick={capturePhoto} className="w-16 h-16 bg-white border-4 border-emerald-500 rounded-full shadow-xl flex items-center justify-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full" />
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && !loading && results.length === 0 && (
        <div className="glass p-6 rounded-3xl border border-border/10 text-center space-y-4">
          <img src={image} alt="Captured" className="w-full max-h-[40vh] object-cover rounded-2xl mb-4" />
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2" /> {error}
            </div>
          )}
          <div className="flex gap-4">
            <button onClick={resetScanner} className="flex-1 py-3 bg-secondary rounded-xl font-bold">Try Again</button>
          </div>
        </div>
      )}

      {loading && (
        <div className="glass p-12 rounded-3xl border border-border/10 text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            <Camera className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-black animate-pulse text-emerald-500">Analyzing Food...</h3>
          <p className="text-muted text-sm">Identifying ingredients and calculating macros.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass p-4 rounded-3xl flex justify-between items-center sticky top-2 z-10">
             <img src={image!} alt="Food" className="w-16 h-16 object-cover rounded-xl" />
             <div className="text-right">
               <span className="block text-xs font-bold text-muted uppercase tracking-widest">Total Identified</span>
               <span className="text-xl font-black text-emerald-500">{results.length} Items</span>
             </div>
             <button onClick={resetScanner} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>

          <p className="text-xs text-muted text-center italic">Nutritional values are estimates and may vary.</p>

          <div className="space-y-4">
            {results.map((item) => (
              <div key={item.id} className="glass p-5 rounded-3xl border border-border/10">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-foreground capitalize leading-tight mb-1">{item.name}</h3>
                    {item.confidence < 70 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low Confidence ({item.confidence}%) - Please verify
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                         <Check className="w-3 h-3 mr-1" /> High Match ({item.confidence}%)
                      </span>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4 bg-secondary/30 p-3 rounded-2xl text-center">
                  <div>
                    <span className="block text-[10px] text-muted font-bold uppercase">Cals</span>
                    <span className="font-black">{item.calories}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-emerald-500 font-bold uppercase">Pro</span>
                    <span className="font-black">{item.protein}g</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-cyan-500 font-bold uppercase">Carbs</span>
                    <span className="font-black">{item.carbs}g</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-amber-500 font-bold uppercase">Fat</span>
                    <span className="font-black">{item.fat}g</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center bg-secondary dark:bg-card/5 rounded-xl p-1">
                    <button onClick={() => updateItemQty(item.id, -20)} className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:text-emerald-500">-</button>
                    <span className="px-3 font-black text-sm w-16 text-center">{item.weight_grams}g</span>
                    <button onClick={() => updateItemQty(item.id, 20)} className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:text-emerald-500">+</button>
                  </div>
                  
                  <select 
                    value={item.mealSlot}
                    onChange={(e) => updateMealSlot(item.id, e.target.value)}
                    className="bg-secondary dark:bg-card/5 border-none text-sm font-bold px-4 py-2 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="pre-workout">Pre Workout</option>
                    <option value="post-workout">Post Workout</option>
                  </select>
                </div>

                {item.healthy_alternative && (
                  <div className="mt-4 pt-3 border-t border-border/10">
                    <p className="text-[11px] font-bold text-muted flex items-center">
                      <ArrowRight className="w-3 h-3 mr-1 text-cyan-500" />
                      Healthier swap: <span className="text-foreground ml-1">{item.healthy_alternative}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleLogMeal}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 text-lg flex items-center justify-center"
          >
            <Check className="w-6 h-6 mr-2" />
            Log Meals & Update Macros
          </button>
        </div>
      )}

    </div>
  );
}
