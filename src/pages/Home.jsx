import Hydra from '../features/hydra/Hydra'
import { CONSOLE_HOLD } from '../features/hydra/data/hydraTimings'
import { ProductPanels } from '../features/marketing/components/ProductPanels'
import { NumbersSection } from '../features/marketing/components/NumbersSection'
import { IntelligenceInfrastructure } from '../features/marketing/components/IntelligenceInfrastructure'
import { PlatformSection } from '../features/marketing/components/PlatformSection'
import { DeployedSection } from '../features/marketing/components/DeployedSection'
import { CertificationsSection } from '../features/marketing/components/CertificationsSection'
import { ClosingCTA } from '../features/marketing/components/ClosingCTA'
import Hero from '../features/marketing/sections/Hero'

export default function Home() {
  return (
    <>
      {/* Primary Hero Section: The 3D Map + Overlaid text from V2 */}
      <Hero />
      <Hydra />
      
      {/* Spacer for the console pin */}
      <div aria-hidden="true" style={{ height: `${CONSOLE_HOLD * 100}vh` }} />

      {/* V2 Sections */}
      <div className="relative z-10 bg-[#0B0C10] shadow-[0_-20px_50px_rgba(0,0,0,0.9)]">
        <ProductPanels />
        <NumbersSection />
        <IntelligenceInfrastructure />
        <PlatformSection />
        <DeployedSection />
        <CertificationsSection />
        <ClosingCTA />
      </div>
    </>
  )
}
