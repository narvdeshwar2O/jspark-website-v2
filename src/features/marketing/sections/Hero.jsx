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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#FF5722]/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,87,34,0.25)] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse"></span>
              <p className="type-label hero__kicker font-mono text-[10px] sm:text-xs text-[#FF5722] tracking-[0.25em] uppercase font-bold m-0">
                AIR-GAPPED BY DESIGN · SOVEREIGN BY DEFAULT
              </p>
            </div>
            <h1 
              className="type-display font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]" 
              style={{ fontSize: 'clamp(36px, 9vw, 92px)', lineHeight: '1.02' }}
            >
              JSPARK.AI
            </h1>
          </div>
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-zinc-100 font-normal tracking-tight max-w-2xl mx-auto leading-relaxed mt-4 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] bg-black/30 backdrop-blur-sm px-6 py-2 rounded-2xl border border-white/5">
            <span className="text-white font-semibold">The Sovereign AI Operating System</span>{' '}
            <span className="text-zinc-300">for Missions That Can&apos;t Fail.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
