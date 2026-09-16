import { useEffect, useRef, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import DataReadout from '../../../shared/ui/DataReadout'
import { hydraProgress } from '../animations/hydraProgress'
import { gsap } from '../animations/scrollSetup'
import { applyReveal, clamp01, easePower1InOut } from '../animations/reveal'
import useReducedMotion from '../../../shared/hooks/useReducedMotion'
import { BEATS, CONSOLE_HOLD } from '../data/hydraTimings'
import { consoleRect } from '../data/consoleRect'
import './ConsoleFrame.css'

// the layout viewport (a classic scrollbar makes it narrower than
// window.innerWidth, which caused an 8px canvas shortfall in round 2a-fix)
const layoutSize = () => [document.documentElement.clientWidth, document.documentElement.clientHeight, window.innerWidth]

// Scene 08 console chrome: a fixed layer, sibling of HydraStage, that owns
// the title bar, border, bottom strip band, sidebar and the content slot.
// The slot content is the existing Cesium canvas, transformed by the Hydra
// section from the same rect this layer draws its chrome at; the viewer is
// never resized and the camera stays frozen at WP5. After the unpin the
// slot shows the captured still instead. SCENES.md Scene 08 is
// authoritative for every measure and string here.
const FIGURES = [
  { label: 'RAINFALL', value: '184', unit: 'mm / 6 h' },
  { label: 'EXPECTED DISCHARGE', value: '2,140', unit: 'm³/s' },
  { label: 'RIVER LEVEL', value: '4.2', unit: 'm above baseline' },
  { label: 'CONFIDENCE', value: '91', unit: '%' },
]
const LOG_LINES = [
  { time: '14:20', entry: 'SDMA UTTARAKHAND NOTIFIED' },
  { time: '14:23', entry: 'SDMA ACKNOWLEDGED' },
  { time: '14:31', entry: 'CHAMOLI DM OFFICE NOTIFIED' },
  { time: '14:35', entry: 'NDRF BATTALION 15 MOBILIZED' },
  { time: '14:42', entry: 'EVACUATION PROTOCOL INITIATED' },
  { time: '14:45', entry: 'EARLY WARNING SIRENS ACTIVATED' },
  { time: '14:52', entry: 'DRONE SURVEILLANCE DEPLOYED' },
  { time: '14:58', entry: 'LOCAL BROADCAST WARNINGS ISSUED' },
  { time: '15:05', entry: 'HOSPITALS ON HIGH ALERT' },
  { time: '15:12', entry: 'TRAFFIC DIVERSION ENFORCED' },
]

// the console layer lives at body level, a sibling of the pinned sections:
// after the Hydra unpin the released section re-enters a transformed
// ancestor and would drag a fixed child with it, while a portal target at
// the root keeps the layer at its Scene 08 rect regardless of scroll
let portalNode = null
export const getPortalNode = () => {
  if (!portalNode) {
    portalNode = document.createElement('div')
    portalNode.className = 'console-layer-root'
    document.body.appendChild(portalNode)
  }
  return portalNode
}

export default function ConsoleFrame({ cascadeFired, still, hoursToPeak, onReleaseChange }) {
  const [rect, setRect] = useState(() => consoleRect(...layoutSize()))
  const [sidebarMounted, setSidebarMounted] = useState(hydraProgress.value >= BEATS.console.cascadeAt)
  const [released, setReleased] = useState(false)
  const [releaseTop, setReleaseTop] = useState(0)
  const releaseTopRef = useRef(0)
  const onReleaseChangeRef = useRef(onReleaseChange)
  useEffect(() => {
    onReleaseChangeRef.current = onReleaseChange
  }, [onReleaseChange])
  const reportedReleaseRef = useRef(null)
  const rootRef = useRef(null)
  const els = useMemo(() => ({}), [])
  const reduced = useReducedMotion()
  // a cascade that already fired before this mount renders static: the
  // one-shot never replays in the session (SCENES.md)
  const [staticCascade] = useState(cascadeFired)

  const registerEl = (key) => (node) => {
    if (node) els[key] = node
    else delete els[key]
  }

  useEffect(() => {
    const onResize = () => setRect(consoleRect(...layoutSize()))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // hold and release: fixed for CONSOLE_HOLD viewport heights past the
  // Hydra unpin (a flow spacer keeps sections clear), then absolute at
  // that document offset so the whole layer scrolls away with the page
  useEffect(() => {
    const evaluate = () => {
      const section = document.querySelector('.hydra')
      if (!section) return
      const topV = section.getBoundingClientRect().top
      const past = -topV
      const hold = CONSOLE_HOLD * document.documentElement.clientHeight
      const shouldRelease = past >= hold
      let newTop = releaseTopRef.current
      if (shouldRelease) {
        newTop = Math.round(window.scrollY + topV + hold)
        releaseTopRef.current = newTop
        setReleaseTop(newTop)
      }
      // the release evaluation is the swap trigger (2a-live): report the
      // flip synchronously in the same scroll tick, before React commits
      // the layer's own position change, so the canvas handoff and the
      // layer release land in the same frame
      if (reportedReleaseRef.current !== shouldRelease) {
        reportedReleaseRef.current = shouldRelease
        // flip the layer imperatively in the same tick: a React commit can
        // land a frame after the canvas handoff and paint the chrome one
        // scroll step apart from the map (measured 1 to 3 px in the
        // release sequences); the state update below reconciles to the
        // same values
        const root = rootRef.current
        if (root) {
          if (shouldRelease) {
            root.classList.add('is-released')
            root.style.top = `${newTop}px`
          } else {
            root.classList.remove('is-released')
            root.style.top = ''
          }
        }
        onReleaseChangeRef.current?.(shouldRelease, newTop)
      }
      setReleased((prev) => (prev === shouldRelease ? prev : shouldRelease))
    }
    evaluate()
    window.addEventListener('scroll', evaluate, { passive: true })
    window.addEventListener('resize', evaluate)
    return () => {
      window.removeEventListener('scroll', evaluate)
      window.removeEventListener('resize', evaluate)
    }
  }, [])

  useEffect(() => {
    const cb = BEATS.console
    const apply = (p) => {
      const e = els
      // chrome materialises just after the shrink begins
      if (e.chrome) gsap.set(e.chrome, { opacity: clamp01((p - cb.shrinkFrom) / 0.01) })
      // the strip row fades in on the same easing the panel content fades
      // out on; it belongs to this layer so it survives the unpin (Fix 4)
      const t = easePower1InOut(clamp01((p - cb.shrinkFrom) / (cb.shrinkTo - cb.shrinkFrom)))
      if (e.stripRow) gsap.set(e.stripRow, { opacity: clamp01(t * 2 - 1) })
      const mounted = p >= cb.cascadeAt
      setSidebarMounted((prev) => (prev === mounted ? prev : mounted))
      // HYDRA reveal beats, standard reveal: opacity plus 12px upward
      // translate; short fades so each beat starts at its own p
      const opts = { reduced, dy: 12, fadeIn: 0.003 }
      applyReveal(e.label, p, cb.label, Infinity, opts)
      applyReveal(e.display, p, cb.display, Infinity, opts)
      applyReveal(e.h2, p, cb.h2, Infinity, opts)
      applyReveal(e.body, p, cb.body, Infinity, opts)
      applyReveal(e.buttonRow, p, cb.button, Infinity, opts)
      applyReveal(e.ruleRow, p, cb.button, Infinity, opts)
    }
    apply(hydraProgress.value)
    return hydraProgress.subscribe(apply)
  }, [reduced, els])

  const animate = cascadeFired && !staticCascade
  const entryClass = () => `console-frame__entry${cascadeFired ? (animate ? ' is-animating' : ' is-shown') : ''}`
  const entryStyle = (i) =>
    animate ? { animationDelay: `${BEATS.console.borderMs + i * BEATS.console.staggerMs}ms` } : undefined

  const slotY = rect.y + rect.titleH
  const stripY = slotY + rect.h

  return createPortal(
    <div
      ref={rootRef}
      className={`console-frame${released ? ' is-released' : ''}`}
      style={released ? { top: releaseTop } : undefined}
      aria-hidden="true"
    >
      <div className="console-frame__chrome" ref={registerEl('chrome')}>
        {/* one console: single 1px frame, title bar across the full row,
            map column and status column split by a 1px divider */}
        <div className="console-frame__frame" style={{ left: rect.frameX, top: rect.frameY, width: rect.frameW, height: rect.frameH }} />
        {/* the map column's measurable rect: the canvas transform and the
            still both take their target from this element's layout */}
        <div className="console-frame__slot" style={{ left: rect.x, top: slotY, width: rect.w, height: rect.h }} />
        <div className="console-frame__titlebar" style={{ left: rect.x, top: rect.y, width: rect.frameW - 2, height: rect.titleH }}>
          <span className="type-label console-frame__title">HYDRA · ALAKNANDA BASIN · LIVE</span>
          <span className="console-frame__live" />
        </div>
        
        {rect.isStacked ? (
          <div className="console-frame__divider" style={{ left: rect.x, top: rect.statusY - 1, width: rect.frameW - 2, height: 1 }} />
        ) : (
          <div className="console-frame__divider" style={{ left: rect.statusX - 1, top: slotY, width: 1, height: rect.statusH }} />
        )}

        <div className="console-frame__strip" style={{ left: rect.x, top: stripY, width: rect.stripW, height: rect.stripH }}>
          <div className="type-data console-frame__striprow flex items-center justify-between w-full h-full gap-4" ref={registerEl('stripRow')}>
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shadow-[0_0_8px_#FF5722] animate-pulse shrink-0"></span>
              <span className="text-zinc-400 font-mono tracking-widest text-[10px] sm:text-xs truncate">
                RIVER LEVEL <span className="text-white font-bold">4.2 m</span>
              </span>
              <span className="text-zinc-600 shrink-0">/</span>
              <span className="text-zinc-400 font-mono tracking-widest text-[10px] sm:text-xs truncate">
                HOURS TO PEAK <span className="text-white font-bold">{hoursToPeak}</span>
              </span>
            </div>
            <div className="hidden sm:block text-[#FF5722] font-bold text-[10px] tracking-[0.2em] shrink-0">
               FLASH FLOOD WARNING
            </div>
          </div>
        </div>

        {/* the still is mounted from the layer's first render, hidden (CSS
            default), so the swap handoff only toggles visibility: Hydra
            drives img.style.visibility imperatively, React never writes it.
            src attaches when the pre-capture lands at the scene's end. */}
        <img
          className="console-frame__still"
          src={still || undefined}
          alt=""
          style={{ left: rect.x, top: slotY, width: rect.w, height: rect.h }}
        />


        {/* caption band: below 1000 CSS height, h2 and the button share one
            baseline-aligned row and the body line is not rendered */}
        <div
          className={`console-frame__below${rect.short ? ' is-band' : ''}`}
          style={{ left: rect.frameX, top: rect.frameY + rect.frameH + rect.gapBelow, width: rect.frameW }}
        >
          <div className="console-frame__band" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <p className="type-h2 text-muted console-frame__h2" ref={registerEl('h2')}>
              The flood will come. The warning can come first.
            </p>

          </div>
          <hr className="rule console-frame__rule" ref={registerEl('ruleRow')} />
        </div>
      </div>

      {sidebarMounted && (
        <aside
          className={`console-frame__sidebar${animate ? ' is-animating' : ''}`}
          style={{ left: rect.statusX, top: rect.statusY, width: rect.statusW, height: rect.statusH }}
        >
          <div className="console-frame__sidebar-inner" style={{ height: '100%' }}>
            <div className={`${entryClass(0)} relative p-4 mb-2 bg-gradient-to-br from-[#FF5722]/10 to-transparent border border-[#FF5722]/20 rounded-lg`} style={entryStyle(0)}>
              {/* Tactical Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF5722]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF5722]"></div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-[#FF5722] rounded-full shadow-[0_0_8px_#FF5722] animate-pulse shrink-0"></div>
                <span className="text-[#FF5722] font-mono text-[10px] tracking-widest font-bold">FLASH FLOOD WARNING</span>
              </div>
              <div className="text-2xl lg:text-3xl font-black tracking-tighter text-white mb-1 leading-none">OpsUnity Hydra</div>
              <div className="text-zinc-400 font-mono text-[11px] tracking-widest uppercase mt-2">PEAK IN 12 h · 04:20 IST</div>
            </div>
            <hr className="rule" style={{ borderColor: 'rgba(255,87,34,0.1)' }} />
            <div className="console-frame__figures mt-2 mb-2">
              {FIGURES.map((figure, i) => (
                <div key={figure.label} className={entryClass(1 + i)} style={entryStyle(1 + i)}>
                  <DataReadout size="md" label={figure.label} value={figure.value} unit={figure.unit} />
                </div>
              ))}
            </div>
            <hr className="rule" />
            <div className={`${entryClass(5)} console-frame__log-carousel-container`} style={{ ...entryStyle(5), flex: 1, minHeight: 0 }}>
              <div className="console-frame__log-carousel">
                {[...LOG_LINES, ...LOG_LINES].map((line, idx) => (
                  <div key={`${line.time}-${idx}`} className="type-label console-frame__log whitespace-nowrap">
                    <span style={{ color: 'var(--alert)' }}>{line.time}</span>
                    <span className="text-muted"> · </span>
                    {line.entry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>,
    getPortalNode(),
  )
}
