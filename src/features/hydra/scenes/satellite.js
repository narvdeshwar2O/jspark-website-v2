import * as Cesium from 'cesium'
import { clamp01, easePower2Out } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { CATCHMENT } from '../data/catchment'
import { SATELLITE_HEADING, SATELLITE_IDLE_YAW_SECONDS, SATELLITE_MODEL, SATELLITE_PIXEL_WIDTH } from '../data/models'
import { cameraAt } from './cameraPath'
import { SIGNAL, cameraPositionAt, enuAxes, metersPerPixel, modelReady, playAnimations, sweepProgress } from './frameMath'

// Scene 04 (WP3b): the model rests at the camera's height minus DROP,
// anchored to the world point that projects into the upper-left quadrant
// (clear of the catchment), so the beam crosses the frame diagonally to
// the sweeping footprint: the eye and what it watches in one diagonal.
// It slides in from off-frame fully opaque (no entry fade); only the exit
// fades, in place. Attitude: top face to camera, wings spanning left and
// right, dish south in profile, no roll; the wing rotation is the only
// motion. The scan leaves no light on the terrain: the footprint ellipse
// outline and the 8% cone fill are the only marks of the scan, and the
// catchment outline draw-in is the only record of where it has passed.
// The readout keeps the story's 505 km.
const DROP = 25000
const REST_SCREEN = { x: 0.16, y: 0.16 }
const ENTRY_SCREEN = { x: -0.1, y: -0.1 } // fully off-frame at 170 px, so it enters opaque
// centre of the sensor block's bottom face in model units: the block spans
// z -0.75 to -1.05 in build_satellite.py, and Cesium's corrected local
// frame keeps down as -z. Transformed by the live model matrix each tick.
const APEX_LOCAL = new Cesium.Cartesian3(0, 0, -1.05)
const APEX_GAP_PX = 2.5 // start the beam this far below the hull silhouette

const CONE_RADIUS = 7000
const CONE_FILL_ALPHA = 0.08
const CONE_SEGMENTS = 128
const ELLIPSE_POINTS = 24
const EDGE_WIDTH = 1.25
const SVG_NS = 'http://www.w3.org/2000/svg'
// Measured on the monochrome scheme with lightColor 2.6: bus vs terrain is
// 1.67x unlifted; 0.25 lands 2.0x, above the 1.8x floor.
const LIFT_COLOR = Cesium.Color.fromCssColorString('#C0C6CE')
const LIFT_AMOUNT = 0.25
const EXIT_LENGTH = 0.03 // SCENES.md: exits over 0.62 to 0.65
const PATH_SAMPLES = 16

const lerp = (a, b, t) => a + (b - a) * t

// unit cone side surface: base circle radius 1 at z = 0, apex at z = 1.
// No caps: with front faces culled it renders as exactly one layer.
function coneSideGeometry(segments) {
  const positions = new Float64Array((segments + 2) * 3)
  positions[0] = 0
  positions[1] = 0
  positions[2] = 1
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * 2 * Math.PI
    const o = 3 + i * 3
    positions[o] = Math.cos(angle)
    positions[o + 1] = Math.sin(angle)
    positions[o + 2] = 0
  }
  const indices = new Uint16Array(segments * 3)
  for (let i = 0; i < segments; i += 1) {
    indices[i * 3] = 0
    indices[i * 3 + 1] = 1 + i
    indices[i * 3 + 2] = 2 + i
  }
  return new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: positions,
      }),
    },
    indices,
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere: new Cesium.BoundingSphere(new Cesium.Cartesian3(0, 0, 0.5), 1.2),
  })
}

