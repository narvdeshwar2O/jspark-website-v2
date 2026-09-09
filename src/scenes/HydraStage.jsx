import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { hydraProgress } from '../animations/hydraProgress'
import { loadProgress } from '../animations/loadProgress'
import { clamp01 } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import { WAYPOINTS } from '../data/waypoints'
import { cameraAt } from './cameraPath'
import { createSatellite } from './satellite'
import { createRadars } from './radars'
import { createCatchmentOutline } from './catchmentOutline'
import { createRain } from './rain'
import { createRiverMarker } from './riverMarker'
import { createWaterSurface } from './waterSurface'
import { createGroundStations } from './groundStations'
import './HydraStage.css'

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

// Scene 02 graticule: in/out marks from SCENES.md, 2% internal fades
function gridAlpha(p) {
  const g = BEATS.grid
  const tIn = clamp01((p - g.in) / 0.02)
  const tOut = clamp01((p - (g.out - 0.02)) / 0.02)
  return 0.6 * Math.min(tIn, 1 - tOut)
}

// The Cesium viewer for the Hydra stage. Everything on the canvas derives
// from the stage's single p value; requestRenderMode keeps the globe idle
// unless p changes. Wireframe overlays remain until Phase 5 models.
export default function HydraStage({ registerEl, onCaptureReady }) {
  const hostRef = useRef(null)
  const rainRef = useRef(null)
  const svgRef = useRef(null)
  const creditRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let disposed = false
    let viewer = null
    let terrainImagery = null
    let gridLayer = null
    let isReady = false
    // async init races React StrictMode's mount/unmount cycle: never touch
    // the viewer after it is destroyed
    const gone = () => disposed || !viewer || viewer.isDestroyed()

    // Screen-space error while moving vs once p has been stable for
    // restDelayMs. Measured: with the pre-fly tiles resident, a looser
    // moving value (2.5) was the only remaining source of mid-scroll blur
    // (frames at 81 to 93% of settled sharpness); at 1.6 they match settled
    // (98 to 105%). Keep sseMoving as the knob to loosen on weak hardware.
    // On the dev handle so the test harness can ablate it.
    const tuning = { sseMoving: 1.6, sseRest: 1.6, restDelayMs: 300, tileCacheSize: 1000, prefly: true }
    // dev-only overrides for tuning runs: ?prefly=0 ?cache=100
    if (import.meta.env.DEV) {
      const q = new URLSearchParams(window.location.search)
      if (q.get('prefly') === '0') tuning.prefly = false
      if (q.get('cache')) tuning.tileCacheSize = Number(q.get('cache'))
    }
    let restTimer = null

    // stage objects (Phase 5) and the idle loop that keeps their animations
    // and ring sweeps moving while they are on screen; everything else still
    // renders only on p change
    let satellite = null
    let radars = null
    let catchmentOutline = null
    let rain = null
    let river = null
    let water = null
    let groundStations = null
    let cleanupResolution = null
    let lastP = 0
    let idleRaf = 0
    let lastTick = 0
    let lastRenderAt = 0
    const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const idleWindow = (p) => p >= BEATS.satellite.in && p < BEATS.reveal
    // Scene 08 and the console hold (2a-live): the monitor stays live.
    // Rings, dishes, the alert blink and sparse rain keep ticking with
    // renders capped at holdFps; while the still covers the canvas the
    // loop only polls (no ticks, no renders), so a swap back to live
    // resumes without a restart hook. Skipped under reduced motion.
    const consoleIdle = (p) => p >= BEATS.reveal && !reducedMotion
    const idleTick = (now) => {
      idleRaf = 0
      if (gone() || !isReady) {
        lastTick = 0
        return
      }
      const inScene = idleWindow(lastP)
      const inConsole = !inScene && consoleIdle(lastP)
      if (!inScene && !inConsole) {
        lastTick = 0
        return
      }
      idleRaf = requestAnimationFrame(idleTick)
      if (inConsole) {
        const frozen = import.meta.env.DEV && window.__HYDRA__ && window.__HYDRA__.freezeIdle
        const canvasEl = hostRef.current ? hostRef.current.parentNode : null
        if (frozen || (canvasEl && canvasEl.style.visibility === 'hidden')) {
          lastTick = 0
          return
        }
        if (now - lastRenderAt < 1000 / BEATS.console.idle.holdFps - 1) return
      }
      const dt = lastTick ? (now - lastTick) / 1000 : 0
      lastTick = now
      lastRenderAt = now
      if (inScene) {
        satellite?.tick(dt)
        water?.tick(now / 1000, dt)
      }
      radars?.tick(now / 1000, dt)
      rain?.tick(now / 1000, dt)
      if (inConsole) groundStations?.tick(now / 1000)
      viewer.scene.requestRender()
    }
    const ensureIdle = () => {
      if (!idleRaf) idleRaf = requestAnimationFrame(idleTick)
    }

    // camera, exaggeration and layer state for a given p (no render request)
    const poseAt = (p) => {
      const cam = cameraAt(p)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(cam.lon, cam.lat, cam.height),
        orientation: {
          heading: Cesium.Math.toRadians(cam.heading),
          pitch: Cesium.Math.toRadians(cam.pitch),
          roll: 0,
        },
      })
      if (gridLayer) gridLayer.alpha = gridAlpha(p)
      // terrain exaggeration from Scene 03 on; Earth and India views stay true
      const ex = BEATS.terrainExaggeration
      const exaggeration = p >= ex.at ? ex.value : 1
      if (viewer.scene.verticalExaggeration !== exaggeration) {
        viewer.scene.verticalExaggeration = exaggeration
      }
    }

    const applyProgress = (p) => {
      if (gone() || !isReady) return
      poseAt(p)
      lastP = p
      satellite?.update(p)
      radars?.update(p)
      catchmentOutline?.update(p)
      rain?.update(p)
      river?.update(p)
      water?.update(p)
      groundStations?.update(p)
      if (idleWindow(p) || consoleIdle(p)) ensureIdle()
      if (import.meta.env.DEV) window.__HYDRA__.p = p
      const { scene } = viewer
      if (scene.globe.maximumScreenSpaceError !== tuning.sseMoving) {
        scene.globe.maximumScreenSpaceError = tuning.sseMoving
      }
      clearTimeout(restTimer)
      restTimer = setTimeout(() => {
        if (gone()) return
        scene.globe.maximumScreenSpaceError = tuning.sseRest
        scene.requestRender()
      }, tuning.restDelayMs)
      scene.requestRender()
    }

    const unsubscribe = hydraProgress.subscribe(applyProgress)

    const nextFrames = (count) =>
      new Promise((resolve) => {
        let left = count
        const off = viewer.scene.postRender.addEventListener(() => {
          left -= 1
          if (left <= 0) {
            off()
            resolve()
          }
        })
      })

    // tilesLoaded reads true straight after a setView because the load
    // queues only fill during a render pass: let two frames run first
    const tilesSettled = async (timeoutMs) => {
      const started = Date.now()
      await nextFrames(2)
      await new Promise((resolve) => {
        const check = () => {
          if (gone()) return resolve()
          if (viewer.scene.globe.tilesLoaded || Date.now() - started > timeoutMs) return resolve()
          return setTimeout(check, 100)
        }
        check()
      })
    }

    const init = async () => {
      // vertex normals are what make per-vertex relief lighting possible;
      // without them Cesium fades lighting out as the camera gets close
      const terrain = Cesium.Terrain.fromWorldTerrain({ requestVertexNormals: true })
      viewer = new Cesium.Viewer(hostRef.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        vrButton: false,
        creditContainer: creditRef.current, // attribution lives in the closing footer
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        baseLayer: false,
        terrain,
        contextOptions: { webgl: { alpha: true } },
        skyBox: false,
      })

      const { scene } = viewer
      if (import.meta.env.DEV) window.__HYDRA__ = { viewer, tuning, Cesium }

      // Sky: page bg behind the globe, no stars, thin dark atmosphere rim
      scene.backgroundColor = Cesium.Color.fromCssColorString('#05070A')
      if (scene.skyBox) scene.skyBox.show = false
      if (scene.sun) scene.sun.show = false
      if (scene.moon) scene.moon.show = false
      if (scene.skyAtmosphere) {
        scene.skyAtmosphere.brightnessShift = -0.5
        scene.skyAtmosphere.saturationShift = -0.3
      }
      scene.globe.atmosphereBrightnessShift = -0.5
      scene.globe.showGroundAtmosphere = false // daytime haze would lift the terrain
      scene.fog.enabled = true
      scene.fog.density = 0.0003
      scene.globe.baseColor = Cesium.Color.fromCssColorString('#0B0F14')

      // Lighting: darkness comes from the palette, shape comes from the
      // light. A fixed western light 12 degrees above the horizon at the
      // Alaknanda site, constant, not time-of-day. Ridges catch it, valleys
      // fall away.
      const site = Cesium.Cartesian3.fromDegrees(WAYPOINTS[4].lon, WAYPOINTS[4].lat)
      const enu = Cesium.Transforms.eastNorthUpToFixedFrame(site)
      const east = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(enu, 0, new Cesium.Cartesian4()))
      const up = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(enu, 2, new Cesium.Cartesian4()))
      const elevation = Cesium.Math.toRadians(12)
      const travel = Cesium.Cartesian3.add(
        Cesium.Cartesian3.multiplyByScalar(east, Math.cos(elevation), new Cesium.Cartesian3()),
        Cesium.Cartesian3.multiplyByScalar(up, -Math.sin(elevation), new Cesium.Cartesian3()),
        new Cesium.Cartesian3(),
      )
      scene.light = new Cesium.DirectionalLight({
        direction: Cesium.Cartesian3.normalize(travel, new Cesium.Cartesian3()),
      })
      scene.globe.enableLighting = true
      // Cesium normalises the globe's light colour to a max component of 1,
      // so light intensity/colour cannot lift the terrain: the Lambert
      // multiplier is the brightness knob. Flats sit near 0.55, west-facing
      // ridges clamp to 1, the shadow floor stays at 0.25.
      scene.globe.lambertDiffuseMultiplier = 2.6
      scene.globe.vertexShadowDarkness = 0.25

      // anti-aliasing: MSAA 2 plus FXAA. Measured with the full Phase 5
      // scene: 4x MSAA scrubs at 49 fps even at DPR 1; 2x restores 63.
      scene.msaaSamples = 2
      scene.postProcessStages.fxaa.enabled = true

      // scroll drives the camera; every Cesium input is off
      const controller = scene.screenSpaceCameraController
      controller.enableInputs = false
      controller.enableZoom = false
      controller.enableRotate = false
      controller.enableTilt = false
      controller.enableTranslate = false
      controller.enableLook = false

      // native device resolution, tracked across zoom and display changes so
      // the canvas is never upscaled. The cap is the ladder's floor of 1.5:
      // measured, full DPR 2 rendering scrubs at 16 fps, 1.5 at 52.
      const applyResolution = () => {
        if (gone()) return
        viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5)
        scene.requestRender()
      }
      let dprMedia = null
      const onDprChange = () => {
        applyResolution()
        watchDpr()
      }
      const watchDpr = () => {
        if (dprMedia) dprMedia.removeEventListener('change', onDprChange)
        dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
        dprMedia.addEventListener('change', onDprChange)
      }
      applyResolution()
      window.addEventListener('resize', applyResolution)
      watchDpr()
      cleanupResolution = () => {
        window.removeEventListener('resize', applyResolution)
        if (dprMedia) dprMedia.removeEventListener('change', onDprChange)
      }

      // Tile caching: keep the pre-fly tiles resident for the whole journey
      // and load ahead of the camera
      scene.globe.tileCacheSize = tuning.tileCacheSize
      scene.globe.preloadAncestors = true
      scene.globe.preloadSiblings = true
      scene.globe.preloadFlightDestinations = true
      scene.globe.maximumScreenSpaceError = tuning.sseRest
      // requestRenderMode: draw newly loaded tiles as they arrive, not only
      // on the next scroll tick
      scene.globe.tileLoadProgressEvent.addEventListener(() => scene.requestRender())

      // Imagery: dark-graded world imagery carries the whole journey
      // (SCENES.md Scene 01; the Earth at Night layer was dropped)
      try {
        const world = await Cesium.createWorldImageryAsync()
        if (gone()) return
        terrainImagery = viewer.imageryLayers.addImageryProvider(world)
        // cool and nearly monochrome, not dimmed toward black
        terrainImagery.brightness = 0.6
        terrainImagery.contrast = 1.15
        terrainImagery.saturation = 0.15
      } catch (err) {
        console.warn('World imagery unavailable', err)
      }
      if (gone()) return

      gridLayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.GridImageryProvider({
          color: Cesium.Color.fromCssColorString('#1C232C'),
          glowColor: Cesium.Color.TRANSPARENT,
          backgroundColor: Cesium.Color.TRANSPARENT,
          glowWidth: 0,
          cells: 8,
        }),
      )
      gridLayer.alpha = 0

      // Pre-cache: visit the exact journey poses at full resolution and
      // rest quality, holding at each until tiles load (4s cap): WP0 to
      // WP4, two intermediate poses on the WP2 to WP4 descent, and the
      // rotated Scene 07 pose. The canvas stays hidden until the ready
      // flag, so only the hero shows.
      const c = BEATS.camera
      const preflyPs = [0, c.wp1, c.wp2, (c.wp2 + c.wp3) / 2, c.wp3, (c.wp4From + c.wp4) / 2, c.wp4, (c.wp5From + c.wp5) / 2, c.wp5]

      // stage objects load alongside the pre-fly; both need frames, so
      // requestRenderMode stays off until everything is ready
      viewer.clock.shouldAnimate = true
      const terrainProvider = terrain.ready
        ? terrain.provider
        : await new Promise((resolve) => terrain.readyEvent.addEventListener(resolve))
      if (gone()) return
      const objectsStart = performance.now()
      // each resolved object bumps the gate's objects subsystem
      let objectsDone = 0
      const OBJECT_COUNT = 7
      const tracked = (promise, name) =>
        promise
          .catch((err) => {
            console.warn(`${name} failed to load`, err)
            return null
          })
          .then((result) => {
            objectsDone += 1
            loadProgress.report('objects', objectsDone / OBJECT_COUNT)
            return result
          })
      const objects = Promise.all([
        tracked(createSatellite(viewer, terrainProvider, () => scene.verticalExaggeration, svgRef.current), 'satellite'),
        tracked(createRadars(viewer, terrainProvider, () => scene.verticalExaggeration), 'radars'),
        tracked(createCatchmentOutline(viewer, svgRef.current, terrainProvider, () => scene.verticalExaggeration), 'catchment outline'),
        tracked(createRain(viewer, rainRef.current, terrainProvider, () => scene.verticalExaggeration), 'rain layer'),
        tracked(createRiverMarker(viewer, svgRef.current, terrainProvider, () => scene.verticalExaggeration), 'river layer'),
        tracked(createWaterSurface(viewer, terrainProvider, () => scene.verticalExaggeration), 'water surface'),
        tracked(createGroundStations(viewer, svgRef.current, terrainProvider, () => scene.verticalExaggeration), 'ground stations'),
      ])

      scene.requestRenderMode = false
      const preflyStart = performance.now()
      if (!tuning.prefly) loadProgress.report('prefly', 1)
      const flightPs = tuning.prefly ? preflyPs : []
      for (let i = 0; i < flightPs.length; i += 1) {
        if (gone()) return
        poseAt(flightPs[i])
        await tilesSettled(4000)
        loadProgress.report('prefly', (i + 1) / flightPs.length)
      }
      if (gone()) return
      const preflyMs = performance.now() - preflyStart
      ;[satellite, radars, catchmentOutline, rain, river, water, groundStations] = await objects
      if (gone()) return
      // station labels avoid the radar towers; radars update before
      // groundStations in applyProgress, so the rects are current
      groundStations?.setObstacleProvider(() => radars?.screenRects() ?? [])
      const objectsMs = performance.now() - objectsStart
      if (import.meta.env.DEV) {
        Object.assign(window.__HYDRA__, {
          preflyMs,
          timings: { preflyMs, objectsMs, satelliteMs: satellite?.readyMs, radarsMs: radars?.readyMs },
          satellite,
          radars,
          catchmentOutline,
          water,
          groundStations,
        })
      }
      scene.requestRenderMode = true
      poseAt(0)

      isReady = true
      setReady(true)
      // Scene 08 still capture, composite: an explicit synchronous render
      // followed by an immediate canvas read (no preserveDrawingBuffer,
      // which is a context creation attribute and cannot be toggled), then
      // the SVG instrument overlay rasterised on top at the identical rect
      // and DPR, so the Scene 09 handoff still carries the marks, labels
      // and outline. SVG-in-Image loads no external resources, so the mono
      // face is inlined as a data URL; fetched once per session.
      let monoFontDataUrl = null
      const fetchMonoFont = async () => {
        if (monoFontDataUrl) return monoFontDataUrl
        try {
          const css = await (await fetch('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap')).text()
          const match = css.match(/\/\* latin \*\/\s*@font-face\s*{[^}]*?font-weight:\s*400;[^}]*?url\((https:[^)]+?\.woff2)\)/)
          if (!match) return null
          const buf = await (await fetch(match[1])).arrayBuffer()
          let binary = ''
          const bytes = new Uint8Array(buf)
          for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
          monoFontDataUrl = `data:font/woff2;base64,${btoa(binary)}`
        } catch (err) {
          console.warn('mono font inline failed; still labels may fall back', err)
        }
        return monoFontDataUrl
      }
      const captureStill = async () => {
        const t0 = performance.now()
        // capture only a settled globe: the pre-capture fires on arrival at
        // the scene's end, and the largest viewports can still be refining
        // their last tiles at that instant, which costs still-vs-live
        // fidelity (2560x1440 measured 3.07% against the 3% bound)
        if (!viewer.scene.globe.tilesLoaded) {
          await new Promise((resolve) => {
            const remove = viewer.scene.globe.tileLoadProgressEvent.addEventListener((remaining) => {
              if (remaining === 0) {
                remove()
                resolve()
              }
            })
            viewer.scene.requestRender()
          })
          if (gone()) return null
        }
        // with requestRenderMode a clean scene skips the render pass and
        // the drawing buffer reads black: mark it dirty, then render and
        // read synchronously
        viewer.scene.requestRender()
        viewer.render()
        const src = viewer.canvas
        const composite = document.createElement('canvas')
        composite.width = src.width
        composite.height = src.height
        const ctx = composite.getContext('2d')
        ctx.drawImage(src, 0, 0)
        // the rain layer sits between the terrain and the SVG overlay
        // (z 1 vs z 2): composite it so the still keeps the Scene 08 rain
        const rainEl = rainRef.current
        if (rainEl && rainEl.style.display === 'block') ctx.drawImage(rainEl, 0, 0, composite.width, composite.height)
        const svgEl = svgRef.current
        if (svgEl) {
          const vw = svgEl.clientWidth || window.innerWidth
          const vh = svgEl.clientHeight || window.innerHeight
          const fontUrl = await fetchMonoFont()
          // the overlays stay visible at p 1 since 2a-live, but a capture
          // can still fire mid-scrub: drive the overlay to its settled
          // 0.999 state for the serialisation (the camera is frozen at
          // WP5, so projections are identical), then restore synchronously
          const overlayP = 0.999
          catchmentOutline?.update(overlayP)
          river?.update(overlayP)
          groundStations?.update(overlayP)
          const clone = svgEl.cloneNode(true)
          clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
          clone.setAttribute('width', String(vw))
          clone.setAttribute('height', String(vh))
          // the alert blink dims marks on a 2s cycle: the still shows every
          // mark at full opacity regardless of the blink phase at capture
          for (const el of clone.querySelectorAll('rect')) if (el.style.opacity) el.style.opacity = ''
          if (fontUrl) {
            const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
            style.textContent = `@font-face { font-family: 'JetBrains Mono'; src: url(${fontUrl}) format('woff2'); font-weight: 400; font-style: normal; }`
            clone.insertBefore(style, clone.firstChild)
          }
          const serialised = new XMLSerializer().serializeToString(clone)
          catchmentOutline?.update(lastP)
          river?.update(lastP)
          groundStations?.update(lastP)
          const blob = new Blob([serialised], { type: 'image/svg+xml' })
          const blobUrl = URL.createObjectURL(blob)
          try {
            const overlay = new Image()
            await new Promise((resolve, reject) => {
              overlay.onload = resolve
              overlay.onerror = reject
              overlay.src = blobUrl
            })
            ctx.drawImage(overlay, 0, 0, composite.width, composite.height)
          } catch (err) {
            console.warn('SVG overlay rasterisation failed; still is canvas only', err)
          } finally {
            URL.revokeObjectURL(blobUrl)
          }
        }
        const url = composite.toDataURL('image/png')
        const ms = performance.now() - t0
        if (import.meta.env.DEV) window.__HYDRA__.captureMs = ms
        return { url, ms }
      }
      // the reverse handoff waits for a real render pass: postRender fires
      // only when a frame actually renders under requestRenderMode
      const awaitRender = () =>
        new Promise((resolve) => {
          if (gone() || !isReady) {
            resolve(false)
            return
          }
          const remove = viewer.scene.postRender.addEventListener(() => {
            remove()
            resolve(true)
          })
          viewer.scene.requestRender()
        })
      // fires whenever a tile refinement wave completes (queue transitions
      // back to zero): tilesLoaded alone is not final, imagery refinement
      // continues in later waves, and a still captured between waves is
      // softer than the settled live frame (measured 1.5% of map pixels at
      // 2560x1440)
      let tilesWereLoading = false
      const quietListeners = new Set()
      viewer.scene.globe.tileLoadProgressEvent.addEventListener((remaining) => {
        if (remaining > 0) {
          tilesWereLoading = true
        } else if (tilesWereLoading) {
          tilesWereLoading = false
          quietListeners.forEach((cb) => cb())
        }
      })
      const onTilesQuiet = (cb) => {
        quietListeners.add(cb)
        return () => quietListeners.delete(cb)
      }
      onCaptureReady?.({ capture: captureStill, awaitRender, onTilesQuiet })
      if (import.meta.env.DEV) window.__HYDRA__.capture = captureStill
      // warm the inline font now so the capture never waits on the network
      // (tile requests can starve a late fetch for many seconds)
      fetchMonoFont()
      applyProgress(hydraProgress.value)
    }

    init().catch((err) => {
      if (!disposed) {
        console.error('Cesium init failed', err)
        // a broken stage must never trap the page behind the gate
        loadProgress.finishAll()
      }
    })

    return () => {
      disposed = true
      clearTimeout(restTimer)
      cancelAnimationFrame(idleRaf)
      cleanupResolution?.()
      unsubscribe()
      if (viewer && !viewer.isDestroyed()) viewer.destroy()
    }
  }, [])

  return (
    <div className="stage" ref={registerEl('stage')} aria-hidden="true">
      {/* exposure/dimming applies to this wrapper only: the canvas and the
          wireframes that stand in for canvas objects. Text, rail and panel
          live outside the stage and are never dimmed. */}
      <div className="stage__canvas" ref={registerEl('canvas')}>
        <div className={`stage__viewer${ready ? ' is-ready' : ''}`} ref={hostRef} />

        {/* screen-space rain, above the globe and below the vector edges */}
        <canvas className="stage__rain" ref={rainRef} />

        {/* projected vector edges (cone, catchment outline, river, flood)
            live here so they render DOM-sharp above the canvas */}
        <svg className="stage__svg" ref={svgRef} aria-hidden="true" />
      </div>

      <div className="stage__vignette" ref={registerEl('vignette')} />
      <div className="stage__credits" ref={creditRef} />
    </div>
  )
}
