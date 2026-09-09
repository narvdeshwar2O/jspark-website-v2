import { gsap } from './scrollSetup'

export const clamp01 = (v) => Math.min(1, Math.max(0, v))

export const easePower1Out = gsap.parseEase('power1.out')
export const easePower1InOut = gsap.parseEase('power1.inOut')
export const easePower2Out = gsap.parseEase('power2.out')

// Text reveals per PROJECT_CONTEXT.md: opacity 0 to 1 plus a 12px upward
// translate over 6% of section progress, power1.out. SCENES.md leaves the
// exit unspecified but always puts a gap between an "out" mark and the next
// scene boundary, so the fade-out starts AT the out mark and runs 4% by
// default (override outEnd where a hard boundary follows sooner). Reduced
// motion: opacity becomes a threshold toggle at the marks, no translate.
export const FADE_IN = 0.06
export const FADE_OUT = 0.04

export function applyReveal(el, p, inAt, outStart = Infinity, opts = {}) {
  if (!el) return
  const { reduced = false, dy = 12, fadeIn = FADE_IN, outEnd = outStart + FADE_OUT } = opts
  let opacity
  let y = 0
  if (reduced) {
    opacity = p >= inAt && p < outStart ? 1 : 0
  } else {
    const tIn = easePower1Out(clamp01((p - inAt) / fadeIn))
    const tOut = outStart === Infinity ? 0 : clamp01((p - outStart) / (outEnd - outStart))
    opacity = Math.min(tIn, 1 - tOut)
    y = (1 - tIn) * dy
  }
  gsap.set(el, { opacity, y, visibility: opacity > 0.001 ? 'visible' : 'hidden' })
}
