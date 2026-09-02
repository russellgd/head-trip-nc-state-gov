import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, DATASET } from '../data'
import { CLASSROOM_DECISION_IDS, MODES } from '../data/modes'
import { resolveChoice } from '../engine/budget'
import { formatDollars } from '../lib/format'
import { useChallenge } from '../lib/challengeContext'
import { BalancePanel } from '../components/BalancePanel'
import { DecisionCard } from '../components/DecisionCard'
import { StickyBalanceBar } from '../components/StickyBalanceBar'
import { ProvenanceLegend } from '../components/ProvenanceLegend'
import { ModePicker } from '../components/ModePicker'

const DECISION_COUNTS = {
  classroom: CLASSROOM_DECISION_IDS.length,
  full: DATASET.decisions.length,
}

export function Challenge() {
  const { selections, totals, choose, reset, changedCount, mode, setMode, decisions } =
    useChallenge()
  const DECISIONS = decisions
  const [index, setIndex] = useState(0)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const headingRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  // The classroom set is shorter than the full one, so an index that was valid
  // a moment ago may not be after a switch. Clamping rather than resetting
  // keeps a visitor roughly where they were.
  const safeIndex = Math.min(index, DECISIONS.length - 1)
  const decision = DECISIONS[safeIndex]!
  const category = CATEGORIES.find((c) => c.id === decision.category)

  // Moving between decisions replaces the whole card, so focus is sent to the
  // new card. Without this a keyboard or screen reader user lands back at the
  // top of the document on every step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [safeIndex])

  /** Where each category's first decision sits, for the category navigation. */
  const categoryStarts = useMemo(() => {
    const starts = new Map<string, number>()
    DECISIONS.forEach((d, i) => {
      if (!starts.has(d.category)) starts.set(d.category, i)
    })
    return starts
  }, [DECISIONS])

  const answeredCount = changedCount
  const progressPercent = Math.round(((safeIndex + 1) / DECISIONS.length) * 100)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Narrow screens only; the full panel takes over from the lg breakpoint. */}
      <StickyBalanceBar totals={totals} />

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">The Challenge</h1>
        <Link
          to="/results"
          className="text-sm font-medium text-carolina-600 underline underline-offset-2 hover:text-navy-800"
        >
          Skip to your results
        </Link>
      </div>

      <p className="mt-2 max-w-3xl leading-relaxed text-muted">
        Each card offers the enacted policy and one or more alternatives. Your balance updates as
        soon as you choose. You can move back and forth freely, and change any answer at any time.
      </p>

      <p className="mt-2 max-w-3xl leading-relaxed text-ink">
        The enacted budget is the reference point. It leaves{' '}
        {formatDollars(DATASET.baseline.unappropriatedBalance)} unappropriated. As you make choices,
        the first figure shows what your decisions change; the second shows how much remains
        available.
      </p>

      <p className="mt-2 max-w-3xl text-sm text-muted">
        You are on the <strong className="font-semibold text-navy-900">{MODES[mode].name}</strong>:{' '}
        {DECISIONS.length} decisions, {MODES[mode].duration}. Both challenges use the same figures
        and the same sources; you can switch at any point without losing your answers.
      </p>

      <div className="mt-6">
        <ProvenanceLegend />
      </div>

      {/* Progress. The bar is decorative; the text beside it carries the meaning. */}
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-navy-900" data-testid="decision-position">
            Decision {safeIndex + 1} of {DECISIONS.length}
            <span className="font-normal text-muted">
              {' '}
              &middot; {category?.name} &middot; {answeredCount}{' '}
              {answeredCount === 1 ? 'decision differs' : 'decisions differ'} from the enacted budget
            </span>
          </p>
          <p className="text-sm text-muted">{progressPercent}% through the cards</p>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100"
          role="progressbar"
          aria-valuenow={safeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={DECISIONS.length}
          aria-label={`Decision ${safeIndex + 1} of ${DECISIONS.length}`}
        >
          <div
            className="h-full rounded-full bg-carolina-500 transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* One decision at a time, on every screen size. */}
        <div>
          <div ref={headingRef} tabIndex={-1} className="focus:outline-none">
            <DecisionCard
              decision={decision}
              selectedChoiceId={resolveChoice(decision, selections).id}
              onChoose={(choiceId) => choose(decision.id, choiceId)}
              index={safeIndex + 1}
              total={DECISIONS.length}
            />
          </div>

          <nav
            aria-label="Move between decisions"
            className="mt-6 flex flex-wrap items-center justify-between gap-3"
          >
            <button
              type="button"
              onClick={() => setIndex(Math.max(0, safeIndex - 1))}
              disabled={safeIndex === 0}
              className="rounded-md bg-white px-5 py-2.5 font-medium text-navy-900 ring-1 ring-line transition-colors hover:bg-navy-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              &larr; Previous
            </button>

            {safeIndex === DECISIONS.length - 1 ? (
              <Link
                to="/results"
                className="rounded-md bg-gold-500 px-6 py-2.5 font-semibold text-navy-900 transition-colors hover:bg-gold-200"
              >
                See your results &rarr;
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIndex(Math.min(DECISIONS.length - 1, safeIndex + 1))}
                className="rounded-md bg-navy-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-navy-800"
              >
                Next &rarr;
              </button>
            )}
          </nav>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit lg:self-start">
          <BalancePanel totals={totals} />

          <ModePicker mode={mode} onChange={setMode} decisionCounts={DECISION_COUNTS} />

          <nav aria-label="Budget areas" className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-line">
            <h2 className="font-serif text-base font-semibold">Budget areas</h2>
            <ul className="mt-3 space-y-1">
              {CATEGORIES.map((cat) => {
                const start = categoryStarts.get(cat.id)
                if (start === undefined) return null
                const isCurrent = cat.id === decision.category
                const changedHere =
                  totals.byCategory.find((c) => c.category === cat.id)?.changedCount ?? 0

                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(start)}
                      aria-current={isCurrent ? 'true' : undefined}
                      className={`flex w-full items-baseline justify-between gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-carolina-50 ${
                        isCurrent
                          ? 'bg-carolina-50 font-semibold text-navy-900 ring-1 ring-carolina-400'
                          : 'text-ink'
                      }`}
                    >
                      <span>
                        {cat.name}
                        {isCurrent ? <span className="sr-only"> (current area)</span> : null}
                      </span>
                      {changedHere > 0 ? (
                        <span className="shrink-0 rounded-full bg-navy-100 px-1.5 text-xs font-semibold text-navy-800">
                          {changedHere}
                          <span className="sr-only"> changed</span>
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-line">
            <h2 className="font-serif text-base font-semibold">Start again</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
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
                    setIndex(0)
                  }}
                  className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  Yes, reset everything
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
                Reset to the enacted budget
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
