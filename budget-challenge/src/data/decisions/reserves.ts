/**
 * Savings, reserves, and the unappropriated balance.
 *
 * These decisions are the cleanest in the whole challenge, because the act
 * states each amount to the dollar in its own availability statement. Section
 * 2.2(a) takes a series of reservations off the top of General Fund
 * availability before anything is appropriated; reserving less leaves more
 * available to appropriate, and reserving more leaves less.
 *
 * Sign convention reminder: `reserve` positive means setting more aside, which
 * lowers the remaining balance. Reducing a reservation is therefore negative.
 */
import type { Decision } from '../types'
import { BASELINE } from '../baseline'
import { RESERVATIONS } from '../enacted'
import { cite } from '../sources'
import { enactedOption, illustrativeOption, usd, verifiedOption } from './helpers'

const reservation = (id: string) => {
  const found = RESERVATIONS.find((r) => r.id === id)
  if (!found) throw new Error(`Unknown reservation "${id}"`)
  return found
}

/**
 * The three-option shape shared by every reservation decision: keep it, halve
 * it, or make no reservation at all. The amounts are the act's own figure, half
 * of it, and all of it.
 */
function reservationDecision(input: {
  reservationId: string
  category: Decision['category']
  title: string
  question: string
  background: string
  whatItFunds: string
  affects: string[]
  keepBenefits?: string[]
  reduceBenefits: string[]
  reduceTradeoffs: string[]
  eliminateBenefits: string[]
  eliminateTradeoffs: string[]
}): Decision {
  const r = reservation(input.reservationId)
  const half = Math.round(r.amount / 2)
  const sources = [cite('sl2026_41', r.section)]

  const statutoryNote =
    r.kind === 'statutory'
      ? ' This reservation is required by statute, so changing it would take a change in the law as well as in the budget.'
      : ''

  return {
    id: `reservation-${r.id}`,
    category: input.category,
    title: input.title,
    question: input.question,
    enactedBaseline: `S.L. 2026-41 reserves ${usd(r.amount)} to the ${r.name.replace(
      /,.*$/,
      '',
    )} for FY 2026-27, before any money is appropriated. ${input.whatItFunds}`,
    background: input.background,
    choices: [
      enactedOption({
        label: `Keep the ${usd(r.amount)} reservation`,
        description: `Reserve ${usd(r.amount)} as the enacted budget does.${statutoryNote}`,
        affects: input.affects,
        benefits: input.keepBenefits ?? [],
      }),
      illustrativeOption({
        id: 'halve',
        label: `Reserve half: ${usd(half)}`,
        description: `Set aside ${usd(half)} instead of ${usd(
          r.amount,
        )}, freeing the difference for appropriation.`,
        reserve: { nonrecurring: -half },
        affects: input.affects,
        benefits: input.reduceBenefits,
        tradeoffs: input.reduceTradeoffs,
        derivation: `Half of the enacted reservation: ${usd(r.amount)} ÷ 2 = ${usd(
          half,
        )}. Reserving that much rather than the full amount frees ${usd(
          half,
        )}. Halving is a scale chosen for this exercise; no North Carolina official or institution proposed this amount.`,
        implementationNote:
          r.kind === 'statutory'
            ? `This reservation is required by statute. Reserving a different amount would take an amendment to the law that directs it, not a budget decision alone, and the programmes the fund supports carry commitments that do not scale with the reservation.`
            : `Reserving half would leave the purpose this fund exists for only partly covered. What the shortfall meant in practice would depend on what the fund was called on to do during the year, and the reserve's governing subsection sets conditions on how the money may be released.`,
        replacementNeeded: `A costed alternative to the ${r.name} for FY 2026-27 from the Governor's Recommended Budget, or a fiscal note on a bill changing this reservation.`,
        sources,
      }),
      verifiedOption({
        id: 'eliminate',
        label: 'Make no reservation',
        description: `Reserve nothing for this purpose, freeing the full ${usd(
          r.amount,
        )} for appropriation elsewhere.`,
        reserve: { nonrecurring: -r.amount },
        affects: input.affects,
        benefits: input.eliminateBenefits,
        tradeoffs: input.eliminateTradeoffs,
        note: `${usd(r.amount)} is the exact amount the act reserves for this purpose.${statutoryNote}`,
        sources,
      }),
    ],
  }
}

