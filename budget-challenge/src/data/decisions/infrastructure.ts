/**
 * Disaster recovery and infrastructure paid from the General Fund.
 *
 * Note the scope boundary: road construction and maintenance run through the
 * Highway Fund and the Highway Trust Fund, which are outside this simulation.
 * What appears here is the General Fund's own capital and recovery spending.
 */
import type { Decision } from '../types'
import { enactedOption, unsourcedOption } from './helpers'

const REPORT_WOULD_SETTLE =
  'The line-item amount sits in the Joint Conference Committee Report incorporated into S.L. 2026-41, read together with the two technical corrections acts.'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

export const INFRASTRUCTURE_DECISIONS: Decision[] = [
  {
    id: 'disaster-recovery',
    category: 'disaster-infrastructure',
    title: 'Disaster Recovery Programs',
    question:
      'Should the state change what it appropriates for disaster recovery and the state share of federal aid?',
    enactedBaseline:
      'The enacted budget appropriates for disaster recovery programs and the state match for federal disaster assistance at levels set in S.L. 2026-41.',
    background:
      'Federal disaster aid generally requires a non-federal share, and it arrives on a schedule the state does not control. State recovery appropriations both provide that match and cover needs federal programs do not, particularly for housing. Recovery from major storms in North Carolina has run for years after the event, so these appropriations continue well past the disaster that prompted them.',
    choices: [
      enactedOption({
        description: 'Keep disaster recovery appropriations at the enacted level.',
        affects: ['Households awaiting rebuilding', 'Affected local governments', 'Western and eastern counties'],
      }),
      unsourcedOption({
        id: 'expand-recovery',
        label: 'Increase recovery funding',
        description:
          'Add funding for housing recovery, local government assistance, and the state share of federal programs.',
        affects: ['Displaced households', 'Local governments carrying recovery costs', 'Contractors'],
        benefits: [
          'State money is what draws down the federal share, so a shortfall in match can strand federal dollars.',
          'Households still displaced years after an event are the clearest evidence of what current funding has not reached.',
        ],
        tradeoffs: [
          'Recovery programs have faced documented delays in getting money to households, so appropriation alone does not guarantee delivery.',
          'One-time money that recurs in practice, year after year, without becoming part of the recurring base.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-recovery',
        label: 'Reduce recovery appropriations',
        description:
          'Appropriate less for recovery this year, relying on funds already appropriated and not yet spent.',
        affects: ['Recovery program administrators', 'Households in the queue'],
        benefits: [
          'Substantial sums appropriated in prior years remain unspent, so new appropriations may not be the binding constraint.',
          'Frees money for needs that can be met this year.',
        ],
        tradeoffs: [
          'Unspent balances often reflect administrative bottlenecks rather than absence of need.',
          'A reduced state share can delay or forfeit federal reimbursement.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'capital-repair-renovation',
    category: 'disaster-infrastructure',
    title: 'Repair and Renovation of State Buildings',
    question:
      'Should the state change what it spends on maintaining state-owned buildings?',
    enactedBaseline:
      'The enacted budget appropriates for repair and renovation of state facilities at levels set in S.L. 2026-41.',
    background:
      'The state owns university buildings, prisons, hospitals, and offices. Repair and renovation money is nonrecurring and, because deferring it has no immediate visible consequence, it is a frequent target when a budget is tight. Deferred maintenance accumulates into replacement costs that are considerably larger than the repairs would have been.',
    choices: [
      enactedOption({
        description: 'Keep repair and renovation funding at the enacted level.',
        affects: ['State agencies and campuses', 'Building occupants', 'Construction trades'],
      }),
      unsourcedOption({
        id: 'increase-repair',
        label: 'Increase repair and renovation funding',
        description: 'Add one-time funding to address the backlog of deferred maintenance.',
        affects: ['Campuses and agencies with aging buildings', 'Building occupants'],
        benefits: [
          'Repairs made on schedule cost a fraction of the replacement that follows from deferral.',
          'Roof, envelope, and mechanical failures interrupt the operations the buildings house.',
        ],
        tradeoffs: [
          'One-time money that competes with recurring needs in the same budget.',
          'Construction capacity and procurement timelines limit how quickly the work can be done.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-repair',
        label: 'Reduce repair and renovation funding',
        description: 'Appropriate less for maintenance and defer lower-priority projects.',
        affects: ['State agencies', 'Future budgets'],
        benefits: [
          'Nonrecurring money freed without reducing any program’s operating budget or staffing.',
          'Agencies can sequence the most urgent projects first.',
        ],
        tradeoffs: [
          'The backlog compounds, and today’s repair becomes tomorrow’s replacement.',
          'Deferred maintenance failures tend to arrive unscheduled, when there is no appropriation for them.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
]
