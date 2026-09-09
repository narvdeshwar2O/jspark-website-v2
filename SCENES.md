# JSPARK AI, Scenes

Every scene on the homepage, in order. Timings are scroll-progress values within their section.
Copy in quotes is on-screen text. [confirm] marks draft content.
Casing: display and h1 uppercase. h2/h3/body sentence case. Labels uppercase mono.
Tokens (bg, surface, line, text, text-muted, signal, alert, caution) are defined in PROJECT_CONTEXT.md.

Scroll-progress convention: each pinned section exposes p from 0 to 1.
A beat listed as "0.55 to 0.65" is active while 0.55 ≤ p < 0.65.

---

## Section: Hero (not pinned, 100vh, bg)

### Scene 00, Arrival
- The Cesium canvas is already rendering behind at 15% exposure.
- Graphic: a 1px horizontal `line` rule draws itself across the centre over 1.2s on load.
- Above the rule, display (96px, uppercase): "JSPARK AI", letter-spacing animates from +0.3em to +0.02em over 1.6s.
- Below the rule, h2 (36px, sentence case, text-muted): "Intelligence is the new infrastructure."
- Bottom-left label: "01 / OBSERVE"
- Bottom-right micro: "28.5°N 77.4°E · NOIDA" [confirm]
- Bottom-centre: scroll cue, 1px vertical line, 32px tall, slow 3s pulse.
- No button in the hero. The first CTA is in Scene 08.
- Transition: on first scroll, hero text fades over the first 8% of the Hydra stage; Cesium exposure rises from 15% to 100%.

---

## Section: Hydra stage (pinned, 3600px scroll height, one continuous shot)

Hydra operates in the higher and mid Himalayas. The camera journey ends in the Alaknanda valley, Chamoli, Uttarakhand.

Camera waypoints (Cesium; lon/lat degrees, height metres, pitch degrees):
- WP0 Earth: lon 78, lat 10, height 30,000,000, pitch -90
- WP1 India: lon 78, lat 22, height 6,000,000, pitch -85
- WP2 Himalayan arc: lon 79.0, lat 30.0, height 1,200,000, pitch -60
- WP3b Basin nadir: lon 79.30, lat 30.60, height 110,000, pitch -88, full nadir. Derived: the full catchment outline inside the central 65 percent of frame, the footprint fully on-screen and clear of the data panel through the whole sweep, upper-left quadrant clear for the satellite. Supersedes WP3.
- WP4 Valley: lon 79.40, lat 30.27, height 60,000, pitch -55
- WP5 Downstream: lon 79.151, lat 30.138, height 60,000, pitch -55, heading 31.5. Derived from projection constraints: the flood corridor midpoint in the central half of frame, Chamoli lower-central, the catchment mouth in the upper half. 28 km down the valley axis from WP4, looking back up the valley.
- WP4 and WP5 sit south of the basin so it is framed ahead, not beneath. WP3b sits at nadir west of the basin; the satellite hangs in its upper-left foreground.

Lighting model:
- Fixed western light at 12 degrees elevation, constant, not time-of-day. Ridges catch it, valleys fall into shadow.
- Imagery desaturated and cool at 0.6 brightness (contrast 1.15, saturation 0.15). Darkness comes from the sky and the palette, shape comes from the light.
- Terrain exaggeration 1.4 from Scene 03 (p 0.34), 1.0 before so the Earth and India views stay true.
- Exposure ramp and Scene 08 dimming apply to the Cesium canvas only, never to text, rail or data panel.

Catchment through-line:
- One catchment polygon: over the upper Alaknanda basin ahead of WP4, mouth on the real channel at lon 79.425, lat 30.451, roughly 12.5 km across, 12 lon/lat vertices, downstream mouth at the south end and head at the north end. The drawn catchment is a stylised coverage zone scaled to the beam, mouth anchored to the real channel; the true basin is larger. Defined once in src/data/catchment.js.
- Scene 04 sweeps it, Scene 05 rings it from its rim, Scene 06 rains on it, Scene 07 floods out of its mouth.

Persistent UI across the stage:
- Progress rail, left edge: scene numbers 01 to 08 in label type; `signal` tick tracks p.
- Data panel, bottom-right (400px, surface, 1px line): appears at Scene 04, persists to Scene 08.
- All stage text sits on a scrim.
- Rail fades in over p 0.00 to 0.02 and out over 0.98 to 1.00. All stage UI is scoped to the pinned stage.