const UNAPPROPRIATED = BASELINE.unappropriatedBalance
const HALF_UNAPPROPRIATED = Math.round(UNAPPROPRIATED / 2)

const BALANCE_SOURCES = [
  cite('sl2026_41', 'Section 2.2(a), General Fund Availability: Unappropriated Balance Remaining'),
]

export const RESERVE_DECISIONS: Decision[] = [
  {
    id: 'unappropriated-balance',
    category: 'reserves',
    title: 'The Unappropriated Balance',
    question:
      'The enacted budget leaves money unappropriated. Should any of it be moved into the Savings Reserve instead?',
    enactedBaseline: `After reservations and appropriations, S.L. 2026-41 leaves ${usd(
      UNAPPROPRIATED,
    )} unappropriated: available, but not committed to any purpose.`,
    background:
      'An unappropriated balance is not a reserve. Money left unappropriated stays available and can be spent by a later act of the General Assembly without any special procedure. Money in the Savings Reserve is set aside, and state law governs when it may be withdrawn. Both leave the state better placed for a downturn than spending the money would, but they differ in how easily the money can be reached. This is also the pool every spending increase in this challenge draws from.',
    choices: [
      enactedOption({
        label: 'Leave the balance unappropriated',
        description: `Keep the ${usd(
          UNAPPROPRIATED,
        )} unappropriated, available for a future appropriation or to absorb a revenue shortfall.`,
        affects: [
          'Future legislatures, who can appropriate it without a withdrawal procedure',
          'The state’s position if revenue comes in below the consensus forecast',
        ],
      }),
      illustrativeOption({
        id: 'deposit-half',
        label: `Deposit half into the Savings Reserve: ${usd(HALF_UNAPPROPRIATED)}`,
        description:
          'Move half the unappropriated balance into the Savings Reserve and leave the rest uncommitted.',
        reserve: { nonrecurring: HALF_UNAPPROPRIATED },
        affects: ['The state’s reserve position', 'Programs seeking the remaining balance'],
        benefits: [
          'Strengthens reserves while keeping money available within the year for needs that emerge.',
          'Splits the difference without requiring either position to be abandoned.',
        ],
        tradeoffs: [
          'Adds less to reserves than a full deposit and leaves less uncommitted than leaving it alone.',
          'A middle position can be reversed from either direction by a later budget.',
        ],
        derivation: `Half of the enacted unappropriated balance: ${usd(UNAPPROPRIATED)} ÷ 2 = ${usd(
          HALF_UNAPPROPRIATED,
        )}. Halving is a scale chosen for this exercise; no North Carolina official or institution proposed this amount.`,
        implementationNote:
          'A transfer to the Savings Reserve is governed by G.S. 143C-4-2, which sets conditions on deposits and on when money may be withdrawn. Choosing an amount is the simple part; the constraint is that money placed in the reserve is not readily available again within the year.',
        replacementNeeded:
          'A costed proposal for the disposition of the unappropriated balance from the Governor’s Recommended Budget, or a fiscal note on a bill directing a transfer.',
        sources: BALANCE_SOURCES,
      }),
      verifiedOption({
        id: 'deposit-all',
        label: `Deposit the full balance: ${usd(UNAPPROPRIATED)}`,
        description:
          'Move the entire unappropriated balance into the Savings Reserve, leaving nothing uncommitted.',
        reserve: { nonrecurring: UNAPPROPRIATED },
        affects: [
          'The state’s reserve position in a downturn',
          'Future legislatures, who would face the statutory withdrawal process',
          'Programs seeking funding from the unappropriated balance',
        ],
        benefits: [
          'Reserves are what let a state avoid mid-year cuts when revenue falls short, and rating agencies weigh them.',
          'Setting money aside deliberately is harder to reverse than leaving it uncommitted, which is the point of a reserve.',
        ],
        tradeoffs: [
          'Leaves no cushion within the year: a shortfall would mean a withdrawal or a cut.',
          'Money in the reserve is not available for needs that emerge during the year without a withdrawal.',
        ],
        note: `${usd(
          UNAPPROPRIATED,
        )} is the unappropriated balance the act itself states, so moving all of it is exact rather than estimated.`,
        sources: BALANCE_SOURCES,
      }),
    ],
  },

  reservationDecision({
    reservationId: 'savings-reserve-discretionary',
    category: 'reserves',
    title: 'Savings Reserve Deposit',
    question: 'Should the state make the discretionary deposit into the Savings Reserve?',
    whatItFunds:
      'Section 2.2(b) directs this transfer in nonrecurring funds, on top of the smaller amount statute already requires.',
    background:
      'The Savings Reserve is North Carolina’s rainy day fund. Statute directs a share of revenue growth into it automatically; this deposit is the additional amount the General Assembly chose to make. A reserve is usually judged by how many months of operations it could cover, so the target rises as the budget grows. Deposits can only be made in years when there is money to spare.',
    affects: [
      'The state’s ability to absorb a downturn without mid-year cuts',
      'Bond rating agencies, and through them the state’s borrowing costs',
      'Programs competing for the same dollars now',
    ],
    keepBenefits: [
      'Builds the reserve in a year when the money is available, which is the only kind of year in which it can be built.',
    ],
    reduceBenefits: [
      'Frees a substantial sum for current needs while still adding to the reserve.',
      'The statutory reservation continues regardless, so the reserve still grows.',
    ],
    reduceTradeoffs: [
      'A smaller cushion means deeper cuts if revenue falls short.',
      'Deposits deferred in a good year are rarely made in a worse one.',
    ],
    eliminateBenefits: [
      'Frees the full amount for appropriation now, at a time when the reserve already holds a balance.',
      'Nonrecurring money redirected without disturbing any agency’s recurring base.',
    ],
    eliminateTradeoffs: [
      'Leaves the state more exposed to a revenue shortfall, and rating agencies weigh reserve levels.',
      'The statutory minimum would be the only deposit made this year.',
    ],
  }),

  reservationDecision({
    reservationId: 'stabilization-inflation',
    category: 'reserves',
    title: 'Stabilization and Inflation Reserve',
    question: 'Should the state keep the Stabilization and Inflation Reserve at the enacted level?',
    whatItFunds:
      'It is the single largest discretionary reservation in the budget, held against cost growth and budget pressure rather than committed to a named programme.',
    background:
      'This reserve holds money against inflation and general budget instability. Because it is discretionary and large, it functions as flexibility: money the General Assembly can direct later without having committed it to anything now. That flexibility is also the criticism of it, since money held in reserve is money not addressing a need that already exists.',
    affects: [
      'The state’s room to absorb cost growth without reopening the budget',
      'Every programme that competes for the same dollars',
      'Future legislatures, who decide how the reserve is eventually used',
    ],
    keepBenefits: [
      'Holds a cushion against cost growth that the budget has not tried to predict line by line.',
    ],
    reduceBenefits: [
      'Frees a very large sum, enough to change what is possible elsewhere in the budget.',
      'Retains a substantial cushion rather than removing it entirely.',
    ],
    reduceTradeoffs: [
      'Less room to absorb inflation without reopening the budget mid-year.',
      'The reserve exists partly because cost growth is hard to forecast, and halving it does not make it easier.',
    ],
    eliminateBenefits: [
      'Frees the largest single sum available anywhere in this exercise.',
      'Commits money to identified purposes rather than holding it against unspecified pressure.',
    ],
    eliminateTradeoffs: [
      'Removes the budget’s main shock absorber for cost growth.',
      'Unanticipated costs would have to be met from the Savings Reserve or by cutting.',
    ],
  }),
]

export const RESERVATION_DECISION_FACTORY = reservationDecision
