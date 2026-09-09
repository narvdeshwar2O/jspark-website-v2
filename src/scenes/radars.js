import * as Cesium from 'cesium'
import { clamp01, easePower2Out } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { RADAR_HEADING, RADAR_HEIGHT_OFFSET, RADAR_IDLE_YAW_SECONDS, RADAR_MIN_PIXELS, RADAR_MODEL, RADAR_PIXEL_WIDTH } from '../data/models'
import { RADAR_RADIUS_METRES, RADAR_STATIONS, RADAR_SWEEP_SECONDS } from '../data/radarStations'
import { SIGNAL, cameraPositionAt, metersPerPixel, modelReady, playAnimations } from './frameMath'

const SCALE_IN_LENGTH = 0.03

// expanding 1px ring: st is 0..1 across the ellipse's bounding box, so the
// 30 km edge sits at d = 1. Overlapping rings blend brighter on their own.
const RING_SHADER = `
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float d = distance(st, vec2(0.5)) * 2.0;
  float ring = 1.0 - smoothstep(0.0, width, abs(d - progress));
  float fade = 1.0 - progress * 0.8;
  material.diffuse = color.rgb;
  material.alpha = ring * color.a * fade * intensity;
  return material;
}
`

export async function createRadars(viewer, terrainProvider, getExaggeration) {
  const { scene } = viewer
  const t0 = performance.now()

  // clamp to terrain: true heights; the models exaggerate with the terrain
  const cartos = RADAR_STATIONS.map((s) => Cesium.Cartographic.fromDegrees(s.lon, s.lat))
  await Cesium.sampleTerrainMostDetailed(terrainProvider, cartos)
  if (viewer.isDestroyed()) return null

  const wp4Cam = cameraPositionAt(BEATS.camera.wp4)
  const units = []
  for (let i = 0; i < RADAR_STATIONS.length; i += 1) {
    const carto = cartos[i]
    const position = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, (carto.height || 0) + RADAR_HEIGHT_OFFSET)
    // No minimumPixelSize: Cesium derives its compensation from the native
    // radius and then applies it on top of the matrix scale, which blew each
    // radar up to ~8x during its scale-in. The pixel floor is ours, below.
    // No enableVerticalExaggeration either: measured, it left the towers at
    // true height while the terrain rendered at 1.4x, burying them ~900m
    // below the surface. The exaggerated position is ours, in apply().
    // eslint-disable-next-line no-await-in-loop
    const model = await Cesium.Model.fromGltfAsync({
      url: RADAR_MODEL,
      show: false,
      enableVerticalExaggeration: false,
      allowPicking: false,
    })
    if (viewer.isDestroyed()) return null
    scene.primitives.add(model)
    // eslint-disable-next-line no-await-in-loop
    await modelReady(model)
    if (viewer.isDestroyed()) return null
    const hasAnimations = playAnimations(model)

    // same lift as the satellite (measured there): neither lightColor nor
    // the environment map moves a dark metallic mesh under the grazing
    // western light; a small base-colour blend toward neutral light grey
    // does. Without it the towers render black on black at any size.
    model.lightColor = new Cesium.Cartesian3(2.6, 2.6, 2.7)
    model.colorBlendMode = Cesium.ColorBlendMode.MIX
    model.colorBlendAmount = 0.25
    model.color = Cesium.Color.fromCssColorString('#C0C6CE')

    // calibrate once at unit scale, straight after load, and never read the
    // bounds again: every later scale derives from this constant
    const base = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(RADAR_HEADING), 0, 0),
    )
    model.modelMatrix = base
    const nativeRadius = model.boundingSphere.radius
    const scale = (RADAR_PIXEL_WIDTH * 1.4 * metersPerPixel(viewer, wp4Cam, position)) / (2 * nativeRadius)
    const maxScale = scale * 3

    const material = new Cesium.Material({
      fabric: {
        // width is in st units of the 60 km box: 0.004 is ~240 m, about 1 to
        // 2 px from the WP4 pose
        uniforms: { color: SIGNAL.withAlpha(0.4), progress: 0, width: 0.004, intensity: 0 },
        source: RING_SHADER,
      },
      translucent: true,
    })
    const ring = new Cesium.GroundPrimitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.EllipseGeometry({
          center: Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude),
          semiMajorAxis: RADAR_RADIUS_METRES,
          semiMinorAxis: RADAR_RADIUS_METRES,
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        }),
      }),
      appearance: new Cesium.EllipsoidSurfaceAppearance({ material, aboveGround: false }),
      classificationType: Cesium.ClassificationType.TERRAIN,
      allowPicking: false,
      show: false,
    })
    scene.primitives.add(ring)

    units.push({ station: RADAR_STATIONS[i], carto, position, trueHeight: carto.height || 0, model, hasAnimations, nativeRadius, scale, maxScale, material, ring, idleYaw: 0, reveal: 0, appliedScale: 0 })
  }

  const radar = BEATS.radar
  let lastP = -1

  const apply = (unit, i, p) => {
    const start = radar.start + i * radar.stagger
    const t = easePower2Out(clamp01((p - start) / SCALE_IN_LENGTH))
    unit.reveal = t
    // ring line width tracks the camera so it stays ~1.5 px on screen
    // (the width uniform is in normalised diameter units of the 2R box)
    unit.material.uniforms.width =
      (1.5 * metersPerPixel(viewer, viewer.camera.positionWC, unit.position)) / RADAR_RADIUS_METRES
    // pixel floor from the stored native radius and the live camera distance,
    // so a far radar never drops below RADAR_MIN_PIXELS
    const mppNow = metersPerPixel(viewer, viewer.camera.positionWC, unit.position)
    const floor = (RADAR_MIN_PIXELS * 1.4 * mppNow) / (2 * unit.nativeRadius)
    let intended = Math.max(unit.scale, floor) * t
    if (!Number.isFinite(intended) || intended <= 0) intended = 0
    intended = Math.min(intended, unit.maxScale)
    unit.appliedScale = intended
    const visible = intended > 0
    unit.model.show = visible
    unit.ring.show = visible
    unit.material.uniforms.intensity = t
    if (!visible) return
    // stand on the exaggerated terrain: the surface renders at the scene's
    // verticalExaggeration, so the model's base must too
    const grounded = Cesium.Cartesian3.fromRadians(
      unit.carto.longitude,
      unit.carto.latitude,
      unit.trueHeight * (getExaggeration ? getExaggeration() : 1) + RADAR_HEIGHT_OFFSET,
    )
    unit.position = grounded
    const matrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      grounded,
      new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(RADAR_HEADING) + (unit.hasAnimations ? 0 : unit.idleYaw), 0, 0),
    )
    unit.model.modelMatrix = Cesium.Matrix4.multiplyByUniformScale(matrix, intended, matrix)
  }

  // projected width in px from the native radius (never from live bounds)
  const pixelWidth = (unit) =>
    (2 * unit.nativeRadius * unit.appliedScale) / 1.4 / metersPerPixel(viewer, viewer.camera.positionWC, unit.position)

  // screen-space boxes around the visible towers, used by the station
  // label de-collision as obstacles (the tower rises from its base, so the
  // box extends mostly upward from the projected position)
  const screenRects = () => {
    const rects = []
    for (const unit of units) {
      if (!unit.model.show) continue
      const win = Cesium.SceneTransforms.worldToWindowCoordinates(scene, unit.position, new Cesium.Cartesian2())
      if (!win) continue
      const px = pixelWidth(unit)
      rects.push([win.x - px * 0.55, win.y - px * 1.05, win.x + px * 0.55, win.y + px * 0.15])
    }
    return rects
  }

  const update = (p) => {
    lastP = p
    units.forEach((unit, i) => apply(unit, i, p))
  }

  // idle loops: coverage ring sweep (4s repeat, staggered phase) and a dish
  // yaw for meshes without their own animations
  const tick = (nowSeconds, dtSeconds) => {
    units.forEach((unit, i) => {
      if (!unit.model.show) return
      const phase = (nowSeconds + (i * RADAR_SWEEP_SECONDS) / units.length) % RADAR_SWEEP_SECONDS
      unit.material.uniforms.progress = phase / RADAR_SWEEP_SECONDS
      if (!unit.hasAnimations) {
        unit.idleYaw += (2 * Math.PI * dtSeconds) / RADAR_IDLE_YAW_SECONDS
        if (lastP >= 0) apply(unit, i, lastP)
      }
    })
  }

  return {
    units,
    readyMs: performance.now() - t0,
    update,
    tick,
    pixelWidth,
    screenRects,
    destroy() {
      if (viewer.isDestroyed()) return
      units.forEach((u) => {
        scene.primitives.remove(u.model)
        scene.primitives.remove(u.ring)
      })
    },
  }
}
