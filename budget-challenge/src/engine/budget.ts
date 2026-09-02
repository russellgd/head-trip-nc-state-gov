/**
 * Budget arithmetic for The North Carolina Budget Challenge.
 *
 * This module is pure: same dataset plus same selections always produces the
 * same totals. It never touches the DOM, localStorage, or the network, which is
 * what makes it straightforward to test.
 *
 * The governing equation, stated in the project brief and implemented in
 * `computeTotals` below:
 *
 *   remaining balance = baseline unappropriated balance
 *                     + revenue increases
 *                     - revenue reductions
 *                     - spending increases
 *                     + spending reductions
 *                     - additional reserve deposits
 *                     + reserve withdrawals
 *
 * Because the dataset stores signed values (see `Choice` in ../data/types), the
 * six adjustment terms collapse to:
 *
 *   remaining = baseline + netRevenue - netSpending - netReserve
 *
 * The expanded and collapsed forms are asserted to agree in the test suite.
 */
import type { CategoryId, Choice, Dataset, Decision, Money } from '../data/types'

/** A user's answers: decision id -> chosen choice id. */
export type Selections = Record<string, string>

export interface MoneyTotals {
  recurring: number
  nonrecurring: number
  total: number
}

export interface CategoryTotals {
  category: CategoryId
  spending: number
  revenue: number
  reserve: number
  /** Effect on the remaining balance: revenue - spending - reserve. */
  balanceEffect: number
  changedCount: number
}

export interface BudgetTotals {
  /** Where the challenge starts: the enacted unappropriated balance. */
  startingBalance: number

  /** Gross spending increases, as a positive number. */
  spendingIncreases: number
  /** Gross spending reductions, as a positive number. */
  spendingReductions: number
  /** increases - reductions. Positive means spending more than enacted. */
  netSpending: number

  /** Gross revenue increases, as a positive number. */
  revenueIncreases: number
  /** Gross revenue reductions, as a positive number. */
  revenueReductions: number
  /** increases - reductions. Positive means raising more than enacted. */
  netRevenue: number

  /** Gross additional reserve deposits, as a positive number. */
  reserveDeposits: number
  /** Gross reserve withdrawals, as a positive number. */
  reserveWithdrawals: number
  /** deposits - withdrawals. Positive means setting aside more than enacted. */
  netReserve: number

  /** The headline number: dollars left unappropriated after the user's choices. */
  remainingBalance: number

  /**
   * Change in the recurring (structural) position against the enacted budget:
   * recurring revenue - recurring spending - recurring reserve. Negative means
   * the user has taken on more ongoing commitments than ongoing money.
   *
   * This is a CHANGE, not an absolute structural balance. The enacted budget's
   * own recurring position is not part of the published anchors, so the
   * simulation cannot state one.
   */
  structuralChange: number

  /**
   * The mirror of structuralChange: the one-time half of the same arithmetic,
   * nonrecurring revenue - nonrecurring spending - nonrecurring reserve.
   *
   * Positive means the visitor's choices bring in more this year through
   * actions that do not repeat. It is a CHANGE against the enacted budget, not
   * a statement about the state's position, for the same reason as above.
   */
  onetimeChange: number

  spending: MoneyTotals
  revenue: MoneyTotals
  reserve: MoneyTotals

  byCategory: CategoryTotals[]

  /** Decisions where the user picked something other than the enacted policy. */
  changedDecisionIds: string[]
  /**
   * Selected choices that carry a dollar figure the engine refused to score
   * because it is not yet sourced. Surfaced in the UI so the omission is visible.
   */
  unscoredSelectionIds: string[]
}

export type BudgetStatus = 'balanced' | 'surplus' | 'deficit'

const sum = (m: Money): number => m.recurring + m.nonrecurring

/** The choice flagged as the enacted policy for a decision. */
export function enactedChoice(decision: Decision): Choice {
  const found = decision.choices.find((c) => c.isEnactedBaseline)
  if (!found) {
    throw new Error(
      `Decision "${decision.id}" has no choice marked isEnactedBaseline. ` +
        'Every decision must offer the enacted FY 2026-27 policy.',
    )
  }
  return found
}

/** Selections representing the budget exactly as enacted. */
export function enactedSelections(dataset: Dataset): Selections {
  const out: Selections = {}
  for (const decision of dataset.decisions) {
    out[decision.id] = enactedChoice(decision).id
  }
  return out
}

/**
 * Resolve a decision's selected choice, falling back to the enacted policy when
 * the stored id is missing or no longer exists (for example after a data update
 * removed an option a returning visitor had chosen).
 */
export function resolveChoice(decision: Decision, selections: Selections): Choice {
  const id = selections[decision.id]
  return decision.choices.find((c) => c.id === id) ?? enactedChoice(decision)
}

/**
 * Whether a choice's dollars count toward the running balance.
 *
 * Unsourced and illustrative figures are deliberately excluded rather than
 * quietly folded in, so the totals only ever reflect money that traces to an
 * official document.
 */
export function isScored(choice: Choice): boolean {
  return choice.verification.scored
}

