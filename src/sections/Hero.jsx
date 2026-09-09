import { useEffect, useRef } from 'react'
import Label from '../components/Label'
import { hydraProgress } from '../animations/hydraProgress'
import { gsap } from '../animations/scrollSetup'
import { clamp01 } from '../animations/reveal'
import { BEATS } from '../data/hydraTimings'
import './sections.css'

// The hero text lives in a fixed overlay so the Scene 00 transition is
// visible over the pinned stage: it fades over the first 8% of Hydra
// progress. The section itself is just the 100vh scroll spacer.
export default function Hero() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const apply = (p) => {
      const opacity = 1 - clamp01(p / BEATS.heroFadeEnd)
      gsap.set(overlayRef.current, {
        opacity,
        visibility: opacity > 0.001 ? 'visible' : 'hidden',
      })
    }
    apply(hydraProgress.value)
    return hydraProgress.subscribe(apply)
  }, [])

  return (
    <section className="section hero" data-scene="00">
      <div className="hero__overlay" ref={overlayRef}>
        <div className="hero__center">
          <div className="hero__mast">
            <h1 className="type-display">JSPARK AI</h1>
            <hr className="rule hero__rule" />
          </div>
          <p className="type-h2 hero__tagline">Intelligence is the new infrastructure.</p>
        </div>

        <div className="hero__corner hero__corner--left">
          <Label>01 / OBSERVE</Label>
        </div>
        <div className="hero__cue" />
        <div className="hero__corner hero__corner--right">
          {/* [confirm] draft coordinates per SCENES.md */}
          <span className="type-micro text-muted">28.5°N 77.4°E · NOIDA</span>
        </div>
      </div>
    </section>
  )
}
