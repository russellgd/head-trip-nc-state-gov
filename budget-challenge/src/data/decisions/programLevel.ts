/**
 * Program-level decisions split out of an agency aggregate.
 *
 * Each of these compares one named programme as the enacted budget funds it
 * with the same programme as the Governor recommends funding it. Both figures
 * are FY 2026-27 appropriations measured from the same certified base, so the
 * difference between them is the incremental appropriation and nothing else.
 *
 * Whatever is scored here is backed out of the parent agency decision, so that
 * choosing both cannot count the same money twice.
 */
import type { Decision } from '../types'
import { cite } from '../sources'
import { enactedOption, proposalOption, usd } from './helpers'

/**
 * Correctional officer salaries.
 *
 * Enacted: Committee Report item 40, "Correctional Officers - Salary
 * Adjustments", $47,429,250 recurring, raising each step of the correctional
 * officer salary schedule by 13% in FY 2026-27.
 *
 * Governor: Budget Book p. 203 item 5, "Correctional Officer Salary Increase",
 * $82,554,010 recurring, funding 10% in the first year of the biennium and 5%
 * in the second for a total of 15%.
 *
 * A caution that is stated on the card as well as here. The two documents do
 * not cost a percentage point the same way: 13% costs $3,648,404 per point in
 * the act and 15% costs $5,503,601 per point in the Governor's book, half as
 * much again. The Governor's own figures are internally consistent — the first
 * year's 10% is costed at $55,035,673 and the second year's 15% at exactly one
 * and a half times that — so this is not an extraction error. It means the two
 * costings cover different cost components or populations, which these
 * documents do not resolve. The appropriation difference is still exactly what
 * it is; what must not be inferred from it is the price of two percentage
 * points.
 */
const CORRECTIONAL_OFFICERS = {
  enacted: 47_429_250,
  governor: 82_554_010,
  enactedPercent: 13,
  governorPercent: 15,
  page: '203',
  item: 5,
}

export const CORRECTIONAL_OFFICER_BRIDGE =
  CORRECTIONAL_OFFICERS.governor - CORRECTIONAL_OFFICERS.enacted

