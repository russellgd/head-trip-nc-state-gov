/**
 * Data contract for The North Carolina Budget Challenge.
 *
 * Everything the simulation knows about North Carolina's budget lives in
 * `src/data`. No component may hard-code a dollar amount. To publish a new
 * budget year or a technical correction, edit the data files only.
 *
 * ALL MONETARY VALUES ARE INTEGER DOLLARS. Never store cents, never store
 * floats, never store "millions". `120_000_000` is one hundred twenty million
 * dollars.
 */

/** A citation to an official North Carolina government document. */
export interface Source {
  /** Document name as it is officially titled. */
  title: string
  /** Canonical URL. Must be an official NC government domain. */
  url: string
  /**
   * Where in the document the figure appears: a section number, page number,
   * table name, or committee report line. Empty string only when the figure is
   * the document's headline total.
   */
  section: string
  /** ISO date (YYYY-MM-DD) on which a human confirmed this figure in this document. */
  verifiedDate: string
}

/**
 * How much confidence stands behind a fiscal impact, and whether the engine is
 * allowed to score it.
 *
 * This describes the ARITHMETIC ONLY: whether the dollar figure can be traced.
 * It says nothing about whether anyone proposed the policy. That is a separate
 * question, answered by `Provenance` below, and conflating the two is how a
 * simulation ends up implying that a scenario it invented is a proposal
 * somebody made.
 *
 * - `verified`   The dollar amount is stated in an official NC government
 *                document cited in `sources`.
 * - `derived`    The dollar amount is arithmetic performed by this project on
 *                verified figures. `derivation` must show the work.
 * - `pending`    No official figure has been confirmed yet. NEVER scored.
 *
 * Invariant enforced by `validateDataset`: only `verified` and `derived`
 * impacts may be scored.
 */
export type VerificationStatus = 'verified' | 'derived' | 'pending'

/**
 * Where a policy option comes from, as distinct from whether its arithmetic
 * checks out.
 *
 * - `enacted`      The policy S.L. 2026-41 actually enacts. The reference point.
 * - `documented`   An alternative whose dollar impact equals an amount an
 *                  official document states. Not making a reservation the act
 *                  makes frees exactly what the act reserves. The magnitude is
 *                  documented; this does not assert that anyone proposed it.
 * - `proposal`     An alternative published in an official document with an
 *                  official fiscal estimate behind it — a Governor's
 *                  recommended budget, a fiscal note, a committee report. None
 *                  are in the dataset yet; the value exists so they can be
 *                  added without reworking the model.
 * - `illustrative` An illustrative allocation scenario: a percentage change to
 *                  an enacted amount, where THIS PROJECT chose the percentage.
 *                  Never to be described as a policy proposal, because no North
 *                  Carolina official or institution proposed it.
 */
export type Provenance = 'enacted' | 'documented' | 'proposal' | 'illustrative'

export interface Verification {
  status: VerificationStatus
  /**
   * Whether this choice's dollars enter the running balance. Enforced to be
   * false for `pending` and `illustrative`.
   */
  scored: boolean
  /** Plain-language explanation shown to the user next to the amount. */
  note: string
  /** For `derived` impacts: the arithmetic, in words, so a reader can redo it. */
  derivation?: string
}

/**
 * A fiscal effect split into its recurring and nonrecurring parts.
 *
 * Recurring dollars continue into future fiscal years and shape the structural
 * balance. Nonrecurring dollars are one-time. The two are never added together
 * for the purpose of judging structural health, though both hit the FY 2026-27
 * bottom line.
 */
export interface Money {
  /** Ongoing annual dollars. */
  recurring: number
  /** One-time dollars in FY 2026-27 only. */
  nonrecurring: number
}

export const ZERO: Money = { recurring: 0, nonrecurring: 0 }

/** The twelve budget areas the challenge is organized into. */
export type CategoryId =
  | 'k12-education'
  | 'community-colleges'
  | 'unc-system'
  | 'health-human-services'
  | 'agriculture-environment'
  | 'economic-development'
  | 'justice-public-safety'
  | 'general-government'
  | 'information-technology'
  | 'disaster-infrastructure'
  | 'revenue'
  | 'reserves'

export interface Category {
  id: CategoryId
  /** Short name used in navigation. */
  name: string
  /** One sentence on what this area funds. */
  summary: string
  /**
   * Enacted FY 2026-27 General Fund net appropriation for this area, or null
   * when it has not been confirmed against an official document. Drives the
   * overview chart; a null area is shown as "not yet verified", never as zero.
   */
  enactedNetAppropriation: number | null
  /**
   * Why `enactedNetAppropriation` is null, when it is. Some areas are funded
   * through reservations of revenue taken off the top of availability, or are
   * the revenue side itself, and so never appear in the appropriations
   * schedule. Saying that is different from saying a figure is unverified.
   */
  appropriationNote?: string
  sources: Source[]
}

/**
 * One option within a decision.
 *
 * SIGN CONVENTIONS, applied consistently everywhere:
 *   spending  positive = spends MORE General Fund money
 *   revenue   positive = raises MORE General Fund revenue
 *   reserve   positive = deposits MORE into reserves (leaves the spendable balance)
 *
 * A choice that cuts spending by $50m therefore has spending.recurring = -50_000_000.
 */
export interface Choice {
  id: string
  /** Short title, e.g. "Keep the enacted policy". */
  label: string
  /** Plain-language description of what this option actually does. */
  description: string
  /** Exactly one choice per decision must set this. Its impacts must all be zero. */
  isEnactedBaseline?: boolean
  /**
   * Where this option comes from. Drives how it is labelled and styled
   * everywhere it appears, including the results export and the printed report.
   */
  provenance: Provenance
  /**
   * Required on every illustrative option: what an across-the-board change of
   * this kind would actually run into. A percentage applied uniformly to an
   * agency total is an arithmetic device, not an implementable plan, and saying
   * so is part of presenting it honestly.
   */
  implementationNote?: string
  /**
   * Required on every illustrative option: the official proposal or fiscal
   * estimate that would replace it. Drives REPLACEMENT_INVENTORY.md.
   */
  replacementNeeded?: string
  spending: Money
  revenue: Money
  reserve: Money
  /** Who or what would likely be affected. */
  affects: string[]
  /** The strongest practical argument in favor. */
  benefits: string[]
  /** The strongest practical concern or trade-off. */
  tradeoffs: string[]
  sources: Source[]
  verification: Verification
}

export interface Decision {
  id: string
  category: CategoryId
  /** Short title for the decision card. */
  title: string
  /** The question put to the user. */
  question: string
  /** What the enacted FY 2026-27 budget currently does. */
  enactedBaseline: string
  /** Optional deeper background shown under "Learn more". */
  background?: string
  choices: Choice[]
}

/** The enacted FY 2026-27 General Fund anchors the whole simulation sits on. */
export interface Baseline {
  fiscalYear: string
  /** Total General Fund net appropriations. */
  netAppropriations: number
  /** Revised total General Fund availability. */
  totalAvailability: number
  /** Unappropriated balance remaining. The starting point of the challenge. */
  unappropriatedBalance: number
  /** ISO date through which every figure in the dataset has been checked. */
  verifiedThrough: string
  /**
   * True while these anchors have not been reconciled against every subsequent
   * technical correction. Surfaces a banner in the UI.
   */
  provisional: boolean
  provisionalNote: string
  sources: Source[]
}

export interface Dataset {
  version: string
  baseline: Baseline
  categories: Category[]
  decisions: Decision[]
}