Load gate:
- A full-viewport gate in bg colour above everything from first paint: the JSPARK AI wordmark in the display face, a 240px 1px `line` track with a `signal` fill advancing left to right, and a mono caption "LOADING · 62%" in tabular figures counting up.
- Progress is real, not cosmetic: a weighted aggregate of Cesium pre-fly tile residency (weight 6, the long pole), stage object loads including satellite.glb and radar.glb (2), font readiness (1) and section code (1). The bar never moves backwards and holds at 99 percent until every subsystem reports complete.
- On completion the gate fades out over 600ms and Scene 00 is revealed. Scroll is locked until the gate lifts; ScrollTrigger re-measures after release. Reduced motion: bar updates without animation, instant gate removal.

### Scene 01, Earth · p 0.00 to 0.16
- Camera: WP0, slow drift, descent begins at 0.10.
- Frame: night-side Earth over the Indian Ocean. Thin atmosphere rim in `line`→`signal` at 20%. No clouds. Dark-graded world imagery carries the whole journey. Radial vignette sinks the globe into bg.
- Text: hero fades by 0.08. At 0.14, label bottom-left: "01 / OBSERVE".
- Made with: Cesium.

### Scene 02, India · p 0.16 to 0.34
- Camera: WP0 → WP1, heavy deceleration into WP1, arriving by 0.34.
- Frame: India fills the frame. Coastlines readable. Terrain resolves as elevation shading. A faint lat/lon grid in `line` appears at 0.20, fades by 0.30.
- h1 (56px, uppercase, columns 2 to 7): "EVERY FLOOD STARTS AS RAINFALL." In at 0.18, out at 0.30.
- Made with: Cesium terrain + imagery.

### Scene 03, Himalayas · p 0.34 to 0.50
- Camera: WP1 → WP2, arriving at WP3b by 0.50, pitching forward to near vertical as it lands: the drama of the transition.
- Frame: Himalayan arc, oblique, low light from the west, long valley shadows. Snow rendered grey, not white. A river basin threading south.
- h1: "THE TERRAIN KNOWS." at 0.36. Second line "WE LISTEN." at 0.42. Both out at 0.48.
- Label: "02 / SENSE" replaces "01 / OBSERVE" at 0.45.
- Made with: Cesium terrain, custom dark lighting.

### Scene 04, Satellite · p 0.50 to 0.62
- Camera: holds at WP3b: satellite upper-left, the beam crossing the frame to the basin, the eye and what it watches in one diagonal.
- Frame: satellite.glb drifts in fully opaque from off the upper-left corner over 0.50 to 0.53, about 170px across: top face to camera, wings spanning left and right, dish south in profile, wing rotation the only motion, no roll. A translucent scan cone (`signal` at 8%) descends diagonally from satellite to terrain and sweeps slowly across the catchment from mouth to head over 0.53 to 0.60. Where it lands, a moving footprint ellipse (7 km radius) outlined 1px `signal`. The scan leaves no light on the terrain; the outline draw-in is the only record of where it has passed. As the footprint passes, a 1px `signal` outline of the catchment boundary draws in behind it; the outline persists at 40% through Scene 07. Exits over 0.62 to 0.65.
- Model rests at a fixed altitude 25 km below the camera, anchored to screen fraction (0.16, 0.16), the upper-left quadrant, clear of the catchment; the readout reports the true 505 km orbit. When its exit fade completes at 0.65 it is hidden outright, cone and footprint included.
- Data panel appears at 0.50 (slides up 16px, fades in):
  - "ORBIT" · "505" · "km"
  - "SWATH" · "290" · "km"
  - "REVISIT" · "5" · "days"
  - Status line: `ok` square · "SENSOR ONLINE"
- Made with: Blender .glb as Cesium.Model; cone as Cesium geometry. Idle loop: panel rotation 10s.
- Scene 04 composition approved and locked 03 Sep 2026.
- Lock scope under global fluid tokens: bit identity outside the data panel rect; inside the panel, zero layout shift and channel delta under 24 (glyph antialiasing phase only). The satellite's own rect is excluded from bit identity because its wing animation phase differs between captures.

