import * as Cesium from 'cesium'
import { clamp01, easePower1InOut } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { GROUND_STATIONS } from '../data/groundStations'
import { RIVER_PATH } from '../data/riverPath'

// The fourteen ground stations as SVG marks, projected per p tick like the
// river line: 10px squares, 1.5px stroke, a bg-colour casing beneath so
// they read over shadow and snow, micro mono labels always on (SCENES.md:
// visibility-first, to be tuned down). Gauge G-06 is fused with the
// Chamoli town marker ("CHAMOLI · G-06") and carries the gauge's state
// colour. State machine: neutral through Scene 05, caution staggered
// across the Scene 06 rain ramp (sensors first, gauges last), and in
// Scene 07 each gauge flips to alert when the flood front passes its
// chainage; the front uses the same ease and path the water surface
// animates with, so gauge state and shoreline agree.
//
// Labels de-collide every tick: after projection, each label that
// intersects an already-placed label or an obstacle (the radar towers)
// moves to the first clear candidate among right, left, above, below of
// its mark, with a 1px leader line when displaced more than 8px from the
// default anchor. Resolve order is fixed (town > gauge > sensor >
// upstream, then data order), so the result is deterministic.
const SVG_NS = 'http://www.w3.org/2000/svg'
const SIZE = 10
const STROKE_WIDTH = 1.5
const CASING_WIDTH = 3.5
const NEUTRAL = '#E6EAF0' // text colour, not text-muted
const CAUTION = '#FFB020'
const ALERT = '#FF5A3C'
const LABEL_HEIGHT = 14 // 11px mono line, plus breathing room in the rect
const LEADER_THRESHOLD = 8

const PRIORITY = { town: 0, gauge: 1, sensor: 2, upstream: 3 }
const rankOf = (station) => (station.town ? PRIORITY.town : PRIORITY[station.kind])

const intersects = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]
const overlapArea = (a, b) =>
  Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]))

