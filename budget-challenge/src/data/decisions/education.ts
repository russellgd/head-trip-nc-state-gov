/**
 * K-12 public education, community colleges, and the UNC System.
 *
 * Education is the largest share of North Carolina's General Fund, which is why
 * these decisions come first in the challenge: they are where the arithmetic
 * bites hardest.
 */
import type { Decision } from '../types'
import { enactedOption, unsourcedOption } from './helpers'

const REPORT_WOULD_SETTLE =
  'The line-item amount sits in the Joint Conference Committee Report incorporated into S.L. 2026-41, read together with the two technical corrections acts.'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

export const EDUCATION_DECISIONS: Decision[] = [
  {
    id: 'teacher-compensation',
    category: 'k12-education',
    title: 'Teacher Compensation',
    question:
      'Should the state spend more, less, or the same on teacher salaries as the enacted budget does?',
    enactedBaseline:
      'S.L. 2026-41 sets the statewide teacher salary schedule for FY 2026-27 and any across-the-board increase, with the detail carried in the incorporated committee report.',
    background:
      'North Carolina sets a statewide salary schedule for teachers, so a change here reaches every one of the 115 school districts at once. Because salaries are recurring, an increase commits the state to the same cost in every future year unless a later budget reverses it. Districts may supplement state pay locally, which means the same state schedule produces different take-home pay in different counties.',
    choices: [
      enactedOption({
        description:
          'Leave the teacher salary schedule and any raise funded in the enacted budget as they are.',
        affects: ['Public school teachers', 'Local school districts', 'The state retirement system'],
      }),
      unsourcedOption({
        id: 'larger-raise',
        label: 'Fund a larger salary increase',
        description:
          'Raise the statewide teacher salary schedule above the level funded in the enacted budget.',
        affects: [
          'Public school teachers',
          'Districts competing with neighboring states for staff',
          'Future budgets, because salary increases recur',
        ],
        benefits: [
          'Higher pay is one of the few levers the state controls directly in a labor market where districts compete with other states and with private employers.',
          'Because the schedule is statewide, an increase reaches rural districts that cannot afford large local supplements.',
        ],
        tradeoffs: [
          'Salary increases are recurring, so the cost repeats every year and grows as more staff move up the schedule.',
          'Higher salaries also raise the state’s retirement and benefit obligations, which are not always visible in the headline cost of a raise.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'hold-flat',
        label: 'Hold salaries flat',
        description:
          'Fund the existing salary schedule without the increase provided in the enacted budget.',
        affects: ['Public school teachers', 'Local school districts'],
        benefits: [
          'Frees recurring money for other uses without touching the number of funded positions.',
          'Avoids adding to the recurring obligations that future budgets have to carry.',
        ],
        tradeoffs: [
          'Flat pay in a year of rising prices is a real pay cut, which tends to show up later as turnover and vacancies.',
          'Districts that cannot supplement locally would feel this first.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'instructional-support-staff',
    category: 'k12-education',
    title: 'Counselors, Nurses, and Instructional Support',
    question:
      'Should the state change how many school counselors, nurses, psychologists, and social workers it funds?',
    enactedBaseline:
      'The enacted budget funds instructional support positions through allotments to districts, at levels set in S.L. 2026-41 and its committee report.',
    background:
      'North Carolina funds most school staff through allotments: formulas that send positions or dollars to districts based on enrollment and other factors. Support staff are funded through a narrower allotment than teachers, so districts often report ratios well above what professional associations recommend.',
    choices: [
      enactedOption({
        description: 'Keep the instructional support allotment at the enacted level.',
        affects: ['Students needing health or counseling services', 'School districts'],
      }),
      unsourcedOption({
        id: 'expand-support',
        label: 'Expand support staffing',
        description:
          'Increase the allotment so districts can hire additional counselors, nurses, psychologists, and social workers.',
        affects: ['Students', 'School health and counseling staff', 'Local health departments'],
        benefits: [
          'Support staff handle needs that otherwise land on classroom teachers, which affects instructional time as well as student health.',
          'Rural districts with the highest ratios would gain the most, since they have the least local capacity to hire.',
        ],
        tradeoffs: [
          'These are recurring positions, so the commitment continues after the budget year.',
          'Districts report difficulty hiring licensed staff even when positions are funded, so money alone may not close the gap.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-support',
        label: 'Reduce the support allotment',
        description:
          'Fund fewer support positions and give districts flexibility to use the money for other purposes.',
        affects: ['Students needing services', 'District administrators'],
        benefits: [
          'Districts differ, and flexibility lets each one spend where its own need is greatest.',
          'Reduces recurring obligations.',
        ],
        tradeoffs: [
          'Flexibility in a tight year usually means the money goes to whatever is most urgent, which is rarely prevention.',
          'Districts with the fewest local resources have the least ability to backfill a reduced allotment.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'school-transportation',
    category: 'k12-education',
    title: 'School Transportation',
    question: 'Should the state change what it spends on getting students to school?',
    enactedBaseline:
      'The enacted budget funds the school bus transportation allotment and school bus replacement at levels set in S.L. 2026-41.',
    background:
      'Transportation is funded through a formula that accounts for the number of students bused and the efficiency of each district’s routes. It is one of the few K-12 costs that rises with fuel prices and geography rather than enrollment alone, which makes rural districts structurally more expensive to serve.',
    choices: [
      enactedOption({
        description: 'Keep transportation funding and the bus replacement schedule as enacted.',
        affects: ['Students who ride buses', 'Rural districts', 'School bus drivers'],
      }),
      unsourcedOption({
        id: 'increase-transportation',
        label: 'Increase transportation funding',
        description:
          'Add funding for driver compensation and accelerate replacement of the oldest buses in the state fleet.',
        affects: ['Rural districts with long routes', 'Bus drivers', 'Students with long commutes'],
        benefits: [
          'Driver shortages cancel routes, and canceled routes translate directly into missed instructional days.',
          'Replacing older buses lowers maintenance costs over time.',
        ],
        tradeoffs: [
          'Bus purchases are one-time costs while driver pay is recurring, and the two are often bundled in a way that obscures the ongoing commitment.',
          'Money does not resolve a shortage if the constraint is licensing and working hours rather than wages.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'community-college-workforce',
    category: 'community-colleges',
    title: 'Workforce and Short-Term Training',
    question:
      'Should the state change what it invests in short-term workforce training at community colleges?',
    enactedBaseline:
      'The enacted budget funds community college workforce continuing education and short-term training programs at levels set in S.L. 2026-41.',
    background:
      'Community colleges are funded largely on enrollment, and short-term workforce courses historically generated less funding per student hour than curriculum courses. Recent budgets have moved toward weighting funding by the earnings associated with a field of study, which changes what colleges have an incentive to offer.',
    choices: [
      enactedOption({
        description: 'Keep workforce training funding at the enacted level and formula.',
        affects: ['Community college students', 'Employers hiring skilled workers', 'The 58 colleges'],
      }),
      unsourcedOption({
        id: 'expand-workforce',
        label: 'Expand short-term workforce funding',
        description:
          'Increase funding for short-term credential programs in fields with documented local labor demand.',
        affects: ['Adult learners', 'Regional employers', 'Colleges in areas losing manufacturing jobs'],
        benefits: [
          'Short-term credentials reach adults who cannot commit to a two-year program, which is a different population than traditional enrollment serves.',
          'Colleges can respond to a specific employer’s hiring need faster than a degree program can be built.',
        ],
        tradeoffs: [
          'Training funded against today’s labor demand can leave graduates holding a credential for work that has moved on.',
          'Recurring formula money is harder to redirect later than a time-limited grant.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'community-college-faculty-pay',
    category: 'community-colleges',
    title: 'Community College Faculty Pay',
    question: 'Should the state change what it spends on community college faculty salaries?',
    enactedBaseline:
      'The enacted budget sets community college faculty and staff compensation in S.L. 2026-41.',
    background:
      'Community college faculty salaries have historically trailed both K-12 teacher pay at comparable experience and pay in the industries colleges train students to enter, which is a particular problem in fields like nursing and skilled trades where instructors can earn more practicing than teaching.',
    choices: [
      enactedOption({
        description: 'Keep community college compensation as enacted.',
        affects: ['Community college faculty and staff', 'The 58 colleges'],
      }),
      unsourcedOption({
        id: 'raise-cc-pay',
        label: 'Fund a larger faculty increase',
        description:
          'Raise community college faculty and staff salaries above the enacted level.',
        affects: ['Faculty and staff', 'Students in programs with instructor vacancies'],
        benefits: [
          'Programs cannot run without instructors, so vacancies in high-demand fields cap enrollment regardless of student interest.',
          'Addresses a gap the colleges have documented against both K-12 pay and industry pay.',
        ],
        tradeoffs: [
          'Recurring cost that compounds across future budgets.',
          'Even a substantial increase may not match private-sector pay in the fields with the worst shortages.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'unc-need-based-aid',
    category: 'unc-system',
    title: 'Need-Based Financial Aid',
    question:
      'Should the state change what it provides in need-based financial aid for university students?',
    enactedBaseline:
      'The enacted budget funds state need-based grant programs for UNC System students at levels set in S.L. 2026-41.',
    background:
      'North Carolina’s constitution directs that higher education be provided free of expense "as far as practicable," and the state has long combined relatively low tuition with need-based aid. Aid interacts with tuition policy: holding tuition flat and expanding aid reach the same students through different mechanisms with different costs.',
    choices: [
      enactedOption({
        description: 'Keep need-based aid funding at the enacted level.',
        affects: ['Lower-income students', 'UNC System campuses'],
      }),
      unsourcedOption({
        id: 'expand-aid',
        label: 'Expand need-based aid',
        description:
          'Increase state need-based grants so more students have their remaining costs covered.',
        affects: ['Lower- and middle-income students', 'Students who borrow to cover living costs'],
        benefits: [
          'Aid targets students by financial need rather than lowering the price for everyone, including those who can pay.',
          'Reduces borrowing, which affects graduates for years after they leave.',
        ],
        tradeoffs: [
          'Aid does not address the cost of attendance beyond tuition, which is where much of the shortfall sits.',
          'A recurring commitment that grows with enrollment and with tuition.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-aid',
        label: 'Reduce need-based aid',
        description:
          'Fund need-based grants below the enacted level and rely more on federal aid and institutional resources.',
        affects: ['Lower-income students', 'Campus financial aid offices'],
        benefits: [
          'Frees recurring money at a time when federal aid programs also serve these students.',
          'Campuses hold their own financial aid resources and can prioritize among their students.',
        ],
        tradeoffs: [
          'Campus resources vary widely, so a state reduction would land unevenly across the system.',
          'Cost is a documented reason students leave without finishing, and unfinished degrees carry debt without the earnings.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'unc-campus-operations',
    category: 'unc-system',
    title: 'University Operating Support',
    question: 'Should the state change its operating support for UNC System campuses?',
    enactedBaseline:
      'The enacted budget provides General Fund operating support to the constituent institutions at levels set in S.L. 2026-41.',
    background:
      'State operating support and tuition are the two main revenue sources for UNC campuses. When state support falls, campuses generally respond with some combination of tuition increases, larger classes, and fewer course sections, so a reduction here rarely stays contained to administration.',
    choices: [
      enactedOption({
        description: 'Keep university operating support at the enacted level.',
        affects: ['UNC System students', 'Campus faculty and staff', 'University towns'],
      }),
      unsourcedOption({
        id: 'increase-operations',
        label: 'Increase operating support',
        description:
          'Add recurring operating funds, targeted toward campuses with enrollment growth or the highest student-to-faculty ratios.',
        affects: ['Students at growing campuses', 'Faculty', 'Regional economies'],
        benefits: [
          'Enrollment growth without funding growth shows up as larger classes and fewer sections, which lengthens time to degree.',
          'Directing funds by ratio sends money where the strain is measurable.',
        ],
        tradeoffs: [
          'Recurring cost, and enrollment can fall as well as rise.',
          'Campuses set their own internal priorities, so added funds may not reach classrooms directly.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-operations',
        label: 'Reduce operating support',
        description:
          'Lower recurring operating support and ask campuses to absorb the reduction through efficiencies.',
        affects: ['Students', 'Faculty and staff', 'Prospective applicants weighing cost'],
        benefits: [
          'Frees recurring money at a scale few other single decisions can.',
          'Campuses hold reserves and other revenue that can cushion a reduction.',
        ],
        tradeoffs: [
          'Efficiency reductions tend to become tuition increases or fewer course sections.',
          'Smaller campuses have thinner reserves and less ability to raise revenue elsewhere.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
]
