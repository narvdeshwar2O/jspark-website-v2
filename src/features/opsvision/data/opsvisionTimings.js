// Scroll-progress timings for the OpsVision stage.
export const OPSVISION_STAGE_SCROLL = 7000

export const OPSVISION_SCENES = [
  { id: '01', label: '01 Surveillance', from: 0.0, to: 0.22 },
  { id: '02', label: '02 Synthesis', from: 0.22, to: 0.42 },
  { id: '03', label: '03 Correlation', from: 0.42, to: 0.62 },
  { id: '04', label: '04 Response', from: 0.62, to: 0.82 },
  { id: '05', label: '05 Deployment', from: 0.82, to: 1.0 },
]

export const OPSVISION_BEATS = {
  heroFadeEnd: 0.08,
  exposureRampEnd: 0.08,
  rail: { fadeIn: 0.02, outStart: 0.93, outEnd: 0.95 },
  panelIn: 0.28,

  plates: {
    p01: { topIn: 0.12, btmIn: 0.15, out: 0.24 },
    p02: { topIn: 0.28, btmIn: 0.31, out: 0.42 },
    p03: { topIn: 0.46, btmIn: 0.49, out: 0.60 },
    p04: { topIn: 0.64, btmIn: 0.67, out: 0.78 },
    p05: { topIn: 0.82, btmIn: 0.85, out: 0.94, outEnd: 0.96 },
  },
}
