import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, DATASET } from '../data'
import { MODES } from '../data/modes'
import { budgetOutcome, resolveChoice } from '../engine/budget'
import { useChallenge } from '../lib/challengeContext'
import { buildCsv, buildJson, downloadFile } from '../lib/export'
import {
  describeChangeFromEnacted,
  formatChangeFromEnacted,
  describeDelta,
  describeRemaining,
  formatDelta,
  formatDollars,
} from '../lib/format'
import { outcomeCopy } from '../lib/outcome'
import { Callout } from '../components/Callout'
import { TableScroll } from '../components/TableScroll'
import { Disclosure } from '../components/Disclosure'
import { OneTimeFunding } from '../components/OneTimeFunding'
import { SourceList } from '../components/SourceList'
import {
  PROVENANCE,
  PROVENANCE_MEANING,
  ProvenanceBadge,
  UnsourcedBadge,
} from '../components/ProvenanceBadge'
import type { Provenance } from '../data/types'

/**
 * What each outcome means, beyond the sentence `outcomeCopy` supplies.
 *
 * Only `exceeds` describes a budget that does not balance. Using part of the
 * balance the enacted budget left is ordinary budgeting, and this page does not
 * call it a failure.
 */
const SUMMARY = {
  unchanged:
    'Every decision sits at the enacted policy, so the budget you built is the budget the General Assembly enacted, and the unappropriated balance is untouched.',
  usesBalance:
    'The enacted budget left money unappropriated, and your choices draw on part of it. What is left would stay unappropriated, available for a later appropriation or to absorb a revenue shortfall.',
  leavesMore:
    'Your choices commit less than the enacted budget did, so more is left unappropriated than the General Assembly left. That money would be available for a later appropriation or to absorb a revenue shortfall.',
  exceeds:
    'Your choices commit more than is available. A budget in this position would have to be closed with further reductions, additional revenue, or a withdrawal from reserves before it could be enacted.',
} as const

function StatTile({
  label,
  value,
  srValue,
  note,
}: {
  label: string
  value: string
  srValue?: string
  note?: string
}) {
  // Rendered inside a <dl>, so this has to be a <dt>/<dd> pair rather than a
  // stack of paragraphs.
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-line print-break-inside-avoid">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd>
        <span className="mt-1 block tabular text-2xl font-bold text-navy-900">
          <span aria-hidden={srValue ? 'true' : undefined}>{value}</span>
          {srValue ? <span className="sr-only">{srValue}</span> : null}
        </span>
        {note ? (
          <span className="mt-1 block text-xs leading-relaxed text-muted">{note}</span>
        ) : null}
      </dd>
    </div>
  )
}

