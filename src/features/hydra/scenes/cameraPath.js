import { WAYPOINTS } from '../data/waypoints'
import { BEATS } from '../data/hydraTimings'

// power2.inOut per PROJECT_CONTEXT.md camera easing
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t

// [fromIdx, toIdx, pStart, pEnd] derived from SCENES.md camera notes.
// WP2 is a via point between WP1 (0.34) and WP3 (0.50); Scene 07 travels
// WP4 to WP5 with the flood and the reveal freezes at WP5.
function segments() {
  const c = BEATS.camera
  return [
    [0, 0, 0, c.holdEnd],
    [0, 1, c.holdEnd, c.wp1],
    [1, 2, c.wp1, c.wp2],
    [2, 3, c.wp2, c.wp3],
    [3, 3, c.wp3, c.wp4From],
    [3, 4, c.wp4From, c.wp4],
    [4, 4, c.wp4, c.wp5From],
    [4, 5, c.wp5From, c.wp5],
    [5, 5, c.wp5, 1],
  ]
}

// The camera derives from p only, like everything else in the stage.
export function cameraAt(p) {
  const c = BEATS.camera
  const segs = segments()
  let seg = segs[segs.length - 1]
  for (const s of segs) {
    if (p < s[3]) {
      seg = s
      break
    }
  }
  const [ai, bi, from, to] = seg
  const a = WAYPOINTS[ai]
  const b = WAYPOINTS[bi]
  const t = ai === bi ? 0 : easeInOut(clamp01((p - from) / (to - from)))

  // heights span 30,000 km to 60 km: interpolate in log space so the
  // descent reads as a constant-rate zoom
  let height = Math.exp(lerp(Math.log(a.height), Math.log(b.height), t))

  // Scene 06: slight push-in at WP4. The push carries at full weight while
  // holding WP4, then blends out across the WP4 to WP5 travel so the
  // arrival height is exactly WP5's.
  const push = easeInOut(clamp01((p - c.pushFrom) / (c.pushTo - c.pushFrom)))
  let pushWeight = 0
  if (ai === 4 && bi === 4) pushWeight = 1
  else if (ai === 4 && bi === 5) pushWeight = 1 - t
  else if (ai === 3) pushWeight = 1 // approaching WP4 while the push ramps
  height *= 1 - 0.08 * push * pushWeight

  return {
    lon: lerp(a.lon, b.lon, t),
    lat: lerp(a.lat, b.lat, t),
    height,
    pitch: lerp(a.pitch, b.pitch, t),
    heading: lerp(a.heading || 0, b.heading || 0, t),
  }
}
