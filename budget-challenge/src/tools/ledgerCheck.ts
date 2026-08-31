/**
 * Arithmetic check for RECONCILIATION_LEDGER.md.
 *
 * The ledger's rows are transcribed here from the two corrections acts. The
 * point is that the subtotals printed in the ledger are computed rather than
 * typed: a hand-added column is exactly where a reconciliation goes wrong, and
 * it went wrong once already in drafting this one.
 *
 * Run with:  npm run report:ledger
 */

interface Row {
  section: string
  what: string
  kind: 'recurring' | 'nonrecurring'
  delta: number
}

/** S.L. 2026-61 provisions that change the General Fund total. */
const SL_2026_61: Row[] = [
  { section: '5.2(a)', what: 'DACS vacant position funding restored', kind: 'recurring', delta: 3_757_559 },
  { section: '5.2(b)', what: 'NCFS emergency equipment', kind: 'recurring', delta: -2_000_000 },
  { section: '5.2(c)', what: 'NCFS emergency equipment', kind: 'nonrecurring', delta: 2_000_000 },
  { section: '5.2(d)', what: 'NCFS prescribed burning', kind: 'recurring', delta: -1_000_000 },
  { section: '5.2(e)', what: 'NCFS prescribed burning', kind: 'nonrecurring', delta: 1_000_000 },
  { section: '5.4(a)', what: 'Commerce EEO coordinator position', kind: 'recurring', delta: 23_489 },
  { section: '5.4(b)', what: 'Commerce administrative operating costs', kind: 'recurring', delta: -70_468 },
  { section: '5.5', what: 'Commerce India/Ireland trade commissions', kind: 'recurring', delta: 20_000 },
  { section: '5.6', what: 'Commerce Energy and Infrastructure Office', kind: 'recurring', delta: 188_431 },
  { section: '5.7', what: 'Commerce 2027 Military World Games', kind: 'nonrecurring', delta: 25_000_000 },
  { section: '5.8A', what: 'Commerce Film and Entertainment Grant Fund', kind: 'nonrecurring', delta: 15_000_000 },
  { section: '5.15(b)', what: 'DNCR Great Trails Fund', kind: 'nonrecurring', delta: -1_090_000 },
  { section: '5.15(c)', what: 'OSBM six directed grants', kind: 'nonrecurring', delta: 1_040_000 },
  { section: '5.17(a)', what: 'DNCR Office of Education and Outreach', kind: 'recurring', delta: 481_965 },
  { section: '5.17(c)', what: 'DNCR software subscriptions', kind: 'recurring', delta: -481_965 },
  { section: '5.18', what: 'Wildlife Resources Commission operations', kind: 'recurring', delta: 1_000_000 },
  { section: '6.4(a)', what: 'Adult Correction, Campbell University', kind: 'nonrecurring', delta: 1_000_000 },
  { section: '6.7', what: 'Public Safety, National Guard facility closing', kind: 'nonrecurring', delta: 105_000 },
  { section: '7.1', what: 'Administrative Hearings, RRC litigation', kind: 'nonrecurring', delta: 500_000 },
  { section: '7.3', what: 'OSBM Rural Health Care Stabilization', kind: 'nonrecurring', delta: 10_000_000 },
  { section: '7.16(c)', what: 'Office of State Fire Marshal, 7 FTE', kind: 'recurring', delta: 1_253_491 },
  { section: '7.19', what: 'Secretary of State annual report', kind: 'recurring', delta: 200_000 },
  { section: '7.19', what: 'Secretary of State annual report', kind: 'nonrecurring', delta: 545_000 },
  { section: '7.20', what: 'Secretary of State IP prosecutor', kind: 'nonrecurring', delta: 160_000 },
  { section: '7.21', what: 'Secretary of State foreign land registry', kind: 'recurring', delta: 255_000 },
  { section: '4.4(1)', what: 'DHHS MH/DD/SUS, HBOT 4 Heroes', kind: 'nonrecurring', delta: 1_500_000 },
  { section: '4.4(2)', what: 'DHHS Community Foundation of NC East', kind: 'nonrecurring', delta: -1_500_000 },
]

/**
 * S.L. 2026-42 provisions that change the General Fund total, excluding the
 * §6.2 directed-grant schedule, which is handled separately below because its
 * effect turns on a question the act does not answer.
 */
const SL_2026_42: Row[] = [
  { section: '2.5(1)', what: 'UNC BOG 16022, MAHEC at UNC-Chapel Hill', kind: 'recurring', delta: 1_000_000 },
  { section: '2.5(1)', what: 'UNC BOG 16022, MAHEC at UNC-Chapel Hill', kind: 'nonrecurring', delta: 2_123_000 },
  { section: '2.5(2)', what: 'UNC BOG 16011, Healthcare Workforce Programs', kind: 'recurring', delta: -1_000_000 },
  { section: '2.5(2)', what: 'UNC BOG 16011, Healthcare Workforce Programs', kind: 'nonrecurring', delta: -500_000 },
  { section: '3.5(2)', what: 'DHHS, Boys and Girls Homes directed grant', kind: 'nonrecurring', delta: -500_000 },
  { section: '3.6', what: "DHHS, Dolly Parton's Imagination Library", kind: 'nonrecurring', delta: -1_000_000 },
]

