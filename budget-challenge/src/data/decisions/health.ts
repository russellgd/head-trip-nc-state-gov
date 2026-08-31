/**
 * Health and Human Services.
 *
 * The largest single General Fund commitment after education, and the one most
 * sensitive to forces the state does not control: enrollment, medical prices,
 * and federal matching rules.
 */
import type { Decision } from '../types'
import { enactedOption, unsourcedOption } from './helpers'

const REPORT_WOULD_SETTLE =
  'The line-item amount sits in the Joint Conference Committee Report incorporated into S.L. 2026-41, read together with the two technical corrections acts.'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

export const HEALTH_DECISIONS: Decision[] = [
  {
    id: 'medicaid-rebase',
    category: 'health-human-services',
    title: 'Medicaid Funding',
    question:
      'Should the state fund the projected cost of Medicaid, or budget below the projection?',
    enactedBaseline:
      'The enacted budget appropriates the state share of Medicaid for FY 2026-27 at the level set in S.L. 2026-41.',
    background:
      'Medicaid is an entitlement: people who qualify are enrolled, so the cost is driven by enrollment and medical prices rather than by a spending cap the legislature sets. The annual adjustment for those changes is called the rebase. Every state dollar draws federal matching dollars, so a state reduction removes more total health care spending than the state saves. Budgeting below the projection does not reduce the obligation; it defers the recognition of it, usually to a later supplemental appropriation.',
    choices: [
      enactedOption({
        description: 'Fund the state share of Medicaid at the enacted level.',
        affects: [
          'Medicaid enrollees',
          'Hospitals and providers',
          'County departments of social services',
        ],
      }),
      unsourcedOption({
        id: 'fund-full-rebase',
        label: 'Fund the full projected rebase',
        description:
          'Appropriate the full amount the state projects Medicaid will cost, rather than a lower budgeted figure.',
        affects: ['Medicaid enrollees', 'Providers awaiting payment', 'Future budgets'],
        benefits: [
          'Budgeting the projected cost avoids a mid-year shortfall that has to be filled from other funds.',
          'Providers and counties can plan against a number that reflects actual expected caseload.',
        ],
        tradeoffs: [
          'Commits recurring money to a projection that may turn out high, tying up funds other programs could use.',
          'Projections are uncertain, and a full-funding rule removes some pressure to manage cost growth.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'underfund-rebase',
        label: 'Budget below the projection',
        description:
          'Appropriate less than the projected state share and revisit the shortfall in a later budget.',
        affects: ['Medicaid program administrators', 'Providers', 'Future legislatures'],
        benefits: [
          'Frees money now for other purposes, and projections have been high in some past years.',
          'Keeps pressure on the program to manage utilization and cost.',
        ],
        tradeoffs: [
          'If enrollment matches the projection, the shortfall returns as an unavoidable supplemental appropriation.',
          'Because federal dollars match state dollars, a state shortfall removes several times its own value in total health spending.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'behavioral-health',
    category: 'health-human-services',
    title: 'Behavioral Health and Crisis Services',
    question:
      'Should the state change what it spends on mental health, substance use, and crisis services?',
    enactedBaseline:
      'The enacted budget funds behavioral health services, including crisis response and treatment capacity, at levels set in S.L. 2026-41.',
    background:
      'Behavioral health in North Carolina is delivered through managed care entities and a network of community providers. Because people in crisis who cannot reach treatment often end up in emergency departments or county jails, spending decisions here move costs onto hospitals and local governments rather than eliminating them.',
    choices: [
      enactedOption({
        description: 'Keep behavioral health and crisis funding at the enacted level.',
        affects: ['People seeking treatment', 'Hospitals', 'County jails and law enforcement'],
      }),
      unsourcedOption({
        id: 'expand-behavioral',
        label: 'Expand crisis and treatment capacity',
        description:
          'Increase funding for crisis centers, mobile crisis teams, and community treatment capacity.',
        affects: ['People in crisis', 'Emergency departments', 'Law enforcement'],
        benefits: [
          'Crisis capacity outside hospitals and jails addresses the need at lower cost than the settings people currently reach by default.',
          'Reduces the load on emergency departments and on officers who are not trained clinicians.',
        ],
        tradeoffs: [
          'Recurring cost, and workforce shortages limit how quickly funded capacity can actually open.',
          'Savings elsewhere in the system are real but accrue to hospitals and counties rather than to the General Fund.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-behavioral',
        label: 'Reduce behavioral health funding',
        description:
          'Fund behavioral health below the enacted level and rely on Medicaid and federal block grants for a larger share.',
        affects: ['Uninsured people seeking treatment', 'Community providers', 'Counties'],
        benefits: [
          'Medicaid covers a substantial share of behavioral health care, so state-funded services overlap with it in places.',
          'Frees recurring money.',
        ],
        tradeoffs: [
          'State funds largely serve people Medicaid does not cover, so a reduction concentrates on the uninsured.',
          'Community providers operate on thin margins and closures are difficult to reverse.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'child-care-subsidy',
    category: 'health-human-services',
    title: 'Child Care Subsidy and Early Education',
    question:
      'Should the state change what it spends on child care subsidy and early childhood programs?',
    enactedBaseline:
      'The enacted budget funds child care subsidy and early childhood education programs at levels set in S.L. 2026-41.',
    background:
      'Child care subsidy helps lower-income working families pay for care, and the rate the state pays providers determines how many providers accept subsidized children. Federal pandemic-era stabilization funding for child care has ended, which shifted more of the question onto state budgets.',
    choices: [
      enactedOption({
        description: 'Keep child care subsidy and early education funding as enacted.',
        affects: ['Working parents', 'Child care providers', 'Young children'],
      }),
      unsourcedOption({
        id: 'expand-childcare',
        label: 'Expand subsidy and provider rates',
        description:
          'Serve more families on the subsidy waiting list and raise the rates paid to providers.',
        affects: ['Families on waiting lists', 'Child care workers', 'Employers'],
        benefits: [
          'Care costs are a documented reason parents leave the workforce, so subsidy interacts with labor supply.',
          'Higher rates widen the set of providers willing to accept subsidized children, which is what makes a subsidy usable.',
        ],
        tradeoffs: [
          'Recurring cost that grows as more families are served.',
          'Higher rates do not create capacity where no provider exists, which is the binding constraint in some rural counties.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-childcare',
        label: 'Reduce subsidy funding',
        description: 'Fund fewer subsidy slots than the enacted budget provides.',
        affects: ['Families receiving subsidy', 'Providers serving subsidized children'],
        benefits: [
          'Frees recurring money.',
          'Focuses a limited subsidy on the lowest-income families.',
        ],
        tradeoffs: [
          'Families who lose subsidy often reduce work hours, which lowers earnings and state income tax collections.',
          'Providers that depend on subsidized enrollment may close, removing capacity for everyone.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
]
