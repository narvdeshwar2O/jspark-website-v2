import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta } from '../../features/marketing/data/pageMeta.js'

export function PageMetaSync() {
  const location = useLocation()

  useEffect(() => {
    const meta = getPageMeta(location.pathname)

    // 1. Update Document Title
    if (meta?.title) {
      document.title = meta.title
    }

    // 2. Update Meta Description
    if (meta?.description) {
      let descEl = document.querySelector('meta[name="description"]')
      if (!descEl) {
        descEl = document.createElement('meta')
        descEl.setAttribute('name', 'description')
        document.head.appendChild(descEl)
      }
      descEl.setAttribute('content', meta.description)
    }

    // 3. Update Canonical Link
    if (meta?.canonical) {
      let canonEl = document.querySelector('link[rel="canonical"]')
      if (!canonEl) {
        canonEl = document.createElement('link')
        canonEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonEl)
      }
      canonEl.setAttribute('href', meta.canonical)
    }

    // 4. Update OpenGraph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && meta?.title) ogTitle.setAttribute('content', meta.title)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && meta?.description) ogDesc.setAttribute('content', meta.description)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && meta?.canonical) ogUrl.setAttribute('content', meta.canonical)

    // 5. Update Twitter Cards
    const twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle && meta?.title) twTitle.setAttribute('content', meta.title)

    const twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc && meta?.description) twDesc.setAttribute('content', meta.description)
  }, [location.pathname])

  return null
}
