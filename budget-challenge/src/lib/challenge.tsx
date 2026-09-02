/**
 * Challenge state: which option is selected for each decision, the totals that
 * follow from those selections, and persistence to this browser.
 */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DATASET } from '../data'
import { datasetForMode, decisionsForMode, type ModeId } from '../data/modes'
import { computeTotals, enactedSelections, type Selections } from '../engine/budget'
import { clearSelections, loadMode, loadSelections, saveSelections } from './storage'
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
  const [mode, setModeState] = useState<ModeId>(() => loadMode())

  // Persist from the event that caused the change, so a render never has a
  // write hanging off it.
  const persist = useCallback((next: Selections, nextMode: ModeId) => {
    saveSelections(DATASET.version, next, nextMode)
    return next
  }, [])

  const choose = useCallback(
    (decisionId: string, choiceId: string) => {
      setSelections((prev) => persist({ ...prev, [decisionId]: choiceId }, mode))
    },
    [persist, mode],
  )

  // Answers survive a mode change. Someone who works through the classroom set
  // and then opens the full one should find their twenty answers still there,
  // not be sent back to the enacted budget for having looked.
  const setMode = useCallback(
    (next: ModeId) => {
      setModeState(next)
      setSelections((prev) => persist(prev, next))
    },
    [persist],
  )

  const reset = useCallback(() => {
    clearSelections()
    setSelections(defaults)
  }, [defaults])

  const dataset = useMemo(() => datasetForMode(DATASET, mode), [mode])
  const decisions = useMemo(() => decisionsForMode(DATASET, mode), [mode])
  const totals = useMemo(() => computeTotals(dataset, selections), [dataset, selections])

  const value = useMemo<ChallengeContextValue>(
    () => ({
      selections,
      mode,
      setMode,
      decisions,
      dataset,
      totals,
      choose,
      reset,
      changedCount: totals.changedDecisionIds.length,
    }),
    [selections, mode, setMode, decisions, dataset, totals, choose, reset],
  )

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>
}
