import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OneTimeFunding } from './OneTimeFunding'
import { DATASET } from '../data'
import { datasetForMode, type ModeId } from '../data/modes'
import { computeTotals, type Selections } from '../engine/budget'

/**
 * The panel that shows when a balanced year rests on money that does not repeat.
 *
 * The hardest requirement here is negative: it must never claim a structural
 * deficit. The application cannot calculate one, because that needs recurring
 * revenue measured against recurring obligations for the whole budget and no
 * source in this project separates recurring collections from reversions,
 * transfers and prior-year cash. These tests hold that line, in both challenges.
 */

const renderFor = (mode: ModeId, selections: Selections) => {
  const dataset = datasetForMode(DATASET, mode)
  const totals = computeTotals(dataset, selections)
  const view = render(
    <OneTimeFunding totals={totals} decisions={dataset.decisions} selections={selections} />,
  )
  return { totals, view }
}

/** Recurring commitments up, funded in part by one-time money. */
const DIVERGING: Selections = {
  // Recurring: teacher pay adds recurring salary and removes one-time bonuses.
  'teacher-compensation': 'governor-schedule',
  // Recurring: the Medicaid rebase is entirely recurring.
  'medicaid-rebase': 'governor-rebase',
  // One-time: not making half a reserve frees money for this year only.
  'reservation-serdrf': 'halve',
}

describe('when recurring commitments rise and one-time money pays for part of it', () => {
  it('appears, and states both halves separately', () => {
    const { totals } = renderFor('classroom', DIVERGING)

    expect(totals.structuralChange).toBeLessThan(0)
    expect(totals.onetimeChange).toBeGreaterThan(0)
    expect(screen.getByTestId('one-time-funding')).toBeInTheDocument()
    expect(screen.getByText(/Recurring changes, which repeat every year/)).toBeInTheDocument()
    expect(screen.getByText(/One-time changes, which apply this year only/)).toBeInTheDocument()
  })

  it('names the choices that carried the one-time money', () => {
    renderFor('classroom', DIVERGING)

    expect(screen.getByText(/Emergency Response and Disaster Relief/)).toBeInTheDocument()
  })

  it('never claims a structural deficit', () => {
    const { view } = renderFor('classroom', DIVERGING)
    const text = view.container.textContent ?? ''

    expect(text).not.toMatch(/structural deficit/i)
    expect(text).not.toMatch(/structurally unbalanced|out of structural balance/i)
    expect(text).toMatch(/says nothing about whether the state’s finances are in balance/i)
    expect(text).toMatch(/does not carry the figures to do it/i)
  })

  it('says the figures are changes, and assumes no revenue baseline', () => {
    renderFor('classroom', DIVERGING)

    expect(
      screen.getByText(/changes measured against the enacted budget, not absolute positions/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/no recurring revenue baseline is assumed or constructed/i),
    ).toBeInTheDocument()
  })

  it('works the same way in the full challenge', () => {
    const { totals } = renderFor('full', DIVERGING)

    expect(totals.structuralChange).toBeLessThan(0)
    expect(totals.onetimeChange).toBeGreaterThan(0)
    expect(screen.getByTestId('one-time-funding')).toBeInTheDocument()
  })
})

describe('when there is nothing to warn about', () => {
  it('stays away with no choices made', () => {
    renderFor('classroom', {})
    expect(screen.queryByTestId('one-time-funding')).not.toBeInTheDocument()
  })

  it('stays away when recurring commitments have not grown', () => {
    // One-time money alone, with no new recurring commitment, is not the
    // situation this panel is about.
    renderFor('classroom', { 'reservation-serdrf': 'halve' })
    expect(screen.queryByTestId('one-time-funding')).not.toBeInTheDocument()
  })
})

describe('the two halves of the arithmetic', () => {
  it('are the recurring and one-time components of the same sum', () => {
    const dataset = datasetForMode(DATASET, 'full')
    const totals = computeTotals(dataset, DIVERGING)

    expect(totals.structuralChange).toBe(
      totals.revenue.recurring - totals.spending.recurring - totals.reserve.recurring,
    )
    expect(totals.onetimeChange).toBe(
      totals.revenue.nonrecurring - totals.spending.nonrecurring - totals.reserve.nonrecurring,
    )
  })
})
