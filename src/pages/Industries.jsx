import { IndustriesHero } from '../features/marketing/components/Industries/IndustriesHero'
import { IndustriesCTA } from '../features/marketing/components/Industries/IndustriesCTA'
import { IndustryBlock } from '../features/marketing/components/Industries/IndustryBlock'

const industryData = [
  {
    id: "defence",
    title: "Defence & Security",
    products: "OPSMIND, OPSUNITY AI",
    body: "Air-gapped intelligence for military and defence operations. Total operational security with no external dependencies.",
    whatYouGet: ["Real-time threat detection", "Secure communication", "Strategic forecasting"],
    proof: "Deployed across 12 forward operating bases.",
    configurations: "Bare-metal deploy, localized clusters.",
    reverse: false
  },
  {
    id: "homeland-security",
    title: "Homeland Security",
    products: "OPSVISION, OPSUNITY AI",
    body: "Total operational comprehension fusing intelligence and response. Air-gapped intelligence for security operations with zero external dependencies.",
    whatYouGet: ["Offender Intelligence", "Response Optimisation", "Multi-Source Surveillance"],
    proof: "Live across 75 districts, protecting 24 Cr citizens.",
    configurations: "Bare-metal deploy, localized clusters.",
    reverse: true
  },
  {
    id: "disaster-management",
    title: "Disaster Management",
    products: "OPSUNITY HYDRA, OPSUNITY AI",
    body: "The state sees the flood before the river does. Basin-level forecasting for rainfall, floods, and landslides, hours before impact.",
    whatYouGet: ["6 hours+ advance warning", "Basin-level forecasting", "Resource pre-positioning"],
    proof: "3 Million+ rivers mapped, IMD verified.",
    configurations: "On-premises, air-gapped.",
    reverse: false
  }
]

export default function Industries() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <IndustriesHero />
      {industryData.map(data => (
        <IndustryBlock key={data.id} data={data} />
      ))}
      <IndustriesCTA />
    </div>
  )
}
