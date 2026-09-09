# JSPARK AI, Website Project Context

This file is the source of truth for the website build. Read it before every task.
Scene-by-scene specification lives in SCENES.md. Never hard-code scene timings elsewhere.
This site has its own visual language, defined below. It is not bound by the JSPARK Vision deck/document brand guide.

## Company and positioning
- Company: JSPARK AI, Noida.
- Tagline: Intelligence is the new infrastructure.
- What we do: fuse satellite, radar and ground-sensor data into operational intelligence for government, infrastructure operators and disaster-management agencies.
- Audience: serious institutional buyers. The site should make them feel they are looking at an instrument, not a pitch.

## Products (homepage order)
1. Hydra, flood and hydrology intelligence: satellite + radar + ground sensors → early warning. [confirm one-line description]
2. Command Center, the operations room where all signals converge. [confirm]
3. OpsVision, fused camera, sensor and satellite feeds into one operational picture. [confirm]
4. OpsMind, from signal to decision; reasoning over operational data. [confirm]
5. OpsUnity, one operating layer joining the products above. [confirm]

## Visual direction
Dark. Cinematic. Technical. Minimal. Premium.
The site is one continuous night: it opens in orbit and never goes to a white page.
Reference feel: a mission-control display seen through a film camera. Slow, heavy, deliberate.
Anti-references: SaaS landing pages, gradient blobs, neon "AI" glow, stock 3D, stock photography, rounded pill buttons, emoji, icon grids.

## Design language

### Typefaces
- Display: **Space Grotesk** (Google Fonts), weights 500 and 700. Headlines, section statements, product names.
- Mono: **JetBrains Mono** (Google Fonts), weights 400 and 500. Data readouts, captions, scene numbers, coordinates, timestamps, labels.
- Body: Space Grotesk 400 for the few paragraphs that exist. Keep body copy short.
- No third typeface.

### Type scale (px, desktop)
Sizes are at the 1536 reference width; tokens are fluid, floor 0.75x, ceiling 1.5x.
| Token | Size | Face | Notes |
|---|---|---|---|
| display | 96 | Space Grotesk 700 | Uppercase, tracking +0.02em, line-height 0.95. Hero and scene statements. |
| h1 | 56 | Space Grotesk 700 | Uppercase, tracking +0.02em. Scene headlines inside the Hydra stage. |
| h2 | 36 | Space Grotesk 500 | Sentence case. Product section headlines. |
| h3 | 24 | Space Grotesk 500 | Sentence case. |
| body-lg | 18 | Space Grotesk 400 | Line-height 1.5. |
| body | 16 | Space Grotesk 400 | Line-height 1.5. Max 70 characters per line. |
| label | 12 | JetBrains Mono 500 | Uppercase, tracking +0.12em. Scene numbers, eyebrows: "01 / OBSERVE". |
| data | 14 | JetBrains Mono 400 | Tabular figures. Readouts and units. |
| data-md | 24 | JetBrains Mono 500 | Tabular figures. Console sidebar grid values. |
| data-lg | 32 | JetBrains Mono 500 | Tabular figures. Key values in the data panel. |
| micro | 11 | JetBrains Mono 400 | Footer, credits, coordinates. |

Casing rule: uppercase for display, h1 and labels (the cinematic register). Sentence case for h2, h3 and body (the product register). Do not mix within one element.

### Colour
| Token | Hex | Use |
|---|---|---|
| bg | #05070A | Page and canvas background. Near-black, slightly cool. |
| surface | #0B0F14 | Panels, data readouts, product section backgrounds. |
| surface-2 | #11161D | Raised panels, hover states. |
| line | #1C232C | Borders, dividers, grid lines, planet-edge arcs. |
| text | #E6EAF0 | Primary text. Never pure white. |
| text-muted | #7C8794 | Secondary text, captions, units. |
| text-dim | #465060 | Tertiary labels, inactive states. |
| signal | #62C6FF | The single interface accent. Radar rings, coverage, active data, links, button borders on hover. Cool, not neon. |
| alert | #FF5A3C | Flood extent, critical values. Warm, used only when something is wrong. |
| caution | #FFB020 | Predicted flood extent, warning states. |
| ok | #3DDC97 | Sensor online, nominal. Rare. |

Rules:
- The page is 90% neutral. Signal appears as thin lines and small text, never as fills larger than a button.
- Alert and caution appear only in Scenes 06 to 08 console and in Command Center status. Nowhere decorative.
- No gradients except a single radial vignette on the Cesium canvas edges (bg → transparent) to sink the globe into the page.
- No glow, no bloom, no drop shadows. Depth comes from the 3D scene, not CSS.
- Text over the 3D canvas always sits on a subtle scrim (bg at 40% opacity, 24px padding) so it stays readable over terrain.

### Spacing and layout
- Composition is relative, detail is fixed. Hairlines (1px), the 8px unit and 6px status squares never scale. Gutters, columns, panels and type scale with the viewport between a floor and a ceiling. Reference width 1536.
- Base unit 8px. Scale: 8, 16, 24, 32, 48, 64, 96, 128.
- Content max-width 1280px. Gutter 64px desktop, 20px mobile.
- 12-column grid on desktop. Hydra text blocks span columns 2 to 7 (left-weighted) unless the scene says centre.
- Corner radius 0px everywhere.
- Dividers: 1px `line`. The horizontal rule motif from Scene 00 recurs at every section boundary.

