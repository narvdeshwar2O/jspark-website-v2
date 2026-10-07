import { ContactHero } from '../features/marketing/components/Contact/ContactHero'
import { ContactLayout } from '../features/marketing/components/Contact/ContactLayout'
import { ContactTrustStrip } from '../features/marketing/components/Contact/ContactTrustStrip'

export default function Contact() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <ContactHero />
      <ContactLayout />
      <ContactTrustStrip />
    </div>
  )
}
