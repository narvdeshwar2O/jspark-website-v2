// Live OpsVision stage progress observable
const listeners = new Set()

export const opsvisionProgress = {
  value: 0,
  set(p) {
    this.value = p
    listeners.forEach((fn) => {
      try {
        fn(p)
      } catch (err) {
        console.error('opsvisionProgress subscriber failed', err)
      }
    })
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