export function computeTotals(dataset: Dataset, selections: Selections): BudgetTotals {
  let spendingIncreases = 0
  let spendingReductions = 0
  let revenueIncreases = 0
  let revenueReductions = 0
  let reserveDeposits = 0
  let reserveWithdrawals = 0

  const spending: MoneyTotals = { recurring: 0, nonrecurring: 0, total: 0 }
  const revenue: MoneyTotals = { recurring: 0, nonrecurring: 0, total: 0 }
  const reserve: MoneyTotals = { recurring: 0, nonrecurring: 0, total: 0 }

  const categoryMap = new Map<CategoryId, CategoryTotals>()
  for (const category of dataset.categories) {
    categoryMap.set(category.id, {
      category: category.id,
      spending: 0,
      revenue: 0,
      reserve: 0,
      balanceEffect: 0,
      changedCount: 0,
    })
  }

  const changedDecisionIds: string[] = []
  const unscoredSelectionIds: string[] = []

  for (const decision of dataset.decisions) {
    const choice = resolveChoice(decision, selections)
    const isEnacted = choice.isEnactedBaseline === true

    if (!isEnacted) changedDecisionIds.push(decision.id)

    if (!isScored(choice)) {
      // A non-enacted choice the engine will not score is worth telling the
      // user about. The enacted baseline is always zero, so silence is fine there.
      if (!isEnacted) unscoredSelectionIds.push(decision.id)
      if (!isEnacted) {
        const bucket = categoryMap.get(decision.category)
        if (bucket) bucket.changedCount += 1
      }
      continue
    }

    const s = sum(choice.spending)
    const r = sum(choice.revenue)
    const v = sum(choice.reserve)

    if (s > 0) spendingIncreases += s
    else if (s < 0) spendingReductions += -s

    if (r > 0) revenueIncreases += r
    else if (r < 0) revenueReductions += -r

    if (v > 0) reserveDeposits += v
    else if (v < 0) reserveWithdrawals += -v

    spending.recurring += choice.spending.recurring
    spending.nonrecurring += choice.spending.nonrecurring
    revenue.recurring += choice.revenue.recurring
    revenue.nonrecurring += choice.revenue.nonrecurring
    reserve.recurring += choice.reserve.recurring
    reserve.nonrecurring += choice.reserve.nonrecurring

    const bucket = categoryMap.get(decision.category)
    if (bucket) {
      bucket.spending += s
      bucket.revenue += r
      bucket.reserve += v
      bucket.balanceEffect += r - s - v
      if (!isEnacted) bucket.changedCount += 1
    }
  }

  spending.total = spending.recurring + spending.nonrecurring
  revenue.total = revenue.recurring + revenue.nonrecurring
  reserve.total = reserve.recurring + reserve.nonrecurring

  const netSpending = spendingIncreases - spendingReductions
  const netRevenue = revenueIncreases - revenueReductions
  const netReserve = reserveDeposits - reserveWithdrawals

  const startingBalance = dataset.baseline.unappropriatedBalance

  // The brief's equation, written out term by term rather than collapsed, so
  // that it reads the same way in code as it does on the methodology page.
  const remainingBalance =
    startingBalance +
    revenueIncreases -
    revenueReductions -
    spendingIncreases +
    spendingReductions -
    reserveDeposits +
    reserveWithdrawals

  const structuralChange =
    revenue.recurring - spending.recurring - reserve.recurring
  const onetimeChange =
    revenue.nonrecurring - spending.nonrecurring - reserve.nonrecurring

  return {
    startingBalance,
    spendingIncreases,
    spendingReductions,
    netSpending,
    revenueIncreases,
    revenueReductions,
    netRevenue,
    reserveDeposits,
    reserveWithdrawals,
    netReserve,
    remainingBalance,
    structuralChange,
    onetimeChange,
    spending,
    revenue,
    reserve,
    byCategory: [...categoryMap.values()],
    changedDecisionIds,
    unscoredSelectionIds,
  }
}

/**
 * A budget is balanced at zero or better. Surplus and deficit are reported
 * separately so the interface can describe the result without a value judgement.
 */
export function budgetStatus(remainingBalance: number): BudgetStatus {
  if (remainingBalance === 0) return 'balanced'
  return remainingBalance > 0 ? 'surplus' : 'deficit'
}

export function isBalanced(remainingBalance: number): boolean {
  return remainingBalance >= 0
}

/**
 * What one choice, on its own, would do to the remaining balance.
 *
 * Revenue adds to the balance; spending and reserve deposits take from it. Used
 * to show a per-option figure on the decision cards.
 */
export function choiceBalanceEffect(choice: Choice): number {
  if (!isScored(choice)) return 0
  return sum(choice.revenue) - sum(choice.spending) - sum(choice.reserve)
}

/** Whether a choice states any dollar amount at all. */
export function choiceMovesMoney(choice: Choice): boolean {
  return sum(choice.spending) !== 0 || sum(choice.revenue) !== 0 || sum(choice.reserve) !== 0
}
