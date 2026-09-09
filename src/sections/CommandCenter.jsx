import { useEffect, useRef } from 'react'
import Label from '../components/Label'
import DataPanel from '../components/DataPanel'
import StatusLine from '../components/StatusLine'
import useReducedMotion from '../animations/useReducedMotion'
import { gsap } from '../animations/scrollSetup'
import './sections.css'

// Pinned horizontal scroll: four panels advance sideways with scrub: 1.
// Reduced motion: no pin, the panels stack vertically. The grey frames
// hold the future screen content (R3F room lands in Phase 7).
export default function CommandCenter() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const distance = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section className={`section cc${reduced ? ' cc--stack' : ''}`} ref={sectionRef} data-scene="09">
      <div className="cc__track" ref={trackRef}>
        <div className="cc__panel" data-panel="1">
          <div className="cc__panel-inner">
            <Label>05 / COMMAND CENTER</Label>
            <h2 className="type-h1">EVERY SIGNAL. ONE ROOM.</h2>
            <div className="screen-frame">
              <span className="scene-note">[command_center.glb wide shot · React Three Fiber]</span>
            </div>
          </div>
        </div>

        <div className="cc__panel" data-panel="2">
          <div className="cc__panel-inner">
            <p className="scene-note">[SCREEN_L · the Scene 07 flood map as a monitoring view]</p>
            <div className="screen-frame">
              <DataPanel
                readouts={[
                  { label: 'RIVER LEVEL', value: '4.2', unit: 'm above baseline' },
                  { label: 'HOURS TO PEAK', value: '14' },
                ]}
                status={{ tone: 'alert', label: 'FLOOD WARNING' }}
              />
            </div>
          </div>
        </div>

        <div className="cc__panel" data-panel="3">
          <div className="cc__panel-inner">
            <p className="scene-note">[SCREEN_C · ticking timeline of alerts, incidents, decisions]</p>
            <div className="screen-frame">
              <div className="cc__statuses">
                <StatusLine status="ok">SENSOR ONLINE</StatusLine>
                <StatusLine status="caution">HEAVY RAINFALL</StatusLine>
                <StatusLine status="alert">FLOOD WARNING</StatusLine>
              </div>
            </div>
          </div>
        </div>

        <div className="cc__panel" data-panel="4">
          <div className="cc__panel-inner">
            <h2 className="type-h1">FROM ONE BASIN TO THE NATION.</h2>
            <div className="screen-frame">
              <span className="scene-note">[SCREEN_R · map of India with signal points]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
