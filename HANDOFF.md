# JSPARK Website — Handoff / State (as of 03 Sep 2026)

Attach this alongside the repo's current PROJECT_CONTEXT.md and SCENES.md when starting a new chat. Those two files are the source of truth for design and scenes; this file carries conversation-level state and working rules that live outside them.

## Where the build stands
- Phases 1 to 6 complete. The Hydra stage is finished end to end with real Cesium terrain (Alaknanda / Chamoli, Uttarakhand), real OSM river geometry, Blender-scripted satellite and radar models, SVG-overlay instrument lines, shader rain, a terrain-clipped rising water surface, 14 ground-station marks with a state machine, and a load gate with real weighted progress.
- Scene 04 is locked (noted in SCENES.md). A regression script tools/verify-frames.js asserts canonical checkpoints; every change round must end with its pass/fail table.
- Working setup: Claude Code runs in D:\coding\jspark-website (one session at a time, never parallel sessions in the same folder). Dev server on localhost:5173. Blender is driven headless via scripts in tools/blender/ (never opened manually). Cesium ion token in .env.

## Approved but not yet built (Phase 7)
1. Scene 08 console reveal: at p 0.95 to 0.97 the full-bleed view shrinks into a framed console viewport (about 70% width, mono title bar "HYDRA · ALAKNANDA BASIN · LIVE"), the data panel migrates into the console chrome, and a right sidebar (about 30%) cascades in: FLOOD WARNING block (place, peak-in hours, time), figures (rainfall, expected discharge, river level, confidence), and a dispatch log (authority notified + acknowledged with timestamps). Then HYDRA reveals around the console. Zoom-out scrubs; sidebar entries cascade once as a permitted one-shot.
2. Scene 09 replaces the old Blender room / R3F Command Center plan entirely: the console persists and products switch as horizontal feeds inside the same frame, in order Command Center (alert timeline + national India map), OpsVision, OpsMind. Sidebar and wordmark swap per feed.
3. Scene 12 OpsUnity: the feeds tile into one view ("One operating layer"). Scene 13 closing returns to orbit with national points.

## Open items (blocking or pending)
- BLOCKER for Phase 7 content: one-line descriptions of Command Center, OpsVision, OpsMind, OpsUnity from the founder. Everything written for them so far is Claude's guess marked [confirm].
- Sidebar dispatch wording to be reviewed later (structure approved).
- Pacing verdict deferred: Hydra pin is 3600px; may drop to 3000 after a full slow scroll.
- Scene 00 load animations (rule drawing, letter-spacing settle) deferred to polish.
- Label de-collision + Chamoli "CHAMOLI · G-06" merge: prompt issued, confirm landed.
- Earth at Night: decided against, removed.

## Working rules established in the original chat
- SCENES.md is edited FIRST, then code; timings live in hydraTimings.js mirroring it. Claude Code reports deviations instead of silently retiming.
- Geography must be real: rivers/boundaries from OSM (Overpass), never hand-guessed. The drawn catchment is a stylised coverage zone scaled to the beam, mouth anchored to the real channel.
- Objects sized for legibility, not scale: hero 150 to 200 px, supporting 70 to 100 px, marks 8 to 12 px.
- Instruments draw lines, never cast light on terrain. No gradients/glow/bloom anywhere.
- Models: never minimumPixelSize; calibrate once at unit scale; verify transitions by continuous scrub with captured frames, not spot checks.
- Never use em or en dashes anywhere (site, code, docs). Ranges use "to".
- Two failed fixes on one symptom = switch approach, not a third fix. State the exit before starting a fix round.
- User approves compositions from frames (screenshots), and describes shots as "first I see X, then Y" — spec from the shot list.
- All verification at real scroll poses in fresh page loads; end every round with the verify-frames table.

## Suggested kickoff message for a new chat
"This is the JSPARK website build. Read the three attached files (PROJECT_CONTEXT.md, SCENES.md, HANDOFF.md). You act as technical director: you write prompts for Claude Code, review its reports and my screenshots against the spec, and flag deviations. We are working on [X]. Continue from the handoff state."
