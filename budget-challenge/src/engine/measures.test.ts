import { describe, expect, it } from 'vitest'
import { DATASET } from '../data'
import { datasetForMode } from '../data/modes'
import { budgetOutcome, computeTotals, enactedSelections } from '../engine/budget'
import { outcomeCopy } from '../lib/outcome'

/**
 * The two running measures, and the rule that keeps them honest.
 *
 * The exercise teaches a comparison, so the primary figure is what the
 * visitor's choices change against the enacted budget. The secondary figure is
 * the same arithmetic stated as a level. They are one calculation seen twice —
 * the change is derived from the balance — and these tests exist to make sure
 * it stays that way rather than becoming two things that can disagree.
 */

const ENACTED = DATASET.baseline.unappropriatedBalance

describe('the primary measure starts at zero', () => {
  it('is zero for a fresh challenge with no selections at all', () => {
    const totals = computeTotals(DATASET, {})
    expect(totals.changeFromEnacted).toBe(0)
    expect(totals.startingBalance).toBe(ENACTED)
  })

  it('is zero when every decision is explicitly set to the enacted policy', () => {
    const totals = computeTotals(DATASET, enactedSelections(DATASET))
    expect(totals.changeFromEnacted).toBe(0)
  })

  it('leaves the secondary measure at the enacted unappropriated balance', () => {
    const totals = computeTotals(DATASET, {})
    expect(totals.remainingBalance).toBe(ENACTED)
    expect(totals.remainingBalance).not.toBe(totals.changeFromEnacted)
  })
})

describe('the two measures move together', () => {
  /** Teacher pay costs more than the enacted policy: a spending increase. */
  const SPENDS_MORE = { 'teacher-compensation': 'governor-schedule' }
  /** The Opportunity Scholarship moratorium spends less: a spending reduction. */
  const SPENDS_LESS = { 'opportunity-scholarships': 'governor-moratorium' }

  it('makes the change negative and cuts the balance by the same amount', () => {
    const totals = computeTotals(DATASET, SPENDS_MORE)
    expect(totals.changeFromEnacted).toBe(-136_259_101)
    expect(totals.remainingBalance).toBe(ENACTED - 136_259_101)
  })

  it('makes the change positive and raises the balance by the same amount', () => {
    const totals = computeTotals(DATASET, SPENDS_LESS)
    expect(totals.changeFromEnacted).toBe(1_042_000_000)
    expect(totals.remainingBalance).toBe(ENACTED + 1_042_000_000)
  })

  it('reconciles to the enacted balance for every reachable position', () => {
    // Not a sample: every option of every decision, one at a time, plus the
    // extremes. If the identity can be broken, it is broken here.
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        const totals = computeTotals(DATASET, { [decision.id]: choice.id })
        expect(
          totals.remainingBalance,
          `${decision.id}/${choice.id}`,
        ).toBe(totals.startingBalance + totals.changeFromEnacted)
      }
    }
  })

  it('holds the identity in both challenges', () => {
    for (const mode of ['classroom', 'full'] as const) {
      const dataset = datasetForMode(DATASET, mode)
      const everything = Object.fromEntries(
        dataset.decisions.map((d) => [d.id, d.choices[d.choices.length - 1]!.id]),
      )
      for (const selections of [{}, enactedSelections(dataset), everything]) {
        const totals = computeTotals(dataset, selections)
        expect(totals.remainingBalance, mode).toBe(
          totals.startingBalance + totals.changeFromEnacted,
        )
        expect(totals.startingBalance, mode).toBe(ENACTED)
      }
    }
  })
})

describe('a negative change is not a deficit', () => {
  const usesSome = { remainingBalance: ENACTED - 80_692_405, changeFromEnacted: -80_692_405 }

  it('classifies spending part of the enacted balance as using it', () => {
    expect(budgetOutcome(usesSome)).toBe('usesBalance')
    const copy = outcomeCopy(usesSome)
    expect(copy.isDeficit).toBe(false)
    expect(copy.sentence).toBe(
      'Your choices use $80,692,405 of the balance left by the enacted budget.',
    )
  })

  it('says nothing about a deficit while the balance is still positive', () => {
    const copy = outcomeCopy(usesSome)
    expect(`${copy.sentence} ${copy.short}`).not.toMatch(/deficit|out of balance/i)
  })

  it('treats an exactly exhausted balance as used, not exceeded', () => {
    const exact = { remainingBalance: 0, changeFromEnacted: -ENACTED }
    expect(budgetOutcome(exact)).toBe('usesBalance')
    expect(outcomeCopy(exact).isDeficit).toBe(false)
  })

  it('reports a deficit only once the balance is below zero', () => {
    const over = { remainingBalance: -1, changeFromEnacted: -ENACTED - 1 }
    expect(budgetOutcome(over)).toBe('exceeds')
    const copy = outcomeCopy(over)
    expect(copy.isDeficit).toBe(true)
    expect(copy.sentence).toBe('Your choices exceed available General Fund resources by $1.')
  })

  it('gives each of the four outcomes its own sentence', () => {
    expect(outcomeCopy({ remainingBalance: ENACTED, changeFromEnacted: 0 }).sentence).toBe(
      'Your choices match the enacted budget.',
    )
    expect(
      outcomeCopy({ remainingBalance: ENACTED + 5, changeFromEnacted: 5 }).sentence,
    ).toBe('Your choices leave $5 more available than the enacted budget.')
  })
})

describe('the reachable range still spans all three outcomes', () => {
  const extreme = (better: (a: number, b: number) => boolean) => {
    const dataset = datasetForMode(DATASET, 'classroom')
    const selections: Record<string, string> = {}
    for (const decision of dataset.decisions) {
      let winner = decision.choices[0]!
      const effect = (c: (typeof decision.choices)[number]) =>
        c.revenue.recurring +
        c.revenue.nonrecurring -
        (c.spending.recurring + c.spending.nonrecurring) -
        (c.reserve.recurring + c.reserve.nonrecurring)
      for (const choice of decision.choices) {
        if (choice.verification.scored && better(effect(choice), effect(winner))) winner = choice
      }
      selections[decision.id] = winner.id
    }
    return computeTotals(dataset, selections)
  }

  it('can still reach a surplus, a balance and a deficit', () => {
    const most = extreme((a, b) => a > b)
    const least = extreme((a, b) => a < b)

    expect(most.remainingBalance).toBeGreaterThan(0)
    expect(least.remainingBalance).toBeLessThan(0)
    expect(budgetOutcome(least)).toBe('exceeds')
    expect(most.changeFromEnacted).toBeGreaterThan(0)
    expect(least.changeFromEnacted).toBeLessThan(0)
  })
})
