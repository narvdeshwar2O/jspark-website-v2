import * as Cesium from 'cesium'
import { BEATS } from '../data/hydraTimings'
import { RIVER_PATH } from '../data/riverPath'

// The Alaknanda line, drawn in the SVG overlay like the catchment outline,
// visible from p 0.62 so the geography registers before the flood needs
// it. The Chamoli town marker lives in groundStations, fused with gauge
// G-06 ("CHAMOLI · G-06") so the town carries the gauge's state colour.
const SVG_NS = 'http://www.w3.org/2000/svg'
const SUBDIVISIONS = 4

export async function createRiverMarker(viewer, svg, terrainProvider, getExaggeration) {
  const pts = []
  for (let i = 0; i < RIVER_PATH.length - 1; i += 1) {
    const [lon0, lat0] = RIVER_PATH[i]
    const [lon1, lat1] = RIVER_PATH[i + 1]
    for (let k = 0; k < SUBDIVISIONS; k += 1) {
      const t = k / SUBDIVISIONS
      pts.push(Cesium.Cartographic.fromDegrees(lon0 + (lon1 - lon0) * t, lat0 + (lat1 - lat0) * t))
    }
  }
  const last = RIVER_PATH[RIVER_PATH.length - 1]
  pts.push(Cesium.Cartographic.fromDegrees(last[0], last[1]))
  await Cesium.sampleTerrainMostDetailed(terrainProvider, pts)
  if (viewer.isDestroyed()) return null

  const group = document.createElementNS(SVG_NS, 'g')
  group.style.display = 'none'
  // bg-colour casing beneath the line so it reads over shadow and snow
  const casing = document.createElementNS(SVG_NS, 'path')
  casing.setAttribute('vector-effect', 'non-scaling-stroke')
  casing.setAttribute('stroke', '#05070A')
  casing.setAttribute('stroke-opacity', '0.6')
  casing.setAttribute('stroke-width', '3.25')
  casing.setAttribute('fill', 'none')
  group.appendChild(casing)
  const river = document.createElementNS(SVG_NS, 'path')
  river.setAttribute('vector-effect', 'non-scaling-stroke')
  river.setAttribute('stroke', '#62C6FF')
  river.setAttribute('stroke-opacity', '0.45')
  river.setAttribute('stroke-width', '1.25')
  river.setAttribute('fill', 'none')
  group.appendChild(river)
  svg.appendChild(group)

  const project = (carto, exaggeration) =>
    Cesium.SceneTransforms.worldToWindowCoordinates(
      viewer.scene,
      Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, (carto.height || 0) * exaggeration),
      new Cesium.Cartesian2(),
    )

  const update = (p) => {
    const show = p >= BEATS.riverIn // no upper bound: live monitor at p 1.0 (2a-live)
    group.style.display = show ? '' : 'none'
    if (!show) return
    const exaggeration = getExaggeration()
    let d = ''
    let open = false
    for (const carto of pts) {
      const win = project(carto, exaggeration)
      if (!win) {
        open = false
        continue
      }
      d += `${open ? 'L' : 'M'}${win.x.toFixed(1)} ${win.y.toFixed(1)}`
      open = true
    }
    casing.setAttribute('d', d)
    river.setAttribute('d', d)
  }

  return {
    update,
    destroy() {
      group.remove()
    },
  }
}
