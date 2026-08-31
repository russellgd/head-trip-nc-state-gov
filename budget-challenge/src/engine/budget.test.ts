import { describe, expect, it } from 'vitest'
import {
  budgetStatus,
  choiceBalanceEffect,
  choiceMovesMoney,
  computeTotals,
  enactedChoice,
  enactedSelections,
  isBalanced,
  resolveChoice,
  type Selections,
} from './budget'
import { FIXTURE } from '../test/fixtures'
import { DATASET } from '../data'

const pick = (over: Selections = {}): Selections => ({
  ...enactedSelections(FIXTURE),
  ...over,
})

describe('enacted baseline', () => {
  it('reconciles to the published anchors when nothing is changed', () => {
    const totals = computeTotals(FIXTURE, enactedSelections(FIXTURE))

    expect(totals.remainingBalance).toBe(FIXTURE.baseline.unappropriatedBalance)
    expect(totals.spendingIncreases).toBe(0)
    expect(totals.spendingReductions).toBe(0)
    expect(totals.revenueIncreases).toBe(0)
    expect(totals.revenueReductions).toBe(0)
    expect(totals.reserveDeposits).toBe(0)
    expect(totals.reserveWithdrawals).toBe(0)
    expect(totals.structuralChange).toBe(0)
    expect(totals.changedDecisionIds).toEqual([])
  })

  it('reconciles the real dataset to its own published baseline', () => {
    const totals = computeTotals(DATASET, enactedSelections(DATASET))

    expect(totals.remainingBalance).toBe(DATASET.baseline.unappropriatedBalance)
    expect(totals.remainingBalance).toBe(1_000_000_000)
    expect(totals.structuralChange).toBe(0)
  })

  it('keeps the three published anchors internally consistent', () => {
    const { totalAvailability, netAppropriations, unappropriatedBalance } = DATASET.baseline
    expect(totalAvailability - netAppropriations).toBe(unappropriatedBalance)
  })

  it('throws rather than guessing when a decision has no enacted option', () => {
    const broken = {
      ...FIXTURE.decisions[0]!,
      choices: FIXTURE.decisions[0]!.choices.map((c) => ({ ...c, isEnactedBaseline: false })),
    }
    expect(() => enactedChoice(broken)).toThrow(/isEnactedBaseline/)
  })
})

describe('spending', () => {
  it('subtracts a spending increase from the remaining balance', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'more' }))

    expect(totals.spendingIncreases).toBe(40)
    expect(totals.spendingReductions).toBe(0)
    expect(totals.netSpending).toBe(40)
    expect(totals.remainingBalance).toBe(100 - 40)
  })

  it('adds a spending reduction back to the remaining balance', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'less' }))

    expect(totals.spendingReductions).toBe(25)
    expect(totals.spendingIncreases).toBe(0)
    expect(totals.netSpending).toBe(-25)
    expect(totals.remainingBalance).toBe(100 + 25)
  })
})

describe('revenue', () => {
  it('adds a revenue increase to the remaining balance', () => {
    const totals = computeTotals(FIXTURE, pick({ revenue: 'raise' }))

    expect(totals.revenueIncreases).toBe(55)
    expect(totals.netRevenue).toBe(55)
    expect(totals.remainingBalance).toBe(100 + 55)
  })

  it('subtracts a revenue reduction from the remaining balance', () => {
    const totals = computeTotals(FIXTURE, pick({ revenue: 'cut' }))

    expect(totals.revenueReductions).toBe(20)
    expect(totals.remainingBalance).toBe(100 - 20)
  })
})

describe('reserves', () => {
  it('treats a deposit as money leaving the spendable balance', () => {
    const totals = computeTotals(FIXTURE, pick({ reserve: 'deposit' }))

    expect(totals.reserveDeposits).toBe(60)
    expect(totals.remainingBalance).toBe(100 - 60)
  })

  it('treats a withdrawal as money returning to the spendable balance', () => {
    const totals = computeTotals(FIXTURE, pick({ reserve: 'withdraw' }))

    expect(totals.reserveWithdrawals).toBe(35)
    expect(totals.remainingBalance).toBe(100 + 35)
  })
})

