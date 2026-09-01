import { describe, expect, it } from 'vitest'
import { DATASET } from './index'
import { APPROPRIATION_BASES } from './decisions/appropriations'
import { GOVERNOR_RECOMMENDATIONS } from './governor'
import { MORATORIUM } from './decisions/schoolChoice'
import {
  CORRECTIONAL_OFFICER_BRIDGE,
  TEACHER_COMPENSATION_BRIDGE,
} from './decisions/programLevel'
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

/**
 * Every programme split out of an agency aggregate, with the aggregate bridge it
 * came from. The rule each must satisfy is the same: the programme option and
 * the reduced aggregate option must sum back to the bridge that existed before
 * the split, so no money is gained or lost by splitting.
 */
const SPLITS = [
  {
    name: 'Opportunity Scholarships',
    aggregateId: 'unc-need-based-aid',
    programId: 'opportunity-scholarships',
    // Enacted 443,721,892 + 933,333,505; recommended 620,191,944 + (114,721,409).
    aggregateBridge: 620_191_944 + -114_721_409 - (443_721_892 + 933_333_505),
    programAmount: MORATORIUM.recurring + MORATORIUM.nonrecurring,
  },
  {
    name: 'Teacher and instructional support pay',
    aggregateId: 'public-instruction',
    programId: 'teacher-compensation',
    // Enacted 12,500,361,218; Governor recommended 13,604,577,403.
    aggregateBridge: 13_604_577_403 - 12_500_361_218,
    programAmount: TEACHER_COMPENSATION_BRIDGE.recurring + TEACHER_COMPENSATION_BRIDGE.nonrecurring,
  },
  {
    name: 'Correctional officer pay',
    aggregateId: 'adult-correction',
    programId: 'correctional-officer-pay',
    // Enacted 2,207,589,642; Governor recommended 2,301,698,762.
    aggregateBridge: 2_301_698_762 - 2_207_589_642,
    programAmount: CORRECTIONAL_OFFICER_BRIDGE,
  },
] as const

const scoredProposal = (decisionId: string) => {
  const decision = DATASET.decisions.find((d) => d.id === decisionId)
  if (!decision) throw new Error(`no decision "${decisionId}"`)
  const choice = decision.choices.find((c) => c.provenance === 'proposal')
  if (!choice) throw new Error(`no proposal option on "${decisionId}"`)
  return choice.spending.recurring + choice.spending.nonrecurring
}

describe.each(SPLITS)('the $name split does not double-count', (split) => {
  it('sums the programme and the residual back to the unsplit aggregate bridge', () => {
    const program = scoredProposal(split.programId)
    const residual = scoredProposal(split.aggregateId)

    expect(program).toBe(split.programAmount)
    expect(program + residual).toBe(split.aggregateBridge)
  })

  it('says in the aggregate’s derivation that the programme was backed out', () => {
    const aggregate = DATASET.decisions.find((d) => d.id === split.aggregateId)!
    const proposal = aggregate.choices.find((c) => c.provenance === 'proposal')!

    expect(proposal.verification.derivation).toMatch(/backed out/i)
    expect(proposal.verification.derivation).toMatch(/twice/i)
  })

  it('offers continuation of enacted policy as a verified zero option', () => {
    const program = DATASET.decisions.find((d) => d.id === split.programId)!
    const enacted = program.choices.find((c) => c.isEnactedBaseline)!

    expect(enacted.verification.status).toBe('verified')
    expect(enacted.verification.scored).toBe(true)
    expect(resolveChoice(program, {}).id).toBe(enacted.id)
    for (const bucket of [enacted.spending, enacted.revenue, enacted.reserve]) {
      expect(bucket.recurring).toBe(0)
      expect(bucket.nonrecurring).toBe(0)
    }
  })
})

describe('correctional officer pay', () => {
  const decision = DATASET.decisions.find((d) => d.id === 'correctional-officer-pay')!
  const proposal = decision.choices.find((c) => c.provenance === 'proposal')!

  it('scores only the incremental difference', () => {
    expect(CORRECTIONAL_OFFICER_BRIDGE).toBe(82_554_010 - 47_429_250)
    expect(CORRECTIONAL_OFFICER_BRIDGE).toBe(35_124_760)
    expect(proposal.spending.recurring).toBe(35_124_760)
    expect(proposal.spending.nonrecurring).toBe(0)
  })

  it('states both compensation percentages', () => {
    const text = `${decision.enactedBaseline} ${proposal.description}`
    expect(text).toMatch(/13%/)
    expect(text).toMatch(/15%/)
    expect(proposal.description).toMatch(/10%/)
    expect(proposal.description).toMatch(/5%/)
  })

  it('warns that the two documents cost a percentage point differently', () => {
    // 13% at $47,429,250 is $3,648,404 a point; 15% at $82,554,010 is
    // $5,503,601. Presenting the difference as the price of two points would
    // mislead, so the card has to say otherwise.
    expect(proposal.verification.note).toMatch(/per percentage point|per point/i)
    expect(proposal.verification.note).toMatch(/not be read as the price of two percentage points/i)
  })

  it('keeps probation and parole officers out of it', () => {
    expect(decision.enactedBaseline).toMatch(/Probation and parole officers are funded separately/i)
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

describe('teacher and instructional support pay', () => {
  const decision = DATASET.decisions.find((d) => d.id === 'teacher-compensation')!
  const proposal = decision.choices.find((c) => c.provenance === 'proposal')!

  it('carries the real recurring split rather than a convention', () => {
    // 734,368,000 - 514,733,062 recurring; 0 - 83,375,837 nonrecurring.
    expect(proposal.spending.recurring).toBe(219_634_938)
    expect(proposal.spending.nonrecurring).toBe(-83_375_837)
    expect(proposal.spending.recurring + proposal.spending.nonrecurring).toBe(136_259_101)
  })

  it('moves the two components in opposite directions', () => {
    // The shift from one-time money into recurring salary is the substance of
    // the choice. Collapsing it to a single net figure would hide it.
    expect(Math.sign(proposal.spending.recurring)).toBe(1)
    expect(Math.sign(proposal.spending.nonrecurring)).toBe(-1)
  })

  it('shows the shift in the structural position, not just the year', () => {
    // A recurring increase larger than the net cost is exactly the case the
    // structural measure exists to expose.
    expect(proposal.spending.recurring).toBeGreaterThan(
      proposal.spending.recurring + proposal.spending.nonrecurring,
    )
  })

  it('states both salary policies and the bonus that explains the one-time money', () => {
    const text = `${decision.enactedBaseline} ${proposal.description}`
    expect(text).toMatch(/\$48,000/)
    expect(text).toMatch(/8%/)
    expect(text).toMatch(/11%/)
    expect(decision.enactedBaseline).toMatch(/one-time bonus/i)
  })

  it('says the Governor funds a bonus in a separate item not scored here', () => {
    // Otherwise the negative nonrecurring figure reads as "the Governor cuts
    // bonuses", which is not what the documents say.
    expect(proposal.verification.note).toMatch(/separate item/i)
    expect(proposal.verification.note).toMatch(/not that the Governor proposes no bonus/i)
  })
})
