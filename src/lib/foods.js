// Built-in food index. All values are **per 100 g** of the food.
// Keys are compact: n=name, kcal, p=protein, c=carbs, f=fat.
// The app scales these by the grams the user enters.
//
// Figures are sensible approximations for commonly-eaten/cooked portions —
// users can override any value, and add their own foods (stored in the app
// under `foods`) which take precedence over these built-ins.

export const FOOD_DB = [
  // Poultry & meat
  { n: 'Chicken Breast (cooked)', kcal: 165, p: 31, c: 0, f: 3.6 },
  { n: 'Chicken Thigh (cooked)', kcal: 209, p: 26, c: 0, f: 11 },
  { n: 'Turkey Mince (cooked)', kcal: 203, p: 27, c: 0, f: 10 },
  { n: 'Beef Mince 5% (cooked)', kcal: 170, p: 26, c: 0, f: 7 },
  { n: 'Beef Steak (cooked)', kcal: 271, p: 25, c: 0, f: 19 },
  { n: 'Pork Chop (cooked)', kcal: 231, p: 27, c: 0, f: 14 },
  { n: 'Bacon (cooked)', kcal: 541, p: 37, c: 1.4, f: 42 },
  // Fish & seafood
  { n: 'Salmon (cooked)', kcal: 208, p: 20, c: 0, f: 13 },
  { n: 'Tuna (canned in water)', kcal: 116, p: 26, c: 0, f: 1 },
  { n: 'Cod (cooked)', kcal: 105, p: 23, c: 0, f: 0.9 },
  { n: 'Prawns (cooked)', kcal: 99, p: 24, c: 0.2, f: 0.3 },
  // Eggs & dairy
  { n: 'Egg (whole)', kcal: 143, p: 13, c: 1.1, f: 9.5 },
  { n: 'Egg White', kcal: 52, p: 11, c: 0.7, f: 0.2 },
  { n: 'Whole Milk', kcal: 61, p: 3.2, c: 4.8, f: 3.3 },
  { n: 'Skimmed Milk', kcal: 34, p: 3.4, c: 5, f: 0.1 },
  { n: 'Greek Yogurt (0% fat)', kcal: 59, p: 10, c: 3.6, f: 0.4 },
  { n: 'Greek Yogurt (full fat)', kcal: 97, p: 9, c: 4, f: 5 },
  { n: 'Cottage Cheese', kcal: 98, p: 11, c: 3.4, f: 4.3 },
  { n: 'Cheddar Cheese', kcal: 402, p: 25, c: 1.3, f: 33 },
  { n: 'Mozzarella', kcal: 280, p: 28, c: 3.1, f: 17 },
  { n: 'Butter', kcal: 717, p: 0.9, c: 0.1, f: 81 },
  // Grains & carbs
  { n: 'White Rice (cooked)', kcal: 130, p: 2.7, c: 28, f: 0.3 },
  { n: 'Brown Rice (cooked)', kcal: 123, p: 2.7, c: 26, f: 1 },
  { n: 'Pasta (cooked)', kcal: 158, p: 6, c: 31, f: 0.9 },
  { n: 'White Bread', kcal: 265, p: 9, c: 49, f: 3.2 },
  { n: 'Wholemeal Bread', kcal: 247, p: 13, c: 41, f: 4.2 },
  { n: 'Oats (raw)', kcal: 379, p: 13, c: 67, f: 7 },
  { n: 'Quinoa (cooked)', kcal: 120, p: 4.4, c: 21, f: 1.9 },
  { n: 'Potato (boiled)', kcal: 87, p: 1.9, c: 20, f: 0.1 },
  { n: 'Sweet Potato (cooked)', kcal: 90, p: 2, c: 21, f: 0.1 },
  // Fruit
  { n: 'Banana', kcal: 89, p: 1.1, c: 23, f: 0.3 },
  { n: 'Apple', kcal: 52, p: 0.3, c: 14, f: 0.2 },
  { n: 'Orange', kcal: 47, p: 0.9, c: 12, f: 0.1 },
  { n: 'Strawberries', kcal: 32, p: 0.7, c: 7.7, f: 0.3 },
  { n: 'Blueberries', kcal: 57, p: 0.7, c: 14, f: 0.3 },
  { n: 'Avocado', kcal: 160, p: 2, c: 9, f: 15 },
  // Vegetables
  { n: 'Broccoli', kcal: 34, p: 2.8, c: 7, f: 0.4 },
  { n: 'Spinach', kcal: 23, p: 2.9, c: 3.6, f: 0.4 },
  { n: 'Carrot', kcal: 41, p: 0.9, c: 10, f: 0.2 },
  { n: 'Tomato', kcal: 18, p: 0.9, c: 3.9, f: 0.2 },
  { n: 'Cucumber', kcal: 15, p: 0.7, c: 3.6, f: 0.1 },
  { n: 'Bell Pepper', kcal: 31, p: 1, c: 6, f: 0.3 },
  { n: 'Onion', kcal: 40, p: 1.1, c: 9, f: 0.1 },
  { n: 'Mushrooms', kcal: 22, p: 3.1, c: 3.3, f: 0.3 },
  // Legumes & plant protein
  { n: 'Lentils (cooked)', kcal: 116, p: 9, c: 20, f: 0.4 },
  { n: 'Chickpeas (cooked)', kcal: 164, p: 9, c: 27, f: 2.6 },
  { n: 'Black Beans (cooked)', kcal: 132, p: 9, c: 24, f: 0.5 },
  { n: 'Kidney Beans (cooked)', kcal: 127, p: 9, c: 23, f: 0.5 },
  { n: 'Tofu', kcal: 76, p: 8, c: 1.9, f: 4.8 },
  { n: 'Hummus', kcal: 166, p: 8, c: 14, f: 10 },
  // Nuts, fats & oils
  { n: 'Almonds', kcal: 579, p: 21, c: 22, f: 50 },
  { n: 'Peanuts', kcal: 567, p: 26, c: 16, f: 49 },
  { n: 'Peanut Butter', kcal: 588, p: 25, c: 20, f: 50 },
  { n: 'Walnuts', kcal: 654, p: 15, c: 14, f: 65 },
  { n: 'Cashews', kcal: 553, p: 18, c: 30, f: 44 },
  { n: 'Olive Oil', kcal: 884, p: 0, c: 0, f: 100 },
  // Supplements & extras
  { n: 'Whey Protein Powder', kcal: 360, p: 80, c: 8, f: 6 },
  { n: 'Honey', kcal: 304, p: 0.3, c: 82, f: 0 },
  { n: 'Sugar', kcal: 387, p: 0, c: 100, f: 0 },
  { n: 'Dark Chocolate (70%)', kcal: 598, p: 8, c: 46, f: 43 },
]

/**
 * Scale a per-100g food profile to a gram amount.
 * Returns diary-entry shaped macros (calories/protein/carbs/fat), rounded.
 */
export function scaleFood(per100, grams) {
  const g = parseFloat(grams)
  const factor = isFinite(g) && g > 0 ? g / 100 : 0
  const r = (n) => Math.round((n * factor + Number.EPSILON) * 10) / 10
  return {
    calories: Math.round(per100.kcal * factor),
    protein: r(per100.p),
    carbs: r(per100.c),
    fat: r(per100.f),
  }
}

/**
 * Merge user custom foods with the built-ins (custom take precedence on a
 * case-insensitive name match), sorted alphabetically.
 */
export function mergeFoods(custom = []) {
  const map = new Map()
  for (const f of FOOD_DB) map.set(f.n.toLowerCase(), f)
  for (const f of custom) map.set(f.n.toLowerCase(), f) // override
  return [...map.values()].sort((a, b) => a.n.localeCompare(b.n))
}
