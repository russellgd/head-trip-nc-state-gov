import { budgetStatus, type BudgetTotals } from '../engine/budget'
import { formatDollars } from '../lib/format'

const WORDS = {
  balanced: 'Balanced',
  surplus: 'Surplus',
  deficit: 'Out of balance',
} as const

const STYLES = {
  balanced: 'bg-balanced-bg text-balanced ring-balanced',
  surplus: 'bg-surplus-bg text-surplus ring-surplus',
  deficit: 'bg-deficit-bg text-deficit ring-deficit',
} as const

const MARKS = { balanced: '=', surplus: '+', deficit: '!' } as const

/**
 * The balance, pinned to the top of the screen on narrow viewports where the
 * full panel sits below the decision card and would otherwise scroll away.
 *
 * Deliberately carries no live region: the full panel already announces
 * changes, and two announcements of the same number would be read twice.
 * Marked aria-hidden for the same reason, with the full panel remaining the
 * accessible source of these figures.
 */
export function StickyBalanceBar({ totals }: { totals: BudgetTotals }) {
  const status = budgetStatus(totals.remainingBalance)

  return (
    <div
      aria-hidden="true"
      className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line bg-white/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden no-print"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">Remaining balance</p>
          <p className="tabular truncate text-lg font-bold text-navy-900">
            {formatDollars(totals.remainingBalance)}
          </p>
        </div>
        <p
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STYLES[status]}`}
        >
          <span className="font-bold">{MARKS[status]}</span> {WORDS[status]}
        </p>
      </div>
    </div>
  )
}
