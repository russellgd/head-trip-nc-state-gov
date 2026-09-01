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

/**
 * Teacher and instructional support compensation.
 *
 * Enacted: Committee Report item 37, "Compensation Increase Reserve - Teachers
 * and Instructional Support", $514,733,062 recurring plus $83,375,837
 * nonrecurring, totalling $598,108,899. It sets starting base pay at $48,000
 * with an average increase of 8%, and the nonrecurring part is one-time bonuses
 * of $500 for staff with up to 15 years of experience and $1,000 for those with
 * more.
 *
 * Governor: Budget Book p. 70 item 1, $734,368,000 recurring and nothing
 * nonrecurring, raising starting salaries to the highest in the Southeast with
 * an average raise of 11% and removing a ten-year pay plateau for experienced
 * teachers and instructional support staff.
 *
 * The recurring and nonrecurring parts move in OPPOSITE directions, and that is
 * the substance of the choice rather than a technicality: the Governor funds
 * the whole increase as recurring salary where the enacted budget funds part of
 * it as a bonus that does not repeat. Recurring money continues into every
 * later year; a bonus does not. So this option is stored with its real split
 * and is deliberately exempt from the recurring-by-convention treatment used
 * where no published split exists.
 *
 * SCOPE, disclosed because it is not a clean like-for-like: the enacted item
 * bundles the salary increase together with the one-time bonus, while the
 * Governor's item covers salary only and a separate item at p. 71 funds a
 * larger public school bonus of $253,737,000 nonrecurring. That separate item
 * is not part of this bridge and is not scored anywhere in this project. The
 * negative nonrecurring figure here therefore means the enacted bonus is not
 * carried inside this item, not that the Governor proposes no bonus.
 */
const TEACHER_COMPENSATION = {
  enactedRecurring: 514_733_062,
  enactedNonrecurring: 83_375_837,
  governorRecurring: 734_368_000,
  governorNonrecurring: 0,
  page: '70',
  item: 1,
}

export const TEACHER_COMPENSATION_BRIDGE = {
  recurring: TEACHER_COMPENSATION.governorRecurring - TEACHER_COMPENSATION.enactedRecurring,
  nonrecurring:
    TEACHER_COMPENSATION.governorNonrecurring - TEACHER_COMPENSATION.enactedNonrecurring,
}

const ENACTED_TEACHER_TOTAL =
  TEACHER_COMPENSATION.enactedRecurring + TEACHER_COMPENSATION.enactedNonrecurring
const GOVERNOR_TEACHER_TOTAL =
  TEACHER_COMPENSATION.governorRecurring + TEACHER_COMPENSATION.governorNonrecurring

/**
 * The Medicaid rebase.
 *
 * A rebase funds the projected cost of continuing the Medicaid programme as it
 * already exists. The projection moves with enrollment, how much care enrollees
 * use, medical prices, the capitation rates paid to managed care plans, and the
 * federal matching rate. It is not an expansion of eligibility and it does not
 * add a benefit; both budgets are pricing the same programme, and they arrive
 * at different numbers for it.
 *
 * Enacted: Committee Report item 99, "Medicaid Rebase", $847,200,000 recurring.
 * Governor: Budget Book p. 174 item 7, "Medicaid Rebase", $1,047,197,722
 * recurring. Identical item titles, the same budget code 14445, the same
 * November 2025 certified base of $6,544,062,901, and both figures net of
 * receipts: the enacted item shows requirements of $2,658,573,067 less receipts
 * of $1,811,373,067, so the federal share is already removed on that side, and
 * the Governor's figure is likewise an appropriation. The bridge is therefore
 * like-for-like.
 *
 * Both figures are entirely recurring in their own documents, and are stored
 * that way. Nothing here is converted by convention.
 *
 * The remaining Health Benefits residual of -$28,195,759 is not a Medicaid
 * reduction the Governor proposes. It is the net of items each budget funds and
 * the other does not; MEDICAID_AUDIT.md sets out every item on both sides, and
 * the summary of it is carried onto the aggregate card.
 */
const MEDICAID_REBASE = {
  enacted: 847_200_000,
  governor: 1_047_197_722,
  page: '174',
  item: 7,
}

