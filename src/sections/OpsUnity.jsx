import { useRef } from 'react'
import Label from '../shared/ui/Label'
import Button from '../shared/ui/Button'
import useReducedMotion from '../shared/hooks/useReducedMotion'
import useRevealOnEnter from '../shared/hooks/useRevealOnEnter'
import '../shared/design/sections.css'

export default function OpsUnity() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()
  useRevealOnEnter(sectionRef, reduced)

  return (
    <section
      ref={sectionRef}
      className="section section--surface section--center opsunity"
      data-scene="12"
    >
      <div className="section__inner opsunity__inner">
        <Label data-reveal>08 / OPSUNITY</Label>
        <h2 className="type-h2" data-reveal>
          One operating layer.
        </h2>
        <div className="diagram-ph opsunity__diagram" data-reveal><video src="/assets/opsunity.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" /></div>
        <Button data-reveal>SEE OPSUNITY →</Button>
      </div>
    </section>
  )
}

