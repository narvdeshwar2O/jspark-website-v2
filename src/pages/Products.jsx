import { ProductsHero } from '../features/marketing/components/ProductsHero'
import { ProductsCTA } from '../features/marketing/components/ProductsCTA'
import { ProductPanels } from '../features/marketing/components/ProductPanels'

export default function Products() {
  return (
    <div className="bg-[#0B0C10] relative z-10 w-full min-h-screen">
      <ProductsHero />
      <ProductPanels />
      <ProductsCTA />
    </div>
  )
}