export const PROGRAM_LEVEL_DECISIONS: Decision[] = [
  {
    id: 'correctional-officer-pay',
    category: 'justice-public-safety',
    title: 'Correctional Officer Pay',
    question:
      'Should the state raise correctional officer pay further than the enacted budget does?',
    enactedBaseline: `S.L. 2026-41 raises each step of the correctional officer salary schedule by ${CORRECTIONAL_OFFICERS.enactedPercent}% in FY 2026-27, at a cost of ${usd(
      CORRECTIONAL_OFFICERS.enacted,
    )} in recurring funds (Committee Report item 40, "Correctional Officers - Salary Adjustments"). Probation and parole officers are funded separately, at item 41, and are not part of this decision.`,
    background:
      'Prison vacancy rates drive mandatory overtime, so money budgeted as salary for posts nobody fills is spent anyway. Both the enacted budget and the Governor treat officer pay as the lever, and both fund an increase; they differ on how large. The Governor’s budget notes that North Carolina ranked 49th nationally in corrections officer pay. Pay is one factor among several: working conditions and how far a facility is from where people want to live also drive turnover, and a facility that cannot be staffed safely may be consolidated, which changes where incarcerated people are held relative to their families and counsel.',
    choices: [
      enactedOption({
        label: `Keep the enacted ${CORRECTIONAL_OFFICERS.enactedPercent}% increase`,
        description: `Raise each step of the salary schedule by ${CORRECTIONAL_OFFICERS.enactedPercent}%, as the enacted budget provides, at ${usd(
          CORRECTIONAL_OFFICERS.enacted,
        )} recurring.`,
        affects: [
          'Correctional officers',
          'Incarcerated people, through staffing levels',
          'Rural counties where a prison is a major employer',
        ],
        benefits: [
          'A double-digit increase already funded, without committing further recurring money.',
          'Leaves room to see whether the increase moves vacancy rates before adding to it.',
        ],
        tradeoffs: [
          'If the increase does not close the vacancy gap, overtime costs continue regardless.',
          'Neighbouring states and private employers adjust pay too, so a one-time step can erode.',
        ],
      }),
      proposalOption({
        id: 'governor-increase',
        label: `Adopt the Governor’s increase: ${usd(CORRECTIONAL_OFFICER_BRIDGE)} more`,
        description: `Fund the Governor’s recommended correctional officer increase — ${CORRECTIONAL_OFFICERS.governorPercent}% in total, made up of 10% in the first year of the biennium and 5% in the second — instead of the enacted ${CORRECTIONAL_OFFICERS.enactedPercent}%. The Governor’s recommendation appropriates ${usd(
          CORRECTIONAL_OFFICERS.governor,
        )} recurring for FY 2026-27 against the enacted ${usd(
          CORRECTIONAL_OFFICERS.enacted,
        )}, so the incremental cost is ${usd(CORRECTIONAL_OFFICER_BRIDGE)}.`,
        spending: { recurring: CORRECTIONAL_OFFICER_BRIDGE },
        affects: [
          'Correctional officers',
          'Incarcerated people and staff, through safe staffing levels',
          'Future budgets, because salary increases recur',
        ],
        benefits: [
          'Chronic vacancies are already paid for through mandatory overtime, so part of any increase substitutes for money the state spends anyway.',
          'The Governor’s budget puts North Carolina 49th nationally in corrections officer pay, which is the gap the recommendation is aimed at.',
          'Staffing levels affect safety for officers and for incarcerated people alike.',
        ],
        tradeoffs: [
          'A recurring cost on top of an increase the budget has already funded.',
          'Pay is one driver of turnover; conditions and facility location are others, and money does not reach those.',
          'Raising one schedule invites comparison from every other state law enforcement and custody classification.',
        ],
        derivation: `The Governor's recommended FY 2026-27 appropriation for correctional officer salaries of ${usd(
          CORRECTIONAL_OFFICERS.governor,
        )} (p. ${CORRECTIONAL_OFFICERS.page}, item ${CORRECTIONAL_OFFICERS.item}) less the enacted ${usd(
          CORRECTIONAL_OFFICERS.enacted,
        )} (Committee Report item 40) is ${usd(
          CORRECTIONAL_OFFICER_BRIDGE,
        )}. Both are recurring FY 2026-27 appropriations for the same programme, measured from the same certified base, and only the difference is scored.`,
        note:
          `Both figures are FY 2026-27 appropriations measured from the same November 2025 certified budget, which is what makes subtracting them valid; the Governor's published change columns are never scored against the enacted budget directly. Read the percentages and the dollars as two separate facts. The enacted budget funds ${CORRECTIONAL_OFFICERS.enactedPercent}% at ${usd(
            CORRECTIONAL_OFFICERS.enacted,
          )}, which is ${usd(
            Math.round(CORRECTIONAL_OFFICERS.enacted / CORRECTIONAL_OFFICERS.enactedPercent),
          )} per percentage point; the Governor funds ${CORRECTIONAL_OFFICERS.governorPercent}% at ${usd(
            CORRECTIONAL_OFFICERS.governor,
          )}, which is ${usd(
            Math.round(CORRECTIONAL_OFFICERS.governor / CORRECTIONAL_OFFICERS.governorPercent),
          )} per point, half as much again. The Governor's figures are internally consistent, so this is not a transcription error: the two documents evidently cost their increases over different components or populations, and these documents do not resolve which. The appropriation difference scored here is exact, but it should not be read as the price of two percentage points.`,
        sources: [
          cite(
            'governorRecommendation',
            'Adult Correction, item 5, Correctional Officer Salary Increase, p. 203',
          ),
          cite(
            'committeeReport',
            'Department of Adult Correction, item 40, Correctional Officers - Salary Adjustments ($47,429,250 recurring, 13% per schedule step)',
          ),
        ],
      }),
    ],
  },
]
