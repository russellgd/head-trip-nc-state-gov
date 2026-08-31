import { beforeEach, describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Results } from './Results'
import { Challenge } from './Challenge'
import { renderWithProviders } from '../test/render'
import { DATASET } from '../data'

beforeEach(() => {
  window.localStorage.clear()
})

describe('the results page', () => {
  it('reports the enacted budget when nothing has been changed', () => {
    renderWithProviders(<Results />)

    expect(
      screen.getByRole('heading', { name: /balances, with money left over/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('$1,000,000,000').length).toBeGreaterThan(0)
  })

  it('lists every decision, including the ones left at the enacted policy', () => {
    renderWithProviders(<Results />)

    const section = screen.getByRole('region', { name: 'Every choice you made' })
    expect(within(section).getAllByRole('listitem')).toHaveLength(DATASET.decisions.length)
  })

  it('describes the budget without characterising the person who made it', () => {
    renderWithProviders(<Results />)

    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/\b(liberal|conservative|progressive|fiscally conservative)\b/i)
  })

  it('shows recurring and one-time amounts in separate columns', () => {
    renderWithProviders(<Results />)

    const table = screen.getByRole('table', {
      name: /recurring and one-time components/i,
    })
    expect(within(table).getByRole('columnheader', { name: 'Recurring' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'One-time' })).toBeInTheDocument()
  })

  it('compares the result with the enacted budget', () => {
    renderWithProviders(<Results />)

    const section = screen.getByRole('region', { name: 'Compared with the enacted budget' })
    // Nothing has been changed, so the enacted and "yours" columns agree.
    expect(within(section).getAllByText('$34,374,286,763')).toHaveLength(2)
    expect(within(section).getAllByText('$35,374,286,763')).toHaveLength(2)
  })

  it('offers a print report and both downloads', () => {
    renderWithProviders(<Results />)

    expect(screen.getByRole('button', { name: /print this report/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download json/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download csv/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^start over$/i })).toBeInTheDocument()
  })
})

describe('a changed result', () => {
  it('reports an exactly balanced budget as balanced', async () => {
    const user = userEvent.setup()

    // Committing the whole unappropriated balance to reserves lands on zero.
    const challenge = renderWithProviders(<Challenge />)
    const nav = screen.getByRole('navigation', { name: /budget areas/i })
    await user.click(within(nav).getByRole('button', { name: /savings, reserves/i }))
    await user.click(screen.getByRole('radio', { name: /deposit the full balance/i }))
    challenge.unmount()

    renderWithProviders(<Results />)

    expect(screen.getByRole('heading', { name: /balances exactly/i })).toBeInTheDocument()
    const section = screen.getByRole('region', { name: 'Compared with the enacted budget' })
    expect(within(section).getByText('$0')).toBeInTheDocument()
  })

  it('records a changed decision and its effect on the balance', async () => {
    const user = userEvent.setup()

    const challenge = renderWithProviders(<Challenge />)
    await user.click(screen.getByRole('radio', { name: /reduce by 3%/i }))
    challenge.unmount()

    renderWithProviders(<Results />)

    const section = screen.getByRole('region', { name: 'Every choice you made' })
    expect(within(section).getByText(/Reduce by 3%/)).toBeInTheDocument()
    expect(screen.getAllByText(/\+\$375,010,837 to the balance/).length).toBeGreaterThan(0)
  })
})
