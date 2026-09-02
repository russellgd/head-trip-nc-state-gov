import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { BalancePanel } from './BalancePanel'
import { computeTotals, enactedSelections } from '../engine/budget'
import { DATASET } from '../data'
import { formatDollars } from '../lib/format'
import type { BudgetTotals } from '../engine/budget'

const base = computeTotals(DATASET, enactedSelections(DATASET))

/**
 * The panel is a pure view of a totals object, so any position can be shown to
 * it directly. The two measures are set together from one number, exactly as
 * the engine derives them, so a test can never construct a pair that the engine
 * could not produce.
 */
const withBalance = (remainingBalance: number, structuralChange = 0): BudgetTotals => ({
  ...base,
  remainingBalance,
  changeFromEnacted: remainingBalance - base.startingBalance,
  structuralChange,
})

describe('the balance panel', () => {
  it('leads with the change from the enacted budget, and starts it at zero', () => {
    render(<BalancePanel totals={withBalance(base.startingBalance)} />)

    // "$0", not "no change": the exercise opens at a number, the way the
    // D.C. and California budget challenges do.
    expect(
      screen.getByTestId('change-from-enacted').querySelector('[aria-hidden="true"]'),
    ).toHaveTextContent('$0')
    expect(screen.getByText('Change from enacted budget')).toBeInTheDocument()
    expect(screen.getByText('Your choices match the enacted budget.')).toBeInTheDocument()
  })

  it('shows the unappropriated balance as a second, separate measure', () => {
    render(<BalancePanel totals={withBalance(base.startingBalance)} />)

    expect(screen.getByText('Unappropriated balance remaining')).toBeInTheDocument()
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent(
      formatDollars(base.startingBalance),
    )
  })

  it('names the outcome in words, so colour is never the only signal', () => {
    const { rerender } = render(<BalancePanel totals={withBalance(base.startingBalance)} />)
    expect(screen.getByText('Matches the enacted budget')).toBeInTheDocument()

    rerender(<BalancePanel totals={withBalance(base.startingBalance - 250_000_000)} />)
    expect(screen.getByText('Uses part of the balance')).toBeInTheDocument()

    rerender(<BalancePanel totals={withBalance(base.startingBalance + 250_000_000)} />)
    expect(screen.getByText('Leaves more available')).toBeInTheDocument()

    rerender(<BalancePanel totals={withBalance(-250_000_000)} />)
    expect(screen.getByText('Exceeds available resources')).toBeInTheDocument()
  })

  it('warns only when the balance is exhausted, and explains what would have to happen', () => {
    render(<BalancePanel totals={withBalance(-250_000_000)} />)

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('-$250,000,000')
    expect(
      screen.getByText(/exceed available General Fund resources by \$250,000,000/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/further reductions, additional revenue, or a withdrawal/i)).toBeInTheDocument()
  })

  it('does not call spending part of the enacted balance a deficit', () => {
    // The distinction the whole teaching model rests on: using $80m of a
    // $1bn balance leaves the state with $920m, which is not a deficit.
    render(<BalancePanel totals={withBalance(base.startingBalance - 80_692_405)} />)

    expect(
      screen.getByText('Your choices use $80,692,405 of the balance left by the enacted budget.'),
    ).toBeInTheDocument()
    expect(screen.queryByText(/further reductions, additional revenue, or a withdrawal/i)).not.toBeInTheDocument()
    const panel = screen.getByRole('region', { name: /running balance/i })
    expect(panel.textContent).not.toMatch(/deficit|out of balance|does not balance/i)
  })

  it('does not warn when nothing has been changed', () => {
    render(<BalancePanel totals={withBalance(base.startingBalance)} />)
    expect(screen.queryByText(/further reductions, additional revenue, or a withdrawal/i)).not.toBeInTheDocument()
  })

  it('reports the recurring position separately from the balance', () => {
    render(<BalancePanel totals={withBalance(base.startingBalance - 500_000_000, -120_000_000)} />)

    const panel = screen.getByRole('region', { name: /running balance/i })
    expect(within(panel).getByText('Recurring position')).toBeInTheDocument()
    expect(within(panel).getByText('-$120,000,000')).toBeInTheDocument()
  })

  it('stays silent on first render rather than announcing on page load', () => {
    const { container } = render(<BalancePanel totals={withBalance(base.startingBalance)} />)
    expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe('')
  })

  it('announces both measures by name, with the direction in words', () => {
    const { container, rerender } = render(<BalancePanel totals={withBalance(base.startingBalance)} />)
    rerender(<BalancePanel totals={withBalance(base.startingBalance - 250_000_000)} />)

    const live = container.querySelector('[aria-live="polite"]')!
    // Measure name, direction, amount — for both figures, in the order they
    // appear on screen. A "-" alone would be missed or read as a hyphen.
    expect(live.textContent).toMatch(/Change from the enacted budget: \$250,000,000 used/i)
    expect(live.textContent).toMatch(/Unappropriated balance remaining: \$750,000,000/i)
    expect(live.textContent).toContain('Your choices use $250,000,000 of the balance')
  })

  it('announces an exhausted balance as exceeding available resources', () => {
    const { container, rerender } = render(<BalancePanel totals={withBalance(base.startingBalance)} />)
    rerender(<BalancePanel totals={withBalance(-250_000_000)} />)

    const live = container.querySelector('[aria-live="polite"]')!
    expect(live.textContent).toMatch(/\$250,000,000 beyond available General Fund resources/i)
  })
})
