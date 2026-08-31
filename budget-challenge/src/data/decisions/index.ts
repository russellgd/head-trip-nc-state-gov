import type { Decision } from '../types'
import { EDUCATION_DECISIONS } from './education'
import { HEALTH_DECISIONS } from './health'
import { RESOURCES_DECISIONS } from './resources'
import { GOVERNMENT_DECISIONS } from './government'
import { INFRASTRUCTURE_DECISIONS } from './infrastructure'
import { REVENUE_DECISIONS } from './revenue'
import { RESERVE_DECISIONS } from './reserves'

/**
 * Every decision in the challenge, in the order they are presented.
 *
 * Order follows the category order: spending areas first, then revenue, then
 * savings and reserves last, so that a user has seen what their spending
 * choices cost before deciding how to pay for them.
 */
export const DECISIONS: Decision[] = [
  ...EDUCATION_DECISIONS,
  ...HEALTH_DECISIONS,
  ...RESOURCES_DECISIONS,
  ...GOVERNMENT_DECISIONS,
  ...INFRASTRUCTURE_DECISIONS,
  ...REVENUE_DECISIONS,
  ...RESERVE_DECISIONS,
]