export const MEDICAID_REBASE_BRIDGE = MEDICAID_REBASE.governor - MEDICAID_REBASE.enacted

/**
 * The Health Benefits residual, in the documents' own items.
 *
 * Stated as data rather than prose so the aggregate card, the audit and the
 * tests all quote the same figures. Signs are as each budget records them.
 */
export const HEALTH_BENEFITS_RESIDUAL_ITEMS = {
  enactedOnly: [
    { title: 'Rates for Personal Care Services', amount: 70_800_000 },
    { title: 'Innovations Waiver direct care worker wages', amount: 21_300_000 },
    { title: 'Healthy Opportunities Pilot', amount: 9_000_000 },
  ],
  governorOnly: [
    { title: 'Managed Care Oversight', amount: 13_666_009 },
    { title: 'Innovations Waiver slots', amount: 9_339_600 },
  ],
  explicitGovernorReductions: [{ title: 'Vacant Position Reductions', amount: -659_084 }],
} as const

export const PROGRAM_LEVEL_DECISIONS: Decision[] = [
  {
    id: 'teacher-compensation',
    category: 'k12-education',
    title: 'Teacher and Instructional Support Pay',
    question:
      'Should the state raise teacher pay further than the enacted budget does, and should the increase be recurring salary or a one-time bonus?',
    enactedBaseline: `S.L. 2026-41 funds a new teacher salary schedule for FY 2026-27 setting starting base pay at $48,000 with an average increase of 8%, at ${usd(
      ENACTED_TEACHER_TOTAL,
    )}: ${usd(TEACHER_COMPENSATION.enactedRecurring)} recurring, plus ${usd(
      TEACHER_COMPENSATION.enactedNonrecurring,
    )} nonrecurring for one-time bonuses of $500 for staff with up to 15 years of experience and $1,000 for those with more (Committee Report item 37).`,
    background:
      'North Carolina sets a single statewide salary schedule, so a change reaches all 115 districts at once, though districts may supplement locally. The choice here is about size and about form. Recurring salary continues into every later year and compounds as staff move up the schedule; a one-time bonus is paid once and leaves the schedule where it was. A budget can spend the same money either way in a single year and leave the state in a very different position the year after, which is why this decision is stored with its real recurring split rather than the convention used elsewhere.',
    choices: [
      enactedOption({
        label: 'Keep the enacted schedule and bonus',
        description: `Fund the enacted salary schedule at ${usd(
          TEACHER_COMPENSATION.enactedRecurring,
        )} recurring and the one-time bonuses at ${usd(
          TEACHER_COMPENSATION.enactedNonrecurring,
        )} nonrecurring.`,
        affects: [
          'Teachers and instructional support staff',
          'The 115 local school districts',
          'Future budgets, through the recurring portion',
        ],
        benefits: [
          'A substantial increase already funded, with part of it as a bonus that does not commit future budgets.',
          'The bonus reaches staff immediately without raising the schedule permanently.',
        ],
        tradeoffs: [
          'A bonus does not compound, so it does nothing for the salary a teacher earns in later years.',
          'Starting pay set at $48,000 may still trail competing states, which is the gap the Governor’s alternative is aimed at.',
        ],
      }),
      proposalOption({
        id: 'governor-schedule',
        label: `Adopt the Governor’s salary schedule: ${usd(
          TEACHER_COMPENSATION_BRIDGE.recurring + TEACHER_COMPENSATION_BRIDGE.nonrecurring,
        )} net`,
        description: `Fund the Governor’s recommended schedule instead: ${usd(
          GOVERNOR_TEACHER_TOTAL,
        )}, all of it recurring, raising starting teacher salaries to the highest in the Southeast with an average raise of 11% and removing a ten-year pay plateau for experienced teachers, instructional support personnel, school psychologists, speech pathologists and audiologists. Against the enacted ${usd(
          ENACTED_TEACHER_TOTAL,
        )} this is ${usd(
          TEACHER_COMPENSATION_BRIDGE.recurring,
        )} more recurring and ${usd(
          Math.abs(TEACHER_COMPENSATION_BRIDGE.nonrecurring),
        )} less nonrecurring.`,
        spending: {
          recurring: TEACHER_COMPENSATION_BRIDGE.recurring,
          nonrecurring: TEACHER_COMPENSATION_BRIDGE.nonrecurring,
        },
        affects: [
          'Teachers and instructional support staff, and experienced staff most of all',
          'Districts competing with other states for staff',
          'Future budgets, which inherit the whole increase rather than part of it',
        ],
        benefits: [
          'Puts the entire increase into the salary schedule, so it continues and compounds instead of being paid once.',
          'The Governor’s budget places North Carolina 45th nationally and 11th of 12 in the Southeast for starting pay, which is the gap this is aimed at.',
          'Removing a ten-year plateau targets mid-career staff, who leave at higher rates than the most experienced.',
        ],
        tradeoffs: [
          'Converting one-time money into recurring salary commits every future budget, and this is the largest recurring commitment in the exercise.',
          'Higher salaries also raise the state’s retirement and benefit obligations, which are budgeted separately and not counted here.',
          'Staff lose the immediate one-time bonus this item funds, though the Governor funds a separate public school bonus elsewhere.',
        ],
        derivation: `Recurring: the Governor's ${usd(
          TEACHER_COMPENSATION.governorRecurring,
        )} less the enacted ${usd(TEACHER_COMPENSATION.enactedRecurring)} is ${usd(
          TEACHER_COMPENSATION_BRIDGE.recurring,
        )}. Nonrecurring: the Governor's ${usd(
          TEACHER_COMPENSATION.governorNonrecurring,
        )} less the enacted ${usd(TEACHER_COMPENSATION.enactedNonrecurring)} is ${usd(
          TEACHER_COMPENSATION_BRIDGE.nonrecurring,
        )}. Net ${usd(
          TEACHER_COMPENSATION_BRIDGE.recurring + TEACHER_COMPENSATION_BRIDGE.nonrecurring,
        )}. The two components are stored separately because they move in opposite directions, and combining them would hide the shift from one-time money into recurring salary that is the substance of this choice.`,
        note:
          `Both figures are FY 2026-27 appropriations measured from the same November 2025 certified budget, which is what makes subtracting them valid. One scope point to read carefully: the enacted item bundles the salary increase with the one-time bonus, while the Governor's item covers salary only and a separate item at p. 71 funds a larger public school bonus of $253,737,000 nonrecurring that is not part of this bridge and is not scored anywhere here. The negative nonrecurring figure therefore means the bonus is not carried inside this item, not that the Governor proposes no bonus.`,
        sources: [
          cite(
            'governorRecommendation',
            'Public Instruction, item 1, Compensation Increase – Teachers and Instructional Support, p. 70',
          ),
          cite(
            'committeeReport',
            'Department of Public Instruction, item 37, Compensation Increase Reserve - Teachers and Instructional Support ($514,733,062 recurring; $83,375,837 nonrecurring)',
          ),
        ],
      }),
    ],
  },
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
  {
    id: 'medicaid-rebase',
    category: 'health-human-services',
    title: 'Fund Projected Medicaid Costs',
    question:
      'How much should the state budget against the projected cost of continuing the Medicaid programme it already runs?',
    enactedBaseline: `S.L. 2026-41 funds a Medicaid rebase of ${usd(
      MEDICAID_REBASE.enacted,
    )} in recurring General Fund money for FY 2026-27 (Committee Report item 99, "Medicaid Rebase"). The figure is net of receipts: the item shows requirements of $2,658,573,067 against receipts of $1,811,373,067, so what is scored here is the state share only.`,
    background:
      'A rebase is not new policy. It funds the projected cost of maintaining the existing Medicaid programme for people already eligible for it, and the projection moves with enrollment, how much care enrollees use, medical prices, the capitation rates paid to managed care plans, and the federal matching rate. Nothing on this card expands eligibility or adds a benefit. Because Medicaid is an entitlement, the obligation exists whether or not the budget funds it in full: budgeting below the projection does not reduce what the state owes providers, it defers recognition of the cost, usually into a later supplemental appropriation. Both figures below are General Fund appropriations with federal receipts already netted out, so each state dollar moves considerably more total health care spending than the state itself pays. The two numbers are two forecasts of the same programme, made at different times by different agencies, and neither document scores the other.',
    choices: [
      enactedOption({
        label: `Maintain the enacted rebase: ${usd(MEDICAID_REBASE.enacted)}`,
        description: `Fund the rebase at the enacted ${usd(
          MEDICAID_REBASE.enacted,
        )} recurring, the amount S.L. 2026-41 provides against projected FY 2026-27 Medicaid costs.`,
        affects: [
          'Medicaid enrollees, through what the programme can pay providers',
          'Hospitals, clinics and other providers',
          'Later budgets, which absorb any gap between the appropriation and actual cost',
        ],
        benefits: [
          'Leaves more General Fund capacity available for other purposes in this budget.',
          'The enacted figure is the projection the General Assembly acted on, and it is the more recent of the two.',
        ],
        tradeoffs: [
          'The two forecasts differ by about $200 million, and these documents do not establish which is closer to what the programme will actually cost.',
          'Because the obligation is an entitlement, any gap between the appropriation and the actual cost does not disappear; it appears in a later budget instead.',
        ],
      }),
      proposalOption({
        id: 'governor-rebase',
        label: `Adopt the Governor's rebase recommendation: ${usd(MEDICAID_REBASE_BRIDGE)} more`,
        description: `Fund the rebase at ${usd(
          MEDICAID_REBASE.governor,
        )} recurring, the amount recommended in Governor Stein's Recommended Budget for FY 2026-27 (p. ${MEDICAID_REBASE.page}, item ${MEDICAID_REBASE.item}, "Medicaid Rebase"), rather than the enacted ${usd(
          MEDICAID_REBASE.enacted,
        )}. The incremental appropriation is ${usd(
          MEDICAID_REBASE_BRIDGE,
        )} recurring. This funds the same programme at a higher projected cost; it does not change who is eligible or what Medicaid covers.`,
        spending: { recurring: MEDICAID_REBASE_BRIDGE },
        affects: [
          'Medicaid enrollees, through what the programme can pay providers',
          'Hospitals, clinics and other providers',
          'Every other area of the budget, through the General Fund capacity this uses',
        ],
        benefits: [
          'Budgets more against the projected cost of an entitlement the state is obliged to pay either way.',
          'A larger appropriation leaves less of the programme to be settled in a later supplemental bill, which is decided outside the ordinary budget debate.',
          'Because federal dollars match state dollars, the additional state share draws further federal money into health care in the state.',
        ],
        tradeoffs: [
          'A recurring commitment of about $200 million that is not available for anything else, and recurring money continues into every later year.',
          'It is a forecast. If actual enrollment and utilisation come in lower, money is committed against a cost that did not arise.',
          'The state share is the smaller part of the total: raising it also raises total programme spending by considerably more than the state pays.',
        ],
        derivation: `The Governor's recommended FY 2026-27 Medicaid rebase of ${usd(
          MEDICAID_REBASE.governor,
        )} (p. ${MEDICAID_REBASE.page}, item ${MEDICAID_REBASE.item}) less the enacted ${usd(
          MEDICAID_REBASE.enacted,
        )} (Committee Report item 99) is ${usd(
          MEDICAID_REBASE_BRIDGE,
        )}. Both are recurring FY 2026-27 appropriations for the same item in the same budget code, measured from the same certified base and both net of receipts, and only the difference is scored.`,
        note:
          `Both figures are FY 2026-27 appropriations measured from the same November 2025 certified budget of $6,544,062,901, which is what makes subtracting them valid; the Governor's published change columns are never scored against the enacted budget directly. Two cautions. First, this is a rebase: it prices the existing programme, and neither document presents it as an expansion of eligibility or as a new benefit. Second, neither document states that either amount would create or prevent a shortfall, and nothing here should be read as saying so. What can be said is that the two are forecasts of the same obligation and differ by ${usd(
            MEDICAID_REBASE_BRIDGE,
          )}.`,
        sources: [
          cite('governorRecommendation', 'DHHS - Health Benefits, item 7, Medicaid Rebase, p. 174'),
          cite(
            'committeeReport',
            'Department of Health and Human Services, Division of Health Benefits, item 99, Medicaid Rebase ($847,200,000 recurring; requirements $2,658,573,067 less receipts $1,811,373,067)',
          ),
        ],
      }),
    ],
  },
]
