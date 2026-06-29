// Exercise info database. Lets the Training tab instantly show what an
// exercise works + how to do it when you type/select it.
//
// Each entry: name, category, equipment, primary[] & secondary[] muscles,
// short how-to steps[], and form cues[]. `aliases` help fuzzy matching.

export const EXERCISE_DB = [
  // --- Chest ---
  {
    name: 'Bench Press', category: 'Compound', equipment: 'Barbell',
    aliases: ['barbell bench', 'flat bench', 'bench'],
    primary: ['Chest'], secondary: ['Triceps', 'Front delts'],
    steps: [
      'Lie flat, eyes under the bar, feet planted.',
      'Grip just wider than shoulders; unrack and hold over chest.',
      'Lower to mid-chest with elbows ~45°.',
      'Press back up until arms are straight.',
    ],
    cues: ['Squeeze shoulder blades back & down', 'Keep wrists stacked over elbows', 'Drive feet into the floor'],
  },
  {
    name: 'Incline Dumbbell Press', category: 'Compound', equipment: 'Dumbbells',
    aliases: ['incline db press', 'incline press'],
    primary: ['Upper chest'], secondary: ['Front delts', 'Triceps'],
    steps: ['Set bench ~30°.', 'Press dumbbells from shoulder level to lockout.', 'Lower under control to chest level.'],
    cues: ['Don’t flare elbows fully', 'Keep a slight arch', 'Control the negative'],
  },
  {
    name: 'Push-up', category: 'Compound', equipment: 'Bodyweight',
    aliases: ['pushup', 'press up'],
    primary: ['Chest'], secondary: ['Triceps', 'Front delts', 'Core'],
    steps: ['Hands ~shoulder width, body in a straight line.', 'Lower until chest nearly touches floor.', 'Press back up.'],
    cues: ['Brace your core', 'Elbows ~45°, not flared', 'Full lockout at top'],
  },
  {
    name: 'Chest Fly', category: 'Isolation', equipment: 'Dumbbells / Cable',
    aliases: ['dumbbell fly', 'pec fly', 'cable fly', 'fly'],
    primary: ['Chest'], secondary: ['Front delts'],
    steps: ['Slight elbow bend, arms wide.', 'Bring hands together over chest in an arc.', 'Reverse slowly to a stretch.'],
    cues: ['Lead with the elbows', 'Don’t turn it into a press', 'Feel the stretch, don’t overdo range'],
  },
  {
    name: 'Dip', category: 'Compound', equipment: 'Bodyweight',
    aliases: ['chest dip', 'tricep dip', 'dips'],
    primary: ['Chest', 'Triceps'], secondary: ['Front delts'],
    steps: ['Support on bars, arms straight.', 'Lower until shoulders ~elbow height.', 'Press back to lockout.'],
    cues: ['Lean forward for chest, upright for triceps', 'Don’t shrug', 'Control the descent'],
  },

  // --- Back ---
  {
    name: 'Deadlift', category: 'Compound', equipment: 'Barbell',
    aliases: ['conventional deadlift', 'dead lift'],
    primary: ['Hamstrings', 'Glutes', 'Lower back'], secondary: ['Lats', 'Traps', 'Core', 'Forearms'],
    steps: ['Bar over mid-foot, shins close.', 'Hinge, grip outside knees, flat back.', 'Drive through the floor, stand tall.', 'Lower by pushing hips back.'],
    cues: ['Brace before you pull', 'Keep the bar against your legs', 'Neutral spine — don’t round'],
  },
  {
    name: 'Romanian Deadlift', category: 'Compound', equipment: 'Barbell',
    aliases: ['rdl', 'romanian dead lift', 'stiff leg deadlift'],
    primary: ['Hamstrings', 'Glutes'], secondary: ['Lower back'],
    steps: ['Start standing, slight knee bend.', 'Push hips back, lower bar along legs.', 'Stop at a hamstring stretch, then drive hips forward.'],
    cues: ['Hips back, not down', 'Bar stays close', 'Feel the hamstring stretch'],
  },
  {
    name: 'Barbell Row', category: 'Compound', equipment: 'Barbell',
    aliases: ['bent over row', 'bent-over row', 'pendlay row', 'bb row'],
    primary: ['Lats', 'Upper back'], secondary: ['Biceps', 'Rear delts'],
    steps: ['Hinge to ~45°, flat back.', 'Pull the bar to lower ribs.', 'Lower under control.'],
    cues: ['Lead with the elbows', 'Squeeze shoulder blades', 'Don’t use momentum'],
  },
  {
    name: 'Pull-up', category: 'Compound', equipment: 'Bodyweight',
    aliases: ['pullup', 'chin-up', 'chinup', 'chin up'],
    primary: ['Lats'], secondary: ['Biceps', 'Upper back', 'Forearms'],
    steps: ['Hang from the bar, hands ~shoulder width.', 'Pull until chin clears the bar.', 'Lower to a full hang.'],
    cues: ['Drive elbows down', 'Avoid swinging', 'Full range each rep'],
  },
  {
    name: 'Lat Pulldown', category: 'Compound', equipment: 'Cable',
    aliases: ['pulldown', 'lat pull down'],
    primary: ['Lats'], secondary: ['Biceps', 'Upper back'],
    steps: ['Grip wider than shoulders, sit tall.', 'Pull the bar to upper chest.', 'Return slowly to a stretch.'],
    cues: ['Chest up, slight lean back', 'Elbows down and back', 'No jerking'],
  },
  {
    name: 'Seated Row', category: 'Compound', equipment: 'Cable',
    aliases: ['cable row', 'seated cable row'],
    primary: ['Upper back', 'Lats'], secondary: ['Biceps', 'Rear delts'],
    steps: ['Sit tall, slight knee bend.', 'Pull the handle to your stomach.', 'Extend arms under control.'],
    cues: ['Squeeze shoulder blades', 'Don’t round forward', 'Keep torso still'],
  },
  {
    name: 'Dumbbell Row', category: 'Compound', equipment: 'Dumbbell',
    aliases: ['db row', 'one arm row', 'single arm row'],
    primary: ['Lats', 'Upper back'], secondary: ['Biceps', 'Rear delts'],
    steps: ['One hand & knee on bench, flat back.', 'Row the dumbbell to your hip.', 'Lower to a stretch.'],
    cues: ['Don’t rotate your torso', 'Pull with the elbow', 'Full stretch at the bottom'],
  },
  {
    name: 'Face Pull', category: 'Isolation', equipment: 'Cable',
    aliases: ['face pulls'],
    primary: ['Rear delts'], secondary: ['Upper back', 'Rotator cuff'],
    steps: ['Set cable at face height with rope.', 'Pull toward your face, hands apart.', 'Return under control.'],
    cues: ['High elbows', 'Squeeze rear delts', 'Light weight, clean reps'],
  },
  {
    name: 'Shrug', category: 'Isolation', equipment: 'Dumbbells / Barbell',
    aliases: ['shrugs'],
    primary: ['Traps'], secondary: [],
    steps: ['Stand tall holding weight.', 'Elevate shoulders straight up.', 'Lower slowly.'],
    cues: ['Don’t roll the shoulders', 'Pause at the top', 'Full range'],
  },

  // --- Shoulders ---
  {
    name: 'Overhead Press', category: 'Compound', equipment: 'Barbell',
    aliases: ['ohp', 'military press', 'shoulder press', 'standing press'],
    primary: ['Front delts'], secondary: ['Triceps', 'Upper chest', 'Core'],
    steps: ['Bar at shoulders, grip just outside shoulders.', 'Brace, press overhead.', 'Lower to the collarbone.'],
    cues: ['Squeeze glutes & core', 'Move head back then through', 'Lock out overhead'],
  },
  {
    name: 'Arnold Press', category: 'Compound', equipment: 'Dumbbells',
    aliases: ['arnold'],
    primary: ['Front delts', 'Side delts'], secondary: ['Triceps'],
    steps: ['Start palms facing you at chin.', 'Rotate and press overhead.', 'Reverse on the way down.'],
    cues: ['Smooth rotation', 'Don’t arch the back', 'Control the negative'],
  },
  {
    name: 'Lateral Raise', category: 'Isolation', equipment: 'Dumbbells',
    aliases: ['side raise', 'lat raise', 'lateral raises'],
    primary: ['Side delts'], secondary: [],
    steps: ['Slight elbow bend, dumbbells at sides.', 'Raise out to shoulder height.', 'Lower slowly.'],
    cues: ['Lead with the elbows', 'Don’t swing', 'Pinky slightly up'],
  },

  // --- Arms ---
  {
    name: 'Bicep Curl', category: 'Isolation', equipment: 'Dumbbells / Barbell',
    aliases: ['curl', 'dumbbell curl', 'barbell curl', 'bicep curls'],
    primary: ['Biceps'], secondary: ['Forearms'],
    steps: ['Arms at sides, palms forward.', 'Curl to the top.', 'Lower fully.'],
    cues: ['Keep elbows pinned', 'No swinging', 'Full stretch at the bottom'],
  },
  {
    name: 'Hammer Curl', category: 'Isolation', equipment: 'Dumbbells',
    aliases: ['hammer curls'],
    primary: ['Biceps', 'Forearms'], secondary: [],
    steps: ['Neutral grip (palms facing in).', 'Curl up keeping the grip.', 'Lower under control.'],
    cues: ['Elbows still', 'Don’t rotate the wrist', 'Controlled tempo'],
  },
  {
    name: 'Tricep Pushdown', category: 'Isolation', equipment: 'Cable',
    aliases: ['pushdown', 'rope pushdown', 'tricep pushdowns'],
    primary: ['Triceps'], secondary: [],
    steps: ['Elbows at sides, grip the bar/rope.', 'Extend down to lockout.', 'Return to ~90°.'],
    cues: ['Pin the elbows', 'Full lockout', 'Don’t lean over it'],
  },
  {
    name: 'Skullcrusher', category: 'Isolation', equipment: 'Barbell / Dumbbells',
    aliases: ['lying tricep extension', 'skull crusher'],
    primary: ['Triceps'], secondary: [],
    steps: ['Lie down, weight over forehead.', 'Bend elbows to lower behind head.', 'Extend back up.'],
    cues: ['Keep elbows in', 'Only the forearms move', 'Control it near your head'],
  },

  // --- Legs ---
  {
    name: 'Squat', category: 'Compound', equipment: 'Barbell',
    aliases: ['back squat', 'barbell squat', 'squats'],
    primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core', 'Lower back'],
    steps: ['Bar on upper back, feet ~shoulder width.', 'Brace, sit down & back.', 'Descend to at least parallel.', 'Drive up through mid-foot.'],
    cues: ['Knees track over toes', 'Chest up, neutral spine', 'Brace hard the whole rep'],
  },
  {
    name: 'Front Squat', category: 'Compound', equipment: 'Barbell',
    aliases: ['front squats'],
    primary: ['Quads'], secondary: ['Glutes', 'Core', 'Upper back'],
    steps: ['Bar racked on front delts, elbows high.', 'Squat down staying upright.', 'Drive up.'],
    cues: ['Elbows up', 'Stay tall', 'Knees forward'],
  },
  {
    name: 'Leg Press', category: 'Compound', equipment: 'Machine',
    aliases: ['leg press machine'],
    primary: ['Quads', 'Glutes'], secondary: ['Hamstrings'],
    steps: ['Feet shoulder width on the platform.', 'Lower until knees ~90°.', 'Press back without locking hard.'],
    cues: ['Don’t let your lower back round', 'Control the descent', 'Full but safe range'],
  },
  {
    name: 'Lunge', category: 'Compound', equipment: 'Dumbbells / Bodyweight',
    aliases: ['lunges', 'walking lunge', 'reverse lunge'],
    primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'],
    steps: ['Step forward into a lunge.', 'Lower back knee toward floor.', 'Drive back up.'],
    cues: ['Torso upright', 'Front knee over ankle', 'Controlled steps'],
  },
  {
    name: 'Bulgarian Split Squat', category: 'Compound', equipment: 'Dumbbells',
    aliases: ['split squat', 'rear foot elevated split squat', 'bulgarian'],
    primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'],
    steps: ['Rear foot on a bench.', 'Lower into a deep lunge.', 'Drive up through the front foot.'],
    cues: ['Most weight on front leg', 'Stay balanced', 'Knee tracks over foot'],
  },
  {
    name: 'Hip Thrust', category: 'Compound', equipment: 'Barbell',
    aliases: ['barbell hip thrust', 'glute bridge'],
    primary: ['Glutes'], secondary: ['Hamstrings'],
    steps: ['Upper back on bench, bar over hips.', 'Drive hips up to lockout.', 'Lower under control.'],
    cues: ['Squeeze glutes at the top', 'Tuck the chin', 'Ribs down, don’t arch'],
  },
  {
    name: 'Leg Extension', category: 'Isolation', equipment: 'Machine',
    aliases: ['leg extensions', 'quad extension'],
    primary: ['Quads'], secondary: [],
    steps: ['Sit, pad on lower shins.', 'Extend legs to straight.', 'Lower slowly.'],
    cues: ['Pause at the top', 'No swinging', 'Control the negative'],
  },
  {
    name: 'Leg Curl', category: 'Isolation', equipment: 'Machine',
    aliases: ['hamstring curl', 'leg curls', 'lying leg curl', 'seated leg curl'],
    primary: ['Hamstrings'], secondary: ['Calves'],
    steps: ['Pad on lower calves.', 'Curl toward your glutes.', 'Return slowly.'],
    cues: ['Don’t lift the hips', 'Full squeeze', 'Slow eccentric'],
  },
  {
    name: 'Calf Raise', category: 'Isolation', equipment: 'Machine / Bodyweight',
    aliases: ['calf raises', 'standing calf raise'],
    primary: ['Calves'], secondary: [],
    steps: ['Balls of feet on an edge.', 'Rise up high onto toes.', 'Lower to a deep stretch.'],
    cues: ['Pause at the top', 'Full stretch at bottom', 'Don’t bounce'],
  },

  // --- Core ---
  {
    name: 'Plank', category: 'Core', equipment: 'Bodyweight',
    aliases: ['front plank'],
    primary: ['Core'], secondary: ['Shoulders', 'Glutes'],
    steps: ['Forearms down, body in a straight line.', 'Brace and hold.'],
    cues: ['Squeeze glutes & abs', 'Don’t let hips sag', 'Neutral neck'],
  },
  {
    name: 'Hanging Leg Raise', category: 'Core', equipment: 'Bodyweight',
    aliases: ['leg raise', 'hanging knee raise'],
    primary: ['Core'], secondary: ['Hip flexors', 'Forearms'],
    steps: ['Hang from a bar.', 'Raise legs to ~90° (or higher).', 'Lower under control.'],
    cues: ['Avoid swinging', 'Curl the pelvis up', 'Controlled tempo'],
  },
  {
    name: 'Crunch', category: 'Core', equipment: 'Bodyweight',
    aliases: ['crunches', 'sit-up', 'situp'],
    primary: ['Abs'], secondary: [],
    steps: ['Lie down, knees bent.', 'Curl shoulders off the floor.', 'Lower slowly.'],
    cues: ['Don’t pull your neck', 'Exhale at the top', 'Slow and controlled'],
  },

  // --- Cardio ---
  {
    name: 'Running', category: 'Cardio', equipment: 'Bodyweight',
    aliases: ['run', 'jog', 'jogging', 'treadmill'],
    primary: ['Cardiovascular'], secondary: ['Legs'],
    steps: ['Warm up easy.', 'Hold a steady, sustainable pace.', 'Cool down and stretch.'],
    cues: ['Relaxed shoulders', 'Land under your hips', 'Breathe rhythmically'],
  },
  {
    name: 'Cycling', category: 'Cardio', equipment: 'Bike',
    aliases: ['bike', 'spin', 'stationary bike'],
    primary: ['Cardiovascular'], secondary: ['Quads', 'Glutes'],
    steps: ['Set a comfortable resistance.', 'Maintain a steady cadence.', 'Cool down at the end.'],
    cues: ['Don’t lock the knees', 'Stay relaxed', 'Adjust seat height'],
  },
  {
    name: 'Rowing Machine', category: 'Cardio', equipment: 'Machine',
    aliases: ['rower', 'rowing', 'erg'],
    primary: ['Cardiovascular'], secondary: ['Back', 'Legs', 'Arms'],
    steps: ['Drive with the legs.', 'Lean back slightly, then pull the handle.', 'Reverse the order to return.'],
    cues: ['Legs → back → arms', 'Smooth, not jerky', 'Don’t hunch'],
  },
]

// Build a lookup map (name + aliases, normalized) → entry.
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim()
const LOOKUP = new Map()
for (const ex of EXERCISE_DB) {
  LOOKUP.set(norm(ex.name), ex)
  for (const a of ex.aliases || []) LOOKUP.set(norm(a), ex)
}

/**
 * Find info for a typed exercise name. Tries exact match, then alias, then a
 * loose contains-match so "incline bench" or "db curl" still resolve.
 */
export function getExerciseInfo(name) {
  if (!name) return null
  const q = norm(name)
  if (!q) return null
  if (LOOKUP.has(q)) return LOOKUP.get(q)
  // Loose match: any known key contained in the query or vice-versa.
  let best = null
  let bestLen = 0
  for (const [key, ex] of LOOKUP) {
    if ((q.includes(key) || key.includes(q)) && key.length > bestLen) {
      best = ex
      bestLen = key.length
    }
  }
  return best
}
