import { Page } from '../components/Page'

const TERMS: Array<{ term: string; definition: string }> = [
  {
    term: 'Appropriation',
    definition:
      'A law directing that a specific amount of money be spent for a specific purpose. In North Carolina only the General Assembly can appropriate state funds.',
  },
  {
    term: 'Availability',
    definition:
      'The total amount the state estimates it has to appropriate in a fiscal year: projected tax and non-tax revenue, plus any balance carried forward and any transfers into the fund.',
  },
  {
    term: 'Base budget',
    definition:
      'What it would cost to continue current programs at current service levels into the next year, before any new decision. Budget debates are usually about changes from the base, not about the base itself.',
  },
  {
    term: 'Certified budget',
    definition:
      'The budget the Office of State Budget and Management issues after the appropriations act is enacted, reflecting the act and any corrections. It is the authoritative agency-level figure.',
  },
  {
    term: 'Committee report (money report)',
    definition:
      'The document accompanying an appropriations bill that carries the line-item detail: which programs receive what, broken down further than the act itself. It is incorporated by reference into the act, which gives it legal effect.',
  },
  {
    term: 'Continuation budget',
    definition:
      'Another term for the base budget: the cost of continuing existing operations without policy changes.',
  },
  {
    term: 'Deficit',
    definition:
      'In this simulation, a remaining balance below zero: choices that commit more than is available. North Carolina is required to enact a balanced budget, so a real budget in this position would have to be closed before enactment.',
  },
  {
    term: 'Fiscal note',
    definition:
      'An official estimate of what a proposed bill would cost or raise, prepared by legislative staff. Fiscal notes are what make it possible to score an alternative honestly.',
  },
  {
    term: 'Fiscal year',
    definition:
      'The state budget year, running from 1 July to 30 June. FY 2026-27 begins 1 July 2026 and ends 30 June 2027.',
  },
  {
    term: 'General Fund',
    definition:
      'The state’s main operating fund, supported chiefly by income and sales taxes, and the fund this simulation covers. It is distinct from the Highway Fund, the Highway Trust Fund, federal funds, and agency receipts.',
  },
  {
    term: 'Highway Fund and Highway Trust Fund',
    definition:
      'Separate funds that pay for road construction and maintenance, supported by motor fuels taxes and vehicle fees rather than by General Fund taxes. Neither is part of this simulation.',
  },
  {
    term: 'Net appropriation',
    definition:
      'Requirements less receipts: the General Fund’s own share of an agency’s budget. This is the figure the General Assembly appropriates and the one used throughout this simulation.',
  },
  {
    term: 'Nonrecurring',
    definition:
      'One-time money, spent in a single fiscal year and not built into the base. Equipment purchases, building repairs, and one-off reserve deposits are typically nonrecurring.',
  },
  {
    term: 'Rebase',
    definition:
      'An adjustment to a program’s budget to reflect changes in caseload, enrollment, or prices rather than any change in policy. Most often used of Medicaid, where the number of people eligible and the cost of care both move independently of what the legislature decides.',
  },
  {
    term: 'Receipts',
    definition:
      'Money an agency collects itself or receives from the federal government: fees, tuition, fines, grants, and federal matching funds. Subtracted from requirements to arrive at the net appropriation.',
  },
  {
    term: 'Recurring',
    definition:
      'Ongoing money that continues into the next year and every year after unless a later budget changes it. Salaries are the standard example.',
  },
  {
    term: 'Requirements',
    definition:
      'What an agency needs in total to operate, from every source. Always larger than the net appropriation, which is why quoting requirements as "the budget" overstates what the General Fund provides.',
  },
  {
    term: 'Savings Reserve',
    definition:
      'North Carolina’s rainy day fund. State law directs a share of revenue growth into it and governs when money may be withdrawn. Its purpose is to absorb a downturn without forcing mid-year cuts.',
  },
  {
    term: 'Session law',
    definition:
      'An enacted bill, numbered by year and sequence. The FY 2026-27 appropriations act is S.L. 2026-41; the technical corrections that followed are S.L. 2026-42 and S.L. 2026-61.',
  },
  {
    term: 'Structural balance',
    definition:
      'Whether ongoing revenue covers ongoing commitments. A budget that balances only because of one-time money is structurally out of balance, and will be short the following year. This simulation reports the change in the recurring position rather than an absolute structural balance.',
  },
  {
    term: 'Technical corrections',
    definition:
      'A follow-up act fixing errors, omissions, and drafting problems in an enacted budget. A figure read from the original act may have been changed by one of these, which is why they have to be checked before a number is treated as final.',
  },
  {
    term: 'Unappropriated balance',
    definition:
      'Money that is available but has not been committed to any purpose. Unlike money in a reserve, it can be spent by a later appropriation without any special procedure.',
  },
]

export function Glossary() {
  return (
    <Page
      title="Glossary"
      lede="Budget terms as they are used in North Carolina, in plain language. Terms are listed alphabetically."
    >
      <dl className="space-y-5">
        {TERMS.map((entry) => (
          <div
            key={entry.term}
            className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-line print-break-inside-avoid"
          >
            <dt className="font-serif text-lg font-semibold text-navy-900">{entry.term}</dt>
            <dd className="mt-1 leading-relaxed text-ink">{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </Page>
  )
}
