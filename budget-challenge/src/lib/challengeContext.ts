import { createContext, useContext } from 'react'
import type { BudgetTotals, Selections } from '../engine/budget'
import type { Dataset, Decision } from '../data/types'
import type { ModeId } from '../data/modes'

export interface ChallengeContextValue {
  selections: Selections
  /** Which path the visitor is on. Answers are shared between the two. */
  mode: ModeId
  /** Switch paths. Answers are kept; only what is presented and totalled changes. */
  setMode: (mode: ModeId) => void
  /** The decisions this mode presents, in its own order. */
  decisions: Decision[]
  /** The dataset narrowed to this mode, for the engine and the exports. */
  dataset: Dataset
  totals: BudgetTotals
  /** Record an answer for one decision. */
  choose: (decisionId: string, choiceId: string) => void
  /** Return every decision to the enacted policy and forget the saved session. */
  reset: () => void
  /** How many decisions differ from the enacted budget. */
  changedCount: number
}

export const ChallengeContext = createContext<ChallengeContextValue | null>(null)

export function useChallenge(): ChallengeContextValue {
  const context = useContext(ChallengeContext)
  if (!context) {
    throw new Error('useChallenge must be used inside a ChallengeProvider')
  }
  return context
}
