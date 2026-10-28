export type ExerciseType = 'weighted' | 'bodyweight' | 'cardio'

export interface Exercise {
  id: string
  name: string
  type: ExerciseType
  notes: string
}

export interface SetEntry {
  reps: number | null
  weight: number | null // load for weighted; extra weight for bodyweight
  assisted: boolean
  assist: number | null // assistance weight (bodyweight only)
  minutes?: number | null // cardio
  level?: number | null // cardio
}

export interface TrackerState {
  unit: 'kg' | 'lb'
  seed?: number
  exercises: Exercise[]
  routine: Record<string, string[]> // weekday 0 (Sun) - 6 (Sat) -> exercise ids
  logs: Record<string, Record<string, SetEntry[]>> // date -> exercise id -> sets
}

export const STORAGE_KEY = 'workout-tracker-v1'

const defaults = (): TrackerState => ({
  unit: 'kg',
  seed: 3,
  exercises: [
    { id: 'bench-press', name: 'Bench Press', type: 'weighted', notes: '' },
    { id: 'incline-bench-press', name: 'Incline Bench Press', type: 'weighted', notes: '' },
    { id: 'decline-bench-press', name: 'Decline Bench Press', type: 'weighted', notes: '' },
    { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', type: 'weighted', notes: '' },
    { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', type: 'weighted', notes: '' },
    { id: 'dumbbell-fly', name: 'Dumbbell Fly', type: 'weighted', notes: '' },
    { id: 'cable-fly', name: 'Cable Fly', type: 'weighted', notes: '' },
    { id: 'push-ups-weighted', name: 'Push-ups (Weighted)', type: 'weighted', notes: '' },
    { id: 'squat', name: 'Squat', type: 'weighted', notes: '' },
    { id: 'front-squat', name: 'Front Squat', type: 'weighted', notes: '' },
    { id: 'goblet-squat', name: 'Goblet Squat', type: 'weighted', notes: '' },
    { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', type: 'weighted', notes: '' },
    { id: 'leg-press', name: 'Leg Press', type: 'weighted', notes: '' },
    { id: 'lunges', name: 'Lunges', type: 'weighted', notes: '' },
    { id: 'leg-extension', name: 'Leg Extension', type: 'weighted', notes: '' },
    { id: 'leg-curl', name: 'Leg Curl', type: 'weighted', notes: '' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', type: 'weighted', notes: '' },
    { id: 'deadlift', name: 'Deadlift', type: 'weighted', notes: '' },
    { id: 'sumo-deadlift', name: 'Sumo Deadlift', type: 'weighted', notes: '' },
    { id: 'hip-thrust', name: 'Hip Thrust', type: 'weighted', notes: '' },
    { id: 'calf-raise', name: 'Calf Raise', type: 'weighted', notes: '' },
    { id: 'overhead-press', name: 'Overhead Press', type: 'weighted', notes: '' },
    { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', type: 'weighted', notes: '' },
    { id: 'arnold-press', name: 'Arnold Press', type: 'weighted', notes: '' },
    { id: 'lateral-raise', name: 'Lateral Raise', type: 'weighted', notes: '' },
    { id: 'front-raise', name: 'Front Raise', type: 'weighted', notes: '' },
    { id: 'rear-delt-fly', name: 'Rear Delt Fly', type: 'weighted', notes: '' },
    { id: 'face-pull', name: 'Face Pull', type: 'weighted', notes: '' },
    { id: 'upright-row', name: 'Upright Row', type: 'weighted', notes: '' },
    { id: 'shrugs', name: 'Shrugs', type: 'weighted', notes: '' },
    { id: 'barbell-row', name: 'Barbell Row', type: 'weighted', notes: '' },
    { id: 'dumbbell-row', name: 'Dumbbell Row', type: 'weighted', notes: '' },
    { id: 'seated-cable-row', name: 'Seated Cable Row', type: 'weighted', notes: '' },
    { id: 't-bar-row', name: 'T-Bar Row', type: 'weighted', notes: '' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', type: 'weighted', notes: '' },
    { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', type: 'weighted', notes: '' },
    { id: 'barbell-curl', name: 'Barbell Curl', type: 'weighted', notes: '' },
    { id: 'dumbbell-curl', name: 'Dumbbell Curl', type: 'weighted', notes: '' },
    { id: 'hammer-curl', name: 'Hammer Curl', type: 'weighted', notes: '' },
    { id: 'preacher-curl', name: 'Preacher Curl', type: 'weighted', notes: '' },
    { id: 'tricep-pushdown', name: 'Tricep Pushdown', type: 'weighted', notes: '' },
    { id: 'skull-crusher', name: 'Skull Crusher', type: 'weighted', notes: '' },
    { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', type: 'weighted', notes: '' },
    { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', type: 'weighted', notes: '' },
    { id: 'cable-crunch', name: 'Cable Crunch', type: 'weighted', notes: '' },
    { id: 'hanging-leg-raise-weighted', name: 'Hanging Leg Raise (Weighted)', type: 'weighted', notes: '' },
    { id: 'farmer-s-walk', name: 'Farmer\'s Walk', type: 'weighted', notes: '' },
    { id: 'pull-ups', name: 'Pull-ups', type: 'bodyweight', notes: '' },
    { id: 'chin-ups', name: 'Chin-ups', type: 'bodyweight', notes: '' },
    { id: 'dips', name: 'Dips', type: 'bodyweight', notes: '' },
    { id: 'push-ups', name: 'Push-ups', type: 'bodyweight', notes: '' },
    { id: 'inverted-row', name: 'Inverted Row', type: 'bodyweight', notes: '' },
    { id: 'muscle-ups', name: 'Muscle-ups', type: 'bodyweight', notes: '' },
    { id: 'treadmill', name: 'Treadmill', type: 'cardio', notes: '' },
    { id: 'stationary-bike', name: 'Stationary Bike', type: 'cardio', notes: '' },
    { id: 'rowing-machine', name: 'Rowing Machine', type: 'cardio', notes: '' },
    { id: 'cross-trainer', name: 'Cross Trainer', type: 'cardio', notes: '' },
    { id: 'stair-climber', name: 'Stair Climber', type: 'cardio', notes: '' },
    { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', type: 'bodyweight', notes: '' },
    { id: 'plank', name: 'Plank', type: 'bodyweight', notes: '' }
  ],

  routine: { '0': [], '1': ['bench-press', 'overhead-press', 'dips'], '2': ['squat', 'deadlift'], '3': [], '4': ['barbell-row', 'pull-ups'], '5': ['bench-press', 'squat'], '6': [] },
  logs: {}
})

export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Parse yyyy-mm-dd as a local date (avoids UTC shifting)
export const fromDateKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const typeLabel = (t: ExerciseType) => ({ weighted: 'Weighted', bodyweight: 'Bodyweight', cardio: 'Cardio' })[t]

export const emptySet = (): SetEntry => ({ reps: null, weight: null, assisted: false, assist: null, minutes: null, level: null })

export function useTracker() {
  const state = useState<TrackerState>('tracker', () => {
    const base = defaults()
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          const merged = { ...base, ...saved }
          // Old saves used different default ids; add any missing defaults by name
          if ((saved.seed ?? 1) < 3) {
            const have = new Set(merged.exercises.map((e: Exercise) => e.name.toLowerCase()))
            const missing = base.exercises.filter(e => !have.has(e.name.toLowerCase()))
            merged.exercises = [...merged.exercises, ...missing]
            merged.seed = 3
          }
          return merged
        }
      } catch { /* ignore corrupt data */ }
    }
    return base
  })

  const saveError = useState<boolean>('tracker-save-error', () => false)
  const sorted = computed(() => [...state.value.exercises].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })))

  const byId = (id: string) => state.value.exercises.find(e => e.id === id)

  const routineFor = (date: string) =>
    (state.value.routine[String(fromDateKey(date).getDay())] || []).map(byId).filter(Boolean) as Exercise[]

  function lastSession(exId: string, before: string) {
    const dates = Object.keys(state.value.logs)
      .filter(d => d < before && state.value.logs[d]?.[exId]?.length)
      .sort()
    const date = dates[dates.length - 1]
    return date ? { date, sets: state.value.logs[date][exId] } : null
  }

  function formatSet(s: SetEntry, type: ExerciseType) {
    const u = state.value.unit
    if (type === 'cardio') return `${s.minutes ?? '–'} min · Level ${s.level ?? '–'}`
    const reps = `${s.reps ?? '–'} reps`
    if (type === 'bodyweight') {
      if (s.assisted) return `Assisted${s.assist ? ` −${s.assist}${u}` : ''} × ${reps}`
      return `${s.weight ? `BW +${s.weight}${u}` : 'Bodyweight'} × ${reps}`
    }
    return `${s.weight ?? '–'}${u} × ${reps}`
  }

  const setsFor = (date: string, exId: string) => state.value.logs[date]?.[exId] || []

  function ensureSets(date: string, exId: string) {
    state.value.logs[date] ??= {}
    return (state.value.logs[date][exId] ??= [])
  }

  function addSet(date: string, ex: Exercise) {
    const sets = ensureSets(date, ex.id)
    const prev = sets[sets.length - 1] ?? lastSession(ex.id, date)?.sets.slice(-1)[0]
    sets.push(prev ? { ...prev } : emptySet())
  }

  function copyLast(date: string, ex: Exercise) {
    const last = lastSession(ex.id, date)
    if (!last) return
    state.value.logs[date] ??= {}
    state.value.logs[date][ex.id] = last.sets.map(s => ({ ...s }))
  }

  function removeSet(date: string, exId: string, i: number) {
    const log = state.value.logs[date]
    if (!log?.[exId]) return
    log[exId].splice(i, 1)
    if (!log[exId].length) delete log[exId]
    if (!Object.keys(log).length) delete state.value.logs[date]
  }

  function addExercise(name: string, type: ExerciseType) {
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`
    state.value.exercises.push({ id, name: name.trim(), type, notes: '' })
  }

  function deleteExercise(id: string) {
    state.value.exercises = state.value.exercises.filter(e => e.id !== id)
    for (const k of Object.keys(state.value.routine)) {
      state.value.routine[k] = state.value.routine[k].filter(x => x !== id)
    }
  }

  function exportJson() {
    return JSON.stringify({ app: 'workout-tracker', exportedAt: new Date().toISOString(), data: state.value }, null, 2)
  }

  // Returns an error message, or null on success
  function importJson(text: string): string | null {
    let parsed: any
    try { parsed = JSON.parse(text) } catch { return 'That file is not valid JSON.' }
    const d = parsed?.app === 'workout-tracker' ? parsed.data : parsed
    const isObj = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v)
    const types = ['weighted', 'bodyweight', 'cardio']
    if (!d || !Array.isArray(d.exercises) || !isObj(d.routine) || !isObj(d.logs)) {
      return 'This does not look like a Workout Tracker backup.'
    }
    if (!d.exercises.every((e: any) => e && typeof e.id === 'string' && typeof e.name === 'string' && types.includes(e.type))) {
      return 'The backup contains invalid exercises.'
    }
    const routine: Record<string, string[]> = {}
    for (let i = 0; i < 7; i++) {
      const r = d.routine[String(i)]
      routine[String(i)] = Array.isArray(r) ? r.filter((x: unknown) => typeof x === 'string') : []
    }
    state.value = {
      unit: d.unit === 'lb' ? 'lb' : 'kg',
      seed: 3,
      exercises: d.exercises.map((e: any) => ({ id: e.id, name: e.name, type: e.type, notes: typeof e.notes === 'string' ? e.notes : '' })),
      routine,
      logs: d.logs
    }
    return null
  }

  return { exportJson, importJson, sorted, state, saveError, byId, routineFor, lastSession, formatSet, setsFor, addSet, copyLast, removeSet, addExercise, deleteExercise }
}
