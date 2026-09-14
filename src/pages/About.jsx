import { AboutHero } from '../features/marketing/components/AboutHero'
import { AboutPillars } from '../features/marketing/components/AboutPillars'
import { AboutBelief } from '../features/marketing/components/AboutBelief'
import { AboutLeadership } from '../features/marketing/components/AboutLeadership'
import { AboutCerts } from '../features/marketing/components/AboutCerts'
import { AboutCTA } from '../features/marketing/components/AboutCTA'

export default function About() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <AboutHero />
      <AboutPillars />
      <AboutBelief />
      <AboutLeadership />
      <AboutCerts />
      <AboutCTA />
    </div>
  )
}
