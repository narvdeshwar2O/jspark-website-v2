// Scroll-progress timings for the Hydra stage. SCENES.md is authoritative;
// this module is the one place the code reads them from. Change SCENES.md
// first, then update this file to match.

// Since we replaced the heavy 3D tiles with a lightweight 30-second video,
// we no longer need to calculate internet speed.
// 9000px is a long, comfortable distance that gives the 30-second video
// plenty of scroll-room to play out smoothly.
export const STAGE_SCROLL = 9000

// viewport heights the console layer holds fixed past the Hydra unpin
// before releasing to scroll away with the page; the Feeds pin replaces
// this hold in a later round (SCENES.md Scene 08 transition)
export const CONSOLE_HOLD = 1

export const SCENES = [
  { id: '01', label: '01 Orbit', from: 0.0, to: 0.16 },
  { id: '02', label: '02 Rainfall', from: 0.16, to: 0.23 },
  { id: '03', label: '03 Terrain', from: 0.23, to: 0.30 },
  { id: '04', label: '04 Satellite', from: 0.30, to: 0.37 },
  { id: '05', label: '05 Ground', from: 0.37, to: 0.62 },
  { id: '06', label: '06 Warning', from: 0.62, to: 1.0 },
]

export const BEATS = {
  rail: { fadeIn: 0.02, outStart: 0.93, outEnd: 0.95 }, // visible during scenes 01-07; slides/fades out before Scene 08 console reveal
  heroFadeEnd: 0.08, // Scene 01: hero fades by 0.08
  exposureRampEnd: 0.08, // Scene 00 transition: exposure 15% to 100%
  labels: [
    { text: '01 / OBSERVE', at: 0.14 },
    { text: '02 / SENSE', at: 0.35 },
    { text: '03 / PREDICT', at: 0.65 },
  ],
  grid: { in: 0.2, out: 0.3 }, // Scene 02 graticule
  terrainExaggeration: { at: 0.34, value: 1.4 }, // 1.0 before Scene 03 so Earth and India stay true
  camera: {
    holdEnd: 0.1, // Scene 01: descent begins at 0.10
    wp1: 0.34,
    wp2: 0.42, // via point between WP1 and WP3
    wp3: 0.5,
    wp4From: 0.62,
    wp4: 0.73,
    pushFrom: 0.73, // Scene 06: slight push-in at WP4
    pushTo: 0.84,
    wp5From: 0.84, // Scene 07 travels downstream with the water
    wp5: 0.95, // arrives framed on Chamoli; the reveal freezes here
  },
  // Video-synchronized headline plates (29s video: ~5s cloud, ~7s terrain, ~9s satellite, ~11s radar)
  plates: {
    p02: { topIn: 0.165, btmIn: 0.185, out: 0.225 }, // 5.0s (p ≈ 0.17)
    p03: { topIn: 0.235, btmIn: 0.255, out: 0.295 }, // 7.0s (p ≈ 0.24)
    p04: { topIn: 0.305, btmIn: 0.325, out: 0.365 }, // 9.0s (p ≈ 0.31)
    p05: { topIn: 0.375, btmIn: 0.395, out: 0.460 }, // 11.0s (p ≈ 0.38)
    p06: { topIn: 0.485, btmIn: 0.510, out: 0.600 }, // ~14.5s (p ≈ 0.50)
    p07: { topIn: 0.640, btmIn: 0.665, out: 0.760 }, // ~19.0s (p ≈ 0.65)
    p08: { topIn: 0.825, btmIn: 0.850, out: 0.930, outEnd: 0.945 }, // ~24.5s (p ≈ 0.84)
  },
  h1Rainfall: { in: 0.165, out: 0.225 },
  h1Terrain: { in: 0.235, out: 0.295 },
  h1Listen: { in: 0.255, out: 0.295 },
  satellite: { in: 0.305, entered: 0.325, out: 0.365 },
  sweep: { from: 0.325, to: 0.365 },
  panelIn: 0.31,
  radar: { start: 0.375, stagger: 0.02 },
  h1Ground: { in: 0.485, out: 0.600 },
  rain: { from: 0.485, to: 0.65 },
  rainFx: { rampTo: 0.55, fadeOut: 0.62, gone: 0.65 },
  flood: { from: 0.65, to: 0.95 },
  floodLead: 0.04,
  riverIn: 0.375,
  h1Fourteen: { in: 0.825, out: 0.930, outEnd: 0.945 },
  reveal: 0.95, // Scene 08 begins; stage label and panel chrome hand off here
  // Scene 08 console reveal, mirrored from SCENES.md
  console: {
    shrinkFrom: 0.95, // full bleed begins scaling into the console viewport
    shrinkTo: 0.97, // console at final rect; the data panel is docked as the strip
    cascadeAt: 0.97, // sidebar mounts at 0.970; the cascade latches on the first strict upward crossing, once per session
    borderMs: 240, // sidebar border draw-in
    staggerMs: 80, // per-entry reveal stagger after the border
    label: 0.972, // "04 / HYDRA" above the console
    display: 0.976, // "HYDRA"
    h2: 0.982, // "The flood will come. The warning can come first."
    body: 0.986, // "Flood intelligence for the higher and mid Himalayas."
    button: 0.99, // "SEE HYDRA →", rule 32px beneath
    // round 2a-live (SCENES.md): the map column stays live through Scene 08
    // and the console hold; idle loops continue with renders capped at
    // holdFps. rainDensity quantifies "the Scene 06 sparse density": the
    // value a quarter of the way up that scene's sparse-to-dense ramp.
    idle: {
      blinkSeconds: 2, // alert squares blink period, hard toggle
      holdFps: 30, // render-on-demand cap during Scene 08 and the hold
      rainDensity: 0.25, // light rain over the upper basin
    },
  },
}