### Scene 05, Radar · p 0.62 to 0.73
- Camera: WP3b → WP4, pitch easing back to -55, tilting toward horizontal so the mountains gain height.
- Frame: three radar.glb instances scale in on the catchment rim, staggered 0.02 each. Expanding coverage rings on terrain, 1px `signal` at 40%, 30 km radius, 4s repeat, overlapping across the basin interior. Overlap zones slightly brighter.
- Radar positions, on the catchment rim: west (30.49163, 79.37799), north (30.55723, 79.45589), east (30.49573, 79.50919). Approximate, adjust together with the catchment polygon.
- Fourteen ground stations appear with the river line at 0.62: six river gauges down the Alaknanda (on the real channel), five basin sensors on the coverage zone, three upstream stations above the head. 10px squares, 1.5px `text` stroke over a bg-colour casing, micro mono labels always on. Visibility-first sizing; size and label rules tune down once confirmed.
- The Chamoli town marker and gauge G-06 are one fused mark labelled "CHAMOLI · G-06" (they share the same river vertex); it carries the gauge's state colour, so the town visibly becomes a reporting station.
- Labels de-collide every tick: an overlapping label moves to the nearest clear position (right, left, above, below) by priority, town > gauge > sensor > upstream, with the radar towers treated as obstacles, and a 1px leader line ties a label to its mark when displaced more than 8px. Deterministic resolve order, no frame-to-frame jitter.
- h1: "GROUND TRUTH." 0.63 to 0.71.
- Data panel updates: "STATIONS 3" · "RADIUS 30 km" · "SWEEP 4 s".
- Made with: Blender .glb ×3, Cesium ellipse geometry. Idle loop: dish rotation 6s.

### Scene 06, Rain · p 0.73 to 0.84
- Camera: holds at WP4, slight push-in.
- Frame: rain streaks over the coverage area, `text-muted` at 30%, sparse → dense. Terrain darkens, gains a wet sheen. Rings continue beneath.
- Rain falls only inside the catchment, densest on the upper slopes. The readout is labelled for this basin: "UPPER ALAKNANDA RAINFALL". (Phase 6)
- Ground stations step to caution across the rain ramp, basin sensors first, river gauges last.
- Label: "03 / PREDICT" at 0.74.
- Data panel: "RAINFALL" counts 0 → 184 "mm / 6 h" in data-lg tabular. Status line switches to `caution` square · "HEAVY RAINFALL".
- Made with: Cesium particle system; React readout.

### Scene 07, Flood · p 0.84 to 0.95
- Camera: Scene 07 travels downstream with the water, arriving framed on Chamoli. WP4 to WP5 with power2.inOut, heading easing to the valley's downstream axis (computed from the river path's mid-segment).
- Frame: river brightens and widens. Flood polygon in `alert` at 30% fill, 1px `alert` edge, spreads from the banks following contours toward a town marker. A second dashed polygon in `caution` shows predicted extent, always ahead of actual.
- The flood originates at the catchment's downstream mouth and spreads down the valley. (Phase 6)
- River gauges flip to alert as the flood front passes them, upstream first; basin sensors and upstream stations hold caution.
- h1: "FOURTEEN HOURS EARLY." 0.86 to 0.94, fully out by 0.955.
- Data panel: "RIVER LEVEL" · "4.2" · "m above baseline" / "HOURS TO PEAK" · counts 14 → 12 / status line `alert` square · "FLOOD WARNING".
- Made with: a terrain-clipped water surface mesh along the real channel; the valley walls shape the shoreline.

