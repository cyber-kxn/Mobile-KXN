// Sensible defaults and seed data so the app feels alive on first open.

export const DEFAULT_GOALS = {
  calories: 2500,
  protein: 150,
  carbs: 250,
  fat: 80,
}

// Common foods offered as quick-fill suggestions in the food form.
// Values are per typical serving — the user can edit anything after adding.
export const COMMON_FOODS = [
  { name: 'Chicken Breast (150g)', calories: 248, protein: 47, carbs: 0, fat: 5 },
  { name: 'White Rice (1 cup)', calories: 205, protein: 4, carbs: 45, fat: 0 },
  { name: 'Whole Egg', calories: 78, protein: 6, carbs: 1, fat: 5 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Greek Yogurt (170g)', calories: 100, protein: 17, carbs: 6, fat: 0 },
  { name: 'Oats (1/2 cup dry)', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Whey Protein Scoop', calories: 120, protein: 24, carbs: 3, fat: 2 },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Peanut Butter (1 tbsp)', calories: 94, protein: 4, carbs: 3, fat: 8 },
  { name: 'Salmon (150g)', calories: 280, protein: 39, carbs: 0, fat: 13 },
  { name: 'Sweet Potato (medium)', calories: 112, protein: 2, carbs: 26, fat: 0 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 4, carbs: 11, fat: 1 },
]

// Starter exercise library — merged with anything the user creates.
export const COMMON_EXERCISES = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull-up',
  'Lat Pulldown',
  'Bicep Curl',
  'Tricep Pushdown',
  'Leg Press',
  'Romanian Deadlift',
  'Lateral Raise',
  'Incline Dumbbell Press',
  'Plank',
  'Running',
  'Cycling',
]

// The shape of a fresh, empty store.
export function emptyStore() {
  return {
    version: 1,
    goals: { ...DEFAULT_GOALS },
    library: [...COMMON_EXERCISES],
    foods: [], // user's custom per-100g foods (built-ins live in lib/foods.js)
    days: {},
  }
}

// The shape of a single day's record.
export function emptyDay() {
  return { food: [], training: [], notes: '' }
}
