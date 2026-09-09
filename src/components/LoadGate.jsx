import { useEffect, useRef, useState } from 'react'
import { loadProgress } from '../animations/loadProgress'
import { ScrollTrigger } from '../animations/scrollSetup'
import useReducedMotion from '../animations/useReducedMotion'
import './LoadGate.css'

// The boot gate: full-viewport bg above everything from first paint (the
// static #boot-gate in index.html paints before React; this component
// takes over seamlessly and removes it). Scroll stays locked until every
// subsystem reports complete; ScrollTrigger re-measures after release so
// the pin positions are correct. SCENES.md (Load gate) is authoritative.
export default function LoadGate() {
  const [state, setState] = useState(loadProgress.get())
  const [phase, setPhase] = useState('loading') // loading | fading | done
  const reduced = useReducedMotion()

  useEffect(() => {
    document.getElementById('boot-gate')?.remove()
    document.documentElement.classList.add('is-gated')
    window.scrollTo(0, 0)
    // overflow:hidden blocks user scrolling; this catches anything
    // programmatic or residual (momentum, restored positions) as well
    const snapBack = () => {
      if (document.documentElement.classList.contains('is-gated')) window.scrollTo(0, 0)
    }
    window.addEventListener('scroll', snapBack)
    // subsystems owned by the gate itself: fonts, and section code (all
    // sections are statically imported today, so this reports 1 at once;
    // it becomes real if sections are ever code-split)
    loadProgress.report('sections', 1)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => loadProgress.report('fonts', 1))
    } else {
      loadProgress.report('fonts', 1)
    }
    const unsubscribe = loadProgress.subscribe(setState)
    return () => {
      unsubscribe()
      window.removeEventListener('scroll', snapBack)
      document.documentElement.classList.remove('is-gated')
    }
  }, [])

  // the release sequence must start exactly once: setPhase('fading') would
  // otherwise re-run this effect and its cleanup would cancel the timer
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const startedRef = useRef(false)
  useEffect(() => {
    if (!state.complete || startedRef.current) return undefined
    startedRef.current = true
    const release = () => {
      document.documentElement.classList.remove('is-gated')
      ScrollTrigger.refresh()
      setPhase('done')
    }
    // hold the finished bar for one full frame cycle even when everything
    // was instant (?prefly=0 on a warm cache), so the gate is testable
    let raf2 = 0
    let fadeTimer = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (reducedRef.current) {
          release()
        } else {
          setPhase('fading')
          fadeTimer = setTimeout(release, 600)
        }
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(fadeTimer)
    }
  }, [state.complete])

  if (phase === 'done') return null
  // hold at 99 until every flag is up, then 100 for the release frame
  const shown = state.complete ? 1 : Math.min(state.progress, 0.99)
  return (
    <div className={`load-gate${phase === 'fading' ? ' is-fading' : ''}${reduced ? ' is-reduced' : ''}`}>
      <div className="load-gate__mark">JSPARK AI</div>
      <div className="load-gate__track">
        <div className="load-gate__fill" style={{ transform: `scaleX(${shown})` }} />
      </div>
      <div className="load-gate__caption">LOADING · {Math.round(shown * 100)}%</div>
    </div>
  )
}
