import Button from '../shared/ui/Button'
import '..\shared\design\sections.css'

export default function Closing() {
  return (
    <section className="section closing" data-scene="13">
      <p className="scene-note closing__note">
        [Earth from orbit, night side, 40% exposure · signal points from Command Center Panel 4 · the loop closes]
      </p>

      <div className="closing__center">
        <hr className="rule" />
        <h2 className="type-display closing__statement">INTELLIGENCE IS THE NEW INFRASTRUCTURE.</h2>
        <Button>TALK TO JSPARK →</Button>
      </div>

      <footer className="closing__footer">
        {/* [confirm] draft footer line per SCENES.md */}
        <span className="type-micro text-muted">JSPARK AI · Noida · vision@jspark.ai</span>
        <span className="type-micro text-dim">[nav links] · Earth imagery and terrain © Cesium ion</span>
      </footer>
    </section>
  )
}
