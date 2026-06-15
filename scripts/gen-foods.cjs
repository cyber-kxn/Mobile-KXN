// One-off generator: writes the shared FOOD_DB into both the React module
// (src/lib/foods.js) and the standalone HTML, so the two never drift.
const fs = require('fs')

// [name, kcal, protein, carbs, fat] per 100 g, grouped by category.
const GROUPS = {
  'Poultry & meat': [
    ['Chicken Breast (cooked)', 165, 31, 0, 3.6],
    ['Chicken Thigh (cooked)', 209, 26, 0, 11],
    ['Chicken Drumstick (cooked)', 172, 28, 0, 5.7],
    ['Chicken Wing (cooked)', 203, 30, 0, 8.1],
    ['Turkey Breast (cooked)', 135, 30, 0, 1],
    ['Turkey Mince (cooked)', 203, 27, 0, 10],
    ['Beef Mince 5% (cooked)', 170, 26, 0, 7],
    ['Beef Mince 20% (cooked)', 254, 26, 0, 17],
    ['Beef Steak (cooked)', 271, 25, 0, 19],
    ['Ribeye Steak (cooked)', 291, 24, 0, 22],
    ['Pork Chop (cooked)', 231, 27, 0, 14],
    ['Pork Loin (cooked)', 209, 29, 0, 10],
    ['Pork Sausage (cooked)', 297, 18, 2, 24],
    ['Bacon (cooked)', 541, 37, 1.4, 42],
    ['Ham (sliced)', 145, 21, 1.5, 6],
    ['Lamb Chop (cooked)', 294, 25, 0, 21],
    ['Duck Breast (cooked)', 195, 27, 0, 10],
  ],
  'Fish & seafood': [
    ['Salmon (cooked)', 208, 20, 0, 13],
    ['Tuna (canned in water)', 116, 26, 0, 1],
    ['Tuna Steak (cooked)', 184, 30, 0, 6],
    ['Cod (cooked)', 105, 23, 0, 0.9],
    ['Tilapia (cooked)', 129, 26, 0, 2.7],
    ['Haddock (cooked)', 90, 20, 0, 0.6],
    ['Mackerel (cooked)', 262, 24, 0, 18],
    ['Sardines (canned)', 208, 25, 0, 11],
    ['Prawns (cooked)', 99, 24, 0.2, 0.3],
    ['Crab (cooked)', 97, 19, 0, 1.5],
  ],
  'Eggs & dairy': [
    ['Egg (whole)', 143, 13, 1.1, 9.5],
    ['Egg White', 52, 11, 0.7, 0.2],
    ['Egg Yolk', 322, 16, 3.6, 27],
    ['Whole Milk', 61, 3.2, 4.8, 3.3],
    ['Semi-skimmed Milk', 47, 3.4, 4.8, 1.7],
    ['Skimmed Milk', 34, 3.4, 5, 0.1],
    ['Almond Milk (unsweetened)', 15, 0.5, 0.6, 1.1],
    ['Oat Milk', 45, 1, 6.6, 1.5],
    ['Soy Milk', 43, 3.3, 5, 1.8],
    ['Greek Yogurt (0% fat)', 59, 10, 3.6, 0.4],
    ['Greek Yogurt (full fat)', 97, 9, 4, 5],
    ['Natural Yogurt', 61, 3.5, 4.7, 3.3],
    ['Cottage Cheese', 98, 11, 3.4, 4.3],
    ['Cheddar Cheese', 402, 25, 1.3, 33],
    ['Mozzarella', 280, 28, 3.1, 17],
    ['Parmesan', 431, 38, 4.1, 29],
    ['Feta', 264, 14, 4, 21],
    ['Cream Cheese', 342, 6, 4, 34],
    ['Butter', 717, 0.9, 0.1, 81],
    ['Heavy Cream', 340, 2, 3, 36],
  ],
  'Grains, bread & cereal': [
    ['White Rice (cooked)', 130, 2.7, 28, 0.3],
    ['Brown Rice (cooked)', 123, 2.7, 26, 1],
    ['Basmati Rice (cooked)', 121, 3, 25, 0.4],
    ['Pasta (cooked)', 158, 6, 31, 0.9],
    ['Wholewheat Pasta (cooked)', 124, 5, 27, 0.5],
    ['Egg Noodles (cooked)', 138, 4.5, 25, 2],
    ['White Bread', 265, 9, 49, 3.2],
    ['Wholemeal Bread', 247, 13, 41, 4.2],
    ['Bagel', 250, 10, 49, 1.5],
    ['Tortilla Wrap', 310, 8, 52, 7],
    ['Couscous (cooked)', 112, 3.8, 23, 0.2],
    ['Quinoa (cooked)', 120, 4.4, 21, 1.9],
    ['Oats (raw)', 379, 13, 67, 7],
    ['Cornflakes', 357, 7.5, 84, 0.4],
    ['Granola', 471, 10, 64, 20],
    ['Weetabix', 362, 12, 69, 2],
  ],
  'Potatoes': [
    ['Potato (boiled)', 87, 1.9, 20, 0.1],
    ['Baked Potato', 93, 2.5, 21, 0.1],
    ['Sweet Potato (cooked)', 90, 2, 21, 0.1],
    ['Mashed Potato', 88, 2, 17, 1.5],
    ['French Fries', 312, 3.4, 41, 15],
  ],
  'Fruit': [
    ['Banana', 89, 1.1, 23, 0.3],
    ['Apple', 52, 0.3, 14, 0.2],
    ['Orange', 47, 0.9, 12, 0.1],
    ['Strawberries', 32, 0.7, 7.7, 0.3],
    ['Blueberries', 57, 0.7, 14, 0.3],
    ['Raspberries', 52, 1.2, 12, 0.7],
    ['Grapes', 69, 0.7, 18, 0.2],
    ['Pineapple', 50, 0.5, 13, 0.1],
    ['Mango', 60, 0.8, 15, 0.4],
    ['Watermelon', 30, 0.6, 8, 0.2],
    ['Avocado', 160, 2, 9, 15],
    ['Pear', 57, 0.4, 15, 0.1],
    ['Peach', 39, 0.9, 10, 0.3],
    ['Kiwi', 61, 1.1, 15, 0.5],
    ['Dates', 282, 2.5, 75, 0.4],
    ['Raisins', 299, 3.1, 79, 0.5],
  ],
  'Vegetables': [
    ['Broccoli', 34, 2.8, 7, 0.4],
    ['Spinach', 23, 2.9, 3.6, 0.4],
    ['Carrot', 41, 0.9, 10, 0.2],
    ['Tomato', 18, 0.9, 3.9, 0.2],
    ['Cucumber', 15, 0.7, 3.6, 0.1],
    ['Bell Pepper', 31, 1, 6, 0.3],
    ['Onion', 40, 1.1, 9, 0.1],
    ['Mushrooms', 22, 3.1, 3.3, 0.3],
    ['Cauliflower', 25, 1.9, 5, 0.3],
    ['Green Beans', 31, 1.8, 7, 0.2],
    ['Peas', 81, 5.4, 14, 0.4],
    ['Sweetcorn', 86, 3.3, 19, 1.2],
    ['Lettuce', 15, 1.4, 2.9, 0.2],
    ['Kale', 49, 4.3, 9, 0.9],
    ['Courgette', 17, 1.2, 3.1, 0.3],
    ['Aubergine', 25, 1, 6, 0.2],
    ['Asparagus', 20, 2.2, 3.9, 0.1],
    ['Brussels Sprouts', 43, 3.4, 9, 0.3],
    ['Cabbage', 25, 1.3, 6, 0.1],
    ['Beetroot', 43, 1.6, 10, 0.2],
    ['Butternut Squash', 45, 1, 12, 0.1],
  ],
  'Legumes & plant protein': [
    ['Lentils (cooked)', 116, 9, 20, 0.4],
    ['Chickpeas (cooked)', 164, 9, 27, 2.6],
    ['Black Beans (cooked)', 132, 9, 24, 0.5],
    ['Kidney Beans (cooked)', 127, 9, 23, 0.5],
    ['Baked Beans', 94, 5, 15, 0.6],
    ['Edamame', 121, 12, 9, 5],
    ['Tofu', 76, 8, 1.9, 4.8],
    ['Tempeh', 192, 20, 8, 11],
    ['Hummus', 166, 8, 14, 10],
  ],
  'Nuts & seeds': [
    ['Almonds', 579, 21, 22, 50],
    ['Peanuts', 567, 26, 16, 49],
    ['Peanut Butter', 588, 25, 20, 50],
    ['Almond Butter', 614, 21, 19, 56],
    ['Walnuts', 654, 15, 14, 65],
    ['Cashews', 553, 18, 30, 44],
    ['Pistachios', 560, 20, 28, 45],
    ['Pecans', 691, 9, 14, 72],
    ['Chia Seeds', 486, 17, 42, 31],
    ['Flax Seeds', 534, 18, 29, 42],
    ['Pumpkin Seeds', 559, 30, 11, 49],
    ['Sunflower Seeds', 584, 21, 20, 51],
  ],
  'Oils & fats': [
    ['Olive Oil', 884, 0, 0, 100],
    ['Coconut Oil', 892, 0, 0, 99],
    ['Vegetable Oil', 884, 0, 0, 100],
    ['Mayonnaise', 680, 1, 0.6, 75],
  ],
  'Sweet & supplements': [
    ['Whey Protein Powder', 360, 80, 8, 6],
    ['Protein Bar', 350, 30, 38, 9],
    ['Honey', 304, 0.3, 82, 0],
    ['Maple Syrup', 260, 0, 67, 0.2],
    ['Sugar', 387, 0, 100, 0],
    ['Dark Chocolate (70%)', 598, 8, 46, 43],
    ['Milk Chocolate', 535, 7.6, 59, 30],
    ['Nutella', 539, 6, 57, 31],
    ['Jam', 250, 0.4, 65, 0.1],
    ['Ice Cream', 207, 3.5, 24, 11],
  ],
  'Condiments & sauces': [
    ['Ketchup', 101, 1.2, 26, 0.1],
    ['Soy Sauce', 53, 8, 4.9, 0.6],
    ['BBQ Sauce', 172, 0.8, 41, 0.6],
    ['Tomato Pasta Sauce', 56, 1.6, 8, 1.9],
    ['Pesto', 418, 4.8, 6, 42],
  ],
  'Snacks & baked': [
    ['Potato Crisps', 536, 7, 53, 35],
    ['Popcorn', 387, 13, 78, 5],
    ['Cheese Pizza', 266, 11, 33, 10],
    ['Croissant', 406, 8, 46, 21],
    ['Digestive Biscuit', 471, 7, 63, 21],
    ['Pancakes', 227, 6, 28, 10],
    ['Doughnut', 452, 5, 51, 25],
    ['Hamburger (plain)', 250, 15, 30, 9],
  ],
  'Drinks (per 100 ml)': [
    ['Orange Juice', 45, 0.7, 10, 0.2],
    ['Apple Juice', 46, 0.1, 11, 0.1],
    ['Cola', 42, 0, 11, 0],
    ['Beer', 43, 0.5, 3.6, 0],
    ['Red Wine', 85, 0.1, 2.6, 0],
  ],
}

