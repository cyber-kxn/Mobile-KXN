// Built-in food index. All values are **per 100 g** of the food.
// Keys are compact: n=name, kcal, p=protein, c=carbs, f=fat.
// The app scales these by the grams the user enters.
//
// Figures are sensible approximations for commonly-eaten/cooked portions —
// users can override any value, and add their own foods (stored in the app
// under `foods`) which take precedence over these built-ins.
//
// NOTE: this file is generated from scripts/gen-foods.cjs so the React app and
// the standalone kxn-track.html share the exact same list. Edit the generator,
// not this file, then re-run it.

export const FOOD_DB = [
  // Poultry & meat
  { n: "Chicken Breast (cooked)", kcal: 165, p: 31, c: 0, f: 3.6 },
  { n: "Chicken Thigh (cooked)", kcal: 209, p: 26, c: 0, f: 11 },
  { n: "Chicken Drumstick (cooked)", kcal: 172, p: 28, c: 0, f: 5.7 },
  { n: "Chicken Wing (cooked)", kcal: 203, p: 30, c: 0, f: 8.1 },
  { n: "Turkey Breast (cooked)", kcal: 135, p: 30, c: 0, f: 1 },
  { n: "Turkey Mince (cooked)", kcal: 203, p: 27, c: 0, f: 10 },
  { n: "Beef Mince 5% (cooked)", kcal: 170, p: 26, c: 0, f: 7 },
  { n: "Beef Mince 20% (cooked)", kcal: 254, p: 26, c: 0, f: 17 },
  { n: "Beef Steak (cooked)", kcal: 271, p: 25, c: 0, f: 19 },
  { n: "Ribeye Steak (cooked)", kcal: 291, p: 24, c: 0, f: 22 },
  { n: "Pork Chop (cooked)", kcal: 231, p: 27, c: 0, f: 14 },
  { n: "Pork Loin (cooked)", kcal: 209, p: 29, c: 0, f: 10 },
  { n: "Pork Sausage (cooked)", kcal: 297, p: 18, c: 2, f: 24 },
  { n: "Bacon (cooked)", kcal: 541, p: 37, c: 1.4, f: 42 },
  { n: "Ham (sliced)", kcal: 145, p: 21, c: 1.5, f: 6 },
  { n: "Lamb Chop (cooked)", kcal: 294, p: 25, c: 0, f: 21 },
  { n: "Duck Breast (cooked)", kcal: 195, p: 27, c: 0, f: 10 },
  // Fish & seafood
  { n: "Salmon (cooked)", kcal: 208, p: 20, c: 0, f: 13 },
  { n: "Tuna (canned in water)", kcal: 116, p: 26, c: 0, f: 1 },
  { n: "Tuna Steak (cooked)", kcal: 184, p: 30, c: 0, f: 6 },
  { n: "Cod (cooked)", kcal: 105, p: 23, c: 0, f: 0.9 },
  { n: "Tilapia (cooked)", kcal: 129, p: 26, c: 0, f: 2.7 },
  { n: "Haddock (cooked)", kcal: 90, p: 20, c: 0, f: 0.6 },
  { n: "Mackerel (cooked)", kcal: 262, p: 24, c: 0, f: 18 },
  { n: "Sardines (canned)", kcal: 208, p: 25, c: 0, f: 11 },
  { n: "Prawns (cooked)", kcal: 99, p: 24, c: 0.2, f: 0.3 },
  { n: "Crab (cooked)", kcal: 97, p: 19, c: 0, f: 1.5 },
  // Eggs & dairy
  { n: "Egg (whole)", kcal: 143, p: 13, c: 1.1, f: 9.5 },
  { n: "Egg White", kcal: 52, p: 11, c: 0.7, f: 0.2 },
  { n: "Egg Yolk", kcal: 322, p: 16, c: 3.6, f: 27 },
  { n: "Whole Milk", kcal: 61, p: 3.2, c: 4.8, f: 3.3 },
  { n: "Semi-skimmed Milk", kcal: 47, p: 3.4, c: 4.8, f: 1.7 },
  { n: "Skimmed Milk", kcal: 34, p: 3.4, c: 5, f: 0.1 },
  { n: "Almond Milk (unsweetened)", kcal: 15, p: 0.5, c: 0.6, f: 1.1 },
  { n: "Oat Milk", kcal: 45, p: 1, c: 6.6, f: 1.5 },
  { n: "Soy Milk", kcal: 43, p: 3.3, c: 5, f: 1.8 },
  { n: "Greek Yogurt (0% fat)", kcal: 59, p: 10, c: 3.6, f: 0.4 },
  { n: "Greek Yogurt (full fat)", kcal: 97, p: 9, c: 4, f: 5 },
  { n: "Natural Yogurt", kcal: 61, p: 3.5, c: 4.7, f: 3.3 },
  { n: "Cottage Cheese", kcal: 98, p: 11, c: 3.4, f: 4.3 },
  { n: "Cheddar Cheese", kcal: 402, p: 25, c: 1.3, f: 33 },
  { n: "Mozzarella", kcal: 280, p: 28, c: 3.1, f: 17 },
  { n: "Parmesan", kcal: 431, p: 38, c: 4.1, f: 29 },
  { n: "Feta", kcal: 264, p: 14, c: 4, f: 21 },
  { n: "Cream Cheese", kcal: 342, p: 6, c: 4, f: 34 },
  { n: "Butter", kcal: 717, p: 0.9, c: 0.1, f: 81 },
  { n: "Heavy Cream", kcal: 340, p: 2, c: 3, f: 36 },
  // Grains, bread & cereal
  { n: "White Rice (cooked)", kcal: 130, p: 2.7, c: 28, f: 0.3 },
  { n: "Brown Rice (cooked)", kcal: 123, p: 2.7, c: 26, f: 1 },
  { n: "Basmati Rice (cooked)", kcal: 121, p: 3, c: 25, f: 0.4 },
  { n: "Pasta (cooked)", kcal: 158, p: 6, c: 31, f: 0.9 },
  { n: "Wholewheat Pasta (cooked)", kcal: 124, p: 5, c: 27, f: 0.5 },
  { n: "Egg Noodles (cooked)", kcal: 138, p: 4.5, c: 25, f: 2 },
  { n: "White Bread", kcal: 265, p: 9, c: 49, f: 3.2 },
  { n: "Wholemeal Bread", kcal: 247, p: 13, c: 41, f: 4.2 },
  { n: "Bagel", kcal: 250, p: 10, c: 49, f: 1.5 },
  { n: "Tortilla Wrap", kcal: 310, p: 8, c: 52, f: 7 },
  { n: "Couscous (cooked)", kcal: 112, p: 3.8, c: 23, f: 0.2 },
  { n: "Quinoa (cooked)", kcal: 120, p: 4.4, c: 21, f: 1.9 },
  { n: "Oats (raw)", kcal: 379, p: 13, c: 67, f: 7 },
  { n: "Cornflakes", kcal: 357, p: 7.5, c: 84, f: 0.4 },
  { n: "Granola", kcal: 471, p: 10, c: 64, f: 20 },
  { n: "Weetabix", kcal: 362, p: 12, c: 69, f: 2 },
  // Potatoes
  { n: "Potato (boiled)", kcal: 87, p: 1.9, c: 20, f: 0.1 },
  { n: "Baked Potato", kcal: 93, p: 2.5, c: 21, f: 0.1 },
  { n: "Sweet Potato (cooked)", kcal: 90, p: 2, c: 21, f: 0.1 },
  { n: "Mashed Potato", kcal: 88, p: 2, c: 17, f: 1.5 },
  { n: "French Fries", kcal: 312, p: 3.4, c: 41, f: 15 },
  // Fruit
  { n: "Banana", kcal: 89, p: 1.1, c: 23, f: 0.3 },
  { n: "Apple", kcal: 52, p: 0.3, c: 14, f: 0.2 },
  { n: "Orange", kcal: 47, p: 0.9, c: 12, f: 0.1 },
  { n: "Strawberries", kcal: 32, p: 0.7, c: 7.7, f: 0.3 },
  { n: "Blueberries", kcal: 57, p: 0.7, c: 14, f: 0.3 },
  { n: "Raspberries", kcal: 52, p: 1.2, c: 12, f: 0.7 },
  { n: "Grapes", kcal: 69, p: 0.7, c: 18, f: 0.2 },
  { n: "Pineapple", kcal: 50, p: 0.5, c: 13, f: 0.1 },
  { n: "Mango", kcal: 60, p: 0.8, c: 15, f: 0.4 },
  { n: "Watermelon", kcal: 30, p: 0.6, c: 8, f: 0.2 },
  { n: "Avocado", kcal: 160, p: 2, c: 9, f: 15 },
  { n: "Pear", kcal: 57, p: 0.4, c: 15, f: 0.1 },
  { n: "Peach", kcal: 39, p: 0.9, c: 10, f: 0.3 },
  { n: "Kiwi", kcal: 61, p: 1.1, c: 15, f: 0.5 },
  { n: "Dates", kcal: 282, p: 2.5, c: 75, f: 0.4 },
  { n: "Raisins", kcal: 299, p: 3.1, c: 79, f: 0.5 },
  // Vegetables
  { n: "Broccoli", kcal: 34, p: 2.8, c: 7, f: 0.4 },
  { n: "Spinach", kcal: 23, p: 2.9, c: 3.6, f: 0.4 },
  { n: "Carrot", kcal: 41, p: 0.9, c: 10, f: 0.2 },
  { n: "Tomato", kcal: 18, p: 0.9, c: 3.9, f: 0.2 },
  { n: "Cucumber", kcal: 15, p: 0.7, c: 3.6, f: 0.1 },
  { n: "Bell Pepper", kcal: 31, p: 1, c: 6, f: 0.3 },
  { n: "Onion", kcal: 40, p: 1.1, c: 9, f: 0.1 },
  { n: "Mushrooms", kcal: 22, p: 3.1, c: 3.3, f: 0.3 },
  { n: "Cauliflower", kcal: 25, p: 1.9, c: 5, f: 0.3 },
  { n: "Green Beans", kcal: 31, p: 1.8, c: 7, f: 0.2 },
  { n: "Peas", kcal: 81, p: 5.4, c: 14, f: 0.4 },
  { n: "Sweetcorn", kcal: 86, p: 3.3, c: 19, f: 1.2 },
  { n: "Lettuce", kcal: 15, p: 1.4, c: 2.9, f: 0.2 },
  { n: "Kale", kcal: 49, p: 4.3, c: 9, f: 0.9 },
  { n: "Courgette", kcal: 17, p: 1.2, c: 3.1, f: 0.3 },
  { n: "Aubergine", kcal: 25, p: 1, c: 6, f: 0.2 },
  { n: "Asparagus", kcal: 20, p: 2.2, c: 3.9, f: 0.1 },
  { n: "Brussels Sprouts", kcal: 43, p: 3.4, c: 9, f: 0.3 },
  { n: "Cabbage", kcal: 25, p: 1.3, c: 6, f: 0.1 },
  { n: "Beetroot", kcal: 43, p: 1.6, c: 10, f: 0.2 },
  { n: "Butternut Squash", kcal: 45, p: 1, c: 12, f: 0.1 },
  // Legumes & plant protein
  { n: "Lentils (cooked)", kcal: 116, p: 9, c: 20, f: 0.4 },
  { n: "Chickpeas (cooked)", kcal: 164, p: 9, c: 27, f: 2.6 },
  { n: "Black Beans (cooked)", kcal: 132, p: 9, c: 24, f: 0.5 },
  { n: "Kidney Beans (cooked)", kcal: 127, p: 9, c: 23, f: 0.5 },
  { n: "Baked Beans", kcal: 94, p: 5, c: 15, f: 0.6 },
  { n: "Edamame", kcal: 121, p: 12, c: 9, f: 5 },
  { n: "Tofu", kcal: 76, p: 8, c: 1.9, f: 4.8 },
  { n: "Tempeh", kcal: 192, p: 20, c: 8, f: 11 },
  { n: "Hummus", kcal: 166, p: 8, c: 14, f: 10 },
  // Nuts & seeds
  { n: "Almonds", kcal: 579, p: 21, c: 22, f: 50 },
  { n: "Peanuts", kcal: 567, p: 26, c: 16, f: 49 },
  { n: "Peanut Butter", kcal: 588, p: 25, c: 20, f: 50 },
  { n: "Almond Butter", kcal: 614, p: 21, c: 19, f: 56 },
  { n: "Walnuts", kcal: 654, p: 15, c: 14, f: 65 },
  { n: "Cashews", kcal: 553, p: 18, c: 30, f: 44 },
  { n: "Pistachios", kcal: 560, p: 20, c: 28, f: 45 },
  { n: "Pecans", kcal: 691, p: 9, c: 14, f: 72 },
  { n: "Chia Seeds", kcal: 486, p: 17, c: 42, f: 31 },
  { n: "Flax Seeds", kcal: 534, p: 18, c: 29, f: 42 },
  { n: "Pumpkin Seeds", kcal: 559, p: 30, c: 11, f: 49 },
  { n: "Sunflower Seeds", kcal: 584, p: 21, c: 20, f: 51 },
  // Oils & fats
  { n: "Olive Oil", kcal: 884, p: 0, c: 0, f: 100 },
  { n: "Coconut Oil", kcal: 892, p: 0, c: 0, f: 99 },
  { n: "Vegetable Oil", kcal: 884, p: 0, c: 0, f: 100 },
  { n: "Mayonnaise", kcal: 680, p: 1, c: 0.6, f: 75 },
  // Sweet & supplements
  { n: "Whey Protein Powder", kcal: 360, p: 80, c: 8, f: 6 },
  { n: "Protein Bar", kcal: 350, p: 30, c: 38, f: 9 },
  { n: "Honey", kcal: 304, p: 0.3, c: 82, f: 0 },
  { n: "Maple Syrup", kcal: 260, p: 0, c: 67, f: 0.2 },
  { n: "Sugar", kcal: 387, p: 0, c: 100, f: 0 },
  { n: "Dark Chocolate (70%)", kcal: 598, p: 8, c: 46, f: 43 },
  { n: "Milk Chocolate", kcal: 535, p: 7.6, c: 59, f: 30 },
  { n: "Nutella", kcal: 539, p: 6, c: 57, f: 31 },
  { n: "Jam", kcal: 250, p: 0.4, c: 65, f: 0.1 },
  { n: "Ice Cream", kcal: 207, p: 3.5, c: 24, f: 11 },
  // Condiments & sauces
  { n: "Ketchup", kcal: 101, p: 1.2, c: 26, f: 0.1 },
  { n: "Soy Sauce", kcal: 53, p: 8, c: 4.9, f: 0.6 },
  { n: "BBQ Sauce", kcal: 172, p: 0.8, c: 41, f: 0.6 },
  { n: "Tomato Pasta Sauce", kcal: 56, p: 1.6, c: 8, f: 1.9 },
  { n: "Pesto", kcal: 418, p: 4.8, c: 6, f: 42 },
  // Snacks & baked
  { n: "Potato Crisps", kcal: 536, p: 7, c: 53, f: 35 },
  { n: "Popcorn", kcal: 387, p: 13, c: 78, f: 5 },
  { n: "Cheese Pizza", kcal: 266, p: 11, c: 33, f: 10 },
  { n: "Croissant", kcal: 406, p: 8, c: 46, f: 21 },
  { n: "Digestive Biscuit", kcal: 471, p: 7, c: 63, f: 21 },
  { n: "Pancakes", kcal: 227, p: 6, c: 28, f: 10 },
  { n: "Doughnut", kcal: 452, p: 5, c: 51, f: 25 },
  { n: "Hamburger (plain)", kcal: 250, p: 15, c: 30, f: 9 },
  // Drinks (per 100 ml)
  { n: "Orange Juice", kcal: 45, p: 0.7, c: 10, f: 0.2 },
  { n: "Apple Juice", kcal: 46, p: 0.1, c: 11, f: 0.1 },
  { n: "Cola", kcal: 42, p: 0, c: 11, f: 0 },
  { n: "Beer", kcal: 43, p: 0.5, c: 3.6, f: 0 },
  { n: "Red Wine", kcal: 85, p: 0.1, c: 2.6, f: 0 },
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
