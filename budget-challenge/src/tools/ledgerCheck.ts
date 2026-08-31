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

console.log('\nIllustration only — S.L. 2026-42 is not yet totalled, so these are NOT the anchors:')
console.log(`  net appropriations would be  ${usd(ENACTED_NET_APPROPRIATIONS + net)}`)
console.log(`  unappropriated balance would be ${usd(ENACTED_UNAPPROPRIATED - net)}`)
