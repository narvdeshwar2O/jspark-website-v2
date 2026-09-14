import * as Cesium from 'cesium'
import { clamp01 } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { CATCHMENT } from '../data/catchment'

// Scene 06 rain: a screen-space 2D-canvas pass above the Cesium canvas and
// below the SVG overlay. Two parallax streak layers, masked to the
// projected catchment with a feathered edge and a head-to-mouth density
// gradient (full over the upper third, 40% at the mouth rim). The wet-down
// is a dark overlay through the same mask: Cesium imagery adjustments are
// per layer (global), so a per-region brightness change is impractical.
// Streak motion is an idle loop; density, fade and the mask derive from p.
// Reduced motion: a static drizzle at 15% instead of animation.

const ANGLE = Cesium.Math.toRadians(8) // from vertical, for wind
const FAR = { count: 150, width: 1, lenMin: 40, lenMax: 55, speed: 650, opacity: 0.2 }
const NEAR = { count: 100, width: 1.75, lenMin: 70, lenMax: 90, speed: 1000, opacity: 0.3 }
const RAIN_RGB = '124, 135, 148' // text-muted #7C8794
const WETDOWN_ALPHA = 0.15 // ~ imagery brightness 0.6 to 0.5 over the basin
const FEATHER_BLUR = 6 // on the quarter-res mask ~ 24 px feather at full size
const SUBDIVISIONS = 4

