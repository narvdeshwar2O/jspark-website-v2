import { CaseStudiesHero } from '../features/marketing/components/CaseStudiesHero'
import { CaseStudiesCTA } from '../features/marketing/components/CaseStudiesCTA'
import { CaseStudyMajor } from '../features/marketing/components/CaseStudyMajor'
import { CaseStudyMinorsGrid } from '../features/marketing/components/CaseStudyMinorsGrid'

const majorData = {
  id: "emergency-response",
  num: "01",
  client: "State Emergency Response Centre",
  headline: "Dispatching units before the incident escalates",
  product: "JSPARK OS - Command & Control",
  before: "The previous system relied on manual operator triage, taking up to 4 minutes to parse a caller's distress context and dispatch the nearest available unit.",
  action: "We deployed the JSPARK OS directly on the state's bare-metal servers. The air-gapped LLM now listens to the live call audio, instantly transcribes it, identifies distress markers, and triangulates the optimal response unit based on live fleet telemetry.",
  afterTitle: "Outcome",
  afterList: [
    "Response time reduced by 62%",
    "False-positive dispatch dropped to near zero",
    "Real-time translation of 14 regional dialects"
  ],
  conclusion: "The system currently handles over 100,000 calls per day without a single external API request.",
  numbers: "62% FASTER",
  modules: "VISION, SPEECH, REASONING"
};

const minorsData = [
  {
    id: "crime-records",
    num: "02",
    client: "National Crime Records Database",
    headline: "Connecting the dots across 50 million records",
    product: "JSPARK OS - Intelligence",
    body: "Deployed a sovereign semantic search engine over 50 million unstructured incident reports. Investigators now query the database in natural language to find cross-state patterns in seconds rather than months.",
    numbers: "50M RECORDS"
  },
  {
    id: "meteorological",
    num: "03",
    client: "India Meteorological Department",
    headline: "AI-enabled hydrology and flood forecasting",
    product: "JSPARK OS - Simulation",
    body: "Built India's first AI-enabled hydrology model. It ingests live satellite telemetry and river gauge sensors to predict catchment basin overflows up to 48 hours in advance with unprecedented accuracy.",
    numbers: "48H ADVANCE"
  }
];

export default function CaseStudies() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <CaseStudiesHero />
      <CaseStudyMajor data={majorData} />
      <CaseStudyMinorsGrid data={minorsData} />
      <CaseStudiesCTA />
    </div>
  )
}
