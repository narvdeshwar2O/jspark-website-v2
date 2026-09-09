import { useEffect, useRef, useState } from 'react'
import Label from '../components/Label'
import ConsoleFrame, { getPortalNode } from '../components/ConsoleFrame'
import DataPanel from '../components/DataPanel'
import ProgressRail from '../components/ProgressRail'
import Scrim from '../components/Scrim'
import HydraStage from '../scenes/HydraStage'
import useSectionProgress from '../animations/useSectionProgress'
import useReducedMotion from '../animations/useReducedMotion'
import { hydraProgress } from '../animations/hydraProgress'
import { gsap } from '../animations/scrollSetup'
import { applyReveal, clamp01, easePower1InOut, easePower1Out } from '../animations/reveal'
import { BEATS, CONSOLE_HOLD, SCENES, STAGE_SCROLL } from '../data/hydraTimings'
import { consoleRect } from '../scenes/consoleRect'
import './sections.css'

// Scene 08 one-shots, once per session (SCENES.md): the sidebar cascade
// latch and the captured still of the WP5 frame, both survive remounts
let cascadeLatchedThisSession = false
let cachedCapture = null

function sceneIndexAt(p) {
  for (let i = SCENES.length - 1; i >= 0; i -= 1) {
    if (p >= SCENES[i].from) return i
  }
  return 0
}

function labelIndexAt(p) {
  for (let i = BEATS.labels.length - 1; i >= 0; i -= 1) {
    if (p >= BEATS.labels[i].at) return i
  }
  return -1
}

