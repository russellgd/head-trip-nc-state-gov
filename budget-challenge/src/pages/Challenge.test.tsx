import { beforeEach, describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Challenge } from './Challenge'
import { renderWithProviders } from '../test/render'
import { DATASET } from '../data'
import { STORAGE_KEY } from '../lib/storage'
import { CLASSROOM_DECISION_IDS } from '../data/modes'

/** Switch to the Full Challenge, for behaviour that needs a decision the classroom set leaves out. */
async function goToFullChallenge(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: /Full Challenge/i }))
}

/** Jump to the budget area that holds the scored reserve decisions. */
async function goToReserves(user: ReturnType<typeof userEvent.setup>) {
  const nav = screen.getByRole('navigation', { name: /budget areas/i })
  await user.click(within(nav).getByRole('button', { name: /savings, reserves/i }))
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('the challenge page', () => {
  it('starts from the enacted budget, with the published unappropriated balance', () => {
    renderWithProviders(<Challenge />)

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,000,000,000')
    const panel = screen.getByRole('region', { name: /running balance/i })
    expect(within(panel).getByText('Balanced, with a surplus')).toBeInTheDocument()
  })

  it('shows one decision at a time', () => {
    renderWithProviders(<Challenge />)

    expect(screen.getAllByRole('article')).toHaveLength(1)
    const card = screen.getByRole('article')
    expect(within(card).getByText(`Decision 1 of ${CLASSROOM_DECISION_IDS.length}`)).toBeInTheDocument()
  })

  it('opens every decision on the enacted policy', () => {
    renderWithProviders(<Challenge />)

    // The classroom set opens on teacher pay, whose enacted option names the
    // schedule rather than an agency total.
    const enacted = screen.getByRole('radio', { name: /keep the enacted schedule and bonus/i })
    expect(enacted).toBeChecked()
  })

  it('updates the balance as soon as a scored option is chosen', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)

    await user.click(screen.getByRole('radio', { name: /deposit the full balance/i }))

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$0')
    const panel = screen.getByRole('region', { name: /running balance/i })
    expect(within(panel).getByText('Balanced')).toBeInTheDocument()
  })

  it('announces the new balance to screen readers when it changes', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<Challenge />)
    await goToReserves(user)

    const live = container.querySelector('[aria-live="polite"]')!
    expect(live.textContent).toBe('')

    await user.click(screen.getByRole('radio', { name: /deposit half into the savings reserve/i }))

    expect(live.textContent).toContain('$500,000,000')
    expect(live.textContent).toMatch(/surplus/i)
  })

  it('lets a choice be changed back to the enacted policy', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)

    await user.click(screen.getByRole('radio', { name: /deposit the full balance/i }))
    await user.click(screen.getByRole('radio', { name: /leave the balance unappropriated/i }))

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,000,000,000')
  })

  it('shows the working behind a calculated amount', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    // Public Schools is a Full Challenge decision; it is left out of the
    // classroom set because its residual is too vague to teach from.
    await goToFullChallenge(user)

    await user.click(screen.getByRole('radio', { name: /reduce by 3%/i }))

    // A derived figure has to show its arithmetic, not just assert a number.
    expect(screen.getAllByText(/how it is calculated/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/\$12,500,361,218/).length).toBeGreaterThan(0)

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,375,010,837')
  })

  it('offers the Governor’s recommendation as a published proposal', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToFullChallenge(user)

    // Teacher pay is now its own decision, so the Public Schools card carries
    // the residual of the Governor's recommendation for the department.
    const governor = screen.getByRole('radio', { name: /adopt the governor.s other recommendations/i })
    await user.click(governor)

    expect(screen.getAllByText('Published proposal').length).toBeGreaterThan(0)
    // The Governor recommends more than the enacted level, so the balance falls.
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$32,042,916')
  })
})

describe('deficits', () => {
  it('warns without preventing the choice', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)

    // Full deposit plus a further deposit is more than the balance can carry.
    await user.click(screen.getByRole('radio', { name: /deposit the full balance/i }))

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$0')
    // Still selectable, still shown; nothing was blocked.
    expect(screen.getByRole('radio', { name: /deposit the full balance/i })).toBeChecked()
  })
})

describe('moving between decisions', () => {
  it('disables Previous on the first decision', () => {
    renderWithProviders(<Challenge />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('moves forward and back', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(
      within(screen.getByRole('article')).getByText(`Decision 2 of ${CLASSROOM_DECISION_IDS.length}`),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /previous/i }))
    expect(
      within(screen.getByRole('article')).getByText(`Decision 1 of ${CLASSROOM_DECISION_IDS.length}`),
    ).toBeInTheDocument()
  })

  it('offers results instead of Next on the final decision', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)

    for (let i = 0; i < CLASSROOM_DECISION_IDS.length - 1; i += 1) {
      await user.click(screen.getByRole('button', { name: /next/i }))
    }

    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /see your results/i })).toBeInTheDocument()
  })

  it('reports progress to assistive technology', () => {
    renderWithProviders(<Challenge />)
    const progress = screen.getByRole('progressbar')

    expect(progress).toHaveAttribute('aria-valuenow', '1')
    expect(progress).toHaveAttribute('aria-valuemax', String(CLASSROOM_DECISION_IDS.length))
  })
})

