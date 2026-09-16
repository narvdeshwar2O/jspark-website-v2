import { useEffect, useRef } from 'react'
import { hydraProgress } from '../../hydra/animations/hydraProgress'
import { gsap } from '../../hydra/animations/scrollSetup'
import { clamp01 } from '../../hydra/animations/reveal'
import { BEATS } from '../../hydra/data/hydraTimings'
import '../../../shared/design/sections.css'

// The hero text lives in a fixed overlay so the Scene 00 transition is
// visible over the pinned stage: it fades over the first 8% of Hydra
// progress. The section itself is just the 100vh scroll spacer.
export default function Hero() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const apply = (p) => {
      const opacity = 1 - clamp01(p / BEATS.heroFadeEnd)
      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          opacity,
          visibility: opacity > 0.001 ? 'visible' : 'hidden',
        })
      }
    }
    apply(hydraProgress.value)
    return hydraProgress.subscribe(apply)
  }, [])

  return (
    <section className="section hero" data-scene="00">
      <div className="hero__overlay" ref={overlayRef}>
        <div className="hero__center">
          <div className="hero__mast">
            <p className="type-label hero__kicker" style={{ color: 'var(--alert)', marginBottom: '1rem', letterSpacing: '0.3em' }}>
              AIR-GAPPED BY DESIGN. SOVEREIGN BY DEFAULT.
            </p>
            <h1 className="type-display" style={{ fontSize: 'clamp(42px, 5vw, 84px)', lineHeight: '1.05' }}>
              JSPARK.AI
            </h1>
          </div>
          <p className="type-body-lg hero__tagline" style={{ maxWidth: '800px', marginTop: '2rem' }}>
            The Sovereign AI
              Operating System for
              Missions That Can't Fail
          </p>
        </div>
      </div>
    </section>
  )
}