export async function createRain(viewer, canvas, terrainProvider, getExaggeration) {
  const vertices = CATCHMENT.vertices
  const ring = []
  for (let i = 0; i < vertices.length; i += 1) {
    const [lon0, lat0] = vertices[i]
    const [lon1, lat1] = vertices[(i + 1) % vertices.length]
    for (let k = 0; k < SUBDIVISIONS; k += 1) {
      const t = k / SUBDIVISIONS
      ring.push(Cesium.Cartographic.fromDegrees(lon0 + (lon1 - lon0) * t, lat0 + (lat1 - lat0) * t))
    }
  }
  const headMouth = [
    Cesium.Cartographic.fromDegrees(CATCHMENT.head.lon, CATCHMENT.head.lat),
    Cesium.Cartographic.fromDegrees(CATCHMENT.mouth.lon, CATCHMENT.mouth.lat),
  ]
  await Cesium.sampleTerrainMostDetailed(terrainProvider, [...ring, ...headMouth])
  if (viewer.isDestroyed()) return null

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const ctx = canvas.getContext('2d')
  const rainOff = document.createElement('canvas')
  const rainCtx = rainOff.getContext('2d')
  const maskOff = document.createElement('canvas')
  const maskCtx = maskOff.getContext('2d')

  const layers = [FAR, NEAR].map((layer) => ({
    layer,
    drops: Array.from({ length: layer.count }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: layer.lenMin + Math.random() * (layer.lenMax - layer.lenMin),
      jitter: 0.7 + Math.random() * 0.6,
      threshold: Math.random() * 0.9,
    })),
  }))

  let active = false
  let density = 0
  let poly = null
  let bbox = null
  let grad = null
  let dpr = 1

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      rainOff.width = w
      rainOff.height = h
      maskOff.width = Math.max(1, Math.round(w / 4))
      maskOff.height = Math.max(1, Math.round(h / 4))
    }
  }

  const project = (carto, exaggeration) =>
    Cesium.SceneTransforms.worldToWindowCoordinates(
      viewer.scene,
      Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, (carto.height || 0) * exaggeration),
      new Cesium.Cartesian2(),
    )

  const buildMask = () => {
    if (!poly || poly.length < 3) return
    const s = 0.25 * dpr // CSS px to mask device px
    maskCtx.clearRect(0, 0, maskOff.width, maskOff.height)
    maskCtx.save()
    maskCtx.filter = `blur(${FEATHER_BLUR}px)`
    let fill = 'rgba(255,255,255,0.4)'
    if (grad) {
      const g = maskCtx.createLinearGradient(grad[0] * s, grad[1] * s, grad[2] * s, grad[3] * s)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.33, 'rgba(255,255,255,1)')
      g.addColorStop(1, 'rgba(255,255,255,0.4)')
      fill = g
    }
    maskCtx.fillStyle = fill
    maskCtx.beginPath()
    poly.forEach(([x, y], i) => (i ? maskCtx.lineTo(x * s, y * s) : maskCtx.moveTo(x * s, y * s)))
    maskCtx.closePath()
    maskCtx.fill()
    maskCtx.restore()
  }

  const drawFrame = (dt) => {
    if (!active || !bbox || canvas.width === 0 || canvas.height === 0) return
    const [x0, y0, x1, y1] = bbox
    const width = x1 - x0
    const height = y1 - y0
    if (width <= 0 || height <= 0) return
    rainCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    rainCtx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // wet-down inside the mask
    rainCtx.fillStyle = `rgba(0,0,0,${(WETDOWN_ALPHA * density).toFixed(3)})`
    rainCtx.fillRect(x0, y0, width, height)

    const tan = Math.tan(ANGLE)
    const alphaScale = reduced ? 0.15 : 1
    for (const { layer, drops } of layers) {
      rainCtx.strokeStyle = `rgba(${RAIN_RGB},${(layer.opacity * alphaScale).toFixed(3)})`
      rainCtx.lineWidth = layer.width
      rainCtx.beginPath()
      for (const drop of drops) {
        if (drop.threshold > density) continue
        if (!reduced && dt > 0) {
          const dy = layer.speed * drop.jitter * dt
          drop.y += dy / height
          drop.x += (dy * tan) / width
          if (drop.y > 1.05) {
            drop.y -= 1.15
            drop.x = Math.random()
          }
          if (drop.x > 1.05) drop.x -= 1.1
        }
        const px = x0 + drop.x * width
        const py = y0 + drop.y * height
        rainCtx.moveTo(px, py)
        rainCtx.lineTo(px - drop.len * tan, py - drop.len)
      }
      rainCtx.stroke()
    }

    rainCtx.setTransform(1, 0, 0, 1, 0, 0)
    rainCtx.globalCompositeOperation = 'destination-in'
    rainCtx.drawImage(maskOff, 0, 0, rainOff.width, rainOff.height)
    rainCtx.globalCompositeOperation = 'source-over'

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(rainOff, 0, 0)
  }

  const update = (p) => {
    const fx = BEATS.rainFx
    // Scene 08 idle (2a-live): light rain over the upper basin at the
    // Scene 06 sparse density, for the whole console window and hold; the
    // catchment mask's head-to-mouth gradient already concentrates it on
    // the upper slopes. Skipped under reduced motion.
    const inConsole = p >= BEATS.console.shrinkFrom && !reduced
    active = (p >= BEATS.rain.from && p < fx.gone) || inConsole
    // explicit 'block': the stylesheet default is display none, so an empty
    // style would leave the canvas hidden (and 0x0, which breaks drawImage)
    canvas.style.display = active ? 'block' : 'none'
    if (!active) return
    resize()
    density = inConsole ? BEATS.console.idle.rainDensity : clamp01((p - BEATS.rain.from) / (fx.rampTo - BEATS.rain.from))
    canvas.style.opacity = inConsole ? '1' : String(1 - clamp01((p - fx.fadeOut) / (fx.gone - fx.fadeOut)))

    const exaggeration = getExaggeration()
    const points = []
    for (const carto of ring) {
      const win = project(carto, exaggeration)
      if (win) points.push([win.x, win.y])
    }
    poly = points
    const head = project(headMouth[0], exaggeration)
    const mouth = project(headMouth[1], exaggeration)
    grad = head && mouth ? [head.x, head.y, mouth.x, mouth.y] : null
    let bx0 = Infinity
    let by0 = Infinity
    let bx1 = -Infinity
    let by1 = -Infinity
    for (const [x, y] of points) {
      bx0 = Math.min(bx0, x)
      by0 = Math.min(by0, y)
      bx1 = Math.max(bx1, x)
      by1 = Math.max(by1, y)
    }
    bbox = [bx0 - 40, by0 - 120, bx1 + 40, by1 + 40]
    buildMask()
    drawFrame(0) // repaint at the new projection; motion continues in tick
  }

  const tick = (nowSeconds, dt) => {
    if (!reduced) drawFrame(dt)
  }

  return {
    update,
    tick,
    reduced,
    destroy() {
      canvas.style.display = 'none'
    },
  }
}
