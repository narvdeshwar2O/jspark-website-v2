import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const templatePath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// Pages to pre-render with rich SEO metadata and raw semantic HTML content for crawlers & LLMs
const pages = [
  {
    path: '/',
    title: 'JSPARK AI · Sovereign AI Operating System for Mission-Critical Infrastructure',
    description: 'JSPARK AI is the Sovereign AI Operating System for missions that cannot fail. Built in India. Deployed at national scale across Homeland Security (UP 112, NCRB NAFIS), Disaster Management, Utilities, and Critical Infrastructure.',
    canonical: 'https://jspark.ai/',
    heading: 'The Sovereign AI Operating System for Missions That Cannot Fail',
    summary: `JSPARK AI is an Indian deep-tech enterprise building sovereign, air-gapped AI operating systems for mission-critical operations. Deployed at national scale for Homeland Security, Emergency Response (UP 112 across 75 districts), Disaster Management, Power Utilities, and Defence. Zero cloud dependencies, zero external data leakage, and unmetered bare-metal execution.`,
    highlights: [
      'OpsUnity AI: The sovereign foundation with autonomous agent swarms, mathematical models, and unmetered local execution.',
      'OpsVision: Sovereign operational intelligence engine fusing events, assets, and signals into a unified ontology (UP 112 46% faster dispatch, 240M+ citizens).',
      'OpsMind: Sovereign document intelligence parsing CAD drawings, schematics, and P&IDs with 100% cited accuracy and zero hallucinations (NCRB NAFIS, DRDO DESIDOC, L&T Dubai).',
      'OpsUnity Hydra: India\'s first AI hydrology model mapping 3,000,000+ streams with 6+ hours advance flood and landslide warnings.'
    ],
    schemaType: 'SoftwareApplication'
  },
  {
    path: '/about',
    title: 'About JSPARK AI · Leadership, Sovereign Mission & Engineering Architecture',
    description: 'Learn about JSPARK AI, founded by Harish Goswami (CEO) and Ashutosh Kukreti (CTO). Built in India to deliver sovereign, air-gapped artificial intelligence for national security, disaster mitigation, and critical infrastructure.',
    canonical: 'https://jspark.ai/about',
    heading: 'About JSPARK AI · Two Exits. Three Continents. Zero Downtime.',
    summary: `JSPARK AI was founded by serial entrepreneur Harish Goswami (CEO, founder of Toprankers, ViDU Tech acquired by Classplus) and carrier-grade engineering leader Ashutosh Kukreti (CTO, 18+ years across Airtel, COLT, Telstra, Wipro, Optus). Headquartered in Noida, India, JSPARK AI engineers sovereign AI stacks that run entirely within state and institutional infrastructure with no foreign cloud dependencies.`,
    highlights: [
      'Leadership: Harish Goswami (CEO & Founder), Ashutosh Kukreti (CTO & Founder).',
      'Sovereignty Guarantee: Air-gapped, on-premise bare-metal deployments ensuring strict national data residency.',
      'Core Mission: Providing high-reliability operating intelligence for institutions that cannot afford downtime or foreign dependency.'
    ],
    schemaType: 'AboutPage'
  },
  {
    path: '/products',
    title: 'Products · JSPARK AI Sovereign Intelligence Suite (OpsUnity, OpsVision, OpsMind, Hydra)',
    description: 'Explore JSPARK AI\'s product suite: OpsUnity AI sovereign foundation, OpsVision operational intelligence, OpsMind engineering document reasoning, and OpsUnity Hydra AI hydrology early-warning model.',
    canonical: 'https://jspark.ai/products',
    heading: 'Sovereign AI Products for Mission-Critical Operations',
    summary: `JSPARK AI provides a modular, air-gapped sovereign AI operating system comprising four purpose-built platforms: OpsUnity AI, OpsVision, OpsMind, and OpsUnity Hydra. Each product operates entirely within sovereign enterprise or governmental networks.`,
    highlights: [
      'OpsUnity AI: Sovereign agent swarm and quant engine foundation.',
      'OpsVision: Ontology-driven operational intelligence for command centers and dispatch networks.',
      'OpsMind: Technical blueprint and engineering document reasoning engine.',
      'OpsUnity Hydra: AI-powered hydrology, flash flood, and landslide early warning.'
    ],
    schemaType: 'CollectionPage'
  },
  {
    path: '/products/opsvision',
    title: 'OpsVision · Sovereign Operational Intelligence Engine | JSPARK AI',
    description: 'OpsVision is JSPARK AI\'s ontology-driven operational intelligence engine. Fuses live telemetry, CAD, GIS, and emergency calls into one connected model. Deployed at UP 112 (75 districts) and NCRB NAFIS.',
    canonical: 'https://jspark.ai/products/opsvision',
    heading: 'OpsVision: Sovereign Operational Intelligence Engine',
    summary: `OpsVision is an ontology-driven operational intelligence engine deployed at national scale. It serves 240M+ citizens across Uttar Pradesh's 75 districts for UP 112, reducing misrouted calls from 23% to 4% and speeding dispatch response times by 46% (avg 7:55 min). At NCRB NAFIS, it analyzes criminal fingerprints and generates multi-state offender dossiers in 5 seconds.`,
    highlights: [
      'National Scale: Powering Uttar Pradesh 112 across 75 districts and 240M+ residents.',
      'Crime Intelligence: Ingests 1.34 Cr records in NCRB NAFIS across 36 states and UTs.',
      'Multi-Domain Fusion: Unifies Dial 112, CAD, IoT sensors, GIS, and camera feeds into a single operational graph.',
      'Air-Gapped Sovereign: Runs on bare metal inside institutional data centers with zero data leakage.'
    ],
    schemaType: 'Product'
  },
  {
    path: '/products/opsmind',
    title: 'OpsMind · Sovereign Engineering Document & Blueprint Intelligence | JSPARK AI',
    description: 'OpsMind reads complex engineering drawings, P&IDs, manuals, and archives with domain-engineer precision. 100% cited accuracy, zero hallucinations, fully air-gapped for Defence and Enterprise.',
    canonical: 'https://jspark.ai/products/opsmind',
    heading: 'OpsMind: Sovereign Engineering Document & Blueprint Intelligence',
    summary: `OpsMind is an air-gapped document and technical drawing reasoning engine. It digests complex multi-layer CAD files, P&ID schematics, technical manuals, and archival tenders, answering engineering queries with 100% verifiable page citations and 0% hallucination rate. Currently deployed or in POC with DRDO DESIDOC and L&T Dubai.`,
    highlights: [
      'Zero Hallucinations: Every answer cited with exact drawing coordinates and page numbers.',
      'Multi-Modal Blueprints: Reads symbols, tolerances, schematics, and revision diffs.',
      'Deployments: DRDO DESIDOC sovereign research intelligence, L&T Dubai engineering drawing comparison, NCRB Ten-Print correlation.'
    ],
    schemaType: 'Product'
  },
  {
    path: '/products/opsunity-hydra',
    title: 'OpsUnity Hydra · India\'s First AI Hydrology & Early Warning Model | JSPARK AI',
    description: 'Hydra forecasts rainfall, floods, flash floods, and rainfall-induced landslides at basin level 6+ hours before impact. Over 3 million streams mapped across India. Verified with IMD data.',
    canonical: 'https://jspark.ai/products/opsunity-hydra',
    heading: 'OpsUnity Hydra: AI Hydrology & Flash Flood Early Warning System',
    summary: `OpsUnity Hydra is India's first sovereign AI hydrology model. Mapping over 3,000,000 streams and rivers nationwide, Hydra forecasts rainfall, flash floods, and landslides down to specific valleys and tehsils with 6+ hours advance lead time. Integrates IMD automatic weather stations, Doppler radar, and satellite precipitation on air-gapped sovereign infrastructure.`,
    highlights: [
      '3,000,000+ Streams: Complete topographical river basin runoff modeling.',
      '6+ Hours Advance Warning: Gives Disaster Management Authorities critical evacuation lead time.',
      'Verified Precision: Point-level rainfall forecasting validated against India Meteorological Department ground data.'
    ],
    schemaType: 'Product'
  },
  {
    path: '/products/opsunity-ai',
    title: 'OpsUnity AI · Sovereign Agent Swarm & Foundation Platform | JSPARK AI',
    description: 'OpsUnity AI is the foundational sovereign AI layer. Autonomous agent swarms, quantitative engines, and localized LLMs running on bare-metal with unmetered execution and zero external calls.',
    canonical: 'https://jspark.ai/products/opsunity-ai',
    heading: 'OpsUnity AI: The Sovereign Foundation Platform',
    summary: `OpsUnity AI is the core bare-metal execution platform powering the JSPARK AI ecosystem. It hosts autonomous agent swarms, high-throughput mathematical models, and sovereign LLMs without token limits, subscription metering, or third-party cloud dependencies.`,
    highlights: [
      '100% Air-Gapped: Zero API calls to external cloud providers (OpenAI, AWS, Google Cloud).',
      'Infinite State Memory: Persistent operational awareness across edge clusters and command centers.',
      'Sub-5ms Latency: Direct bare-metal compilation for mission-critical responsiveness.'
    ],
    schemaType: 'Product'
  },
  {
    path: '/case-studies',
    title: 'Case Studies & Deployments · UP 112, NCRB, KMDS, Namchi, PGCIL | JSPARK AI',
    description: 'Verified real-world case studies of JSPARK AI across Uttar Pradesh 112 (240M citizens), NCRB NAFIS, Karnataka Mining (KMDS), Namchi Smart City, Schneider Microgrid, Munich Electrification, and DRDO DESIDOC.',
    canonical: 'https://jspark.ai/case-studies',
    heading: 'Proven National-Scale Case Studies & Real-World Deployments',
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
  {
    path: '/industries',
    title: 'Industries Served · Homeland Security, Defence, Utilities, Smart Cities | JSPARK AI',
    description: 'JSPARK AI builds mission-critical sovereign AI infrastructure for Homeland Security, Defence & Armed Forces, Disaster Management, Power Transmission & Utilities, and Smart Cities.',
    canonical: 'https://jspark.ai/industries',
    heading: 'Mission-Critical Industries Powered by JSPARK AI',
    summary: `JSPARK AI addresses sectors where downtime, data breaches, or cloud outages result in national security or economic harm. We serve Homeland Security, Disaster Management Authorities, Power Utilities & Transmission, Smart Municipalities, and the Defence & Armed Forces.`,
    highlights: [
      'Homeland Security & Police: Emergency response dispatch, crime intelligence, offender tracing.',
      'Disaster Management: Flood, landslide, and rainfall early warnings for SDMAs and NDMA.',
      'Power & Utilities: Grid fault forecasting, substation monitoring, transmission line load management.',
      'Defence & Tactical: Air-gapped terrain modeling, logistics, and sovereign blueprint reasoning.'
    ],
    schemaType: 'CollectionPage'
  },
  {
    path: '/contact',
    title: 'Contact JSPARK AI · Deploy Sovereign AI Infrastructure in India',
    description: 'Contact JSPARK AI for institutional deployments, sovereign AI demonstrations, and defense inquiries. Offices in Noida, Uttar Pradesh, India. Email: sales@jspark.in.',
    canonical: 'https://jspark.ai/contact',
    heading: 'Connect with JSPARK AI · Sovereign AI for National Infrastructure',
    summary: `Request an on-premise demonstration or technical evaluation of JSPARK AI operating systems. Located in Noida, Uttar Pradesh, India. Contact: sales@jspark.in | +91 98913 23450 | +91 97171 78483.`,
    highlights: [
      'Headquarters: Noida, Uttar Pradesh, India.',
      'Sales & Institutional Inquiries: sales@jspark.in',
      'Telephone: +91 98913 23450 / +91 97171 78483',
      'Security Compliance: Compliant with Indian sovereign data residency and defense security standards.'
    ],
    schemaType: 'ContactPage'
  },
  {
    path: '/apply',
    title: 'Apply / Careers · Join JSPARK AI Engineering Team',
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
  }
];

console.log(`Starting pre-rendering for ${pages.length} pages...`);

pages.forEach((page) => {
  let html = template;

  // 1. Replace Title & Meta description
  html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${page.description}" />`
  );
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="${page.canonical}" />`
  );

  // 2. OpenGraph & Twitter tags
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="${page.canonical}" />`
  );
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${page.description}" />`
  );
  html = html.replace(
    /<meta property="og:locale" content=".*?" \/>/i,
    `<meta property="og:locale" content="en_IN" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${page.description}" />`
  );

  // 3. Inject page-specific JSON-LD BreadcrumbList & Specific Schema
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': page.schemaType || 'WebPage',
    'name': page.title,
    'description': page.description,
    'url': page.canonical,
    'publisher': {
      '@type': 'Organization',
      'name': 'JSPARK AI',
      'url': 'https://jspark.ai'
    }
  };

  const schemaScript = `
    <script type="application/ld+json">
    ${JSON.stringify(pageSchema, null, 2)}
    </script>
  `;
  html = html.replace('</head>', `${schemaScript}\n</head>`);

  // 4. Inject Crawlable Static Server-Rendered Semantic HTML Content into #root
  // When a crawler (GPTBot, ClaudeBot, PerplexityBot, Googlebot) fetches the page without JS,
  // it sees this full rich semantic document with H1, paragraphs, and list items!
  // When React mounts in a real browser, it cleanly replaces the innerHTML of #root.
  const staticContent = `
    <div id="crawler-prerender-content" class="sr-crawler-content" style="max-width:1200px;margin:0 auto;padding:40px 20px;color:#E6EAF0;font-family:sans-serif;">
      <header>
        <p style="color:#FF5722;font-weight:bold;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">JSPARK AI · Sovereign AI Operating System</p>
        <h1 style="font-size:36px;font-weight:900;line-height:1.2;margin:12px 0 20px 0;color:#FFFFFF;">${page.heading}</h1>
      </header>
      <section style="margin-bottom:30px;line-height:1.7;font-size:16px;color:#A0AEC0;">
        <p>${page.summary}</p>
      </section>
      <section style="margin-bottom:40px;">
        <h2 style="font-size:22px;font-weight:700;color:#FFFFFF;margin-bottom:16px;">Key Capabilities & Verified Operational Highlights</h2>
        <ul style="line-height:1.8;padding-left:24px;color:#CBD5E0;">
          ${page.highlights.map((h) => `<li style="margin-bottom:8px;">${h}</li>`).join('\n          ')}
        </ul>
      </section>
      <footer style="border-top:1px solid #2D3748;padding-top:20px;font-size:14px;color:#718096;">
        <p><strong>Company:</strong> JSPARK AI Private Limited | <strong>Headquarters:</strong> Noida, Uttar Pradesh, India | <strong>Email:</strong> sales@jspark.in</p>
        <p><strong>Core Deployments:</strong> Uttar Pradesh 112 (75 Districts), NCRB NAFIS, Karnataka Municipal Data Society (KMDS), Namchi Smart City, Schneider Microgrid, Munich Electrification.</p>
        <nav aria-label="Quick links" style="margin-top:10px;">
          <a href="/" style="color:#FF5722;margin-right:15px;">Home</a>
          <a href="/about" style="color:#FF5722;margin-right:15px;">About</a>
          <a href="/products" style="color:#FF5722;margin-right:15px;">Products</a>
          <a href="/products/opsvision" style="color:#FF5722;margin-right:15px;">OpsVision</a>
          <a href="/products/opsmind" style="color:#FF5722;margin-right:15px;">OpsMind</a>
          <a href="/products/opsunity-hydra" style="color:#FF5722;margin-right:15px;">OpsUnity Hydra</a>
          <a href="/products/opsunity-ai" style="color:#FF5722;margin-right:15px;">OpsUnity AI</a>
          <a href="/case-studies" style="color:#FF5722;margin-right:15px;">Case Studies</a>
          <a href="/industries" style="color:#FF5722;margin-right:15px;">Industries</a>
          <a href="/contact" style="color:#FF5722;">Contact</a>
        </nav>
      </footer>
    </div>
  `;

  // Place semantic content inside #root
  html = html.replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);

  // Target destination file
  let targetFile;
  if (page.path === '/') {
    targetFile = path.resolve(distDir, 'index.html');
  } else {
    const pageDir = path.resolve(distDir, page.path.replace(/^\//, ''));
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }
    targetFile = path.resolve(pageDir, 'index.html');
  }

  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`✓ Pre-rendered: ${page.path} -> ${path.relative(distDir, targetFile)}`);
});

console.log('Static pre-rendering complete for all pages!');
