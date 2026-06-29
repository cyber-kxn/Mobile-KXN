// Reference content for the "Learn" tab — concise, practical fundamentals on
// nutrition and training. Educational general guidance, not medical advice.

export const LEARN_ARTICLES = [
  // ---------------- Nutrition ----------------
  {
    id: 'energy-balance',
    cat: 'Nutrition',
    title: 'Calories & energy balance',
    summary: 'The single biggest driver of weight change.',
    sections: [
      { h: 'The basics', body: 'Body weight tracks energy balance: eat more than you burn (a surplus) and you gain; less (a deficit) and you lose. Calories come from protein and carbs (~4 kcal/g) and fat (~9 kcal/g).' },
      { h: 'Finding your numbers', body: 'A rough maintenance estimate is bodyweight (lb) × 14–16, or use a TDEE calculator. Then adjust: ~300–500 kcal/day deficit for fat loss, ~200–300 surplus for lean gaining.' },
      { h: 'In practice', body: 'Scale weight fluctuates daily with water, food and salt. Judge progress on 1–2 week averages, not single days, and adjust intake if the trend stalls for 2–3 weeks.' },
    ],
  },
  {
    id: 'protein',
    cat: 'Nutrition',
    title: 'Protein',
    summary: 'How much, why it matters, and where to get it.',
    sections: [
      { h: 'Why it matters', body: 'Protein builds and repairs muscle, keeps you full, and has the highest thermic effect (you burn more digesting it). It’s the macro to prioritise, especially in a deficit.' },
      { h: 'How much', body: 'A practical target is ~1.6–2.2 g per kg of bodyweight per day (about 0.7–1 g per lb). Higher within that range helps when cutting to preserve muscle.' },
      { h: 'Sources', body: 'Chicken, beef, fish, eggs, dairy (Greek yogurt, cottage cheese), whey, tofu, tempeh and legumes. Spreading intake across meals is fine; total daily amount matters most.' },
    ],
  },
  {
    id: 'carbs',
    cat: 'Nutrition',
    title: 'Carbohydrates',
    summary: 'Your main training fuel.',
    sections: [
      { h: 'Role', body: 'Carbs are the body’s preferred fuel for hard training — they top up muscle glycogen and support performance and recovery. They’re not inherently fattening; excess total calories are.' },
      { h: 'How much', body: 'After setting protein and fat, carbs usually fill the rest of your calories. More active people benefit from more carbs around training.' },
      { h: 'Quality', body: 'Favour mostly minimally-processed sources (rice, oats, potatoes, fruit, wholegrains) for fibre and fullness, but fitting some favourites in is sustainable.' },
    ],
  },
  {
    id: 'fats',
    cat: 'Nutrition',
    title: 'Dietary fat',
    summary: 'Essential — but calorie dense.',
    sections: [
      { h: 'Role', body: 'Fat supports hormones, brain function and absorption of vitamins A, D, E and K. Some is essential, so don’t cut it too low.' },
      { h: 'How much', body: 'Around 0.5–1 g per kg of bodyweight per day is a sensible range. At 9 kcal/g it adds up fast, so it’s an easy lever when adjusting calories.' },
      { h: 'Sources', body: 'Olive oil, nuts, seeds, avocado, oily fish and dairy. Include some unsaturated fats; very high saturated/processed fat intake is best limited.' },
    ],
  },
  {
    id: 'cutting',
    cat: 'Nutrition',
    title: 'Cutting (fat loss)',
    summary: 'Lose fat while keeping muscle.',
    sections: [
      { h: 'Set the deficit', body: 'A moderate deficit (~0.5–1% of bodyweight lost per week) preserves muscle and performance better than crash dieting.' },
      { h: 'Protect muscle', body: 'Keep protein high (top of the range), keep lifting heavy, and don’t drop training volume to zero. Muscle you train is muscle you keep.' },
      { h: 'Stay sane', body: 'Prioritise high-volume, filling foods, allow some flexibility, and take diet breaks at maintenance if energy or adherence dips.' },
    ],
  },
  {
    id: 'bulking',
    cat: 'Nutrition',
    title: 'Bulking (muscle gain)',
    summary: 'Build muscle with minimal fat gain.',
    sections: [
      { h: 'Small surplus', body: 'A modest surplus (~200–300 kcal/day) supports muscle growth without excessive fat. Aim for ~0.25–0.5% bodyweight gained per week (faster for true beginners).' },
      { h: 'Train to grow', body: 'A surplus only builds muscle if you’re progressively overloading. Eat enough protein and push your lifts over time.' },
      { h: 'Monitor', body: 'If weight is climbing too fast or you’re getting soft, trim the surplus. Slow and steady wins.' },
    ],
  },
  {
    id: 'micros-fibre',
    cat: 'Nutrition',
    title: 'Micronutrients & fibre',
    summary: 'The stuff macros don’t cover.',
    sections: [
      { h: 'Vitamins & minerals', body: 'Eating a variety of fruit, veg, wholegrains and protein covers most micronutrient needs. They support energy, immunity and recovery.' },
      { h: 'Fibre', body: 'Aim ~25–35 g/day. Fibre aids digestion, fullness and steadier energy. Vegetables, fruit, legumes, oats and wholegrains are great sources.' },
    ],
  },
  {
    id: 'hydration',
    cat: 'Nutrition',
    title: 'Hydration',
    summary: 'Performance and appetite depend on it.',
    sections: [
      { h: 'How much', body: 'A common target is ~30–40 ml per kg of bodyweight daily, more around training and in heat. Urine that’s pale yellow is a decent gauge.' },
      { h: 'Why', body: 'Even mild dehydration hurts strength, endurance and focus, and thirst is sometimes mistaken for hunger.' },
    ],
  },
  {
    id: 'meal-timing',
    cat: 'Nutrition',
    title: 'Meal timing & frequency',
    summary: 'Mostly preference — totals matter more.',
    sections: [
      { h: 'Frequency', body: 'Whether you eat 2, 4 or 6 meals a day, your daily totals drive results. Pick what keeps you full and consistent.' },
      { h: 'Around training', body: 'Having protein and carbs in the hours before/after training is helpful, but the "anabolic window" is wide — don’t stress exact minutes.' },
    ],
  },

  // ---------------- Training ----------------
  {
    id: 'progressive-overload',
    cat: 'Training',
    title: 'Progressive overload',
    summary: 'The core principle of getting stronger.',
    sections: [
      { h: 'What it is', body: 'Muscles adapt to demands placed on them. To keep progressing you must gradually do more over time — the foundation of all training.' },
      { h: 'Ways to progress', body: 'Add weight, add reps, add sets, improve form/range, slow the tempo, or shorten rest. You don’t need to add weight every session.' },
      { h: 'Track it', body: 'Log your sets, reps and weights (that’s what the Training tab is for) so you can beat previous numbers and see real trends.' },
    ],
  },
  {
    id: 'sets-reps',
    cat: 'Training',
    title: 'Sets, reps & rep ranges',
    summary: 'How to structure your work.',
    sections: [
      { h: 'Rep ranges', body: 'Roughly: 1–5 reps favours strength, 6–12 is great for muscle growth, 12–20+ builds endurance and works well for isolation. Growth happens across a wide range if effort is high.' },
      { h: 'Volume', body: 'A common guideline is ~10–20 hard sets per muscle group per week, split over 1–3 sessions. Start lower and build up.' },
      { h: 'Effort', body: 'Most working sets should end within ~1–3 reps of failure (see RIR). Junk-easy sets do little.' },
    ],
  },
  {
    id: 'rir-failure',
    cat: 'Training',
    title: 'Effort: RIR & training to failure',
    summary: 'How hard each set should be.',
    sections: [
      { h: 'RIR / RPE', body: 'RIR = "reps in reserve" — how many more you could have done. Training at ~1–3 RIR on most sets balances growth with recovery.' },
      { h: 'Failure', body: 'Occasionally going to failure (esp. on isolation/machines) is fine, but doing it on every set — especially big compounds — burns recovery for little extra gain.' },
    ],
  },
  {
    id: 'compound-isolation',
    cat: 'Training',
    title: 'Compound vs isolation',
    summary: 'Use both, in the right order.',
    sections: [
      { h: 'Compounds', body: 'Multi-joint lifts (squat, deadlift, bench, row, press, pull-up) train lots of muscle and let you load heavy — the backbone of a program. Do them first when fresh.' },
      { h: 'Isolation', body: 'Single-joint moves (curls, lateral raises, leg extensions) target specific muscles and add volume with low fatigue. Great as accessories after compounds.' },
    ],
  },
  {
    id: 'splits',
    cat: 'Training',
    title: 'Workout splits',
    summary: 'Full-body, upper/lower, or PPL.',
    sections: [
      { h: 'Full body', body: '2–3 days/week hitting everything — efficient and beginner-friendly.' },
      { h: 'Upper / Lower', body: '4 days/week, alternating upper- and lower-body days. A great balance of frequency and recovery.' },
      { h: 'Push / Pull / Legs', body: 'Push (chest/shoulders/triceps), Pull (back/biceps), Legs. Run over 3–6 days. The best split is the one you’ll do consistently.' },
    ],
  },
  {
    id: 'warmup',
    cat: 'Training',
    title: 'Warming up',
    summary: 'Prime performance, reduce injury risk.',
    sections: [
      { h: 'General', body: '5–10 min of light cardio plus some dynamic movement raises body temperature and gets joints moving.' },
      { h: 'Specific', body: 'Before a heavy lift, do a few ramp-up sets with lighter weight to groove the movement before your working sets.' },
    ],
  },
  {
    id: 'recovery-sleep',
    cat: 'Training',
    title: 'Recovery & sleep',
    summary: 'You grow between sessions, not during.',
    sections: [
      { h: 'Sleep', body: 'Aim for 7–9 hours. Sleep is when most recovery, muscle repair and hormone regulation happen — it’s arguably the most underrated performance tool.' },
      { h: 'Rest days & deloads', body: 'Give each muscle ~48h before training it hard again. Every 4–8 weeks, an easier "deload" week can refresh you and help long-term progress.' },
    ],
  },
  {
    id: 'cardio',
    cat: 'Training',
    title: 'Cardio: LISS vs HIIT',
    summary: 'Both have a place.',
    sections: [
      { h: 'LISS', body: 'Low-intensity steady state (walking, easy cycling) is easy to recover from, great for heart health and burning extra calories without hurting lifting.' },
      { h: 'HIIT', body: 'High-intensity intervals are time-efficient and boost fitness, but are more fatiguing — use it in moderation alongside lifting.' },
      { h: 'For fat loss', body: 'Cardio helps create a deficit, but diet does the heavy lifting. Steps/NEAT across the day add up more than people think.' },
    ],
  },
]

export const LEARN_CATEGORIES = ['Nutrition', 'Training']
