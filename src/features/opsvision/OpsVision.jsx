import { useRef, useState } from 'react'
import OpsVisionStage from './components/OpsVisionStage'
import OpsVisionHero from './components/OpsVisionHero'
import ProgressRail from '../hydra/components/ProgressRail'
import DataPanel from '../hydra/components/DataPanel'
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

function sceneIndexAt(p) {
  for (let i = OPSVISION_SCENES.length - 1; i >= 0; i -= 1) {
    if (p >= OPSVISION_SCENES[i].from) return i
  }
  return 0
}

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

const OPSVISION_RAIL_LABELS = OPSVISION_SCENES.map((s) => s.label)

export default function OpsVision() {
  const sectionRef = useRef(null)
  const els = useRef({})
  const reduced = useReducedMotion()
  const [sceneIdx, setSceneIdx] = useState(0)
  const sceneIdxRef = useRef(0)

  const registerEl = (key) => (node) => {
    if (els.current) els.current[key] = node
  }

  const onProgress = (p) => {
    opsvisionProgress.set(p)
    const e = els.current

    // Scene indicator state
    const si = sceneIndexAt(p)
    if (si !== sceneIdxRef.current) {
      sceneIdxRef.current = si
      setSceneIdx(si)
    }

    // Video exposure ramp
    if (e.canvas) {
      const exposure = 0.2 + 0.8 * clamp01(p / OPSVISION_BEATS.exposureRampEnd)
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

    applyReveal(e.plate05Top, p, plates.p05.topIn, plates.p05.out, { reduced })
    applyReveal(e.plate05Btm, p, plates.p05.btmIn, plates.p05.out, { reduced, fadeIn: 0.03, outEnd: plates.p05.outEnd })

    // Data telemetry panel appears from 0.28
    applyReveal(e.panel, p, OPSVISION_BEATS.panelIn, Infinity, { reduced, dy: 16 })

    // Tick position on the vertical rail
    if (e.tick) gsap.set(e.tick, { top: `${railProgressAt(p)}%` })

    // Progress rail slide-in/slide-out
    if (e.rail) {
      const tIn = easePower1Out(clamp01(p / OPSVISION_BEATS.rail.fadeIn))
      const outSpan = OPSVISION_BEATS.rail.outEnd - OPSVISION_BEATS.rail.outStart
      const tOut = clamp01((p - OPSVISION_BEATS.rail.outStart) / outSpan)
      const opacity = reduced ? (p > 0 && p < OPSVISION_BEATS.rail.outEnd ? 1 : 0) : Math.min(tIn, 1 - tOut)
      const x = reduced ? 0 : (1 - tIn) * 40 + tOut * 40
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

  // Dynamic telemetry metrics based on active scene
  let readouts = [
    { label: 'DISTRICTS', value: '75', unit: 'statewide live' },
    { label: 'CITIZENS', value: '24 CR+', unit: 'covered' },
  ]
  let status = { tone: 'ok', label: 'NETWORK SYNCHRONIZED' }

  if (sceneIdx === 1) {
    readouts = [
      { label: 'SIGNAL INGEST', value: '100K+', unit: 'events / sec' },
      { label: 'CORRELATION', value: '99.8', unit: '%' },
    ]
    status = { tone: 'ok', label: 'FUSION ENGINE ACTIVE' }
  } else if (sceneIdx === 2) {
    readouts = [
      { label: 'OFFENDER DB', value: '1 CR+', unit: 'records' },
      { label: 'MATCH SPEED', value: '< 5s', unit: 'fingerprint' },
    ]
    status = { tone: 'caution', label: 'CROSS-DOMAIN MATCH' }
  } else if (sceneIdx >= 3) {
    readouts = [
      { label: 'DISPATCH REDUCTION', value: '46%', unit: 'response time' },
      { label: 'MISROUTED CALLS', value: '4%', unit: 'down from 23%' },
    ]
    status = { tone: 'ok', label: 'UNITS DISPATCHED PRE-EMPTIVE' }
  }

  return (
    <section className="section" ref={sectionRef} data-scene="opsvision">
      <OpsVisionHero />
      <OpsVisionStage registerEl={registerEl} />

      <ProgressRail
        scenes={OPSVISION_RAIL_LABELS}
        activeIndex={sceneIdx}
        tickRef={registerEl('tick')}
        rootRef={registerEl('rail')}
      />

      {/* 01 Surveillance */}
      <div className="opsvision__beat">
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
      </div>

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
      <div className="opsvision__beat">
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
      </div>

      {/* 04 Response */}
      <div className="opsvision__beat">
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
      </div>

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

      <div className="opsvision__panel" ref={registerEl('panel')}>
        <div className="hydra__panel-grid" ref={registerEl('panelGrid')}>
          <DataPanel readouts={readouts} status={status} />
        </div>
      </div>
    </section>
  )
}
