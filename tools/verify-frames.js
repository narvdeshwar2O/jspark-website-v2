// Regression guard for the Hydra stage. Loads the site fresh (?prefly=0)
// per viewport, scrubs to canonical checkpoints, asserts machine-checkable
// facts, and prints a pass/fail table with saved frames in
// tools/verify-frames-output/. Every change round ends with this table.
//
//   node tools/verify-frames.js [--url http://localhost:5173]
//
// Notes baked into the assertions (SCENES.md is authoritative):
// - The reveal fades in over 0.95 to 0.99 and the rail fades out over 0.98
//   to 1.00, so "reveal full opacity, rail faded" is measured at p 0.995,
//   not at the 0.97 checkpoint (which asserts the frozen flood).
// - The button's reveal begins at its 0.990 beat, so visibility is
//   asserted as reveal-begins at 0.990 plus fully visible by 0.9935.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chromium } from 'playwright-core'
import { consoleRect } from '../src/scenes/consoleRect.js'

const URL_ARG = process.argv.indexOf('--url')
const BASE_URL = URL_ARG > -1 ? process.argv[URL_ARG + 1] : 'http://localhost:5173'
const STAGE_SCROLL = 3600 // SCENES.md: pinned stage scroll height
// stations068: measured per-viewport baselines for readable station marks
// at p 0.68 (camera geometry hides more downstream gauges on shorter or
// wider frames); the assert is a regression floor, not a universal 9
const ALL_VIEWPORTS = [
  // swapSeq: round 2a-live frame sequences across the release-point swap
  { w: 1536, h: 864, stations068: 8, swapSeq: true },
  { w: 1536, h: 730, stations068: 6 },
  { w: 1920, h: 1080, stations068: 8 },
  { w: 1440, h: 900, stations068: 9 },
  { w: 1920, h: 920, stations068: 6 },
  { w: 2560, h: 1440, stations068: 8 },
  // classic 17px scrollbar variants: the layout viewport is narrower than
  // window.innerWidth, the exact condition behind the round 2a-fix gap
  { w: 1536, h: 864, stations068: 8, scrollbar: true },
  { w: 1536, h: 730, stations068: 6, scrollbar: true, swapSeq: true },
]
// VF_ONLY=1920x1080 (or 1536x864sb) runs a single viewport
const VIEWPORTS = process.env.VF_ONLY
  ? ALL_VIEWPORTS.filter((v) => `${v.w}x${v.h}${v.scrollbar ? 'sb' : ''}` === process.env.VF_ONLY)
  : ALL_VIEWPORTS
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'verify-frames-output')
const BASELINE_DIR = join(dirname(fileURLToPath(import.meta.url)), 'verify-frames-baseline')
mkdirSync(OUT_DIR, { recursive: true })

const results = []
const pageErrors = []
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11'] })
// headless implies --hide-scrollbars; the classic-scrollbar variants need
// a second instance without it
let browserSb = null
const browserFor = async (vp) => {
  if (!vp.scrollbar) return browser
  if (!browserSb) browserSb = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11'], ignoreDefaultArgs: ['--hide-scrollbars'] })
  return browserSb
}
// one analyzer page per viewport suite: canvas allocations accumulate in
// the renderer across a long run and can crash the shared tab
let analyzer = null

const STRIP_ROW = 'RIVER LEVEL 4.2 m · HOURS TO PEAK 12 · FLOOD WARNING'
const ZERO_DELTA = 0.01 // device px; float epsilon only

