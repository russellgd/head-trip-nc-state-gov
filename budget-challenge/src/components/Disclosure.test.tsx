import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DecisionCard } from './DecisionCard'
import { DATASET } from '../data'
import type { Decision } from '../data/types'

/**
 * What may be collapsed, and what may not.
 *
 * The disclosure exists to cut reading, not to cut disclosure. Sources and
 * arithmetic can wait to be asked for. Whether an option is illustrative, what
 * it costs, and what it gives up cannot: a reader who never opens anything must
 * still be able to tell a published proposal from a percentage this project
 * invented.
 */

const illustrative = DATASET.decisions.find((d) =>
  d.choices.some((c) => c.provenance === 'illustrative'),
) as Decision

/**
 * Text a reader actually gets. A collapsed panel is still in the DOM, so a
 * plain text query would happily "find" something nobody can see; anything
 * inside a hidden panel is out of the accessibility tree and off the screen,
 * and does not count as shown.
 */
const visible = (pattern: RegExp | string): HTMLElement[] =>
  screen
    .queryAllByText(pattern, { exact: false })
    .filter((el) => el.closest('[hidden]') === null)

const renderCard = (decision: Decision) =>
  render(
    <DecisionCard
      decision={decision}
      selectedChoiceId="enacted"
      onChoose={() => {}}
      index={1}
      total={1}
    />,
  )

describe('the technical disclosure', () => {
  it('starts closed and reports its state through aria-expanded', () => {
    renderCard(illustrative)
    const buttons = screen.getAllByRole('button', { name: 'Sources and calculation' })

    expect(buttons.length).toBe(illustrative.choices.length)
    for (const button of buttons) expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens by keyboard alone and points at the region it controls', async () => {
    const user = userEvent.setup()
    renderCard(illustrative)
    const button = screen.getAllByRole('button', { name: 'Sources and calculation' })[0]!

    button.focus()
    expect(document.activeElement).toBe(button)
    await user.keyboard('{Enter}')

    expect(button).toHaveAttribute('aria-expanded', 'true')
    const panelId = button.getAttribute('aria-controls')!
    const panel = document.getElementById(panelId)
    expect(panel).not.toBeNull()
    expect(panel!.hasAttribute('hidden')).toBe(false)

    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(panelId)!.hasAttribute('hidden')).toBe(true)
  })

  it('keeps the working reachable rather than removing it', async () => {
    const user = userEvent.setup()
    renderCard(illustrative)
    const choice = illustrative.choices.find((c) => c.provenance === 'illustrative')!

    expect(visible(/How it is calculated/)).toHaveLength(0)
    expect(visible(choice.verification.derivation!)).toHaveLength(0)

    for (const button of screen.getAllByRole('button', { name: 'Sources and calculation' })) {
      await user.click(button)
    }

    expect(visible(/How it is calculated/).length).toBeGreaterThan(0)
    expect(visible(choice.verification.derivation!).length).toBeGreaterThan(0)
  })
})

describe('what stays on the card whatever the reader opens', () => {
  const alwaysVisible = (decision: Decision) => {
    renderCard(decision)
    for (const choice of decision.choices) {
      expect(visible(choice.label).length, choice.label).toBeGreaterThan(0)
      expect(visible(choice.description).length, choice.description).toBeGreaterThan(0)
      if (choice.tradeoffs[0]) {
        expect(visible(choice.tradeoffs[0]).length, choice.tradeoffs[0]).toBeGreaterThan(0)
      }
    }
  }

  it('shows every option label, description and strongest concern with nothing opened', () => {
    alwaysVisible(illustrative)
  })

  it('shows the provenance of every option with nothing opened', () => {
    renderCard(illustrative)
    // The badge is the one thing a reader must never have to ask for.
    expect(visible('Illustrative allocation scenario').length).toBeGreaterThan(0)
    expect(visible('Enacted policy').length).toBeGreaterThan(0)
  })

  it('states in full that nobody proposed an illustrative scenario', () => {
    renderCard(illustrative)
    expect(
      visible(/not proposed by any North Carolina official or institution/i).length,
    ).toBeGreaterThan(0)
  })

  it('shows the fiscal impact of every scored option with nothing opened', () => {
    renderCard(illustrative)
    expect(visible('No change from enacted budget').length).toBeGreaterThan(0)
    // Stated against the enacted policy, in words, not as a bare signed number.
    expect(visible(/compared with enacted policy|more available than enacted policy/).length).toBeGreaterThan(0)
  })

  it('names the recurring or one-time shape of every scored option', () => {
    renderCard(illustrative)
    expect(
      screen
        .getAllByText(/^(Recurring|One-time|Recurring and one-time)$/)
        .filter((el) => el.closest('[hidden]') === null).length,
    ).toBeGreaterThan(0)
  })
})

describe('an option whose recurring split is material', () => {
  // Teacher pay moves recurring money one way and one-time money the other.
  // A single net figure would hide the whole point of the choice, so the
  // table is on the card rather than in the panel.
  const teacherPay = DATASET.decisions.find((d) => d.id === 'teacher-compensation')!

  it('shows the split without the reader opening anything', () => {
    renderCard(teacherPay)
    expect(visible('Recurring and one-time').length).toBeGreaterThan(0)
    // getByRole reads the accessibility tree, so a table inside a hidden panel
    // would not be found here at all.
    expect(screen.getAllByRole('columnheader', { name: 'Recurring' }).length).toBeGreaterThan(0)
  })
})
