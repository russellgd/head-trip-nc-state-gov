/**
 * Browser checks against a running build.
 *
 * Start the server first:
 *   npm run build && npm run preview
 *
 * Uses the Chromium that ships with the container image rather than
 * downloading one; override with CHROMIUM_PATH if yours lives elsewhere.
 */
import { chromium } from 'playwright'

const OUT = process.argv[2] ?? './screenshots'
const BASE = 'http://localhost:4173/#'

// The image ships its own Chromium; use it rather than downloading one.
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const problems = []

async function shoot(name, path, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })

  // Horizontal overflow is the classic mobile layout failure. Measured by
  // actually trying to scroll: scrollWidth counts descendants that an
  // overflow-auto ancestor already clips, and reports them as page overflow.
  const overflow = await page.evaluate(() => {
    window.scrollTo(9999, 0)
    const moved = window.scrollX
    window.scrollTo(0, 0)
    return moved
  })
  if (overflow > 1) problems.push(`${name}: page scrolls sideways by ${overflow}px`)

  // Both running measures must be rendered and readable at this width. Checked
  // against each figure's own box rather than the viewport, because the page
  // already has its own sideways-scroll check above and this is about whether
  // the numbers themselves are cut off.
  if (path.includes('challenge')) {
    const measures = await page.evaluate(() => {
      const read = (id) => {
        const el = document.querySelector(`[data-testid="${id}"]`)
        if (!el) return null
        const visual = el.querySelector('[aria-hidden="true"]') ?? el
        const r = visual.getBoundingClientRect()
        return {
          rendered: r.width > 0 && r.height > 0,
          clipped: el.scrollWidth > el.clientWidth + 1,
          text: visual.textContent.trim(),
        }
      }
      return { change: read('change-from-enacted'), remaining: read('remaining-balance') }
    })
    for (const [measure, state] of Object.entries(measures)) {
      if (!state) problems.push(`${name}: the ${measure} measure is missing`)
      else if (!state.rendered) problems.push(`${name}: the ${measure} measure has no visible box`)
      else if (state.clipped) problems.push(`${name}: the ${measure} measure is cut off ("${state.text}")`)
    }
  }
  if (errors.length) problems.push(`${name}: console errors: ${errors.join(' | ')}`)

  await context.close()
}

const desktop = { width: 1280, height: 900 }
const tablet = { width: 834, height: 1112 }
const mobile = { width: 390, height: 844 }

for (const [name, path] of [
  ['home', '/'],
  ['overview', '/overview'],
  ['challenge', '/challenge'],
  ['results', '/results'],
  ['methodology', '/methodology'],
  ['glossary', '/glossary'],
]) {
  await shoot(`desktop-${name}`, path, desktop)
  await shoot(`mobile-${name}`, path, mobile)
}
await shoot('tablet-challenge', '/challenge', tablet)

console.log(problems.length ? problems.join('\n') : 'No layout problems detected.')
await browser.close()