### Components
- Button: outlined, 1px `line` border, `text` label in JetBrains Mono 12 uppercase +0.12em, 14px/24px padding. Hover: border becomes `signal`, label stays. No filled buttons anywhere on the site.
- Label (eyebrow): JetBrains Mono 12, `text-muted`, uppercase, format "01 / OBSERVE".
- Data readout: label in `text-muted` data, value in `text` data-lg tabular, unit in `text-muted` data. Stacked. 
- Data panel: `surface` background, 1px `line` border, 24px padding, 400px wide, bottom-right of the stage. Contains up to three readouts and one status line.
- Status line: 6px square (not circle) in the status colour + JetBrains Mono 12 label.
- Scrim: bg at 40% behind any text on the 3D canvas.
- Progress rail: 1px vertical line, left edge, 64px from viewport edge, with a 6px `signal` tick showing Hydra stage progress and scene numbers beside it.

### Motion
- All motion is scroll-driven except idle loops (satellite panels, radar dish, scan cone).
- Easing: power2.inOut for camera, power1.out for text reveals.
- Text reveals: opacity 0→1 plus 12px upward translate, over 6% of section progress. Never letter-by-letter, never typewriter.
- Camera never moves faster than the equivalent of a 1s ease across any waypoint pair.
- prefers-reduced-motion: camera jumps between waypoints on section boundaries, text fades only.

## Voice
Direct. Specific. Numerals always. Short lines. One idea per scene.
Right arrow → for CTAs. Slash / for scene numbers. Middle dot · for metadata.
Never use em dashes or en dashes anywhere on the site, in code, in comments, or in documentation. Use commas, periods, or the word to for ranges. Allowed marks: comma, period, slash in scene labels, middle dot in metadata, right arrow in CTAs.
Forbidden: revolutionary, game-changing, cutting-edge, world-class, best-in-class, solutions, synergy, leverage, unlock, empower, seamless, frictionless, intuitive, robust, powerful, comprehensive, AI-powered.

## Stack
- React 18 + Vite
- GSAP + ScrollTrigger (all scroll-driven motion)
- CesiumJS + vite-plugin-cesium (Earth, terrain, imagery, geographic camera; also loads .glb via Cesium.Model)
- Three.js + React Three Fiber + drei (non-geographic 3D: Command Center room, product visuals)
- Blender-exported .glb in /public/models
- Cesium ion access token in .env as VITE_CESIUM_TOKEN
- Google Fonts: Space Grotesk 400/500/700, JetBrains Mono 400/500

## Architecture rules
- Objects are sized for legibility, not real-world scale. Every intentional object must be clearly readable at its scene's camera pose: hero objects 150 to 200 px, supporting objects 70 to 100 px, instrument marks 8 to 12 px. Real scale is what the data panel is for.
- One component per section in src/sections/. Each section self-contained.
- The Hydra stage is one continuous shot. Never cut. Camera moves between fixed waypoints defined in src/data/waypoints.js.
- All motion is driven by a single scroll progress value (0 to 1) per pinned section.
- Cesium and Three.js never share a canvas. Cesium owns the Hydra stage; Three.js owns Command Center onward.
- Every 3D section has a fallback: scroll-scrubbed video or still for mobile and prefers-reduced-motion.
- On load, pre-fly the Cesium camera through the exact journey poses (WP0 to WP4 plus two intermediate poses on the WP2 to WP4 descent and the rotated Scene 07 pose), holding at each until globe.tilesLoaded (4s cap), at full resolution and rest-quality screen-space error, then return to WP0. The canvas stays hidden and the hero shows until the ready flag.
- Tile caching: globe.tileCacheSize 1000 with preloadAncestors, preloadSiblings and preloadFlightDestinations on, so pre-fly tiles stay resident for the whole journey. maximumScreenSpaceError 1.6 throughout: a looser value while scrolling was measured as the only remaining source of mid-scroll blur once tiles are resident, so the moving/rest split (300 ms rest delay) stays in the code only as a knob for weaker hardware. A render is requested whenever tiles finish loading, not only on scroll, so sharp tiles draw as soon as they arrive.
- Rendering: native device resolution (resolutionScale = devicePixelRatio, tracked across zoom changes), MSAA 2 plus FXAA, resolutionScale capped at the ladder floor of 1.5. Those are the measured fallback-ladder rungs: with the full stage, 4x MSAA scrubs below 60 fps even at DPR 1, and uncapped DPR 2 renders at 16 fps.
- Cesium default UI widgets hidden. Credits kept in a micro-type footer line.

## Folder structure
```
jspark-website/
├── PROJECT_CONTEXT.md
├── SCENES.md
├── .env                      # VITE_CESIUM_TOKEN
├── public/
│   ├── models/               # satellite.glb, radar.glb, command_center.glb
│   ├── images/               # product renders (.webp)
│   └── video/                # mobile fallback
└── src/
    ├── design/               # tokens.css, fonts
    ├── sections/             # Hero, Hydra, CommandCenter, OpsVision, OpsMind, OpsUnity, Closing
    ├── scenes/               # HydraStage (Cesium), CommandCenterScene (R3F)
    ├── animations/           # ScrollTrigger setup, useSectionProgress hook
    ├── components/           # Label, Button, DataReadout, DataPanel, StatusLine, Scrim, ProgressRail
    └── data/                 # waypoints.js, radarStations.js
```

## Build order
Phase 1 layout + tokens → Phase 2 scroll system with placeholders → Phase 3 Cesium Earth → Phase 4 Blender assets → Phase 5 models in scene → Phase 6 rain/flood → Phase 7 Command Center + products → Phase 8 performance, mobile, ship.
