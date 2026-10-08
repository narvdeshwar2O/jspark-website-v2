import { useEffect, useRef } from 'react'
import { opsvisionProgress } from '../animations/opsvisionProgress'
import { gsap } from '../../hydra/animations/scrollSetup'
import { clamp01 } from '../../hydra/animations/reveal'
import { OPSVISION_BEATS } from '../data/opsvisionTimings'

export default function OpsVisionHero() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const apply = (p) => {
      const opacity = 1 - clamp01(p / OPSVISION_BEATS.heroFadeEnd)
      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          opacity,
          visibility: opacity > 0.001 ? 'visible' : 'hidden',
        })
      }
    }
    apply(opsvisionProgress.value)
    return opsvisionProgress.subscribe(apply)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center px-6 md:px-12" ref={overlayRef}>
      <div className="max-w-[95%] w-full flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <p className="font-mono text-xs md:text-sm font-semibold text-[#FF5722] tracking-[0.3em] uppercase mb-4">
            SOVEREIGN OPERATIONAL INTELLIGENCE
          </p>
          <h2 className="type-display text-white font-black uppercase tracking-tighter" style={{ fontSize: 'clamp(36px, 8vw, 84px)', lineHeight: '1.05' }}>
            OPSVISION ONTOLOGY
          </h2>
        </div>
        <p className="font-sans text-xl sm:text-2xl md:text-3xl text-zinc-300 font-light tracking-tight max-w-6xl mx-auto leading-relaxed mt-6">

          <span className="text-white font-medium">One living model of your entire operation, Decide with everything, not fragments</span>{' '} <br/>
          <span className="text-zinc-400">Live in <span className="text-[#FF5722]"> UP 112 </span>, the world's largest emergency response system, serving 25 Cr people</span>
        </p>
      </div>
    </div>
  )
}
