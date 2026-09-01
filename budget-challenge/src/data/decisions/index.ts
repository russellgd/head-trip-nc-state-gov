import type { Decision } from '../types'
import { APPROPRIATION_DECISIONS } from './appropriations'
import { RESERVATION_DECISIONS } from './reservations'
import { REVENUE_DECISIONS } from './revenue'
import { RESERVE_DECISIONS } from './reserves'
import { SCHOOL_CHOICE_DECISIONS } from './schoolChoice'
import { PROGRAM_LEVEL_DECISIONS } from './programLevel'

/**
 * Every decision in the challenge, ordered by budget area.
 *
 * Spending areas come first, then revenue, then savings and reserves last, so
 * that a visitor has seen what their spending choices cost before deciding how
 * to pay for them.
 */
const CATEGORY_ORDER = [
  'k12-education',
  'community-colleges',
  'unc-system',
  'health-human-services',
  'agriculture-environment',
  'economic-development',
  'justice-public-safety',
  'general-government',
  'information-technology',
  'disaster-infrastructure',
  'revenue',
  'reserves',
] as const

const ALL = [
  ...APPROPRIATION_DECISIONS,
  ...SCHOOL_CHOICE_DECISIONS,
  ...PROGRAM_LEVEL_DECISIONS,
  ...RESERVATION_DECISIONS,
  ...REVENUE_DECISIONS,
  ...RESERVE_DECISIONS,
]

export const DECISIONS: Decision[] = [...ALL].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category),
)
