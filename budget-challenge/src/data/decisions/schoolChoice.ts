/**
 * Opportunity Scholarships.
 *
 * This decision sits in K-12 education, not in the UNC System, and the reason
 * is worth stating because the accounting says otherwise. The Opportunity
 * Scholarship Grant Reserve Fund is administered by the State Education
 * Assistance Authority, which reports through a UNC Board of Governors budget
 * code (16012, Related Educational Programs). But the policy is a scholarship
 * for children to attend K-12 private schools; it is not university financial
 * aid. The classification here follows the policy question rather than the
 * accounting location.
 *
 * THE FISCAL BRIDGE, because this is the one place where the Governor's own
 * published change figures are scored directly:
 *
 *   1. Enacted level. S.L. 2026-41 makes NO change to the programme. The
 *      Committee Report's nine line items for budget code 16012 (items 168-176)
 *      contain no Opportunity Scholarship adjustment, and the programme is
 *      funded by a standing statutory schedule at G.S. 115C-562.8 that the act
 *      neither appropriates against nor amends. The enacted change from the
 *      certified base is therefore zero.
 *   2. Governor's level. The Recommended Budget reduces the programme by
 *      $454,500,000 recurring and $587,500,000 nonrecurring in FY 2026-27
 *      (p. 91, item 3).
 *   3. Scored impact = Governor's level less enacted level. Because the enacted
 *      change is zero, that difference equals the Governor's published change.
 *
 * That equality is what licenses using the published figures here, and it was
 * checked rather than assumed. The Committee Report and the Budget Book measure
 * from the same FY 2026-27 certified base: for budget code 16012 both state
 * $913,278,591, and the enacted changes of $20,054,914 reconcile to the
 * $933,333,505 in the act's own schedule.
 *
 * ON THE PROGRAMME'S FUNDING LEVEL. G.S. 115C-562.8(b) establishes a recurring
 * appropriation of $675,000,000 to the Opportunity Scholarship Grant Fund
 * Reserve for FY 2026-27. That is a known, published figure, and an earlier
 * version of this file wrongly said the level was unpublished.
 *
 * It is not, however, the programme's total funds available, and the two must
 * not be conflated. Total funds available may also include nonrecurring
 * appropriations, balances already in the Reserve, and carryforward from prior
 * years, none of which these documents establish. So no total recommended
 * funding level is computed here: the Governor's reduction has a nonrecurring
 * component of $587,500,000 with no established nonrecurring base to subtract
 * it from, and subtracting only the recurring figure would produce a number
 * that looks like a programme level while being nothing of the kind.
 *
 * None of this changes the scored impact. The bridge is a difference, and the
 * enacted change is zero whatever the level happens to be.
 */
import type { Decision } from '../types'
import { cite } from '../sources'
import { enactedOption, proposalOption, usd, usdMillions } from './helpers'

/**
 * The recurring appropriation G.S. 115C-562.8(b) makes to the Opportunity
 * Scholarship Grant Fund Reserve for FY 2026-27.
 *
 * This is the statutory recurring appropriation and not the programme's total
 * funds available, which may also include nonrecurring appropriations, balances
 * already in the Reserve, and carryforward from prior years. The qualification
 * travels with the figure everywhere it is shown.
 */
export const OPPORTUNITY_SCHOLARSHIP_STATUTORY = 675_000_000

/** Governor's Recommended Budget, p. 91, item 3, FY 2026-27 columns. */
export const MORATORIUM = {
  recurring: -454_500_000,
  nonrecurring: -587_500_000,
  page: '91',
  item: 3,
}

