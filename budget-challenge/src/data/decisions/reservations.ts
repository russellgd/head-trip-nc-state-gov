/**
 * Decisions built on the other reservations of revenue in Section 2.2(a).
 *
 * Each of these sets money aside for a named purpose before appropriation. The
 * act states every amount exactly, which is what makes them scoreable: keeping,
 * halving, or dropping a reservation moves a figure the document itself prints.
 */
import type { Decision } from '../types'
import { RESERVATION_DECISION_FACTORY as reservationDecision } from './reserves'

export const RESERVATION_DECISIONS: Decision[] = [
  reservationDecision({
    reservationId: 'medicaid-contingency',
    category: 'health-human-services',
    title: 'Medicaid Contingency Reserve',
    question: 'Should the state hold a contingency reserve against Medicaid cost growth?',
    whatItFunds:
      'It is held against Medicaid costs coming in above the budgeted amount, and Section 2.2(i) governs how it may be used.',
    background:
      'Medicaid is an entitlement: people who qualify are enrolled, so cost is driven by caseload and medical prices rather than by a spending cap. When costs exceed the budget, the shortfall has to be met from somewhere. A contingency reserve is the state deciding in advance where from. Without one, a shortfall arrives as a mid-year problem competing against everything else. Every state dollar in Medicaid also draws federal matching dollars, so a state shortfall removes more total health spending than it saves.',
    affects: [
      'Medicaid enrollees, if a shortfall forces a mid-year response',
      'Hospitals and providers awaiting payment',
      'Whatever else the money would have funded',
    ],
    keepBenefits: [
      'Decides in advance how a Medicaid overrun will be met, rather than leaving it to compete mid-year.',
    ],
    reduceBenefits: [
      'Frees money now while keeping a partial cushion against caseload growth.',
      'Medicaid projections have come in high in some past years.',
    ],
    reduceTradeoffs: [
      'A smaller cushion covers a smaller overrun, and the obligation does not shrink with the reserve.',
      'A shortfall beyond the reserve still has to be met from elsewhere.',
    ],
    eliminateBenefits: [
      'Frees the full amount for identified needs rather than holding it against a projection.',
      'Keeps pressure on the programme to manage utilisation and cost.',
    ],
    eliminateTradeoffs: [
      'A Medicaid overrun would arrive with no dedicated source to meet it.',
      'Because federal dollars match state dollars, a funding gap removes several times its value in total health care spending.',
    ],
  }),

  reservationDecision({
    reservationId: 'serdrf',
    category: 'disaster-infrastructure',
    title: 'Emergency Response and Disaster Relief',
    question:
      'Should the state pre-fund the State Emergency Response and Disaster Relief Fund at the enacted level?',
    whatItFunds:
      'The fund is the state’s standing source for disaster response and the state share of federal disaster assistance, governed by Section 2.2(j).',
    background:
      'Federal disaster aid generally requires a non-federal share, and it arrives on a schedule the state does not control. Money already in this fund can be moved quickly when a storm hits; money not in it has to be appropriated first, which takes a session. North Carolina has had recovery programmes running for years after major storms, so this is not a hypothetical need, though the timing of it is unpredictable.',
    affects: [
      'Communities hit by a storm during the fiscal year',
      'Local governments carrying recovery costs before reimbursement',
      'The state’s ability to draw down federal disaster aid, which requires a state share',
    ],
    keepBenefits: [
      'Money already in the fund can move immediately; money not in it waits for a legislative session.',
    ],
    reduceBenefits: [
      'Frees money for needs that are certain now rather than holding it against a disaster that may not come this year.',
      'The General Assembly can appropriate more after an event, as it has done before.',
    ],
    reduceTradeoffs: [
      'A smaller fund covers less of the immediate response, and the state share of federal aid still has to be found.',
      'Responding late is more expensive than responding early.',
    ],
    eliminateBenefits: [
      'Frees the full amount for identified, current needs.',
      'Avoids holding a large sum idle in a year with no major storm.',
    ],
    eliminateTradeoffs: [
      'Leaves nothing pre-positioned for a disaster, in a state that has needed it repeatedly.',
      'A missing state share can delay or forfeit federal reimbursement.',
    ],
  }),

  reservationDecision({
    reservationId: 'scif',
    category: 'disaster-infrastructure',
    title: 'State Capital and Infrastructure Fund',
    question:
      'Should the statutory reservation to the State Capital and Infrastructure Fund continue at the enacted level?',
    whatItFunds:
      'The fund pays for state building construction, repair and renovation, and capital projects, and the reservation to it is required by statute.',
    background:
      'The State Capital and Infrastructure Fund is how North Carolina pays for capital work largely without borrowing, by reserving a share of General Fund revenue each year. Because the reservation is statutory, reducing it would require amending the law, not just writing a different budget. Deferred capital work does not disappear: it becomes more expensive, and roof and mechanical failures arrive unscheduled.',
    affects: [
      'State agencies and university campuses with capital needs',
      'The construction trades',
      'Future budgets, which inherit whatever maintenance is deferred',
    ],
    keepBenefits: [
      'Funds capital work on a predictable schedule and largely without debt service.',
    ],
    reduceBenefits: [
      'Frees a large sum for operating needs in the current year.',
      'Capital projects can be re-sequenced more easily than staffed programmes can be cut.',
    ],
    reduceTradeoffs: [
      'Deferred maintenance compounds: today’s repair becomes tomorrow’s replacement.',
      'Would require a change in statute as well as a budget decision.',
    ],
    eliminateBenefits: [
      'Frees the entire statutory reservation for appropriation elsewhere.',
      'Capital work could instead be financed by borrowing, spreading the cost over the life of the asset.',
    ],
    eliminateTradeoffs: [
      'Ends the pay-as-you-go approach the fund exists to provide, and borrowing carries interest.',
      'Requires amending the statute that directs the reservation.',
    ],
  }),

  reservationDecision({
    reservationId: 'it-reserve',
    category: 'information-technology',
    title: 'Information Technology Reserve',
    question: 'Should the state fund the Information Technology Reserve at the enacted level?',
    whatItFunds:
      'The reserve funds statewide technology projects authorised in the act, and Section 2.2(d) governs how the money is released.',
    background:
      'Several state agencies run core functions on systems written decades ago: expensive to maintain, hard to staff, and difficult to change when the law changes. Replacement projects are large, one-time, and have a well-documented failure rate across state governments. Holding the money in a reserve rather than appropriating it directly to agencies lets the state release it against project milestones.',
    affects: [
      'Residents applying for benefits, licences, or filing taxes',
      'Agency staff working with old systems',
      'State technology contractors',
    ],
    keepBenefits: [
      'Releasing money against milestones gives some control over projects that often overrun.',
    ],
    reduceBenefits: [
      'Frees money now while allowing the highest-priority projects to continue.',
      'Large technology projects frequently spend more slowly than planned.',
    ],
    reduceTradeoffs: [
      'Part-funding a replacement can leave a project stranded between the old system and the new one.',
      'Maintenance costs on old systems keep rising in the meantime.',
    ],
    eliminateBenefits: [
      'Frees the full amount and avoids committing to projects with a substantial failure rate.',
      'Existing systems continue to operate.',
    ],
    eliminateTradeoffs: [
      'Deferral raises the eventual cost and shrinks the pool of people able to maintain the old systems.',
      'Outages in ageing systems interrupt benefits and licensing for residents.',
    ],
  }),

  reservationDecision({
    reservationId: 'econ-dev-project',
    category: 'economic-development',
    title: 'Economic Development Project Reserve',
    question: 'Should the state hold a reserve for economic development project commitments?',
    whatItFunds:
      'It backs commitments made to recruit specific projects to the state, under Section 2.2(g).',
    background:
      'Site selection is genuinely competitive between states, and decisions are made on timelines that do not wait for a legislative session. A reserve lets the state make a credible commitment when a company is deciding. The criticism is that money is concentrated on relatively few employers, and that it is hard to establish which projects would have come anyway.',
    affects: [
      'Companies weighing multi-state offers',
      'Counties competing for projects',
      'Workers hired if a project lands',
    ],
    keepBenefits: [
      'Lets the state respond on a company’s timeline rather than the legislature’s.',
    ],
    reduceBenefits: [
      'Frees money for investments that reach more employers than a single agreement does.',
      'Retains some capacity to respond to a project during the year.',
    ],
    reduceTradeoffs: [
      'A smaller reserve constrains what the state can offer for a large project.',
      'Neighbouring states continue to compete for the same projects.',
    ],
    eliminateBenefits: [
      'Frees the full amount, and existing commitments are unaffected by a decision about new ones.',
      'Directs money to workforce or infrastructure, which serve any employer rather than one.',
    ],
    eliminateTradeoffs: [
      'Removes the state’s ability to commit during the year without a new appropriation.',
      'Rural counties depend most on state-level recruitment.',
    ],
  }),

  reservationDecision({
    reservationId: 'regional-econ-dev',
    category: 'economic-development',
    title: 'Regional Economic Development Reserve',
    question: 'Should the state fund the Regional Economic Development Reserve at the enacted level?',
    whatItFunds:
      'It supports development activity organised regionally rather than around a single recruited project, under Section 2.2(h).',
    background:
      'Many rural counties lose projects not on incentives but on readiness: a site without water, sewer, or grading cannot be offered on a company’s timeline. Regional funding is aimed at that kind of groundwork, which serves whatever employer eventually arrives rather than one negotiated company. Prepared sites do not guarantee a tenant, and some stay empty.',
    affects: [
      'Rural and regional economic development organisations',
      'Local governments preparing sites',
      'Residents in counties that recruit least successfully on their own',
    ],
    keepBenefits: [
      'Infrastructure and site readiness serve any employer that arrives, not one negotiated company.',
    ],
    reduceBenefits: [
      'Frees money while leaving some regional capacity in place.',
      'Not every prepared site finds a tenant.',
    ],
    reduceTradeoffs: [
      'Regions with the least local capacity feel a reduction first.',
      'Groundwork deferred is opportunity lost when a project is deciding.',
    ],
    eliminateBenefits: [
      'Frees the full amount for needs that are certain rather than speculative.',
      'Local governments and regional partnerships retain their own resources.',
    ],
    eliminateTradeoffs: [
      'Removes state support for the counties least able to fund site work themselves.',
      'Extended water and sewer systems often fix failing residential systems at the same time.',
    ],
  }),

  reservationDecision({
    reservationId: 'housing',
    category: 'economic-development',
    title: 'Housing Reserve',
    question: 'Should the state fund the Housing Reserve at the enacted level?',
    whatItFunds:
      'Section 2.2(k) reserves the money for housing purposes, with a transfer to the Housing Finance Agency directed elsewhere in the act.',
    background:
      'The state’s role in housing is small relative to the market and to federal programmes, and works largely by supporting financing rather than by building. Its effect is concentrated where private financing does not reach: lower-income households, older housing stock, and rural counties.',
    affects: [
      'Lower-income renters and owners',
      'The Housing Finance Agency and its lending partners',
      'Rural counties where private financing is thin',
    ],
    keepBenefits: [
      'State money supports financing that private lending does not reach on its own.',
    ],
    reduceBenefits: [
      'Frees money for other purposes while keeping the programme running at a reduced level.',
      'Federal housing programmes continue regardless.',
    ],
    reduceTradeoffs: [
      'Housing costs are rising faster than the programme can scale even at full funding.',
      'Reduced state support falls hardest where private financing is thinnest.',
    ],
    eliminateBenefits: [
      'Frees the full amount for other identified needs.',
      'Housing is served by federal programmes and by local government as well as by the state.',
    ],
    eliminateTradeoffs: [
      'Removes the state’s own contribution at a time of rising housing costs.',
      'State funds often leverage federal and private money that is lost along with them.',
    ],
  }),
]
