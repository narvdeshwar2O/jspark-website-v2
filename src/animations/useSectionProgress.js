import { useEffect, useRef } from 'react'
import { gsap } from './scrollSetup'

// Single scroll-progress value p (0 to 1) for a pinned section, smoothed by
// scrub: 1. Architecture rule: every animation inside the section derives
// from this one value, so the hook hands p to one onUpdate callback instead
// of exposing per-element tweens.
//
// latches: [{ at, fire }]. fire() runs when p crosses strictly above `at`
// (previous p at or below, new p above), evaluated on every emitted p, so a
// fast scroll that skips frames still fires: the comparison is against the
// last emitted value, not against frame-by-frame positions or ScrollTrigger
// callbacks. Latching to once per session is the caller's responsibility.
export default function useSectionProgress(sectionRef, { pin = true, distance, onUpdate, latches, onLeave, onEnterBack }) {
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate
  const latchesRef = useRef(latches)
  latchesRef.current = latches
  const onLeaveRef = useRef(onLeave)
  onLeaveRef.current = onLeave
  const onEnterBackRef = useRef(onEnterBack)
  onEnterBackRef.current = onEnterBack
  const prevPRef = useRef(0)

  useEffect(() => {
    const dispatch = (p) => {
      onUpdateRef.current?.(p)
      const prev = prevPRef.current
      prevPRef.current = p
      const list = latchesRef.current
      if (list) for (const latch of list) if (prev <= latch.at && p > latch.at) latch.fire()
    }
    const proxy = { p: 0 }
    let trigger
    const ctx = gsap.context(() => {
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${distance}`,
          pin,
          scrub: 1,
          anticipatePin: 1,
          // release callbacks fire synchronously inside the scroll update,
          // before paint: the still swap hooks these so it cannot lag the
          // unpin by a frame
          onLeave: () => onLeaveRef.current?.(),
          onEnterBack: () => onEnterBackRef.current?.(),
        },
        onUpdate: () => dispatch(proxy.p),
      })
      trigger = tween.scrollTrigger
    }, sectionRef)

    // paint the initial state so pre-scroll styles match the real progress
    dispatch(trigger ? trigger.progress : 0)
    return () => ctx.revert()
  }, [sectionRef, pin, distance])
}
