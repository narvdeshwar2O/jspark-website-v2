import LoadGate from './components/LoadGate'
import { CONSOLE_HOLD } from './data/hydraTimings'
import Hero from './sections/Hero'
import Hydra from './sections/Hydra'

export default function App() {
  return (
    <main>
      <LoadGate />
      <Hero />
      <Hydra />
      {/* flow spacer covering the console layer's fixed hold past the
          Hydra unpin, so no section content sits behind it (SCENES.md) */}
      <div aria-hidden="true" style={{ height: `${CONSOLE_HOLD * 100}vh` }} />
    </main>
  )
}
