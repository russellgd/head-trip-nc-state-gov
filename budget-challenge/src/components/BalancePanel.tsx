import { useEffect, useRef, useState } from 'react'
import { budgetStatus, type BudgetTotals } from '../engine/budget'
import { describeBalance, describeDelta, formatDelta, formatDollars } from '../lib/format'

const STATUS_STYLES = {
  balanced: { bar: 'bg-balanced', chip: 'bg-balanced-bg text-balanced ring-balanced', mark: '=' },
  surplus: { bar: 'bg-surplus', chip: 'bg-surplus-bg text-surplus ring-surplus', mark: '+' },
  deficit: { bar: 'bg-deficit', chip: 'bg-deficit-bg text-deficit ring-deficit', mark: '!' },
} as const

const STATUS_WORDS = {
  balanced: 'Balanced',
  surplus: 'Balanced, with a surplus',
  deficit: 'Out of balance',
} as const

function Line({
  label,
  value,
  srValue,
  emphasis = false,
}: {
  label: string
  value: string
  srValue?: string
  emphasis?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className={`text-sm ${emphasis ? 'font-semibold text-navy-900' : 'text-muted'}`}>
        {label}
      </dt>
      <dd
        className={`tabular text-sm ${emphasis ? 'font-semibold text-navy-900' : 'text-ink'}`}
      >
        <span aria-hidden={srValue ? 'true' : undefined}>{value}</span>
        {srValue ? <span className="sr-only">{srValue}</span> : null}
      </dd>
    </div>
  )
}

/**
 * The running balance.
 *
 * Two things matter for accessibility here. The status is stated in a word
 * ("Out of balance") next to a symbol, so it never rests on the colour of the
 * bar. And every change is announced through a polite live region, phrased in
 * full sentences, because a screen reader user gets no benefit from a number
 * silently changing in the corner of the page.
 */
export function BalancePanel({ totals, compact = false }: { totals: BudgetTotals; compact?: boolean }) {
  const status = budgetStatus(totals.remainingBalance)
  const styles = STATUS_STYLES[status]

  // Announce only after an actual change, so the region does not speak on load.
  const [announcement, setAnnouncement] = useState('')
  const previous = useRef<number | null>(null)

  useEffect(() => {
    if (previous.current !== null && previous.current !== totals.remainingBalance) {
      const structural =
        totals.structuralChange === 0
          ? 'The recurring position is unchanged.'
          : `Recurring position: ${describeDelta(totals.structuralChange)}.`
      setAnnouncement(`${describeBalance(totals.remainingBalance)} ${structural}`)
    }
    previous.current = totals.remainingBalance
  }, [totals.remainingBalance, totals.structuralChange])

  return (
    <section
      aria-labelledby="balance-heading"
      className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-line print-break-inside-avoid"
    >
      <div className={`h-1.5 w-full ${styles.bar}`} aria-hidden="true" />

      <div className="p-4 sm:p-5">
        <h2 id="balance-heading" className="font-serif text-base font-semibold">
          Your running balance
        </h2>

        <p
          data-testid="remaining-balance"
          className="mt-3 text-3xl font-bold tabular text-navy-900"
        >
          {formatDollars(totals.remainingBalance)}
        </p>
        <p className="text-xs text-muted">remaining, FY 2026-27 General Fund</p>

        <p
          className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${styles.chip}`}
        >
          <span aria-hidden="true" className="font-bold">
            {styles.mark}
          </span>
          {STATUS_WORDS[status]}
        </p>

        {status === 'deficit' ? (
          <p className="mt-3 rounded-md bg-deficit-bg p-3 text-sm leading-relaxed text-deficit ring-1 ring-deficit">
            Your choices commit more than is available. A budget in this position would require
            further reductions, additional revenue, or a withdrawal from reserves. You can leave it
            here and see the result, or revisit any decision.
          </p>
        ) : null}

        {!compact ? (
          <dl className="mt-4 divide-y divide-line border-t border-line pt-1">
            <Line
              label="Recurring position"
              value={formatDelta(totals.structuralChange)}
              srValue={describeDelta(totals.structuralChange, 'change in the recurring position')}
              emphasis
            />
            <Line label="Spending increases" value={formatDollars(totals.spendingIncreases)} />
            <Line label="Spending reductions" value={formatDollars(totals.spendingReductions)} />
            <Line label="Revenue increases" value={formatDollars(totals.revenueIncreases)} />
            <Line label="Revenue reductions" value={formatDollars(totals.revenueReductions)} />
            <Line label="Reserve deposits" value={formatDollars(totals.reserveDeposits)} />
            <Line label="Reserve withdrawals" value={formatDollars(totals.reserveWithdrawals)} />
          </dl>
        ) : null}

        {totals.unscoredSelectionIds.length > 0 ? (
          <p className="mt-4 rounded-md bg-gold-100 p-3 text-xs leading-relaxed text-gold-700 ring-1 ring-gold-500">
            {totals.unscoredSelectionIds.length}{' '}
            {totals.unscoredSelectionIds.length === 1 ? 'choice you have made is' : 'choices you have made are'}{' '}
            recorded but not counted in this balance, because no official fiscal estimate for{' '}
            {totals.unscoredSelectionIds.length === 1 ? 'it' : 'them'} has been confirmed yet.
          </p>
        ) : null}
      </div>

      {/* Announces balance changes to screen readers. Visually hidden. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </section>
  )
}
