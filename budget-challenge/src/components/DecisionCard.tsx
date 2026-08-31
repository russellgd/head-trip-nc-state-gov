import { useId } from 'react'
import type { Choice, Decision } from '../data/types'
import { choiceBalanceEffect, choiceMovesMoney } from '../engine/budget'
import { describeDelta, formatDelta, formatDollars } from '../lib/format'
import { SourceList } from './SourceList'
import { TableScroll } from './TableScroll'
import { VerificationBadge } from './VerificationBadge'

/** What to print where the dollar impact goes. */
function ImpactLine({ choice }: { choice: Choice }) {
  if (choice.isEnactedBaseline) {
    return (
      <p className="tabular text-sm font-semibold text-navy-800">
        No change from the enacted budget
      </p>
    )
  }

  if (!choice.verification.scored) {
    // Deliberately not "$0". A zero here would read as "this option is free",
    // which is the opposite of what an absent figure means.
    return (
      <p className="text-sm font-semibold text-gold-700">Not counted in your balance</p>
    )
  }

  const effect = choiceBalanceEffect(choice)
  return (
    <p className="tabular text-sm font-semibold text-navy-800">
      <span aria-hidden="true">{formatDelta(effect)} to the balance</span>
      <span className="sr-only">{describeDelta(effect, 'change to the remaining balance')}</span>
    </p>
  )
}

function RecurringSplit({ choice }: { choice: Choice }) {
  if (!choice.verification.scored || !choiceMovesMoney(choice)) return null

  const rows: Array<[string, number, number]> = [
    ['Spending', choice.spending.recurring, choice.spending.nonrecurring],
    ['Revenue', choice.revenue.recurring, choice.revenue.nonrecurring],
    ['Reserves', choice.reserve.recurring, choice.reserve.nonrecurring],
  ]
  const shown = rows.filter(([, r, n]) => r !== 0 || n !== 0)
  if (shown.length === 0) return null

  return (
    <TableScroll label={`Scrollable table: recurring and one-time amounts for ${choice.label}`}>
    <table className="mt-3 w-full min-w-[20rem] text-left text-xs">
      <caption className="sr-only">
        Recurring and one-time amounts for this option, kept separate
      </caption>
      <thead>
        <tr className="text-muted">
          <th scope="col" className="py-1 pr-3 font-medium">
            Effect
          </th>
          <th scope="col" className="py-1 pr-3 text-right font-medium">
            Recurring
          </th>
          <th scope="col" className="py-1 text-right font-medium">
            One-time
          </th>
        </tr>
      </thead>
      <tbody className="tabular">
        {shown.map(([label, recurring, nonrecurring]) => (
          <tr key={label} className="border-t border-line">
            <th scope="row" className="py-1 pr-3 font-normal text-ink">
              {label}
            </th>
            <td className="py-1 pr-3 text-right">{formatDollars(recurring)}</td>
            <td className="py-1 text-right">{formatDollars(nonrecurring)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </TableScroll>
  )
}

function Bullets({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h4 className="text-sm font-semibold text-navy-900">{title}</h4>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export function DecisionCard({
  decision,
  selectedChoiceId,
  onChoose,
  index,
  total,
}: {
  decision: Decision
  selectedChoiceId: string
  onChoose: (choiceId: string) => void
  index: number
  total: number
}) {
  const groupId = useId()

  return (
    <article className="rounded-lg bg-white shadow-sm ring-1 ring-line">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-carolina-600">
          Decision {index} of {total}
        </p>
        <h2 className="mt-1 font-serif text-xl font-semibold sm:text-2xl">{decision.title}</h2>
        <p className="mt-2 text-base leading-relaxed text-ink">{decision.question}</p>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <div className="rounded-md bg-carolina-50 p-4 text-sm leading-relaxed ring-1 ring-carolina-100">
          <h3 className="text-sm font-semibold text-navy-900">What the enacted budget does</h3>
          <p className="mt-1 text-ink">{decision.enactedBaseline}</p>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-navy-900">
            Choose one option
            <span className="sr-only">
              {' '}
              for {decision.title}. Selecting an option updates your running balance.
            </span>
          </legend>

          <div className="mt-3 space-y-3">
            {decision.choices.map((choice) => {
              const inputId = `${groupId}-${choice.id}`
              const selected = choice.id === selectedChoiceId

              return (
                <div
                  key={choice.id}
                  className={`rounded-lg ring-1 transition-colors ${
                    selected ? 'bg-carolina-50 ring-carolina-500' : 'bg-white ring-line'
                  }`}
                >
                  <div className="flex gap-3 p-4">
                    <input
                      type="radio"
                      id={inputId}
                      name={groupId}
                      value={choice.id}
                      checked={selected}
                      onChange={() => onChoose(choice.id)}
                      className="mt-1 h-5 w-5 shrink-0 accent-carolina-600"
                    />
                    <div className="min-w-0 flex-1">
                      <label htmlFor={inputId} className="block cursor-pointer">
                        <span className="font-semibold text-navy-900">{choice.label}</span>
                        {choice.isEnactedBaseline ? (
                          <span className="ml-2 rounded bg-navy-100 px-1.5 py-0.5 text-xs font-semibold text-navy-800">
                            Enacted
                          </span>
                        ) : null}
                      </label>

                      <p className="mt-1 text-sm leading-relaxed text-ink">{choice.description}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <ImpactLine choice={choice} />
                        <VerificationBadge verification={choice.verification} />
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        {choice.verification.note}
                      </p>
                      {choice.verification.derivation ? (
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          <span className="font-semibold">How it is calculated: </span>
                          {choice.verification.derivation}
                        </p>
                      ) : null}

                      <RecurringSplit choice={choice} />

                      {choice.benefits.length > 0 ||
                      choice.tradeoffs.length > 0 ||
                      choice.affects.length > 0 ? (
                        <details className="group mt-3">
                          <summary className="cursor-pointer text-sm font-medium text-carolina-600 underline underline-offset-2 hover:text-navy-800">
                            Learn more about this option
                          </summary>
                          <div className="mt-3 space-y-3 border-l-2 border-carolina-100 pl-4">
                            <Bullets title="Who or what this affects" items={choice.affects} />
                            <Bullets title="The strongest argument in favour" items={choice.benefits} />
                            <Bullets title="The strongest concern" items={choice.tradeoffs} />
                          </div>
                        </details>
                      ) : null}

                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium text-carolina-600 underline underline-offset-2 hover:text-navy-800">
                          View sources
                        </summary>
                        <div className="mt-3 border-l-2 border-carolina-100 pl-4">
                          <SourceList sources={choice.sources} />
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </fieldset>

        {decision.background ? (
          <details className="mt-5 rounded-md bg-canvas p-4 ring-1 ring-line">
            <summary className="cursor-pointer font-medium text-navy-900">
              Background on this decision
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink">{decision.background}</p>
          </details>
        ) : null}
      </div>
    </article>
  )
}
