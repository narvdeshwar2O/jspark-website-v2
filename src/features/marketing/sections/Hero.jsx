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
            <h1 className="type-display" style={{ fontSize: 'clamp(32px, 8vw, 84px)', lineHeight: '1.05' }}>
              JSPARK.AI
            </h1>
          </div>
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-zinc-300 font-light tracking-tight max-w-2xl mx-auto leading-relaxed mt-6">
            <span className="text-white font-medium">The Sovereign AI Operating System</span>{' '}
            <span className="text-zinc-400">for Missions That Can&apos;t Fail.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
