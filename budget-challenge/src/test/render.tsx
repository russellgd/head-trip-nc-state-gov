import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'
import { ChallengeProvider } from '../lib/challenge'

/** Render a page with the router and challenge state it expects. */
export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ChallengeProvider>{ui}</ChallengeProvider>
    </MemoryRouter>,
  )
}
