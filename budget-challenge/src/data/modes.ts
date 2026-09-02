/**
 * Two ways through the same dataset.
 *
 * The Full Challenge carries every decision and the whole documentary record.
 * The Classroom Challenge is a curated path through the same figures, chosen to
 * fit a class period. It is not a simplified dataset: every decision in it is
 * the same decision, with the same amounts and the same citations, and the two
 * modes share one set of answers so a visitor can move between them without
 * losing work.
 *
 * The classroom list is FROZEN. It was selected against rules recorded in
 * CLASSROOM_MODE_PROPOSAL.md and reviewed before implementation: at most three
 * decisions from any one budget area, at most three reserve decisions, no
 * decision whose only alternatives are unsupported percentages, and no vague
 * aggregate residual. `modes.test.ts` enforces every one of those, so a later
 * addition to the dataset cannot quietly drift into or out of the classroom set.
 */
import type { Dataset, Decision } from './types'

export type ModeId = 'classroom' | 'full'

/**
 * The twenty, in the order a class meets them.
 *
 * The order runs education, health, environment, economy, justice, government,
 * revenue, and finally what to do with the balance, so the exercise ends on the
 * decision the rest of it has been building toward.
 */
export const CLASSROOM_DECISION_IDS = [
  'teacher-compensation',
  'opportunity-scholarships',
  'residential-schools',
  'community-college-system',
  'unc-enrollment-growth',
  'medicaid-rebase',
  'behavioral-health',
  'child-development',
  'environmental-quality',
  'natural-cultural-resources',
  'reservation-regional-econ-dev',
  'correctional-officer-pay',
  'courts',
  'indigent-defense',
  'elections',
  'information-technology-operations',
  'reservation-serdrf',
  'tax-revenue-adjustments',
  'nontax-revenue-adjustments',
  'unappropriated-balance',
] as const

/** Reserve and unappropriated-balance decisions, for the cap the rules impose. */
export const RESERVE_DECISION_PREFIXES = ['reservation-', 'unappropriated-balance'] as const

export const isReserveDecision = (id: string): boolean =>
  RESERVE_DECISION_PREFIXES.some((p) => id.startsWith(p))

export interface Mode {
  id: ModeId
  name: string
  /** One line, shown wherever the visitor picks between them. */
  summary: string
  /** How long it takes, in plain language. */
  duration: string
}

export const MODES: Record<ModeId, Mode> = {
  classroom: {
    id: 'classroom',
    name: 'Classroom Challenge',
    summary:
      'Twenty decisions spanning eleven budget areas, chosen so a class can finish in one period. Every figure is the same as in the full version.',
    duration: 'about 30 to 35 minutes',
  },
  full: {
    id: 'full',
    name: 'Full Challenge',
    summary:
      'Every decision in the dataset, including the agency aggregates and the reserves left out of the classroom set. For longer workshops and independent study.',
    duration: 'about an hour',
  },
}

export const DEFAULT_MODE: ModeId = 'classroom'

/** The decisions a mode presents, in the order it presents them. */
export function decisionsForMode(dataset: Dataset, mode: ModeId): Decision[] {
  if (mode === 'full') return dataset.decisions

  const byId = new Map(dataset.decisions.map((d) => [d.id, d]))
  return CLASSROOM_DECISION_IDS.map((id) => {
    const decision = byId.get(id)
    if (!decision) throw new Error(`Classroom mode names a decision that does not exist: "${id}"`)
    return decision
  })
}

/** The same dataset, narrowed to one mode, for the engine and the exports. */
export function datasetForMode(dataset: Dataset, mode: ModeId): Dataset {
  if (mode === 'full') return dataset
  return { ...dataset, decisions: decisionsForMode(dataset, mode) }
}

export const isModeId = (value: unknown): value is ModeId =>
  value === 'classroom' || value === 'full'
