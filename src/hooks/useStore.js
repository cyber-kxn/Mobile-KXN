import { useCallback, useEffect, useRef, useState } from 'react'
import { loadStore, saveStore } from '../lib/storage.js'
import { emptyDay } from '../lib/defaults.js'
import { uid } from '../lib/utils.js'

/**
 * useStore — the single source of truth for the whole app.
 *
 * Holds the persisted store ({ goals, library, days }) in React state, writes
 * every change back to localStorage, and exposes a small, intentional set of
 * actions. Day records are created lazily so empty days never bloat storage.
 */
export function useStore() {
  const [store, setStore] = useState(loadStore)

  // Debounced persistence so rapid edits don't thrash localStorage.
  const timer = useRef(null)
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => saveStore(store), 150)
    return () => clearTimeout(timer.current)
  }, [store])

  // --- Helpers -------------------------------------------------------------

  /** Read a day's record (returns an empty shape if it doesn't exist yet). */
  const getDay = useCallback(
    (key) => store.days[key] || emptyDay(),
    [store.days]
  )

  /** Immutably update a single day's record. */
  const updateDay = useCallback((key, updater) => {
    setStore((prev) => {
      const current = prev.days[key] || emptyDay()
      const next = updater(current)
      return { ...prev, days: { ...prev.days, [key]: next } }
    })
  }, [])

  // --- Goals ---------------------------------------------------------------

  const setGoals = useCallback((goals) => {
    setStore((prev) => ({ ...prev, goals: { ...prev.goals, ...goals } }))
  }, [])

  // --- Food ----------------------------------------------------------------

  const addFood = useCallback(
    (key, entry) => {
      updateDay(key, (day) => ({
        ...day,
        food: [...day.food, { id: uid(), ...entry }],
      }))
    },
    [updateDay]
  )

  const updateFood = useCallback(
    (key, id, patch) => {
      updateDay(key, (day) => ({
        ...day,
        food: day.food.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      }))
    },
    [updateDay]
  )

  const deleteFood = useCallback(
    (key, id) => {
      updateDay(key, (day) => ({
        ...day,
        food: day.food.filter((f) => f.id !== id),
      }))
    },
    [updateDay]
  )

  const duplicateFood = useCallback(
    (key, id) => {
      updateDay(key, (day) => {
        const original = day.food.find((f) => f.id === id)
        if (!original) return day
        const copy = { ...original, id: uid() }
        const idx = day.food.findIndex((f) => f.id === id)
        const food = [...day.food]
        food.splice(idx + 1, 0, copy)
        return { ...day, food }
      })
    },
    [updateDay]
  )

  // --- Training ------------------------------------------------------------

  /** Add an exercise; also register its name in the reusable library. */
  const addExercise = useCallback(
    (key, exercise) => {
      const name = (exercise.name || '').trim()
      updateDay(key, (day) => ({
        ...day,
        training: [...day.training, { id: uid(), ...exercise, name }],
      }))
      if (name) addToLibrary(name)
    },
    [updateDay] // addToLibrary defined below but stable via setStore
  )

  const updateExercise = useCallback(
    (key, id, patch) => {
      updateDay(key, (day) => ({
        ...day,
        training: day.training.map((e) =>
          e.id === id ? { ...e, ...patch } : e
        ),
      }))
      if (patch.name) addToLibrary(patch.name.trim())
    },
    [updateDay]
  )

  const deleteExercise = useCallback(
    (key, id) => {
      updateDay(key, (day) => ({
        ...day,
        training: day.training.filter((e) => e.id !== id),
      }))
    },
    [updateDay]
  )

  const setNotes = useCallback(
    (key, notes) => {
      updateDay(key, (day) => ({ ...day, notes }))
    },
    [updateDay]
  )

  // --- Exercise library ----------------------------------------------------

  function addToLibrary(name) {
    const clean = (name || '').trim()
    if (!clean) return
    setStore((prev) => {
      const exists = prev.library.some(
        (e) => e.toLowerCase() === clean.toLowerCase()
      )
      if (exists) return prev
      return { ...prev, library: [...prev.library, clean] }
    })
  }

  const renameLibraryItem = useCallback((oldName, newName) => {
    const clean = (newName || '').trim()
    if (!clean) return
    setStore((prev) => ({
      ...prev,
      library: prev.library.map((e) => (e === oldName ? clean : e)),
    }))
  }, [])

  const deleteLibraryItem = useCallback((name) => {
    setStore((prev) => ({
      ...prev,
      library: prev.library.filter((e) => e !== name),
    }))
  }, [])

  // --- Bulk (import / reset) ----------------------------------------------

  const replaceStore = useCallback((next) => setStore(next), [])

  return {
    store,
    getDay,
    setGoals,
    // food
    addFood,
    updateFood,
    deleteFood,
    duplicateFood,
    // training
    addExercise,
    updateExercise,
    deleteExercise,
    setNotes,
    // library
    renameLibraryItem,
    deleteLibraryItem,
    // bulk
    replaceStore,
  }
}
