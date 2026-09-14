import * as Cesium from 'cesium'
import { clamp01 } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { cameraAt } from './cameraPath'

export const SIGNAL = Cesium.Color.fromCssColorString('#62C6FF')

// Scene 04 sweep, 0 at the catchment mouth to 1 at its head, shared by the
// scan cone and the outline that draws in behind it
export function sweepProgress(p) {
  const t = clamp01((p - BEATS.sweep.from) / (BEATS.sweep.to - BEATS.sweep.from))
  return t * t * (3 - 2 * t)
}

// world position of the stage camera for a given p
export function cameraPositionAt(p) {
  const cam = cameraAt(p)
  return Cesium.Cartesian3.fromDegrees(cam.lon, cam.lat, cam.height)
}

// local east/north/up unit vectors at a world position
export function enuAxes(position) {
  const frame = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  const col = (i) => Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(frame, i, new Cesium.Cartesian4()))
  return { east: col(0), north: col(1), up: col(2) }
}

// metres per screen pixel for an object at worldPos seen from cameraPos
export function metersPerPixel(viewer, cameraPos, worldPos) {
  const distance = Cesium.Cartesian3.distance(cameraPos, worldPos)
  const fovy = viewer.camera.frustum.fovy
  return (2 * distance * Math.tan(fovy / 2)) / viewer.canvas.clientHeight
}

// resolve once a Model has loaded its resources (or give up after timeoutMs)
export function modelReady(model, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    if (model.ready) return resolve(model)
    const timer = setTimeout(() => reject(new Error('model load timed out')), timeoutMs)
    model.readyEvent.addEventListener(() => {
      clearTimeout(timer)
      resolve(model)
    })
    model.errorEvent.addEventListener((err) => {
      clearTimeout(timer)
      reject(err)
    })
    return undefined
  })
}

// play the glTF's own animations if it has any; returns whether it did
export function playAnimations(model) {
  try {
    const added = model.activeAnimations.addAll({ loop: Cesium.ModelAnimationLoop.REPEAT })
    return added.length > 0
  } catch {
    return false
  }
}
