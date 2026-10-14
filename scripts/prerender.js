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

import { PAGE_META } from '../src/features/marketing/data/pageMeta.js';

// Pages to pre-render with rich SEO metadata and raw semantic HTML content for crawlers & LLMs
const pages = Object.entries(PAGE_META).map(([routePath, meta]) => ({
  path: routePath,
  ...meta
}));

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
  } else if (page.path === '/404') {
    targetFile = path.resolve(distDir, '404.html');
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

// console.log('Static pre-rendering complete for all pages!');
