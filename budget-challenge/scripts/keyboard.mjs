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

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const problems = []

await page.goto('http://localhost:4173/#/challenge', { waitUntil: 'networkidle' })
await page.waitForTimeout(300)

// 1. The skip link must be the first stop and must actually be visible on focus.
await page.keyboard.press('Tab')
const skip = await page.evaluate(() => {
  const el = document.activeElement
  const r = el.getBoundingClientRect()
  return { text: el.textContent.trim(), onScreen: r.left >= 0 && r.top >= 0 }
})
if (!/skip to main content/i.test(skip.text)) problems.push(`first tab stop is "${skip.text}"`)
if (!skip.onScreen) problems.push('skip link does not become visible when focused')

// 2. Every interactive element must show a visible focus indicator.
const focusReport = await page.evaluate(() => {
  const targets = [...document.querySelectorAll('a[href], button:not([disabled]), input, summary, [tabindex="0"]')]
  const bad = []
  for (const el of targets) {
    el.focus()
    const s = getComputedStyle(el)
    const hasOutline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
    if (!hasOutline) bad.push(el.tagName + '.' + String(el.className).split(' ')[0])
  }
  return { count: targets.length, bad: [...new Set(bad)] }
})
if (focusReport.bad.length) problems.push(`no visible focus ring on: ${focusReport.bad.join(', ')}`)

// 3. The whole challenge must be completable without a mouse.
await page.goto('http://localhost:4173/#/challenge', { waitUntil: 'networkidle' })
await page.waitForTimeout(200)
const before = await page.textContent('[data-testid="remaining-balance"]')

// Reach the reserve decision by keyboard through the category navigation.
await page.getByRole('button', { name: /Savings, Reserves, and Unappropriated Balance/ }).focus()
await page.keyboard.press('Enter')
await page.waitForTimeout(200)

// Select an option using only the arrow keys within the radio group.
await page.getByRole('radio', { name: /Leave the balance unappropriated/ }).focus()
await page.keyboard.press('ArrowDown')
await page.waitForTimeout(250)
const after = await page.textContent('[data-testid="remaining-balance"]')
if (before === after) problems.push(`balance did not change via keyboard (${before} -> ${after})`)

// 4. Focus must move to the new card when navigating between decisions.
await page.getByRole('button', { name: /^Next/ }).focus()
await page.keyboard.press('Enter')
await page.waitForTimeout(250)
const focusedAfterNext = await page.evaluate(() => document.activeElement?.tagName)
if (focusedAfterNext === 'BODY') problems.push('focus was dropped to <body> after moving to the next decision')

// 5. Reduced motion must actually remove transitions.
const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } })
const rp = await reduced.newPage()
await rp.goto('http://localhost:4173/#/challenge', { waitUntil: 'networkidle' })
const durations = await rp.evaluate(() =>
  [...document.querySelectorAll('*')]
    .map((el) => getComputedStyle(el).transitionDuration)
    .filter((d) => d && parseFloat(d) > 0.05),
)
if (durations.length) problems.push(`${durations.length} elements still animate under reduced motion`)
await reduced.close()

console.log(`Checked ${focusReport.count} focusable elements.`)
console.log(problems.length ? problems.map((p) => `PROBLEM: ${p}`).join('\n') : 'Keyboard and motion checks passed.')
await browser.close()
