/**
 * Can the challenge actually be played?
 *
 * A budget simulation is only an exercise if the person doing it can reach more
 * than one outcome. If no combination of scored options can push the balance
 * below zero, "balance the budget" is not a task, and the deficit warning is
 * unreachable scenery.
 *
 * This module answers that question from the data alone, so it can be reported
 * on and asserted against rather than assumed.
 */
import type { Dataset } from '../data/types'
import { choiceBalanceEffect, isScored } from './budget'

export interface Playability {
  startingBalance: number
  /** The highest remaining balance any combination of options can reach. */
  maxBalance: number
  /** The lowest remaining balance any combination of options can reach. */
  minBalance: number
  /** Whether a balance above the enacted starting point is reachable. */
  canIncreaseBalance: boolean
  /** Whether a deficit is reachable. Without this, the exercise has no tension. */
  canReachDeficit: boolean
  /**
   * Whether zero lies inside the reachable range. Landing on exactly zero also
   * depends on the specific amounts available, which this does not attempt to
   * solve; it reports only that balance is not ruled out by the range.
   */
  zeroWithinRange: boolean
  /** How many non-enacted options carry a figure the engine will score. */
  scoredAlternatives: number
  /** How many decisions offer at least one scored alternative. */
  decisionsWithScoredAlternatives: number
}

/**
 * The reachable range.
 *
 * Decisions are independent in this simulation, so the extremes are found by
 * taking the best and worst scored option in each decision separately. The
 * enacted option is always available and always has an effect of zero, so a
 * decision can never drag the range in a direction it does not offer.
 */
export function analyzePlayability(dataset: Dataset): Playability {
  const start = dataset.baseline.unappropriatedBalance

  let best = 0
  let worst = 0
  let scoredAlternatives = 0
  let decisionsWithScoredAlternatives = 0

  for (const decision of dataset.decisions) {
    let decisionBest = 0
    let decisionWorst = 0
    let hasScoredAlternative = false

    for (const choice of decision.choices) {
      if (choice.isEnactedBaseline || !isScored(choice)) continue

      const effect = choiceBalanceEffect(choice)
      if (effect !== 0) {
        scoredAlternatives += 1
        hasScoredAlternative = true
      }

      decisionBest = Math.max(decisionBest, effect)
      decisionWorst = Math.min(decisionWorst, effect)
    }

    if (hasScoredAlternative) decisionsWithScoredAlternatives += 1
    best += decisionBest
    worst += decisionWorst
  }

  const maxBalance = start + best
  const minBalance = start + worst

  return {
    startingBalance: start,
    maxBalance,
    minBalance,
    canIncreaseBalance: maxBalance > start,
    canReachDeficit: minBalance < 0,
    zeroWithinRange: minBalance <= 0 && maxBalance >= 0,
    scoredAlternatives,
    decisionsWithScoredAlternatives,
  }
}
