import { useEffect } from 'react'
import { gsap } from './scrollSetup'

// One-shot entrance reveal for standard-scroll sections (products): plays
// once on enter, not scrubbed. Reduced motion: fade only, no translate.
export default function useRevealOnEnter(sectionRef, reduced) {
  useEffect(() => {
    const targets = sectionRef.current.querySelectorAll('[data-reveal]')
    if (!targets.length) return undefined
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: reduced ? 0 : 12,
        duration: 0.6,
        ease: 'power1.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [sectionRef, reduced])
}
