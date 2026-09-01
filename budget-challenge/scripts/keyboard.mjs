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
  const all = [...document.querySelectorAll('a[href], button:not([disabled]), input, summary, [tabindex="0"]')]
  const bad = []
  let checked = 0

  for (const el of all) {
    el.focus()
    // Content inside a closed <details> is in the DOM and even reports client
    // rects, but cannot take focus. If focus did not land, there is no focus
    // ring to check and nothing a keyboard user could reach.
    if (document.activeElement !== el) continue
    checked += 1

    const s = getComputedStyle(el)
    const hasOutline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
    if (!hasOutline) bad.push(el.tagName + '.' + String(el.className).split(' ')[0])
  }

  return { count: checked, bad: [...new Set(bad)] }
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

// 5. Every disclosure must work by keyboard and say what state it is in.
await page.goto('http://localhost:4173/#/challenge', { waitUntil: 'networkidle' })
await page.waitForTimeout(200)
const disclosure = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('button[aria-controls][aria-expanded]')]
  const bad = []
  for (const button of buttons) {
    const panel = document.getElementById(button.getAttribute('aria-controls'))
    if (!panel) { bad.push(`${button.textContent.trim()}: aria-controls points at nothing`); continue }
    if (button.getAttribute('aria-expanded') !== 'false') bad.push(`${button.textContent.trim()}: starts expanded`)
    if (!panel.hasAttribute('hidden')) bad.push(`${button.textContent.trim()}: panel is not hidden while collapsed`)
  }
  return { count: buttons.length, bad }
})
if (disclosure.count === 0) problems.push('no disclosure buttons found on the challenge page')
if (disclosure.bad.length) problems.push(`disclosure state: ${disclosure.bad.join('; ')}`)

const firstDisclosure = page.locator('button[aria-controls][aria-expanded]').first()
await firstDisclosure.focus()
await page.keyboard.press('Enter')
await page.waitForTimeout(150)
const opened = await page.evaluate(() => {
  const button = document.querySelector('button[aria-controls][aria-expanded]')
  const panel = document.getElementById(button.getAttribute('aria-controls'))
  return {
    expanded: button.getAttribute('aria-expanded'),
    hidden: panel.hasAttribute('hidden'),
    visible: panel.getBoundingClientRect().height > 0,
    keptFocus: document.activeElement === button,
  }
})
if (opened.expanded !== 'true') problems.push('Enter did not set aria-expanded="true" on a disclosure')
if (opened.hidden || !opened.visible) problems.push('a disclosure reported expanded but its panel stayed hidden')
if (!opened.keptFocus) problems.push('focus was lost when a disclosure was opened by keyboard')

// 6. Reduced motion must actually remove transitions.
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
