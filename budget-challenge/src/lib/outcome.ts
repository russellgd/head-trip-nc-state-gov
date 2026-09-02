/**
 * How a running result is described in words.
 *
 * One place, so the challenge page, the results page and the exports cannot
 * drift into describing the same numbers differently. The rules encode a
 * distinction the exercise depends on: **spending part of the balance the
 * enacted budget left is not a deficit.** A visitor who uses $80 million of a
 * $1 billion balance has not overspent; the state still has $920 million
 * unappropriated. Only `exceeds` — an exhausted balance — is a deficit, and it
 * is the only sentence here permitted to say so.
 */
import { budgetOutcome, type BudgetTotals } from '../engine/budget'
import { formatDollars } from './format'

export interface OutcomeCopy {
  /** The sentence that leads the result. */
  sentence: string
  /** Two or three words for a chip or a narrow bar. */
  short: string
  /** True only where the balance is exhausted. Nothing else may say "deficit". */
  isDeficit: boolean
}

export function outcomeCopy(
  totals: Pick<BudgetTotals, 'remainingBalance' | 'changeFromEnacted'>,
): OutcomeCopy {
  const outcome = budgetOutcome(totals)
  const used = formatDollars(Math.abs(totals.changeFromEnacted))

  switch (outcome) {
    case 'unchanged':
      return {
        sentence: 'Your choices match the enacted budget.',
        short: 'Matches the enacted budget',
        isDeficit: false,
      }
    case 'usesBalance':
      return {
        sentence: `Your choices use ${used} of the balance left by the enacted budget.`,
        short: 'Uses part of the balance',
        isDeficit: false,
      }
    case 'leavesMore':
      return {
        sentence: `Your choices leave ${used} more available than the enacted budget.`,
        short: 'Leaves more available',
        isDeficit: false,
      }
    case 'exceeds':
      return {
        sentence: `Your choices exceed available General Fund resources by ${formatDollars(
          Math.abs(totals.remainingBalance),
        )}.`,
        short: 'Exceeds available resources',
        isDeficit: true,
      }
  }
}

/**
 * What one option does, said against the enacted policy rather than in the
 * abstract. The amount is the option's own effect on the balance, so the
 * wording follows the same rule as the running measures without needing to know
 * whether the option moved spending, revenue or a reserve.
 */
export function describeChoiceEffect(balanceEffect: number): string {
  if (balanceEffect === 0) return 'No change from enacted budget'
  if (balanceEffect < 0) {
    return `Uses ${formatDollars(Math.abs(balanceEffect))} compared with enacted policy`
  }
  return `Leaves ${formatDollars(balanceEffect)} more available than enacted policy`
}