export async function createSatellite(viewer, terrainProvider, getExaggeration, svg) {
  const { scene } = viewer
  const sat = BEATS.satellite
  const t0 = performance.now()

  // WP3 camera frame
  const wp3 = cameraAt(BEATS.camera.wp3)
  const camPos = cameraPositionAt(BEATS.camera.wp3)
  const { east, north, up } = enuAxes(camPos)
  const pitch = Cesium.Math.toRadians(wp3.pitch)
  const forward = Cesium.Cartesian3.add(
    Cesium.Cartesian3.multiplyByScalar(north, Math.cos(pitch), new Cesium.Cartesian3()),
    Cesium.Cartesian3.multiplyByScalar(up, Math.sin(pitch), new Cesium.Cartesian3()),
    new Cesium.Cartesian3(),
  )
  const frameUp = Cesium.Cartesian3.add(
    Cesium.Cartesian3.multiplyByScalar(north, -Math.sin(pitch), new Cesium.Cartesian3()),
    Cesium.Cartesian3.multiplyByScalar(up, Math.cos(pitch), new Cesium.Cartesian3()),
    new Cesium.Cartesian3(),
  )
  // world anchor that projects to a given screen fraction, on the plane at
  // the satellite's fixed altitude (camera height minus DROP)
  const anchorFor = (sx, sy) => {
    const fovy = viewer.camera.frustum.fovy
    const aspect = viewer.canvas.clientWidth / viewer.canvas.clientHeight
    const xn = sx * 2 - 1
    const yn = 1 - sy * 2
    const dir = Cesium.Cartesian3.clone(forward)
    Cesium.Cartesian3.add(dir, Cesium.Cartesian3.multiplyByScalar(east, Math.tan(fovy / 2) * aspect * xn, new Cesium.Cartesian3()), dir)
    Cesium.Cartesian3.add(dir, Cesium.Cartesian3.multiplyByScalar(frameUp, Math.tan(fovy / 2) * yn, new Cesium.Cartesian3()), dir)
    Cesium.Cartesian3.normalize(dir, dir)
    const vertical = Cesium.Cartesian3.dot(dir, up) // negative: looking down
    const out = Cesium.Cartesian3.clone(camPos)
    Cesium.Cartesian3.add(out, Cesium.Cartesian3.multiplyByScalar(dir, -DROP / vertical, new Cesium.Cartesian3()), out)
    return out
  }
  const restAnchor = anchorFor(REST_SCREEN.x, REST_SCREEN.y)
  const entryAnchor = anchorFor(ENTRY_SCREEN.x, ENTRY_SCREEN.y)
  const positionAt = (enterT) => Cesium.Cartesian3.lerp(entryAnchor, restAnchor, enterT, new Cesium.Cartesian3())

  // Start downloading the satellite model immediately in parallel with terrain
  const modelPromise = Cesium.Model.fromGltfAsync({
    url: SATELLITE_MODEL,
    show: false,
    enableVerticalExaggeration: false, // it is not on the terrain; keep its true altitude
    allowPicking: false,
  })

  // sweep path across the catchment, mouth to head, with true ground
  // heights sampled once along it (exaggeration applied per frame)
  const path = []
  for (let i = 0; i < PATH_SAMPLES; i += 1) {
    const t = i / (PATH_SAMPLES - 1)
    path.push(Cesium.Cartographic.fromDegrees(lerp(CATCHMENT.mouth.lon, CATCHMENT.head.lon, t), lerp(CATCHMENT.mouth.lat, CATCHMENT.head.lat, t)))
  }

  try {
    if (terrainProvider) {
      await Promise.race([
        Cesium.sampleTerrainMostDetailed(terrainProvider, path),
        new Promise((_, reject) => setTimeout(() => reject(new Error('terrain timeout')), 3000)),
      ])
    }
  } catch (err) {
    console.warn('Satellite path terrain sampling fallback used', err)
  }
  if (viewer.isDestroyed()) return null

  const footprintAt = (s) => {
    const f = s * (PATH_SAMPLES - 1)
    const i = Math.min(PATH_SAMPLES - 2, Math.floor(f))
    const k = f - i
    return {
      lon: lerp(path[i].longitude, path[i + 1].longitude, k),
      lat: lerp(path[i].latitude, path[i + 1].latitude, k),
      height: lerp(path[i].height || 0, path[i + 1].height || 0, k),
    }
  }

  // Await model and add to scene primitives immediately
  const model = await modelPromise
  if (viewer.isDestroyed()) return null
  scene.primitives.add(model)
  scene.requestRender()
  await modelReady(model)
  scene.requestRender()
  if (viewer.isDestroyed()) return null
  const hasAnimations = playAnimations(model)

  // lift on this model only, the terrain is untouched. Measured: neither
  // lightColor nor the environment map moves a dark metallic bus under the
  // grazing western light; a small blend toward a neutral light grey does.
  // No glow: it is a base-colour mix, the alpha still drives the fade.
  model.lightColor = new Cesium.Cartesian3(2.6, 2.6, 2.7)
  model.colorBlendMode = Cesium.ColorBlendMode.MIX
  model.colorBlendAmount = LIFT_AMOUNT

  // scale calibration: native radius vs metres per pixel at the WP3 pose.
  // A bounding sphere's diameter overshoots a mesh's visual width by about
  // 1.4x, hence the factor. (Read the radius once at unit scale: Cesium's
  // boundingSphere getter applies the matrix scale twice afterwards.)
  const SPHERE_TO_WIDTH = 1.4
  const restPos = restAnchor
  model.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(restPos)
  const nativeRadius = model.boundingSphere.radius
  const mpp = metersPerPixel(viewer, camPos, restPos)
  let scale = (SATELLITE_PIXEL_WIDTH * SPHERE_TO_WIDTH * mpp) / (2 * nativeRadius)
  // guard: the bounds are read once here at unit scale and never again;
  // a degenerate mesh or distance must not produce Infinity/NaN
  if (!Number.isFinite(scale) || scale <= 0) scale = 1

  // scan cone fill: side surface only (no caps) with front faces culled,
  // so exactly one translucent layer draws; depth test on, no depth write
  const coneFill = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      id: 'cone',
      geometry: coneSideGeometry(CONE_SEGMENTS),
      attributes: { color: Cesium.ColorGeometryInstanceAttribute.fromColor(SIGNAL.withAlpha(CONE_FILL_ALPHA)) },
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: true,
      translucent: true,
      renderState: {
        cull: { enabled: true, face: Cesium.CullFace.FRONT },
        depthTest: { enabled: true },
        depthMask: false,
      },
    }),
    asynchronous: false,
    allowPicking: false,
    show: false,
  })
  scene.primitives.add(coneFill)

  // edges: SVG overlay paths, projected each p tick, DOM-line sharp
  const svgGroup = document.createElementNS(SVG_NS, 'g')
  svgGroup.setAttribute('stroke', '#62C6FF')
  svgGroup.setAttribute('stroke-width', String(EDGE_WIDTH))
  svgGroup.setAttribute('fill', 'none')
  svgGroup.style.display = 'none'
  const addPath = () => {
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('vector-effect', 'non-scaling-stroke')
    svgGroup.appendChild(path)
    return path
  }
  const silhouetteA = addPath()
  const silhouetteB = addPath()
  const ellipsePath = addPath()
  svg.appendChild(svgGroup)

  let idleYaw = 0
  let lastP = -1
  let lastAlpha = -1

  const setConeAlpha = (alpha) => {
    if (alpha === lastAlpha) return
    lastAlpha = alpha
    if (coneFill.ready) {
      coneFill.getGeometryInstanceAttributes('cone').color = Cesium.ColorGeometryInstanceAttribute.toValue(
        SIGNAL.withAlpha(CONE_FILL_ALPHA * alpha),
      )
    }
  }

  // frame whose local z axis points along `dir` (world), for the cone
  const aimFrame = (ground, dir) => {
    const { east, north: n } = enuAxes(ground)
    let x = Cesium.Cartesian3.cross(east, dir, new Cesium.Cartesian3())
    if (Cesium.Cartesian3.magnitude(x) < 1e-6) x = Cesium.Cartesian3.cross(n, dir, new Cesium.Cartesian3())
    Cesium.Cartesian3.normalize(x, x)
    const y = Cesium.Cartesian3.cross(dir, x, new Cesium.Cartesian3())
    const rot = new Cesium.Matrix3(x.x, y.x, dir.x, x.y, y.y, dir.y, x.z, y.z, dir.z)
    return { matrix: Cesium.Matrix4.fromRotationTranslation(rot, ground), x, y }
  }

  const update = (p) => {
    lastP = p
    const exitEnd = sat.out + EXIT_LENGTH
    const visible = p >= sat.in && p < exitEnd
    model.show = visible
    coneFill.show = visible
    svgGroup.style.display = visible ? '' : 'none'
    if (!visible) return

    const enter = easePower2Out(clamp01((p - sat.in) / (sat.entered - sat.in)))
    // opaque from first sight (the drift starts off-frame); only the exit fades
    const alpha = 1 - clamp01((p - sat.out) / EXIT_LENGTH)
    const heading = Cesium.Math.toRadians(SATELLITE_HEADING) + (hasAnimations ? 0 : idleYaw)

    const position = positionAt(enter)
    const matrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      new Cesium.HeadingPitchRoll(heading, 0, 0),
    )
    model.modelMatrix = Cesium.Matrix4.multiplyByUniformScale(matrix, scale, matrix)
    model.color = LIFT_COLOR.withAlpha(alpha)

    // beam apex: the sensor block's bottom face through the live model
    // matrix (tracks entry, roll and scale), nudged a couple of pixels down
    // the beam so the lines never overlap the hull's own silhouette. Fill
    // and silhouette lines share this exact point.
    const apex = Cesium.Matrix4.multiplyByPoint(model.modelMatrix, APEX_LOCAL, new Cesium.Cartesian3())
    const foot = footprintAt(sweepProgress(p))
    const ground = Cesium.Cartesian3.fromRadians(foot.lon, foot.lat, foot.height * getExaggeration())
    const beam = Cesium.Cartesian3.subtract(apex, ground, new Cesium.Cartesian3())
    const beamLength = Cesium.Cartesian3.magnitude(beam)
    const dir = Cesium.Cartesian3.normalize(beam, new Cesium.Cartesian3())
    const hullGap = APEX_GAP_PX * metersPerPixel(viewer, viewer.camera.positionWC, apex)
    Cesium.Cartesian3.subtract(apex, Cesium.Cartesian3.multiplyByScalar(dir, hullGap, new Cesium.Cartesian3()), apex)
    const length = Math.max(1, beamLength - hullGap)
    const frame = aimFrame(ground, dir)
    coneFill.modelMatrix = Cesium.Matrix4.multiplyByScale(
      frame.matrix,
      new Cesium.Cartesian3(CONE_RADIUS, CONE_RADIUS, length),
      new Cesium.Matrix4(),
    )

    // SVG edges, projected in the same tick as the camera update (before
    // the render request) so they track the fill with no frame offset:
    // footprint ellipse plus the two view-dependent silhouette lines
    const ringPoint = (angle) => {
      const out = Cesium.Cartesian3.clone(ground)
      Cesium.Cartesian3.add(out, Cesium.Cartesian3.multiplyByScalar(frame.x, CONE_RADIUS * Math.cos(angle), new Cesium.Cartesian3()), out)
      Cesium.Cartesian3.add(out, Cesium.Cartesian3.multiplyByScalar(frame.y, CONE_RADIUS * Math.sin(angle), new Cesium.Cartesian3()), out)
      return out
    }
    const project = (world) => Cesium.SceneTransforms.worldToWindowCoordinates(scene, world, new Cesium.Cartesian2())

    let d = ''
    let open = false
    for (let i = 0; i <= ELLIPSE_POINTS; i += 1) {
      const win = project(ringPoint((i / ELLIPSE_POINTS) * 2 * Math.PI))
      if (!win) {
        open = false
        continue
      }
      d += `${open ? 'L' : 'M'}${win.x.toFixed(1)} ${win.y.toFixed(1)}`
      open = true
    }
    ellipsePath.setAttribute('d', d)

    const apexWin = project(apex)
    const toCamera = Cesium.Cartesian3.subtract(viewer.camera.positionWC, ground, new Cesium.Cartesian3())
    const axialDistance = Cesium.Cartesian3.dot(toCamera, dir)
    const axial = Cesium.Cartesian3.multiplyByScalar(dir, axialDistance, new Cesium.Cartesian3())
    const planar = Cesium.Cartesian3.subtract(toCamera, axial, new Cesium.Cartesian3())
    const planarDistance = Cesium.Cartesian3.magnitude(planar)
    // exact cone silhouette: the generator through ring angle phi is on the
    // silhouette iff cos(phi - psi) = R(1 - vz/h) / rho, for a camera at
    // axial height vz and planar distance rho in the cone's frame. Reduces
    // to the side-on tangent acos(R/rho) with the camera level with the
    // base; looking down the beam from beyond the apex (the nadir shot),
    // the tangent points swing to the far side of the footprint ellipse.
    const cosTangent = (CONE_RADIUS * (1 - axialDistance / length)) / planarDistance
    const tangentsExist = Math.abs(cosTangent) < 0.985 && !!apexWin
    const setLine = (path, world) => {
      const win = project(world)
      if (!win) {
        path.setAttribute('d', '')
        return
      }
      path.setAttribute('d', `M${apexWin.x.toFixed(1)} ${apexWin.y.toFixed(1)}L${win.x.toFixed(1)} ${win.y.toFixed(1)}`)
    }
    if (tangentsExist) {
      const phi = Math.atan2(Cesium.Cartesian3.dot(planar, frame.y), Cesium.Cartesian3.dot(planar, frame.x))
      const tangent = Math.acos(cosTangent)
      setLine(silhouetteA, ringPoint(phi + tangent))
      setLine(silhouetteB, ringPoint(phi - tangent))
    } else {
      silhouetteA.setAttribute('d', '')
      silhouetteB.setAttribute('d', '')
    }
    svgGroup.setAttribute('opacity', String(0.9 * alpha))
    setConeAlpha(alpha)
  }

  // idle loop: slow yaw rotation without heavy SVG re-projections on idle frames
  const tick = (dtSeconds) => {
    if (hasAnimations || !model.show) return
    idleYaw += (2 * Math.PI * dtSeconds) / SATELLITE_IDLE_YAW_SECONDS
    const heading = Cesium.Math.toRadians(SATELLITE_HEADING) + idleYaw
    const position = positionAt(1)
    const matrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      new Cesium.HeadingPitchRoll(heading, 0, 0),
    )
    model.modelMatrix = Cesium.Matrix4.multiplyByUniformScale(matrix, scale, matrix)
  }

  // visual width estimate at the current camera (sphere diameter / 1.4)
  const pixelWidthNow = () => {
    const centre = Cesium.Matrix4.getTranslation(model.modelMatrix, new Cesium.Cartesian3())
    return (2 * nativeRadius * scale) / SPHERE_TO_WIDTH / metersPerPixel(viewer, viewer.camera.positionWC, centre)
  }

  return {
    model,
    hasAnimations,
    scale,
    readyMs: performance.now() - t0,
    update,
    tick,
    pixelWidthNow,
    footprintAt,
    destroy() {
      if (viewer.isDestroyed()) return
      scene.primitives.remove(model)
      scene.primitives.remove(coneFill)
      svgGroup.remove()
    },
  }
}
