// Authoritative page metadata mapping for titles, descriptions, canonicals, H1s, and schema.org JSON-LD
export const PAGE_META = {
  '/': {
    title: 'JSPARK AI | Sovereign AI Operating System, Built in India',
    description: 'JSPARK AI builds a sovereign, air-gapped AI operating system for homeland security, disaster management, defence and critical infrastructure in India.',
    canonical: 'https://jspark.ai/',
    heading: 'The Sovereign AI Operating System for Operations That Cannot Fail',
    summary: `JSPARK AI is an Indian deep-tech enterprise building sovereign, air-gapped AI operating systems for mission-critical operations. Deployed at national scale for Homeland Security, Emergency Response (UP 112 across 75 districts), Disaster Management, Power Utilities, and Defence. Zero cloud dependencies, zero external data leakage, and unmetered bare-metal execution.`,
    highlights: [
      'OpsUnity AI: The sovereign foundation with autonomous agent swarms, mathematical models, and unmetered local execution.',
      'OpsVision: Sovereign operational intelligence engine fusing events, assets, and signals into a unified ontology (UP 112 46% faster dispatch, 240M+ citizens).',
      'OpsMind: Sovereign document intelligence parsing CAD drawings, schematics, and P&IDs with 100% cited accuracy and zero hallucinations (NCRB NAFIS, DRDO DESIDOC, L&T Dubai).',
      'OpsUnity Hydra: India\'s first AI hydrology model mapping 3,000,000+ streams with 6+ hours advance flood and landslide warnings.'
    ],
    schemaType: 'SoftwareApplication'
  },
  '/about': {
    title: 'About JSPARK AI | Sovereign AI Company in Noida, India',
    description: 'JSPARK AI Private Limited is a Noida-based deep-tech company founded by Harish Goswami and Ashutosh Kukreti. ISO/IEC 42001, ISO 27001 and CMMI Level 3.',
    canonical: 'https://jspark.ai/about',
    heading: 'About JSPARK AI: Building India\'s Sovereign AI Infrastructure',
    summary: `JSPARK AI was founded by serial entrepreneur Harish Goswami (CEO, founder of Toprankers, ViDU Tech acquired by Classplus) and carrier-grade engineering leader Ashutosh Kukreti (CTO, 18+ years across Airtel, COLT, Telstra, Wipro, Optus). Headquartered in Noida, India, JSPARK AI engineers sovereign AI stacks that run entirely within state and institutional infrastructure with no foreign cloud dependencies.`,
    highlights: [
      'Leadership: Harish Goswami (CEO & Founder), Ashutosh Kukreti (CTO & Founder).',
      'Sovereignty Guarantee: Air-gapped, on-premise bare-metal deployments ensuring strict national data residency.',
      'Certifications: ISO/IEC 42001 (AI Management), ISO 27001 (Information Security), and CMMI Level 3 appraised.'
    ],
    schemaType: 'AboutPage'
  },
  '/products': {
    title: 'Products | OpsVision, OpsMind, OpsUnity Hydra | JSPARK AI',
    description: 'Three sovereign AI products on one foundation: OpsVision for operational intelligence, OpsMind for document intelligence and OpsUnity Hydra for hydrology.',
    canonical: 'https://jspark.ai/products',
    heading: 'Sovereign AI Products Built on OpsUnity AI',
    summary: `JSPARK AI provides a modular, air-gapped sovereign AI operating system comprising purpose-built platforms: OpsUnity AI, OpsVision, OpsMind, and OpsUnity Hydra. Each product operates entirely within sovereign enterprise or governmental networks.`,
    highlights: [
      'OpsUnity AI: Sovereign agent swarm and quant engine foundation.',
      'OpsVision: Ontology-driven operational intelligence for command centers and dispatch networks.',
      'OpsMind: Technical blueprint and engineering document reasoning engine.',
      'OpsUnity Hydra: AI-powered hydrology, flash flood, and landslide early warning.'
    ],
    schemaType: 'CollectionPage'
  },
  '/products/opsvision': {
    title: 'OpsVision | Sovereign Operational Intelligence | JSPARK AI',
    description: 'OpsVision fuses every asset, event and signal into one living ontology of your operation. Deployed in UP 112 emergency response and NCRB NAFIS.',
    canonical: 'https://jspark.ai/products/opsvision',
    heading: 'OpsVision: Sovereign Operational Intelligence',
    summary: `OpsVision is an ontology-driven operational intelligence engine deployed at national scale. It serves 240M+ citizens across Uttar Pradesh's 75 districts for UP 112, reducing misrouted calls from 23% to 4% and speeding dispatch response times by 46% (avg 7:55 min). At NCRB NAFIS, it analyzes criminal fingerprints and generates multi-state offender dossiers in 5 seconds.`,
    highlights: [
      'National Scale: Powering Uttar Pradesh 112 across 75 districts and 240M+ residents.',
      'Crime Intelligence: Ingests 1.34 Cr records in NCRB NAFIS across 36 states and UTs.',
      'Multi-Domain Fusion: Unifies Dial 112, CAD, IoT sensors, GIS, and camera feeds into a single operational graph.',
      'Air-Gapped Sovereign: Runs on bare metal inside institutional data centers with zero data leakage.'
    ],
    schemaType: 'Product'
  },
  '/products/opsmind': {
    title: 'OpsMind | Sovereign Document Intelligence | JSPARK AI',
    description: 'OpsMind reads engineering drawings, schematics and archives at the level of a domain engineer, and lets teams query them in plain language. On-premise.',
    canonical: 'https://jspark.ai/products/opsmind',
    heading: 'OpsMind: Sovereign Document Intelligence',
    summary: `OpsMind is an air-gapped document and technical drawing reasoning engine. It digests complex multi-layer CAD files, P&ID schematics, technical manuals, and archival tenders, answering engineering queries with 100% verifiable page citations and 0% hallucination rate. Currently deployed or in POC with DRDO DESIDOC and L&T Dubai.`,
    highlights: [
      'Zero Hallucinations: Every answer cited with exact drawing coordinates and page numbers.',
      'Multi-Modal Blueprints: Reads symbols, tolerances, schematics, and revision diffs.',
      'Deployments: DRDO DESIDOC sovereign research intelligence, L&T Dubai engineering drawing comparison, NCRB Ten-Print correlation.'
    ],
    schemaType: 'Product'
  },
  '/products/opsunity-hydra': {
    title: 'OpsUnity Hydra | AI Flood Forecasting Model | JSPARK AI',
    description: 'India\'s first AI-enabled hydrology model. Hydra forecasts rainfall, floods, flash floods and rainfall-induced landslides at basin level, hours ahead.',
    canonical: 'https://jspark.ai/products/opsunity-hydra',
    heading: 'OpsUnity Hydra: AI Hydrology Model for Flood and Landslide Early Warning',
    summary: `OpsUnity Hydra is India's first sovereign AI hydrology model. Mapping over 3,000,000 streams and rivers nationwide, Hydra forecasts rainfall, flash floods, and landslides down to specific valleys and tehsils with 6+ hours advance lead time. Integrates IMD automatic weather stations, Doppler radar, and satellite precipitation on air-gapped sovereign infrastructure.`,
    highlights: [
      '3,000,000+ Streams: Complete topographical river basin runoff modeling.',
      '6+ Hours Advance Warning: Gives Disaster Management Authorities critical evacuation lead time.',
      'Verified Precision: Point-level rainfall forecasting validated against India Meteorological Department ground data.'
    ],
    schemaType: 'Product'
  },
  '/products/opsunity-ai': {
    title: 'OpsUnity AI | The Sovereign AI Foundation | JSPARK AI',
    description: 'OpsUnity AI is the sovereign foundation of JSPARK AI: agent swarms, quant engines and language models with no token limits and no external calls.',
    canonical: 'https://jspark.ai/products/opsunity-ai',
    heading: 'OpsUnity AI: The Sovereign Foundation',
    summary: `OpsUnity AI is the core bare-metal execution platform powering the JSPARK AI ecosystem. It hosts autonomous agent swarms, high-throughput mathematical models, and sovereign LLMs without token limits, subscription metering, or third-party cloud dependencies.`,
    highlights: [
      '100% Air-Gapped: Zero API calls to external cloud providers (OpenAI, AWS, Google Cloud).',
      'Infinite State Memory: Persistent operational awareness across edge clusters and command centers.',
      'Sub-5ms Latency: Direct bare-metal compilation for mission-critical responsiveness.'
    ],
    schemaType: 'Product'
  },
  '/industries': {
    title: 'Industries | Homeland Security, Defence, Power | JSPARK AI',
    description: 'Sovereign AI for homeland security, defence, power utilities and disaster management. Air-gapped deployments that keep every byte inside your walls.',
    canonical: 'https://jspark.ai/industries',
    heading: 'Sovereign AI for Homeland Security, Defence, Power and Disaster Management',
    summary: `JSPARK AI addresses sectors where downtime, data breaches, or cloud outages result in national security or economic harm. We serve Homeland Security, Disaster Management Authorities, Power Utilities & Transmission, Smart Municipalities, and the Defence & Armed Forces.`,
    highlights: [
      'Homeland Security & Police: Emergency response dispatch, crime intelligence, offender tracing.',
      'Disaster Management: Flood, landslide, and rainfall early warnings for SDMAs and NDMA.',
      'Power & Utilities: Grid fault forecasting, substation monitoring, transmission line load management.',
      'Defence & Tactical: Air-gapped terrain modeling, logistics, and sovereign blueprint reasoning.'
    ],
    schemaType: 'CollectionPage'
  },
  '/case-studies': {
    title: 'Case Studies | UP 112 and NCRB NAFIS | JSPARK AI',
    description: 'How OpsVision cut misrouted emergency calls from 23% to 4% for UP 112 and turns NCRB NAFIS fingerprint matches into offender profiles.',
    canonical: 'https://jspark.ai/case-studies',
    heading: 'Case Studies: Sovereign AI Deployed at National Scale',
    summary: `JSPARK AI is deployed across national security, homeland defense, municipal governance, energy networks, and utility grids. Proven deployments include Uttar Pradesh 112 (average response cut from 13 to 7:55 min), NCRB NAFIS (1.34 Cr fingerprint records unified), Karnataka Municipal Data Society (KMDS 30 districts), Namchi Smart City, Schneider Electric Barcelona, and Munich Electrification.`,
    highlights: [
      'UP 112 (UP Police): 240M+ citizens, 75 districts, response time cut to 7:55 min, 83% fewer repeat incidents.',
      'NCRB NAFIS: National Crime Records Bureau fingerprint correlation across 36 states/UTs, 90% faster crime data processing.',
      'KMDS (Karnataka): Smart city unified command across 30 municipal districts.',
      'Namchi Smart City: IoT dynamic waste routing and illegal dumping detection.',
      'Active POCs: DRDO DESIDOC, L&T Dubai, IMD Mausam Vibhag, Kerala State Electricity Board (KSEB), Indian Railways.'
    ],
    schemaType: 'CollectionPage'
  },
  '/contact': {
    title: 'Contact JSPARK AI | Request a Sovereign AI Demonstration',
    description: 'Request a demonstration of JSPARK AI\'s sovereign AI operating system. Email harish@jspark.in or call +91 9036126301. Noida, Uttar Pradesh, India.',
    canonical: 'https://jspark.ai/contact',
    heading: 'Request a Sovereign Demonstration',
    summary: `Request an on-premise demonstration or technical evaluation of JSPARK AI operating systems. Located in Noida, Uttar Pradesh, India. Contact: harish@jspark.in | +91 9036126301.`,
    highlights: [
      'Headquarters: Noida, Uttar Pradesh, India.',
      'Inquiries: harish@jspark.in',
      'Telephone: +91 9036126301',
      'Security Compliance: Compliant with Indian sovereign data residency and defense security standards.'
    ],
    schemaType: 'ContactPage'
  },
  '/apply': {
    title: 'Apply / Careers | Join JSPARK AI Engineering Team',
    description: 'Build the sovereign AI operating system for India\'s critical infrastructure. Career opportunities in distributed systems, computer vision, AI reasoning, and low-latency bare-metal engineering.',
    canonical: 'https://jspark.ai/apply',
    heading: 'Join JSPARK AI · Engineer Sovereign Intelligence',
    summary: `Join the team building India's sovereign AI operating systems. Work on carrier-grade, air-gapped systems deployed at national scale across homeland security, power grids, and disaster prediction.`,
    highlights: [
      'Engineering Roles: Distributed systems, high-performance computing, ontology graphs, sovereign AI models.',
      'Location: Noida, Uttar Pradesh, India.',
      'Impact: National security and life-saving emergency response infrastructure.'
    ],
    schemaType: 'WebPage'
  },
  '/404': {
    title: '404 · Page Not Found | JSPARK AI',
    description: 'The requested coordinate does not exist or access has been restricted by sovereign protocol.',
    canonical: 'https://jspark.ai/404',
    heading: '404 · Page Not Found',
    summary: 'The page you requested could not be located on the JSPARK AI sovereign server.',
    highlights: [
      'Error: 404 Not Found',
      'Location: JSPARK AI Sovereign Gateway'
    ],
    schemaType: 'WebPage'
  }
}

export function getPageMeta(pathname) {
  // Exact match
  if (PAGE_META[pathname]) {
    return PAGE_META[pathname]
  }

  // Trailing slash normalisation
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (PAGE_META[clean]) {
    return PAGE_META[clean]
  }

  // Fallback to 404 for unrecognized routes
  return PAGE_META['/404'] || PAGE_META['/']
}