export function Results() {
  // Everything on this page is scoped to the challenge the visitor is on. A
  // results page that counted decisions the visitor was never shown would be
  // reporting on somebody else's exercise.
  const { selections, totals, reset, mode, decisions, dataset } = useChallenge()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const outcome = outcomeCopy(totals)
  const { baseline } = DATASET

  const changed = decisions.filter((d) => totals.changedDecisionIds.includes(d.id))

  const byProvenance = decisions.reduce<Record<string, number>>((counts, decision) => {
    const { provenance } = resolveChoice(decision, selections)
    counts[provenance] = (counts[provenance] ?? 0) + 1
    return counts
  }, {})

  const illustrativeCount = byProvenance.illustrative ?? 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">Your Budget</h1>
      <p className="mt-2 text-sm text-muted">
        {baseline.fiscalYear} General Fund &middot; data verified through {baseline.verifiedThrough}{' '}
        &middot; dataset version {DATASET.version}
      </p>

      <section
        aria-labelledby="provenance-notice"
        className="mt-6 rounded-lg bg-white p-5 shadow-sm ring-1 ring-gold-500 print-break-inside-avoid"
      >
        <h2 id="provenance-notice" className="font-serif text-lg font-semibold">
          How to read these choices
        </h2>
        <p className="mt-2 leading-relaxed text-ink">
          Some choices reflect enacted or formally proposed policies. Others are illustrative
          percentage changes designed to demonstrate budget trade-offs.{' '}
          <strong>
            Illustrative choices should not be interpreted as proposals made by any North Carolina
            official or institution.
          </strong>
        </p>
        <p className="mt-2 leading-relaxed text-ink">
          {illustrativeCount === 0
            ? 'None of the options you selected is an illustrative scenario.'
            : `${illustrativeCount} of the ${decisions.length} options you selected ${
                illustrativeCount === 1 ? 'is an illustrative scenario' : 'are illustrative scenarios'
              }. Each is marked below.`}
        </p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {(['enacted', 'documented', 'illustrative'] as Provenance[]).map((provenance) => (
            <div key={provenance} className={`border-l-4 pl-3 ${PROVENANCE[provenance].stripe}`}>
              <dt className="text-sm font-semibold text-navy-900">
                <span aria-hidden="true">{PROVENANCE[provenance].glyph} </span>
                {PROVENANCE[provenance].label}
                <span className="ml-1 font-normal text-muted">
                  ({byProvenance[provenance] ?? 0} selected)
                </span>
              </dt>
              <dd className="mt-1 text-xs leading-relaxed text-muted">
                {PROVENANCE_MEANING[provenance]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The result describes the budget, never the person who built it. */}
      <section
        aria-labelledby="outcome"
        className="mt-6 rounded-lg bg-white p-6 shadow-sm ring-1 ring-line print-break-inside-avoid"
      >
        {/* Leads with what the visitor changed, not with a verdict on them. */}
        <h2 id="outcome" className="font-serif text-2xl font-semibold">
          {outcome.sentence}
        </h2>
        <p className="mt-2 leading-relaxed text-ink">{SUMMARY[budgetOutcome(totals)]}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <StatTile
            label="Change from enacted budget"
            value={formatChangeFromEnacted(totals.changeFromEnacted)}
            srValue={describeChangeFromEnacted(totals.changeFromEnacted)}
            note="What your decisions change, measured against the enacted budget. Zero means your budget matches it."
          />
          <StatTile
            label="Unappropriated balance remaining"
            value={formatDollars(totals.remainingBalance)}
            srValue={describeRemaining(totals.remainingBalance)}
            note={`The enacted budget started with ${formatDollars(
              totals.startingBalance,
            )} unappropriated. That amount plus your change from the enacted budget is what remains.`}
          />
        </dl>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <StatTile
            label="Change in recurring position"
            value={formatDelta(totals.structuralChange)}
            srValue={describeDelta(totals.structuralChange, 'change in the recurring position')}
            note="Recurring revenue less recurring spending and reserve commitments, measured against the enacted budget. One-time money is excluded."
          />
          <StatTile
            label="Change from one-time actions"
            value={formatDelta(totals.onetimeChange)}
            srValue={describeDelta(totals.onetimeChange, 'change from one-time actions')}
            note="The same arithmetic on the one-time amounts. Recurring and one-time changes carry different implications for later years."
          />
        </dl>
      </section>

      <OneTimeFunding totals={totals} decisions={decisions} selections={selections} />

      <section aria-labelledby="changes" className="mt-10">
        <h2 id="changes" className="font-serif text-2xl font-semibold">
          What changed
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile label="Spending increases" value={formatDollars(totals.spendingIncreases)} />
          <StatTile label="Spending reductions" value={formatDollars(totals.spendingReductions)} />
          <StatTile label="Revenue increases" value={formatDollars(totals.revenueIncreases)} />
          <StatTile label="Revenue reductions" value={formatDollars(totals.revenueReductions)} />
          <StatTile label="Reserve deposits" value={formatDollars(totals.reserveDeposits)} />
          <StatTile label="Reserve withdrawals" value={formatDollars(totals.reserveWithdrawals)} />
        </dl>

        <h3 className="mt-8 font-serif text-xl font-semibold">
          Recurring and one-time amounts, kept apart
        </h3>
        <TableScroll label="Scrollable table: recurring and one-time amounts">
        <table className="mt-3 w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">
            Recurring and one-time components of your spending, revenue, and reserve changes
          </caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Effect
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-navy-900">
                Recurring
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-navy-900">
                One-time
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-navy-900">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="tabular">
            {[
              ['Spending', totals.spending],
              ['Revenue', totals.revenue],
              ['Reserves', totals.reserve],
            ].map(([label, money]) => {
              const m = money as typeof totals.spending
              return (
                <tr key={label as string} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-normal text-ink">
                    {label as string}
                  </th>
                  <td className="py-2 pr-4 text-right">{formatDelta(m.recurring)}</td>
                  <td className="py-2 pr-4 text-right">{formatDelta(m.nonrecurring)}</td>
                  <td className="py-2 text-right font-semibold">{formatDelta(m.total)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </TableScroll>
      </section>

      <section aria-labelledby="by-area" className="mt-10">
        <h2 id="by-area" className="font-serif text-2xl font-semibold">
          Changes by budget area
        </h2>
        <TableScroll label="Scrollable table: changes by budget area">
        <table className="mt-4 w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">
            Effect of your choices on the remaining balance, by budget area
          </caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Budget area
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-navy-900">
                Decisions changed
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-navy-900">
                Effect on the balance
              </th>
            </tr>
          </thead>
          <tbody className="tabular">
            {CATEGORIES.map((category) => {
              const row = totals.byCategory.find((c) => c.category === category.id)
              return (
                <tr key={category.id} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-normal text-ink">
                    {category.name}
                  </th>
                  <td className="py-2 pr-4 text-right">{row?.changedCount ?? 0}</td>
                  <td className="py-2 text-right">
                    <span aria-hidden="true">{formatDelta(row?.balanceEffect ?? 0)}</span>
                    <span className="sr-only">
                      {describeDelta(row?.balanceEffect ?? 0, 'effect on the balance')}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </TableScroll>
      </section>

      <section aria-labelledby="comparison" className="mt-10">
        <h2 id="comparison" className="font-serif text-2xl font-semibold">
          Compared with the enacted budget
        </h2>
        <TableScroll label="Scrollable table: your budget compared with the enacted budget">
        <table className="mt-4 w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Your budget beside the enacted budget</caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Measure
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-navy-900">
                Enacted
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-navy-900">
                Yours
              </th>
            </tr>
          </thead>
          <tbody className="tabular">
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal text-ink">
                Unappropriated balance remaining
              </th>
              <td className="py-2 pr-4 text-right">{formatDollars(baseline.unappropriatedBalance)}</td>
              <td className="py-2 text-right font-semibold">
                {formatDollars(totals.remainingBalance)}
              </td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal text-ink">
                Net General Fund spending
              </th>
              <td className="py-2 pr-4 text-right">{formatDollars(baseline.netAppropriations)}</td>
              <td className="py-2 text-right font-semibold">
                {formatDollars(baseline.netAppropriations + totals.netSpending)}
              </td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal text-ink">
                Total General Fund availability
              </th>
              <td className="py-2 pr-4 text-right">{formatDollars(baseline.totalAvailability)}</td>
              <td className="py-2 text-right font-semibold">
                {formatDollars(baseline.totalAvailability + totals.netRevenue)}
              </td>
            </tr>
            <tr>
              <th scope="row" className="py-2 pr-4 font-normal text-ink">
                Decisions differing from the enacted budget
              </th>
              <td className="py-2 pr-4 text-right">0</td>
              <td className="py-2 text-right font-semibold">{changed.length}</td>
            </tr>
          </tbody>
        </table>
        </TableScroll>
      </section>

      {totals.unscoredSelectionIds.length > 0 ? (
        <div className="mt-8">
          <Callout tone="caution" title="Some of your choices are not reflected in these totals">
            <p>
              You chose an option on {totals.unscoredSelectionIds.length}{' '}
              {totals.unscoredSelectionIds.length === 1 ? 'decision' : 'decisions'} for which no
              official fiscal estimate has been confirmed. Those choices are recorded below and in
              your download, but they are not counted in the balance. Counting them would mean
              putting a number on this page that no document supports.
            </p>
          </Callout>
        </div>
      ) : null}

      <section aria-labelledby="all-choices" className="mt-10">
        <h2 id="all-choices" className="font-serif text-2xl font-semibold">
          Every choice you made
        </h2>
        <p className="mt-2 text-sm text-muted">
          All {decisions.length} decisions in the {MODES[mode].name}, in order. Decisions you
          left at the enacted
          policy are included so the record is complete.
        </p>

        <ol className="mt-4 space-y-3">
          {decisions.map((decision) => {
            const choice = resolveChoice(decision, selections)
            const category = CATEGORIES.find((c) => c.id === decision.category)
            const isEnacted = choice.isEnactedBaseline === true

            return (
              <li
                key={decision.id}
                className={`rounded-lg border-l-4 p-4 ring-1 print-break-inside-avoid ${
                  PROVENANCE[choice.provenance].stripe
                } ${isEnacted ? 'bg-white ring-line' : 'bg-carolina-50 ring-carolina-400'}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-carolina-600">
                  {category?.name}
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-semibold">{decision.title}</h3>
                <p className="mt-1 text-sm text-ink">
                  <span className="font-semibold">You chose: </span>
                  {choice.label}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <ProvenanceBadge provenance={choice.provenance} />
                  {choice.verification.scored ? null : <UnsourcedBadge />}
                  {choice.verification.scored ? (
                    <span className="tabular text-sm text-ink">
                      <span aria-hidden="true">
                        {formatDelta(
                          choice.revenue.recurring +
                            choice.revenue.nonrecurring -
                            (choice.spending.recurring + choice.spending.nonrecurring) -
                            (choice.reserve.recurring + choice.reserve.nonrecurring),
                        )}{' '}
                        to the balance
                      </span>
                      <span className="sr-only">
                        {describeDelta(
                          choice.revenue.recurring +
                            choice.revenue.nonrecurring -
                            (choice.spending.recurring + choice.spending.nonrecurring) -
                            (choice.reserve.recurring + choice.reserve.nonrecurring),
                          'change to the balance',
                        )}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-gold-700">Not counted in the balance</span>
                  )}
                </div>
                {choice.provenance === 'illustrative' ? (
                  <p className="mt-2 text-xs leading-relaxed text-gold-700">
                    <span className="font-semibold">Illustrative allocation scenario. </span>
                    {PROVENANCE_MEANING.illustrative}
                  </p>
                ) : null}

                {/*
                  Collapsed on screen, open on paper: the printed report is the
                  record a reader keeps, and it has to carry the working.
                */}
                <Disclosure label="Sources and calculation" tone="quiet">
                  {choice.verification.note ? (
                    <p className="text-xs leading-relaxed text-ink">{choice.verification.note}</p>
                  ) : null}
                  {choice.verification.derivation ? (
                    <p className="text-xs leading-relaxed text-ink">
                      <span className="font-semibold">How it is calculated: </span>
                      {choice.verification.derivation}
                    </p>
                  ) : null}
                  {choice.implementationNote ? (
                    <p className="text-xs leading-relaxed text-gold-700">
                      <span className="font-semibold">
                        What this would run into in practice:{' '}
                      </span>
                      {choice.implementationNote}
                    </p>
                  ) : null}
                  {choice.replacementNeeded ? (
                    <p className="text-xs leading-relaxed text-muted">
                      <span className="font-semibold">What would replace this scenario: </span>
                      {choice.replacementNeeded}
                    </p>
                  ) : null}
                  <SourceList sources={choice.sources} />
                </Disclosure>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="actions" className="mt-10 no-print">
        <h2 id="actions" className="font-serif text-2xl font-semibold">
          Take this with you
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-navy-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Print this report
          </button>
          <button
            type="button"
            onClick={() =>
              downloadFile(
                'nc-budget-challenge.json',
                buildJson(dataset, selections, totals),
                'application/json',
              )
            }
            className="rounded-md bg-white px-5 py-2.5 font-medium text-navy-900 ring-1 ring-line transition-colors hover:bg-navy-100"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={() =>
              downloadFile('nc-budget-challenge.csv', buildCsv(dataset, selections, totals), 'text/csv')
            }
            className="rounded-md bg-white px-5 py-2.5 font-medium text-navy-900 ring-1 ring-line transition-colors hover:bg-navy-100"
          >
            Download CSV
          </button>
          <Link
            to="/challenge"
            className="rounded-md bg-white px-5 py-2.5 font-medium text-navy-900 ring-1 ring-line transition-colors hover:bg-navy-100"
          >
            Go back and revise
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-line">
          <h3 className="font-serif text-base font-semibold">Start over</h3>
          <p className="mt-1 text-sm text-muted">
            Returns every decision to the enacted policy and clears the answers saved in this
            browser.
          </p>
          {confirmingReset ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  reset()
                  setConfirmingReset(false)
                }}
                className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Yes, start over
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-navy-900 ring-1 ring-line hover:bg-navy-100"
              >
                Keep my answers
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-navy-900 ring-1 ring-line hover:bg-navy-100"
            >
              Start over
            </button>
          )}
        </div>
      </section>

      <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-muted">
        This report describes budget choices, not the person who made them. An independent
        educational project; not a publication of the State of North Carolina. See the{' '}
        <Link className="font-medium text-carolina-600 underline underline-offset-2" to="/methodology">
          methodology and sources
        </Link>{' '}
        for where each figure comes from and what is not yet settled.
      </p>
    </div>
  )
}
