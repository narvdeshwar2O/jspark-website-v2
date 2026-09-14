import * as Cesium from 'cesium'
import { clamp01 } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { catchmentArcs } from '../data/catchment'
import { sweepProgress } from './frameMath'

// 1px SVG outline of the catchment boundary, projected from the terrain
// each p tick. Two paths run from the mouth to the head (west and east
// side); each draws in behind the Scene 04 sweep with a dash-offset on a
// normalised path length, then persists at 40% through Scene 07.
const SUBDIVISIONS = 8
const SVG_NS = 'http://www.w3.org/2000/svg'

const densify = (arc) => {
  const points = []
  for (let i = 0; i < arc.length - 1; i += 1) {
    const [lon0, lat0] = arc[i]
    const [lon1, lat1] = arc[i + 1]
    for (let k = 0; k < SUBDIVISIONS; k += 1) {
      const t = k / SUBDIVISIONS
      points.push([lon0 + (lon1 - lon0) * t, lat0 + (lat1 - lat0) * t])
    }
  }
  points.push(arc[arc.length - 1])
  return points
}

export async function createCatchmentOutline(viewer, svg, terrainProvider, getExaggeration) {
  const arcsLonLat = catchmentArcs()
  const arcs = [densify(arcsLonLat.west), densify(arcsLonLat.east)]
  const cartos = arcs.flat().map(([lon, lat]) => Cesium.Cartographic.fromDegrees(lon, lat))
  await Cesium.sampleTerrainMostDetailed(terrainProvider, cartos)
  if (viewer.isDestroyed()) return null
  let cursor = 0
  const arcPoints = arcs.map((arc) => arc.map(() => cartos[cursor++]))

  const group = document.createElementNS(SVG_NS, 'g')
  group.setAttribute('fill', 'none')
  group.style.display = 'none'
  const makePath = (stroke, width, opacity) => {
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('vector-effect', 'non-scaling-stroke')
    path.setAttribute('pathLength', '1')
    path.setAttribute('stroke-dasharray', '1')
    path.setAttribute('stroke', stroke)
    path.setAttribute('stroke-width', String(width))
    path.setAttribute('stroke-opacity', String(opacity))
    return path
  }
  // bg-colour casing beneath each arc so the line reads over shadow and snow
  const paths = arcPoints.map(() => {
    const casing = makePath('#05070A', 3.25, 0.6)
    const line = makePath('#62C6FF', 1.25, 1)
    group.appendChild(casing)
    group.appendChild(line)
    return { casing, line }
  })
  svg.appendChild(group)

  const update = (p) => {
    const show = p >= BEATS.sweep.from // no upper bound: live monitor at p 1.0 (2a-live)
    group.style.display = show ? '' : 'none'
    if (!show) return
    // 90% while drawing in, easing to the persistent 40% by the satellite's exit
    const settle = clamp01((p - BEATS.sweep.to) / (BEATS.satellite.out - BEATS.sweep.to))
    group.setAttribute('opacity', String(0.9 - 0.5 * settle))
    const progress = sweepProgress(p)
    const exaggeration = getExaggeration()
    arcPoints.forEach((points, i) => {
      let d = ''
      let open = false
      for (const carto of points) {
        const world = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, (carto.height || 0) * exaggeration)
        const win = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, world, new Cesium.Cartesian2())
        if (!win) {
          open = false
          continue
        }
        d += `${open ? 'L' : 'M'}${win.x.toFixed(1)} ${win.y.toFixed(1)}`
        open = true
      }
      paths[i].casing.setAttribute('d', d)
      paths[i].line.setAttribute('d', d)
      paths[i].casing.style.strokeDashoffset = String(1 - progress)
      paths[i].line.style.strokeDashoffset = String(1 - progress)
    })
  }

  return {
    update,
    destroy() {
      group.remove()
    },
  }
}
