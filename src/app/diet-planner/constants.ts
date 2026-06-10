import { TrendingDown, TrendingUp, Activity, Scale } from 'lucide-react';

export const ACTIVITY_LEVELS = [
 { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', mult: 1.2 },
 { id: 'light', label: 'Lightly Active', desc: '1-3 workouts/week', mult: 1.375 },
 { id: 'moderate', label: 'Moderately Active', desc: '3-5 workouts/week', mult: 1.55 },
 { id: 'active', label: 'Very Active', desc: '6-7 workouts/week', mult: 1.725 },
 { id: 'athlete', label: 'Athlete', desc: 'Intense training', mult: 1.9 },
];

export const GOALS = [
 { id: 'fat_loss', label: 'Fat Loss', desc: 'Burn body fat while preserving muscle', icon: TrendingDown },
 { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Build lean muscle mass', icon: TrendingUp },
 { id: 'recomp', label: 'Body Recomposition', desc: 'Lose fat & gain muscle simultaneously', icon: Activity },
 { id: 'maintenance', label: 'Maintenance', desc: 'Maintain current weight and stay healthy', icon: Scale },
];

export const TIMELINES = [
 { id: 30, label: '30 Days' },
 { id: 60, label: '60 Days' },
 { id: 90, label: '90 Days' },
 { id: 120, label: '120 Days' },
 { id: 180, label: '180 Days' },
];

export const DIET_STYLES = [
 'Vegetarian', 'Non-Vegetarian'
];

export const FOOD_PREFS = [
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

export const BUDGETS = ['Budget Friendly', 'Moderate', 'Premium'];
export const MEALS = [3, 4, 5, 6];
export const WORKOUT_TYPES = ['Gym', 'Home Workout', 'No Workout'];
export const WORKOUT_DAYS = [0, 3, 4, 5, 6, 7];

export interface FoodItem {
 name: string;
 qty: string;
 cals: number;
 protein: number;
 carbs: number;
 fat: number;
 alternative: string;
}