### Scene 08, Hydra reveal · p 0.95 to 1.00
- Camera: frozen at WP5, the flood held at peak. Cesium stays at full exposure; the old 25% dim is removed, the view is now a monitor.
- The map column shows the live Cesium canvas for the whole of Scene 08 and the console hold. Idle loops continue: radar rings 4 s sweep, dish rotation 6 s, station squares in alert blink at 2 s, light rain over the upper basin at the Scene 06 sparse density. Camera frozen at WP5. All readouts frozen; nothing counts while scroll is stopped. Render-on-demand during the hold is capped at 30 fps.
- 0.950 to 0.970, console shrink (scrubbed): the full-bleed view scales and translates into the map column of one bordered console; the shrink target is the map column rect. The exposed page around the view is bg, no vignette, no scrim.
- One console, single frame: 1px `line` border, 0px radius, `surface` title bar across the full row width (mono label 12: "HYDRA · ALAKNANDA BASIN · LIVE", 6px `alert` square at the far right of the full bar). Inside: map column left, status column right at 28% of the inner width, separated by a 1px `line` divider, no gap. The strip runs beneath the map column only; the status column runs from the title bar to the frame bottom.
- Console geometry, fluid:
  - Row spans the viewport minus a side gutter of 1/12 viewport width, row width capped at 1706 (2/3 of 2560); beyond that the row centres and margins grow.
  - Console total height is the vertical budget: viewport height minus the label-plus-display block, the caption band and margins. Map column height is that minus the title bar and strip, which are 2.5 and 3 line-heights of the label and data tokens respectively, so they scale with type. Aspect is whatever results, no cap; logged per viewport, aspect under 2.5.
  - Short viewports, height below 1000: display uses the h1 token, margins collapse to the 24 / 24 / 64 rhythm (24 top, 24 of inter gaps split 8 above and 16 below, 64 bottom). At or above 1000, display token, margins 16 / 32 / 32 / 64.
  - Cover fit as built.
- Caption band, below 1000 CSS height: h2 and the SEE HYDRA button share one row beneath the console, h2 left, button right, baseline aligned; the body line is not rendered. At or above 1000: h2, body, button stacked. Reveal timings unchanged.
- Data panel migrates: over 0.950 to 0.970 the panel interpolates position and scale into the status strip along the console's bottom edge (`surface`, 1px `line` top border). Its three readouts become one mono 14 row: "RIVER LEVEL 4.2 m · HOURS TO PEAK 12 · FLOOD WARNING". Readout values do not change during the migration.
- Status column, 28% of the console's inner width, from the title bar to the frame bottom, `surface`, 24px padding; the empty space below the log is fine. Content top to bottom, all mono:
  - FLOOD WARNING block: label 12 `alert` "FLOOD WARNING"; data-lg 32 "CHAMOLI"; data 14 `text-muted` "PEAK IN 12 h · 04:20 IST" [confirm]
  - 1px `line` divider
  - Figures, four readouts in a 2 by 2 grid, 16px gap, each label / value / unit stacked, values in data-md: "RAINFALL" "184" "mm / 6 h"; "EXPECTED DISCHARGE" "2,140" "m³/s" [confirm]; "RIVER LEVEL" "4.2" "m above baseline"; "CONFIDENCE" "91" "%" [confirm]. Row 1: rainfall, discharge. Row 2: river level, confidence.
  - 1px `line` divider
  - Dispatch log, three lines, mono 12, timestamp in `text-muted` then entry in `text`: "14:20 · SDMA UTTARAKHAND NOTIFIED" [confirm]; "14:23 · SDMA ACKNOWLEDGED"; "14:31 · CHAMOLI DM OFFICE NOTIFIED" [confirm]
- Status cascade, permitted one-shot: at the first upward crossing of p 0.970, after a 240ms hold, the seven entries (block, four figures, then the three log lines together) reveal with the standard text reveal at 80ms stagger. It never reverses on scroll back and never replays in the session. Below 0.970 on a fresh load the status content is absent, not hidden.
- HYDRA reveal, scrubbed, standard text reveal timing:
  - 0.972: label "04 / HYDRA" above the console, aligned to its left edge, 32px above the title bar.
  - 0.976: display (96px, uppercase) "HYDRA" directly beneath the label. Display sits on bg, no scrim.
  - 0.982: beneath the console strip, 32px gap: h2 (36px, sentence case, text-muted) "The flood will come. The warning can come first."
  - 0.986: body (16px) "Flood intelligence for the higher and mid Himalayas."
  - 0.990: button (outlined) "SEE HYDRA →". Horizontal rule motif 32px beneath.
