/**
 * Builders for policy choices.
 *
 * These exist so that each decision file reads as policy content rather than as
 * bookkeeping, and so the verification rules are applied the same way every
 * time instead of being retyped per choice.
 */
import type { Choice, Money, Source } from '../types'

const zero = (): Money => ({ recurring: 0, nonrecurring: 0 })

/**
 * The "keep the enacted policy" option.
 *
 * Every impact is zero because the enacted budget is the point all other
 * options are measured from, not because the enacted budget costs nothing.
 */
export function enactedOption(input: {
  label?: string
  description: string
  affects: string[]
  benefits?: string[]
  tradeoffs?: string[]
}): Choice {
  return {
    id: 'enacted',
    label: input.label ?? 'Keep the enacted policy',
    description: input.description,
    isEnactedBaseline: true,
    spending: zero(),
    revenue: zero(),
    reserve: zero(),
    affects: input.affects,
    benefits: input.benefits ?? [],
    tradeoffs: input.tradeoffs ?? [],
    provenance: 'enacted',
    sources: [],
    verification: {
      status: 'verified',
      scored: true,
      note:
        'This is the reference point. Its impact is zero by definition, because every ' +
        'other option on this card is measured as a change from the enacted budget.',
    },
  }
}

/**
 * An alternative whose direction is well documented but whose dollar amount has
 * not been confirmed against an official North Carolina source in this build.
 *
 * It is deliberately not scored. The interface shows "not yet sourced" in place
 * of an amount rather than showing $0, which would misread as "this is free".
 */
export function unsourcedOption(input: {
  id: string
  label: string
  description: string
  affects: string[]
  benefits: string[]
  tradeoffs: string[]
  /** Which document would settle the amount, in plain language. */
  wouldBeSourcedBy: string
}): Choice {
  return {
    id: input.id,
    label: input.label,
    description: input.description,
    spending: zero(),
    revenue: zero(),
    reserve: zero(),
    affects: input.affects,
    benefits: input.benefits,
    tradeoffs: input.tradeoffs,
    provenance: 'proposal',
    sources: [],
    verification: {
      status: 'pending',
      scored: false,
      note: `No official fiscal estimate for this option has been confirmed. ${input.wouldBeSourcedBy} Until that figure is in the dataset, choosing this option records your preference but does not move the balance.`,
    },
  }
}

/**
 * An illustrative allocation scenario.
 *
 * The dollar figure is exact arithmetic on a sourced amount, and the working is
 * shown. The POLICY is not from any document: this project chose the
 * percentage, and nobody in North Carolina proposed it. Everything about how
 * these are labelled follows from that, which is why the builder demands an
 * implementation note and a statement of what would replace it.
 */
export function illustrativeOption(input: {
  id: string
  label: string
  description: string
  spending?: Partial<Money>
  revenue?: Partial<Money>
  reserve?: Partial<Money>
  affects: string[]
  benefits: string[]
  tradeoffs: string[]
  derivation: string
  /** What a change of this shape would actually run into in practice. */
  implementationNote: string
  /** The official proposal or fiscal estimate that would replace this option. */
  replacementNeeded: string
  sources: Source[]
}): Choice {
  return {
    id: input.id,
    label: input.label,
    description: input.description,
    spending: { ...zero(), ...input.spending },
    revenue: { ...zero(), ...input.revenue },
    reserve: { ...zero(), ...input.reserve },
    affects: input.affects,
    benefits: input.benefits,
    tradeoffs: input.tradeoffs,
    provenance: 'illustrative',
    implementationNote: input.implementationNote,
    replacementNeeded: input.replacementNeeded,
    sources: input.sources,
    verification: {
      status: 'derived',
      scored: true,
      note:
        'The dollar amount is exact arithmetic on a sourced figure, shown below. The ' +
        'change itself is a scenario constructed for this exercise: no North Carolina ' +
        'official or institution proposed it.',
      derivation: input.derivation,
    },
  }
}

/**
 * An option whose amount is stated in an official document exactly as used.
 */
export function verifiedOption(input: {
  id: string
  label: string
  description: string
  spending?: Partial<Money>
  revenue?: Partial<Money>
  reserve?: Partial<Money>
  affects: string[]
  benefits: string[]
  tradeoffs: string[]
  note: string
  sources: Source[]
}): Choice {
  return {
    id: input.id,
    label: input.label,
    description: input.description,
    spending: { ...zero(), ...input.spending },
    revenue: { ...zero(), ...input.revenue },
    reserve: { ...zero(), ...input.reserve },
    affects: input.affects,
    benefits: input.benefits,
    tradeoffs: input.tradeoffs,
    provenance: 'documented',
    sources: input.sources,
    verification: { status: 'verified', scored: true, note: input.note },
  }
}

/** Format an integer dollar amount for use inside generated prose. */
export const usd = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)

/**
 * A percentage of a verified enacted appropriation.
 *
 * Used for spending decisions, where the act establishes what an agency
 * receives but publishes no costed alternative to it. The percentage is this
 * project's, chosen to give a reader a sense of scale; the dollar figure that
 * follows is exact arithmetic on a sourced number, and the working is shown on
 * the option so a reader can check it and judge it for themselves.
 */
export function percentOf(base: number, percent: number): number {
  return Math.round((base * percent) / 100)
}

/**
 * An alternative published in an official document that both proposes the
 * change and prices it.
 *
 * The arithmetic status stays `derived` where the scored figure is the
 * difference between two published levels rather than a number lifted straight
 * off the page: the levels are verified, the subtraction is this project's, and
 * the working is shown. What makes it a `proposal` rather than an illustrative
 * scenario is that somebody actually proposed it.
 */
export function proposalOption(input: {
  id: string
  label: string
  description: string
  spending?: Partial<Money>
  revenue?: Partial<Money>
  reserve?: Partial<Money>
  affects: string[]
  benefits: string[]
  tradeoffs: string[]
  derivation: string
  /** How the proposal's own published figures relate to the scored amount. */
  note: string
  sources: Source[]
}): Choice {
  return {
    id: input.id,
    label: input.label,
    description: input.description,
    spending: { ...zero(), ...input.spending },
    revenue: { ...zero(), ...input.revenue },
    reserve: { ...zero(), ...input.reserve },
    affects: input.affects,
    benefits: input.benefits,
    tradeoffs: input.tradeoffs,
    provenance: 'proposal',
    sources: input.sources,
    verification: {
      status: 'derived',
      scored: true,
      note: input.note,
      derivation: input.derivation,
    },
  }
}