describe('keyboard use', () => {
  it('reaches and selects an option with the keyboard alone', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)

    const enacted = screen.getByRole('radio', { name: /keep the enacted schedule and bonus/i })
    enacted.focus()
    expect(enacted).toHaveFocus()

    // Arrow keys move within a radio group and select as they go.
    await user.keyboard('{ArrowDown}')

    const governor = screen.getByRole('radio', { name: /adopt the governor.s salary schedule/i })
    expect(governor).toHaveFocus()
    expect(governor).toBeChecked()
  })

  it('labels every option so a screen reader announces what it is', () => {
    renderWithProviders(<Challenge />)

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAccessibleName()
    }
  })

  it('groups the options under a legend', () => {
    renderWithProviders(<Challenge />)
    expect(screen.getByRole('group', { name: /choose one option/i })).toBeInTheDocument()
  })
})

describe('resetting', () => {
  it('confirms before discarding answers, then restores the enacted budget', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)

    await user.click(screen.getByRole('radio', { name: /deposit the full balance/i }))
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$0')

    await user.click(screen.getByRole('button', { name: /reset to the enacted budget/i }))
    // Nothing is discarded until the second click.
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$0')

    await user.click(screen.getByRole('button', { name: /yes, reset everything/i }))
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,000,000,000')
  })

  it('can be cancelled', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)

    await user.click(screen.getByRole('radio', { name: /deposit half into the savings reserve/i }))
    await user.click(screen.getByRole('button', { name: /reset to the enacted budget/i }))
    await user.click(screen.getByRole('button', { name: /keep my answers/i }))

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$500,000,000')
  })
})

describe('saved progress', () => {
  it('keeps answers in this browser and restores them', async () => {
    const user = userEvent.setup()
    const first = renderWithProviders(<Challenge />)
    await goToReserves(user)
    await user.click(screen.getByRole('radio', { name: /deposit half into the savings reserve/i }))

    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('deposit-half')

    first.unmount()
    renderWithProviders(<Challenge />)

    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$500,000,000')
  })

  it('stores nothing beyond the choice ids', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)
    await user.click(screen.getByRole('radio', { name: /deposit half into the savings reserve/i }))

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)
    // "mode" is which of the two challenges is open, not anything about the
    // person. Nothing here identifies or describes a visitor.
    expect(Object.keys(stored).sort()).toEqual([
      'datasetVersion',
      'mode',
      'savedAt',
      'selections',
      'version',
    ])
  })
})

describe('the two challenges', () => {
  it('opens on the classroom set', () => {
    renderWithProviders(<Challenge />)

    const picker = screen.getByRole('group', { name: /which challenge/i })
    expect(within(picker).getByRole('radio', { name: /Classroom Challenge/i })).toBeChecked()
    expect(
      within(screen.getByRole('article')).getByText(
        `Decision 1 of ${CLASSROOM_DECISION_IDS.length}`,
      ),
    ).toBeInTheDocument()
  })

  it('presents every decision on the full challenge', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToFullChallenge(user)

    expect(
      within(screen.getByRole('article')).getByText(
        `Decision 1 of ${DATASET.decisions.length}`,
      ),
    ).toBeInTheDocument()
    expect(DATASET.decisions.length).toBeGreaterThan(CLASSROOM_DECISION_IDS.length)
  })

  it('keeps the answers already given when the challenge is switched', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToReserves(user)
    await user.click(screen.getByRole('radio', { name: /deposit half into the savings reserve/i }))
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$500,000,000')

    await goToFullChallenge(user)

    // The answer is still recorded, and still counted: the unappropriated
    // balance is in both challenges. Switching must not cost a visitor work.
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$500,000,000')
  })

  it('counts only the decisions the current challenge presents', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Challenge />)
    await goToFullChallenge(user)
    await user.click(screen.getByRole('radio', { name: /reduce by 3%/i }))
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,375,010,837')

    // Public Schools is not in the classroom set, so its effect leaves the
    // balance when the classroom challenge is the one being totalled. The
    // answer is remembered, not discarded.
    await user.click(screen.getByRole('radio', { name: /Classroom Challenge/i }))
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,000,000,000')

    await goToFullChallenge(user)
    expect(screen.getByTestId('remaining-balance')).toHaveTextContent('$1,375,010,837')
  })

  it('remembers which challenge was open', async () => {
    const user = userEvent.setup()
    const first = renderWithProviders(<Challenge />)
    await goToFullChallenge(user)
    first.unmount()

    renderWithProviders(<Challenge />)
    const picker = screen.getByRole('group', { name: /which challenge/i })
    expect(within(picker).getByRole('radio', { name: /Full Challenge/i })).toBeChecked()
  })
})
