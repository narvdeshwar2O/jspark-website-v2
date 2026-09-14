// Aggregated, weighted, monotonic load progress for the boot gate.
// SCENES.md (Load gate) is authoritative: pre-fly tile residency is the
// long pole and weighs heaviest; the combined bar never moves backwards;
// the gate holds at 99 percent until every subsystem reports 1.
const WEIGHTS = { prefly: 6, objects: 2, fonts: 1, sections: 1 }
const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0)

const values = { prefly: 0, objects: 0, fonts: 0, sections: 0 }
let best = 0
const listeners = new Set()

const snapshot = () => ({
  progress: best,
  complete: Object.keys(WEIGHTS).every((key) => values[key] >= 1),
  values: { ...values },
})

const notify = () => {
  const combined = Object.keys(WEIGHTS).reduce((sum, key) => sum + WEIGHTS[key] * values[key], 0) / TOTAL_WEIGHT
  best = Math.max(best, combined)
  const snap = snapshot()
  listeners.forEach((fn) => {
    try {
      fn(snap)
    } catch (err) {
      console.error('loadProgress listener failed', err)
    }
  })
}

export const loadProgress = {
  report(key, value) {
    if (!(key in values)) return
    const v = Math.min(1, Math.max(0, value))
    if (v <= values[key]) return // monotonic per subsystem
    values[key] = v
    notify()
  },
  // escape hatch: a failed init must release the gate, never trap the page
  finishAll() {
    Object.keys(values).forEach((key) => {
      values[key] = 1
    })
    notify()
  },
  get: snapshot,
  subscribe(fn) {
    listeners.add(fn)
    fn(snapshot())
    return () => listeners.delete(fn)
  },
}