export async function createGroundStations(viewer, svg, terrainProvider, getExaggeration) {
  const cartos = GROUND_STATIONS.map((s) => Cesium.Cartographic.fromDegrees(s.lon, s.lat))
  await Cesium.sampleTerrainMostDetailed(terrainProvider, cartos)
  if (viewer.isDestroyed()) return null

  // river chainage in metres for the flood-front comparison
  const mLat = 111320
  const mLon = mLat * Math.cos((RIVER_PATH[0][1] * Math.PI) / 180)
  const chainage = [0]
  for (let i = 1; i < RIVER_PATH.length; i += 1) {
    chainage.push(
      chainage[i - 1] +
        Math.hypot((RIVER_PATH[i][0] - RIVER_PATH[i - 1][0]) * mLon, (RIVER_PATH[i][1] - RIVER_PATH[i - 1][1]) * mLat),
    )
  }
  const riverLength = chainage[chainage.length - 1]

  // caution beats, staggered across the rain ramp: sensors, then upstream,
  // then gauges
  const rainFrom = BEATS.rain.from
  const cautionAt = (station, index) => {
    if (station.kind === 'sensor') return rainFrom + 0.008 * index
    if (station.kind === 'upstream') return rainFrom + 0.02 + 0.008 * index
    return rainFrom + 0.045 + 0.004 * index
  }

  const group = document.createElementNS(SVG_NS, 'g')
  group.style.display = 'none'
  const units = GROUND_STATIONS.map((station, index) => {
    const casing = document.createElementNS(SVG_NS, 'rect')
    casing.setAttribute('width', String(SIZE))
    casing.setAttribute('height', String(SIZE))
    casing.setAttribute('fill', 'none')
    casing.setAttribute('stroke', '#05070A')
    casing.setAttribute('stroke-opacity', '0.6')
    casing.setAttribute('stroke-width', String(CASING_WIDTH))
    group.appendChild(casing)
    const mark = document.createElementNS(SVG_NS, 'rect')
    mark.setAttribute('width', String(SIZE))
    mark.setAttribute('height', String(SIZE))
    mark.setAttribute('fill', 'none')
    mark.setAttribute('stroke-width', String(STROKE_WIDTH))
    group.appendChild(mark)
    const leader = document.createElementNS(SVG_NS, 'line')
    leader.setAttribute('stroke', '#7C8794')
    leader.setAttribute('stroke-width', '1')
    leader.setAttribute('stroke-opacity', '0.6')
    leader.style.display = 'none'
    group.appendChild(leader)
    const label = document.createElementNS(SVG_NS, 'text')
    label.textContent = station.town ? `${station.town} · ${station.id}` : station.id
    label.setAttribute('fill', NEUTRAL)
    label.setAttribute('font-family', "'JetBrains Mono', monospace")
    label.setAttribute('font-size', '11')
    label.setAttribute('stroke', '#05070A')
    label.setAttribute('stroke-width', '3')
    label.setAttribute('stroke-opacity', '0.6')
    label.setAttribute('paint-order', 'stroke')
    group.appendChild(label)
    return { station, index, carto: cartos[index], casing, mark, leader, label, labelWidth: 0, win: null }
  })
  svg.appendChild(group)

  // fixed resolve order: priority rank, then data order
  const resolveOrder = [...units].sort((a, b) => rankOf(a.station) - rankOf(b.station) || a.index - b.index)

  let obstacleProvider = null
  let lastStats = { labels: 0, displaced: 0 }

  const stateAt = (p, unit) => {
    const flood = BEATS.flood
    if (unit.station.kind === 'gauge' && p >= flood.from) {
      const t = easePower1InOut(clamp01((p - flood.from) / (flood.to - flood.from)))
      if (t * riverLength >= chainage[unit.station.riverIndex]) return 'alert'
    }
    if (p >= cautionAt(unit.station, unit.index)) return 'caution'
    return 'neutral'
  }

  const measureLabel = (unit) => {
    if (unit.labelWidth > 0) return unit.labelWidth
    try {
      unit.labelWidth = unit.label.getComputedTextLength()
    } catch {
      unit.labelWidth = 0
    }
    if (!(unit.labelWidth > 0)) unit.labelWidth = unit.label.textContent.length * 6.7
    return unit.labelWidth
  }

  const update = (p) => {
    // no upper bound: the console monitor stays live at p 1.0 (2a-live)
    const show = p >= BEATS.riverIn
    group.style.display = show ? '' : 'none'
    if (!show) return
    const exaggeration = getExaggeration()

    // pass 1: project and place marks
    for (const unit of units) {
      const win = Cesium.SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        Cesium.Cartesian3.fromRadians(unit.carto.longitude, unit.carto.latitude, (unit.carto.height || 0) * exaggeration),
        new Cesium.Cartesian2(),
      )
      unit.win = win || null
      const display = win ? '' : 'none'
      unit.casing.style.display = display
      unit.mark.style.display = display
      unit.label.style.display = display
      if (!win) {
        unit.leader.style.display = 'none'
        continue
      }
      const x = (win.x - SIZE / 2).toFixed(1)
      const y = (win.y - SIZE / 2).toFixed(1)
      unit.casing.setAttribute('x', x)
      unit.casing.setAttribute('y', y)
      unit.mark.setAttribute('x', x)
      unit.mark.setAttribute('y', y)
      const state = stateAt(p, unit)
      unit.state = state
      unit.mark.setAttribute('stroke', state === 'alert' ? ALERT : state === 'caution' ? CAUTION : NEUTRAL)
    }

    // pass 2: resolve label positions against placed labels and obstacles
    const placed = []
    const obstacles = obstacleProvider ? obstacleProvider() : []
    let displaced = 0
    let visible = 0
    for (const unit of resolveOrder) {
      if (!unit.win) continue
      visible += 1
      const w = measureLabel(unit)
      const half = SIZE / 2
      const mx = unit.win.x
      const my = unit.win.y
      // candidate anchors (text x = left edge, y = baseline): right is the
      // default; left, above, below are the displacement options, repeated
      // at growing distances so a label can escape an obstacle larger than
      // one step (a mark can sit inside a radar tower's screen box)
      const makers = [
        (d) => ({ x: mx + half + 6 + d, y: my + 4 }),
        (d) => ({ x: mx - half - 6 - w - d, y: my + 4 }),
        (d) => ({ x: mx - w / 2, y: my - half - 7 - d }),
        (d) => ({ x: mx - w / 2, y: my + half + 14 + d }),
      ]
      const candidates = []
      for (const d of [0, 14, 28, 42]) for (const make of makers) candidates.push(make(d))
      // rect slightly wider than the glyphs so the bg halo cannot graze
      const rectFor = (c) => [c.x - 3, c.y - 12, c.x + w + 3, c.y + LABEL_HEIGHT - 10]
      let chosen = 0
      let chosenOverlap = Infinity
      for (let ci = 0; ci < candidates.length; ci += 1) {
        const r = rectFor(candidates[ci])
        let o = 0
        for (const other of placed) o += overlapArea(r, other)
        for (const other of obstacles) o += overlapArea(r, other)
        if (o === 0) {
          chosen = ci
          chosenOverlap = 0
          break
        }
        if (o < chosenOverlap) {
          chosenOverlap = o
          chosen = ci
        }
      }
      const c = candidates[chosen]
      const rect = rectFor(c)
      placed.push(rect)
      unit.label.setAttribute('x', c.x.toFixed(1))
      unit.label.setAttribute('y', c.y.toFixed(1))
      const shift = Math.hypot(c.x - candidates[0].x, c.y - candidates[0].y)
      if (chosen !== 0) displaced += 1
      if (shift > LEADER_THRESHOLD) {
        // leader from the mark's edge to the nearest point on the label rect
        const lx = Math.min(Math.max(mx, rect[0]), rect[2])
        const ly = Math.min(Math.max(my, rect[1]), rect[3])
        const sx = mx + Math.min(Math.max(lx - mx, -half), half)
        const sy = my + Math.min(Math.max(ly - my, -half), half)
        unit.leader.setAttribute('x1', sx.toFixed(1))
        unit.leader.setAttribute('y1', sy.toFixed(1))
        unit.leader.setAttribute('x2', lx.toFixed(1))
        unit.leader.setAttribute('y2', ly.toFixed(1))
        unit.leader.style.display = ''
      } else {
        unit.leader.style.display = 'none'
      }
    }
    lastStats = { labels: visible, displaced }
  }

  // Scene 08 idle (2a-live): squares in alert blink at a 2s period, a hard
  // opacity toggle per the no-transitions rule; the 0.3 floor keeps the
  // mark legible in its off phase
  const tick = (nowSeconds) => {
    const period = BEATS.console.idle.blinkSeconds
    const on = nowSeconds % period < period / 2
    for (const unit of units) {
      if (unit.state === 'alert') unit.mark.style.opacity = on ? '1' : '0.3'
      else if (unit.mark.style.opacity) unit.mark.style.opacity = ''
    }
  }

  return {
    update,
    tick,
    stateAt: (p) => units.map((u) => ({ id: u.station.id, kind: u.station.kind, town: u.station.town, state: stateAt(p, u) })),
    labelStats: () => ({ ...lastStats }),
    setObstacleProvider(fn) {
      obstacleProvider = fn
    },
    destroy() {
      group.remove()
    },
  }
}