// Build the array-of-entry source lines with category comments.
function entryLines(indent) {
  const out = []
  for (const [cat, items] of Object.entries(GROUPS)) {
    out.push(`${indent}// ${cat}`)
    for (const [n, kcal, p, c, f] of items) {
      out.push(
        `${indent}{ n: ${JSON.stringify(n)}, kcal: ${kcal}, p: ${p}, c: ${c}, f: ${f} },`
      )
    }
  }
  return out.join('\n')
}

// Sanity: no duplicate names (case-insensitive).
const seen = new Set()
let total = 0
for (const items of Object.values(GROUPS))
  for (const [n] of items) {
    total++
    const k = n.toLowerCase()
    if (seen.has(k)) throw new Error('Duplicate food: ' + n)
    seen.add(k)
  }

// --- Write src/lib/foods.js ------------------------------------------------
const reactFile = `// Built-in food index. All values are **per 100 g** of the food.
// Keys are compact: n=name, kcal, p=protein, c=carbs, f=fat.
// The app scales these by the grams the user enters.
//
// Figures are sensible approximations for commonly-eaten/cooked portions —
// users can override any value, and add their own foods (stored in the app
// under \`foods\`) which take precedence over these built-ins.
//
// NOTE: this file is generated from scripts/gen-foods.cjs so the React app and
// the standalone kxn-track.html share the exact same list. Edit the generator,
// not this file, then re-run it.

export const FOOD_DB = [
${entryLines('  ')}
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
`
fs.writeFileSync('src/lib/foods.js', reactFile)

// --- Patch kxn-track.html --------------------------------------------------
let html = fs.readFileSync('kxn-track.html', 'utf8')
const block =
  '  // Built-in food index — all values are PER 100 g. n=name, kcal, p, c, f.\n' +
  '  const FOOD_DB = [\n' +
  entryLines('    ') +
  '\n  ];'
const re = /  \/\/ Built-in food index[\s\S]*?\n  \];/
if (!re.test(html)) throw new Error('FOOD_DB block not found in kxn-track.html')
html = html.replace(re, block)
fs.writeFileSync('kxn-track.html', html)

console.log('Wrote', total, 'foods to src/lib/foods.js and kxn-track.html')
