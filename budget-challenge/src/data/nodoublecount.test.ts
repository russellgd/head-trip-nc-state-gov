import { describe, expect, it } from 'vitest'
import { DATASET } from './index'
import { APPROPRIATION_BASES } from './decisions/appropriations'
import { GOVERNOR_RECOMMENDATIONS } from './governor'
import { MORATORIUM } from './decisions/schoolChoice'
import { resolveChoice } from '../engine/budget'

/**
 * No two selectable options may score the same money.
 *
 * A budget simulation that lets a visitor bank the same saving twice is not
 * wrong by a rounding error; it is wrong by whatever the item is worth. These
 * tests check the three ways it could happen here: two decisions built on the
 * same enacted line, two built on the same Governor recommendation, or a
 * program-level decision overlapping the aggregate it was split out of.
 */

describe('no two decisions score the same enacted line', () => {
  it('assigns each agency appropriation to at most one decision', () => {
    // Every agency line in the act's schedule may anchor one decision only.
    const seen = new Map<string, string>()
    for (const { decisionId, agencies } of APPROPRIATION_BASES) {
      for (const agency of agencies) {
        const prior = seen.get(agency)
        expect(
          prior === undefined,
          `"${agency}" anchors both "${prior}" and "${decisionId}"`,
        ).toBe(true)
        seen.set(agency, decisionId)
      }
    }
    expect(seen.size).toBeGreaterThan(20)
  })
})

describe('no two decisions score the same Governor recommendation', () => {
  it('maps each budget code to one decision', () => {
    const seen = new Map<string, string>()
    for (const rec of GOVERNOR_RECOMMENDATIONS) {
      for (const code of rec.codes) {
        const prior = seen.get(code)
        expect(
          prior === undefined,
          `budget code ${code} is claimed by both "${prior}" and "${rec.decisionId}"`,
        ).toBe(true)
        seen.set(code, rec.decisionId)
      }
    }
  })

  it('gives each decision at most one option per provenance class that moves money', () => {
    for (const decision of DATASET.decisions) {
      const scored = decision.choices.filter(
        (c) =>
          !c.isEnactedBaseline &&
          c.verification.scored &&
          c.spending.recurring + c.spending.nonrecurring !== 0,
      )
      const proposals = scored.filter((c) => c.provenance === 'proposal')
      expect(proposals.length, `${decision.id} offers ${proposals.length} scored proposals`).toBeLessThanOrEqual(1)
    }
  })
})

describe('the Opportunity Scholarship split does not double-count', () => {
  const aggregate = DATASET.decisions.find((d) => d.id === 'unc-need-based-aid')!
  const program = DATASET.decisions.find((d) => d.id === 'opportunity-scholarships')!

  const aggregateProposal = aggregate.choices.find((c) => c.provenance === 'proposal')!
  const programProposal = program.choices.find((c) => c.provenance === 'proposal')!

  it('scores the moratorium in the program decision, at the published figures', () => {
    expect(programProposal.spending.recurring).toBe(MORATORIUM.recurring)
    expect(programProposal.spending.nonrecurring).toBe(MORATORIUM.nonrecurring)
    expect(MORATORIUM.recurring).toBe(-454_500_000)
    expect(MORATORIUM.nonrecurring).toBe(-587_500_000)
  })

  it('leaves the aggregate holding only the exactly recalculable residual', () => {
    // Enacted 16011 + 16012 = 1,377,055,397; Governor recommended = 505,470,535.
    const enacted = 443_721_892 + 933_333_505
    const recommended = 620_191_944 + -114_721_409
    const aggregateBridge = recommended - enacted
    const moratorium = MORATORIUM.recurring + MORATORIUM.nonrecurring

    expect(aggregateBridge).toBe(-871_584_862)
    expect(moratorium).toBe(-1_042_000_000)

    const residual = aggregateBridge - moratorium
    expect(residual).toBe(170_415_138)

    const scored =
      aggregateProposal.spending.recurring + aggregateProposal.spending.nonrecurring
    expect(scored).toBe(residual)
  })

  it('sums the two decisions back to the unsplit aggregate bridge', () => {
    // Choosing both options must equal the aggregate, not exceed it.
    const both =
      aggregateProposal.spending.recurring +
      aggregateProposal.spending.nonrecurring +
      programProposal.spending.recurring +
      programProposal.spending.nonrecurring

    expect(both).toBe(-871_584_862)
  })

  it('says in the aggregate’s own derivation that the moratorium was backed out', () => {
    expect(aggregateProposal.verification.derivation).toMatch(/backed out/i)
    expect(aggregateProposal.verification.derivation).toMatch(/twice/i)
  })

  it('classifies the programme as K-12 rather than by its budget code', () => {
    expect(program.category).toBe('k12-education')
    expect(program.background).toMatch(/State Education Assistance Authority/i)
    expect(program.background).toMatch(/K-12/)
  })

  it('scores the enacted option at exactly zero, as a known no-change option', () => {
    const enactedChoice = program.choices.find((c) => c.isEnactedBaseline)!
    expect(enactedChoice.verification.status).toBe('verified')
    expect(enactedChoice.verification.scored).toBe(true)
    expect(resolveChoice(program, {}).id).toBe(enactedChoice.id)
    for (const bucket of [enactedChoice.spending, enactedChoice.revenue, enactedChoice.reserve]) {
      expect(bucket.recurring).toBe(0)
      expect(bucket.nonrecurring).toBe(0)
    }
  })
})
