import { useRef } from 'react'
import Label from '../components/Label'
import Button from '../components/Button'
import useReducedMotion from '../animations/useReducedMotion'
import useRevealOnEnter from '../animations/useRevealOnEnter'
import './sections.css'

export default function OpsMind() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()
  useRevealOnEnter(sectionRef, reduced)

  return (
    <section ref={sectionRef} className="section section--center product opsmind" data-scene="11">
      <div className="section__inner product__grid">
        <div className="product__media">
          <div className="product__render" data-reveal>
            <span className="scene-note">[Product render · 16:9 · .webp]</span>
          </div>
          <div className="diagram-ph" data-reveal>
            <span className="scene-note">[Diagram · signals in → reasoning → decisions out]</span>
          </div>
        </div>
        <div className="product__text">
          <Label data-reveal>07 / OPSMIND</Label>
          <h2 className="type-h2" data-reveal>
            From signal to decision.
          </h2>
          <Button data-reveal>SEE OPSMIND →</Button>
        </div>
      </div>
    </section>
  )
}
