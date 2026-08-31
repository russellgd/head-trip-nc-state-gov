/**
 * Savings, reserves, and the unappropriated balance.
 *
 * These are the only decisions in this build whose dollar amounts are scored,
 * and the reason is worth stating plainly: their amounts are arithmetic on the
 * enacted unappropriated balance itself, which is one of the baseline anchors,
 * rather than estimates of what some policy would cost. Moving all or half of a
 * known $1,000,000,000 is a calculation, not a forecast.
 *
 * Every other decision in the challenge waits on an official fiscal figure.
 */
import type { Decision } from '../types'
import { BASELINE } from '../baseline'
import { cite } from '../sources'
import { derivedOption, enactedOption, unsourcedOption } from './helpers'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

/** The enacted unappropriated balance, and one half of it, in integer dollars. */
const UNAPPROPRIATED = BASELINE.unappropriatedBalance
const HALF_UNAPPROPRIATED = UNAPPROPRIATED / 2

const BALANCE_SOURCES = [
  cite('sl2026_41', 'Part I, General Fund availability statement: unappropriated balance remaining'),
  cite('committeeReport', 'General Fund availability statement'),
]

export const RESERVE_DECISIONS: Decision[] = [
  {
    id: 'unappropriated-balance',
    category: 'reserves',
    title: 'The Unappropriated Balance',
    question:
      'The enacted budget leaves money unappropriated. Should any of it be moved into the Savings Reserve instead?',
    enactedBaseline:
      'The enacted FY 2026-27 budget leaves an unappropriated balance of $1,000,000,000: money that is available but not committed to any purpose.',
    background:
      'An unappropriated balance is not the same thing as a reserve. Money left unappropriated stays available and can be spent by a later act of the General Assembly without any special procedure. Money deposited into the Savings Reserve is set aside, and North Carolina law governs when it may be withdrawn. Both leave the state better positioned for a downturn than spending the money would, but they differ in how easily the money can be reached and in what signal they send to bond rating agencies. This decision is also where the arithmetic of the whole challenge becomes visible: the unappropriated balance is the pool every other spending increase draws from.',
    choices: [
      enactedOption({
        label: 'Leave the balance unappropriated',
        description:
          'Keep the $1,000,000,000 unappropriated, available for a future appropriation or to absorb a revenue shortfall.',
        affects: [
          'Future legislatures, who can appropriate it without a withdrawal procedure',
          'The state’s position if revenue comes in below forecast',
        ],
      }),
      derivedOption({
        id: 'deposit-all',
        label: 'Deposit the full balance into the Savings Reserve',
        description:
          'Move the entire unappropriated balance into the Savings Reserve, leaving nothing uncommitted in FY 2026-27.',
        reserve: { nonrecurring: UNAPPROPRIATED },
        affects: [
          'The state’s reserve position in a downturn',
          'Future legislatures, who would face the statutory withdrawal process',
          'Programs seeking funding from the unappropriated balance',
        ],
        benefits: [
          'Reserves are what allow a state to avoid mid-year cuts when revenue falls short, and they are one of the factors rating agencies weigh.',
          'Setting money aside deliberately is harder to reverse than leaving it uncommitted, which is the point of a reserve.',
        ],
        tradeoffs: [
          'Leaves no cushion within the year itself: a shortfall would have to be met by withdrawing from the reserve or by cutting.',
          'Money in the reserve is not available for needs that emerge during the year without a withdrawal.',
        ],
        derivation:
          'Equal to the enacted unappropriated balance of $1,000,000,000. This is the balance itself, not an estimate of any policy’s cost.',
        sources: BALANCE_SOURCES,
      }),
      derivedOption({
        id: 'deposit-half',
        label: 'Deposit half the balance into the Savings Reserve',
        description:
          'Move half the unappropriated balance into the Savings Reserve and leave the rest uncommitted.',
        reserve: { nonrecurring: HALF_UNAPPROPRIATED },
        affects: [
          'The state’s reserve position',
          'Programs that might seek the remaining uncommitted balance',
        ],
        benefits: [
          'Strengthens reserves while keeping money available within the year for needs that emerge.',
          'Splits the difference between two positions without requiring either to be abandoned.',
        ],
        tradeoffs: [
          'Adds less to reserves than a full deposit, and leaves less uncommitted than leaving it alone.',
          'A middle position can be reversed from either direction by a later budget.',
        ],
        derivation:
          'One half of the enacted unappropriated balance: $1,000,000,000 ÷ 2 = $500,000,000.',
        sources: BALANCE_SOURCES,
      }),
    ],
  },
  {
    id: 'savings-reserve-deposit',
    category: 'reserves',
    title: 'Savings Reserve Deposits',
    question:
      'Should the state change the amount the enacted budget deposits into the Savings Reserve?',
    enactedBaseline:
      'The enacted budget makes deposits to the Savings Reserve at the level set in S.L. 2026-41.',
    background:
      'North Carolina law directs a share of growth in General Fund revenue toward the Savings Reserve and sets a framework for how large the reserve should be relative to the risk of a downturn. The General Assembly can deposit more than the formula directs. A reserve is judged by how many months of operations it could cover, which means the target moves as the budget grows.',
    choices: [
      enactedOption({
        description: 'Keep Savings Reserve deposits at the enacted level.',
        affects: ['The state’s downturn readiness', 'Bond rating agencies', 'Future budgets'],
      }),
      unsourcedOption({
        id: 'increase-reserve-deposit',
        label: 'Deposit more than the enacted amount',
        description:
          'Make an additional deposit to the Savings Reserve beyond what the enacted budget provides.',
        affects: ['Downturn readiness', 'Programs competing for the same dollars'],
        benefits: [
          'A larger reserve reduces the size of the cuts required when revenue falls short.',
          'Deposits made in good years are the only ones available to make.',
        ],
        tradeoffs: [
          'Money in reserve is money not addressing needs that exist now.',
          'Reserves can be withdrawn by a later legislature, so a deposit is not permanent.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-reserve-deposit',
        label: 'Deposit less than the enacted amount',
        description:
          'Reduce the deposit to the Savings Reserve and use the funds for appropriations instead.',
        affects: ['Downturn readiness', 'Programs receiving the redirected funds'],
        benefits: [
          'Frees money for current needs at a time when the reserve already holds a balance.',
          'Nonrecurring money redirected without disturbing the recurring base.',
        ],
        tradeoffs: [
          'A smaller reserve means deeper cuts if revenue falls short.',
          'Rating agencies weigh reserve levels, and rating changes affect the state’s borrowing costs.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
]
