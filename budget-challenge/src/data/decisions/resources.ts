/**
 * Agriculture, natural resources, and environmental quality; economic and
 * community development.
 */
import type { Decision } from '../types'
import { enactedOption, unsourcedOption } from './helpers'

const REPORT_WOULD_SETTLE =
  'The line-item amount sits in the Joint Conference Committee Report incorporated into S.L. 2026-41, read together with the two technical corrections acts.'

const GOVERNOR_WOULD_SETTLE =
  "The Governor's Recommended Budget for FY 2026-27 carries a costed version of this option, which is what would make it scoreable here."

export const RESOURCES_DECISIONS: Decision[] = [
  {
    id: 'water-quality-programs',
    category: 'agriculture-environment',
    title: 'Water Quality and Contaminant Response',
    question:
      'Should the state change what it spends on water quality monitoring and contaminant response?',
    enactedBaseline:
      'The enacted budget funds water quality programs in the Department of Environmental Quality at levels set in S.L. 2026-41.',
    background:
      'The state monitors drinking water and surface water, permits discharges, and responds to contaminants including PFAS compounds. Much of the cost of remediation falls on local water systems and their ratepayers, so state decisions here shift who pays as much as whether the work happens.',
    choices: [
      enactedOption({
        description: 'Keep water quality program funding at the enacted level.',
        affects: ['Public water systems', 'Ratepayers', 'Downstream communities'],
      }),
      unsourcedOption({
        id: 'expand-water',
        label: 'Expand monitoring and treatment assistance',
        description:
          'Increase funding for contaminant monitoring and for assistance to local water systems installing treatment.',
        affects: ['Small water systems', 'Ratepayers in affected communities', 'State laboratories'],
        benefits: [
          'Small systems have the least ability to spread treatment costs across a customer base, so state assistance is what determines whether they can comply.',
          'Monitoring data is what makes it possible to target remediation rather than guess.',
        ],
        tradeoffs: [
          'Treatment costs recur through operations and maintenance long after the capital grant is spent.',
          'Federal requirements and litigation may shift who bears these costs, which could change the state’s role.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-water',
        label: 'Reduce water quality funding',
        description:
          'Fund monitoring and assistance below the enacted level and rely more on federal programs and local utilities.',
        affects: ['Local water systems', 'Ratepayers'],
        benefits: [
          'Federal infrastructure programs currently fund some of this work.',
          'Utilities recover costs through rates, which ties the cost to the users of the system.',
        ],
        tradeoffs: [
          'Rate-funded compliance falls hardest on small systems with few customers.',
          'Reduced monitoring lowers the cost of the program without lowering the underlying contamination.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'land-water-conservation',
    category: 'agriculture-environment',
    title: 'Land and Water Conservation Funds',
    question:
      'Should the state change what it deposits into its land, water, and farmland conservation funds?',
    enactedBaseline:
      'The enacted budget appropriates to the state conservation and farmland preservation trust funds at levels set in S.L. 2026-41.',
    background:
      'North Carolina funds conservation through several trust funds that buy land, secure easements, and protect farmland from development. These appropriations are typically nonrecurring, which makes them a common place to look for one-time money and also means the programs cannot count on a stable base.',
    choices: [
      enactedOption({
        description: 'Keep conservation trust fund appropriations at the enacted level.',
        affects: ['Farmers seeking easements', 'State parks', 'Rural landowners'],
      }),
      unsourcedOption({
        id: 'increase-conservation',
        label: 'Increase conservation funding',
        description:
          'Add one-time funding to the conservation and farmland preservation trust funds.',
        affects: ['Landowners', 'Local governments', 'Downstream water systems'],
        benefits: [
          'Land prices rise with development pressure, so the same dollar buys less protection each year it waits.',
          'Protected land upstream reduces treatment costs for water systems downstream.',
        ],
        tradeoffs: [
          'Acquiring land creates a recurring maintenance obligation that the one-time appropriation does not cover.',
          'Nonrecurring funding makes it hard for programs to commit to multi-year projects.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-conservation',
        label: 'Reduce conservation funding',
        description: 'Appropriate less to the conservation trust funds than the enacted budget does.',
        affects: ['Conservation organizations', 'Landowners awaiting easement offers'],
        benefits: [
          'These are nonrecurring appropriations, so reducing them does not disturb ongoing operations.',
          'Frees one-time money without cutting any staffed program.',
        ],
        tradeoffs: [
          'Conservation opportunities are time-limited; land sold for development is not recoverable later.',
          'State funds often leverage federal and private matching dollars that are lost along with them.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'business-incentives',
    category: 'economic-development',
    title: 'Business Recruitment Incentives',
    question:
      'Should the state change what it commits to performance-based business recruitment incentives?',
    enactedBaseline:
      'The enacted budget funds the state’s job development and recruitment incentive programs at levels set in S.L. 2026-41.',
    background:
      'North Carolina’s main recruitment incentives are performance-based: a company receives payments only after it creates and maintains jobs at agreed wage levels. That structure limits the risk of paying for jobs that never appear, but it also means the state commits to payments in future years based on decisions made now.',
    choices: [
      enactedOption({
        description: 'Keep incentive program funding at the enacted level.',
        affects: ['Companies considering expansion', 'Counties competing for projects', 'Workers'],
      }),
      unsourcedOption({
        id: 'expand-incentives',
        label: 'Expand incentive capacity',
        description:
          'Increase the funds available for performance-based recruitment agreements, weighted toward rural counties.',
        affects: ['Rural counties', 'Companies weighing multi-state offers', 'Local tax bases'],
        benefits: [
          'Site selection is genuinely competitive across states, and incentives are one of the few tools that operate at the moment of decision.',
          'Rural weighting directs projects toward counties that recruit least successfully on their own.',
        ],
        tradeoffs: [
          'Commits future budgets to payments, and it is difficult to establish which projects would have come anyway.',
          'Incentive money is concentrated on relatively few employers compared with broader investments in workforce or infrastructure.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
      unsourcedOption({
        id: 'reduce-incentives',
        label: 'Reduce incentive funding',
        description:
          'Lower the funds available for new incentive agreements while honoring existing commitments.',
        affects: ['Economic development agencies', 'Counties recruiting projects'],
        benefits: [
          'Reduces future-year obligations, and existing agreements are unaffected.',
          'Redirects money toward investments that reach more employers than a single agreement does.',
        ],
        tradeoffs: [
          'Neighboring states continue to offer incentives, so reducing capacity affects competitiveness for specific projects.',
          'Rural counties depend most on state-level recruitment.',
        ],
        wouldBeSourcedBy: REPORT_WOULD_SETTLE,
      }),
    ],
  },
  {
    id: 'rural-infrastructure-grants',
    category: 'economic-development',
    title: 'Rural Water, Sewer, and Site Development',
    question:
      'Should the state change what it grants for rural water, sewer, and industrial site readiness?',
    enactedBaseline:
      'The enacted budget funds rural infrastructure and site development grant programs at levels set in S.L. 2026-41.',
    background:
      'Many rural counties lose projects not on incentives but on readiness: a site without water, sewer, or grading cannot be offered on a company’s timeline. These grants are typically nonrecurring and are awarded competitively to local governments.',
    choices: [
      enactedOption({
        description: 'Keep rural infrastructure and site grants at the enacted level.',
        affects: ['Rural local governments', 'Regional economic developers'],
      }),
      unsourcedOption({
        id: 'expand-rural',
        label: 'Expand rural infrastructure grants',
        description:
          'Add one-time funding for water and sewer extensions and industrial site preparation in rural counties.',
        affects: ['Rural counties', 'Local water and sewer authorities', 'Residents on failing systems'],
        benefits: [
          'Infrastructure serves any employer that arrives, not one negotiated company.',
          'The same water and sewer work often fixes failing residential systems.',
        ],
        tradeoffs: [
          'Prepared sites do not guarantee a tenant, and some remain empty.',
          'Extended systems create recurring operating costs for local governments.',
        ],
        wouldBeSourcedBy: GOVERNOR_WOULD_SETTLE,
      }),
    ],
  },
]