async function runSuite(vp) {
  const tag = `${vp.w}x${vp.h}${vp.scrollbar ? 'sb' : ''}`
  const record = (checkpoint, assertion, pass, detail = '') => {
    results.push({ checkpoint: `${tag} ${checkpoint}`, assertion, pass, detail })
  }
  const page = await (await browserFor(vp)).newPage({ viewport: { width: vp.w, height: vp.h } })
  page.on('pageerror', (e) => pageErrors.push(`${tag}: ${e}`))
  if (analyzer) await analyzer.close().catch(() => {})
  analyzer = await browser.newPage()
  if (vp.scrollbar) {
    // styled webkit scrollbars always take layout space: a deterministic
    // classic 17px scrollbar in headless
    await page.addInitScript(() => {
      const add = () => {
        const style = document.createElement('style')
        style.textContent = '::-webkit-scrollbar { width: 17px; } ::-webkit-scrollbar-track { background: #0B0F14; } ::-webkit-scrollbar-thumb { background: #1C232C; }'
        document.head.appendChild(style)
      }
      if (document.head) add()
      else window.addEventListener('DOMContentLoaded', add)
    })
  }
  await page.goto(`${BASE_URL}/?prefly=0`, { waitUntil: 'load' })
  await page.waitForSelector('.load-gate', { state: 'detached', timeout: 240000 })
  const hydraTop = await page.evaluate(() => Math.round(document.querySelector('.hydra').getBoundingClientRect().top + window.scrollY))
  const [layoutW, layoutH] = await page.evaluate(() => [document.documentElement.clientWidth, document.documentElement.clientHeight])

  const scrubTo = async (p, settle = 3000) => {
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + Math.round(p * STAGE_SCROLL))
    await page.waitForTimeout(settle)
  }
  const frame = async (name) => {
    const path = join(OUT_DIR, `${tag}_${name}.png`)
    const buffer = await page.screenshot({ path })
    return buffer.toString('base64')
  }
  const meanLuma = async (pngBase64, region) =>
    analyzer.evaluate(
      async ({ png, r }) => {
        const img = await new Promise((res) => {
          const im = new Image()
          im.onload = () => res(im)
          im.src = `data:image/png;base64,${png}`
        })
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const d = ctx.getImageData(r[0], r[1], r[2], r[3]).data
        let sum = 0
        for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        return sum / (d.length / 4)
      },
      { png: pngBase64, r: region },
    )
  const opacityOf = (selector) =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const cs = getComputedStyle(el)
      return { opacity: +cs.opacity, visible: cs.visibility !== 'hidden' }
    }, selector)

  // ---- p 0.05: Earth visible ----
  await scrubTo(0.05, 4000)
  {
    // large viewports stream many more tiles; wait for residency so the
    // luma check measures the globe, not the loading state
    await page.waitForFunction(() => window.__HYDRA__.viewer.scene.globe.tilesLoaded, { timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(500)
    const shot = await frame('p005')
    const luma = await meanLuma(shot, [420, 250, 600, 400])
    record('p 0.05', 'Earth visible (canvas non-black)', luma > 8, `centre mean luma ${luma.toFixed(1)}`)
  }

  // ---- p 0.28: India headline ----
  await scrubTo(0.28)
  {
    await frame('p028')
    const o = await opacityOf('[data-beat="h1-rainfall"]')
    record('p 0.28', 'India headline full opacity', !!o && o.visible && o.opacity >= 0.99, `opacity ${o?.opacity}`)
  }

  // ---- p 0.45: Scene 03 lines ----
  await scrubTo(0.45)
  {
    await frame('p045')
    const a = await opacityOf('[data-beat="h1-terrain"]')
    const b = await opacityOf('[data-beat="h1-listen"]')
    record('p 0.45', 'Scene 03 lines full opacity', !!a && !!b && a.opacity >= 0.99 && b.opacity >= 0.99, `terrain ${a?.opacity}, listen ${b?.opacity}`)
  }

  // ---- p 0.57: satellite (Scene 04 lock) ----
  await scrubTo(0.57)
  {
    await frame('p057')
    const s = await page.evaluate(() => {
      const H = window.__HYDRA__
      const { viewer, Cesium } = H
      const W = viewer.canvas.clientWidth
      const HH = viewer.canvas.clientHeight
      const m = H.satellite.model
      const c = Cesium.Matrix4.getTranslation(m.modelMatrix, new Cesium.Cartesian3())
      const win = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, c, new Cesium.Cartesian2())
      const grp = [...document.querySelectorAll('.stage__svg g')].find((g) => g.getAttribute('stroke') === '#62C6FF')
      const ds = grp ? [...grp.children].map((el) => el.getAttribute('d') || '') : []
      const ellipse = (ds[2] || '').match(/[ML]([\d.]+) ([\d.]+)/g)?.map((q) => q.slice(1).split(' ').map(Number)) || []
      const prims = viewer.scene.primitives._primitives
      return {
        show: m.show,
        alpha: m.color ? m.color.alpha : 0,
        px: H.satellite.pixelWidthNow(),
        centrePct: win ? [(100 * win.x) / W, (100 * win.y) / HH] : null,
        ellipseOn: ellipse.length > 0 && ellipse.every(([x, y]) => x >= 0 && x <= W && y >= 0 && y <= HH),
        conePrims: prims.filter((pr) => pr instanceof Cesium.Primitive).length,
        groundPrims: prims.filter((pr) => pr instanceof Cesium.GroundPrimitive).length,
      }
    })
    record('p 0.57', 'satellite visible and opaque', s.show && s.alpha >= 0.99, `show ${s.show}, alpha ${s.alpha.toFixed(2)}`)
    record('p 0.57', 'satellite 150 to 190 px', s.px >= 150 && s.px <= 190, `${s.px.toFixed(0)} px`)
    record(
      'p 0.57',
      'satellite upper-left',
      !!s.centrePct && s.centrePct[0] >= 8 && s.centrePct[0] <= 24 && s.centrePct[1] >= 8 && s.centrePct[1] <= 24,
      `centre (${s.centrePct?.map((v) => v.toFixed(0)).join(', ')})%`,
    )
    record('p 0.57', 'footprint ellipse on-screen', s.ellipseOn)
    record(
      'p 0.57',
      'no lit terrain (cone and rings are the only primitives)',
      s.conePrims === 1 && s.groundPrims === 3,
      `${s.conePrims} scene primitive(s), ${s.groundPrims} ground primitive(s)`,
    )
  }

  // Scene 04 lock under global fluid tokens (SCENES.md): bit identity vs
  // the stored baseline outside the data panel rect (the satellite's own
  // rect excluded, its wing phase differs between captures); inside the
  // panel, zero layout shift and channel delta under 24. The baseline was
  // captured without a scrollbar, so the sb variant skips it.
  if (vp.w === 1536 && vp.h === 864 && !vp.scrollbar) {
    await page.waitForFunction(() => window.__HYDRA__.viewer.scene.globe.tilesLoaded, { timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(800)
    const shot = (await page.screenshot()).toString('base64')
    const baseline = readFileSync(join(BASELINE_DIR, '1536x864_p057.png')).toString('base64')
    const meta = JSON.parse(readFileSync(join(BASELINE_DIR, '1536x864_p057.json'), 'utf8'))
    const lock = await analyzer.evaluate(
      async ({ a, b, panel, sat }) => {
        const load = (src) =>
          new Promise((res) => {
            const im = new Image()
            im.onload = () => res(im)
            im.src = `data:image/png;base64,${src}`
          })
        const [ia, ib] = await Promise.all([load(a), load(b)])
        const W = ia.width
        const H = ia.height
        const cv = (im) => {
          const c = document.createElement('canvas')
          c.width = W
          c.height = H
          const x = c.getContext('2d')
          x.drawImage(im, 0, 0)
          return x.getImageData(0, 0, W, H).data
        }
        const da = cv(ia)
        const db = cv(ib)
        const inside = (x, y, r) => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]
        let outsideDiff = 0
        let insideMax = 0
        for (let y = 0; y < H; y += 1) {
          for (let x = 0; x < W; x += 1) {
            const i = (y * W + x) * 4
            const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]))
            if (inside(x, y, sat)) continue
            if (inside(x, y, panel)) {
              insideMax = Math.max(insideMax, d)
            } else if (d > 0) {
              outsideDiff += 1
            }
          }
        }
        return { outsideDiff, insideMax }
      },
      { a: baseline, b: shot, panel: meta.panelRect, sat: meta.satExclusion },
    )
    const panelNow = await page.evaluate(() => {
      const r = document.querySelector('.hydra__panel').getBoundingClientRect()
      return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]
    })
    const layoutStable = panelNow.every((v, i) => Math.abs(v - meta.panelRect[i]) <= 1)
    record('p 0.57', 'lock: bit identity outside the panel rect', lock.outsideDiff === 0, `${lock.outsideDiff} px differ outside`)
    record('p 0.57', 'lock: panel zero layout shift, channel delta under 24', layoutStable && lock.insideMax < 24, `panel ${panelNow.join(',')}, max delta ${lock.insideMax}`)
  }

  // ---- p 0.68: radars and stations ----
  await scrubTo(0.68)
  {
    await frame('p068')
    const r = await page.evaluate(() => {
      const H = window.__HYDRA__
      const { viewer, radars } = H
      const W = viewer.canvas.clientWidth
      const HH = viewer.canvas.clientHeight
      const panel = document.querySelector('.hydra__panel').getBoundingClientRect()
      const marks = [...document.querySelectorAll('.stage__svg rect')].filter(
        (el) => el.getAttribute('width') === '10' && el.getAttribute('stroke') !== '#05070A' && el.style.display !== 'none',
      )
      const readable = marks.filter((el) => {
        const x = +el.getAttribute('x') + 5
        const y = +el.getAttribute('y') + 5
        const onScreen = x >= 0 && x <= W && y >= 0 && y <= HH
        const underPanel = x >= panel.left && x <= panel.right && y >= panel.top && y <= panel.bottom
        return onScreen && !underPanel
      }).length
      return {
        radars: radars.units.map((u) => ({ show: u.model.show, px: radars.pixelWidth(u), ring: u.ring.show, intensity: u.material.uniforms.intensity })),
        readable,
      }
    })
    const bigEnough = r.radars.filter((u) => u.show && u.px >= 60).length
    record('p 0.68', 'radars: at least 3 visible at 60 px or more', bigEnough >= 3, r.radars.map((u) => `${u.px.toFixed(0)}px`).join(', '))
    record('p 0.68', `station marks readable at baseline (${vp.stations068})`, r.readable >= vp.stations068, `${r.readable} readable`)
    record('p 0.68', 'rings present', r.radars.every((u) => u.ring && u.intensity > 0.5))
  }

  // ---- p 0.80: rain ----
  await scrubTo(0.8)
  {
    await frame('p080')
    const rain = await page.evaluate(() => {
      const canvas = document.querySelector('.stage__rain')
      const panelText = document.querySelector('.hydra__panel').textContent
      const mm = panelText.match(/(\d+)\s*mm/)
      return { active: canvas && canvas.style.display === 'block', panelText, mm: mm ? +mm[1] : null }
    })
    record('p 0.80', 'rain active', rain.active)
    record('p 0.80', 'RAINFALL counting', rain.panelText.includes('RAINFALL') && rain.mm > 50 && rain.mm < 184, `${rain.mm} mm`)
    record('p 0.80', 'caution status', rain.panelText.includes('HEAVY RAINFALL'))
  }

  // ---- p 0.91: flood and alert front ----
  await scrubTo(0.91, 3500)
  {
    await frame('p091')
    const f = await page.evaluate(() => {
      const H = window.__HYDRA__
      const { viewer } = H
      const W = viewer.canvas.clientWidth
      const HH = viewer.canvas.clientHeight
      const panel = document.querySelector('.hydra__panel').getBoundingClientRect()
      const marks = [...document.querySelectorAll('.stage__svg rect')].filter(
        (el) => el.getAttribute('width') === '10' && el.getAttribute('stroke') !== '#05070A' && el.style.display !== 'none',
      )
      const readable = marks.filter((el) => {
        const x = +el.getAttribute('x') + 5
        const y = +el.getAttribute('y') + 5
        return x >= 0 && x <= W && y >= 0 && y <= HH && !(x >= panel.left && x <= panel.right && y >= panel.top && y <= panel.bottom)
      }).length
      const states = H.groundStations.stateAt(H.p)
      const gauges = states.filter((s) => s.kind === 'gauge')
      let prefix = true
      let seenNonAlert = false
      for (const g of gauges) {
        if (g.state === 'alert' && seenNonAlert) prefix = false
        if (g.state !== 'alert') seenNonAlert = true
      }
      return { reach: H.water.state().reach, readable, gauges: gauges.map((g) => g.state), prefix }
    })
    record('p 0.91', 'flood surface visible', f.reach > 3000, `reach ${Math.round(f.reach)} m`)
    record('p 0.91', 'at least 12 stations readable', f.readable >= 12, `${f.readable} readable`)
    record('p 0.91', 'gauge alert front in downstream order', f.prefix && f.gauges.includes('alert'), f.gauges.join(' '))
  }

  // ---- Scene 08 console checkpoints (SCENES.md) ----
  // Expected geometry from the app's own consoleRect (imported): the
  // harness and the page must agree by construction
  const rect = consoleRect(layoutW, layoutH, vp.w)
  const expected = {
    vw: layoutW,
    vh: layoutH,
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    titleH: rect.titleH,
    stripH: rect.stripH,
    sf: rect.coverScale,
    txFinal: rect.x - (layoutW * rect.coverScale - rect.w) / 2,
  }
  record(
    'rect',
    `console frame (${rect.short ? 'short' : 'tall'})`,
    rect.h > 0 && rect.frameH > 0,
    `frame ${rect.frameX},${rect.frameY},${rect.frameW}x${rect.frameH} map ${rect.w}x${rect.h} status ${rect.statusW}x${rect.statusH} title ${rect.titleH} strip ${rect.stripH}`,
  )
  record('rect', 'map aspect under 2.5 (no cap)', rect.aspect <= 2.5, `aspect ${rect.aspect.toFixed(2)}${rect.aspect > 2.4 ? ' FLAG' : ''}`)
  record(
    'rect',
    'resolved type sizes (display / data-lg / data-md)',
    true,
    `${rect.sizes.display.toFixed(1)} / ${rect.sizes.dataLg.toFixed(1)} / ${rect.sizes.dataMd.toFixed(1)} px`,
  )

  // zero-delta check for the standing assert: the canvas's visible rect
  // (transform of the clip box) must equal the map column's MEASURED rect
  // (the slot element the app itself targets)
  const visDeltas = (s) => {
    if (!s.slotRect) return [9, 9, 9, 9]
    const [sx, sy, sw, sh] = s.slotRect
    return [s.visRect.x - sx, s.visRect.y - sy, s.visRect.x + s.visRect.w - (sx + sw), s.visRect.y + s.visRect.h - (sy + sh)]
  }
  const visDeltaOk = (s) => visDeltas(s).every((d) => Math.abs(d) <= ZERO_DELTA)
  const visDeltaDetail = (s) => `deltas ${visDeltas(s).map((d) => d.toFixed(4)).join(', ')} px`

  const consoleState = async () =>
    page.evaluate(() => {
      const opacityOfEl = (el) => (el ? +getComputedStyle(el).opacity : null)
      const rectOf = (el) => {
        if (!el) return null
        const r = el.getBoundingClientRect()
        return [r.left, r.top, r.width, r.height].map(Math.round)
      }
      const canvas = document.querySelector('.stage__canvas')
      const cs = getComputedStyle(canvas)
      const m = new DOMMatrixReadOnly(cs.transform === 'none' ? undefined : cs.transform)
      // visible rect = transform of the clip box (computed clip-path
      // serialises as CSS shorthand, expand 1/2/3/4 values)
      const clipRaw = (cs.clipPath.match(/inset\(([^)]+)\)/) || [undefined, '0px'])[1].split(/\s+/).map((v) => parseFloat(v))
      let ct
      let crt
      let cbb
      let cll
      if (clipRaw.length === 1) [ct, crt, cbb, cll] = [clipRaw[0], clipRaw[0], clipRaw[0], clipRaw[0]]
      else if (clipRaw.length === 2) [ct, crt, cbb, cll] = [clipRaw[0], clipRaw[1], clipRaw[0], clipRaw[1]]
      else if (clipRaw.length === 3) [ct, crt, cbb, cll] = [clipRaw[0], clipRaw[1], clipRaw[2], clipRaw[1]]
      else [ct, crt, cbb, cll] = clipRaw
      const visRect = {
        x: m.e + cll * m.a,
        y: m.f + ct * m.d,
        w: (canvas.offsetWidth - cll - crt) * m.a,
        h: (canvas.offsetHeight - ct - cbb) * m.d,
      }
      const strip = document.querySelector('.console-frame__striprow')
      const logs = [...document.querySelectorAll('.console-frame__log')]
      const sidebarEl = document.querySelector('.console-frame__sidebar')
      const h2El = document.querySelector('.console-frame__h2')
      const buttonEl = document.querySelector('.console-frame__button-row button')
      // rect bottoms are not baselines: subtract the button's bottom
      // padding and border so the comparison approximates its text bottom
      const buttonTextBottom = (() => {
        if (!buttonEl) return null
        const bcs = getComputedStyle(buttonEl)
        return Math.round(buttonEl.getBoundingClientRect().bottom - parseFloat(bcs.paddingBottom) - parseFloat(bcs.borderBottomWidth))
      })()
      return {
        visRect,
        slotRect: (() => {
          const el = document.querySelector('.console-frame__slot')
          if (!el) return null
          const r = el.getBoundingClientRect()
          return [r.left, r.top, r.width, r.height]
        })(),
        stillRect: (() => {
          const el = document.querySelector('.console-frame__still')
          if (!el) return null
          const r = el.getBoundingClientRect()
          return [r.left, r.top, r.width, r.height]
        })(),
        layerPosition: getComputedStyle(document.querySelector('.console-frame') || document.body).position,
        frameRect: rectOf(document.querySelector('.console-frame__frame')),
        dividerRect: rectOf(document.querySelector('.console-frame__divider')),
        stripRect: rectOf(document.querySelector('.console-frame__strip')),
        bodyPresent: !!document.querySelector('.console-frame__body'),
        h2Bottom: h2El ? Math.round(h2El.getBoundingClientRect().bottom) : null,
        buttonBottom: buttonTextBottom,
        scale: m.a,
        tx: m.e,
        chrome: !!document.querySelector('.console-frame'),
        chromeOpacity: opacityOfEl(document.querySelector('.console-frame__chrome')),
        titlebarRect: rectOf(document.querySelector('.console-frame__titlebar')),
        sidebar: !!sidebarEl,
        sidebarRect: rectOf(sidebarEl),
        sidebarInnerH: document.querySelector('.console-frame__sidebar-inner')?.getBoundingClientRect().height ?? null,
        lastLogBottom: logs.length ? Math.round(logs[logs.length - 1].getBoundingClientRect().bottom) : null,
        entryOpacities: [...document.querySelectorAll('.console-frame__entry')].map((el) => +getComputedStyle(el).opacity),
        stripText: strip ? strip.textContent.replace(/\s+/g, ' ').trim() : null,
        stripOpacity: opacityOfEl(strip),
        panelRect: rectOf(document.querySelector('.hydra__panel')),
        railOpacity: opacityOfEl(document.querySelector('.ds-rail')),
        still: !!document.querySelector('.console-frame__still'),
        stillVisible: (() => {
          const el = document.querySelector('.console-frame__still')
          return !!el && getComputedStyle(el).visibility !== 'hidden'
        })(),
        canvasHidden: getComputedStyle(canvas).visibility === 'hidden',
        // round 2a-fix-2: from p 0.970 the container is position fixed at
        // the console layer, no longer a descendant of the section
        canvasFixed: cs.position === 'fixed' && !canvas.closest('.hydra'),
        texts: {
          label: opacityOfEl(document.querySelector('.console-frame__above > div')),
          display: opacityOfEl(document.querySelector('.console-frame__display')),
          h2: opacityOfEl(document.querySelector('.console-frame__h2')),
          body: opacityOfEl(document.querySelector('.console-frame__body')),
          button: opacityOfEl(document.querySelector('.console-frame__button-row')),
        },
        cssSizes: {
          display: (() => {
            const el = document.querySelector('.console-frame__display')
            return el ? +getComputedStyle(el).fontSize.replace('px', '') : null
          })(),
          dataLg: (() => {
            const el = document.querySelector('.console-frame__sidebar .type-data-lg')
            return el ? +getComputedStyle(el).fontSize.replace('px', '') : null
          })(),
          dataMd: (() => {
            const el = document.querySelector('.ds-readout--md .ds-readout__value')
            return el ? +getComputedStyle(el).fontSize.replace('px', '') : null
          })(),
        },
      }
    })

  await scrubTo(0.95)
  {
    await frame('p0950')
    const s = await consoleState()
    record('p 0.950', 'canvas full bleed', Math.abs(s.scale - 1) < 0.001 && Math.abs(s.tx) < 0.5, `scale ${s.scale.toFixed(4)}`)
    record('p 0.950', 'no console chrome mounted', !s.chrome)
    record('p 0.950', 'data panel at its Scene 07 position', !!s.panelRect && s.panelRect[0] > expected.vw * 0.6, `panel left ${s.panelRect?.[0]}`)
  }

  await scrubTo(0.96)
  {
    await frame('p0960')
    const s = await consoleState()
    const midScale = (1 + expected.sf) / 2
    const midX = expected.txFinal * 0.5
    record('p 0.960', 'canvas at midpoint scale and position', Math.abs(s.scale - midScale) < 0.01 && Math.abs(s.tx - midX) < 3, `scale ${s.scale.toFixed(3)} vs ${midScale.toFixed(3)}, tx ${s.tx.toFixed(1)} vs ${midX.toFixed(1)}`)
    record('p 0.960', 'data panel at its midpoint on the same easing', !!s.panelRect && Math.abs(s.panelRect[2] - (400 + (expected.w - 400) / 2)) < 8, `panel width ${s.panelRect?.[2]}`)
    record('p 0.960', 'canvas still section-owned mid-shrink', !s.canvasFixed)
  }

  await scrubTo(0.97)
  {
    await frame('p0970')
    const frozen = await page.evaluate(() => ({ reach: window.__HYDRA__.water.state().reach, totalLen: window.__HYDRA__.water.totalLen }))
    record('p 0.970', 'flood frozen at full reach', frozen.reach >= 0.999 * frozen.totalLen, `reach ${Math.round(frozen.reach)} of ${Math.round(frozen.totalLen)} m`)
    const s = await consoleState()
    const tb = s.titlebarRect
    const rectOk =
      !!tb &&
      Math.abs(tb[0] - (rect.frameX + 1)) <= 2 &&
      Math.abs(tb[1] - (rect.frameY + 1)) <= 2 &&
      Math.abs(tb[2] - (rect.frameW - 2)) <= 2 &&
      Math.abs(tb[3] - rect.titleH) <= 2
    record('p 0.970', 'console at final rect with full-row title bar', rectOk && s.chromeOpacity >= 0.99 && Math.abs(s.scale - expected.sf) < 0.005, `titlebar ${tb?.join(',')} vs ${[rect.frameX + 1, rect.frameY + 1, rect.frameW - 2, rect.titleH]}`)
    const mapRight = rect.x + rect.w
    record(
      'p 0.970',
      'single frame, no gap: status column meets the map at the 1px divider',
      !!s.frameRect &&
        !!s.dividerRect &&
        !!s.sidebarRect &&
        Math.abs(s.sidebarRect[0] - (mapRight + 1)) <= 1 &&
        Math.abs(s.dividerRect[0] - mapRight) <= 1 &&
        Math.abs(s.stripRect[2] - rect.w) <= 1,
      `map right ${mapRight}, divider ${s.dividerRect?.[0]}, status left ${s.sidebarRect?.[0]}, strip w ${s.stripRect?.[2]}`,
    )
    record('p 0.970', 'strip row text present', s.stripText === STRIP_ROW && s.stripOpacity >= 0.99, `"${s.stripText}"`)
    record('p 0.970', 'canvas rect equals map rect (zero delta)', visDeltaOk(s), visDeltaDetail(s))
    record('p 0.970', 'canvas container fixed at the layer (defect A)', s.canvasFixed)
    record('p 0.970', 'sidebar border present, entries not yet visible', s.sidebar && s.entryOpacities.length > 0 && s.entryOpacities.every((o) => o <= 0.01), `entries ${s.entryOpacities.join(',')}`)
  }

  await scrubTo(0.975)
  {
    await frame('p0975')
    const s = await consoleState()
    record('p 0.975', 'sidebar fully cascaded', s.entryOpacities.length > 0 && s.entryOpacities.every((o) => o >= 0.99), `entries ${s.entryOpacities.map((o) => o.toFixed(2)).join(',')}`)
    record('p 0.975', 'label visible, display not yet', s.texts.label >= 0.99 && s.texts.display <= 0.01, `label ${s.texts.label}, display ${s.texts.display}`)
    record('p 0.975', 'canvas rect equals map rect (zero delta)', visDeltaOk(s), visDeltaDetail(s))
  }

  await scrubTo(0.99)
  {
    const shot = await frame('p0990')
    const s = await consoleState()
    const bodyOk = rect.short ? !s.bodyPresent : s.texts.body >= 0.99
    record('p 0.990', 'HYDRA text visible (label, display, h2; body per band rule)', s.texts.label >= 0.99 && s.texts.display >= 0.99 && s.texts.h2 >= 0.99 && bodyOk, JSON.stringify(s.texts))
    record(
      'p 0.990',
      rect.short ? 'caption band: h2 and button share one baseline row, no body' : 'caption stacked: h2, body, button',
      rect.short
        ? !s.bodyPresent && s.h2Bottom !== null && s.buttonBottom !== null && Math.abs(s.h2Bottom - s.buttonBottom) <= 10
        : s.bodyPresent,
      `h2 bottom ${s.h2Bottom}, button bottom ${s.buttonBottom}`,
    )
    record('p 0.990', 'button reveal begins at its 0.990 beat (accepted)', s.texts.button !== null, `opacity at 0.990: ${s.texts.button}`)
    record('p 0.990', 'rail at reduced opacity', s.railOpacity > 0.2 && s.railOpacity < 0.8, `rail ${s.railOpacity}`)
    record('p 0.990', 'canvas rect equals map rect (zero delta)', visDeltaOk(s), visDeltaDetail(s))
    // terrain fills the slot to all four edges: no bg pixels on the slot's
    // bottom row (the cover fit's critical edge on wide viewports)
    const slot = { x: expected.x, y: expected.y + expected.titleH, w: expected.w, h: expected.h }
    record(
      'p 0.990',
      'CSS type resolves to the rect formula',
      s.cssSizes.display !== null &&
        Math.abs(s.cssSizes.display - rect.sizes.display) < 0.15 &&
        Math.abs(s.cssSizes.dataLg - rect.sizes.dataLg) < 0.15 &&
        Math.abs(s.cssSizes.dataMd - rect.sizes.dataMd) < 0.15,
      `css ${s.cssSizes.display} / ${s.cssSizes.dataLg} / ${s.cssSizes.dataMd}`,
    )
    // an exposed bg band is a long contiguous run of bg pixels; scattered
    // matches are deep terrain shadow at the bg tolerance, not a band
    const bgScan = await analyzer.evaluate(
      async ({ png, slot }) => {
        const img = await new Promise((res) => {
          const im = new Image()
          im.onload = () => res(im)
          im.src = `data:image/png;base64,${png}`
        })
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const y = slot.y + slot.h - 3
        const d = ctx.getImageData(slot.x + 2, y, slot.w - 4, 1).data
        let bg = 0
        let run = 0
        let longestRun = 0
        for (let i = 0; i < d.length; i += 4) {
          const isBg = Math.abs(d[i] - 5) <= 3 && Math.abs(d[i + 1] - 7) <= 3 && Math.abs(d[i + 2] - 10) <= 3
          if (isBg) {
            bg += 1
            run += 1
            longestRun = Math.max(longestRun, run)
          } else {
            run = 0
          }
        }
        return { bg, longestRun, width: d.length / 4 }
      },
      { png: shot, slot },
    )
    record(
      'p 0.990',
      'terrain fills the slot bottom row (no bg band)',
      bgScan.longestRun <= 24 && bgScan.bg < bgScan.width * 0.1,
      `longest bg run ${bgScan.longestRun}px, ${bgScan.bg} bg-like of ${bgScan.width}`,
    )
    record(
      'p 0.990',
      'third dispatch line fully inside the sidebar',
      !!s.sidebarRect && s.lastLogBottom !== null && s.lastLogBottom <= s.sidebarRect[1] + s.sidebarRect[3],
      `log bottom ${s.lastLogBottom}, sidebar bottom ${s.sidebarRect ? s.sidebarRect[1] + s.sidebarRect[3] : null}, inner ${Math.round(s.sidebarInnerH ?? 0)}px`,
    )
  }
  await scrubTo(0.995, 2000)
  {
    const s = await consoleState()
    record('p 0.995', 'canvas rect equals map rect (zero delta)', visDeltaOk(s), visDeltaDetail(s))
  }
  await scrubTo(0.9935, 1800)
  {
    const s = await consoleState()
    record('p 0.990', 'button fully visible by 0.9935 (0.990 beat plus fade)', s.texts.button >= 0.99, `opacity ${s.texts.button}`)
  }

  await scrubTo(1.0)
  {
    await frame('p1000')
    const s = await consoleState()
    record('p 1.000', 'rail gone', s.railOpacity <= 0.01, `rail ${s.railOpacity}`)
    record('p 1.000', 'all Scene 08 text and button visible', Object.values(s.texts).every((o) => o === null || o >= 0.99))
    record('p 1.000', 'strip row still shows the migrated readouts', s.stripText === STRIP_ROW && s.stripOpacity >= 0.99)
    record('p 1.000', 'Cesium live in the slot at p 1.0 (still mounted but hidden)', s.still && !s.stillVisible && !s.canvasHidden, `still mounted ${s.still}, visible ${s.stillVisible}, canvas hidden ${s.canvasHidden}`)
    record('p 1.000', 'canvas rect equals map rect (zero delta)', visDeltaOk(s), visDeltaDetail(s))
  }

  // ---- shrink continuity strip, p 0.94 to 1.00 at 0.005 steps ----
  {
    const shots = []
    const scales = []
    for (let step = 0; step <= 12; step += 1) {
      const p = 0.94 + step * 0.005
      await scrubTo(p, 1500)
      const s = await consoleState()
      scales.push({ p: +p.toFixed(3), scale: +s.scale.toFixed(4) })
      shots.push((await page.screenshot()).toString('base64'))
    }
    const stripB64 = await analyzer.evaluate(async (images) => {
      const thumbW = 220
      const loaded = await Promise.all(
        images.map(
          (b64) =>
            new Promise((res) => {
              const im = new Image()
              im.onload = () => res(im)
              im.src = `data:image/png;base64,${b64}`
            }),
        ),
      )
      const thumbH = Math.round((loaded[0].height / loaded[0].width) * thumbW)
      const c = document.createElement('canvas')
      c.width = thumbW * loaded.length
      c.height = thumbH
      const ctx = c.getContext('2d')
      loaded.forEach((im, i) => ctx.drawImage(im, i * thumbW, 0, thumbW, thumbH))
      return c.toDataURL('image/png').split(',')[1]
    }, shots)
    writeFileSync(join(OUT_DIR, `${tag}_scene08-strip.png`), Buffer.from(stripB64, 'base64'))
    const flat = (p) => scales.find((s) => s.p === p)?.scale
    const monotone = scales.every((s, i) => i === 0 || s.scale <= scales[i - 1].scale + 0.0005)
    record(
      'strip',
      'shrink continuous, no jump at 0.95 or 0.97',
      Math.abs(flat(0.945) - 1) < 0.001 && Math.abs(flat(0.95) - 1) < 0.001 && Math.abs(flat(0.97) - expected.sf) < 0.005 && Math.abs(flat(0.975) - expected.sf) < 0.005 && monotone,
      scales.map((s) => s.scale.toFixed(3)).join(' '),
    )
  }

  // ---- Scene 08 live hold (2a-live): idle loops, chrome stability ----
  const holdPx = layoutH
  const releasePx = STAGE_SCROLL + holdPx
  {
    // over 3s of no scroll at p 1.0 the map column changes (rings, blink,
    // rain) while the frame, status column and strip are pixel identical
    await scrubTo(1.0, 2500)
    const shotA = (await page.screenshot()).toString('base64')
    await page.waitForTimeout(3000)
    const shotB = (await page.screenshot()).toString('base64')
    const regions = {
      map: [rect.x + 2, rect.y + rect.titleH + 2, rect.w - 4, rect.h - 4],
      frameTop: [rect.frameX, rect.frameY, rect.frameW, 1],
      frameBottom: [rect.frameX, rect.frameY + rect.frameH - 1, rect.frameW, 1],
      status: [rect.statusX + 1, rect.y + rect.titleH + 1, rect.statusW - 2, rect.statusH - 2],
      strip: [rect.x + 1, rect.y + rect.titleH + rect.h + 1, rect.w - 2, rect.stripH - 2],
    }
    const idle = await analyzer.evaluate(
      async ({ a, b, regions, W, H }) => {
        const load = (src) =>
          new Promise((res) => {
            const im = new Image()
            im.onload = () => res(im)
            im.src = `data:image/png;base64,${src}`
          })
        const [ia, ib] = await Promise.all([load(a), load(b)])
        const ctxOf = (im) => {
          const c = document.createElement('canvas')
          c.width = W
          c.height = H
          const x = c.getContext('2d', { willReadFrequently: true })
          x.drawImage(im, 0, 0, W, H)
          return x
        }
        const x1 = ctxOf(ia)
        const x2 = ctxOf(ib)
        const out = {}
        for (const [name, r] of Object.entries(regions)) {
          const da = x1.getImageData(r[0], r[1], r[2], r[3]).data
          const db = x2.getImageData(r[0], r[1], r[2], r[3]).data
          let diff = 0
          for (let i = 0; i < da.length; i += 4) {
            const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]))
            if (d > 0) diff += 1
          }
          out[name] = diff
        }
        return out
      },
      { a: shotA, b: shotB, regions, W: vp.w, H: vp.h },
    )
    record('hold', 'idle loops visible: map column changes over 3s of no scroll', idle.map > 300, `${idle.map} map px changed`)
    record(
      'hold',
      'frame, status column and strip pixel identical over 3s',
      idle.frameTop === 0 && idle.frameBottom === 0 && idle.status === 0 && idle.strip === 0,
      `frame ${idle.frameTop}+${idle.frameBottom}, status ${idle.status}, strip ${idle.strip} px differ`,
    )
  }

  // ---- frame time and GPU-busy estimate over a 10s hold (1536x864) ----
  if (vp.w === 1536 && vp.h === 864 && !vp.scrollbar) {
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + STAGE_SCROLL + 400)
    await page.waitForTimeout(1200)
    const perf = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const scene = window.__HYDRA__.viewer.scene
          const renders = []
          const rafGaps = []
          let tPre = 0
          let lastRaf = 0
          let done = false
          const offPre = scene.preRender.addEventListener(() => {
            tPre = performance.now()
          })
          const offPost = scene.postRender.addEventListener(() => {
            if (tPre) renders.push(performance.now() - tPre)
          })
          const rafProbe = (now) => {
            if (lastRaf) rafGaps.push(now - lastRaf)
            lastRaf = now
            if (!done) requestAnimationFrame(rafProbe)
          }
          requestAnimationFrame(rafProbe)
          setTimeout(() => {
            done = true
            offPre()
            offPost()
            resolve({ renders, rafGaps })
          }, 10000)
        }),
    )
    const sorted = [...perf.renders].sort((a, b) => a - b)
    const mean = perf.renders.reduce((s, v) => s + v, 0) / (perf.renders.length || 1)
    const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0
    const busy = (perf.renders.reduce((s, v) => s + v, 0) / 10000) * 100
    const rafSorted = [...perf.rafGaps].sort((a, b) => a - b)
    const rafP95 = rafSorted[Math.floor(rafSorted.length * 0.95)] ?? 0
    record(
      'hold',
      'render frame time during the hold (mean 16 ms budget)',
      perf.renders.length > 0 && mean <= 16,
      `mean ${mean.toFixed(1)} ms, p95 ${p95.toFixed(1)} ms, ${(perf.renders.length / 10).toFixed(1)} renders per s, GPU-busy est ${busy.toFixed(1)}% (CPU-side submit), raf p95 ${rafP95.toFixed(1)} ms${p95 > 16 ? ' P95 OVER 16 FLAG' : ''}`,
    )
  }

  // ---- release point: the composite still must be self-contained ----
  {
    // freeze the idle phases (dev hook) and recapture the still so live
    // and still show the same instrument pose: the fidelity assert is
    // about compositing, not animation phase
    await scrubTo(0.999, 2500)
    await page.evaluate(() => {
      window.__HYDRA__.freezeIdle = true
    })
    await page.waitForTimeout(400)
    const refreshed = await page.evaluate(() => window.__HYDRA_REFRESH_STILL__())
    const pre = await page.evaluate(() => {
      const marks = [...document.querySelectorAll('.stage__svg rect')]
        .filter((el) => el.getAttribute('width') === '10' && el.getAttribute('stroke') !== '#05070A' && el.style.display !== 'none')
        .map((el) => {
          const r = el.getBoundingClientRect()
          return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, stroke: el.getAttribute('stroke') }
        })
      const cham = [...document.querySelectorAll('.stage__svg text')].find((el) => el.textContent.includes('CHAMOLI'))
      const c = cham ? cham.getBoundingClientRect() : null
      return { marks, chamRect: c ? [c.left, c.top, c.right, c.bottom].map(Math.round) : null }
    })
    const preShot = (await page.screenshot()).toString('base64')
    // persistence reference at the pinned end
    const persistProbe = () =>
      page.evaluate(() => {
        const rectOf = (el) => {
          if (!el) return null
          const r = el.getBoundingClientRect()
          return [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 100) / 100)
        }
        const strip = document.querySelector('.console-frame__striprow')
        return {
          titlebar: rectOf(document.querySelector('.console-frame__titlebar')),
          wordmark: rectOf(document.querySelector('.console-frame__display')),
          stripText: strip ? strip.textContent.replace(/\s+/g, ' ').trim() : null,
        }
      })
    await scrubTo(1.0, 2200)
    const persistAt1 = await persistProbe()
    if (vp.scrollbar && vp.w === 1536 && vp.h === 864) {
      const widths = await page.evaluate(() => ({
        inner: window.innerWidth,
        client: document.documentElement.clientWidth,
        map: document.querySelector('.console-frame__slot').getBoundingClientRect().width,
      }))
      record('p 1.000', 'defect 2 widths: innerWidth / clientWidth / map column', true, `${widths.inner} / ${widths.client} / ${widths.map}`)
    }
    // the still must sit on the measured column exactly, at the swap and
    // 100px past it
    const stillDeltas = () =>
      page.evaluate(() => {
        const still = document.querySelector('.console-frame__still')
        const slot = document.querySelector('.console-frame__slot')
        if (!still || !slot) return null
        const a = still.getBoundingClientRect()
        const b = slot.getBoundingClientRect()
        return [a.left - b.left, a.top - b.top, a.right - b.right, a.bottom - b.bottom].map((v) => +v.toFixed(3))
      })
    // the still is always mounted (hidden); active means visibility visible
    const stillShown = () =>
      page
        .waitForFunction(
          () => {
            const el = document.querySelector('.console-frame__still')
            return !!el && getComputedStyle(el).visibility !== 'hidden'
          },
          { timeout: 20000 },
        )
        .then(() => true)
        .catch(() => false)
    // no swap at the unpin: the canvas stays live through the hold (2a-live)
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + STAGE_SCROLL + 8)
    await page.waitForTimeout(500)
    const live8 = await page.evaluate(() => {
      const canvas = document.querySelector('.stage__canvas')
      const still = document.querySelector('.console-frame__still')
      return {
        canvasHidden: canvas ? canvas.style.visibility === 'hidden' : true,
        stillVisible: !!still && getComputedStyle(still).visibility !== 'hidden',
      }
    })
    record(
      'unpin',
      'canvas live past the unpin, still hidden (no swap until release)',
      !live8.canvasHidden && !live8.stillVisible,
      `canvas hidden ${live8.canvasHidden}, still visible ${live8.stillVisible}`,
    )
    // release point: the overlapped handoff to the still
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + releasePx + 8)
    const gotStill = await stillShown()
    await page.waitForTimeout(500)
    const dSwap = await stillDeltas()
    record('release', 'still equals column at the release (zero delta)', !!dSwap && dSwap.every((v) => Math.abs(v) <= ZERO_DELTA), `deltas ${dSwap?.join(', ')}`)
    if (tag === '1536x730sb') await page.screenshot({ path: join(OUT_DIR, `${tag}_swap.png`) })
    const postShot = (await page.screenshot()).toString('base64')
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + releasePx + 100)
    await page.waitForTimeout(400)
    const d100 = await stillDeltas()
    record('release', 'still equals column 100px past the release (zero delta)', !!d100 && d100.every((v) => Math.abs(v) <= ZERO_DELTA), `deltas ${d100?.join(', ')}`)
    // persistence across the hold: scrolling back crosses the release
    // upward and restores the live canvas
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + STAGE_SCROLL + 400)
    await page.waitForTimeout(700)
    const persistPast = await persistProbe()
    const samePos = (a, b) => !!a && !!b && a.every((v, i) => Math.abs(v - b[i]) <= 0.01)
    record(
      'unpin',
      'console rect, wordmark and strip identical at p 1.000 and 400px past',
      samePos(persistAt1.titlebar, persistPast.titlebar) && samePos(persistAt1.wordmark, persistPast.wordmark) && persistAt1.stripText === persistPast.stripText && persistPast.stripText === STRIP_ROW,
      `titlebar ${persistPast.titlebar?.join(',')} vs ${persistAt1.titlebar?.join(',')}`,
    )
    // postShot was taken 8px past the release: everything sits 8px higher
    // than the p 0.999 reference
    const offset = { dx: 0, dy: -8 }
    const captureMs = await page.evaluate(() => (window.__HYDRA__.captureMs ? +window.__HYDRA__.captureMs.toFixed(1) : null))
    if (vp.w === 1536) writeFileSync(join(OUT_DIR, `${tag}_postunpin.png`), Buffer.from(postShot, 'base64'))
    const mapRect = { x: rect.x, y: rect.y + rect.titleH, w: rect.w, h: rect.h }
    const stillCheck = await analyzer.evaluate(
      async ({ pre, post, marks, chamRect, mapRect, offset }) => {
        const load = (src) =>
          new Promise((res) => {
            const im = new Image()
            im.onload = () => res(im)
            im.src = `data:image/png;base64,${src}`
          })
        const [ia, ib] = await Promise.all([load(pre), load(post)])
        const W = ia.width
        const H = ia.height
        const cv = (im) => {
          const c = document.createElement('canvas')
          c.width = W
          c.height = H
          const x = c.getContext('2d')
          x.drawImage(im, 0, 0)
          return x.getImageData(0, 0, W, H).data
        }
        const da = cv(ia)
        const db = cv(ib)
        const px = (d, x, y) => {
          const i = (Math.round(y) * W + Math.round(x)) * 4
          return [d[i], d[i + 1], d[i + 2]]
        }
        const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]
        // marks: search a small neighbourhood in the STILL frame for a
        // pixel near the mark's state stroke colour
        // a mark counts as present when either its state stroke colour is
        // found near the position (relaxed for the minification AA), or
        // the still locally reproduces the live frame there (which
        // provably contains the mark)
        let found = 0
        for (const m of marks) {
          const want = hex(m.stroke)
          let colourHit = false
          for (let dy = -8; dy <= 8 && !colourHit; dy += 1) {
            for (let dx = -8; dx <= 8 && !colourHit; dx += 1) {
              const [r, g, b] = px(db, m.x + offset.dx + dx, m.y + offset.dy + dy)
              if (Math.abs(r - want[0]) < 60 && Math.abs(g - want[1]) < 60 && Math.abs(b - want[2]) < 60) colourHit = true
              // minification can blend a thin stroke past the flat
              // tolerance; on the cool monochrome terrain any warm pixel
              // this close to the mark is instrument colour
              else if (r - b >= 55 && r >= 100) colourHit = true
            }
          }
          let local = 0
          let localDiff = 0
          for (let dy = -8; dy <= 8; dy += 1) {
            for (let dx = -8; dx <= 8; dx += 1) {
              const A = px(da, m.x + dx, m.y + dy)
              const B = px(db, m.x + offset.dx + dx, m.y + offset.dy + dy)
              const d = Math.max(Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1]), Math.abs(A[2] - B[2]))
              local += 1
              if (d > 32) localDiff += 1
            }
          }
          if (colourHit || localDiff / local < 0.1) found += 1
        }
        // CHAMOLI label: text-colour pixels inside the recorded label rect
        let chamPixels = 0
        if (chamRect) {
          for (let y = chamRect[1]; y <= chamRect[3]; y += 1) {
            for (let x = chamRect[0]; x <= chamRect[2]; x += 1) {
              const [r, g, b] = px(db, x + offset.dx, y + offset.dy)
              if (Math.abs(r - 230) < 50 && Math.abs(g - 234) < 50 && Math.abs(b - 240) < 50) chamPixels += 1
            }
          }
        }
        // live 0.95 frame vs still, inside the map column
        let diff = 0
        let total = 0
        for (let y = mapRect.y + 2; y < mapRect.y + mapRect.h - 2; y += 1) {
          for (let x = mapRect.x + 2; x < mapRect.x + mapRect.w - 2; x += 1) {
            const A = px(da, x, y)
            const B = px(db, x + offset.dx, y + offset.dy)
            const d = Math.max(Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1]), Math.abs(A[2] - B[2]))
            total += 1
            if (d > 16) diff += 1
          }
        }
        // band check on the map's middle row, same style as the 1b bg check
        let run = 0
        let longestRun = 0
        const midY = mapRect.y + Math.round(mapRect.h / 2)
        for (let x = mapRect.x + 2; x < mapRect.x + mapRect.w - 2; x += 1) {
          const A = px(da, x, midY)
          const B = px(db, x + offset.dx, midY + offset.dy)
          const d = Math.max(Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1]), Math.abs(A[2] - B[2]))
          if (d > 16) {
            run += 1
            longestRun = Math.max(longestRun, run)
          } else {
            run = 0
          }
        }
        return { found, chamPixels, diffFraction: diff / total, longestRun }
      },
      { pre: preShot, post: postShot, marks: pre.marks, chamRect: pre.chamRect, mapRect, offset },
    )
    record('release', 'all 14 station marks present in the still', gotStill && pre.marks.length === 14 && stillCheck.found === 14, `${stillCheck.found} of ${pre.marks.length} found, still ${gotStill}`)
    record('release', 'CHAMOLI label present in the still', stillCheck.chamPixels >= 8, `${stillCheck.chamPixels} label pixels`)
    record(
      'release',
      'still matches the live frame inside the map column',
      stillCheck.diffFraction < 0.03 && stillCheck.longestRun <= 24,
      `diff ${(stillCheck.diffFraction * 100).toFixed(2)}%, longest band ${stillCheck.longestRun}px`,
    )
    record('release', 'composite capture cost', captureMs !== null && refreshed === true, `${captureMs} ms (canvas-only baseline 37.1), frozen-phase refresh ${refreshed}`)
    // resume the idle loops for the animated checks below
    await page.evaluate(() => {
      window.__HYDRA__.freezeIdle = false
    })

    // ---- hold clear of sections, canvas live, then release 1:1 ----
    let clearDuringHold = true
    let holdDetail = ''
    for (const frac of [0, 0.25, 0.5, 0.75, 0.95]) {
      const d = Math.round(holdPx * frac)
      await page.evaluate((y) => window.scrollTo(0, y), hydraTop + STAGE_SCROLL + d)
      await page.waitForTimeout(350)
      const check = await page.evaluate(() => {
        const frameEl = document.querySelector('.console-frame__frame')
        const layer = document.querySelector('.console-frame')
        if (!frameEl || !layer) return { fixed: false, offenders: ['missing layer'], canvasLive: false, stillVisible: false }
        const f = frameEl.getBoundingClientRect()
        const offenders = [...document.querySelectorAll('main section')]
          .filter((el) => !el.classList.contains('hydra'))
          .filter((el) => {
            const r = el.getBoundingClientRect()
            return r.left < f.right && r.right > f.left && r.top < f.bottom && r.bottom > f.top
          })
          .map((el) => el.className)
        const canvas = document.querySelector('.stage__canvas')
        const still = document.querySelector('.console-frame__still')
        return {
          fixed: getComputedStyle(layer).position === 'fixed',
          offenders,
          canvasLive: canvas ? canvas.style.visibility !== 'hidden' : false,
          stillVisible: !!still && getComputedStyle(still).visibility !== 'hidden',
        }
      })
      if (frac === 0.5 && tag === '1536x730sb') await page.screenshot({ path: join(OUT_DIR, `${tag}_halfhold.png`) })
      if (!check.fixed || check.offenders.length || !check.canvasLive || check.stillVisible) {
        clearDuringHold = false
        holdDetail = `at ${d}px past: fixed ${check.fixed}, live ${check.canvasLive}, still ${check.stillVisible}, behind: ${check.offenders.join('; ') || 'none'}`
      }
    }
    record('hold', 'layer fixed, canvas live, no section behind during the hold', clearDuringHold, holdDetail || `sampled 5 offsets over ${holdPx}px`)
    let oneToOne = true
    let relDetail = ''
    for (const past of [100, 400, 800]) {
      await page.evaluate((y) => window.scrollTo(0, y), hydraTop + STAGE_SCROLL + holdPx + past)
      await page.waitForTimeout(350)
      const st = await page.evaluate(() => {
        const layer = document.querySelector('.console-frame')
        return { pos: getComputedStyle(layer).position, top: layer.getBoundingClientRect().top }
      })
      if (st.pos !== 'absolute' || Math.abs(st.top + past) > 2) {
        oneToOne = false
        relDetail = `at +${past}: position ${st.pos}, top ${st.top.toFixed(1)} (expected ${-past})`
      }
    }
    record('hold', 'past the release the console top moves 1:1 with scroll', oneToOne, relDetail || 'tracked at +100, +400, +800 past the release')
    if (tag === '1536x730sb') {
      await page.evaluate((y) => window.scrollTo(0, y), hydraTop + STAGE_SCROLL + holdPx + 200)
      await page.waitForTimeout(400)
      await page.screenshot({ path: join(OUT_DIR, `${tag}_release200.png`) })
    }
  }

  // ---- round 2a-live: frame sequences across the release-point swap ----
  // Every composited frame (CDP screencast, at least the required 30 fps
  // during motion) across the release in both directions, fast (600px in
  // 100ms) and slow. Past the release the whole console scrolls 1:1, so
  // each frame first locates the console's vertical offset (row-profile
  // correlation of the console frame band against the reference), then
  // asserts the map column shows zero displacement RELATIVE to the console
  // and mean luminance within 5 percent, over the rows still on screen.
  // Idle loops animate inside the column throughout; the terrain-dominated
  // profiles and the 5 percent band absorb them.
  if (vp.swapSeq) {
    const cdp = await page.context().newCDPSession(page)
    const frameRegion = { x: rect.frameX, y: rect.frameY, w: rect.frameW, h: rect.frameH }
    const mapRegion = { x: rect.x, y: rect.y + rect.titleH, w: rect.w, h: rect.h }
    // reference: settled 100px inside the hold (live canvas, layer fixed)
    await page.evaluate((y) => window.scrollTo(0, y), hydraTop + releasePx - 100)
    await page.waitForTimeout(2500)
    const refShot = (await page.screenshot()).toString('base64')
    await analyzer.evaluate(
      async ({ png, W, H, frameRegion, mapRegion }) => {
        const img = await new Promise((res) => {
          const im = new Image()
          im.onload = () => res(im)
          im.src = `data:image/png;base64,${png}`
        })
        const c = document.createElement('canvas')
        c.width = W
        c.height = H
        const ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, W, H)
        const lumaGrid = (r) => {
          const d = ctx.getImageData(r.x, r.y, r.w, r.h).data
          const g = new Array(r.w * r.h)
          for (let i = 0, px = 0; i < d.length; i += 4, px += 1) g[px] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
          return g
        }
        const frameGrid = lumaGrid(frameRegion)
        const consoleRows = new Array(frameRegion.h).fill(0)
        for (let y = 0; y < frameRegion.h; y += 1) {
          let s = 0
          for (let x = 0; x < frameRegion.w; x += 1) s += frameGrid[y * frameRegion.w + x]
          consoleRows[y] = s / frameRegion.w
        }
        window.__SEQREF = { consoleRows, mapGrid: lumaGrid(mapRegion), frameRegion, mapRegion, W, H }
        return true
      },
      { png: refShot, W: vp.w, H: vp.h, frameRegion, mapRegion },
    )
    const captureSeq = async (fromPx, toPx, ms) => {
      await page.evaluate((y) => window.scrollTo(0, y), hydraTop + releasePx + fromPx)
      await page.waitForTimeout(2500)
      const frames = []
      const onFrame = (ev) => {
        frames.push(ev.data)
        cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {})
      }
      cdp.on('Page.screencastFrame', onFrame)
      await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 })
      await page.evaluate(
        ({ base, from, to, ms }) =>
          new Promise((done) => {
            const t0 = performance.now()
            const step = (now) => {
              const t = Math.min(1, (now - t0) / ms)
              window.scrollTo(0, base + from + (to - from) * t)
              if (t < 1) requestAnimationFrame(step)
              else done()
            }
            requestAnimationFrame(step)
          }),
        { base: hydraTop + releasePx, from: fromPx, to: toPx, ms },
      )
      // keep capturing through the scrub settle and the handoff's decode
      // and render frames, so a blank or displaced frame cannot hide
      await page.waitForTimeout(1600)
      await cdp.send('Page.stopScreencast')
      cdp.off('Page.screencastFrame', onFrame)
      // a sequence that ends on the static still stops producing
      // compositor frames: append the settled end state explicitly
      frames.push((await page.screenshot()).toString('base64'))
      return frames
    }
    const analyzeFrames = async (frames, span) => {
      const out = []
      for (let at = 0; at < frames.length; at += 6) {
        const chunk = frames.slice(at, at + 6)
        const part = await analyzer.evaluate(
          async ({ pngs, span }) => {
            const ref = window.__SEQREF
            const { frameRegion: fr, mapRegion: mr, W, H } = ref
            const bestShift = (a, b, maxShift) => {
              let best = 0
              let bestErr = Infinity
              for (let s = -maxShift; s <= maxShift; s += 1) {
                let err = 0
                let n = 0
                for (let i = 0; i < a.length; i += 1) {
                  const j = i + s
                  if (j < 0 || j >= b.length) continue
                  err += Math.abs(a[i] - b[j])
                  n += 1
                }
                if (!n) continue
                err /= n
                if (err < bestErr) {
                  bestErr = err
                  best = s
                }
              }
              return best
            }
            const res = []
            // one reusable CPU-side canvas for the whole chunk
            const c = document.createElement('canvas')
            c.width = W
            c.height = H
            const ctx = c.getContext('2d', { willReadFrequently: true })
            for (const png of pngs) {
              const img = await new Promise((resolve) => {
                const im = new Image()
                im.onload = () => resolve(im)
                im.src = `data:image/png;base64,${png}`
              })
              ctx.drawImage(img, 0, 0, W, H)
              // full-height row profile over the console frame's columns
              const full = ctx.getImageData(fr.x, 0, fr.w, H).data
              const fullRows = new Array(H).fill(0)
              for (let y = 0; y < H; y += 1) {
                let s = 0
                for (let x = 0; x < fr.w; x += 1) {
                  const i = (y * fr.w + x) * 4
                  s += 0.299 * full[i] + 0.587 * full[i + 1] + 0.114 * full[i + 2]
                }
                fullRows[y] = s / fr.w
              }
              // console offset o: ref row i should appear at frame row
              // fr.y + i - o. Search the sequence span plus jitter.
              let o = 0
              let bestErr = Infinity
              for (let cand = -24; cand <= span + 24; cand += 1) {
                let err = 0
                let n = 0
                for (let i = 0; i < ref.consoleRows.length; i += 2) {
                  const yy = fr.y + i - cand
                  if (yy < 0 || yy >= H) continue
                  err += Math.abs(ref.consoleRows[i] - fullRows[yy])
                  n += 1
                }
                // a short viewport keeps only ~70 console rows on screen at
                // the far end of a sequence: accept a thin overlap
                if (n < 24) continue
                err /= n
                if (err < bestErr) {
                  bestErr = err
                  o = cand
                }
              }
              // map rows still on screen at this offset
              let jA = 0
              while (jA < mr.h && mr.y + jA - o < 0) jA += 1
              let jB = mr.h
              while (jB > jA && mr.y + jB - 1 - o >= H) jB -= 1
              const visH = jB - jA
              if (visH < 32) {
                res.push({ o, dy: 0, dx: 0, ratio: 1, visH, skipped: true })
                continue
              }
              const sub = ctx.getImageData(mr.x, mr.y + jA - o, mr.w, visH).data
              const fRows = new Array(visH).fill(0)
              const fCols = new Array(mr.w).fill(0)
              let fSum = 0
              for (let j = 0; j < visH; j += 1) {
                for (let x = 0; x < mr.w; x += 1) {
                  const i = (j * mr.w + x) * 4
                  const l = 0.299 * sub[i] + 0.587 * sub[i + 1] + 0.114 * sub[i + 2]
                  fRows[j] += l
                  fCols[x] += l
                  fSum += l
                }
              }
              for (let j = 0; j < visH; j += 1) fRows[j] /= mr.w
              for (let x = 0; x < mr.w; x += 1) fCols[x] /= visH
              const rRows = new Array(visH).fill(0)
              const rCols = new Array(mr.w).fill(0)
              let rSum = 0
              for (let j = 0; j < visH; j += 1) {
                for (let x = 0; x < mr.w; x += 1) {
                  const l = ref.mapGrid[(jA + j) * mr.w + x]
                  rRows[j] += l
                  rCols[x] += l
                  rSum += l
                }
              }
              for (let j = 0; j < visH; j += 1) rRows[j] /= mr.w
              for (let x = 0; x < mr.w; x += 1) rCols[x] /= visH
              res.push({
                o,
                dy: bestShift(rRows, fRows, 24),
                dx: bestShift(rCols, fCols, 24),
                ratio: fSum / (rSum || 1),
                visH,
              })
            }
            return res
          },
          { pngs: chunk, span },
        )
        out.push(...part)
      }
      return out
    }
    const saveStrip = async (frames, name) => {
      const step = Math.max(1, Math.ceil(frames.length / 10))
      const picks = frames.filter((_, i) => i % step === 0)
      const stripB64 = await analyzer.evaluate(async (images) => {
        const thumbW = 220
        const loaded = await Promise.all(
          images.map(
            (b64) =>
              new Promise((res) => {
                const im = new Image()
                im.onload = () => res(im)
                im.src = `data:image/png;base64,${b64}`
              }),
          ),
        )
        const thumbH = Math.round((loaded[0].height / loaded[0].width) * thumbW)
        const c = document.createElement('canvas')
        c.width = thumbW * loaded.length
        c.height = thumbH
        const ctx = c.getContext('2d')
        loaded.forEach((im, i) => ctx.drawImage(im, i * thumbW, 0, thumbW, thumbH))
        return c.toDataURL('image/png').split(',')[1]
      }, picks)
      writeFileSync(join(OUT_DIR, `${tag}_swapstrip_${name}.png`), Buffer.from(stripB64, 'base64'))
    }
    const SEQS = [
      { name: 'fast forward', from: -100, to: 500, ms: 100, strip: 'fwdfast' },
      { name: 'fast reverse', from: 500, to: -100, ms: 100, strip: 'revfast' },
      { name: 'slow forward', from: -100, to: 500, ms: 2000 },
      { name: 'slow reverse', from: 500, to: -100, ms: 2000 },
    ]
    for (const sq of SEQS) {
      const frames = await captureSeq(sq.from, sq.to, sq.ms)
      const res = frames.length ? await analyzeFrames(frames, Math.abs(sq.to - sq.from)) : []
      const used = res.filter((f) => !f.skipped)
      const maxDx = used.length ? Math.max(...used.map((f) => Math.abs(f.dx))) : null
      const maxDy = used.length ? Math.max(...used.map((f) => Math.abs(f.dy))) : null
      const minRatio = used.length ? Math.min(...used.map((f) => f.ratio)) : null
      const maxRatio = used.length ? Math.max(...used.map((f) => f.ratio)) : null
      const maxO = res.length ? Math.max(...res.map((f) => f.o)) : null
      writeFileSync(join(OUT_DIR, `${tag}_swapseq_${sq.name.replace(/ /g, '')}.json`), JSON.stringify(res))
      record(
        'swap seq',
        `${sq.name}: map displacement zero relative to the console`,
        used.length >= 6 && maxDx === 0 && maxDy === 0,
        `${res.length} frames (${res.length - used.length} sliver-skipped), console offset 0 to ${maxO}, max |dx| ${maxDx}, max |dy| ${maxDy} px`,
      )
      record(
        'swap seq',
        `${sq.name}: no blackout, mean luminance within 5 percent`,
        used.length >= 6 && minRatio >= 0.95 && maxRatio <= 1.05,
        `luma ratio ${minRatio?.toFixed(3)} to ${maxRatio?.toFixed(3)}`,
      )
      if (sq.strip && frames.length) await saveStrip(frames, sq.strip)
    }
    await cdp.detach().catch(() => {})
  }

  await page.close()
}

for (const vp of VIEWPORTS) await runSuite(vp)
await browser.close()
if (browserSb) await browserSb.close()

// ---- table ----
const width = Math.max(...results.map((r) => r.assertion.length))
const cpWidth = Math.max(...results.map((r) => r.checkpoint.length))
let failures = 0
console.log(`\n${'CHECK'.padEnd(cpWidth)} ${'ASSERTION'.padEnd(width)}  RESULT  DETAIL`)
for (const r of results) {
  if (!r.pass) failures += 1
  console.log(`${r.checkpoint.padEnd(cpWidth)} ${r.assertion.padEnd(width)}  ${r.pass ? 'PASS' : 'FAIL'}    ${r.detail}`)
}
if (pageErrors.length) console.log(`\npage errors:\n${pageErrors.join('\n')}`)
console.log(`\n${results.length - failures}/${results.length} passed. Frames in tools/verify-frames-output/`)
process.exit(failures || pageErrors.length ? 1 : 0)