describe('the governing equation', () => {
  it('matches the brief when every lever is pulled at once', () => {
    const totals = computeTotals(
      FIXTURE,
      pick({ spend: 'more', revenue: 'raise', reserve: 'deposit' }),
    )

    // baseline + revenue increases - revenue reductions - spending increases
    //          + spending reductions - reserve deposits + reserve withdrawals
    const expected = 100 + 55 - 0 - 40 + 0 - 60 + 0
    expect(totals.remainingBalance).toBe(expected)
    expect(totals.remainingBalance).toBe(55)
  })

  it('agrees with the collapsed net form of the same equation', () => {
    const totals = computeTotals(
      FIXTURE,
      pick({ spend: 'less', revenue: 'cut', reserve: 'withdraw' }),
    )

    const collapsed =
      FIXTURE.baseline.unappropriatedBalance +
      totals.netRevenue -
      totals.netSpending -
      totals.netReserve

    expect(totals.remainingBalance).toBe(collapsed)
  })
})

describe('recurring and nonrecurring amounts', () => {
  it('keeps the two apart rather than reporting only a combined total', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'more' }))

    expect(totals.spending.recurring).toBe(30)
    expect(totals.spending.nonrecurring).toBe(10)
    expect(totals.spending.total).toBe(40)
  })

  it('counts only recurring dollars toward the structural change', () => {
    // Spending 30 recurring + 10 one-time against revenue 50 recurring + 5 one-time.
    const totals = computeTotals(FIXTURE, pick({ spend: 'more', revenue: 'raise' }))

    expect(totals.structuralChange).toBe(50 - 30)
    // The one-time dollars affect the year's bottom line but not the structure.
    expect(totals.remainingBalance).toBe(100 + 55 - 40)
  })

  it('reports a one-time-only choice as no structural change at all', () => {
    const totals = computeTotals(FIXTURE, pick({ reserve: 'deposit' }))

    expect(totals.reserve.nonrecurring).toBe(60)
    expect(totals.reserve.recurring).toBe(0)
    expect(totals.structuralChange).toBe(0)
    expect(totals.remainingBalance).toBe(40)
  })

  it('can run a within-year surplus while the structural position worsens', () => {
    // A one-time revenue gain covering an ongoing commitment: balanced this
    // year, short in every year after. This is the case the structural number
    // exists to expose.
    const oneTimeRevenue = {
      ...FIXTURE,
      decisions: FIXTURE.decisions.map((d) =>
        d.id === 'revenue'
          ? {
              ...d,
              choices: d.choices.map((c) =>
                c.id === 'raise' ? { ...c, revenue: { recurring: 0, nonrecurring: 55 } } : c,
              ),
            }
          : d,
      ),
    }

    const totals = computeTotals(oneTimeRevenue, pick({ spend: 'more', revenue: 'raise' }))

    expect(totals.remainingBalance).toBeGreaterThanOrEqual(0)
    expect(totals.structuralChange).toBe(-30)
  })
})

describe('unsourced figures', () => {
  it('refuses to score a choice that is not backed by an official figure', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'unsourced' }))

    expect(totals.spendingIncreases).toBe(0)
    expect(totals.remainingBalance).toBe(100)
  })

  it('reports the omission instead of hiding it', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'unsourced' }))

    expect(totals.unscoredSelectionIds).toEqual(['spend'])
    expect(totals.changedDecisionIds).toEqual(['spend'])
  })

  it('still counts the decision as changed in its category', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'unsourced' }))
    const k12 = totals.byCategory.find((c) => c.category === 'k12-education')

    expect(k12?.changedCount).toBe(1)
    expect(k12?.spending).toBe(0)
  })
})

describe('category totals', () => {
  it('attributes each choice to its own category', () => {
    const totals = computeTotals(FIXTURE, pick({ spend: 'more', revenue: 'raise' }))

    const k12 = totals.byCategory.find((c) => c.category === 'k12-education')
    const revenue = totals.byCategory.find((c) => c.category === 'revenue')

    expect(k12?.spending).toBe(40)
    expect(k12?.balanceEffect).toBe(-40)
    expect(revenue?.revenue).toBe(55)
    expect(revenue?.balanceEffect).toBe(55)
  })

  it('has category effects that sum to the change in the balance', () => {
    const totals = computeTotals(
      FIXTURE,
      pick({ spend: 'more', revenue: 'raise', reserve: 'deposit' }),
    )
    const sum = totals.byCategory.reduce((acc, c) => acc + c.balanceEffect, 0)

    expect(totals.remainingBalance).toBe(FIXTURE.baseline.unappropriatedBalance + sum)
  })
})

