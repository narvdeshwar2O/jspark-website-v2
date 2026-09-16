import { AboutHero } from '../features/marketing/components/About/AboutHero'
import { AboutPillars } from '../features/marketing/components/About/AboutPillars'
import { AboutBelief } from '../features/marketing/components/About/AboutBelief'
import { AboutLeadership } from '../features/marketing/components/About/AboutLeadership'
import { AboutCerts } from '../features/marketing/components/About/AboutCerts'
import { AboutCTA } from '../features/marketing/components/About/AboutCTA'

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
