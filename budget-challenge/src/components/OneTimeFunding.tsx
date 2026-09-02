import type { Decision } from '../data/types'
import { resolveChoice, type BudgetTotals, type Selections } from '../engine/budget'
import { describeDelta, formatDelta, formatDollars } from '../lib/format'
import { Disclosure } from './Disclosure'

/**
 * What next year inherits.
 *
 * A budget can be balanced this year with money that does not repeat while
 * taking on commitments that do. Nothing else on the results page shows that as
 * one fact, because the remaining balance is a single-year number and says
 * nothing about the year after.
 *
 * WHAT THIS DELIBERATELY DOES NOT SAY. It does not call anything a structural
 * deficit. That would mean comparing recurring revenue with recurring
 * obligations across the whole budget, and this project holds neither: the act
 * publishes an appropriation level and an availability statement that mixes
 * recurring collections with reversions, transfers and prior-year cash, and no
 * source here separates them. Claiming a structural deficit would require
 * inventing a recurring revenue baseline, which is exactly the sort of
 * manufactured figure the rest of the project refuses.
 *
 * What it does say is arithmetic on figures each option already carries with a
 * citation: how the visitor's recurring commitments changed, how much one-time
 * money they used, and which options carried it.
 */
export function OneTimeFunding({
  totals,
  decisions,
  selections,
}: {
  totals: BudgetTotals
  decisions: Decision[]
  selections: Selections
}) {
  const recurring = totals.structuralChange
  const onetime = totals.onetimeChange

  // Shown only where the two halves point in opposite directions. Where they
  // agree there is nothing here a reader cannot already see in the balance.
  const diverging = recurring < 0 && onetime > 0
  if (!diverging) return null

  const carriers = decisions
    .map((decision) => ({ decision, choice: resolveChoice(decision, selections) }))
    .filter(({ choice }) => {
      if (!choice.verification.scored || choice.isEnactedBaseline) return false
      const nonrecurring =
        choice.revenue.nonrecurring - choice.spending.nonrecurring - choice.reserve.nonrecurring
      return nonrecurring > 0
    })

  return (
    <section
      aria-labelledby="one-time-heading"
      className="mt-6 rounded-lg bg-white p-5 shadow-sm ring-1 ring-gold-500 print-break-inside-avoid"
      data-testid="one-time-funding"
    >
      <h2 id="one-time-heading" className="font-serif text-xl font-semibold">
        This year&rsquo;s balance and next year&rsquo;s position
      </h2>

      <p className="mt-2 leading-relaxed text-ink">
        Your choices commit the state to{' '}
        <strong className="tabular font-semibold">{formatDollars(Math.abs(recurring))}</strong> more
        each year than the enacted budget, while providing{' '}
        <strong className="tabular font-semibold">{formatDollars(onetime)}</strong> in this year
        only. <span className="sr-only">{describeDelta(recurring, 'change in recurring position')}.</span>
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-canvas p-3 ring-1 ring-line">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Recurring changes, which repeat every year
          </dt>
          <dd className="tabular mt-1 text-lg font-semibold text-navy-900">
            <span aria-hidden="true">{formatDelta(recurring)}</span>
            <span className="sr-only">
              {describeDelta(recurring, 'change in the recurring position')}
            </span>
          </dd>
        </div>
        <div className="rounded-md bg-canvas p-3 ring-1 ring-line">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            One-time changes, which apply this year only
          </dt>
          <dd className="tabular mt-1 text-lg font-semibold text-navy-900">
            <span aria-hidden="true">{formatDelta(onetime)}</span>
            <span className="sr-only">
              {describeDelta(onetime, 'change from one-time actions')}
            </span>
          </dd>
        </div>
      </dl>

      {carriers.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-navy-900">
            The one-time money came from {carriers.length === 1 ? 'this choice' : 'these choices'}
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink">
            {carriers.map(({ decision, choice }) => (
              <li key={decision.id}>
                <span className="font-medium">{decision.title}:</span> {choice.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 rounded-md bg-gold-100 p-3 text-sm leading-relaxed text-gold-700 ring-1 ring-gold-500">
        <strong className="font-semibold">What this does not tell you. </strong>
        This says nothing about whether the state&rsquo;s finances are in balance over the longer
        run. Answering that would mean comparing recurring revenue with recurring obligations across
        the whole budget, and this exercise does not carry the figures to do it. What it does show
        is that a balance reached partly with one-time money starts the next year with the recurring
        commitments still in place.
      </p>

      <Disclosure label="How these two figures are calculated" tone="quiet">
        <p className="text-xs leading-relaxed text-ink">
          Every option in the dataset stores its recurring and one-time amounts separately, each
          with its own citation. The recurring figure is recurring revenue less recurring spending
          less recurring reserve deposits, summed over the options you selected; the one-time figure
          is the same arithmetic on the one-time amounts. Both are changes measured against the
          enacted budget, not absolute positions, and no recurring revenue baseline is assumed or
          constructed anywhere in this calculation.
        </p>
      </Disclosure>
    </section>
  )
}
