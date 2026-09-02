import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DecisionCard } from './DecisionCard'
import { choice } from '../test/fixtures'
import type { Decision } from '../data/types'

/**
 * The live dataset currently has a sourced figure behind every option, so the
 * rendering of an unsourced one is exercised here with a synthetic decision.
 * The behaviour still matters: the moment a new option is added without a
 * figure, this is how it has to appear.
 */
const withPendingOption: Decision = {
  id: 'synthetic',
  category: 'k12-education',
  title: 'A decision awaiting a figure',
  question: 'Should the state do this?',
  enactedBaseline: 'The enacted budget does something.',
  choices: [
    choice({ id: 'enacted', label: 'Keep the enacted policy', isEnactedBaseline: true }),
    choice({
      id: 'pending',
      label: 'Do something else',
      provenance: 'proposal',
      sources: [],
      verification: {
        status: 'pending',
        scored: false,
        note: 'No official fiscal estimate has been confirmed for this option.',
      },
    }),
  ],
}

describe('an option with no sourced figure', () => {
  it('says it is not counted rather than showing a zero', () => {
    render(
      <DecisionCard
        decision={withPendingOption}
        selectedChoiceId="enacted"
        onChoose={() => {}}
        index={1}
        total={1}
      />,
    )

    expect(screen.getByText('Not counted in your balance')).toBeInTheDocument()
    // A zero would read as "this option is free", which is a claim the absence
    // of a figure does not support.
    expect(screen.queryByText('$0 to the balance')).not.toBeInTheDocument()
  })

  it('labels the option as awaiting a source', () => {
    render(
      <DecisionCard
        decision={withPendingOption}
        selectedChoiceId="enacted"
        onChoose={() => {}}
        index={1}
        total={1}
      />,
    )

    expect(screen.getByText('Amount not yet sourced')).toBeInTheDocument()
  })

  it('still shows the enacted option as the reference point', () => {
    render(
      <DecisionCard
        decision={withPendingOption}
        selectedChoiceId="enacted"
        onChoose={() => {}}
        index={1}
        total={1}
      />,
    )

    expect(screen.getByText('No change from enacted budget')).toBeInTheDocument()
  })
})