export const SCHOOL_CHOICE_DECISIONS: Decision[] = [
  {
    id: 'opportunity-scholarships',
    category: 'k12-education',
    title: 'Opportunity Scholarship Eligibility and Future Awards',
    question:
      'Should the state continue the Opportunity Scholarship programme as enacted, or adopt the Governor’s recommended moratorium on new awards?',
    enactedBaseline:
      `The Opportunity Scholarship programme continues under S.L. 2026-41 at the level set by statute. G.S. 115C-562.8(b) appropriates ${usd(
        OPPORTUNITY_SCHOLARSHIP_STATUTORY,
      )} in recurring funds to the Opportunity Scholarship Grant Fund Reserve for FY 2026-27; the programme’s total funds available may be larger, since it can also draw on nonrecurring appropriations, balances already in the Reserve, and carryforward, none of which these documents establish. The act makes no change to its funding: none of the nine line items for this budget code in the incorporated Committee Report adjusts the programme, and the two technical corrections acts touch it only on administrative points such as testing records, residency, and application dates.`,
    background:
      'The Opportunity Scholarship programme provides state-funded scholarships for children to attend K-12 private schools. It is administered by the State Education Assistance Authority, which reports through a University of North Carolina budget code, so it appears in the UNC section of budget documents. It is nonetheless a K-12 school choice policy rather than university financial aid, and it is placed here on that basis. Eligibility was expanded in recent years to remove the income limit, which is what made the programme large enough to matter at the scale it now does.',
    choices: [
      enactedOption({
        label: `Continue enacted policy: ${usdMillions(
          OPPORTUNITY_SCHOLARSHIP_STATUTORY,
        )} recurring appropriation`,
        description: `Leave the Opportunity Scholarship programme funded at its statutory level, with eligibility as current law provides. G.S. 115C-562.8(b) sets the recurring appropriation to the Grant Fund Reserve at ${usd(
          OPPORTUNITY_SCHOLARSHIP_STATUTORY,
        )} for FY 2026-27; the programme's total funds available may be larger, because it can also draw on nonrecurring appropriations, balances already in the Reserve, and carryforward, none of which these documents establish.`,
        affects: [
          'Families receiving or applying for scholarships',
          'Nonpublic schools enrolling scholarship students',
          'Public school units, through enrolment',
        ],
        benefits: [
          'Families who have chosen a school in reliance on the programme can continue without disruption.',
          'Current law sets the funding schedule, so continuing it requires no new decision.',
        ],
        tradeoffs: [
          'The statutory schedule increases the programme’s cost in future years regardless of what else the budget faces.',
          'Money committed here is not available for the public schools most students attend.',
        ],
      }),
      proposalOption({
        id: 'governor-moratorium',
        label: `Adopt the Governor’s moratorium: ${usd(
          MORATORIUM.recurring + MORATORIUM.nonrecurring,
        )} less`,
        description:
          'Adopt the moratorium recommended in Governor Stein’s Recommended Budget. As the Governor describes it, the programme would offer no new awards and would add programme accountability, while low-income families that received a scholarship in the 2025-26 school year could renew. Families earning more than 150% of the eligibility level for reduced-price school lunch would no longer be eligible, returning income limits to their 2021 level, and future appropriations would decrease gradually.',
        spending: {
          recurring: MORATORIUM.recurring,
          nonrecurring: MORATORIUM.nonrecurring,
        },
        affects: [
          'Families that would otherwise receive a new scholarship',
          'Families above the restored income limit, who would lose eligibility',
          'Existing lower-income recipients, who could renew',
          'Nonpublic schools enrolling scholarship students',
          'Public schools, which the Governor proposes the savings support',
        ],
        benefits: [
          'Frees the largest single recurring sum available anywhere in this exercise, which the Governor proposes directing to public schools and teachers.',
          'Restoring an income limit targets the remaining scholarships at families with the least ability to pay privately.',
          'Existing lower-income recipients may renew, so children already enrolled are not required to change schools.',
        ],
        tradeoffs: [
          'Families above the restored income limit lose a benefit current law gives them, and some will have enrolled in reliance on it.',
          'Nonpublic schools with many scholarship students would face falling enrolment.',
          'Ending new awards removes the option for families who have not yet applied, including those who would qualify on income.',
        ],
        derivation:
          `The Governor's Recommended Budget reduces the programme by ${usd(
            MORATORIUM.recurring,
          )} recurring and ${usd(
            MORATORIUM.nonrecurring,
          )} nonrecurring in FY 2026-27 (p. ${MORATORIUM.page}, item ${MORATORIUM.item}). ` +
          'The enacted budget changes the programme by nothing: the Committee Report’s items 168 to 176 for this budget code contain no Opportunity Scholarship adjustment. ' +
          'The Governor’s recommended level less the enacted level therefore equals the Governor’s published change exactly, which is why it is scored here directly.',
        note:
          'The Governor’s figures are normally changes from the November 2025 certified budget and cannot be scored against the enacted budget. They are scored here only because the enacted change is zero, so the two coincide. That was verified: the Committee Report and the Budget Book state the same certified base of $913,278,591 for this budget code, and the enacted changes of $20,054,914 reconcile to the $933,333,505 in the act’s schedule. On the programme’s size: G.S. 115C-562.8(b) sets a recurring appropriation of $675,000,000 to the Grant Fund Reserve for FY 2026-27. That is the statutory recurring appropriation, not the programme’s total funds available, which may also include nonrecurring appropriations, reserve balances, and carryforward that these documents do not establish. No recommended total is calculated from it here, because the components do not reconcile into one.',
        sources: [
          cite(
            'generalStatutes',
            'G.S. 115C-562.8(b), recurring appropriation to the Opportunity Scholarship Grant Fund Reserve for FY 2026-27 ($675,000,000). Supplied by the project owner; not read from the statute in this build.',
          ),
          cite(
            'governorRecommendation',
            'UNC Board of Governors — Related Educational Programs, item 3, Opportunity Scholarship Moratorium, p. 91',
          ),
          cite(
            'committeeReport',
            'UNC BOG — Related Ed. Programs (budget code 16012), items 168-176, showing no Opportunity Scholarship adjustment',
          ),
          cite('sl2026_41', 'Section 2.1(a); Part VIII-A, Opportunity Scholarship provisions (administrative only)'),
        ],
      }),
    ],
  },
]
