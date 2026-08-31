/**
 * The twelve budget areas the challenge is organized into.
 *
 * `enactedNetAppropriation` drives the "where the money goes" chart on the
 * Budget Overview page. It is null wherever the area total has not been
 * confirmed against an official document. A null area is drawn as "not yet
 * verified" and never as zero, because zero would be a claim.
 */
import type { Category } from './types'

export const CATEGORIES: Category[] = [
  {
    id: 'k12-education',
    name: 'K-12 Public Education',
    summary:
      'Teacher and school staff salaries and benefits, classroom funding sent to the 115 local school districts, textbooks and digital resources, school transportation, and the state share of charter school funding.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'community-colleges',
    name: 'Community Colleges',
    summary:
      "Operating support for the 58 institutions of the North Carolina Community College System, including instructional formula funding, workforce and short-term training, and faculty compensation.",
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'unc-system',
    name: 'UNC System',
    summary:
      'State operating support for the constituent universities of the University of North Carolina System, need-based financial aid programs, and university research and public service programs.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'health-human-services',
    name: 'Health and Human Services',
    summary:
      'The state share of Medicaid, behavioral health and developmental disability services, public health, child welfare and child care subsidy, services for older adults, and vital records and licensure functions.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'agriculture-environment',
    name: 'Agriculture, Natural Resources, and Environment',
    summary:
      'Agricultural services and food safety, state parks and natural resources, water and air quality programs, environmental permitting and cleanup, and the state land and water conservation funds.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'economic-development',
    name: 'Economic and Community Development',
    summary:
      'Business recruitment and incentive commitments, workforce development, rural infrastructure grants, tourism and film programs, and community revitalization support.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'justice-public-safety',
    name: 'Justice and Public Safety',
    summary:
      'The trial and appellate courts, indigent defense, district attorneys, adult correction and community supervision, juvenile justice, the State Highway Patrol, and emergency management.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'general-government',
    name: 'General Government and State Workforce',
    summary:
      'Statewide administrative agencies, elections administration, the state retirement and health plan contributions the General Fund carries, and compensation policy for state employees generally.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'information-technology',
    name: 'Information Technology',
    summary:
      'Statewide technology services, cybersecurity and risk management, the state network, digital services for residents, and broadband deployment programs run through the state.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'disaster-infrastructure',
    name: 'Disaster Recovery and Infrastructure',
    summary:
      'State disaster recovery programs and the state match for federal disaster aid, repair and renovation of state buildings, capital construction paid from the General Fund, and water and sewer infrastructure grants.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'revenue',
    name: 'Taxes and Other General Fund Revenue',
    summary:
      'The personal income tax, corporate income and franchise taxes, sales and use tax, and the non-tax revenue and transfers that together make up General Fund availability.',
    enactedNetAppropriation: null,
    sources: [],
  },
  {
    id: 'reserves',
    name: 'Savings, Reserves, and Unappropriated Balance',
    summary:
      'The Savings Reserve, the State Capital and Infrastructure Fund, disaster and stabilization reserves, and the unappropriated balance the budget deliberately leaves unspent.',
    enactedNetAppropriation: null,
    sources: [],
  },
]

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))
