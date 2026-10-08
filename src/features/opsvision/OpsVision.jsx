import { useRef } from 'react'
import OpsVisionStage from './components/OpsVisionStage'
import OpsVisionHero from './components/OpsVisionHero'
import useSectionProgress from '../../shared/hooks/useSectionProgress'
import useReducedMotion from '../../shared/hooks/useReducedMotion'
import { opsvisionProgress } from './animations/opsvisionProgress'
import { gsap } from '../hydra/animations/scrollSetup'
import { applyReveal, clamp01, easePower1Out } from '../hydra/animations/reveal'
import {
  OPSVISION_SCENES,
  OPSVISION_BEATS,
  OPSVISION_STAGE_SCROLL,
} from './data/opsvisionTimings'
import '../../shared/design/sections.css'
import './OpsVision.css'


function railProgressAt(p) {
  const n = OPSVISION_SCENES.length
  if (p <= OPSVISION_SCENES[0].from) return 0
  if (p >= OPSVISION_SCENES[n - 1].from) return 100
  for (let i = 0; i < n - 1; i += 1) {
    const cur = OPSVISION_SCENES[i]
    const next = OPSVISION_SCENES[i + 1]
    if (p >= cur.from && p < next.from) {
      const t = (p - cur.from) / (next.from - cur.from)
      return ((i + t) / (n - 1)) * 100
    }
  }
  return 100
}

