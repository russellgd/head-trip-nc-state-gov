/**
 * Challenge state: which option is selected for each decision, the totals that
 * follow from those selections, and persistence to this browser.
 */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DATASET } from '../data'
import { computeTotals, enactedSelections, type Selections } from '../engine/budget'
import { clearSelections, loadSelections, saveSelections } from './storage'
import { ChallengeContext, type ChallengeContextValue } from './challengeContext'

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => enactedSelections(DATASET), [])

  // Read storage once, while initialising, rather than in an effect after the
  // first paint. A returning visitor sees their own budget immediately instead
  // of the enacted one flashing first.
  const [selections, setSelections] = useState<Selections>(() => {
    const saved = loadSelections(DATASET.version)
    return saved ? { ...defaults, ...saved } : defaults
  })

  // Persist from the event that caused the change, so a render never has a
  // write hanging off it.
  const persist = useCallback((next: Selections) => {
    saveSelections(DATASET.version, next)
    return next
  }, [])

  const choose = useCallback(
    (decisionId: string, choiceId: string) => {
      setSelections((prev) => persist({ ...prev, [decisionId]: choiceId }))
    },
    [persist],
  )

  const reset = useCallback(() => {
    clearSelections()
    setSelections(defaults)
  }, [defaults])

  const totals = useMemo(() => computeTotals(DATASET, selections), [selections])

  const value = useMemo<ChallengeContextValue>(
    () => ({
      selections,
      totals,
      choose,
      reset,
      changedCount: totals.changedDecisionIds.length,
    }),
    [selections, totals, choose, reset],
  )

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>
}
