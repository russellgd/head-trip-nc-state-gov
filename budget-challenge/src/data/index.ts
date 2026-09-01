/**
 * The dataset the entire application reads from.
 *
 * Components import `DATASET` and nothing else from the data layer. Publishing
 * a new budget year means editing files under `src/data`; no component should
 * need to change.
 */
import type { Dataset } from './types'
import { BASELINE } from './baseline'
import { CATEGORIES } from './categories'
import { DECISIONS } from './decisions'

export const DATASET: Dataset = {
  /**
   * Data version. Bump when any figure changes, and add a row to the version
   * history on the methodology page.
   */
  version: '0.5.0',
  baseline: BASELINE,
  categories: CATEGORIES,
  decisions: DECISIONS,
}

export * from './types'
export { CATEGORIES, CATEGORY_BY_ID } from './categories'
export { BASELINE } from './baseline'
export { SOURCE_LEDGER, VERIFIED_THROUGH } from './sources'
export {
  validateDataset,
  errorsOnly,
  collectSources,
  verificationSummary,
  provenanceSummary,
  illustrativeOptions,
} from './validate'