/**
 * S.L. 2026-42 §6.2, enacting SECTION 26.10.
 *
 * (a) allocates eight new directed grants "of the funds appropriated in this
 * act to OSBM - Special Appropriations", which is a carve-out of an existing
 * appropriation rather than new money. (b) amends existing directed grants,
 * reducing twelve and increasing two.
 *
 * The act never says whether (b)'s reductions reduce the OSBM Special
 * Appropriations line or merely free capacity within it for (a). That question
 * is worth the amount below and cannot be settled from the statutory text.
 */
const SECTION_26_10_NEW_GRANTS = [1_000_000, 2_500_000, 500_000, 200_000, 500_000, 200_000, 100_000, 10_000]
const SECTION_26_10_INCREASES = [500_000, 100_000]
const SECTION_26_10_REDUCTIONS = [
  100_000, 1_000_000, 500_000, 2_123_000, 200_000, 250_000, 250_000, 1_000_000, 100_000, 200_000,
  500_000, 10_000,
]

const ENACTED_NET_APPROPRIATIONS = 34_374_286_763
const ENACTED_UNAPPROPRIATED = 1_000_000_000

const usd = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function subtotal(rows: Row[], kind: Row['kind'], sign: 1 | -1): number {
  return rows
    .filter((r) => r.kind === kind && Math.sign(r.delta) === sign)
    .reduce((a, r) => a + r.delta, 0)
}

const incR = subtotal(SL_2026_61, 'recurring', 1)
const incN = subtotal(SL_2026_61, 'nonrecurring', 1)
const redR = subtotal(SL_2026_61, 'recurring', -1)
const redN = subtotal(SL_2026_61, 'nonrecurring', -1)

const grossIncreases = incR + incN
const grossReductions = redR + redN
const net = grossIncreases + grossReductions

console.log('S.L. 2026-61 reconciliation check\n')
console.log(`  rows                        ${SL_2026_61.length}`)
console.log(`  gross increases   recurring ${usd(incR).padStart(16)}`)
console.log(`                 nonrecurring ${usd(incN).padStart(16)}`)
console.log(`                        total ${usd(grossIncreases).padStart(16)}`)
console.log(`  gross reductions  recurring ${usd(redR).padStart(16)}`)
console.log(`                 nonrecurring ${usd(redN).padStart(16)}`)
console.log(`                        total ${usd(grossReductions).padStart(16)}`)
console.log(`  net change        recurring ${usd(incR + redR).padStart(16)}`)
console.log(`                 nonrecurring ${usd(incN + redN).padStart(16)}`)
console.log(`                        total ${usd(net).padStart(16)}`)

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0)

const net42Base = SL_2026_42.reduce((a, r) => a + r.delta, 0)
const s2610New = sum(SECTION_26_10_NEW_GRANTS)
const s2610Inc = sum(SECTION_26_10_INCREASES)
const s2610Red = sum(SECTION_26_10_REDUCTIONS)
const s2610NetIfReal = s2610Inc - s2610Red

console.log('\n\nS.L. 2026-42 reconciliation check\n')
console.log(`  rows outside §6.2           ${SL_2026_42.length}`)
console.log(`  net outside §6.2            ${usd(net42Base).padStart(16)}`)
console.log(`  §6.2 new grants (carve-out) ${usd(s2610New).padStart(16)}`)
console.log(`  §6.2 grant increases        ${usd(s2610Inc).padStart(16)}`)
console.log(`  §6.2 grant reductions       ${usd(-s2610Red).padStart(16)}`)

const readingA = net42Base
const readingB = net42Base + s2610NetIfReal

console.log('\n  Reading A — §26.10 redistributes within an unchanged appropriation line:')
console.log(`    S.L. 2026-42 net          ${usd(readingA).padStart(16)}`)
console.log('  Reading B — §26.10(b) reductions lower the line, (a) is a carve-out of the rest:')
console.log(`    S.L. 2026-42 net          ${usd(readingB).padStart(16)}`)
console.log(`  The unresolved question is worth ${usd(Math.abs(readingA - readingB))}.`)

console.log('\n\nCombined, and why this is not yet an anchor\n')
for (const [label, net42] of [['A', readingA], ['B', readingB]] as Array<[string, number]>) {
  const combined = net + net42
  console.log(`  Reading ${label}: combined net change ${usd(combined).padStart(16)}`)
  console.log(`             net appropriations   ${usd(ENACTED_NET_APPROPRIATIONS + combined)}`)
  console.log(`             unappropriated       ${usd(ENACTED_UNAPPROPRIATED - combined)}`)
}
console.log('\n  NOT AN ANCHOR. Two readings stand, and S.L. 2026-42 §8.2 grants a 13% salary')
console.log('  increase to certain SBI and ALE officers with no amount stated. A controlling')
console.log('  post-corrections total is required; neither act contains one.')
