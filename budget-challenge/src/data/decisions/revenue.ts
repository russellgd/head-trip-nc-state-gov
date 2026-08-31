/**
 * Taxes and other General Fund revenue.
 *
 * Revenue options are the hardest part of a budget simulation to source
 * honestly, because the amount a tax change raises or costs depends on a
 * forecast, not on an appropriation. A rate is written in statute; the dollars
 * it produces are an estimate produced by the Fiscal Research Division and the
 * Office of State Budget and Management. Only those official estimates are
 * usable here.
 */
import type { Decision } from '../types'
import { enactedOption, unsourcedOption } from './helpers'

const FISCAL_NOTE_WOULD_SETTLE =
  'A revenue figure for this option would come from the consensus revenue forecast or an official fiscal note prepared for the relevant bill.'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

export const REVENUE_DECISIONS: Decision[] = [
  {
    id: 'personal-income-tax-rate',
    category: 'revenue',
    title: 'Personal Income Tax Rate',
    question: 'Should the scheduled personal income tax rate change take effect as enacted?',
    enactedBaseline:
      'North Carolina statute sets a flat personal income tax rate with scheduled changes in future years, as reflected in the revenue assumptions underlying S.L. 2026-41.',
    background:
      'North Carolina taxes personal income at a single flat rate. Because the rate applies to a broad base, a change of a fraction of a percentage point moves a large amount of revenue. Some scheduled reductions are conditioned on revenue meeting specified triggers, so what takes effect depends on collections as well as on statute. Income tax is the largest single General Fund revenue source, which means it is also the most consequential lever available on the revenue side.',
    choices: [
      enactedOption({
        description:
          'Leave the personal income tax rate and its scheduled changes as they stand in current law.',
        affects: ['All North Carolina income taxpayers', 'Future General Fund availability'],
      }),
      unsourcedOption({
        id: 'pause-rate-reduction',
        label: 'Pause the scheduled rate reduction',
        description:
          'Hold the personal income tax rate at its current level rather than allowing the scheduled reduction to take effect.',
        affects: ['Income taxpayers', 'Programs funded from recurring revenue'],
        benefits: [
          'Retains recurring revenue, which is the only kind that can support recurring commitments.',
          'Rate reductions compound across years, so pausing one affects every year that follows.',
        ],
        tradeoffs: [
          'Taxpayers keep less than current law promises them.',
          'Scheduled reductions are part of the plan businesses and households have already made decisions against.',
        ],
        wouldBeSourcedBy: FISCAL_NOTE_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'accelerate-rate-reduction',
        label: 'Accelerate the rate reduction',
        description: 'Lower the personal income tax rate faster than current law provides.',
        affects: ['Income taxpayers', 'Recurring General Fund availability'],
        benefits: [
          'Leaves more income with households and businesses, and the reduction applies at every income level under a flat rate.',
          'A lower rate is one factor businesses weigh when comparing states.',
        ],
        tradeoffs: [
          'Reduces recurring revenue permanently unless a later budget reverses it.',
          'Under a flat rate, the dollar value of a rate cut rises with income.',
        ],
        wouldBeSourcedBy: FISCAL_NOTE_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'corporate-tax',
    category: 'revenue',
    title: 'Corporate Income and Franchise Tax',
    question: 'Should the scheduled corporate income tax phase-out proceed as enacted?',
    enactedBaseline:
      'North Carolina statute provides for a scheduled reduction of the corporate income tax rate, as reflected in the revenue assumptions underlying S.L. 2026-41.',
    background:
      'North Carolina has been reducing its corporate income tax rate on a statutory schedule toward elimination. Corporate income tax collections are more volatile year to year than personal income tax, which affects both how much the state loses from a reduction and how reliable that revenue was to begin with.',
    choices: [
      enactedOption({
        description: 'Leave the corporate income tax schedule as it stands in current law.',
        affects: ['Corporations doing business in North Carolina', 'Recurring General Fund revenue'],
      }),
      unsourcedOption({
        id: 'pause-corporate-phaseout',
        label: 'Pause the corporate phase-out',
        description:
          'Hold the corporate income tax rate at its current level rather than continuing the scheduled reduction.',
        affects: ['Corporate taxpayers', 'Recurring revenue'],
        benefits: [
          'Retains recurring revenue from a base that is largely paid by businesses operating in multiple states.',
          'Preserves flexibility while the effects of reductions already taken are still being observed.',
        ],
        tradeoffs: [
          'Changes a schedule businesses have planned around, which carries its own cost in predictability.',
          'Corporate tax revenue is volatile, so the retained revenue is less dependable than its size suggests.',
        ],
        wouldBeSourcedBy: FISCAL_NOTE_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'sales-tax-base',
    category: 'revenue',
    title: 'Sales Tax Base',
    question: 'Should the state change what the sales tax applies to?',
    enactedBaseline:
      'The sales and use tax applies to the goods and services specified in current law, as reflected in the revenue assumptions underlying S.L. 2026-41.',
    background:
      'Sales tax is charged on most goods and on a limited set of services. As household spending has shifted from goods toward services, a base built mainly on goods grows more slowly than the economy does. Broadening the base to more services raises revenue without changing the rate, but sales tax takes a larger share of income from lower-income households, so base changes have distributional effects that rate changes do not fully mirror.',
    choices: [
      enactedOption({
        description: 'Leave the sales tax base as it stands in current law.',
        affects: ['Consumers', 'Service businesses', 'Local governments sharing sales tax revenue'],
      }),
      unsourcedOption({
        id: 'broaden-sales-base',
        label: 'Broaden the base to more services',
        description:
          'Extend the sales tax to additional services that are currently untaxed.',
        affects: ['Consumers of newly taxed services', 'Service businesses', 'Local governments'],
        benefits: [
          'A base that tracks how households actually spend grows with the economy instead of falling behind it.',
          'Treats similar transactions alike rather than by whether they are classified as a good or a service.',
        ],
        tradeoffs: [
          'Sales tax takes a larger share of income from lower-income households.',
          'Newly covered businesses face collection and compliance costs they do not have today.',
        ],
        wouldBeSourcedBy: FISCAL_NOTE_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'narrow-sales-base',
        label: 'Exempt additional necessities',
        description:
          'Remove sales tax from additional categories of household necessities.',
        affects: ['Lower-income households', 'Retailers', 'Local governments sharing the revenue'],
        benefits: [
          'Reduces the share of income lower-income households pay in sales tax.',
          'Exemptions reach households directly at the point of purchase.',
        ],
        tradeoffs: [
          'Reduces recurring revenue, and local governments share the sales tax base.',
          'Exemptions apply to every buyer, including those who do not need the relief.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
]
