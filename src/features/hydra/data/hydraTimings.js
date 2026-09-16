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
  { id: '01', from: 0.0, to: 0.16 },
  { id: '02', from: 0.16, to: 0.33 },
  { id: '03', from: 0.33, to: 0.5 },
  { id: '04', from: 0.5, to: 0.66 },
  { id: '05', from: 0.66, to: 0.83 },
  { id: '06', from: 0.83, to: 1.0 },
]

export const BEATS = {
  rail: { fadeIn: 0.02, outStart: 0.93, outEnd: 0.95 }, // visible during scenes 01-07; slides/fades out before Scene 08 console reveal
  heroFadeEnd: 0.08, // Scene 01: hero fades by 0.08
  exposureRampEnd: 0.08, // Scene 00 transition: exposure 15% to 100%
  labels: [
    { text: '01 / OBSERVE', at: 0.14 },
    { text: '02 / SENSE', at: 0.45 },
    { text: '03 / PREDICT', at: 0.74 },
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
  h1Rainfall: { in: 0.18, out: 0.3 },
  h1Terrain: { in: 0.36, out: 0.48 },
  h1Listen: { in: 0.42, out: 0.48 },
  satellite: { in: 0.5, entered: 0.53, out: 0.62 }, // exit runs 0.62 to 0.65
  sweep: { from: 0.53, to: 0.6 }, // scan cone sweeps the catchment, mouth to head
  panelIn: 0.5,
  radar: { start: 0.62, stagger: 0.02 },
  h1Ground: { in: 0.63, out: 0.71 },
  rain: { from: 0.73, to: 0.84 },
  rainFx: { rampTo: 0.8, fadeOut: 0.84, gone: 0.86 }, // density full by 0.80, layer gone by 0.86
  flood: { from: 0.84, to: 0.95 },
  floodLead: 0.04, // the prediction extent samples the morph at p + this
  riverIn: 0.62, // river line and Chamoli marker appear with the radars
  h1Fourteen: { in: 0.86, out: 0.94, outEnd: 0.955 }, // gone by the reveal frame
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
