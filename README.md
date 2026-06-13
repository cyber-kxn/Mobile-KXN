# KXN Track 🥗🏋️

A **super-simple, mobile-first** calorie & macro tracker **and** gym workout
logger. Local-first — everything is saved in your browser, works offline, and
needs **no account, no backend, no sign-up**.

Two ways to run it — pick whichever you like:

1. **🟢 Zero-setup (recommended):** just open **[`kxn-track.html`](kxn-track.html)**
   in any browser. One self-contained file — no install, no server, no internet,
   works fully offline. Double-click it and start logging.
2. **Dev/source version:** the **React + Vite + Tailwind** app under `src/`
   (great for hacking on it). See [Run it locally](#-run-it-locally).

Both versions have identical features and use the same `kxn-data` localStorage
format, so a JSON backup exported from one imports cleanly into the other.

---

## ✨ Features

### Food / Calories
- One flat, chronological daily list — no breakfast/lunch/dinner buckets.
- Each entry: **name, calories, protein, carbs, fat** — all editable inline.
- Quick-add form with **smart suggestions** for common foods (auto-fills macros).
- **Duplicate** an entry in one tap; edit or delete any entry inline.
- **Live daily totals** and a **Goal Tracker** with a calorie ring + macro bars,
  remaining amounts, and an "under / on track / over" color-coded verdict.
- A separate **Overall Daily Total** strip, kept distinct from the goal view.

### Training / Gym
- **Detailed mode**: exercise name + multiple sets (reps × weight).
- **Quick mode**: title-only logging for cardio, mobility, "I did this".
- **Exercise Library**: every exercise you name is saved and offered as
  **autocomplete** next time. Rename or delete library items in Settings.
- Editable/deletable daily exercise list + an optional **per-day notes** field.

### History & Data
- **Activity heatmap** (last 18 weeks) + a list of logged days with summaries.
  Tap any day to jump straight to it.
- **Date navigation**: arrow back/forward or tap the date for a calendar picker.
  Data persists per day.
- **Export / Import JSON** for backups. **Reset all** to start fresh.

### Polish
- **Dark / light mode** (auto-detects your system, remembers your choice).
- Mobile-first with big touch targets + a bottom tab bar; keyboard-friendly on
  desktop (Enter to save inline edits).
- Accessible: labelled inputs, ARIA attributes, high-contrast colors.
- Input validation: no negative numbers; blank/invalid values become 0.
- Instant, lag-free updates with debounced persistence.

---

## 🚀 Run it locally

### Option A — open the single file (no tools needed)

Download/clone the repo and open **`kxn-track.html`** in your browser
(double-click, or drag it into a tab). That's it. Everything is inlined; it
runs offline forever.

### Option B — run the React source

You'll need **Node.js 18+**.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL Vite prints (default <http://localhost:5173>).

### Production build

```bash
npm run build     # outputs static files to dist/
npm run preview   # preview the production build locally
```

The build uses a relative base path, so `dist/` can be served from any static
host (Netlify, Vercel, GitHub Pages, an S3 bucket, or just opened locally).

---

## 🗂 Project structure

```
kxn-track.html            # ⭐ Standalone app — open this directly, no build
src/                      # React + Vite source (Option B)
├─ main.jsx                # React entry
├─ index.css              # Tailwind layers + component classes
├─ App.jsx                # Shell: header, date nav, tab bar, routing
├─ hooks/
│  ├─ useStore.js         # Single source of truth + all data actions
│  └─ useTheme.js         # Dark/light mode
├─ lib/
│  ├─ storage.js          # localStorage load/save + export/import
│  ├─ date.js             # YYYY-MM-DD day keys & friendly labels
│  ├─ defaults.js         # Default goals, common foods/exercises, seed shape
│  └─ utils.js            # ids, number coercion, totals, rounding
└─ components/
   ├─ Icons.jsx           # Inline SVG icons (no icon dependency)
   ├─ Progress.jsx        # Calorie ring + macro bars
   ├─ DateNav.jsx         # Day switcher
   ├─ food/               # FoodTab, FoodForm, FoodList
   ├─ training/           # TrainingTab, ExerciseForm, ExerciseList
   ├─ history/            # HistoryTab (heatmap + logged days)
   └─ settings/           # SettingsTab (goals, library, backup)
```

### Data model (localStorage key `kxn-data`)

```jsonc
{
  "version": 1,
  "goals": { "calories": 2500, "protein": 150, "carbs": 250, "fat": 80 },
  "library": ["Bench Press", "Squat"],
  "days": {
    "2026-06-13": {
      "food": [
        { "id": "...", "name": "Oats", "calories": 150, "protein": 5, "carbs": 27, "fat": 3 }
      ],
      "training": [
        { "id": "...", "name": "Bench Press", "mode": "detailed",
          "sets": [{ "reps": 8, "weight": 60 }], "note": "" }
      ],
      "notes": "Felt strong today."
    }
  }
}
```

The theme is stored separately under `kxn-theme`.

---

## 🔧 Extending it

- **Add common foods/exercises** → edit `src/lib/defaults.js`.
- **Change default goals** → `DEFAULT_GOALS` in `src/lib/defaults.js`.
- **New data fields** → add them in `useStore.js` actions; `normalize()` in
  `storage.js` keeps old backups compatible.
- **Switch storage to IndexedDB** → swap the implementation in
  `lib/storage.js` (the rest of the app only calls `loadStore`/`saveStore`).
- **New tab/section** → add it to the `TABS` array and `main` switch in `App.jsx`.

---

## 📝 Notes
- All data is stored **only in your browser**. Clearing site data / using a
  different browser starts you fresh — use **Export JSON** for backups.
- No analytics, no network calls, no tracking.

Enjoy — and happy logging! 💪
