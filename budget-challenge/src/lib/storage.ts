/**
 * Persisting a visitor's answers.
 *
 * Only the choice ids are stored, in this browser, under one key. No account,
 * no server, no identifiers, and nothing that describes the person: not an
 * email address, not a ZIP code, not an age or any other demographic field.
 * Clearing the key returns the visitor to the enacted budget.
 */
import type { Selections } from '../engine/budget'
import { DEFAULT_MODE, isModeId, type ModeId } from '../data/modes'

export const STORAGE_KEY = 'nc-budget-challenge/v1'

interface StoredState {
  version: 1
  /** Dataset version the answers were made against, so stale answers are noticed. */
  datasetVersion: string
  selections: Selections
  /** Which of the two paths the visitor was on. Absent in sessions saved before modes existed. */
  mode?: ModeId
  savedAt: string
}

export function loadSelections(datasetVersion: string): Selections | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<StoredState>
    if (parsed.version !== 1 || typeof parsed.selections !== 'object' || parsed.selections === null) {
      return null
    }

    // A dataset update can remove or rename options. Rather than dropping the
    // whole saved session, keep it: the engine falls back to the enacted policy
    // for any choice id it no longer recognises.
    if (parsed.datasetVersion !== datasetVersion) {
      return parsed.selections as Selections
    }

    return parsed.selections as Selections
  } catch {
    // A browser with storage disabled, or a corrupted value, should start the
    // challenge rather than fail to load it.
    return null
  }
}

export function loadMode(): ModeId {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_MODE
    const parsed = JSON.parse(raw) as Partial<StoredState>
    return isModeId(parsed.mode) ? parsed.mode : DEFAULT_MODE
  } catch {
    return DEFAULT_MODE
  }
}

export function saveSelections(
  datasetVersion: string,
  selections: Selections,
  mode: ModeId,
): void {
  try {
    const state: StoredState = {
      version: 1,
      datasetVersion,
      selections,
      mode,
      savedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage being unavailable is not worth interrupting the exercise over.
  }
}

export function clearSelections(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do.
  }
}