describe('deficits', () => {
  it('allows a deficit rather than blocking the choice', () => {
    const bigSpend = {
      ...FIXTURE,
      decisions: FIXTURE.decisions.map((d) =>
        d.id === 'spend'
          ? {
              ...d,
              choices: d.choices.map((c) =>
                c.id === 'more' ? { ...c, spending: { recurring: 500, nonrecurring: 0 } } : c,
              ),
            }
          : d,
      ),
    }

    const totals = computeTotals(bigSpend, pick({ spend: 'more' }))

    expect(totals.remainingBalance).toBe(-400)
    expect(budgetStatus(totals.remainingBalance)).toBe('deficit')
    expect(isBalanced(totals.remainingBalance)).toBe(false)
  })

  it('treats exactly zero as balanced, not as a deficit', () => {
    expect(budgetStatus(0)).toBe('balanced')
    expect(isBalanced(0)).toBe(true)
    expect(budgetStatus(1)).toBe('surplus')
    expect(budgetStatus(-1)).toBe('deficit')
    expect(isBalanced(-1)).toBe(false)
  })
})

describe('selection handling', () => {
  it('falls back to the enacted policy when a stored choice no longer exists', () => {
    const decision = FIXTURE.decisions[0]!
    const resolved = resolveChoice(decision, { spend: 'a-choice-that-was-removed' })

    expect(resolved.id).toBe('enacted')
  })

  it('falls back to the enacted policy when a decision has no stored answer', () => {
    const decision = FIXTURE.decisions[0]!
    expect(resolveChoice(decision, {}).id).toBe('enacted')
  })

  it('lets a changed decision be changed back', () => {
    const changed = computeTotals(FIXTURE, pick({ spend: 'more' }))
    expect(changed.remainingBalance).toBe(60)

    const reverted = computeTotals(FIXTURE, pick({ spend: 'enacted' }))
    expect(reverted.remainingBalance).toBe(100)
    expect(reverted.changedDecisionIds).toEqual([])
  })
})

describe('the real dataset', () => {
  it('scores the derived reserve options exactly', () => {
    const all = computeTotals(DATASET, {
      ...enactedSelections(DATASET),
      'unappropriated-balance': 'deposit-all',
    })

    expect(all.reserveDeposits).toBe(1_000_000_000)
    expect(all.remainingBalance).toBe(0)
    expect(budgetStatus(all.remainingBalance)).toBe('balanced')

    const half = computeTotals(DATASET, {
      ...enactedSelections(DATASET),
      'unappropriated-balance': 'deposit-half',
    })

    expect(half.reserveDeposits).toBe(500_000_000)
    expect(half.remainingBalance).toBe(500_000_000)
  })

  it('treats reserve deposits as one-time, leaving the structure unchanged', () => {
    const totals = computeTotals(DATASET, {
      ...enactedSelections(DATASET),
      'unappropriated-balance': 'deposit-all',
    })

    expect(totals.reserve.nonrecurring).toBe(1_000_000_000)
    expect(totals.structuralChange).toBe(0)
  })
})

describe('per-choice effect', () => {
  it('reports what a single option would do to the balance', () => {
    const spend = FIXTURE.decisions[0]!
    const more = spend.choices.find((c) => c.id === 'more')!
    const less = spend.choices.find((c) => c.id === 'less')!

    expect(choiceBalanceEffect(more)).toBe(-40)
    expect(choiceBalanceEffect(less)).toBe(25)
  })

  it('reports zero for an option whose figure is not sourced', () => {
    const unsourced = FIXTURE.decisions[0]!.choices.find((c) => c.id === 'unsourced')!

    expect(choiceMovesMoney(unsourced)).toBe(true)
    expect(choiceBalanceEffect(unsourced)).toBe(0)
  })

  it('treats a reserve deposit as money leaving the balance', () => {
    const deposit = FIXTURE.decisions[2]!.choices.find((c) => c.id === 'deposit')!
    expect(choiceBalanceEffect(deposit)).toBe(-60)
  })
})
