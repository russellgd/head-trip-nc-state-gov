/**
 * Justice and public safety, general government and the state workforce, and
 * information technology.
 */
import type { Decision } from '../types'
import { enactedOption, unsourcedOption } from './helpers'

const REPORT_WOULD_SETTLE =
  'The line-item amount sits in the Joint Conference Committee Report incorporated into S.L. 2026-41, read together with the two technical corrections acts.'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

export const GOVERNMENT_DECISIONS: Decision[] = [
  {
    id: 'correctional-staffing',
    category: 'justice-public-safety',
    title: 'Correctional Officer Staffing and Pay',
    question:
      'Should the state change what it spends on correctional officer salaries and vacancies?',
    enactedBaseline:
      'The enacted budget funds correctional officer positions and salaries at levels set in S.L. 2026-41.',
    background:
      'Prison vacancy rates drive mandatory overtime, and overtime costs money that is budgeted as salary for positions no one fills. A facility that cannot be staffed safely may be closed or consolidated, which changes where incarcerated people are held relative to their families and counsel.',
    choices: [
      enactedOption({
        description: 'Keep correctional staffing and salary funding as enacted.',
        affects: ['Correctional officers', 'Incarcerated people', 'Rural counties with facilities'],
      }),
      unsourcedOption({
        id: 'increase-correctional-pay',
        label: 'Raise correctional officer pay',
        description:
          'Increase salaries for correctional officers to reduce vacancies and mandatory overtime.',
        affects: ['Correctional officers', 'Incarcerated people', 'Facility operations'],
        benefits: [
          'Chronic vacancies are already paid for through overtime, so part of the increase substitutes for a cost the state is bearing anyway.',
          'Staffing levels affect safety for officers and incarcerated people alike.',
        ],
        tradeoffs: [
          'Recurring cost across a large workforce.',
          'Pay is one factor in these vacancies; working conditions and facility location also drive turnover.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'indigent-defense',
    category: 'justice-public-safety',
    title: 'Indigent Defense and Court Capacity',
    question:
      'Should the state change what it spends on indigent defense and court operations?',
    enactedBaseline:
      'The enacted budget funds Indigent Defense Services, district attorneys, and court operations at levels set in S.L. 2026-41.',
    background:
      'People who cannot afford counsel are represented by public defenders or by private attorneys paid at a state rate. When that rate falls behind, fewer attorneys accept appointments and cases wait. Delay costs money elsewhere: people held pretrial occupy county jail beds that counties pay for.',
    choices: [
      enactedOption({
        description: 'Keep indigent defense and court funding at the enacted level.',
        affects: ['Defendants who cannot afford counsel', 'County jails', 'Court staff'],
      }),
      unsourcedOption({
        id: 'expand-defense',
        label: 'Increase defense and court capacity',
        description:
          'Raise appointed-counsel rates and add court positions in the districts with the longest case backlogs.',
        affects: ['Defendants', 'Crime victims awaiting resolution', 'Counties paying for jail beds'],
        benefits: [
          'Backlogs delay resolution for victims as much as for defendants.',
          'Pretrial detention costs counties money that faster case processing would not require.',
        ],
        tradeoffs: [
          'Recurring cost, and added capacity takes time to translate into cleared backlogs.',
          'Savings land largely on county budgets rather than the state General Fund.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-court-funding',
        label: 'Reduce court system funding',
        description: 'Fund court operations below the enacted level.',
        affects: ['Court users', 'Clerks and court staff', 'Counties'],
        benefits: [
          'Frees recurring money.',
          'Some court functions have moved online, which may reduce staffing needs.',
        ],
        tradeoffs: [
          'Court delay compounds: a backlog that grows in one year takes several to clear.',
          'Constitutional obligations to provide counsel do not scale down with the appropriation.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'emergency-management',
    category: 'justice-public-safety',
    title: 'Emergency Management Readiness',
    question:
      'Should the state change what it spends on emergency management staffing and readiness?',
    enactedBaseline:
      'The enacted budget funds Emergency Management operations at levels set in S.L. 2026-41.',
    background:
      'Emergency Management coordinates the state response to hurricanes, flooding, and other disasters, and administers the state role in federal disaster programs. Readiness spending is preventive: its value shows up in how quickly the state can act during an event, which is difficult to measure in a year without one.',
    choices: [
      enactedOption({
        description: 'Keep emergency management funding at the enacted level.',
        affects: ['Coastal and western counties', 'Local emergency managers', 'Disaster survivors'],
      }),
      unsourcedOption({
        id: 'expand-emergency',
        label: 'Increase readiness funding',
        description:
          'Add staffing and equipment for disaster response and for administering federal recovery programs.',
        affects: ['Disaster-prone counties', 'Households awaiting recovery assistance'],
        benefits: [
          'Administrative capacity is a documented bottleneck in moving federal recovery money to households.',
          'Response capacity built before an event cannot be assembled during one.',
        ],
        tradeoffs: [
          'Recurring cost for capacity that may sit idle in a quiet year.',
          'Federal reimbursement covers part of disaster response, though generally after the fact.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'state-employee-compensation',
    category: 'general-government',
    title: 'State Employee Compensation',
    question:
      'Should the state change the across-the-board salary increase for state employees?',
    enactedBaseline:
      'The enacted budget provides a salary increase for state employees at the level set in S.L. 2026-41.',
    background:
      'An across-the-board increase applies to tens of thousands of positions across every agency, so a change of even one percentage point is a large recurring number. Salary changes also raise employer retirement contributions, a cost that follows the salary but is budgeted separately.',
    choices: [
      enactedOption({
        description: 'Keep the enacted state employee salary increase.',
        affects: ['State employees', 'Agency operations', 'The state retirement system'],
      }),
      unsourcedOption({
        id: 'larger-state-raise',
        label: 'Fund a larger increase',
        description: 'Raise the across-the-board increase above the enacted level.',
        affects: ['State employees', 'Agencies with high vacancy rates'],
        benefits: [
          'Vacancy rates in several agencies mean work is going undone regardless of the appropriation.',
          'Reaches the whole workforce rather than negotiating agency by agency.',
        ],
        tradeoffs: [
          'Large recurring cost that also increases retirement obligations.',
          'An across-the-board increase does not target the specific classifications where vacancies are worst.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'smaller-state-raise',
        label: 'Fund a smaller increase',
        description: 'Provide a lower across-the-board increase than the enacted budget does.',
        affects: ['State employees', 'Agency operations'],
        benefits: [
          'Frees recurring money at a scale few single decisions match.',
          'Leaves room to target increases at the hardest-to-fill classifications instead.',
        ],
        tradeoffs: [
          'Pay increases below inflation reduce real compensation and tend to raise turnover.',
          'Turnover carries its own costs in recruitment and lost experience.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'elections-administration',
    category: 'general-government',
    title: 'Elections Administration',
    question:
      'Should the state change what it provides for elections administration and county support?',
    enactedBaseline:
      'The enacted budget funds the State Board of Elections and its support to counties at levels set in S.L. 2026-41.',
    background:
      'Elections are administered by 100 county boards under state oversight, with counties bearing much of the direct cost. State funding affects voting equipment, poll worker recruitment and training, and the systems that maintain voter registration records.',
    choices: [
      enactedOption({
        description: 'Keep elections administration funding at the enacted level.',
        affects: ['County boards of elections', 'Poll workers', 'Voters'],
      }),
      unsourcedOption({
        id: 'expand-elections',
        label: 'Increase elections support',
        description:
          'Add funding for county elections support, equipment maintenance, and poll worker training.',
        affects: ['County boards', 'Poll workers', 'Voters in under-resourced counties'],
        benefits: [
          'Counties differ enormously in tax base, so state support is what evens out administration across the state.',
          'Equipment and systems have replacement cycles that arrive whether or not they are budgeted for.',
        ],
        tradeoffs: [
          'Recurring cost for a function whose workload is concentrated in election years.',
          'Counties retain administrative authority, so state funding does not by itself standardize practice.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'cybersecurity',
    category: 'information-technology',
    title: 'Cybersecurity and Risk Management',
    question:
      'Should the state change what it spends on cybersecurity for state systems?',
    enactedBaseline:
      'The enacted budget funds statewide cybersecurity and risk management functions at levels set in S.L. 2026-41.',
    background:
      'State agencies hold tax records, health data, and benefits information. Cybersecurity spending is insurance-like: the return is an incident that does not happen, which makes it hard to defend in a tight year and expensive to have skipped after a breach. Local governments and school districts increasingly rely on state assistance after ransomware incidents.',
    choices: [
      enactedOption({
        description: 'Keep cybersecurity funding at the enacted level.',
        affects: ['Residents whose data the state holds', 'State agencies', 'Local governments'],
      }),
      unsourcedOption({
        id: 'expand-cyber',
        label: 'Increase cybersecurity investment',
        description:
          'Add funding for security staffing, monitoring, and assistance to local governments and school districts.',
        affects: ['State agencies', 'Local governments', 'School districts'],
        benefits: [
          'A single significant breach can cost more than years of prevention, including notification and remediation.',
          'Local governments and districts have little independent capacity and turn to the state when incidents occur.',
        ],
        tradeoffs: [
          'Recurring cost with a benefit that is real but difficult to demonstrate year to year.',
          'Security staff are among the hardest positions for government to fill at public pay scales.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'legacy-systems',
    category: 'information-technology',
    title: 'Replacing Aging State Systems',
    question:
      'Should the state change what it spends on replacing aging agency computer systems?',
    enactedBaseline:
      'The enacted budget funds technology modernization projects at levels set in S.L. 2026-41.',
    background:
      'Several agencies run core functions on systems written decades ago, which are expensive to maintain, difficult to staff, and hard to change when the law changes. Replacement projects are large, nonrecurring, and have a well-documented failure rate across state governments generally.',
    choices: [
      enactedOption({
        description: 'Keep technology modernization funding at the enacted level.',
        affects: ['Agencies running legacy systems', 'Residents using state services'],
      }),
      unsourcedOption({
        id: 'accelerate-modernization',
        label: 'Accelerate system replacement',
        description:
          'Add one-time funding to replace the oldest systems supporting benefits, licensing, and tax administration.',
        affects: ['Residents applying for benefits or licenses', 'Agency staff', 'State IT contractors'],
        benefits: [
          'Maintenance costs on old systems rise as the people who can maintain them retire.',
          'Modern systems can implement policy changes that old ones physically cannot.',
        ],
        tradeoffs: [
          'Large replacement projects overrun their budgets and timelines often enough that the risk is a real budget consideration.',
          'Nonrecurring funding for a multi-year project creates uncertainty about later phases.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'defer-modernization',
        label: 'Defer replacement projects',
        description: 'Fund modernization below the enacted level and continue maintaining current systems.',
        affects: ['Agency staff', 'Residents using state services'],
        benefits: [
          'Avoids committing one-time money to projects with a substantial failure rate.',
          'Existing systems continue to function.',
        ],
        tradeoffs: [
          'Deferral raises the eventual cost and narrows the pool of people able to maintain the systems.',
          'Outages in aging systems interrupt benefits and licensing for residents.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
]
