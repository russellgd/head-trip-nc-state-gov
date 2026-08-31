/**
 * The FY 2026-27 General Fund anchors.
 *
 * Scope, stated precisely because these numbers are easy to confuse with
 * larger ones: this is General Fund NET APPROPRIATIONS only. It excludes
 * agency receipts, federal funds, the Highway Fund, the Highway Trust Fund,
 * and every other non-General-Fund source. North Carolina's "all funds"
 * budget is far larger; mixing the two is the most common way a budget figure
 * gets misquoted.
 */
import type { Baseline } from './types'
import { cite, VERIFIED_THROUGH } from './sources'

export const BASELINE: Baseline = {
  fiscalYear: 'FY 2026-27',

  /** Total General Fund net appropriations. */
  netAppropriations: 34_374_286_763,

  /** Revised total General Fund availability. */
  totalAvailability: 35_374_286_763,

  /**
   * Availability less net appropriations. This is the money the challenge
   * starts with: dollars the enacted budget left unspent.
   */
  unappropriatedBalance: 1_000_000_000,

  verifiedThrough: VERIFIED_THROUGH,

  provisional: true,
  provisionalNote:
    'These three anchors are carried as provisional. They reconcile internally ' +
    '(availability less net appropriations equals the unappropriated balance), but they ' +
    'have not been reconciled line by line against S.L. 2026-42 and S.L. 2026-61, the two ' +
    'technical corrections acts, or against the OSBM certified budget. A technical ' +
    'correction can move an appropriation without changing the headline total, so the ' +
    'top-line figures may hold while the detail beneath them shifts.',

  sources: [
    cite('sl2026_41', 'Part I, General Fund availability and net appropriations'),
    cite('committeeReport', 'General Fund availability statement'),
  ],
}