// One continuous shot: the section pins for STAGE_SCROLL px and everything
// below derives from the single progress value p (no time-based tweens).
export default function Hydra() {
  const sectionRef = useRef(null)
  const els = useRef({})
  const reduced = useReducedMotion()
  const [sceneIdx, setSceneIdx] = useState(0)
  const [labelIdx, setLabelIdx] = useState(-1)
  const sceneIdxRef = useRef(0)
  const labelIdxRef = useRef(-1)
  // Scene 08 console state
  const [consoleMounted, setConsoleMounted] = useState(false)
  const [cascadeFired, setCascadeFired] = useState(cascadeLatchedThisSession)
  const [still, setStill] = useState(() => (cachedCapture ? cachedCapture.url : null))
  const [hoursToPeak, setHoursToPeak] = useState(14)
  const hoursRef = useRef(14)
  const consoleMountedRef = useRef(false)
  const consoleAppliedRef = useRef(false)
  const panelHomeRef = useRef(null)
  const slotTargetRef = useRef(null)
  const captureRef = useRef(null)
  const capturePromiseRef = useRef(null)
  const renderHooksRef = useRef(null)
  const stillRefreshesRef = useRef(0)
  // still swap state: desired mode plus a sequence token; any direction
  // change bumps the token, cancelling the pending hide of the other layer
  const stillModeRef = useRef(false)
  const swapSeqRef = useRef(0)
  // fixed canvas from p 0.970: home parent and slot for the restore
  const canvasFixedRef = useRef(false)
  const canvasHomeRef = useRef(null)

  const registerEl = (key) => (node) => {
    els.current[key] = node
  }

  const onProgress = (p) => {
    hydraProgress.set(p)
    const e = els.current

    // discrete state: rail highlight, panel content, stage label text
    const si = sceneIndexAt(p)
    if (si !== sceneIdxRef.current) {
      sceneIdxRef.current = si
      setSceneIdx(si)
    }
    const li = labelIndexAt(p)
    if (li !== labelIdxRef.current) {
      labelIdxRef.current = li
      setLabelIdx(li)
    }

    // exposure: 15% at rest to 100% by 0.08 (Scene 00). The old Scene 08
    // dim is removed: Cesium stays at full exposure, the view is a monitor.
    if (e.canvas) {
      const exposure = 0.15 + 0.85 * clamp01(p / BEATS.exposureRampEnd)
      gsap.set(e.canvas, { opacity: exposure })
    }

    // Scene 08 console: the full-bleed canvas scales, translates and crops
    // into the console slot over 0.950 to 0.970. The viewer is never
    // resized and the camera stays frozen at WP5; this is a CSS transform
    // computed from the same rect the chrome layer draws at. The data
    // panel migrates to the strip band on the same easing.
    const cb = BEATS.console
    const inConsole = p >= cb.shrinkFrom
    const chromeOn = p > cb.shrinkFrom
    if (consoleMountedRef.current !== chromeOn) {
      consoleMountedRef.current = chromeOn
      setConsoleMounted(chromeOn)
    }
    if (e.canvas) {
      // Defect A (round 2a-fix-2): from p 0.970 the canvas container is
      // position fixed and lives in the console layer's portal node, so
      // the section's post-unpin transform (ScrollTrigger translates the
      // released section, making it the containing block for any fixed
      // descendant) cannot move the map on a lagging scrub tick. While
      // pinned the section sits at viewport (0,0) with an identity
      // transform, so the toggle is pixel-identical at the 0.970 boundary.
      // z-index 5 lifts it above the layer (z 4): nothing in the chrome
      // overlaps the slot rect at t = 1, and the still stays beneath the
      // canvas for the overlapped handoff.
      const fixedOn = p >= cb.shrinkTo
      if (fixedOn !== canvasFixedRef.current) {
        canvasFixedRef.current = fixedOn
        if (fixedOn) {
          canvasHomeRef.current = { parent: e.canvas.parentNode, next: e.canvas.nextSibling }
          e.canvas.style.position = 'fixed'
          e.canvas.style.zIndex = '5'
          const layer = getPortalNode()
          layer.insertBefore(e.canvas, layer.firstChild)
        } else if (canvasHomeRef.current) {
          e.canvas.style.position = ''
          e.canvas.style.zIndex = ''
          e.canvas.style.top = ''
          e.canvas.style.bottom = ''
          e.canvas.style.height = ''
          canvasHomeRef.current.parent.insertBefore(e.canvas, canvasHomeRef.current.next)
          canvasHomeRef.current = null
        }
      }
      if (inConsole) {
        const t = easePower1InOut(clamp01((p - cb.shrinkFrom) / (cb.shrinkTo - cb.shrinkFrom)))
        // the shrink target is the map column's MEASURED rect (the slot
        // element the chrome lays out), device-rounded, read at shrink
        // start and on resize, never consoleRect maths: a classic
        // scrollbar makes window.innerWidth 17px wider than the layout
        // viewport and cost the canvas 8px of the column (round 2a-fix)
        if (!slotTargetRef.current || !slotTargetRef.current.measured) {
          const dpr = window.devicePixelRatio || 1
          const roundD = (v) => Math.round(v * dpr) / dpr
          const slotEl = document.querySelector('.console-frame__slot')
          if (slotEl) {
            const r = slotEl.getBoundingClientRect()
            slotTargetRef.current = { x: roundD(r.left), y: roundD(r.top), w: roundD(r.width), h: roundD(r.height), measured: true }
          } else if (!slotTargetRef.current) {
            // one-frame fallback until the chrome portal mounts: the same
            // numbers the slot will be laid out from
            const rc = consoleRect(document.documentElement.clientWidth, document.documentElement.clientHeight, window.innerWidth)
            slotTargetRef.current = { x: roundD(rc.x), y: roundD(rc.y + rc.titleH), w: roundD(rc.w), h: roundD(rc.h), measured: false }
          }
        }
        const target = slotTargetRef.current
        // cover fit against the canvas's real layout size
        const cw = e.canvas.offsetWidth
        const chn = e.canvas.offsetHeight
        const sf = Math.max(target.w / cw, target.h / chn)
        const scale = 1 + (sf - 1) * t
        const boxW = cw + (target.w - cw) * t
        const boxH = chn + (target.h - chn) * t
        const cropX = Math.max(0, cw * scale - boxW)
        const cropY = Math.max(0, chn * scale - boxH)
        const clipX = cropX / 2 / scale
        const clipY = cropY / 2 / scale
        // direct styles at full double precision (gsap quantises scale)
        e.canvas.style.transformOrigin = '0px 0px'
        e.canvas.style.transform = `translate(${target.x * t - cropX / 2}px, ${target.y * t - cropY / 2}px) scale(${scale})`
        e.canvas.style.clipPath = `inset(${clipY}px ${clipX}px ${clipY}px ${clipX}px)`
        if (e.vignette) gsap.set(e.vignette, { opacity: 1 - t })
        if (e.panel) {
          if (!panelHomeRef.current) panelHomeRef.current = e.panel.getBoundingClientRect()
          const home = panelHomeRef.current
          const rect = { x: target.x, w: target.w, stripH: consoleRect(document.documentElement.clientWidth, document.documentElement.clientHeight, window.innerWidth).stripH }
          const stripTop = target.y + target.h
          gsap.set(e.panel, {
            left: home.x + (rect.x - home.x) * t,
            top: home.y + (stripTop - home.y) * t,
            width: home.width + (rect.w - home.width) * t,
            height: home.height + (rect.stripH - home.height) * t,
            right: 'auto',
            bottom: 'auto',
          })
          // the panel content fades out as it docks; the strip row itself
          // is ConsoleFrame's and fades in there on the same curve
          if (e.panelGrid) gsap.set(e.panelGrid, { opacity: 1 - clamp01(t * 2) })
        }
        consoleAppliedRef.current = true
      } else if (consoleAppliedRef.current) {
        consoleAppliedRef.current = false
        panelHomeRef.current = null
        slotTargetRef.current = null
        // a blow-through jump from past the release straight below the
        // console window: make sure the live canvas is back
        if (stillModeRef.current) swapToLive()
        e.canvas.style.transform = ''
        e.canvas.style.clipPath = ''
        e.canvas.style.transformOrigin = ''
        if (e.vignette) gsap.set(e.vignette, { clearProps: 'opacity' })
        if (e.panel) gsap.set(e.panel, { clearProps: 'left,top,width,height,right,bottom' })
        if (e.panelGrid) gsap.set(e.panelGrid, { clearProps: 'opacity' })
      }
    }

    // headline beats
    applyReveal(e.h1Rainfall, p, BEATS.h1Rainfall.in, BEATS.h1Rainfall.out, { reduced })
    applyReveal(e.h1Terrain, p, BEATS.h1Terrain.in, BEATS.h1Terrain.out, { reduced })
    // 3% fade-in, not the global 6%: this beat's whole window is 6%, so a
    // 6% fade would never reach full opacity before its own fade-out
    applyReveal(e.h1Listen, p, BEATS.h1Listen.in, BEATS.h1Listen.out, { reduced, fadeIn: 0.03 })
    applyReveal(e.h1Ground, p, BEATS.h1Ground.in, BEATS.h1Ground.out, { reduced })
    applyReveal(e.h1Fourteen, p, BEATS.h1Fourteen.in, BEATS.h1Fourteen.out, {
      reduced,
      outEnd: BEATS.h1Fourteen.outEnd,
    })

    // stage label bottom-left, gone by the Scene 08 clean frame
    if (li >= 0) {
      applyReveal(e.stageLabel, p, BEATS.labels[li].at, BEATS.reveal - 0.02, {
        reduced,
        outEnd: BEATS.reveal,
      })
    } else if (e.stageLabel) {
      gsap.set(e.stageLabel, { opacity: 0, visibility: 'hidden' })
    }

    // data panel: appears at Scene 04 (slides up 16px). It no longer fades
    // out at the reveal: it migrates into the console strip instead.
    applyReveal(e.panel, p, BEATS.panelIn, Infinity, { reduced, dy: 16 })
    if (e.rainVal) {
      const t = clamp01((p - BEATS.rain.from) / (BEATS.rain.to - BEATS.rain.from))
      e.rainVal.textContent = String(Math.round(184 * t))
    }
    if (e.hoursVal) {
      const t = clamp01((p - BEATS.flood.from) / (BEATS.flood.to - BEATS.flood.from))
      const hours = Math.round(14 - 2 * t)
      e.hoursVal.textContent = String(hours)
      // same state feeds the console strip row, via props (Fix 4)
      if (hoursRef.current !== hours) {
        hoursRef.current = hours
        setHoursToPeak(hours)
      }
    }

    if (e.tick) gsap.set(e.tick, { top: `${p * 100}%` })

    // rail: visible only while the stage is pinned; in over the first 2%,
    // out over the last 2%. p is exactly 0 before the pin and 1 after it,
    // so both rest states resolve to hidden.
    if (e.rail) {
      const tIn = easePower1Out(clamp01(p / BEATS.rail.fadeIn))
      const tOut = clamp01((p - BEATS.rail.outStart) / (1 - BEATS.rail.outStart))
      const opacity = reduced ? (p > 0 && p < 1 ? 1 : 0) : Math.min(tIn, 1 - tOut)
      gsap.set(e.rail, { opacity, visibility: opacity > 0.001 ? 'visible' : 'hidden' })
    }
  }

  // ---- still swap: overlapped handoff in both directions (SCENES.md) ----
  // Live to still: still set visible beneath the canvas, await img.decode()
  // and one frame, then hide the canvas. Still to live: canvas shown above
  // the still, await a real render pass (scene.postRender) and one frame,
  // then hide the still. No timeouts, no transitions; a reversal bumps the
  // sequence token and the stale hide never runs.
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))
  const ensureCapture = () => {
    if (cachedCapture) {
      // setState bails on the identical string, so this is a cheap no-op
      // on every call after the first
      setStill(cachedCapture.url)
      return Promise.resolve(cachedCapture)
    }
    if (!capturePromiseRef.current && captureRef.current) {
      capturePromiseRef.current = Promise.resolve(captureRef.current())
        .then((cap) => {
          capturePromiseRef.current = null
          if (cap) {
            cachedCapture = cap
            setStill(cap.url)
            // warm the decoded bitmap so the swap's decode resolves at once
            const im = new Image()
            im.src = cap.url
            im.decode().catch(() => {})
          }
          return cap || null
        })
        .catch(() => {
          capturePromiseRef.current = null
          return null
        })
    }
    return capturePromiseRef.current || Promise.resolve(null)
  }
  const swapToStill = () => {
    if (stillModeRef.current) return
    stillModeRef.current = true
    const seq = ++swapSeqRef.current
    ;(async () => {
      const cap = await ensureCapture()
      if (swapSeqRef.current !== seq) return
      if (!cap) {
        // capture failed: keep the live canvas rather than going blank
        stillModeRef.current = false
        return
      }
      // the img mounts with the console layer; a blow-through scroll can
      // release the pin before the scrub mounts it, so wait for it
      let img = document.querySelector('.console-frame__still')
      while ((!img || !img.getAttribute('src')) && swapSeqRef.current === seq) {
        await nextFrame()
        img = document.querySelector('.console-frame__still')
      }
      if (swapSeqRef.current !== seq) return
      img.style.visibility = 'visible'
      try {
        await img.decode()
      } catch {
        /* a failed decode still paints whatever is loaded */
      }
      if (swapSeqRef.current !== seq) return
      await nextFrame()
      if (swapSeqRef.current !== seq) return
      if (els.current.canvas) els.current.canvas.style.visibility = 'hidden'
    })()
  }
  const swapToLive = () => {
    if (!stillModeRef.current) return
    stillModeRef.current = false
    const seq = ++swapSeqRef.current
    ;(async () => {
      if (els.current.canvas) els.current.canvas.style.visibility = ''
      const hooks = renderHooksRef.current
      if (hooks?.awaitRender) await hooks.awaitRender()
      if (swapSeqRef.current !== seq) return
      await nextFrame()
      if (swapSeqRef.current !== seq) return
      const img = document.querySelector('.console-frame__still')
      if (img) img.style.visibility = 'hidden'
    })()
  }

  // 2a-live: the swap no longer fires at the unpin; the console stays live
  // through the hold and the handoff runs at the console release point,
  // triggered synchronously by the release evaluation (onConsoleRelease
  // below), the same scroll-tick computation that flips the layer to
  // absolute. The canvas converts to the layer's absolute release offset
  // in the same tick so canvas and still scroll together mid-handoff.
  const onConsoleRelease = (released, releaseTop) => {
    const e = els.current
    if (e.canvas && canvasFixedRef.current) {
      if (released) {
        e.canvas.style.position = 'absolute'
        e.canvas.style.top = `${releaseTop}px`
        e.canvas.style.bottom = 'auto'
        e.canvas.style.height = '100vh'
      } else {
        e.canvas.style.position = 'fixed'
        e.canvas.style.top = ''
        e.canvas.style.bottom = ''
        e.canvas.style.height = ''
      }
    }
    if (released) swapToStill()
    else swapToLive()
  }

  useSectionProgress(sectionRef, {
    pin: true,
    distance: STAGE_SCROLL,
    onUpdate: onProgress,
    // sidebar cascade one-shot: a latch on the emitted p, not a
    // ScrollTrigger callback, so a fast scroll that skips frames still
    // fires it; once per session
    latches: [
      {
        at: BEATS.console.cascadeAt,
        fire: () => {
          if (!cascadeLatchedThisSession) {
            cascadeLatchedThisSession = true
            setCascadeFired(true)
          }
        },
      },
    ],
  })

  // the measured shrink target re-reads on resize
  useEffect(() => {
    const onResize = () => {
      slotTargetRef.current = null
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // pre-capture: the composite still is captured and warm-decoded on
  // arrival at the scene's end, so the handoff at the release never waits
  // on the async capture; the fallback scroll check mirrors the console
  // layer's release computation and covers a missed release callback only
  // (SCENES.md, rounds 2a-fix-2 and 2a-live)
  useEffect(() => {
    const unsubscribe = hydraProgress.subscribe((p) => {
      if (p >= 0.999) ensureCapture()
    })
    const fallback = () => {
      const section = sectionRef.current
      if (!section) return
      const past = -section.getBoundingClientRect().top
      const hold = CONSOLE_HOLD * document.documentElement.clientHeight
      if (past >= hold) swapToStill()
      else if (stillModeRef.current) swapToLive()
    }
    window.addEventListener('scroll', fallback, { passive: true })
    return () => {
      window.removeEventListener('scroll', fallback)
      unsubscribe()
    }
  }, [])

  const scene = sceneIdx + 1
  let readouts
  let status
  if (scene === 6) {
    readouts = [{ label: 'RAINFALL', value: '0', unit: 'mm / 6 h', valueRef: registerEl('rainVal') }]
    status = { tone: 'caution', label: 'HEAVY RAINFALL' }
  } else if (scene >= 7) {
    readouts = [
      { label: 'RIVER LEVEL', value: '4.2', unit: 'm above baseline' },
      { label: 'HOURS TO PEAK', value: '14', valueRef: registerEl('hoursVal') },
    ]
    status = { tone: 'alert', label: 'FLOOD WARNING' }
  } else if (scene === 5) {
    readouts = [
      { label: 'STATIONS', value: '3' },
      { label: 'RADIUS', value: '30', unit: 'km' },
      { label: 'SWEEP', value: '4', unit: 's' },
    ]
    status = { tone: 'ok', label: 'SENSOR ONLINE' }
  } else {
    readouts = [
      { label: 'ORBIT', value: '505', unit: 'km' },
      { label: 'SWATH', value: '290', unit: 'km' },
      { label: 'REVISIT', value: '5', unit: 'days' },
    ]
    status = { tone: 'ok', label: 'SENSOR ONLINE' }
  }

  return (
    <section className="section hydra" ref={sectionRef}>
      <HydraStage
        registerEl={registerEl}
        onCaptureReady={(hooks) => {
          captureRef.current = hooks.capture
          renderHooksRef.current = hooks
          // a refinement wave completed after the cached capture: refresh
          // the hidden still so a swap after a long park at the scene's
          // end shows the same frame as the live canvas (SCENES.md); never
          // while the still is displayed, bounded per session
          hooks.onTilesQuiet?.(() => {
            if (!cachedCapture || stillModeRef.current) return
            if (hydraProgress.value < 0.999) return
            if (stillRefreshesRef.current >= 3) return
            stillRefreshesRef.current += 1
            Promise.resolve(hooks.capture())
              .then((cap) => {
                if (cap && !stillModeRef.current) {
                  cachedCapture = cap
                  setStill(cap.url)
                  const im = new Image()
                  im.src = cap.url
                  im.decode().catch(() => {})
                }
              })
              .catch(() => {})
          })
          // test hook: recapture the still on demand so the harness can
          // freeze the idle loops and compare a same-phase still and live
          // frame (the fidelity assert is about compositing, not phase)
          if (import.meta.env.DEV) {
            window.__HYDRA_REFRESH_STILL__ = () =>
              Promise.resolve(hooks.capture()).then((cap) => {
                if (cap) {
                  cachedCapture = cap
                  setStill(cap.url)
                }
                return !!cap
              })
          }
        }}
      />
      {consoleMounted && <ConsoleFrame cascadeFired={cascadeFired} still={still} hoursToPeak={hoursToPeak} onReleaseChange={onConsoleRelease} />}

      <ProgressRail activeIndex={sceneIdx} tickRef={registerEl('tick')} rootRef={registerEl('rail')} />

      <div className="hydra__label" ref={registerEl('stageLabel')}>
        <Scrim>
          <Label>{labelIdx >= 0 ? BEATS.labels[labelIdx].text : BEATS.labels[0].text}</Label>
        </Scrim>
      </div>

      <div className="hydra__beat">
        <div ref={registerEl('h1Rainfall')} data-beat="h1-rainfall">
          <Scrim>
            <h2 className="type-h1">EVERY FLOOD STARTS AS RAINFALL.</h2>
          </Scrim>
        </div>
      </div>

      <div className="hydra__beat">
        <div ref={registerEl('h1Terrain')} data-beat="h1-terrain">
          <Scrim>
            <h2 className="type-h1">THE TERRAIN KNOWS.</h2>
          </Scrim>
        </div>
        <div ref={registerEl('h1Listen')} data-beat="h1-listen">
          <Scrim>
            <h2 className="type-h1">WE LISTEN.</h2>
          </Scrim>
        </div>
      </div>

      <div className="hydra__beat">
        <div ref={registerEl('h1Ground')} data-beat="h1-ground">
          <Scrim>
            <h2 className="type-h1">GROUND TRUTH.</h2>
          </Scrim>
        </div>
      </div>

      <div className="hydra__beat">
        <div ref={registerEl('h1Fourteen')} data-beat="h1-fourteen">
          <Scrim>
            <h2 className="type-h1">FOURTEEN HOURS EARLY.</h2>
          </Scrim>
        </div>
      </div>

      <div className="hydra__panel" ref={registerEl('panel')}>
        <div className="hydra__panel-grid" ref={registerEl('panelGrid')}>
          <DataPanel readouts={readouts} status={status} />
        </div>
      </div>
    </section>
  )
}
