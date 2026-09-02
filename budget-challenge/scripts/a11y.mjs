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
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core')

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const pages = [['/', 'home'], ['/overview', 'overview'], ['/challenge', 'challenge'],
               ['/results', 'results'], ['/results', 'results-with-one-time-panel'],
               ['/methodology', 'methodology'], ['/glossary', 'glossary']]

/**
 * The results page is scanned twice: once as a fresh session, and once after
 * choices that make the one-time-funding panel appear. A panel that only shows
 * under a condition is exactly the kind that never gets audited otherwise.
 */
const DIVERGING_SESSION = JSON.stringify({
  version: 1,
  datasetVersion: 'any',
  mode: 'classroom',
  selections: {
    'teacher-compensation': 'governor-schedule',
    'medicaid-rebase': 'governor-rebase',
    'reservation-serdrf': 'halve',
  },
  savedAt: new Date().toISOString(),
})

let total = 0
for (const [path, name] of pages) {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    if (name === 'results-with-one-time-panel') {
      // Seeded before any script runs. Setting storage after load would not
      // reach the provider, which reads it once while initialising.
      await page.addInitScript((s) => {
        window.localStorage.setItem('nc-budget-challenge/v1', s)
      }, DIVERGING_SESSION)
    }
    await page.goto(`http://localhost:4173/#${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)
    if (name === 'results-with-one-time-panel' && !(await page.locator('[data-testid="one-time-funding"]').count())) {
      console.log('PROBLEM: the one-time-funding panel did not render for the seeded session')
      total += 1
    }
    // Expand every disclosure first. A panel that is hidden is out of the
    // accessibility tree, so scanning only the collapsed state would audit the
    // part of the page nobody has questions about and skip the rest.
    await page.evaluate(() => {
      for (const button of document.querySelectorAll('button[aria-expanded="false"][aria-controls]')) {
        button.click()
      }
    })
    await page.waitForTimeout(250)
    await page.addScriptTag({ path: axePath })
    const results = await page.evaluate(async () =>
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      }),
    )
    const violations = results.violations.filter((v) => v.impact !== 'minor' || true)
    if (violations.length) {
      total += violations.length
      console.log(`\n=== ${name} @ ${viewport.width}px ===`)
      for (const v of violations) {
        console.log(`[${v.impact}] ${v.id}: ${v.help}`)
        for (const node of v.nodes.slice(0, 3)) {
          console.log(`   ${node.target.join(' ')}`)
          console.log(`   ${(node.failureSummary || '').split('\n').slice(0, 3).join(' | ')}`)
        }
      }
    }
    await context.close()
  }
}
console.log(total === 0 ? '\nNo accessibility violations found.' : `\n${total} violation groups found.`)
await browser.close()
