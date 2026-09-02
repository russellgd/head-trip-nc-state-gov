import { describe, expect, it } from 'vitest'
import { DATASET } from './index'
import { CATEGORIES } from './categories'
import {
  CLASSROOM_DECISION_IDS,
  datasetForMode,
  decisionsForMode,
  isReserveDecision,
} from './modes'
import { computeTotals } from '../engine/budget'

/**
 * The classroom selection is frozen.
 *
 * It was chosen against rules recorded in CLASSROOM_MODE_PROPOSAL.md and
 * reviewed before it was built. These tests are what stops it drifting: a
 * decision added to the dataset later cannot appear in a class period without
 * somebody deciding it should, and a rule cannot be broken quietly.
 */

const classroom = decisionsForMode(DATASET, 'classroom')
const full = decisionsForMode(DATASET, 'full')

/** Decisions the rules bar from the classroom set, and why. */
const BARRED = {
  'public-instruction': 'the $967,957,084 residual is too vague to choose from',
  'unc-need-based-aid': 'vague residual, and its sign flips against the moratorium',
  'unc-campus-operations': 'two unsupported percentages; no per-campus levels are published',
  'state-employee-pay': 'two unsupported percentages; no statewide compensation section exists',
  'tax-revenue-level': 'two unsupported percentages; no revenue section exists',
  commerce: 'two unsupported percentages, and its scope mismatch is unresolved',
  'adult-correction': 'residual whose contents are not named on the card',
} as const

describe('the frozen classroom selection', () => {
  it('contains exactly twenty decisions', () => {
    expect(CLASSROOM_DECISION_IDS).toHaveLength(20)
    expect(classroom).toHaveLength(20)
  })

  it('names only decisions that exist, each once', () => {
    expect(new Set(CLASSROOM_DECISION_IDS).size).toBe(CLASSROOM_DECISION_IDS.length)
    for (const id of CLASSROOM_DECISION_IDS) {
      expect(DATASET.decisions.some((d) => d.id === id), id).toBe(true)
    }
  })

  it('takes no more than three decisions from any one budget area', () => {
    const counts = new Map<string, number>()
    for (const decision of classroom) {
      counts.set(decision.category, (counts.get(decision.category) ?? 0) + 1)
    }
    for (const [category, count] of counts) {
      expect(count, `${count} decisions in "${category}"`).toBeLessThanOrEqual(3)
    }
  })

  it('carries no more than three reserve or unappropriated-balance decisions', () => {
    const reserves = classroom.filter((d) => isReserveDecision(d.id))
    expect(reserves.map((d) => d.id)).toEqual([
      'reservation-regional-econ-dev',
      'reservation-serdrf',
      'unappropriated-balance',
    ])
    expect(reserves.length).toBeLessThanOrEqual(3)
  })

  it('leaves out the two billion-dollar reserve levers', () => {
    // Excluded because of their size, not despite it: one click of either
    // balances almost any budget without touching a programme.
    const ids = classroom.map((d) => d.id)
    expect(ids).not.toContain('reservation-scif')
    expect(ids).not.toContain('reservation-stabilization-inflation')
  })

  it('excludes every decision the rules bar, for the reason recorded', () => {
    const ids = new Set(classroom.map((d) => d.id))
    for (const [id, reason] of Object.entries(BARRED)) {
      expect(ids.has(id), `"${id}" is in the classroom set but ${reason}`).toBe(false)
      expect(full.some((d) => d.id === id), `"${id}" should remain in the Full Challenge`).toBe(true)
    }
  })

  it('offers no decision whose only alternatives are unsupported percentages', () => {
    for (const decision of classroom) {
      const alternatives = decision.choices.filter((c) => !c.isEnactedBaseline)
      const anySourced = alternatives.some(
        (c) => c.provenance === 'proposal' || c.provenance === 'documented',
      )
      expect(anySourced, `${decision.id} offers only illustrative alternatives`).toBe(true)
    }
  })

  it('reaches at least eleven of the twelve budget areas', () => {
    const areas = new Set(classroom.map((d) => d.category))
    expect(areas.size).toBeGreaterThanOrEqual(11)
    for (const area of areas) {
      expect(CATEGORIES.some((c) => c.id === area), area).toBe(true)
    }
  })

  it('leans on published material more than the full challenge does', () => {
    const share = (decisions: typeof classroom) => {
      const options = decisions.flatMap((d) => d.choices)
      const illustrative = options.filter((c) => c.provenance === 'illustrative').length
      return illustrative / options.length
    }
    expect(share(classroom)).toBeLessThan(share(full))
  })
})

describe('a class can reach any outcome', () => {
  const dataset = datasetForMode(DATASET, 'classroom')
  const effect = (choice: (typeof classroom)[number]['choices'][number]) =>
    choice.revenue.recurring +
    choice.revenue.nonrecurring -
    (choice.spending.recurring + choice.spending.nonrecurring) -
    (choice.reserve.recurring + choice.reserve.nonrecurring)

  const extreme = (better: (a: typeof classroom[number]['choices'][number], b: typeof classroom[number]['choices'][number]) => boolean) => {
    const selections: Record<string, string> = {}
    for (const decision of classroom) {
      let winner = decision.choices[0]!
      for (const choice of decision.choices) {
        if (choice.verification.scored && better(choice, winner)) winner = choice
      }
      selections[decision.id] = winner.id
    }
    return computeTotals(dataset, selections)
  }

  it('starts at the enacted balance with nothing changed', () => {
    const totals = computeTotals(dataset, {})
    expect(totals.startingBalance).toBe(1_000_000_000)
    expect(totals.remainingBalance).toBe(1_000_000_000)
  })

  it('can reach a surplus, a deficit, and a balance between them', () => {
    const surplus = extreme((a, b) => effect(a) > effect(b)).remainingBalance
    const deficit = extreme((a, b) => effect(a) < effect(b)).remainingBalance

    expect(surplus).toBeGreaterThan(0)
    expect(deficit).toBeLessThan(0)
    // Zero inside the range is what makes balancing an achievable goal rather
    // than an accident of which decisions were kept.
    expect(deficit).toBeLessThanOrEqual(0)
    expect(surplus).toBeGreaterThanOrEqual(0)
  })
})

describe('the full challenge is a superset', () => {
  it('contains every classroom decision and more', () => {
    const fullIds = new Set(full.map((d) => d.id))
    for (const id of CLASSROOM_DECISION_IDS) expect(fullIds.has(id), id).toBe(true)
    expect(full.length).toBeGreaterThan(classroom.length)
    expect(full).toHaveLength(DATASET.decisions.length)
  })

  it('is the dataset itself, not a copy that could drift from it', () => {
    expect(datasetForMode(DATASET, 'full')).toBe(DATASET)
  })
})
