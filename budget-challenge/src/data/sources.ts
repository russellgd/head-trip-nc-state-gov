/**
 * The source ledger.
 *
 * Every document the project draws on, defined once and referenced by the
 * baseline, the categories, and the individual policy choices. Adding a figure
 * to the dataset means pointing at one of these and naming the section it came
 * from.
 *
 * `verifiedDate` records when a person opened the document and confirmed the
 * figure. It is not the document's publication date and it is not a guess.
 */
import type { Source } from './types'

/** The date through which this build's data has been checked. */
export const VERIFIED_THROUGH = '2026-08-31'

type SourceTemplate = Omit<Source, 'section' | 'verifiedDate'>

const DOCUMENTS = {
  sl2026_41: {
    title: 'Current Operations Appropriations Act of 2026, S.L. 2026-41 (Senate Bill 257)',
    url: 'https://www.ncleg.gov/EnactedLegislation/SessionLaws/HTML/2025-2026/SL2026-41.html',
  },
  committeeReport: {
    title: 'Joint Conference Committee Report on the Continuation, Expansion and Capital Budgets (SB 257), incorporated into S.L. 2026-41',
    url: 'https://webservices.ncleg.gov/ViewNewsFile/116/Final_Committee_Report_SB257_2026_06_30',
  },
  sl2026_42: {
    title: 'Budget Technical Corrections, S.L. 2026-42 (House Bill 56)',
    url: 'https://www.ncleg.gov/EnactedLegislation/SessionLaws/HTML/2025-2026/SL2026-42.html',
  },
  sl2026_61: {
    title: '2026 Budget Technical Corrections II, S.L. 2026-61 (House Bill 268)',
    url: 'https://www.ncleg.gov/EnactedLegislation/SessionLaws/HTML/2025-2026/SL2026-61.html',
  },
  generalStatutes: {
    title: 'North Carolina General Statutes, Chapter 115C, Article 39, Part 2A (Opportunity Scholarship Grant Fund Reserve)',
    url: 'https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/ByArticle/Chapter_115C/Article_39.html',
  },
  certifiedBudget: {
    title: 'OSBM Certified Budget, FY 2025-27',
    url: 'https://www.osbm.nc.gov/budget/certified-budget',
  },
  governorRecommendation: {
    title:
      "Governor Stein's Recommended Short Session Budget, FY 2026-27 (Office of State Budget and Management, April 2026)",
    url: 'https://www.osbm.nc.gov/budget/governors-budget-recommendations',
  },
} as const satisfies Record<string, SourceTemplate>

export type DocumentKey = keyof typeof DOCUMENTS

/**
 * Build a citation to one of the ledger documents.
 *
 * @param key      which document
 * @param section  where in it the figure appears (section, page, or table)
 * @param verifiedDate  when a person confirmed the figure there
 */
export function cite(
  key: DocumentKey,
  section: string,
  verifiedDate: string = VERIFIED_THROUGH,
): Source {
  return { ...DOCUMENTS[key], section, verifiedDate }
}

/** Every ledger document, with a note on what it is used for. */
export const SOURCE_LEDGER: Array<SourceTemplate & { key: DocumentKey; role: string }> = [
  {
    key: 'sl2026_41',
    ...DOCUMENTS.sl2026_41,
    role: 'The enacted budget. Establishes FY 2026-27 General Fund availability and net appropriations, and is the baseline every option in this simulation is measured against.',
  },
  {
    key: 'committeeReport',
    ...DOCUMENTS.committeeReport,
    role: 'The money report incorporated into S.L. 2026-41. Carries the line-item detail behind the act, including appropriations by agency and the individual budget items the act itself summarizes.',
  },
  {
    key: 'sl2026_42',
    ...DOCUMENTS.sl2026_42,
    role: 'Technical corrections to the enacted budget. Any figure taken from S.L. 2026-41 has to be checked against this act before it is treated as final.',
  },
  {
    key: 'sl2026_61',
    ...DOCUMENTS.sl2026_61,
    role: 'A second round of technical corrections. Checked after S.L. 2026-42 for the same reason.',
  },
  {
    key: 'generalStatutes',
    ...DOCUMENTS.generalStatutes,
    role: 'The statute that funds the Opportunity Scholarship programme. G.S. 115C-562.8(b) sets a recurring appropriation to the Grant Fund Reserve for each fiscal year, which is why the appropriations act contains no line item for the programme. The statute itself was not among the documents available to this build; the FY 2026-27 figure recorded here was supplied by the project owner and should be confirmed against the statute before publication.',
  },
  {
    key: 'certifiedBudget',
    ...DOCUMENTS.certifiedBudget,
    role: 'The certified budget the Office of State Budget and Management produces once the act is enacted. Used to confirm agency-level appropriation amounts.',
  },
  {
    key: 'governorRecommendation',
    ...DOCUMENTS.governorRecommendation,
    role: "The Governor's recommended budget, published April 2026. The source of every published proposal in this project: it both proposes changes and prices them. Note that it measures its own changes from the November 2025 certified budget, not from the budget the General Assembly later enacted, so its published change columns cannot be added to an enacted figure. Options built from it compare the recommended level with the enacted level instead.",
  },
]
