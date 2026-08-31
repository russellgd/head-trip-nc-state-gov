import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BalancePanel } from './BalancePanel'
import { computeTotals, enactedSelections } from '../engine/budget'
import { DATASET } from '../data'
import type { BudgetTotals } from '../engine/budget'

const base = computeTotals(DATASET, enactedSelections(DATASET))

/** The panel is a pure view of a totals object, so a deficit can be shown to it directly. */
const withBalance = (remainingBalance: number, structuralChange = 0): BudgetTotals => ({
  ...base,
  remainingBalance,
  structuralChange,
})

describe('the balance panel', () => {
  it('names the status in words, so colour is never the only signal', () => {
    const { rerender } = render(<BalancePanel totals={withBalance(1_000_000_000)} />)
    expect(screen.getByText('Balanced, with a surplus')).toBeInTheDocument()

    rerender(<BalancePanel totals={withBalance(0)} />)
    expect(screen.getByText('Balanced')).toBeInTheDocument()

    rerender(<BalancePanel totals={withBalance(-250_000_000)} />)
    expect(screen.getByText('Out of balance')).toBeInTheDocument()
  })

  it('warns on a deficit and explains what would have to happen', () => {
    render(<BalancePanel totals={withBalance(-250_000_000)} />)

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('-$250,000,000')
    expect(screen.getByText(/commit more than is available/i)).toBeInTheDocument()
    expect(screen.getByText(/further reductions, additional revenue, or a withdrawal/i)).toBeInTheDocument()
  })

  it('does not warn when the budget balances', () => {
    render(<BalancePanel totals={withBalance(0)} />)
    expect(screen.queryByText(/commit more than is available/i)).not.toBeInTheDocument()
  })

  it('reports the recurring position separately from the balance', () => {
    render(<BalancePanel totals={withBalance(500_000_000, -120_000_000)} />)

    const panel = screen.getByRole('region', { name: /running balance/i })
    expect(within(panel).getByText('Recurring position')).toBeInTheDocument()
    expect(within(panel).getByText('-$120,000,000')).toBeInTheDocument()
  })

  it('stays silent on first render rather than announcing on page load', () => {
    const { container } = render(<BalancePanel totals={withBalance(1_000_000_000)} />)
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe('')
  })

  it('announces a change in full sentences once the balance moves', () => {
    const { container, rerender } = render(<BalancePanel totals={withBalance(1_000_000_000)} />)
    rerender(<BalancePanel totals={withBalance(-250_000_000, -50_000_000)} />)

    const live = container.querySelector('[aria-live="polite"]')!
    expect(live.textContent).toMatch(/out of balance/i)
    expect(live.textContent).toContain('$250,000,000')
    expect(live.textContent).toMatch(/decrease of \$50,000,000/i)
  })
})
