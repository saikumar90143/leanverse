export interface FoodEntry {
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  alternative: string;
  warning?: string;
  icon: string;
  category: string;
  unit: string;
  baseQty: number;
}

export const foodDatabase: Record<string, FoodEntry> = {
  // ─── Grains & Carbs ───────────────────────────────────────────────────────
  rice:          { cals: 130,  protein: 2.7,  carbs: 28,   fat: 0.3,  alternative: 'Brown Rice / Quinoa',    warning: 'White rice has high glycemic index.',         icon: '🍚', category: 'lunch',        unit: 'g',           baseQty: 100 },
  'brown rice':  { cals: 111,  protein: 2.6,  carbs: 23,   fat: 0.9,  alternative: 'Quinoa',                                                                          icon: '🍛', category: 'lunch',        unit: 'g',           baseQty: 100 },
  roti:          { cals: 120,  protein: 3.8,  carbs: 17,   fat: 3.7,  alternative: 'Multigrain Roti',                                                                  icon: '🫓', category: 'dinner',       unit: 'rotis',       baseQty: 1   },
  chapati:       { cals: 120,  protein: 3.8,  carbs: 17,   fat: 3.7,  alternative: 'Multigrain Roti',                                                                  icon: '🫓', category: 'dinner',       unit: 'chapatis',    baseQty: 1   },
  oats:          { cals: 389,  protein: 16.9, carbs: 66,   fat: 6.9,  alternative: 'Steel-Cut Oats',                                                                   icon: '🥣', category: 'breakfast',    unit: 'g',           baseQty: 100 },
  quinoa:        { cals: 120,  protein: 4.4,  carbs: 21,   fat: 1.9,  alternative: 'Brown Rice',                                                                       icon: '🌾', category: 'lunch',        unit: 'g',           baseQty: 100 },
  'sweet potato':{ cals: 86,   protein: 1.6,  carbs: 20,   fat: 0.1,  alternative: 'Yam',                                                                              icon: '🍠', category: 'lunch',        unit: 'g',           baseQty: 100 },
  sweetpotato:   { cals: 86,   protein: 1.6,  carbs: 20,   fat: 0.1,  alternative: 'Yam',                                                                              icon: '🍠', category: 'lunch',        unit: 'g',           baseQty: 100 },
  'brown bread':  { cals: 250,  protein: 10,   carbs: 43,   fat: 4,    alternative: 'Sourdough',                                                                        icon: '🍞', category: 'breakfast',    unit: 'slices',      baseQty: 3   },
  bread:         { cals: 265,  protein: 9,    carbs: 49,   fat: 3.2,  alternative: 'Multigrain Bread',       warning: 'White bread is low in fibre.',                 icon: '🍞', category: 'breakfast',    unit: 'slices',      baseQty: 2   },
  pasta:         { cals: 131,  protein: 5,    carbs: 25,   fat: 1.1,  alternative: 'Whole Wheat Pasta',                                                                icon: '🍝', category: 'dinner',       unit: 'g',           baseQty: 100 },
  'rice cake':   { cals: 35,   protein: 0.7,  carbs: 7.3,  fat: 0.3,  alternative: 'Makhana',                                                                          icon: '🍘', category: 'pre-workout',  unit: 'cakes',       baseQty: 1   },
  noodles:       { cals: 138,  protein: 4.5,  carbs: 25,   fat: 2.1,  alternative: 'Zucchini Noodles',      warning: 'High sodium in instant noodles.',               icon: '🍜', category: 'dinner',       unit: 'g',           baseQty: 100 },
  poha:          { cals: 110,  protein: 2.1,  carbs: 23,   fat: 0.5,  alternative: 'Oats Upma',                                                                        icon: '🍚', category: 'breakfast',    unit: 'g',           baseQty: 100 },
  upma:          { cals: 145,  protein: 3.5,  carbs: 25,   fat: 4,    alternative: 'Oats Upma',                                                                        icon: '🍲', category: 'breakfast',    unit: 'g',           baseQty: 100 },

  // ─── Proteins — Animal & Dairy ────────────────────────────────────────────
  chicken:       { cals: 165,  protein: 31,   carbs: 0,    fat: 3.6,  alternative: 'Turkey / Lean Beef',                                                               icon: '🍗', category: 'lunch',        unit: 'g',           baseQty: 100 },
  'chicken breast':{ cals: 165,protein: 31,   carbs: 0,    fat: 3.6,  alternative: 'Turkey Breast',                                                                    icon: '🍗', category: 'lunch',        unit: 'g',           baseQty: 100 },
  fish:          { cals: 206,  protein: 22,   carbs: 0,    fat: 12,   alternative: 'Tuna / Tilapia',                                                                   icon: '🐟', category: 'dinner',       unit: 'g',           baseQty: 100 },
  tuna:          { cals: 132,  protein: 29,   carbs: 0,    fat: 1,    alternative: 'Grilled Salmon',                                                                   icon: '🐟', category: 'lunch',        unit: 'g',           baseQty: 100 },
  salmon:        { cals: 208,  protein: 20,   carbs: 0,    fat: 13,   alternative: 'Tuna',                                                                             icon: '🐠', category: 'dinner',       unit: 'g',           baseQty: 100 },
  eggs:          { cals: 155,  protein: 13,   carbs: 1.1,  fat: 11,   alternative: 'Egg Whites',                                                                       icon: '🥚', category: 'breakfast',    unit: 'large eggs',  baseQty: 2   },
  'egg whites':  { cals: 52,   protein: 11,   carbs: 0.7,  fat: 0.2,  alternative: 'Tofu Scramble',                                                                    icon: '🥚', category: 'breakfast',    unit: 'large eggs',  baseQty: 3   },
  paneer:        { cals: 265,  protein: 18,   carbs: 1.2,  fat: 20,   alternative: 'Low-Fat Paneer / Tofu', warning: 'High fat load.',                                icon: '🧀', category: 'dinner',       unit: 'g',           baseQty: 100 },
  tofu:          { cals: 76,   protein: 8,    carbs: 1.9,  fat: 4.8,  alternative: 'Paneer',                                                                           icon: '🟨', category: 'dinner',       unit: 'g',           baseQty: 100 },
  'whey protein':{ cals: 120,  protein: 24,   carbs: 3,    fat: 1.5,  alternative: 'Plant Protein Blend',                                                              icon: '🥤', category: 'post-workout', unit: 'scoops',      baseQty: 1   },
  wheyprotein:   { cals: 120,  protein: 24,   carbs: 3,    fat: 1.5,  alternative: 'Plant Protein Blend',                                                              icon: '🥤', category: 'post-workout', unit: 'scoops',      baseQty: 1   },
  milk:          { cals: 60,   protein: 3.2,  carbs: 4.8,  fat: 3.3,  alternative: 'Almond Milk',                                                                      icon: '🥛', category: 'breakfast',    unit: 'ml',          baseQty: 100 },
  curd:          { cals: 98,   protein: 11,   carbs: 3.4,  fat: 4.3,  alternative: 'Greek Yogurt',                                                                     icon: '🥣', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  yogurt:        { cals: 59,   protein: 10,   carbs: 3.6,  fat: 0.4,  alternative: 'Kefir',                                                                            icon: '🍦', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  'greek yogurt':{ cals: 59,   protein: 10,   carbs: 3.6,  fat: 0.4,  alternative: 'Kefir',                                                                            icon: '🍦', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  mutton:        { cals: 294,  protein: 25,   carbs: 0,    fat: 21,   alternative: 'Chicken / Lean Beef',   warning: 'High saturated fat.',                           icon: '🍖', category: 'dinner',       unit: 'g',           baseQty: 100 },
  beef:          { cals: 250,  protein: 26,   carbs: 0,    fat: 15,   alternative: 'Chicken Breast',        warning: 'High in saturated fats.',                       icon: '🥩', category: 'dinner',       unit: 'g',           baseQty: 100 },
  shrimp:        { cals: 99,   protein: 24,   carbs: 0.2,  fat: 0.3,  alternative: 'Grilled Fish',                                                                     icon: '🍤', category: 'dinner',       unit: 'g',           baseQty: 100 },
  'cottage cheese':{ cals: 98, protein: 11,   carbs: 3.4,  fat: 4.3,  alternative: 'Greek Yogurt',                                                                     icon: '🧀', category: 'breakfast',    unit: 'g',           baseQty: 100 },

  // ─── Legumes & Pulses ─────────────────────────────────────────────────────
  dal:           { cals: 340,  protein: 24,   carbs: 60,   fat: 1,    alternative: 'Sprouted Moong Dal',                                                               icon: '🍲', category: 'lunch',        unit: 'g (uncooked)',baseQty: 100 },
  rajma:         { cals: 333,  protein: 24,   carbs: 60,   fat: 0.8,  alternative: 'Lobia / Chole',                                                                    icon: '🍛', category: 'lunch',        unit: 'g (uncooked)',baseQty: 100 },
  chana:         { cals: 364,  protein: 19,   carbs: 61,   fat: 6,    alternative: 'Roasted Makhana',                                                                  icon: '🧆', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  chickpeas:     { cals: 364,  protein: 19,   carbs: 61,   fat: 6,    alternative: 'Lentils',                                                                          icon: '🟡', category: 'lunch',        unit: 'g',           baseQty: 100 },
  lentils:       { cals: 353,  protein: 25,   carbs: 60,   fat: 1.1,  alternative: 'Chickpeas',                                                                        icon: '🟠', category: 'lunch',        unit: 'g',           baseQty: 100 },
  moong:         { cals: 347,  protein: 24,   carbs: 63,   fat: 1.2,  alternative: 'Masoor Dal',                                                                       icon: '🫛', category: 'breakfast',    unit: 'g',           baseQty: 100 },
  soybeans:      { cals: 446,  protein: 36,   carbs: 30,   fat: 20,   alternative: 'Lentils',                                                                          icon: '🫘', category: 'lunch',        unit: 'g',           baseQty: 100 },

  // ─── Nuts & Fats ──────────────────────────────────────────────────────────
  'peanut butter':{ cals: 588, protein: 25,   carbs: 20,   fat: 50,   alternative: 'Almond Butter',          warning: 'Extremely calorie dense.',                     icon: '🥜', category: 'breakfast',    unit: 'tbsp',        baseQty: 6   },
  'almond butter':{ cals: 614, protein: 21,   carbs: 19,   fat: 56,   alternative: 'Peanut Butter',          warning: 'Extremely calorie dense.',                     icon: '🥜', category: 'breakfast',    unit: 'tbsp',        baseQty: 6   },
  almonds:       { cals: 579,  protein: 21,   carbs: 22,   fat: 50,   alternative: 'Walnuts',                                                                          icon: '🌰', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  badam:         { cals: 579,  protein: 21,   carbs: 22,   fat: 50,   alternative: 'Walnuts',                                                                          icon: '🌰', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  cashew:        { cals: 553,  protein: 18,   carbs: 30,   fat: 44,   alternative: 'Pistachios',                                                                       icon: '🥜', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  cashews:       { cals: 553,  protein: 18,   carbs: 30,   fat: 44,   alternative: 'Pistachios',                                                                       icon: '🥜', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  pista:         { cals: 562,  protein: 20,   carbs: 28,   fat: 45,   alternative: 'Pumpkin Seeds',                                                                    icon: '🟢', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  pistachios:    { cals: 562,  protein: 20,   carbs: 28,   fat: 45,   alternative: 'Pumpkin Seeds',                                                                    icon: '🟢', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  walnut:        { cals: 654,  protein: 15,   carbs: 14,   fat: 65,   alternative: 'Pecans',                                                                           icon: '🧠', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  walnuts:       { cals: 654,  protein: 15,   carbs: 14,   fat: 65,   alternative: 'Pecans',                                                                           icon: '🧠', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  'olive oil':   { cals: 884,  protein: 0,    carbs: 0,    fat: 100,  alternative: 'Avocado Oil',            warning: 'Pure fat source.',                             icon: '🫒', category: 'lunch',        unit: 'ml',          baseQty: 15  },
  oil:           { cals: 884,  protein: 0,    carbs: 0,    fat: 100,  alternative: 'Olive Oil / Ghee',       warning: 'Pure fat source.',                             icon: '🫒', category: 'lunch',        unit: 'ml',          baseQty: 15  },
  ghee:          { cals: 900,  protein: 0,    carbs: 0,    fat: 100,  alternative: 'Olive Oil',              warning: 'High saturated fat.',                           icon: '🧈', category: 'lunch',        unit: 'ml',          baseQty: 15  },
  avocado:       { cals: 160,  protein: 2,    carbs: 9,    fat: 15,   alternative: 'Olive Oil',                                                                        icon: '🥑', category: 'breakfast',    unit: 'g',           baseQty: 100 },

  // ─── Meals & Wraps ────────────────────────────────────────────────────────
  shawarma:      { cals: 450,  protein: 28,   carbs: 40,   fat: 18,   alternative: 'Grilled Chicken Salad',  warning: 'High sodium and hidden sauces.',               icon: '🌯', category: 'dinner',       unit: 'wrap',        baseQty: 1   },
  burger:        { cals: 550,  protein: 26,   carbs: 45,   fat: 28,   alternative: 'Grilled Chicken Burger', warning: 'High calorie fast food.',                      icon: '🍔', category: 'dinner',       unit: 'burger',      baseQty: 1   },
  pizza:         { cals: 266,  protein: 11,   carbs: 33,   fat: 10,   alternative: 'Thin-crust Veggie Pizza',warning: 'High sodium and refined carbs.',               icon: '🍕', category: 'dinner',       unit: 'slice',       baseQty: 2   },
  sandwich:      { cals: 310,  protein: 15,   carbs: 38,   fat: 9,    alternative: 'Lettuce Wrap',                                                                     icon: '🥪', category: 'lunch',        unit: 'sandwich',    baseQty: 1   },
  'biryani':     { cals: 290,  protein: 13,   carbs: 45,   fat: 8,    alternative: 'Grilled Chicken + Brown Rice',warning: 'Calorie-dense due to ghee and rice.',    icon: '🍛', category: 'dinner',       unit: 'g',           baseQty: 250 },
  'chicken biryani':{ cals: 290,protein: 14,  carbs: 45,   fat: 8,    alternative: 'Grilled Chicken + Brown Rice',warning: 'High calorie, moderation advised.',      icon: '🍛', category: 'dinner',       unit: 'g',           baseQty: 250 },
  'dal makhani': { cals: 180,  protein: 8,    carbs: 20,   fat: 8,    alternative: 'Dal Tadka',                                                                        icon: '🍲', category: 'dinner',       unit: 'g',           baseQty: 200 },
  samosa:        { cals: 262,  protein: 3.5,  carbs: 30,   fat: 14,   alternative: 'Baked Samosa',           warning: 'Deep fried, high in trans fat.',               icon: '🥟', category: 'pre-workout',  unit: 'piece',       baseQty: 1   },
  'protein bar': { cals: 220,  protein: 20,   carbs: 25,   fat: 7,    alternative: 'Greek Yogurt with Berries',                                                        icon: '🍫', category: 'post-workout', unit: 'bar',         baseQty: 1   },

  // ─── Fruits ───────────────────────────────────────────────────────────────
  banana:        { cals: 89,   protein: 1.1,  carbs: 23,   fat: 0.3,  alternative: 'Apple / Berries',                                                                  icon: '🍌', category: 'breakfast',    unit: 'medium',      baseQty: 1   },
  apple:         { cals: 52,   protein: 0.3,  carbs: 14,   fat: 0.2,  alternative: 'Pear',                                                                             icon: '🍎', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  orange:        { cals: 47,   protein: 0.9,  carbs: 12,   fat: 0.1,  alternative: 'Grapefruit',                                                                       icon: '🍊', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  mango:         { cals: 60,   protein: 0.8,  carbs: 15,   fat: 0.4,  alternative: 'Papaya',                  warning: 'High sugar, eat in moderation.',              icon: '🥭', category: 'breakfast',    unit: 'g',           baseQty: 100 },
  watermelon:    { cals: 30,   protein: 0.6,  carbs: 7.6,  fat: 0.2,  alternative: 'Muskmelon',                                                                        icon: '🍉', category: 'pre-workout',  unit: 'g',           baseQty: 100 },
  papaya:        { cals: 43,   protein: 0.5,  carbs: 11,   fat: 0.3,  alternative: 'Pineapple',                                                                        icon: '🥭', category: 'breakfast',    unit: 'g',           baseQty: 100 },
  strawberry:    { cals: 32,   protein: 0.7,  carbs: 7.7,  fat: 0.3,  alternative: 'Blueberries',                                                                      icon: '🍓', category: 'breakfast',    unit: 'g',           baseQty: 100 },
  dates:         { cals: 282,  protein: 2.5,  carbs: 75,   fat: 0.4,  alternative: 'Raisins',                 warning: 'Very high sugar density.',                    icon: '🌴', category: 'pre-workout',  unit: 'dates',       baseQty: 10  },

  // ─── Vegetables ───────────────────────────────────────────────────────────
  broccoli:      { cals: 34,   protein: 2.8,  carbs: 6.6,  fat: 0.4,  alternative: 'Cauliflower',                                                                      icon: '🥦', category: 'lunch',        unit: 'g',           baseQty: 100 },
  spinach:       { cals: 23,   protein: 2.9,  carbs: 3.6,  fat: 0.4,  alternative: 'Kale',                                                                             icon: '🥬', category: 'dinner',       unit: 'g',           baseQty: 100 },
  carrot:        { cals: 41,   protein: 0.9,  carbs: 10,   fat: 0.2,  alternative: 'Beetroot',                                                                         icon: '🥕', category: 'lunch',        unit: 'g',           baseQty: 100 },
  tomato:        { cals: 18,   protein: 0.9,  carbs: 3.9,  fat: 0.2,  alternative: 'Bell Pepper',                                                                      icon: '🍅', category: 'lunch',        unit: 'g',           baseQty: 100 },
  potato:        { cals: 77,   protein: 2,    carbs: 17,   fat: 0.1,  alternative: 'Sweet Potato',                                                                     icon: '🥔', category: 'dinner',       unit: 'g',           baseQty: 100 },
  cucumber:      { cals: 15,   protein: 0.7,  carbs: 3.6,  fat: 0.1,  alternative: 'Zucchini',                                                                         icon: '🥒', category: 'lunch',        unit: 'g',           baseQty: 100 },
  onion:         { cals: 40,   protein: 1.1,  carbs: 9.3,  fat: 0.1,  alternative: 'Garlic',                                                                           icon: '🧅', category: 'lunch',        unit: 'g',           baseQty: 100 },
  cauliflower:   { cals: 25,   protein: 1.9,  carbs: 5,    fat: 0.3,  alternative: 'Broccoli',                                                                         icon: '🥦', category: 'lunch',        unit: 'g',           baseQty: 100 },
  mushroom:      { cals: 22,   protein: 3.1,  carbs: 3.3,  fat: 0.3,  alternative: 'Tofu',                                                                             icon: '🍄', category: 'dinner',       unit: 'g',           baseQty: 100 },
  corn:          { cals: 86,   protein: 3.2,  carbs: 19,   fat: 1.2,  alternative: 'Green Peas',                                                                       icon: '🌽', category: 'lunch',        unit: 'g',           baseQty: 100 },

  // ─── Breakfast Specials ───────────────────────────────────────────────────
  dosa:          { cals: 168,  protein: 3.9,  carbs: 29,   fat: 3.7,  alternative: 'Oats Dosa',                                                                        icon: '🥞', category: 'breakfast',    unit: 'dosas',       baseQty: 1   },
  idli:          { cals: 58,   protein: 1.6,  carbs: 12,   fat: 0.2,  alternative: 'Oats Idli',                                                                        icon: '🥟', category: 'breakfast',    unit: 'idlis',       baseQty: 1   },
  paratha:       { cals: 260,  protein: 5.5,  carbs: 35,   fat: 11,   alternative: 'Multigrain Roti',         warning: 'High in oil/ghee.',                           icon: '🫓', category: 'breakfast',    unit: 'paratha',     baseQty: 1   },

  // ─── Beverages ────────────────────────────────────────────────────────────
  'protein shake':{ cals: 150, protein: 25,   carbs: 8,    fat: 2,    alternative: 'Whole Food Protein',                                                               icon: '🥤', category: 'post-workout', unit: 'shake',       baseQty: 1   },
  'black coffee': { cals: 5,   protein: 0.3,  carbs: 0,    fat: 0,    alternative: 'Green Tea',                                                                        icon: '☕', category: 'breakfast',    unit: 'cup',         baseQty: 1   },
  coffee:        { cals: 5,    protein: 0.3,  carbs: 0,    fat: 0,    alternative: 'Green Tea',                                                                        icon: '☕', category: 'breakfast',    unit: 'cup',         baseQty: 1   },
  'green tea':   { cals: 2,    protein: 0,    carbs: 0.5,  fat: 0,    alternative: 'Black Coffee',                                                                     icon: '🍵', category: 'breakfast',    unit: 'cup',         baseQty: 1   },
  'coconut water':{ cals: 19,  protein: 0.7,  carbs: 3.7,  fat: 0.2,  alternative: 'Water + Electrolytes',                                                             icon: '🥥', category: 'pre-workout',  unit: 'ml',          baseQty: 100 },
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

// ─── Multi-word Search ────────────────────────────────────────────────────────
// Tries to find ALL recognizable foods in a natural-language query string.
// e.g. "1 large shawarma and 2 eggs" → [shawarma, eggs]
export function parseNaturalQuery(query: string): { key: string; entry: FoodEntry; qty: number }[] {
  const results: { key: string; entry: FoodEntry; qty: number }[] = [];
  const q = query.toLowerCase();

  for (const [key, entry] of Object.entries(foodDatabase)) {
    if (q.includes(key)) {
      // Try to extract a number before the food name
      const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:large|medium|small|g|ml|cup|scoop|piece|wrap|slice)?\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
      const match = q.match(regex);
      const qty = match ? parseFloat(match[1]) : 1;
      results.push({ key, entry, qty });
    }
  }

  return results;
}
