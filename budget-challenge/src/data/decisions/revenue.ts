/**
 * Taxes and other General Fund revenue.
 *
 * Revenue is the hardest side of a budget to source honestly, because what a
 * tax change raises is a forecast rather than an appropriation. These decisions
 * therefore work only from figures the act's own availability statement prints:
 * the consensus forecast the budget was built on, and the two adjustments the
 * act applies to it.
 *
 * The act does not split its revenue adjustments into recurring and
 * nonrecurring parts. They are treated here as nonrecurring adjustments to
 * FY 2026-27 availability, which is how the availability statement presents
 * them; that treatment is recorded as a simplification in DATA_NOTES.md.
 */
import type { Decision } from '../types'
import { AVAILABILITY } from '../enacted'
import { cite } from '../sources'
import { enactedOption, illustrativeOption, percentOf, usd, verifiedOption } from './helpers'

const AVAILABILITY_SECTION = 'Section 2.2(a), General Fund Availability'
const sources = [cite('sl2026_41', AVAILABILITY_SECTION)]

const TAX = AVAILABILITY.consensusTaxRevenue
const ONE_PERCENT_OF_TAX = percentOf(TAX, 1)
const TAX_ADJUSTMENT = AVAILABILITY.adjustmentsToTaxRevenue
const NONTAX_ADJUSTMENT = AVAILABILITY.adjustmentsToNonTaxRevenue

