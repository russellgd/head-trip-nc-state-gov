/**
 * The twelve budget areas the challenge is organized into.
 *
 * `enactedNetAppropriation` drives the "where the money goes" chart on the
 * Budget Overview page. It is null wherever the area total has not been
 * confirmed against an official document. A null area is drawn as "not yet
 * verified" and never as zero, because zero would be a claim.
 */
import type { Category } from './types'
import { CATEGORY_NET_APPROPRIATIONS } from './enacted'
import { cite } from './sources'

/**
 * Citation for an area total. Every one is the sum of the agency lines in the
 * act's own appropriations schedule, so they all point at the same section.
 */
const SCHEDULE = [
  cite('sl2026_41', 'Section 2.1(a), Current Operations - General Fund FY 2026-2027'),
]

/**
 * Areas funded through reservations of revenue rather than through net
 * appropriations carry no figure here. Their money is taken off the top of
 * availability before anything is appropriated, so it never appears in the
 * appropriations schedule. Showing zero would misdescribe them.
 */
const NOT_A_NET_APPROPRIATION = null

const RESERVATION_FUNDED =
  'Funded through reservations of revenue taken off the top of General Fund availability, before anything is appropriated, so it does not appear in the appropriations schedule.'

const REVENUE_SIDE =
  'This is the revenue side of the budget rather than a spending area, so it has no net appropriation.'

export const CATEGORIES: Category[] = [
  {
    id: 'k12-education',
    name: 'K-12 Public Education',
    summary:
      'Teacher and school staff salaries and benefits, classroom funding sent to the 115 local school districts, textbooks and digital resources, school transportation, and the state share of charter school funding.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['k12-education'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'community-colleges',
    name: 'Community Colleges',
    summary:
      "Operating support for the 58 institutions of the North Carolina Community College System, including instructional formula funding, workforce and short-term training, and faculty compensation.",
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['community-colleges'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'unc-system',
    name: 'UNC System',
    summary:
      'State operating support for the constituent universities of the University of North Carolina System, need-based financial aid programs, and university research and public service programs.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['unc-system'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'health-human-services',
    name: 'Health and Human Services',
    summary:
      'The state share of Medicaid, behavioral health and developmental disability services, public health, child welfare and child care subsidy, services for older adults, and vital records and licensure functions.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['health-human-services'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'agriculture-environment',
    name: 'Agriculture, Natural Resources, and Environment',
    summary:
      'Agricultural services and food safety, state parks and natural resources, water and air quality programs, environmental permitting and cleanup, and the state land and water conservation funds.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['agriculture-environment'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'economic-development',
    name: 'Economic and Community Development',
    summary:
      'Business recruitment and incentive commitments, workforce development, rural infrastructure grants, tourism and film programs, and community revitalization support.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['economic-development'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'justice-public-safety',
    name: 'Justice and Public Safety',
    summary:
      'The trial and appellate courts, indigent defense, district attorneys, adult correction and community supervision, juvenile justice, the State Highway Patrol, and emergency management.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['justice-public-safety'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'general-government',
    name: 'General Government and State Workforce',
    summary:
      'Statewide administrative agencies, elections administration, the state retirement and health plan contributions the General Fund carries, and compensation policy for state employees generally.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['general-government'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'information-technology',
    name: 'Information Technology',
    summary:
      'Statewide technology services, cybersecurity and risk management, the state network, digital services for residents, and broadband deployment programs run through the state.',
    enactedNetAppropriation: CATEGORY_NET_APPROPRIATIONS['information-technology'] ?? null,
    sources: SCHEDULE,
  },
  {
    id: 'disaster-infrastructure',
    name: 'Disaster Recovery and Infrastructure',
    summary:
      'State disaster recovery programs and the state match for federal disaster aid, repair and renovation of state buildings, capital construction paid from the General Fund, and water and sewer infrastructure grants.',
    enactedNetAppropriation: NOT_A_NET_APPROPRIATION,
    appropriationNote: RESERVATION_FUNDED,
    sources: [],
  },
  {
    id: 'revenue',
    name: 'Taxes and Other General Fund Revenue',
    summary:
      'The personal income tax, corporate income and franchise taxes, sales and use tax, and the non-tax revenue and transfers that together make up General Fund availability.',
    enactedNetAppropriation: NOT_A_NET_APPROPRIATION,
    appropriationNote: REVENUE_SIDE,
    sources: [],
  },
  {
    id: 'reserves',
    name: 'Savings, Reserves, and Unappropriated Balance',
    summary:
      'The Savings Reserve, the State Capital and Infrastructure Fund, disaster and stabilization reserves, and the unappropriated balance the budget deliberately leaves unspent.',
    enactedNetAppropriation: NOT_A_NET_APPROPRIATION,
    appropriationNote: RESERVATION_FUNDED,
    sources: [],
  },
]

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))
