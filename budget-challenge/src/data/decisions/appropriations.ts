/**
 * Spending decisions built on the agency appropriations in Section 2.1(a).
 *
 * A word on what these are and are not. The act establishes exactly what each
 * agency receives, and those figures are verified. It does not publish a costed
 * alternative to any of them, and no other official document was available to
 * this build, so the alternatives here are expressed as percentages of the
 * enacted appropriation.
 *
 * Every alternative here is therefore an ILLUSTRATIVE ALLOCATION SCENARIO: the
 * percentage is this project's, chosen to give a sense of scale, while the
 * dollar figure is exact arithmetic on a sourced number. None of them is a
 * policy proposal, and none may be described as one. Each carries a note on
 * what a change of that shape would actually run into, and a statement of the
 * official document that would replace it.
 */
import type { CategoryId, Decision } from '../types'
import { AGENCY_APPROPRIATIONS } from '../enacted'
import { cite } from '../sources'
import { enactedOption, illustrativeOption, percentOf, usd } from './helpers'

/** Look up one agency's enacted net appropriation by its name in the schedule. */
function netAppropriation(agency: string): number {
  const found = AGENCY_APPROPRIATIONS.find((a) => a.agency === agency)
  if (!found) throw new Error(`Unknown agency "${agency}" in the appropriations schedule`)
  return found.netAppropriation
}

/** Several agency lines added together, for decisions that span a group. */
function sumAppropriations(agencies: string[]): number {
  return agencies.reduce((total, agency) => total + netAppropriation(agency), 0)
}

const SCHEDULE_SECTION = 'Section 2.1(a), Current Operations - General Fund FY 2026-2027'

/**
 * The three-option shape shared by every spending decision: fund it as enacted,
 * fund more, or fund less, with the two alternatives sized as a percentage of
 * the enacted amount.
 *
 * Changes to an agency's operating appropriation are treated as recurring,
 * because the base budget continues from year to year unless a later budget
 * changes it. The act's schedule does not split agency totals into recurring
 * and nonrecurring parts, so that treatment is a simplification, and it is
 * recorded as one in DATA_NOTES.md.
 */
function appropriationDecision(input: {
  id: string
  category: CategoryId
  title: string
  question: string
  /** Exact agency name(s) from the act's schedule. */
  agencies: string[]
  /** How the base is described to the reader. */
  baseLabel: string
  enactedNote: string
  background: string
  percent: number
  affects: string[]
  increaseBenefits: string[]
  increaseTradeoffs: string[]
  reduceBenefits: string[]
  reduceTradeoffs: string[]
}): Decision {
  const base = sumAppropriations(input.agencies)
  const delta = percentOf(base, input.percent)
  const sources = [cite('sl2026_41', SCHEDULE_SECTION)]

  const derivation =
    input.agencies.length === 1
      ? `${input.percent}% of the enacted net appropriation of ${usd(base)} to ${input.agencies[0]}: ${usd(base)} × ${input.percent}% = ${usd(delta)}.`
      : `${input.percent}% of the enacted net appropriations totalling ${usd(base)} across ${input.agencies.length} lines in the act's schedule (${input.agencies.join('; ')}): ${usd(base)} × ${input.percent}% = ${usd(delta)}.`

  const hypothetical =
    'The percentage is a scale chosen for this exercise. It is not a proposal from any budget document, and no North Carolina official or institution proposed it. The dollar amount that follows from it is exact.'

  const implementationNote =
    `An across-the-board percentage is an arithmetic device, not an implementable plan. A real change of ${usd(delta)} to ${input.baseLabel} could not simply be applied uniformly: the appropriation is distributed by statutory formulas and allotments, parts of it are committed to entitlements, contracts, debt, or federally required matching and maintenance-of-effort obligations, and some line items cannot be reduced at all without amending statute. Deciding which programmes absorbed the change, and whether the law allowed it, would be most of the real work.`

  const replacementNeeded =
    `A costed alternative for ${input.baseLabel} from the Governor's Recommended Budget for FY 2026-27, a fiscal note on a bill affecting this appropriation, or the line-item detail in the Joint Conference Committee Report incorporated into S.L. 2026-41 at Section 45.2.`

  return {
    id: input.id,
    category: input.category,
    title: input.title,
    question: input.question,
    enactedBaseline: `S.L. 2026-41 appropriates ${usd(base)} in General Fund net appropriations for ${input.baseLabel} in FY 2026-27. ${input.enactedNote}`,
    background: input.background,
    choices: [
      enactedOption({
        label: `Fund as enacted: ${usd(base)}`,
        description: `Leave the appropriation for ${input.baseLabel} where the enacted budget sets it.`,
        affects: input.affects,
      }),
      illustrativeOption({
        id: 'increase',
        label: `Increase by ${input.percent}%: ${usd(delta)} more`,
        description: `Add ${usd(delta)} in recurring funds to ${input.baseLabel}, ${input.percent}% above the enacted level.`,
        spending: { recurring: delta },
        affects: input.affects,
        benefits: input.increaseBenefits,
        tradeoffs: input.increaseTradeoffs,
        derivation: `${derivation} ${hypothetical}`,
        implementationNote,
        replacementNeeded,
        sources,
      }),
      illustrativeOption({
        id: 'reduce',
        label: `Reduce by ${input.percent}%: ${usd(delta)} less`,
        description: `Cut ${usd(delta)} in recurring funds from ${input.baseLabel}, ${input.percent}% below the enacted level.`,
        spending: { recurring: -delta },
        affects: input.affects,
        benefits: input.reduceBenefits,
        tradeoffs: input.reduceTradeoffs,
        derivation: `${derivation} ${hypothetical}`,
        implementationNote,
        replacementNeeded,
        sources,
      }),
    ],
  }
}

