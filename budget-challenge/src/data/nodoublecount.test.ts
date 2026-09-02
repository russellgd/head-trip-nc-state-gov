import { describe, expect, it } from 'vitest'
import { DATASET } from './index'
import { APPROPRIATION_BASES } from './decisions/appropriations'
import { GOVERNOR_RECOMMENDATIONS } from './governor'
import { MORATORIUM } from './decisions/schoolChoice'
import {
  CORRECTIONAL_OFFICER_BRIDGE,
  HEALTH_BENEFITS_RESIDUAL_ITEMS,
  MEDICAID_REBASE_BRIDGE,
  TEACHER_COMPENSATION_BRIDGE,
  UNC_ENROLLMENT_BRIDGE,
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
 * Every agency aggregate that has had programmes split out of it, with the
 * bridge that existed before any split and the programmes taken from it.
 *
 * The rule is the same however many programmes come out of one aggregate: the
 * programme options and the reduced aggregate option must sum back to the
 * original bridge, so that splitting neither gains nor loses money. Grouping by
 * aggregate rather than by programme is what makes that hold for the UNC codes,
 * where two programmes are now scored separately.
 */
const AGGREGATES = [
  {
    name: 'UNC Board of Governors codes',
    aggregateId: 'unc-need-based-aid',
    // Enacted 443,721,892 + 933,333,505; recommended 620,191,944 + (114,721,409).
    aggregateBridge: 620_191_944 + -114_721_409 - (443_721_892 + 933_333_505),
    programs: [
      {
        name: 'Opportunity Scholarships',
        programId: 'opportunity-scholarships',
        amount: MORATORIUM.recurring + MORATORIUM.nonrecurring,
      },
      {
        name: 'UNC enrollment funding',
        programId: 'unc-enrollment-growth',
        amount: UNC_ENROLLMENT_BRIDGE.recurring + UNC_ENROLLMENT_BRIDGE.nonrecurring,
      },
    ],
  },
  {
    name: 'Department of Public Instruction',
    aggregateId: 'public-instruction',
    // Enacted 12,500,361,218; Governor recommended 13,604,577,403.
    aggregateBridge: 13_604_577_403 - 12_500_361_218,
    programs: [
      {
        name: 'Teacher and instructional support pay',
        programId: 'teacher-compensation',
        amount:
          TEACHER_COMPENSATION_BRIDGE.recurring + TEACHER_COMPENSATION_BRIDGE.nonrecurring,
      },
    ],
  },
  {
    name: 'Department of Adult Correction',
    aggregateId: 'adult-correction',
    // Enacted 2,207,589,642; Governor recommended 2,301,698,762.
    aggregateBridge: 2_301_698_762 - 2_207_589_642,
    programs: [
      {
        name: 'Correctional officer pay',
        programId: 'correctional-officer-pay',
        amount: CORRECTIONAL_OFFICER_BRIDGE,
      },
    ],
  },
  {
    name: 'DHHS Health Benefits',
    aggregateId: 'medicaid-health-benefits',
    // Enacted 7,455,886,869; Governor recommended 7,627,688,832.
    aggregateBridge: 7_627_688_832 - 7_455_886_869,
    programs: [
      { name: 'Medicaid rebase', programId: 'medicaid-rebase', amount: MEDICAID_REBASE_BRIDGE },
    ],
  },
] as const

const SPLITS = AGGREGATES.flatMap((a) =>
  a.programs.map((p) => ({ name: p.name, aggregateId: a.aggregateId, programId: p.programId })),
)


const scoredProposal = (decisionId: string) => {
  const decision = DATASET.decisions.find((d) => d.id === decisionId)
  if (!decision) throw new Error(`no decision "${decisionId}"`)
  const choice = decision.choices.find((c) => c.provenance === 'proposal')
  if (!choice) throw new Error(`no proposal option on "${decisionId}"`)
  return choice.spending.recurring + choice.spending.nonrecurring
}

describe.each(AGGREGATES)('the $name aggregate does not double-count', (aggregate) => {
  it('sums every programme split from it, plus the residual, back to the original bridge', () => {
    const residual = scoredProposal(aggregate.aggregateId)
    let total = residual

    for (const program of aggregate.programs) {
      const scored = scoredProposal(program.programId)
      expect(scored, program.name).toBe(program.amount)
      total += scored
    }

    expect(total).toBe(aggregate.aggregateBridge)
  })
})

describe.each(SPLITS)('the $name split does not double-count', (split) => {
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
    // Two programmes are now scored separately out of these codes, so both come
    // off the aggregate before the residual is what is left.
    const enacted = 443_721_892 + 933_333_505
    const recommended = 620_191_944 + -114_721_409
    const aggregateBridge = recommended - enacted
    const moratorium = MORATORIUM.recurring + MORATORIUM.nonrecurring
    const enrollment = UNC_ENROLLMENT_BRIDGE.recurring + UNC_ENROLLMENT_BRIDGE.nonrecurring

    expect(aggregateBridge).toBe(-871_584_862)
    expect(moratorium).toBe(-1_042_000_000)
    expect(enrollment).toBe(-384_488)

    const residual = aggregateBridge - moratorium - enrollment
    expect(residual).toBe(170_799_626)

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

describe('the Medicaid rebase', () => {
  const decision = DATASET.decisions.find((d) => d.id === 'medicaid-rebase')!
  const proposal = decision.choices.find((c) => c.provenance === 'proposal')!
  const enacted = decision.choices.find((c) => c.isEnactedBaseline)!
  const aggregate = DATASET.decisions.find((d) => d.id === 'medicaid-health-benefits')!
  const residual = aggregate.choices.find((c) => c.provenance === 'proposal')!

  const allText = (d: (typeof DATASET)['decisions'][number]) =>
    [
      d.title,
      d.question,
      d.enactedBaseline,
      d.background,
      ...d.choices.flatMap((c) => [
        c.label,
        c.description,
        ...c.affects,
        ...c.benefits,
        ...c.tradeoffs,
        c.verification.note ?? '',
        c.verification.derivation ?? '',
      ]),
    ].join(' ')

  it('sums with the residual to the original Health Benefits agency bridge', () => {
    expect(MEDICAID_REBASE_BRIDGE).toBe(1_047_197_722 - 847_200_000)
    expect(MEDICAID_REBASE_BRIDGE).toBe(199_997_722)

    const residualAmount = residual.spending.recurring + residual.spending.nonrecurring
    expect(residualAmount).toBe(-28_195_759)
    expect(MEDICAID_REBASE_BRIDGE + residualAmount).toBe(7_627_688_832 - 7_455_886_869)
    expect(MEDICAID_REBASE_BRIDGE + residualAmount).toBe(171_801_963)
  })

  it('is scored by one decision only', () => {
    // Nothing else in the dataset may move the rebase amount, and no other card
    // may claim to be scoring it.
    const scoringIt = DATASET.decisions.filter((d) =>
      d.choices.some(
        (c) =>
          c.verification.scored &&
          c.spending.recurring + c.spending.nonrecurring === MEDICAID_REBASE_BRIDGE,
      ),
    )
    expect(scoringIt.map((d) => d.id)).toEqual(['medicaid-rebase'])

    const claimingIt = DATASET.decisions.filter(
      (d) => d.id !== 'medicaid-rebase' && /Medicaid [Rr]ebase/.test(allText(d)),
    )
    for (const d of claimingIt) {
      // Mentioning it is allowed only to say it is scored somewhere else.
      expect(allText(d), `${d.id} mentions the rebase without backing it out`).toMatch(
        /backed out/i,
      )
    }
  })

  it('is entirely recurring on both options', () => {
    expect(proposal.spending.recurring).toBe(199_997_722)
    expect(proposal.spending.nonrecurring).toBe(0)
    expect(proposal.spending.recurring + proposal.spending.nonrecurring).toBe(
      proposal.spending.recurring,
    )
    expect(enacted.spending.nonrecurring).toBe(0)
  })

  it('gives the enacted option a complete verification record at zero', () => {
    expect(enacted.verification.status).toBe('verified')
    expect(enacted.verification.scored).toBe(true)
    expect(enacted.verification.note).toBeTruthy()
    expect(enacted.verification.note).toMatch(/measured as a change from the enacted budget/i)
    expect(resolveChoice(decision, {}).id).toBe(enacted.id)
    for (const bucket of [enacted.spending, enacted.revenue, enacted.reserve]) {
      expect(bucket.recurring).toBe(0)
      expect(bucket.nonrecurring).toBe(0)
    }
    // "Continue the enacted policy", never "amount unknown": the card states
    // the enacted amount even though the scored impact is zero.
    expect(enacted.label).toMatch(/\$847,200,000/)
    expect(decision.enactedBaseline).toMatch(/\$847,200,000/)
  })

  it('never describes the rebase as an expansion or a new benefit', () => {
    // The words may appear, but only to deny that this is one. Any sentence
    // using them without a negation would be asserting the opposite.
    const sentences = allText(decision).split(/(?<=[.?!])\s+/)
    const claims = sentences.filter(
      (sentence) =>
        /expansion|expand(s|ed|ing)?\b|new benefit/i.test(sentence) &&
        !/\b(not|nothing|neither|nor|never|does not|without)\b/i.test(sentence),
    )
    expect(claims, claims.join('\n')).toEqual([])
    expect(decision.background).toMatch(/existing Medicaid programme/i)
    expect(decision.background).toMatch(/enrollment/i)
    expect(decision.background).toMatch(/capitation/i)
    expect(decision.background).toMatch(/federal match/i)
  })

  it('claims no shortfall outcome for either amount', () => {
    const text = allText(decision)
    expect(text).not.toMatch(/will (create|cause|prevent|avoid) a shortfall/i)
    expect(proposal.verification.note).toMatch(
      /neither document states that either amount would create or prevent a shortfall/i,
    )
  })

  it('does not present the residual as one policy proposal', () => {
    const note = residual.verification.note ?? ''
    expect(note).toMatch(/not a Medicaid reduction that anyone proposed/i)
    expect(note).toMatch(/net of items each budget funds and the other does not/i)
    expect(residual.tradeoffs.join(' ')).toMatch(/not one policy/i)

    // Every item the audit identifies has to reach the card by name.
    for (const item of [
      ...HEALTH_BENEFITS_RESIDUAL_ITEMS.enactedOnly,
      ...HEALTH_BENEFITS_RESIDUAL_ITEMS.governorOnly,
      ...HEALTH_BENEFITS_RESIDUAL_ITEMS.explicitGovernorReductions,
    ]) {
      expect(note, `residual note omits "${item.title}"`).toContain(item.title)
    }
  })

  it('drops the rebase from the items the residual says it is built from', () => {
    // A residual described as built from an item scored on another card is the
    // double count this split exists to prevent, in prose rather than in maths.
    expect(residual.description).not.toMatch(/Medicaid Rebase/)
  })
})

describe('UNC enrollment funding', () => {
  const decision = DATASET.decisions.find((d) => d.id === 'unc-enrollment-growth')!
  const proposal = decision.choices.find((c) => c.provenance === 'proposal')!
  const enacted = decision.choices.find((c) => c.isEnactedBaseline)!

  it('scores the difference in each component separately', () => {
    // 153,495,386 - 107,504,366 recurring; 0 - 46,375,508 nonrecurring.
    expect(proposal.spending.recurring).toBe(45_991_020)
    expect(proposal.spending.nonrecurring).toBe(-46_375_508)
    expect(proposal.spending.recurring + proposal.spending.nonrecurring).toBe(-384_488)
  })

  it('is a durability decision, not a level decision', () => {
    // The whole point: the net is trivial and the shift between components is
    // large. If those two ever came to resemble each other, the card's framing
    // would be wrong and this test should fail.
    const net = Math.abs(proposal.spending.recurring + proposal.spending.nonrecurring)
    const shift = Math.abs(proposal.spending.nonrecurring)
    expect(shift).toBeGreaterThan(net * 100)
  })

  it('shows the split rather than a single net figure', () => {
    expect(Math.sign(proposal.spending.recurring)).toBe(1)
    expect(Math.sign(proposal.spending.nonrecurring)).toBe(-1)
  })

  it('states both amounts on the enacted side so no figure is hidden', () => {
    expect(decision.enactedBaseline).toMatch(/\$107,504,366/)
    expect(decision.enactedBaseline).toMatch(/\$46,375,508/)
    expect(enacted.label).toMatch(/\$107,504,366/)
    expect(enacted.verification.status).toBe('verified')
    expect(enacted.verification.scored).toBe(true)
    expect(resolveChoice(decision, {}).id).toBe(enacted.id)
  })

  it('discloses that the two documents describe the enrolment measure differently', () => {
    expect(proposal.verification.note).toMatch(/resident student credit hours/i)
    expect(proposal.verification.note).toMatch(/total student credit hours/i)
    expect(proposal.verification.note).toMatch(/not the same measure/i)
  })

  it('avoids claiming enrollment is permanent', () => {
    const text = [
      decision.background,
      decision.enactedBaseline,
      ...decision.choices.flatMap((c) => [
        c.description,
        ...c.benefits,
        ...c.tradeoffs,
        c.verification.note ?? '',
      ]),
    ].join(' ')

    // Enrollment-related instructional costs are generally ongoing. Enrollment
    // itself is not, and the card must not say otherwise.
    expect(text).not.toMatch(/permanent enrollment|permanent enrolment/i)
    expect(text).not.toMatch(/do not un-?enroll/i)
    expect(decision.background).toMatch(/generally ongoing/i)
    expect(decision.background).toMatch(/[Ee]nrollment itself can change/i)
  })
})
