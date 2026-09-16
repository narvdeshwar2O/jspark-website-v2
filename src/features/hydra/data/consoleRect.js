// Scene 08 console geometry, pure and deterministic so the chrome layer,
// the canvas transform, the panel migration and the verify harness all
// derive from one function. SCENES.md (Console geometry, fluid) is
// authoritative:
// - Row spans the viewport minus a side gutter of 1/12 viewport width,
//   capped at 1706; beyond the cap the row centres.
// - One console, single frame: 1px border, title bar across the full row,
//   map column left, status column right at 28% of the inner width, a 1px
//   divider between them, no gap. The strip runs beneath the map column
//   only; the status column runs from the title bar to the frame bottom.
// - Console total height is the vertical budget: viewport height minus
//   the label-plus-display block, the caption band and margins. The title
//   bar and strip are 2.5 and 3 line-heights of the label and data tokens
//   (mono line box, 1.0). Aspect is whatever results, no cap.
// - Short viewports (height below 1000) set the display in the h1 token,
//   use the single-row caption band and collapse margins to the 24 / 24 /
//   64 rhythm (24 top, 24 of inter gaps split 8 above and 16 below, 64
//   bottom). At or above 1000 the margins are 16 / 32 / 32 / 64.
// Composition is relative, detail is fixed: 1px, the 8px unit and 6px
// squares are the only fixed pixels.
export const REF_WIDTH = 1536
export const ROW_CAP = 1706

// same math as the fluid type tokens in tokens.css: floor 0.75x,
// preferred size/1536 of the viewport width rounded to whole pixels
// (round(..., 1px) in the CSS keeps glyph rasterisation stable), ceiling
// 1.5x
export const fluidSize = (px, vw) => Math.min(Math.max(px * 0.75, Math.round((px * vw) / REF_WIDTH)), px * 1.5)

// vw and vh are the LAYOUT viewport (documentElement client size); typeVw
// is the basis the CSS vw unit resolves against (window.innerWidth, which
// includes a classic scrollbar), so the computed type sizes match the
// rendered tokens exactly
export function consoleRect(vw, vh, typeVw = vw) {
  const short = vh < 1000
  const label = fluidSize(12, typeVw)
  const data = fluidSize(14, typeVw)
  const h2 = fluidSize(36, typeVw)
  const body = fluidSize(16, typeVw)
  const displaySize = short ? fluidSize(56, typeVw) : fluidSize(96, typeVw)

  const gutter = vw / 12
  const rowW = Math.round(Math.min(vw - 2 * gutter, ROW_CAP))
  const rowX = Math.round((vw - rowW) / 2)

  const titleH = Math.round(2.5 * label)
  const stripH = Math.round(3 * data)

  // block budgets estimated from the tokens they are set in; the chrome
  // anchors the real text blocks to the rect edges, so drift lands in the
  // outer margins, never inside the console
  const aboveH = Math.round(label * 1.5 + 8 + displaySize * (short ? 1.05 : 0.95))
  const buttonH = Math.round(label * 1.2 + 28)
  const captionH = short
    ? Math.round(Math.max(h2 * 1.2, buttonH) + 32 + 1) // one-row band plus the rule
    : Math.round(h2 * 1.2 + 8 + body * 1.5 + 16 + buttonH + 32 + 1)
  const m = short
    ? { top: 24, gapAbove: 8, gapBelow: 16, bottom: 64 }
    : { top: 16, gapAbove: 32, gapBelow: 32, bottom: 64 }

  // single frame: 1px border all around, title bar across the full inner
  // width, then map column, 1px divider, status column
  const frameH = vh - m.top - aboveH - m.gapAbove - m.gapBelow - captionH - m.bottom
  const frameY = m.top + aboveH + m.gapAbove
  const innerW = rowW - 2
  const innerH = frameH - 2
  
  const isStacked = vw < 900
  let mapW, mapH, statusW, statusH, statusX, statusY, stripW

  if (isStacked) {
    statusW = innerW
    statusX = rowX + 1
    mapW = innerW
    mapH = Math.round((innerH - titleH - stripH) * 0.55) // Map gets 55% of visual area
    stripW = innerW
    statusY = frameY + 1 + titleH + mapH + stripH + 1
    statusH = innerH - titleH - mapH - stripH - 1
  } else {
    const minStatusW = 200
    statusW = Math.max(Math.round(innerW * 0.28), Math.min(minStatusW, innerW * 0.45))
    statusX = rowX + 1 + innerW - statusW
    mapW = innerW - statusW - 1
    mapH = innerH - titleH - stripH
    stripW = mapW
    statusY = frameY + 1 + titleH
    statusH = innerH - titleH
  }

  return {
    vw,
    vh,
    short,
    isStacked,
    rowX,
    rowW,
    frameX: rowX,
    frameY,
    frameW: rowW,
    frameH,
    x: rowX + 1,
    y: frameY + 1,
    w: mapW,
    h: mapH,
    titleH,
    stripH,
    stripW,
    blockH: frameH,
    statusX,
    statusY,
    statusW,
    statusH,
    top: m.top,
    gapAbove: m.gapAbove,
    gapBelow: m.gapBelow,
    bottom: m.bottom,
    aspect: mapW / mapH,
    coverScale: Math.max(mapW / vw, mapH / vh),
    sizes: {
      label,
      data,
      dataMd: fluidSize(24, typeVw),
      dataLg: fluidSize(32, typeVw),
      display: displaySize,
      h2,
      body,
    },
  }
}