export const APPROPRIATION_DECISIONS: Decision[] = [
  appropriationDecision({
    id: 'public-instruction',
    category: 'k12-education',
    title: 'Public Schools',
    question: 'Should the state spend more or less on public schools than the enacted budget does?',
    agencies: ['Department of Public Instruction'],
    baseLabel: 'the Department of Public Instruction',
    enactedNote:
      'This is the largest single appropriation in the General Fund. It flows to the 115 local school districts and to charter schools through allotment formulas, and most of it is salaries.',
    background:
      'North Carolina funds public schools mainly through allotments: formulas that send positions or dollars to districts based on enrollment and other factors. The state sets a single statewide salary schedule for teachers, so a change reaches every district at once, though districts may supplement locally, which is why the same state schedule produces different take-home pay in different counties. Because most of this money is salaries, a change here is recurring: it repeats in every future year unless a later budget reverses it.',
    percent: 3,
    affects: [
      'Public school teachers and staff',
      'The 115 local school districts, and rural districts most of all',
      'Students, through class sizes and the positions districts can fill',
    ],
    increaseBenefits: [
      'Pay and staffing are the levers the state controls directly in a labour market where districts compete with other states and private employers.',
      'Because allotments are statewide, an increase reaches districts that cannot afford large local supplements.',
    ],
    increaseTradeoffs: [
      'Recurring cost that repeats every year and grows as staff move up the salary schedule.',
      'Higher salaries also raise the state’s retirement and benefit obligations, which are budgeted separately.',
    ],
    reduceBenefits: [
      'Frees more recurring money than any other single decision in this exercise.',
      'Districts hold some local resources and can prioritise among their own schools.',
    ],
    reduceTradeoffs: [
      'A reduction of this size reaches classrooms, because most of the money is positions.',
      'Districts with the smallest local tax base have the least ability to backfill.',
    ],
  }),

  appropriationDecision({
    id: 'residential-schools',
    category: 'k12-education',
    title: 'Residential Schools for Deaf and Blind Students',
    question:
      'Should the state change what it spends on the three state residential schools?',
    agencies: ['Eastern NC School for the Deaf', 'Governor Morehead School', 'NC School for the Deaf'],
    baseLabel: 'the three state residential schools',
    enactedNote:
      'The act funds the Eastern North Carolina School for the Deaf, the Governor Morehead School, and the North Carolina School for the Deaf as separate line items.',
    background:
      'These schools serve deaf, hard-of-hearing, and blind students whose needs local districts may not be equipped to meet, and they board students from across the state. Because enrollment is small and the staffing is specialised, cost per student is high compared with a district school, and the schools have limited ability to absorb a reduction by operating at a larger scale.',
    percent: 10,
    affects: [
      'Deaf, hard-of-hearing, and blind students and their families',
      'Specialised teaching and residential staff',
      'Local districts, who serve these students when the residential schools cannot',
    ],
    increaseBenefits: [
      'Specialised staff are difficult to recruit, and these schools compete for them with districts and with other states.',
      'Residential programmes carry costs beyond instruction that a per-pupil formula does not capture.',
    ],
    increaseTradeoffs: [
      'Recurring cost serving a small number of students relative to the district system.',
      'Money spent here does not reach deaf and blind students who attend their local schools.',
    ],
    reduceBenefits: [
      'A small share of the General Fund, so a reduction here has limited effect on the overall balance.',
      'Some students served here can be served in districts with the right support.',
    ],
    reduceTradeoffs: [
      'These schools have little scale to absorb a cut without affecting instruction or residential care.',
      'Districts asked to absorb students would need specialised staff they may not have.',
    ],
  }),

  appropriationDecision({
    id: 'community-college-system',
    category: 'community-colleges',
    title: 'Community College System',
    question: 'Should the state change its funding for the community college system?',
    agencies: ['North Carolina Community College System'],
    baseLabel: 'the North Carolina Community College System',
    enactedNote:
      'The appropriation supports the 58 colleges through the system office, including instructional formula funding, workforce training, and faculty compensation.',
    background:
      'Community colleges are funded largely on enrollment, which means their revenue falls when enrollment falls even though their fixed costs do not. Faculty salaries have historically trailed both K-12 teacher pay at comparable experience and industry pay in the fields colleges train for, which is a particular problem in nursing and the skilled trades, where instructors can earn more practising than teaching. Programmes cannot run without instructors, so vacancies cap enrollment regardless of student demand.',
    percent: 5,
    affects: [
      'Students at the 58 colleges',
      'Faculty and staff',
      'Regional employers who hire their graduates',
    ],
    increaseBenefits: [
      'Instructor vacancies in high-demand fields cap enrollment no matter how many students apply.',
      'Community colleges reach adults who cannot commit to a four-year programme, a different population than the universities serve.',
    ],
    increaseTradeoffs: [
      'Recurring cost, and enrollment-driven funding is volatile.',
      'Even a substantial increase may not match private-sector pay in the fields with the worst shortages.',
    ],
    reduceBenefits: [
      'Colleges hold local and tuition resources alongside state funding.',
      'Frees recurring money for other purposes.',
    ],
    reduceTradeoffs: [
      'A reduction on top of enrollment-driven funding compounds for colleges already losing students.',
      'Rural colleges have the least ability to raise money locally.',
    ],
  }),

  appropriationDecision({
    id: 'unc-need-based-aid',
    category: 'unc-system',
    title: 'University Aid and System-Wide Programmes',
    question:
      'Should the state change its funding for university financial aid and system-wide programmes?',
    agencies: ['UNC BOG - Related Ed. Programs', 'UNC BOG - Institutional Programs'],
    baseLabel: 'UNC Board of Governors related and institutional programmes',
    enactedNote:
      'These two lines carry system-wide programmes administered by the Board of Governors rather than by an individual campus, including student financial aid.',
    background:
      'North Carolina’s constitution directs that higher education be provided free of expense "as far as practicable," and the state has long combined comparatively low tuition with need-based aid. Aid and tuition policy interact: holding tuition down and expanding aid reach overlapping students through different mechanisms and at different costs. Aid targets students by financial need rather than lowering the price for everyone, including those who can pay.',
    percent: 5,
    affects: [
      'Lower- and middle-income university students',
      'Students who borrow to cover living costs',
      'Campus financial aid offices',
    ],
    increaseBenefits: [
      'Aid is targeted by need, so it reaches the students for whom cost is the binding constraint.',
      'Reduced borrowing affects graduates for years after they leave.',
    ],
    increaseTradeoffs: [
      'Recurring cost that grows with enrollment and with tuition.',
      'Aid does not address the cost of attendance beyond tuition, where much of the shortfall sits.',
    ],
    reduceBenefits: [
      'Federal aid programmes serve many of the same students.',
      'Campuses hold their own aid resources and can prioritise among their students.',
    ],
    reduceTradeoffs: [
      'Campus resources vary widely, so a state reduction lands unevenly across the system.',
      'Cost is a documented reason students leave without finishing, and an unfinished degree carries the debt without the earnings.',
    ],
  }),

  appropriationDecision({
    id: 'unc-campus-operations',
    category: 'unc-system',
    title: 'University Campus Operations',
    question: 'Should the state change its operating support for UNC System campuses?',
    agencies: [
      'NC State University - Academic Affairs',
      'UNC at Chapel Hill - Academic Affairs',
      'UNC at Charlotte',
      'UNC at Greensboro',
      'East Carolina Univ. - Academic Affairs',
      'Appalachian State University',
      'UNC at Wilmington',
      'Western Carolina University',
      'North Carolina Central University',
      'NC A&T University',
      'Fayetteville State University',
      'Winston-Salem State University',
      'UNC at Pembroke',
      'UNC at Asheville',
      'Elizabeth City State University',
    ],
    baseLabel: 'the fifteen UNC campus academic affairs appropriations',
    enactedNote:
      'Each constituent institution receives its own line in the act. This decision moves them together.',
    background:
      'State operating support and tuition are the two main revenue sources for UNC campuses. When state support falls, campuses generally respond with some combination of tuition increases, larger classes, and fewer course sections, so a reduction rarely stays contained to administration. Smaller campuses hold thinner reserves and have less ability to raise revenue elsewhere, which means an across-the-board change does not land evenly.',
    percent: 3,
    affects: [
      'Students at all fifteen campuses',
      'Faculty and staff',
      'University towns and regional economies',
    ],
    increaseBenefits: [
      'Enrollment growth without funding growth shows up as larger classes and fewer sections, which lengthens time to degree.',
      'State support is the main alternative to raising tuition.',
    ],
    increaseTradeoffs: [
      'Large recurring cost, and enrollment can fall as well as rise.',
      'Campuses set their own internal priorities, so added funds may not reach classrooms directly.',
    ],
    reduceBenefits: [
      'Frees recurring money at a scale few other single decisions match.',
      'Campuses hold reserves and other revenue that can cushion a reduction.',
    ],
    reduceTradeoffs: [
      'Efficiency reductions tend to become tuition increases or fewer course sections.',
      'Smaller campuses have the least capacity to absorb the same percentage cut.',
    ],
  }),

  appropriationDecision({
    id: 'medicaid-health-benefits',
    category: 'health-human-services',
    title: 'Medicaid and Health Benefits',
    question: 'Should the state change the General Fund share of Medicaid and health benefits?',
    agencies: ['Health Benefits'],
    baseLabel: 'the Division of Health Benefits',
    enactedNote:
      'This is the state share of Medicaid and related health benefit programmes, and the largest single appropriation within Health and Human Services.',
    background:
      'Medicaid is an entitlement: people who qualify are enrolled, so the cost is driven by caseload and medical prices rather than by a spending cap the legislature sets. Every state dollar draws federal matching dollars, which means a state reduction removes considerably more total health care spending than the state saves, and a state increase draws more in than it costs. Budgeting below the projected cost does not reduce the obligation; it defers recognition of it, usually to a later supplemental appropriation.',
    percent: 3,
    affects: [
      'Medicaid enrollees',
      'Hospitals, clinics, and other providers',
      'County departments of social services, which administer eligibility',
    ],
    increaseBenefits: [
      'Budgeting closer to projected cost avoids a mid-year shortfall that has to be filled from elsewhere.',
      'Each state dollar draws federal matching dollars, so the total effect on health care spending is larger than the state cost.',
    ],
    increaseTradeoffs: [
      'Recurring cost committed against a projection that may turn out high.',
      'Full funding removes some of the pressure to manage utilisation and cost growth.',
    ],
    reduceBenefits: [
      'Frees a large amount of recurring money, and projections have come in high in some past years.',
      'Keeps pressure on the programme to manage cost.',
    ],
    reduceTradeoffs: [
      'Because federal dollars match state dollars, a reduction removes several times its own value in total health spending.',
      'If caseload matches the projection, the shortfall returns as an unavoidable supplemental appropriation.',
    ],
  }),

  appropriationDecision({
    id: 'behavioral-health',
    category: 'health-human-services',
    title: 'Mental Health, Developmental Disabilities, and Substance Use',
    question:
      'Should the state change what it spends on mental health, developmental disability, and substance use services?',
    agencies: ['Mental Hlth/Dev. Disabl./Subs. Use Serv.'],
    baseLabel: 'the Division of Mental Health, Developmental Disabilities, and Substance Use Services',
    enactedNote:
      'The division funds crisis response, treatment capacity, and services delivered through managed care entities and community providers.',
    background:
      'People in crisis who cannot reach treatment generally end up in emergency departments or county jails, so decisions here move costs onto hospitals and local governments rather than removing them. State funds largely serve people Medicaid does not cover, which means a reduction concentrates on the uninsured. Workforce shortages also limit how quickly funded capacity can actually open.',
    percent: 5,
    affects: [
      'People seeking mental health or substance use treatment',
      'Hospitals and emergency departments',
      'County jails and law enforcement',
    ],
    increaseBenefits: [
      'Crisis capacity outside hospitals and jails meets the need at lower cost than the settings people currently reach by default.',
      'Reduces the load on emergency departments and on officers who are not trained clinicians.',
    ],
    increaseTradeoffs: [
      'Recurring cost, and workforce shortages limit how fast funded capacity opens.',
      'Savings elsewhere in the system accrue to hospitals and counties rather than to the General Fund.',
    ],
    reduceBenefits: [
      'Medicaid covers a substantial share of behavioural health care, so state-funded services overlap with it in places.',
      'Frees recurring money.',
    ],
    reduceTradeoffs: [
      'State funds largely serve people Medicaid does not cover, so a reduction concentrates on the uninsured.',
      'Community providers operate on thin margins, and closures are difficult to reverse.',
    ],
  }),

  appropriationDecision({
    id: 'child-development',
    category: 'health-human-services',
    title: 'Child Care Subsidy and Early Education',
    question:
      'Should the state change what it spends on child care subsidy and early childhood education?',
    agencies: ['Child Development and Early Education'],
    baseLabel: 'the Division of Child Development and Early Education',
    enactedNote:
      'The division administers child care subsidy for lower-income working families and the state’s early childhood education programmes.',
    background:
      'Child care subsidy helps lower-income working families pay for care, and the rate the state pays providers determines how many providers will accept subsidised children — which is what makes a subsidy usable rather than nominal. Federal pandemic-era stabilisation funding for child care has ended, shifting more of the question onto state budgets. Care costs are a documented reason parents reduce work hours or leave the workforce, so this interacts with labour supply and with income tax collections.',
    percent: 10,
    affects: [
      'Working parents and families on the subsidy waiting list',
      'Child care providers and their staff',
      'Employers, through the availability of workers',
    ],
    increaseBenefits: [
      'Higher provider rates widen the set of providers willing to accept subsidised children.',
      'Care costs keep parents out of the workforce, so subsidy interacts with labour supply and with tax collections.',
    ],
    increaseTradeoffs: [
      'Recurring cost that grows as more families are served.',
      'Higher rates do not create capacity where no provider exists, which is the binding constraint in some rural counties.',
    ],
    reduceBenefits: [
      'Frees recurring money.',
      'Concentrates a limited subsidy on the lowest-income families.',
    ],
    reduceTradeoffs: [
      'Families who lose subsidy often cut work hours, lowering earnings and income tax collections.',
      'Providers dependent on subsidised enrollment may close, removing capacity for everyone.',
    ],
  }),

  appropriationDecision({
    id: 'environmental-quality',
    category: 'agriculture-environment',
    title: 'Environmental Quality',
    question: 'Should the state change what it spends on environmental quality programmes?',
    agencies: ['Department of Environmental Quality'],
    baseLabel: 'the Department of Environmental Quality',
    enactedNote:
      'The department monitors drinking and surface water, permits discharges, regulates air quality, and responds to contamination.',
    background:
      'Much of the cost of remediation falls on local water systems and their ratepayers, so state decisions here shift who pays as much as whether the work happens. Small systems have the least ability to spread treatment costs across a customer base, which means state assistance often determines whether they can comply at all. Reduced monitoring lowers the cost of the programme without lowering the underlying contamination.',
    percent: 10,
    affects: [
      'Public water systems and their ratepayers',
      'Communities affected by contamination',
      'Permitted industries and the timeline for their permits',
    ],
    increaseBenefits: [
      'Monitoring data is what makes it possible to target remediation rather than guess.',
      'Small systems cannot spread treatment costs across enough customers to fund compliance themselves.',
    ],
    increaseTradeoffs: [
      'Treatment obligations recur through operations and maintenance long after any capital grant is spent.',
      'Federal requirements and litigation may shift who bears these costs.',
    ],
    reduceBenefits: [
      'Federal infrastructure programmes currently fund some of this work.',
      'Utilities recover costs through rates, tying the cost to the users of the system.',
    ],
    reduceTradeoffs: [
      'Rate-funded compliance falls hardest on small systems with few customers.',
      'Permitting delays affect the businesses waiting on them as well as the environment.',
    ],
  }),

  appropriationDecision({
    id: 'natural-cultural-resources',
    category: 'agriculture-environment',
    title: 'State Parks, Natural and Cultural Resources',
    question:
      'Should the state change what it spends on state parks, museums, and cultural resources?',
    agencies: ['Department of Natural and Cultural Resources'],
    baseLabel: 'the Department of Natural and Cultural Resources',
    enactedNote:
      'The department runs the state parks system, state museums and historic sites, the state library, and cultural programmes.',
    background:
      'State parks and historic sites carry maintenance obligations that continue whether or not they are funded, and deferred maintenance in a park or a historic building compounds in the same way it does in any other state asset. Visitation has grown faster than staffing at many sites. These are also among the most visible services the state provides directly to residents, which cuts both ways in a budget debate.',
    percent: 10,
    affects: [
      'Park and historic site visitors',
      'Rural counties where a park or site is a significant local employer',
      'Site and museum staff',
    ],
    increaseBenefits: [
      'Visitation has outgrown staffing at many sites, and deferred maintenance compounds.',
      'Parks and sites support local economies in counties with few other draws.',
    ],
    increaseTradeoffs: [
      'Recurring cost for services that, unlike schools or Medicaid, are not obligations the state must meet.',
      'Added capacity takes time to translate into open facilities.',
    ],
    reduceBenefits: [
      'A comparatively small share of the General Fund with no entitlement attached.',
      'Sites generate some revenue of their own through fees.',
    ],
    reduceTradeoffs: [
      'Reduced staffing usually shows as closed days and closed facilities.',
      'Maintenance deferred at a historic site can become irreversible loss rather than a larger repair bill.',
    ],
  }),

  appropriationDecision({
    id: 'adult-correction',
    category: 'justice-public-safety',
    title: 'Adult Correction',
    question: 'Should the state change what it spends on the prison and community supervision system?',
    agencies: ['Department of Adult Correction'],
    baseLabel: 'the Department of Adult Correction',
    enactedNote:
      'The department operates the state prison system and community supervision, and it is the largest appropriation in Justice and Public Safety.',
    background:
      'Prison vacancy rates drive mandatory overtime, which means money budgeted as salary for positions no one fills is spent anyway. A facility that cannot be staffed safely may be closed or consolidated, which changes where incarcerated people are held relative to their families and their counsel. Pay is one factor in these vacancies; working conditions and facility location also drive turnover.',
    percent: 5,
    affects: [
      'Correctional officers and staff',
      'Incarcerated people and their families',
      'Rural counties where a facility is a major employer',
    ],
    increaseBenefits: [
      'Chronic vacancies are already paid for through overtime, so part of an increase substitutes for a cost the state bears anyway.',
      'Staffing levels affect safety for officers and incarcerated people alike.',
    ],
    increaseTradeoffs: [
      'Large recurring cost across a big workforce.',
      'Pay alone does not resolve vacancies driven by conditions and location.',
    ],
    reduceBenefits: [
      'Frees a large amount of recurring money.',
      'A falling prison population would reduce the need for the same capacity.',
    ],
    reduceTradeoffs: [
      'Understaffed facilities are less safe, and overtime costs rise as vacancies grow.',
      'Closures concentrate in rural counties where the facility is a major employer.',
    ],
  }),

  appropriationDecision({
    id: 'courts',
    category: 'justice-public-safety',
    title: 'The Court System',
    question: 'Should the state change what it spends on the courts?',
    agencies: ['Administrative Office of the Courts'],
    baseLabel: 'the Administrative Office of the Courts',
    enactedNote:
      'The appropriation funds the trial and appellate courts, clerks, and the administrative functions of the judicial branch.',
    background:
      'Court delay compounds: a backlog that grows in one year takes several to clear. Delay also costs money elsewhere, because people held before trial occupy county jail beds that counties pay for, and it postpones resolution for victims as much as for defendants. Court funding is a state responsibility in North Carolina, while much of the cost of delay falls on counties.',
    percent: 5,
    affects: [
      'Anyone with a case before the courts, including crime victims',
      'Clerks and court staff',
      'Counties, which pay for pretrial detention',
    ],
    increaseBenefits: [
      'Backlogs delay resolution for victims as much as for defendants.',
      'Pretrial detention costs counties money that faster case processing would not require.',
    ],
    increaseTradeoffs: [
      'Recurring cost, and added capacity takes time to clear an existing backlog.',
      'Savings land largely on county budgets rather than on the General Fund.',
    ],
    reduceBenefits: [
      'Frees recurring money.',
      'Some court functions have moved online, which may reduce staffing needs.',
    ],
    reduceTradeoffs: [
      'Court delay compounds, and a backlog is far more expensive to clear than to prevent.',
      'Constitutional obligations do not scale down with the appropriation.',
    ],
  }),

  appropriationDecision({
    id: 'indigent-defense',
    category: 'justice-public-safety',
    title: 'Indigent Defense',
    question: 'Should the state change what it spends on representation for people who cannot afford counsel?',
    agencies: ['Indigent Defense Services'],
    baseLabel: 'Indigent Defense Services',
    enactedNote:
      'The appropriation funds public defenders and the private attorneys appointed to represent people who cannot afford counsel.',
    background:
      'People who cannot afford a lawyer are represented by public defenders or by private attorneys paid at a rate the state sets. When that rate falls behind, fewer attorneys accept appointments and cases wait. The obligation to provide counsel is constitutional and does not scale down with the appropriation, so underfunding shows up as delay rather than as fewer people represented.',
    percent: 10,
    affects: [
      'Defendants who cannot afford counsel',
      'Appointed private attorneys and public defenders',
      'County jails holding people awaiting trial',
    ],
    increaseBenefits: [
      'Appointment rates determine how many attorneys will take cases, which determines how long people wait.',
      'Faster resolution reduces pretrial detention, which counties pay for.',
    ],
    increaseTradeoffs: [
      'Recurring cost that rises with caseload the state does not control.',
      'Higher rates do not by themselves increase the number of attorneys in rural counties.',
    ],
    reduceBenefits: [
      'A comparatively small line, so the effect on the overall balance is limited.',
      'Frees recurring money.',
    ],
    reduceTradeoffs: [
      'The constitutional obligation to provide counsel is unchanged by the appropriation.',
      'Fewer attorneys accepting appointments means longer pretrial detention at county expense.',
    ],
  }),

  appropriationDecision({
    id: 'state-employee-pay',
    category: 'general-government',
    title: 'State Employee Compensation Reserve',
    question: 'Should the state change the reserve set aside for state employee pay?',
    agencies: ['General Fund Reserve - Pay Plan'],
    baseLabel: 'the General Fund Reserve for the pay plan',
    enactedNote:
      'The act carries this as a separate reserve line under Reserves and Lottery rather than inside any single agency’s budget.',
    background:
      'A compensation reserve applies across tens of thousands of positions in every agency, so a change of even one percentage point is a large recurring number. Salary changes also raise employer retirement contributions, a cost that follows the salary but is budgeted separately. An across-the-board increase reaches the whole workforce but does not target the specific classifications where vacancies are worst.',
    percent: 20,
    affects: [
      'State employees across every agency',
      'Agencies with high vacancy rates',
      'The state retirement system',
    ],
    increaseBenefits: [
      'Vacancy rates in several agencies mean work is going undone regardless of the appropriation.',
      'Reaches the whole workforce rather than being negotiated agency by agency.',
    ],
    increaseTradeoffs: [
      'Recurring cost that also increases retirement obligations.',
      'An across-the-board increase does not target the classifications where vacancies are worst.',
    ],
    reduceBenefits: [
      'Frees recurring money.',
      'Leaves room to target increases at the hardest-to-fill roles instead of spreading them.',
    ],
    reduceTradeoffs: [
      'Pay increases below inflation reduce real compensation and tend to raise turnover.',
      'Turnover carries its own costs in recruitment and lost experience.',
    ],
  }),

  appropriationDecision({
    id: 'elections',
    category: 'general-government',
    title: 'Elections Administration',
    question: 'Should the state change what it provides for elections administration?',
    agencies: ['Elections'],
    baseLabel: 'the State Board of Elections',
    enactedNote:
      'The state board oversees elections administered by 100 county boards, which bear much of the direct cost themselves.',
    background:
      'Elections in North Carolina are administered by 100 county boards under state oversight. State funding affects voting equipment, poll worker recruitment and training, and the systems that maintain voter registration records. Counties differ enormously in tax base, so state support is much of what evens out administration across the state. Equipment and systems have replacement cycles that arrive whether or not they are budgeted for.',
    percent: 10,
    affects: [
      'County boards of elections, especially in smaller counties',
      'Poll workers',
      'Voters',
    ],
    increaseBenefits: [
      'Counties differ widely in resources, so state support is what evens out administration.',
      'Equipment replacement cycles arrive whether or not they are budgeted for.',
    ],
    increaseTradeoffs: [
      'Recurring cost for a function whose workload concentrates in election years.',
      'Counties retain administrative authority, so state funding does not by itself standardise practice.',
    ],
    reduceBenefits: [
      'One of the smaller lines in general government.',
      'Counties administer elections and carry much of the cost already.',
    ],
    reduceTradeoffs: [
      'Reductions land hardest on counties with the least capacity to absorb them.',
      'Deferred equipment replacement arrives as an unbudgeted cost later.',
    ],
  }),

  appropriationDecision({
    id: 'information-technology-operations',
    category: 'information-technology',
    title: 'Department of Information Technology',
    question: 'Should the state change what it spends on statewide technology operations?',
    agencies: ['Department of Information Technology'],
    baseLabel: 'the Department of Information Technology',
    enactedNote:
      'The department runs the state network, statewide technology services, and cybersecurity and risk management functions.',
    background:
      'State agencies hold tax records, health data, and benefits information. Cybersecurity spending is insurance-like: the return is an incident that does not happen, which makes it hard to defend in a tight year and expensive to have skipped after a breach. Local governments and school districts have little independent capacity and increasingly turn to the state after ransomware incidents. Security staff are also among the hardest positions for government to fill at public pay scales.',
    percent: 10,
    affects: [
      'Residents whose data the state holds',
      'Every state agency that depends on the state network',
      'Local governments and school districts that rely on state assistance after an incident',
    ],
    increaseBenefits: [
      'A single significant breach can cost more than years of prevention, including notification and remediation.',
      'Local governments and districts turn to the state when incidents occur, whether or not the state has budgeted for it.',
    ],
    increaseTradeoffs: [
      'Recurring cost with a benefit that is real but hard to demonstrate year to year.',
      'Security staff are difficult to recruit at public pay scales, so funded posts may stay vacant.',
    ],
    reduceBenefits: [
      'A comparatively small appropriation, much of which is recovered from agencies through service charges.',
      'Frees recurring money.',
    ],
    reduceTradeoffs: [
      'Reduced security spending is invisible until it is not.',
      'The cost of an incident falls on residents whose data the state holds.',
    ],
  }),

  appropriationDecision({
    id: 'commerce',
    category: 'economic-development',
    title: 'Department of Commerce',
    question: 'Should the state change what it spends on economic development administration?',
    agencies: ['Department of Commerce'],
    baseLabel: 'the Department of Commerce',
    enactedNote:
      'The department runs business recruitment, workforce development, tourism and film programmes, and community development functions.',
    background:
      'North Carolina’s main recruitment incentives are performance-based: a company receives payments only after it creates and maintains jobs at agreed wage levels. That limits the risk of paying for jobs that never appear, but it also commits the state to payments in future years based on decisions made now. Incentive money is concentrated on relatively few employers compared with broader investments in workforce or infrastructure.',
    percent: 10,
    affects: [
      'Companies considering expansion in the state',
      'Counties competing for projects',
      'Workers in programmes the department administers',
    ],
    increaseBenefits: [
      'Site selection is competitive across states, and recruitment capacity operates at the moment a company decides.',
      'The department also runs workforce programmes that serve employers generally rather than one company.',
    ],
    increaseTradeoffs: [
      'Recruitment commitments bind future budgets, and it is hard to establish which projects would have come anyway.',
      'Money is concentrated on relatively few employers.',
    ],
    reduceBenefits: [
      'Reduces future-year obligations while leaving existing agreements untouched.',
      'Redirects money toward investments that reach more employers than a single agreement does.',
    ],
    reduceTradeoffs: [
      'Neighbouring states continue to recruit actively.',
      'Rural counties depend most on state-level recruitment capacity.',
    ],
  }),
]
