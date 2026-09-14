import { ContactHero } from '../features/marketing/components/ContactHero'
import { ContactLayout } from '../features/marketing/components/ContactLayout'
import { ContactTrustStrip } from '../features/marketing/components/ContactTrustStrip'

export default function Contact() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <ContactHero />
      <ContactLayout />
      <ContactTrustStrip />
    </div>
  )
}
