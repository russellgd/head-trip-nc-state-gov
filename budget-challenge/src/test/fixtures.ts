/**
 * Small synthetic datasets for engine tests.
 *
 * Deliberately not the real dataset: the engine's arithmetic should be provable
 * against numbers chosen to make each rule visible, independently of whatever
 * the current budget data happens to contain.
 */
import type { Dataset, Choice, Money } from '../data/types'

const m = (recurring: number, nonrecurring = 0): Money => ({ recurring, nonrecurring })

export function choice(input: Partial<Choice> & { id: string }): Choice {
  return {
    label: input.id,
    description: 'test choice',
    spending: m(0),
    revenue: m(0),
    reserve: m(0),
    affects: [],
    benefits: ['a benefit'],
    tradeoffs: ['a trade-off'],
    provenance: input.isEnactedBaseline ? 'enacted' : 'documented',
    sources: [
      {
        title: 'Test source',
        url: 'https://www.ncleg.gov/EnactedLegislation/SessionLaws/HTML/2025-2026/SL2026-41.html',
        section: 'Test section',
        verifiedDate: '2026-08-31',
      },
    ],
    verification: { status: 'verified', scored: true, note: 'test' },
    ...input,
  }
}

/**
 * A three-decision dataset covering the three levers: spending, revenue, and
 * reserves, each with a recurring and a nonrecurring component.
 */
export const FIXTURE: Dataset = {
  version: 'test',
  baseline: {
    fiscalYear: 'FY 2026-27',
    netAppropriations: 1_000,
    totalAvailability: 1_100,
    unappropriatedBalance: 100,
    verifiedThrough: '2026-08-31',
    provisional: false,
    provisionalNote: '',
    sources: [
      {
        title: 'Test baseline source',
        url: 'https://www.ncleg.gov/EnactedLegislation/SessionLaws/HTML/2025-2026/SL2026-41.html',
        section: 'Part I',
        verifiedDate: '2026-08-31',
      },
    ],
  },
  categories: [
    { id: 'k12-education', name: 'K-12', summary: '', enactedNetAppropriation: null, sources: [] },
    { id: 'revenue', name: 'Revenue', summary: '', enactedNetAppropriation: null, sources: [] },
    { id: 'reserves', name: 'Reserves', summary: '', enactedNetAppropriation: null, sources: [] },
  ],
  decisions: [
    {
      id: 'spend',
      category: 'k12-education',
      title: 'Spending',
      question: 'Spend more?',
      enactedBaseline: 'baseline',
      choices: [
        choice({ id: 'enacted', isEnactedBaseline: true }),
        // 30 recurring + 10 one-time = 40 of new spending
        choice({ id: 'more', spending: m(30, 10) }),
        // a 25-dollar recurring reduction
        choice({ id: 'less', spending: m(-25, 0) }),
        // an option with a figure the engine must refuse to score
        choice({
          id: 'unsourced',
          spending: m(999_999),
          sources: [],
          verification: { status: 'pending', scored: false, note: 'not sourced' },
        }),
      ],
    },
    {
      id: 'revenue',
      category: 'revenue',
      title: 'Revenue',
      question: 'Raise more?',
      enactedBaseline: 'baseline',
      choices: [
        choice({ id: 'enacted', isEnactedBaseline: true }),
        choice({ id: 'raise', revenue: m(50, 5) }),
        choice({ id: 'cut', revenue: m(-20, 0) }),
      ],
    },
    {
      id: 'reserve',
      category: 'reserves',
      title: 'Reserve',
      question: 'Save more?',
      enactedBaseline: 'baseline',
      choices: [
        choice({ id: 'enacted', isEnactedBaseline: true }),
        choice({ id: 'deposit', reserve: m(0, 60) }),
        choice({ id: 'withdraw', reserve: m(0, -35) }),
      ],
    },
  ],
}