export const REVENUE_DECISIONS: Decision[] = [
  {
    id: 'tax-revenue-level',
    category: 'revenue',
    title: 'The Level of Tax Revenue',
    question:
      'Should the state collect more or less tax revenue than the budget assumes?',
    enactedBaseline: `S.L. 2026-41 builds the budget on a consensus forecast of ${usd(
      TAX,
    )} in tax revenue for FY 2026-27, the largest single component of General Fund availability.`,
    background:
      'North Carolina taxes personal income at a single flat rate, and that tax is the largest source of General Fund revenue, followed by the sales and use tax and the corporate income and franchise taxes. Because the rates apply to a broad base, a change of a fraction of a percentage point moves a large amount of money. The consensus forecast is prepared jointly by legislative and executive staff and is a projection, not a guarantee: collections can come in above or below it. This decision changes the amount collected without specifying which tax is changed, because the act publishes the forecast total rather than a costed rate change.',
    choices: [
      enactedOption({
        label: `Collect as forecast: ${usd(TAX)}`,
        description:
          'Leave tax revenue at the level the consensus forecast projects and the budget was built on.',
        affects: ['All North Carolina taxpayers', 'Every programme funded from recurring revenue'],
      }),
      illustrativeOption({
        id: 'increase-one-percent',
        label: `Collect 1% more: ${usd(ONE_PERCENT_OF_TAX)}`,
        description: `Raise ${usd(
          ONE_PERCENT_OF_TAX,
        )} in additional recurring tax revenue, one per cent above the forecast.`,
        revenue: { recurring: ONE_PERCENT_OF_TAX },
        affects: [
          'Taxpayers, in proportion to whichever tax is changed',
          'Programmes that depend on recurring revenue',
          'Future budgets, because a rate change recurs',
        ],
        benefits: [
          'Recurring revenue is the only kind that can support recurring commitments without leaving a hole in the following year.',
          'A one per cent change is small in rate terms and large in dollar terms, because the base is broad.',
        ],
        tradeoffs: [
          'Taxpayers keep less than current law provides, and under a flat rate the effect is spread across every income level.',
          'Households and businesses have already planned against the rates in current law.',
        ],
        derivation: `1% of the consensus tax revenue forecast of ${usd(TAX)}: ${usd(
          TAX,
        )} × 1% = ${usd(
          ONE_PERCENT_OF_TAX,
        )}. The percentage is a scale chosen for this exercise. It is not a proposal from any budget document, and no North Carolina official or institution proposed it; the dollar figure that follows is exact.`,
        implementationNote: 'A change in tax revenue is not something the budget can simply specify. It has to come from a change to a rate, a base, a credit, or an exemption, each written in statute and each falling on a different set of taxpayers. What a given change would actually raise is an estimate produced by the consensus forecasting process, not a figure a budget writer can choose. This option shows the size of a one per cent movement without saying which tax produced it, because the act publishes the forecast total rather than a costed rate change.',
        replacementNeeded: 'An official fiscal estimate for a specific tax change: a fiscal note prepared by the Fiscal Research Division on a bill amending a rate, base, credit or exemption, or the revenue provisions of the Governor’s Recommended Budget for FY 2026-27.',
        sources,
      }),
      illustrativeOption({
        id: 'reduce-one-percent',
        label: `Collect 1% less: ${usd(ONE_PERCENT_OF_TAX)}`,
        description: `Forgo ${usd(
          ONE_PERCENT_OF_TAX,
        )} in recurring tax revenue, one per cent below the forecast.`,
        revenue: { recurring: -ONE_PERCENT_OF_TAX },
        affects: [
          'Taxpayers, in proportion to whichever tax is changed',
          'Programmes funded from recurring revenue',
          'Future budgets, because a rate reduction recurs',
        ],
        benefits: [
          'Leaves more income with households and businesses.',
          'Tax rates are one factor businesses weigh when comparing states.',
        ],
        tradeoffs: [
          'Reduces recurring revenue permanently unless a later budget reverses it.',
          'Recurring commitments already in the base do not fall with revenue.',
        ],
        derivation: `1% of the consensus tax revenue forecast of ${usd(TAX)}: ${usd(
          TAX,
        )} × 1% = ${usd(
          ONE_PERCENT_OF_TAX,
        )}. The percentage is a scale chosen for this exercise. It is not a proposal from any budget document, and no North Carolina official or institution proposed it; the dollar figure that follows is exact.`,
        implementationNote: 'A change in tax revenue is not something the budget can simply specify. It has to come from a change to a rate, a base, a credit, or an exemption, each written in statute and each falling on a different set of taxpayers. What a given change would actually raise is an estimate produced by the consensus forecasting process, not a figure a budget writer can choose. This option shows the size of a one per cent movement without saying which tax produced it, because the act publishes the forecast total rather than a costed rate change.',
        replacementNeeded: 'An official fiscal estimate for a specific tax change: a fiscal note prepared by the Fiscal Research Division on a bill amending a rate, base, credit or exemption, or the revenue provisions of the Governor’s Recommended Budget for FY 2026-27.',
        sources,
      }),
    ],
  },

  {
    id: 'tax-revenue-adjustments',
    category: 'revenue',
    title: 'Enacted Adjustments to Tax Revenue',
    question: 'Should the budget keep its enacted adjustment to tax revenue?',
    enactedBaseline: `On top of the consensus forecast, the availability statement adds ${usd(
      TAX_ADJUSTMENT,
    )} in adjustments to tax revenue for FY 2026-27.`,
    background:
      'The availability statement starts from the consensus forecast and then applies adjustments reflecting changes the budget itself makes to tax law or administration. They are shown as a single line rather than itemised in the act, so what can be said with confidence is the total, not its composition. Removing the adjustment means building the budget on the forecast alone.',
    choices: [
      enactedOption({
        label: `Keep the adjustment: ${usd(TAX_ADJUSTMENT)}`,
        description: 'Count the enacted adjustment to tax revenue as part of availability.',
        affects: ['Taxpayers affected by the underlying changes', 'Total General Fund availability'],
      }),
      verifiedOption({
        id: 'forgo',
        label: 'Make no adjustment',
        description: `Build the budget on the consensus forecast alone, forgoing ${usd(
          TAX_ADJUSTMENT,
        )} in availability.`,
        revenue: { nonrecurring: -TAX_ADJUSTMENT },
        affects: [
          'Taxpayers who would have been affected by the underlying changes',
          'Every programme competing for the resulting availability',
        ],
        benefits: [
          'Builds the budget on the consensus forecast alone, without relying on the effect of changes the budget itself makes.',
          'Avoids counting revenue whose composition the act does not itemise.',
        ],
        tradeoffs: [
          'Removes real availability the enacted budget counted on, which has to be found elsewhere.',
          'The underlying policy changes may be worth making regardless of the revenue they raise.',
        ],
        note: `${usd(
          TAX_ADJUSTMENT,
        )} is the exact adjustment to tax revenue printed in the availability statement.`,
        sources,
      }),
    ],
  },

  {
    id: 'nontax-revenue-adjustments',
    category: 'revenue',
    title: 'Enacted Adjustments to Non-Tax Revenue',
    question: 'Should the budget keep its enacted adjustment to non-tax revenue?',
    enactedBaseline: `The availability statement adds ${usd(
      NONTAX_ADJUSTMENT,
    )} in adjustments to non-tax revenue, on top of a consensus non-tax forecast of ${usd(
      AVAILABILITY.consensusNonTaxRevenue,
    )}.`,
    background:
      'Non-tax revenue includes fees, investment income, court costs, and transfers into the General Fund from other funds. It is much smaller than tax revenue but also less visible to the public, since most of it is charged to the people who use a particular service rather than levied generally. Adjustments here often reflect changes to fee schedules or to transfers between funds.',
    choices: [
      enactedOption({
        label: `Keep the adjustment: ${usd(NONTAX_ADJUSTMENT)}`,
        description: 'Count the enacted adjustment to non-tax revenue as part of availability.',
        affects: ['People and businesses paying state fees', 'Total General Fund availability'],
      }),
      verifiedOption({
        id: 'forgo',
        label: 'Make no adjustment',
        description: `Forgo ${usd(NONTAX_ADJUSTMENT)} in non-tax revenue adjustments.`,
        revenue: { nonrecurring: -NONTAX_ADJUSTMENT },
        affects: [
          'People and businesses who would pay the fees or charges involved',
          'Funds that would transfer money to the General Fund',
        ],
        benefits: [
          'Fees fall on the people who use a service, which is not always the group best able to pay.',
          'Transfers from other funds move money away from the purposes those funds were created for.',
        ],
        tradeoffs: [
          'Removes availability the enacted budget counted on.',
          'Non-tax revenue is charged to identifiable users rather than levied on everyone.',
        ],
        note: `${usd(
          NONTAX_ADJUSTMENT,
        )} is the exact adjustment to non-tax revenue printed in the availability statement.`,
        sources,
      }),
    ],
  },
]
