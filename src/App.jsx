import LoadGate from './components/LoadGate'
import { CONSOLE_HOLD } from './data/hydraTimings'
import Hero from './sections/Hero'
import Hydra from './sections/Hydra'
import CommandCenter from './sections/CommandCenter'
import OpsVision from './sections/OpsVision'
import OpsMind from './sections/OpsMind'
import OpsUnity from './sections/OpsUnity'
import Closing from './sections/Closing'

export default function App() {
  return (
    <main>
      <LoadGate />
      <Hero />
      <Hydra />
      {/* flow spacer covering the console layer's fixed hold past the
          Hydra unpin, so no section content sits behind it (SCENES.md) */}
      <div aria-hidden="true" style={{ height: `${CONSOLE_HOLD * 100}vh` }} />
      <CommandCenter />
      <OpsVision />
      <OpsMind />
      <OpsUnity />
      <Closing />
    </main>
  )
}
