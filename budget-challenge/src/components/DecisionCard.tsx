import { useId } from 'react'
import type { Choice, Decision } from '../data/types'
import { choiceBalanceEffect, choiceMovesMoney } from '../engine/budget'
import { formatDollars } from '../lib/format'
import { describeChoiceEffect } from '../lib/outcome'
import { SourceList } from './SourceList'
import { TableScroll } from './TableScroll'
import { PROVENANCE, PROVENANCE_MEANING, ProvenanceBadge, UnsourcedBadge } from './ProvenanceBadge'
import { Disclosure } from './Disclosure'

/**
 * What one option does, stated against the enacted policy.
 *
 * Every option is a comparison, so the wording says so in plain language rather
 * than leaving a reader to interpret a signed number against an unstated
 * reference. The same sentence serves sighted and screen-reader users, so there
 * is no second phrasing to drift out of step.
 */
function ImpactLine({ choice }: { choice: Choice }) {
  if (choice.isEnactedBaseline) {
    return (
      <p className="tabular text-sm font-semibold text-navy-800">No change from enacted budget</p>
    )
  }

  if (!choice.verification.scored) {
    // Deliberately not "$0". A zero here would read as "this option is free",
    // which is the opposite of what an absent figure means.
    return (
      <p className="text-sm font-semibold text-gold-700">Not counted in your balance</p>
    )
  }

  return (
    <p className="tabular text-sm font-semibold text-navy-800">
      {describeChoiceEffect(choiceBalanceEffect(choice))}
    </p>
  )
}

/** The buckets an option moves, as [label, recurring, one-time] rows. */
function moneyRows(choice: Choice): Array<[string, number, number]> {
  return (
    [
      ['Spending', choice.spending.recurring, choice.spending.nonrecurring],
      ['Revenue', choice.revenue.recurring, choice.revenue.nonrecurring],
      ['Reserves', choice.reserve.recurring, choice.reserve.nonrecurring],
    ] as Array<[string, number, number]>
  ).filter(([, r, n]) => r !== 0 || n !== 0)
}

/**
 * Whether the recurring split is *material* to the choice in front of the
 * reader, meaning the option carries both recurring and one-time money.
 *
 * That is the case worth the space of a table: a change that shifts money
 * between the two, or commits recurring money while spending one-time money,
 * leaves the state somewhere different next year than the single net figure
 * suggests. Where an option is wholly one or the other, a word says it.
 */
function splitIsMaterial(choice: Choice): boolean {
  const rows = moneyRows(choice)
  const recurring = rows.some(([, r]) => r !== 0)
  const nonrecurring = rows.some(([, , n]) => n !== 0)
  return recurring && nonrecurring
}

/** "Recurring" or "One-time" — the shape of the money, in one word. */
function TimingTag({ choice }: { choice: Choice }) {
  if (!choice.verification.scored || !choiceMovesMoney(choice)) return null
  const rows = moneyRows(choice)
  const recurring = rows.some(([, r]) => r !== 0)
  const nonrecurring = rows.some(([, , n]) => n !== 0)
  const text = recurring && nonrecurring ? 'Recurring and one-time' : recurring ? 'Recurring' : 'One-time'
  return (
    <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink ring-1 ring-line">
      {text}
    </span>
  )
}

function RecurringSplit({ choice }: { choice: Choice }) {
  if (!choice.verification.scored || !choiceMovesMoney(choice)) return null

  const shown = moneyRows(choice)
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

/**
 * The single strongest concern about an option, shown without being asked for.
 *
 * A budget exercise that puts the costs behind a disclosure teaches that
 * choices are free. The rest of the arguments can wait; one line of what this
 * gives up cannot.
 */
function MainConcern({ choice }: { choice: Choice }) {
  const concern = choice.tradeoffs[0]
  if (!concern) return null
  return (
    <p className="mt-3 text-sm leading-relaxed text-ink">
      <span className="font-semibold text-navy-900">The strongest concern: </span>
      {concern}
    </p>
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
                  className={`rounded-lg border-l-4 ring-1 transition-colors ${
                    PROVENANCE[choice.provenance].stripe
                  } ${selected ? 'bg-carolina-50 ring-carolina-500' : 'bg-white ring-line'}`}
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
                      </label>

                      <p className="mt-1 text-sm leading-relaxed text-ink">{choice.description}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <ImpactLine choice={choice} />
                        <ProvenanceBadge provenance={choice.provenance} />
                        <TimingTag choice={choice} />
                        {choice.verification.scored ? null : <UnsourcedBadge />}
                      </div>

                      {/*
                        The recurring split earns its table only where the option
                        carries both kinds of money. Everywhere else the tag above
                        says which it is, and the table waits in the panel below.
                      */}
                      {splitIsMaterial(choice) ? <RecurringSplit choice={choice} /> : null}

                      {/*
                        Never collapsed. A reader must not have to open anything
                        to learn that nobody proposed this.
                      */}
                      {choice.provenance === 'illustrative' ? (
                        <p className="mt-3 rounded-md bg-gold-100 p-3 text-xs leading-relaxed text-gold-700 ring-1 ring-gold-500">
                          <span className="font-semibold">Illustrative allocation scenario. </span>
                          {PROVENANCE_MEANING.illustrative}
                        </p>
                      ) : null}

                      <MainConcern choice={choice} />

                      {choice.benefits.length > 0 ||
                      choice.tradeoffs.length > 0 ||
                      choice.affects.length > 0 ? (
                        <Disclosure label="Who this affects, and the arguments">
                          <Bullets title="Who or what this affects" items={choice.affects} />
                          <Bullets title="The strongest argument in favour" items={choice.benefits} />
                          <Bullets title="The strongest concern" items={choice.tradeoffs} />
                        </Disclosure>
                      ) : null}

                      <Disclosure label="Sources and calculation" tone="quiet">
                        {choice.verification.note ? (
                          <p className="text-xs leading-relaxed text-ink">
                            {choice.verification.note}
                          </p>
                        ) : null}
                        {choice.verification.derivation ? (
                          <p className="text-xs leading-relaxed text-ink">
                            <span className="font-semibold">How it is calculated: </span>
                            {choice.verification.derivation}
                          </p>
                        ) : null}
                        {choice.implementationNote ? (
                          <p className="rounded-md bg-gold-100 p-3 text-xs leading-relaxed text-gold-700 ring-1 ring-gold-500">
                            <span className="font-semibold">
                              What this would run into in practice:{' '}
                            </span>
                            {choice.implementationNote}
                          </p>
                        ) : null}
                        {choice.replacementNeeded ? (
                          <p className="text-xs leading-relaxed text-muted">
                            <span className="font-semibold">
                              What would replace this scenario:{' '}
                            </span>
                            {choice.replacementNeeded}
                          </p>
                        ) : null}
                        {splitIsMaterial(choice) ? null : <RecurringSplit choice={choice} />}
                        <SourceList sources={choice.sources} />
                      </Disclosure>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </fieldset>

        {decision.background ? (
          <div className="mt-5 rounded-md bg-canvas p-4 ring-1 ring-line">
            <Disclosure label="Background on this decision">
              <p className="text-sm leading-relaxed text-ink">{decision.background}</p>
            </Disclosure>
          </div>
        ) : null}
      </div>
    </article>
  )
}