- Rail fades out 0.98 to 1.00 as before.
- Transition: stage unpins. The console layer holds fixed for CONSOLE_HOLD viewport heights past the unpin (a flow spacer of the same distance keeps every following section clear of it), then releases to absolute positioning and scrolls away with the page, console, wordmark and caption together; the Feeds pin replaces this hold in a later round. From p 0.970 (the shrink's end) the canvas container is position fixed at the console layer, placed by the layer's measured map column rect and independent of the Hydra section, so a lagging scrub tick after the unpin cannot move the map. The composite still is captured as before at p 0.999 (decoded ahead of time, recaptured while hidden whenever a later tile refinement wave completes) but is no longer shown at the unpin: the live-to-still swap moves to the first feed transition in the Feeds section, executed while the Hydra feed is translating out of the map column, so it is never in view. Until the Feeds section exists, the still is shown only at the console release point, under the same overlapped handoff in both directions, triggered synchronously by the release evaluation itself (the same scroll-tick computation that flips the layer to absolute), where the incoming layer paints before the outgoing hides and a mid-handoff reversal cancels the pending hide. At the release the fixed canvas converts to the layer's absolute release offset so canvas and still scroll together through the handoff. The still is a composite: the canvas read plus the rasterised SVG instrument overlay (station marks and labels, catchment outline) with the mono face inlined, so the Scene 09 handoff is self-contained.
- Verify checkpoints: p 0.950, 0.960, 0.970, 0.975, 0.990, 1.000.

---

## Section: Command Center (pinned, horizontal scroll, 4 panels, bg)

### Scene 09, Command Center
- Scene: command_center.glb in React Three Fiber. Camera starts wide, moves into the room as panels advance. Matte materials, flat low lighting, no bloom. Screens are quads named SCREEN_L, SCREEN_C, SCREEN_R, replaced with live HTML via drei Html.
- Panel 1, wide shot. Label "05 / COMMAND CENTER". h1: "EVERY SIGNAL. ONE ROOM."
- Panel 2, camera on SCREEN_L: the Hydra flood map from Scene 07 as a monitoring view with the data panel.
- Panel 3, camera on SCREEN_C: a timeline of alerts, incidents and decisions, ticking. Status squares in ok / caution / alert.
- Panel 4, camera on SCREEN_R: map of India with dozens of `signal` points. The story widens from one river to a national operations layer. h1: "FROM ONE BASIN TO THE NATION."
- Transition: camera pulls back out of SCREEN_R; page returns to vertical scroll.

---

## Section: OpsVision (surface background, standard scroll)

### Scene 10
- Layout: text columns 1 to 5, product render columns 7 to 12 (16:9, 1px `line` border, no shadow).
- Label: "06 / OPSVISION"
- h2: "See everything that matters."
- Body: two short paragraphs. [confirm]
- Diagram: cameras / sensors / satellite feeds converging into one view. 1px lines in `line` and `signal`, 90° and 45° only.
- Button: "SEE OPSVISION →"

## Section: OpsMind (bg background)

### Scene 11
- Layout: render columns 1 to 6, text columns 8 to 12.
- Label: "07 / OPSMIND"
- h2: "From signal to decision."
- Diagram: signals in → reasoning → decisions out.
- Button: "SEE OPSMIND →"

## Section: OpsUnity (surface background)

### Scene 12
- Layout: full width, centred.
- Label: "08 / OPSUNITY"
- h2: "One operating layer."
- Diagram: Hydra, OpsVision, OpsMind as three nodes converging into one. This closes the argument: the products are one system.
- Button: "SEE OPSUNITY →"

---

## Section: Closing (bg, 100vh)

### Scene 13
- Frame: return to the Scene 01 image, Earth from orbit, night side, 40% exposure, overlaid with the `signal` points from Command Center Panel 4. The same 1px horizontal rule as Scene 00. The loop closes.
- Display: "INTELLIGENCE IS THE NEW INFRASTRUCTURE."
- Button: "TALK TO JSPARK →"
- Footer in micro: "JSPARK AI · Noida · vision@jspark.ai" [confirm] · nav links · Cesium credits.
- Made with: reuse the Cesium viewer at low exposure, or a captured still if performance demands.

---

## Mobile and reduced-motion fallback
- Hydra stage: scroll-scrubbed video of the desktop journey, ≤10 MB, recorded at Phase 8. Labels, headlines and data panel remain live HTML over the video.
- Command Center: one still per panel, vertical stack.
- All other sections: unchanged, single column.