export default function OpsVision() {
  const sectionRef = useRef(null)
  const els = useRef({})
  const reduced = useReducedMotion()

  const registerEl = (key) => (node) => {
    if (els.current) els.current[key] = node
  }

  const onProgress = (p) => {
    opsvisionProgress.set(p)
    const e = els.current
    if (!e) return

    // Video frame entrance & end transformation inside the single card:
    // 1) Enters: zoom from 50% to 100% like a flash-light opening (p: 0 -> heroFadeEnd)
    // 2) Stays centered taking full frame: video fills the single card
    // 3) At the end (p: 0.85 -> 0.95): inside this SAME card, the right ontology panel slides open and video smoothly scales to the left half
    if (e.frame) {
      const zoomProgress = clamp01(p / OPSVISION_BEATS.heroFadeEnd)
      const easeZoom = 1 - Math.pow(1 - zoomProgress, 2.5)
      const initialScale = reduced ? 1 : 0.5 + 0.5 * easeZoom
      const opacity = clamp01(p / (OPSVISION_BEATS.heroFadeEnd * 0.4))

      const maskRadius = Math.round(30 + 70 * easeZoom)
      const flashBrightness = 1 + (1 - easeZoom) * 0.6
      const flashGlow = Math.round((1 - easeZoom) * 40)

      gsap.set(e.frame, {
        scale: initialScale,
        opacity,
        filter: `brightness(${flashBrightness}) drop-shadow(0 0 ${flashGlow}px rgba(255, 87, 34, ${0.4 * (1 - easeZoom)}))`,
        clipPath: `circle(${maskRadius}% at 50% 50%)`,
      })
    }

    // Video exposure ramp: reaches full 1.0 crystal-clear visibility quickly
    if (e.canvas) {
      const exposure = 0.85 + 0.15 * clamp01(p / OPSVISION_BEATS.exposureRampEnd)
      gsap.set(e.canvas, { opacity: exposure })
    }

    // Reveal plates for steps 01 to 05
    const { plates } = OPSVISION_BEATS
    applyReveal(e.plate01Top, p, plates.p01.topIn, plates.p01.out, { reduced })
    applyReveal(e.plate01Btm, p, plates.p01.btmIn, plates.p01.out, { reduced, fadeIn: 0.03 })

    applyReveal(e.plate02Top, p, plates.p02.topIn, plates.p02.out, { reduced })
    applyReveal(e.plate02Btm, p, plates.p02.btmIn, plates.p02.out, { reduced, fadeIn: 0.03 })

    applyReveal(e.plate03Top, p, plates.p03.topIn, plates.p03.out, { reduced })
    applyReveal(e.plate03Btm, p, plates.p03.btmIn, plates.p03.out, { reduced, fadeIn: 0.03 })

    applyReveal(e.plate04Top, p, plates.p04.topIn, plates.p04.out, { reduced })
    applyReveal(e.plate04Btm, p, plates.p04.btmIn, plates.p04.out, { reduced, fadeIn: 0.03 })

    applyReveal(e.plate05Top, p, plates.p05.topIn, 0.85, { reduced })
    applyReveal(e.plate05Btm, p, plates.p05.btmIn, 0.85, { reduced, fadeIn: 0.03, outEnd: 0.86 })

    // Inside the single card: animate the right ontology panel expansion at the end of the video
    if (e.panel) {
      const endProgress = clamp01((p - 0.85) / 0.10)
      const endEase = easePower1Out(endProgress)

      gsap.set(e.panel, {
        width: `${endEase * 440}px`,
        maxWidth: `${endEase * 440}px`,
        opacity: endEase,
        borderLeftWidth: endEase > 0.05 ? '1px' : '0px',
      })
    }

    // Tick position on the vertical rail
    if (e.tick) gsap.set(e.tick, { top: `${railProgressAt(p)}%` })

    // Progress rail slide-in/slide-out: sync entrance with video reveal (after hero fades)
    if (e.rail) {
      // Fade in comfortably between heroFadeEnd (0.08) and 0.12
      const railInStart = OPSVISION_BEATS.heroFadeEnd * 0.8
      const railInEnd = OPSVISION_BEATS.heroFadeEnd + 0.04
      const tIn = easePower1Out(clamp01((p - railInStart) / (railInEnd - railInStart)))
      const outSpan = OPSVISION_BEATS.rail.outEnd - OPSVISION_BEATS.rail.outStart
      const tOut = clamp01((p - OPSVISION_BEATS.rail.outStart) / outSpan)
      const opacity = reduced ? (p > railInStart && p < OPSVISION_BEATS.rail.outEnd ? 1 : 0) : Math.min(tIn, 1 - tOut)
      const x = reduced ? 0 : (1 - tIn) * 30 + tOut * 30
      gsap.set(e.rail, {
        opacity,
        x,
        visibility: opacity > 0.001 ? 'visible' : 'hidden',
      })
    }
  }

  useSectionProgress(sectionRef, {
    pin: true,
    distance: OPSVISION_STAGE_SCROLL,
    onUpdate: onProgress,
  })

  return (
    <section className="section" ref={sectionRef} data-scene="opsvision">
      <OpsVisionHero />
      <OpsVisionStage registerEl={registerEl} />

      {/* Progress rail commented out as requested */}
      {/* <ProgressRail
        scenes={OPSVISION_RAIL_LABELS}
        activeIndex={sceneIdx}
        tickRef={registerEl('tick')}
        rootRef={registerEl('rail')}
      /> */}



      {/* 01 Surveillance */}
      {/* <div className="opsvision__beat">
        <div ref={registerEl('plate01Top')} data-beat="01-surveillance-top">
          <div className="opsvision__card">
            <h2 className="type-h1">TOTAL OPERATIONAL COMPREHENSION.</h2>
          </div>
        </div>
        <div ref={registerEl('plate01Btm')} data-beat="01-surveillance-btm">
          <div className="opsvision__card">
            <h2 className="type-h1">ONE LIVING INTELLIGENCE PICTURE.</h2>
          </div>
        </div>
      </div> */}

      {/* 02 Synthesis */}
      <div className="opsvision__beat">
        <div ref={registerEl('plate02Top')} data-beat="02-synthesis-top">
          <div className="opsvision__card">
            <h2 className="type-h1">EVERY ASSET. EVERY SIGNAL.</h2>
          </div>
        </div>
        <div ref={registerEl('plate02Btm')} data-beat="02-synthesis-btm">
          <div className="opsvision__card">
            <h2 className="type-h1">FUSED IN REAL TIME.</h2>
          </div>
        </div>
      </div>

      {/* 03 Correlation */}
      {/* <div className="opsvision__beat">
        <div ref={registerEl('plate03Top')} data-beat="03-correlation-top">
          <div className="opsvision__card">
            <h2 className="type-h1">CONNECTING SILOED DOMAINS.</h2>
          </div>
        </div>
        <div ref={registerEl('plate03Btm')} data-beat="03-correlation-btm">
          <div className="opsvision__card">
            <h2 className="type-h1">ACROSS 50 MILLION RECORDS.</h2>
          </div>
        </div>
      </div> */}

      {/* 04 Response */}
      {/* <div className="opsvision__beat">
        <div ref={registerEl('plate04Top')} data-beat="04-response-top">
          <div className="opsvision__card">
            <h2 className="type-h1">THE UNIT IS ALREADY THERE.</h2>
          </div>
        </div>
        <div ref={registerEl('plate04Btm')} data-beat="04-response-btm">
          <div className="opsvision__card">
            <h2 className="type-h1">BEFORE THE CALL ARRIVES.</h2>
          </div>
        </div>
      </div> */}

      {/* 05 Deployment */}
      <div className="opsvision__beat">
        <div ref={registerEl('plate05Top')} data-beat="05-deployment-top">
          <div className="opsvision__card">
            <h2 className="type-h1">PROVEN AT NATIONAL SCALE.</h2>
          </div>
        </div>
        <div ref={registerEl('plate05Btm')} data-beat="05-deployment-btm">
          <div className="opsvision__card">
            <h2 className="type-h1">AIR-GAPPED BY DESIGN.</h2>
          </div>
        </div>
      </div>

    </section>
  )
}
