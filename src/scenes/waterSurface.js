import * as Cesium from 'cesium'
import { clamp01, easePower1InOut } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { RIVER_PATH } from '../data/riverPath'

// Scene 07 flood as a terrain-clipped water surface: a corridor mesh along
// the real channel, level across each cross-section, following the
// channel's downstream gradient, wider than any plausible flood. It is a
// real Primitive with depth test against terrain ON and depth write OFF,
// so the valley walls occlude the surface and the visible edge IS the
// shoreline. Reach and depth animate from p; the prediction is the same
// surface evaluated at p + floodLead, drawn first in caution so the actual
// water reads over it. Flow drift is noise scrolling in the material.
const ALERT = '#FF5A3C'
const CAUTION = '#FFB020'
const HALF_WIDTH = 600 // metres each side; terrain clips the excess
const ACROSS = 8
const MAX_DEPTH = 35 // exaggerated metres at full flood
const SUBDIV = 1 // the path is already dense (~180 m); no extra subdivision
const FRONT_TAPER_START = 0.78 // advancing edge tucks below the terrain

const WATER_SHADER = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float n = vnoise(vec2(st.s * 6.0 - flowOffset, st.t * 4.0));
  material.diffuse = color.rgb;
  material.alpha = color.a * (0.82 + 0.36 * n);
  return material;
}
`

const smooth01 = (t) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

export async function createWaterSurface(viewer, terrainProvider, getExaggeration) {
  const { scene } = viewer

  // densified channel with sampled heights
  const raw = []
  for (let i = 0; i < RIVER_PATH.length - 1; i += 1) {
    const [lon0, lat0] = RIVER_PATH[i]
    const [lon1, lat1] = RIVER_PATH[i + 1]
    for (let k = 0; k < SUBDIV; k += 1) {
      const t = k / SUBDIV
      raw.push([lon0 + (lon1 - lon0) * t, lat0 + (lat1 - lat0) * t])
    }
  }
  raw.push(RIVER_PATH[RIVER_PATH.length - 1])

  const mLat = 111320
  const mLon = 111320 * Math.cos((raw[0][1] * Math.PI) / 180)

  // channel base per section: the OSM node can sit on a bank and a single
  // terrain sample can hit a wall, so take the minimum terrain across the
  // channel's middle (5 lateral probes per section)
  const PROBE_OFFSETS = [-120, -60, 0, 60, 120]
  const dirAt = (i) => {
    const p0 = raw[Math.max(0, i - 1)]
    const p1 = raw[Math.min(raw.length - 1, i + 1)]
    const dE = (p1[0] - p0[0]) * mLon
    const dN = (p1[1] - p0[1]) * mLat
    const L = Math.hypot(dE, dN) || 1
    return { perpE: -dN / L, perpN: dE / L }
  }
  const probes = []
  raw.forEach(([lon, lat], i) => {
    const { perpE, perpN } = dirAt(i)
    for (const off of PROBE_OFFSETS) {
      probes.push(Cesium.Cartographic.fromDegrees(lon + (perpE * off) / mLon, lat + (perpN * off) / mLat))
    }
  })
  await Cesium.sampleTerrainMostDetailed(terrainProvider, probes)
  if (viewer.isDestroyed()) return null

  const hRaw = raw.map((_, i) => {
    let min = Infinity
    for (let k = 0; k < PROBE_OFFSETS.length; k += 1) {
      min = Math.min(min, probes[i * PROBE_OFFSETS.length + k].height || 0)
    }
    return min
  })
  // light smoothing, then a soft monotonic pass: small rises are allowed so
  // one noisy dip cannot drag the whole downstream profile underground
  const h = hRaw.map((v, i) => {
    const a = hRaw[Math.max(0, i - 1)]
    const b = hRaw[Math.min(hRaw.length - 1, i + 1)]
    return (a + 2 * v + b) / 4
  })
  for (let i = 1; i < h.length; i += 1) h[i] = Math.min(h[i], h[i - 1] + 1.5)

  const sections = raw.map(([lon, lat], i) => {
    const p0 = raw[Math.max(0, i - 1)]
    const p1 = raw[Math.min(raw.length - 1, i + 1)]
    const dE = (p1[0] - p0[0]) * mLon
    const dN = (p1[1] - p0[1]) * mLat
    const L = Math.hypot(dE, dN) || 1
    return { lon, lat, base: h[i], perpE: -dN / L, perpN: dE / L }
  })
  const cum = [0]
  for (let i = 1; i < sections.length; i += 1) {
    cum.push(
      cum[i - 1] +
        Math.hypot((sections[i].lon - sections[i - 1].lon) * mLon, (sections[i].lat - sections[i - 1].lat) * mLat),
    )
  }
  const totalLen = cum[cum.length - 1]

  const materialFor = (css, alpha) =>
    new Cesium.Material({
      fabric: {
        uniforms: { color: Cesium.Color.fromCssColorString(css).withAlpha(alpha), flowOffset: 0 },
        source: WATER_SHADER,
      },
      translucent: true,
    })
  const actualMaterial = materialFor(ALERT, 0.35)
  const predictedMaterial = materialFor(CAUTION, 0.1)

  let actualPrim = null
  let predictedPrim = null
  let frozen = false
  let flowOffset = 0
  let depthNorm = 0
  let current = { reach: 0, depth: 0 }

  const sectionListFor = (reach) => {
    const secs = []
    for (let i = 0; i < sections.length; i += 1) {
      if (cum[i] <= reach) {
        secs.push({ ...sections[i], s: cum[i] })
      } else {
        const prev = sections[i - 1]
        const f = (reach - cum[i - 1]) / (cum[i] - cum[i - 1])
        secs.push({
          lon: prev.lon + (sections[i].lon - prev.lon) * f,
          lat: prev.lat + (sections[i].lat - prev.lat) * f,
          base: prev.base + (sections[i].base - prev.base) * f,
          perpE: sections[i].perpE,
          perpN: sections[i].perpN,
          s: reach,
        })
        break
      }
    }
    return secs
  }

  const buildGeometry = (tEase) => {
    const reach = Math.max(250, tEase * totalLen)
    const depth = MAX_DEPTH * tEase
    const secs = sectionListFor(reach)
    if (secs.length < 2) return null
    const exaggeration = getExaggeration()
    const n = secs.length
    const positions = new Float64Array(n * ACROSS * 3)
    const normals = new Float32Array(n * ACROSS * 3)
    const sts = new Float32Array(n * ACROSS * 2)
    let po = 0
    let no = 0
    let so = 0
    for (let i = 0; i < n; i += 1) {
      const sec = secs[i]
      const sNorm = sec.s / reach
      // level across the valley; the advancing edge dips below the terrain
      const depthHere = depth * (1 - 1.2 * smooth01((sNorm - FRONT_TAPER_START) / (1 - FRONT_TAPER_START))) - 2 * smooth01((sNorm - FRONT_TAPER_START) / (1 - FRONT_TAPER_START))
      const level = sec.base * exaggeration + depthHere
      for (let j = 0; j < ACROSS; j += 1) {
        const off = (j / (ACROSS - 1) - 0.5) * 2 * HALF_WIDTH
        const lon = sec.lon + (sec.perpE * off) / mLon
        const lat = sec.lat + (sec.perpN * off) / mLat
        const cart = Cesium.Cartesian3.fromDegrees(lon, lat, level)
        positions[po++] = cart.x
        positions[po++] = cart.y
        positions[po++] = cart.z
        const up = Cesium.Cartesian3.normalize(cart, new Cesium.Cartesian3())
        normals[no++] = up.x
        normals[no++] = up.y
        normals[no++] = up.z
        sts[so++] = sec.s / 900
        sts[so++] = j / (ACROSS - 1)
      }
    }
    const indices = new Uint16Array((n - 1) * (ACROSS - 1) * 6)
    let io = 0
    for (let i = 0; i < n - 1; i += 1) {
      for (let j = 0; j < ACROSS - 1; j += 1) {
        const a = i * ACROSS + j
        indices[io++] = a
        indices[io++] = a + ACROSS
        indices[io++] = a + 1
        indices[io++] = a + 1
        indices[io++] = a + ACROSS
        indices[io++] = a + ACROSS + 1
      }
    }
    return new Cesium.Geometry({
      attributes: {
        position: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: positions,
        }),
        normal: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: normals,
        }),
        st: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: sts,
        }),
      },
      indices,
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: Cesium.BoundingSphere.fromVertices(Array.from(positions)),
    })
  }

  const makePrim = (geometry, material) =>
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({ geometry }),
      appearance: new Cesium.MaterialAppearance({
        material,
        flat: true, // matte, unlit: water as data, no specular
        translucent: true,
        renderState: { depthTest: { enabled: true }, depthMask: false },
      }),
      asynchronous: false,
      allowPicking: false,
    })

  const clear = () => {
    if (actualPrim) {
      scene.primitives.remove(actualPrim)
      actualPrim = null
    }
    if (predictedPrim) {
      scene.primitives.remove(predictedPrim)
      predictedPrim = null
    }
  }

  const rebuild = (tActual, tPredicted) => {
    clear()
    const gPredicted = buildGeometry(Math.min(tPredicted, 1))
    const gActual = buildGeometry(tActual)
    // prediction added first so the actual water draws over it
    if (gPredicted) {
      predictedPrim = makePrim(gPredicted, predictedMaterial)
      scene.primitives.add(predictedPrim)
    }
    if (gActual) {
      actualPrim = makePrim(gActual, actualMaterial)
      scene.primitives.add(actualPrim)
    }
    current = { reach: Math.max(250, tActual * totalLen), depth: MAX_DEPTH * tActual }
  }

  const update = (p) => {
    const f = BEATS.flood
    const active = p >= f.from // no upper bound: the flood holds at peak on the live monitor (2a-live)
    if (!active) {
      frozen = false
      clear()
      return
    }
    const ease = (pp) => easePower1InOut(clamp01((pp - f.from) / (f.to - f.from)))
    if (p >= f.to) {
      if (!frozen) {
        rebuild(1, 1)
        frozen = true
        depthNorm = 1
      }
      return
    }
    frozen = false
    const t = ease(p)
    depthNorm = t
    rebuild(t, ease(p + BEATS.floodLead))
  }

  // flow speed proportional to water depth
  const tick = (nowSeconds, dt) => {
    if (!actualPrim || frozen) return
    flowOffset += dt * (0.15 + 1.1 * depthNorm)
    actualMaterial.uniforms.flowOffset = flowOffset
    predictedMaterial.uniforms.flowOffset = flowOffset * 0.8
  }

  return {
    update,
    tick,
    totalLen,
    state: () => ({ ...current, exaggeration: getExaggeration() }),
    sectionAt(sMetres) {
      const secs = sectionListFor(Math.min(sMetres, totalLen - 1))
      return secs[secs.length - 1]
    },
    destroy() {
      clear()
    },
  }
}
