export interface FoodEntry {
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  alternative: string;
  warning?: string;
  icon: string;
  category: string | string[];
  unit: string;
  baseQty: number;
  hidden?: boolean;
}

// Helper to normalize the user's mealTypes to our app's tabs
function normalizeMealTypes(mealTypes?: string[]): string[] {
  if (!mealTypes || mealTypes.length === 0) return ['breakfast', 'lunch', 'dinner', 'pre-workout', 'post-workout'];
  return mealTypes.map(m => {
    const lower = m.toLowerCase();
    if (lower === 'snack') return 'pre-workout'; // Map snack to pre-workout tab
    if (lower === 'pre workout') return 'pre-workout';
    if (lower === 'post workout') return 'post-workout';
    if (lower === 'any time') return 'pre-workout';
    return lower;
  });
}

export const foodDatabase: Record<string, FoodEntry> = {
  // Protein
  'chicken breast': { icon: '🍗', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 165, protein: 31, carbs: 0, fat: 3.6, alternative: 'Fish' },
  'whole egg': { icon: '🥚', category: normalizeMealTypes(["Breakfast", "Dinner"]), unit: '1 Egg', baseQty: 1, cals: 72, protein: 6.3, carbs: 0.4, fat: 4.8, alternative: 'Paneer' },
  paneer: { icon: '🧀', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 265, protein: 18, carbs: 6, fat: 20, alternative: 'Tofu' },
  tofu: { icon: '🟨', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 144, protein: 17, carbs: 3, fat: 8, alternative: 'Soya Chunks' },
  'soya chunks': { icon: '🌱', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 345, protein: 52, carbs: 33, fat: 0.5, alternative: 'Tofu' },
  fish: { icon: '🐟', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 128, protein: 26, carbs: 0, fat: 2.7, alternative: 'Chicken' },

  // Carbohydrates
  'white rice': { icon: '🍚', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g Cooked', baseQty: 100, cals: 130, protein: 2.7, carbs: 28, fat: 0.3, alternative: 'Brown Rice' },
  'brown rice': { icon: '🍚', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g Cooked', baseQty: 100, cals: 123, protein: 2.7, carbs: 25.6, fat: 1, alternative: 'White Rice' },
  oats: { icon: '🥣', category: normalizeMealTypes(["Breakfast"]), unit: '100g', baseQty: 100, cals: 389, protein: 16.9, carbs: 66, fat: 6.9, alternative: 'Dalia' },
  roti: { icon: '🫓', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '1 Roti', baseQty: 1, cals: 120, protein: 3.5, carbs: 18, fat: 3, alternative: 'Rice' },
  'sweet potato': { icon: '🍠', category: normalizeMealTypes(["Breakfast", "Snack"]), unit: '100g', baseQty: 100, cals: 86, protein: 1.6, carbs: 20, fat: 0.1, alternative: 'Potato' },

  // South Indian
  idli: { icon: '🍘', category: normalizeMealTypes(["Breakfast"]), unit: '1 Idli', baseQty: 1, cals: 58, protein: 2, carbs: 12, fat: 0.4, alternative: 'Dosa' },
  dosa: { icon: '🥞', category: normalizeMealTypes(["Breakfast"]), unit: '1 Dosa', baseQty: 1, cals: 168, protein: 4, carbs: 28, fat: 4, alternative: 'Idli' },
  upma: { icon: '🍲', category: normalizeMealTypes(["Breakfast"]), unit: '100g', baseQty: 100, cals: 110, protein: 3, carbs: 20, fat: 2, alternative: 'Poha' },
  pongal: { icon: '🍛', category: normalizeMealTypes(["Breakfast"]), unit: '100g', baseQty: 100, cals: 160, protein: 5, carbs: 25, fat: 4, alternative: 'Upma' },

  // Fruits
  banana: { icon: '🍌', category: normalizeMealTypes(["Snack", "Pre Workout"]), unit: '1 Medium', baseQty: 1, cals: 105, protein: 1.3, carbs: 27, fat: 0.3, alternative: 'Apple' },
  apple: { icon: '🍎', category: normalizeMealTypes(["Snack"]), unit: '1 Medium', baseQty: 1, cals: 95, protein: 0.5, carbs: 25, fat: 0.3, alternative: 'Orange' },
  orange: { icon: '🍊', category: normalizeMealTypes(["Snack"]), unit: '1 Medium', baseQty: 1, cals: 62, protein: 1.2, carbs: 15, fat: 0.2, alternative: 'Apple' },

  // Vegetables
  broccoli: { icon: '🥦', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 34, protein: 2.8, carbs: 7, fat: 0.4, alternative: 'Cauliflower' },
  spinach: { icon: '🥬', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 23, protein: 2.9, carbs: 3.6, fat: 0.4, alternative: 'Kale' },
  carrot: { icon: '🥕', category: normalizeMealTypes(["Lunch", "Dinner"]), unit: '100g', baseQty: 100, cals: 41, protein: 0.9, carbs: 10, fat: 0.2, alternative: 'Cucumber' },

  // Healthy Fats
  almonds: { icon: '🌰', category: normalizeMealTypes(["Snack"]), unit: '30g', baseQty: 30, cals: 174, protein: 6, carbs: 6, fat: 15, alternative: 'Walnuts' },
  'peanut butter': { icon: '🥜', category: normalizeMealTypes(["Breakfast", "Snack"]), unit: '32g', baseQty: 32, cals: 190, protein: 8, carbs: 7, fat: 16, alternative: 'Almond Butter' },
  cashews: { icon: '🥜', category: normalizeMealTypes(["Snack"]), unit: '30g', baseQty: 30, cals: 157, protein: 5, carbs: 9, fat: 12, alternative: 'Almonds' },

  // Supplements
  'whey protein': { icon: '🥤', category: normalizeMealTypes(["Post Workout"]), unit: '1 Scoop (30g)', baseQty: 30, cals: 120, protein: 24, carbs: 3, fat: 1, alternative: 'Plant Protein' },
  'creatine monohydrate': { icon: '⚡', category: normalizeMealTypes(["Any Time"]), unit: '5g', baseQty: 5, cals: 0, protein: 0, carbs: 0, fat: 0, alternative: 'None' }
};

// ─── Fuzzy Search Helper ─────────────────────────────────────────────────────
export function searchFoodDatabase(query: string): { key: string; entry: FoodEntry } | null {
  const q = query.toLowerCase().trim();

  // 1. Exact match
  if (foodDatabase[q]) return { key: q, entry: foodDatabase[q] };

  // 2. Starts-with match
  const startsWithMatch = Object.keys(foodDatabase).find(k => k.startsWith(q) || q.startsWith(k));
  if (startsWithMatch) return { key: startsWithMatch, entry: foodDatabase[startsWithMatch] };

  // 3. Contains match
  const containsMatch = Object.keys(foodDatabase).find(k => k.includes(q) || q.includes(k));
  if (containsMatch) return { key: containsMatch, entry: foodDatabase[containsMatch] };

  return null;
}

export function parseNaturalQuery(query: string): { key: string; entry: FoodEntry; qty: number }[] {
  const results: { key: string; entry: FoodEntry; qty: number }[] = [];
  const q = query.toLowerCase();

  for (const [key, entry] of Object.entries(foodDatabase)) {
    if (q.includes(key)) {
      const escapedKey = key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
      const regex = new RegExp('(\\\\d+(?:\\\\.\\\\d+)?)\\\\s*(?:large|medium|small|g|ml|cup|scoop|piece|wrap|slice)?\\\\s*' + escapedKey, 'i');
      const match = q.match(regex);
      const qty = match ? parseFloat(match[1]) : 1;
      results.push({ key, entry, qty });
    }
  }

  return results;
}
