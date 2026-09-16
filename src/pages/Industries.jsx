import { IndustriesHero } from '../features/marketing/components/Industries/IndustriesHero'
import { IndustriesCTA } from '../features/marketing/components/Industries/IndustriesCTA'
import { IndustryBlock } from '../features/marketing/components/Industries/IndustryBlock'

const industryData = [
  {
    id: "defense",
    title: "Defense & Security",
    products: "COMMAND CONSOLE, INTEL OS",
    body: "Air-gapped intelligence for military and defense operations. Total operational security with no external dependencies.",
    whatYouGet: ["Real-time threat detection", "Secure communication", "Strategic forecasting"],
    proof: "Deployed across 12 forward operating bases.",
    configurations: "Bare-metal deploy, localized clusters."
  }
]

export default function Industries() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <IndustriesHero />
      <IndustryBlock data={industryData[0]} />
      <IndustriesCTA />
    </div>
  )
}
