import { createContext, useContext } from 'react'
import type { BudgetTotals, Selections } from '../engine/budget'

export interface ChallengeContextValue {
  selections: Selections
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
