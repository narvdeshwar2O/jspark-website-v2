import { CaseStudiesHero } from '../features/marketing/components/CaseStudies/CaseStudiesHero'
import { CaseStudiesCTA } from '../features/marketing/components/CaseStudies/CaseStudiesCTA'
import { CaseStudyMajor } from '../features/marketing/components/CaseStudies/CaseStudyMajor'
import { detailedCaseStudies } from '../features/marketing/data/caseStudiesData'

export default function CaseStudies() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <CaseStudiesHero />

      {/* Render all 7 detailed major case studies from the PDF */}
      {detailedCaseStudies.map((study) => (
        <CaseStudyMajor key={study.id} data={study} />
      ))}



      <CaseStudiesCTA />
    </div>
  )
}
