import { useRef } from 'react'
import Label from '../components/Label'
import Button from '../components/Button'
import useReducedMotion from '../animations/useReducedMotion'
import useRevealOnEnter from '../animations/useRevealOnEnter'
import './sections.css'

export default function OpsVision() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()
  useRevealOnEnter(sectionRef, reduced)

  return (
    <section
      ref={sectionRef}
      className="section section--surface section--center product opsvision"
      data-scene="10"
    >
      <div className="section__inner product__grid">
        <div className="product__text">
          <Label data-reveal>06 / OPSVISION</Label>
          <h2 className="type-h2" data-reveal>
            See everything that matters.
          </h2>
          <p className="scene-note" data-reveal>
            [Body · two short paragraphs · confirm]
          </p>
          <Button data-reveal>SEE OPSVISION →</Button>
        </div>
        <div className="product__media">
          <div className="product__render" data-reveal>
            <span className="scene-note">[Product render · 16:9 · .webp]</span>
          </div>
          <div className="diagram-ph" data-reveal>
            <span className="scene-note">
              [Diagram · cameras / sensors / satellite feeds converging into one view · 1px lines · 90° and 45° only]
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
