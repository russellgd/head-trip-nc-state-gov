import { Link } from 'react-router-dom'
import { DATASET } from '../data'
import { Page, Section } from '../components/Page'
import { AppropriationsChart } from '../components/AppropriationsChart'
import { Callout } from '../components/Callout'
import { formatDollars } from '../lib/format'
import { ENACTED_TOTALS } from '../data/enacted'

export function Overview() {
  const { baseline, categories } = DATASET

  return (
    <Page
      wide
      title="Budget Overview"
      lede="What the General Fund is, how its pieces fit together, and what this simulation does and does not cover. Reading this first makes the rest of the challenge easier to interpret."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-w-3xl">
          <Section id="general-fund" title="What the General Fund is">
            <p>
              North Carolina&rsquo;s state government spends money from many separate pots. The
              General Fund is the largest one the General Assembly appropriates freely: it is fed
              mainly by the personal income tax, the sales and use tax, and the corporate income and
              franchise taxes, and it pays for public schools, the community colleges and the
              university system, health and human services, courts and corrections, and most of the
              rest of state government.
            </p>
            <p>
              For {baseline.fiscalYear}, the enacted budget put General Fund availability at{' '}
              <strong className="tabular">{formatDollars(baseline.totalAvailability)}</strong> and
              net appropriations at{' '}
              <strong className="tabular">{formatDollars(baseline.netAppropriations)}</strong>,
              leaving <strong className="tabular">{formatDollars(baseline.unappropriatedBalance)}</strong>{' '}
              unappropriated.
            </p>
            <p>
              Other money the state handles is not part of this. The Highway Fund and the Highway
              Trust Fund pay for roads and are supported by motor fuels taxes and vehicle fees.
              Federal funds flow through many agencies with their own rules attached. Agencies also
              collect receipts of their own. None of those are General Fund dollars, and none of
              them are in this simulation.
            </p>
          </Section>

          <Section id="requirements" title="Requirements, receipts, and net appropriations">
            <p>
              Three words appear constantly in North Carolina budget documents, and the difference
              between them is the single most common source of confusion about how much the state
              spends.
            </p>
            <dl className="space-y-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-line">
              <div>
                <dt className="font-semibold text-navy-900">Requirements</dt>
                <dd className="mt-1 text-ink">
                  What an agency needs in total to operate: every dollar it will spend, from
                  whatever source.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Receipts</dt>
                <dd className="mt-1 text-ink">
                  Money the agency brings in on its own, or receives from the federal government:
                  fees, tuition, grants, federal matching dollars, and similar sources.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Net appropriation</dt>
                <dd className="mt-1 text-ink">
                  Requirements less receipts. This is the General Fund&rsquo;s share, and it is the
                  figure the General Assembly actually appropriates. It is the number this
                  simulation uses throughout.
                </dd>
              </div>
            </dl>
            <p>
              The scale of the difference is worth seeing. Across all agencies, the enacted budget
              shows total requirements of{' '}
              <strong className="tabular">{formatDollars(ENACTED_TOTALS.requirements)}</strong>, less
              receipts of <strong className="tabular">{formatDollars(ENACTED_TOTALS.receipts)}</strong>,
              giving net appropriations of{' '}
              <strong className="tabular">{formatDollars(ENACTED_TOTALS.netAppropriation)}</strong>.
            </p>
            <p>
              A budget figure quoted from the requirements column is therefore well over twice the
              net appropriation, because it includes money the General Fund never provided. Mixing
              the two is how a state budget gets described as far bigger than the amount legislators
              were actually deciding about.
            </p>
          </Section>

          <Section id="recurring" title="Recurring and nonrecurring money">
            <p>
              A recurring appropriation continues into the next year and every year after it unless
              a later budget changes it. Salaries are the clearest example: fund a raise once and
              the higher salary is in the base from then on. A nonrecurring appropriation is
              one-time. Buying buses, repairing a roof, or making a single deposit into a reserve
              are nonrecurring.
            </p>
            <p>
              The distinction matters because the two are not interchangeable, even though they
              spend identically in the year they are appropriated. Using one-time money for a
              recurring commitment balances the current year and leaves a hole in the next one. That
              is why this simulation tracks the two separately and reports a{' '}
              <strong>change in recurring position</strong> alongside the remaining balance. A budget
              can finish this exercise in surplus while its recurring position has worsened, and
              seeing that happen is part of the point.
            </p>
          </Section>

          <Section id="reserves" title="Savings, reserves, and the unappropriated balance">
            <p>
              The <strong>Savings Reserve</strong> is North Carolina&rsquo;s rainy day fund. State law
              directs a share of revenue growth into it and governs when money can be taken out. Its
              purpose is to absorb a downturn without forcing mid-year cuts, and its size is one of
              the things bond rating agencies look at when they set the rate at which the state
              borrows.
            </p>
            <p>
              The state maintains other reserves as well, including funds for capital and
              infrastructure and for disaster response. Separately from all of them, a budget can
              leave an <strong>unappropriated balance</strong>: money that is available but has not
              been committed to anything. That is not the same as a reserve. Unappropriated money
              can be spent by a later appropriation without any special procedure, while money in
              the Savings Reserve is subject to the withdrawal rules in statute.
            </p>
          </Section>

          <Section id="measures" title="How the challenge keeps score">
            <p>
              The challenge shows two figures side by side, and understanding the difference between
              them is most of what it teaches.
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>The enacted budget is the reference point.</strong> Every option is a change
                from what the General Assembly actually enacted, never from zero spending.
              </li>
              <li>
                <strong>You begin at $0 in policy changes.</strong> Leaving every decision alone
                reproduces the enacted budget exactly, so the primary figure &mdash; change from
                enacted budget &mdash; starts at nothing.
              </li>
              <li>
                <strong>The enacted budget leaves a real unappropriated balance.</strong> For{' '}
                {baseline.fiscalYear} that is{' '}
                {formatDollars(baseline.unappropriatedBalance)}, shown as the second figure.
              </li>
              <li>
                <strong>Each choice moves both figures by the same amount.</strong> The balance
                remaining is always the enacted unappropriated balance plus your change from the
                enacted budget.
              </li>
              <li>
                <strong>A negative policy change is not a deficit.</strong> Spending part of the
                balance the enacted budget left is ordinary budgeting. It becomes a deficit only when
                the balance remaining falls below zero, meaning available resources are exhausted.
              </li>
            </ol>
          </Section>

          <Section id="where" title="Where the money goes">
            <p>
              Net appropriations by budget area for {baseline.fiscalYear}, as enacted.
            </p>
            <AppropriationsChart categories={categories} />
          </Section>

          <Section id="process" title="How North Carolina builds a budget">
            <p>
              The state runs on a fiscal year that starts on 1 July and on two-year budget cycles.
              In the first year of a cycle the General Assembly enacts a two-year budget; in the
              second year it typically revises the second year of it rather than starting over.
            </p>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <strong>Agencies build requests.</strong> Each agency prepares what it needs, working
                with the Office of State Budget and Management.
              </li>
              <li>
                <strong>The Governor recommends.</strong> The Governor submits a recommended budget.
                It is a proposal, not law, and the General Assembly is not bound by it. It is also
                the main published source of costed alternatives, which is why it appears so often
                in the sources for this simulation.
              </li>
              <li>
                <strong>The House and Senate each pass a version.</strong> Appropriations
                subcommittees work through their areas, and each chamber passes its own bill.
              </li>
              <li>
                <strong>A conference committee reconciles them.</strong> The result is a conference
                report and an accompanying money report carrying the line-item detail. The money
                report is where most specific figures actually live.
              </li>
              <li>
                <strong>The bill is enacted.</strong> Once passed and signed, or passed over a veto,
                it becomes a session law: for {baseline.fiscalYear}, S.L. 2026-41.
              </li>
              <li>
                <strong>Corrections and certification follow.</strong> Technical corrections acts fix
                errors and omissions, and OSBM issues a certified budget reflecting the final
                figures. Reading the original act alone can leave you with a number that has since
                been changed.
              </li>
            </ol>
          </Section>

          <Section id="excluded" title="What this simulation leaves out">
            <p>
              A simulation that included everything would be the budget itself. These are the
              specific simplifications, stated so you can judge the exercise fairly.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>One fund, one year.</strong> Only the {baseline.fiscalYear} General Fund.
                No Highway Fund, no Highway Trust Fund, no federal funds, no agency receipts, and no
                multi-year projection.
              </li>
              <li>
                <strong>A fixed revenue forecast.</strong> Revenue is treated as the enacted budget
                assumed it. In reality, spending choices and tax changes can affect collections, and
                the forecast is revised during the year.
              </li>
              <li>
                <strong>Two or three options per decision.</strong> Real budget decisions are
                continuous, not multiple choice, and they are negotiated together rather than one at
                a time.
              </li>
              <li>
                <strong>No interaction between decisions.</strong> Choices are added up
                independently. In practice, a change in one area can change what another costs.
              </li>
              <li>
                <strong>Thirty decisions.</strong> S.L. 2026-41 runs to 634 pages and contains
                thousands of individual items.
              </li>
              <li>
                <strong>No debt service or capital financing detail.</strong> Existing obligations
                are treated as fixed.
              </li>
            </ul>
            <p>
              The{' '}
              <Link className="font-medium text-carolina-600 underline underline-offset-2" to="/methodology">
                methodology page
              </Link>{' '}
              lists these in more detail, along with the figures that are not yet settled.
            </p>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <Callout tone="note" title="On this page">
            <nav aria-label="Sections of this page">
              <ul className="space-y-2">
                {[
                  ['general-fund', 'What the General Fund is'],
                  ['requirements', 'Requirements, receipts, net appropriations'],
                  ['recurring', 'Recurring and nonrecurring money'],
                  ['reserves', 'Savings, reserves, unappropriated balance'],
                  ['where', 'Where the money goes'],
                  ['process', 'How North Carolina builds a budget'],
                  ['excluded', 'What this simulation leaves out'],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a
                      className="text-carolina-600 underline underline-offset-2 hover:text-navy-800"
                      href={`#${id}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Callout>

          <div className="mt-4">
            <Link
              to="/challenge"
              className="block rounded-md bg-navy-900 px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Take the Challenge
            </Link>
          </div>
        </aside>
      </div>
    </Page>
  )
}
