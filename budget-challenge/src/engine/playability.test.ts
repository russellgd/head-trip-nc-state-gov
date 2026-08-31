import { describe, expect, it } from 'vitest'
import { analyzePlayability } from './playability'
import { FIXTURE, choice } from '../test/fixtures'
import { DATASET } from '../data'
import type { Dataset } from '../data/types'

describe('reachable range', () => {
  it('finds the extremes across independent decisions', () => {
    // Fixture: spending +40 / -25, revenue +55 / -20, reserve +60 / -35.
    // Best case: spend less (+25), raise more (+55), withdraw (+35) = +115.
    // Worst case: spend more (-40), cut revenue (-20), deposit (-60) = -120.
    const play = analyzePlayability(FIXTURE)

    expect(play.startingBalance).toBe(100)
    expect(play.maxBalance).toBe(215)
    expect(play.minBalance).toBe(-20)
  })

  it('reports all three outcomes as reachable when they are', () => {
    const play = analyzePlayability(FIXTURE)

    expect(play.canIncreaseBalance).toBe(true)
    expect(play.canReachDeficit).toBe(true)
    expect(play.zeroWithinRange).toBe(true)
  })

  it('ignores options the engine will not score', () => {
    // The fixture's "unsourced" option carries 999,999 but is not scored, so it
    // must not widen the range.
    const play = analyzePlayability(FIXTURE)
    expect(play.minBalance).toBe(-20)
  })

  it('counts only alternatives that actually move the balance', () => {
    const play = analyzePlayability(FIXTURE)

    expect(play.scoredAlternatives).toBe(6)
    expect(play.decisionsWithScoredAlternatives).toBe(3)
  })

  it('reports a dataset with no scored alternatives as immovable', () => {
    const inert: Dataset = {
      ...FIXTURE,
      decisions: FIXTURE.decisions.map((d) => ({
        ...d,
        choices: d.choices.map((c) =>
          c.isEnactedBaseline
            ? c
            : choice({
                id: c.id,
                spending: c.spending,
                verification: { status: 'pending', scored: false, note: 'awaiting a figure' },
                sources: [],
              }),
        ),
      })),
    }

    const play = analyzePlayability(inert)

    expect(play.maxBalance).toBe(play.startingBalance)
    expect(play.minBalance).toBe(play.startingBalance)
    expect(play.canReachDeficit).toBe(false)
    expect(play.canIncreaseBalance).toBe(false)
    expect(play.scoredAlternatives).toBe(0)
  })
})

describe('the real dataset', () => {
  it('ACCEPTANCE GATE: a surplus, a balanced budget, and a deficit are all reachable', () => {
    // The check that says the challenge can actually be played end to end. If
    // any of the three outcomes becomes unreachable, the exercise stops asking
    // the visitor to balance anything, and this fails.
    const play = analyzePlayability(DATASET)

    expect(play.canIncreaseBalance).toBe(true)
    expect(play.zeroWithinRange).toBe(true)
    expect(play.canReachDeficit).toBe(true)
  })

  it('starts from the enacted unappropriated balance', () => {
    expect(analyzePlayability(DATASET).startingBalance).toBe(1_000_000_000)
  })

  it('offers a scored alternative in every decision', () => {
    const play = analyzePlayability(DATASET)
    expect(play.decisionsWithScoredAlternatives).toBe(DATASET.decisions.length)
  })
})
