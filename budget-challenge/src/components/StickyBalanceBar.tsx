import { budgetOutcome, type BudgetTotals } from '../engine/budget'
import { formatChangeFromEnacted, formatDollars } from '../lib/format'
import { outcomeCopy } from '../lib/outcome'

const STYLES = {
  unchanged: 'bg-balanced-bg text-balanced ring-balanced',
  usesBalance: 'bg-navy-100 text-navy-800 ring-navy-800',
  leavesMore: 'bg-surplus-bg text-surplus ring-surplus',
  exceeds: 'bg-deficit-bg text-deficit ring-deficit',
} as const

const MARKS = { unchanged: '=', usesBalance: '\u2212', leavesMore: '+', exceeds: '!' } as const

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
  const outcome = budgetOutcome(totals)
  const copy = outcomeCopy(totals)

  return (
    <div
      aria-hidden="true"
      className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line bg-white/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden no-print"
    >
      {/*
        Both measures, primary first, in a row that wraps rather than truncates:
        a narrow screen must not be the reason a figure goes missing.
      */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <p className="text-xs text-muted">Change from enacted</p>
          <p className="tabular text-lg font-bold text-navy-900">
            {formatChangeFromEnacted(totals.changeFromEnacted)}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted">Balance remaining</p>
          <p className="tabular text-sm font-semibold text-ink">
            {formatDollars(totals.remainingBalance)}
          </p>
        </div>
        <p
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STYLES[outcome]}`}
        >
          <span className="font-bold">{MARKS[outcome]}</span> {copy.short}
        </p>
      </div>
    </div>
  )
}
