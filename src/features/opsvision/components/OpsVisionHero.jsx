import { useEffect, useRef } from 'react'
import { opsvisionProgress } from '../animations/opsvisionProgress'
import { gsap } from '../../hydra/animations/scrollSetup'
import { clamp01 } from '../../hydra/animations/reveal'
import { OPSVISION_BEATS } from '../data/opsvisionTimings'

export default function OpsVisionHero() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const apply = (p) => {
      // Smooth fade out from 0 to heroFadeEnd (0.08)
      const opacity = 1 - clamp01(p / OPSVISION_BEATS.heroFadeEnd)
      const scale = 1 - 0.05 * clamp01(p / OPSVISION_BEATS.heroFadeEnd)
      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          opacity,
          scale,
          visibility: opacity > 0.005 ? 'visible' : 'hidden',
        })
      }
    }
    apply(opsvisionProgress.value)
    return opsvisionProgress.subscribe(apply)
  }, [])

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center px-6 md:px-12 pointer-events-none overflow-hidden"
      ref={overlayRef}
    >
      {/* Glowing theme background with radial ambient pulses */}
      <div className="absolute inset-0 -z-10 bg-[#06090e]/95 pointer-events-none" />

      {/* High-tech radial glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[900px] h-[500px] md:h-[600px] bg-[#FF5722]/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-[4000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-orange-600/20 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Subtle tactical grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 87, 34, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 87, 34, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      <div className="max-w-[95%] w-full flex flex-col items-center text-center relative z-10">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 mb-5 shadow-[0_0_20px_rgba(255,87,34,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping" />
            <p className="font-mono text-xs md:text-sm font-semibold text-[#FF5722] tracking-[0.3em] uppercase">
              SOVEREIGN OPERATIONAL INTELLIGENCE
            </p>
          </div>

          <h2
            className="type-display text-white font-black uppercase tracking-tight drop-shadow-[0_0_35px_rgba(255,87,34,0.35)]"
            style={{ fontSize: 'clamp(36px, 8vw, 84px)', lineHeight: '1.05' }}
          >
            OPSVISION ONTOLOGY
          </h2>
        </div>

        <p className="font-sans text-xl sm:text-2xl md:text-3xl text-zinc-300 font-light tracking-tight max-w-5xl mx-auto leading-relaxed mt-6">
          <span className="text-white font-medium drop-shadow-sm">
            One living model of your entire operation, Decide with everything, not fragments
          </span>
        </p>

        {/* Scroll indicator prompt */}
        <div className="mt-12 flex flex-col items-center gap-2 text-zinc-500 font-mono text-xs uppercase tracking-widest animate-bounce">
          <span>Scroll to explore</span>
          <svg className="w-4 h-4 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
