// Live Hydra stage progress, shared with sections outside the pinned stage
// (the hero fades against it, per Scene 00). Deliberately not React state:
// subscribers write straight to the DOM at scroll rate.
const listeners = new Set()

export const hydraProgress = {
  value: 0,
  set(p) {
    this.value = p
    // a throwing subscriber must never stall the other subscribers or the
    // caller's own per-tick work
    listeners.forEach((fn) => {
      try {
        fn(p)
      } catch (err) {
        console.error('hydraProgress subscriber failed', err)
      }
    })
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
