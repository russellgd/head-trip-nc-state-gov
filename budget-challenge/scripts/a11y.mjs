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
               ['/results', 'results'], ['/methodology', 'methodology'], ['/glossary', 'glossary']]

let total = 0
for (const [path, name] of pages) {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    await page.goto(`http://localhost:4173/#${path}`, { waitUntil: 'networkidle' })
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
