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
    'All three anchors have been read directly from S.L. 2026-41 and reconcile against the ' +
    'act itself: the 78 agency lines in the appropriations schedule sum to the stated total ' +
    'net appropriation, the availability statement reconciles line by line to the stated ' +
    'total availability, and availability less net appropriations equals the unappropriated ' +
    'balance. What has not been done is a comparison against S.L. 2026-42 and S.L. 2026-61, ' +
    'the two technical corrections acts, or against the OSBM certified budget, none of which ' +
    'were available to this build. A technical correction can move an appropriation without ' +
    'changing the headline total, so the top-line figures may hold while the detail beneath ' +
    'them shifts.',

  sources: [
    cite('sl2026_41', 'Section 2.1(a), Current Operations - General Fund FY 2026-2027: Total Net Appropriation'),
    cite('sl2026_41', 'Section 2.2(a), General Fund Availability: Revised, Total General Fund Availability and Unappropriated Balance Remaining'),
  ],
}
