import { DATASET, SOURCE_LEDGER, collectSources, provenanceSummary, verificationSummary } from '../data'
import { PROVENANCE, PROVENANCE_MEANING } from '../components/ProvenanceBadge'
import type { Provenance } from '../data/types'
import { Page, Section } from '../components/Page'
import { Callout } from '../components/Callout'
import { TableScroll } from '../components/TableScroll'
import { formatDollars } from '../lib/format'

/** Version history. Add a row whenever any figure in the dataset changes. */
const VERSION_HISTORY: Array<{ version: string; date: string; note: string }> = [
  {
    version: '0.3.0',
    date: '2026-08-31',
    note:
      'Fourteen illustrative allocation scenarios replaced with published proposals from ' +
      'Governor Stein\u2019s Recommended Budget for FY 2026-27, each citing its page and the ' +
      'constituent recommendations behind it. Because the Governor measures changes from the ' +
      'November 2025 certified budget rather than from the enacted act, the scored figure is ' +
      'the difference between the two published levels. Thirty-two illustrative scenarios ' +
      'remain where no comparable recommendation exists. The enacted baseline is unchanged.',
  },
  {
    version: '0.2.0',
    date: '2026-08-31',
    note:
      'Populated from the text of S.L. 2026-41. All 78 agency lines in the appropriations ' +
      'schedule transcribed and reconciled to the act\u2019s stated totals; the availability ' +
      'statement reconciled line by line; the ten reservations of revenue reconciled to their ' +
      'stated subtotals. Every policy option now carries a figure traceable to a section of ' +
      'the act. Decisions rebuilt on those figures, and the overview chart populated.',
  },
  {
    version: '0.1.0',
    date: '2026-08-31',
    note:
      'First release: application framework, calculation engine, and validation rules, with ' +
      'the three baseline anchors in place and most policy options awaiting official figures.',
  },
]

export function Methodology() {
  const { baseline } = DATASET
  const counts = verificationSummary(DATASET)
  const provenance = provenanceSummary(DATASET)
  const sources = collectSources(DATASET)
  const scoredDecisions = DATASET.decisions.filter((d) =>
    d.choices.some((c) => !c.isEnactedBaseline && c.verification.scored),
  )

  return (
    <Page
      title="Methodology and Sources"
      lede="Where every figure comes from, how the arithmetic works, what has been simplified, and what is not yet settled."
    >
      <p className="rounded-md bg-navy-900 px-4 py-3 text-sm font-semibold text-white">
        Data verified through {baseline.verifiedThrough} &middot; dataset version {DATASET.version}
      </p>

      <Section id="scope" title="Data scope">
        <p>
          The simulation covers the <strong>{baseline.fiscalYear} General Fund</strong> and nothing
          else. Specifically, it uses General Fund <strong>net appropriations</strong>: what the
          General Assembly appropriates after agency receipts are netted out.
        </p>
        <p>These are deliberately excluded, and never combined with the figures above:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>All-funds expenditures, which are much larger than General Fund appropriations</li>
          <li>Agency receipts: fees, tuition, and other money agencies collect themselves</li>
          <li>Federal funds passing through state agencies</li>
          <li>The Highway Fund and the Highway Trust Fund</li>
          <li>Capital financing and debt service detail</li>
          <li>Local government budgets</li>
        </ul>
        <p>
          Mixing these categories is the most common way a state budget figure is misreported. A
          number drawn from the all-funds or requirements column will always be larger than the net
          appropriation for the same agency, because it includes money the General Fund did not
          provide.
        </p>
      </Section>

      <Section id="baseline" title="Baseline">
        <p>
          The enacted budget is the default. Every decision opens on the enacted policy, and every
          alternative is expressed as a change from it. Leaving every decision alone reproduces the
          enacted budget exactly, and the test suite asserts that.
        </p>
        <TableScroll label="Scrollable table: baseline General Fund anchors">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <caption className="sr-only">Baseline General Fund anchors</caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Anchor
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-navy-900">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="tabular">
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal">
                Revised total General Fund availability
              </th>
              <td className="py-2 text-right">{formatDollars(baseline.totalAvailability)}</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal">
                General Fund net appropriations
              </th>
              <td className="py-2 text-right">{formatDollars(baseline.netAppropriations)}</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal">
                Unappropriated balance remaining
              </th>
              <td className="py-2 text-right">{formatDollars(baseline.unappropriatedBalance)}</td>
            </tr>
          </tbody>
        </table>
        </TableScroll>
        <p>
          The three reconcile: availability less net appropriations equals the unappropriated
          balance. The application refuses to start if they do not.
        </p>
        {baseline.provisional ? (
          <Callout tone="caution" title="These anchors are provisional">
            <p>{baseline.provisionalNote}</p>
          </Callout>
        ) : null}
      </Section>

      <Section id="calculation" title="How the balance is calculated">
        <p>Your remaining balance is:</p>
        <pre
          tabIndex={0}
          aria-label="The remaining balance formula"
          className="overflow-x-auto rounded-md bg-navy-900 p-4 text-sm leading-relaxed text-white"
        >
{`remaining balance = baseline unappropriated balance
                  + revenue increases
                  - revenue reductions
                  - spending increases
                  + spending reductions
                  - additional reserve deposits
                  + reserve withdrawals`}
        </pre>
        <p>
          A reserve deposit reduces the remaining balance because the money is set aside rather than
          left available. A withdrawal returns money to the balance.
        </p>
        <p>
          Every amount is stored and calculated as a whole number of dollars. Nothing is rounded
          during calculation; rounded figures appear only where a heading says &ldquo;about&rdquo; or
          uses words like &ldquo;billion&rdquo;.
        </p>

        <h3 className="font-serif text-xl font-semibold">Recurring and one-time money</h3>
        <p>
          Each amount is stored as two separate numbers, one recurring and one nonrecurring, and
          they are never added together except where a total is explicitly labelled as such. The{' '}
          <strong>change in recurring position</strong> reported throughout is:
        </p>
        <pre
          tabIndex={0}
          aria-label="The recurring position formula"
          className="overflow-x-auto rounded-md bg-navy-900 p-4 text-sm text-white"
        >
{`change in recurring position = recurring revenue
                             - recurring spending
                             - recurring reserve commitments`}
        </pre>
        <p>
          Note what that figure is and is not. It is the <em>change</em> against the enacted budget,
          not the state&rsquo;s absolute structural balance. The enacted budget&rsquo;s own recurring
          position is not among the published anchors this project uses, so the simulation does not
          state one. A budget can end this exercise in surplus while this figure is negative, which
          means it balanced the year with one-time money and starts the next year behind.
        </p>

        <h3 className="font-serif text-xl font-semibold">Balanced, surplus, and deficit</h3>
        <p>
          A budget is treated as balanced when the remaining balance is zero or greater. A deficit
          triggers a warning but is never blocked: seeing what a set of choices actually produces is
          the point of the exercise.
        </p>
      </Section>

      <Section id="verification" title="What is scored, and what is not">
        <p>
          A figure moves your balance only if it is <strong>verified</strong> (stated in an official
          North Carolina government document, cited on the option) or <strong>derived</strong>{' '}
          (arithmetic performed on such a figure, with the calculation shown). Anything else is
          presented, and you can choose it, but it does not move the balance. That rule is enforced
          by the data validator and by the test suite rather than by convention.
        </p>
        <p>
          An option with no confirmed figure shows &ldquo;amount not yet sourced&rdquo;, never
          &ldquo;$0&rdquo;. Zero would assert that the option is free, which is a claim; the absence
          of a figure is not.
        </p>

        <TableScroll label="Scrollable table: options by verification status">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <caption className="pb-2 text-left text-sm text-muted">
            Options in this dataset by verification status
          </caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Status
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Counted in the balance
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-navy-900">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="tabular">
            {[
              ['verified', 'Yes', 'Stated in an official document'],
              ['derived', 'Yes', 'Calculated from a sourced figure, with the working shown'],
              ['pending', 'No', 'No official figure confirmed yet'],
            ].map(([key, counted, description]) => (
              <tr key={key} className="border-b border-line">
                <th scope="row" className="py-2 pr-4 font-normal">
                  <span className="font-semibold capitalize">{key}</span>
                  <span className="block text-xs text-muted">{description}</span>
                </th>
                <td className="py-2 pr-4">{counted}</td>
                <td className="py-2 text-right">{counts[key as string] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </TableScroll>

        <h3 className="font-serif text-xl font-semibold">Where each option comes from</h3>
        <p>
          Whether the arithmetic is traceable and whether anyone proposed the policy are two
          different questions. The table above answers the first. This one answers the second, and
          it is the distinction that matters most when reading a result.
        </p>

        <TableScroll label="Scrollable table: options by provenance">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <caption className="pb-2 text-left text-sm text-muted">
            Options in this dataset by provenance
          </caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Provenance
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                What it means
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-navy-900">
                Options
              </th>
            </tr>
          </thead>
          <tbody className="tabular">
            {(['enacted', 'documented', 'proposal', 'illustrative'] as Provenance[]).map((key) => (
              <tr key={key} className="border-b border-line align-top">
                <th scope="row" className="py-2 pr-4 font-normal">
                  <span className="font-semibold">
                    <span aria-hidden="true">{PROVENANCE[key].glyph} </span>
                    {PROVENANCE[key].label}
                  </span>
                </th>
                <td className="py-2 pr-4 text-xs leading-relaxed text-muted">
                  {PROVENANCE_MEANING[key]}
                </td>
                <td className="py-2 text-right">{provenance[key] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </TableScroll>

        <p>
          Nothing in this dataset carries the <strong>published proposal</strong> label yet. That
          class exists for alternatives drawn from a document that both proposes a change and
          prices it — a Governor&rsquo;s recommended budget, a fiscal note, a committee report.
          Adding such a document is what would convert illustrative scenarios into proposals, and{' '}
          <code className="rounded bg-white px-1 py-0.5 text-xs">REPLACEMENT_INVENTORY.md</code> in
          the repository lists every illustrative option together with the document that would
          replace it.
        </p>

        <Callout tone="caution" title="Where the alternatives come from, and what they are not">
          <p>
            All {DATASET.decisions.length} decisions carry figures traceable to S.L. 2026-41, and{' '}
            {scoredDecisions.length} of them offer alternatives that move the balance. The enacted
            amounts are transcribed from the act: the 78 agency lines in its appropriations schedule
            sum to the total it states, and its availability statement reconciles line by line. Those
            checks run in the test suite, so a transcription error cannot pass silently.
          </p>
          <p>
            The <strong>alternatives</strong> need a different kind of care. An appropriations act
            establishes what an agency receives; it does not publish a costed alternative to itself.
            No document that prices alternatives was available to this build. So where an option
            changes an agency&rsquo;s funding, it is an{' '}
            <strong>illustrative allocation scenario</strong>: a stated percentage of the enacted
            appropriation, with the arithmetic shown. The percentage is this project&rsquo;s, chosen
            to give a sense of scale. No North Carolina official or institution proposed it, and it
            must not be described as a policy proposal.
          </p>
          <p>
            An illustrative scenario is also not a plan. A percentage applied evenly across an
            agency total is an arithmetic device: the money is distributed by statutory formulas and
            allotments, parts of it are committed to entitlements, contracts, debt, or federally
            required matching, and some line items cannot be changed without amending statute. Every
            illustrative option says so on its own card.
          </p>
          <p>
            Options built on the reservations of revenue in Section 2.2(a) are firmer: keeping,
            halving, or dropping a reservation moves an amount the act prints to the dollar.
          </p>
          <p>
            What would improve this most is the Governor&rsquo;s Recommended Budget, which carries
            costed alternatives with official fiscal estimates behind them. See{' '}
            <code className="rounded bg-white px-1 py-0.5 text-xs">DATA_NOTES.md</code> in the
            repository for what remains unresolved.
          </p>
        </Callout>
      </Section>

      <Section id="receipts" title="Treatment of receipts and federal funds">
        <p>
          Agency receipts and federal funds are outside the simulation entirely. They are neither
          added to the baseline nor adjusted by any choice.
        </p>
        <p>
          One consequence is worth stating, because it makes some options look cheaper than they
          are. Where a state dollar draws a federal matching dollar, as it does in Medicaid, a
          reduction in the state share removes more total spending from the program than it saves
          the General Fund. This simulation shows only the General Fund side of that. Options where
          the effect is significant say so in their trade-offs.
        </p>
      </Section>

      <Section id="simplifications" title="Simplifications and exclusions">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Single year.</strong> FY 2026-27 only. No projection into later years, even
            though recurring choices plainly affect them.
          </li>
          <li>
            <strong>Fixed revenue forecast.</strong> Revenue is held at the enacted assumption.
            Spending choices are not modelled as affecting collections.
          </li>
          <li>
            <strong>No interaction between decisions.</strong> Effects are added independently.
            Real budget items interact.
          </li>
          <li>
            <strong>Discrete options.</strong> Two or three choices where the real decision is a
            continuous amount.
          </li>
          <li>
            <strong>Thirty decisions.</strong> The act runs to 634 pages and contains thousands of
            individual items.
          </li>
          <li>
            <strong>No behavioural or economic modelling.</strong> No multipliers, no elasticities,
            no dynamic scoring.
          </li>
          <li>
            <strong>No position or caseload detail.</strong> Amounts are dollars, not full-time
            equivalents or served populations.
          </li>
          <li>
            <strong>Alternatives are scaled, not proposed.</strong> Where an option changes an
            agency&rsquo;s funding, the percentage is this project&rsquo;s rather than a figure from
            a budget document. The dollar amount that follows from it is exact.
          </li>
          <li>
            <strong>Agency changes are treated as recurring.</strong> The act&rsquo;s schedule does
            not split agency totals into recurring and nonrecurring parts, and an operating budget
            continues from year to year, so a change to one is counted as recurring throughout.
          </li>
          <li>
            <strong>Three areas carry no appropriation figure</strong> — disaster and
            infrastructure, revenue, and reserves. They are funded through reservations of revenue
            taken off the top of availability, or they are the revenue side itself, so they never
            appear in the appropriations schedule. They are shown as such rather than as zero.
          </li>
        </ul>
      </Section>

      <Section id="sources" title="Source ledger">
        <p>
          Every document this project draws on, and what each is used for. Dollar figures come only
          from official North Carolina government sources; the data validator rejects a citation on
          any other host.
        </p>
        <ul className="space-y-4">
          {SOURCE_LEDGER.map((entry) => (
            <li key={entry.key} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-line">
              <h3 className="font-serif text-base font-semibold">
                <a
                  className="text-carolina-600 underline underline-offset-2 hover:text-navy-800"
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {entry.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink">{entry.role}</p>
              <p className="mt-1 break-all text-xs text-muted">{entry.url}</p>
            </li>
          ))}
        </ul>

        <h3 className="font-serif text-xl font-semibold">Citations used in the data</h3>
        <p>
          {sources.length === 0
            ? 'No figure-level citations are present yet, because no figure-level amounts have been confirmed.'
            : `${sources.length} distinct citation${sources.length === 1 ? '' : 's'} appear in the dataset.`}
        </p>
        {sources.length > 0 ? (
          <ul className="space-y-2">
            {sources.map((source) => (
              <li key={`${source.url}-${source.section}`} className="text-sm">
                <a
                  className="font-medium text-carolina-600 underline underline-offset-2"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.title}
                </a>
                <span className="block text-muted">
                  {source.section} &middot; verified through {source.verifiedDate}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section id="history" title="Version history">
        <TableScroll label="Scrollable table: dataset version history">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <caption className="sr-only">Dataset version history</caption>
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Version
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
                Date
              </th>
              <th scope="col" className="py-2 font-semibold text-navy-900">
                What changed
              </th>
            </tr>
          </thead>
          <tbody>
            {VERSION_HISTORY.map((entry) => (
              <tr key={entry.version} className="border-b border-line align-top">
                <th scope="row" className="py-2 pr-4 font-normal tabular">
                  {entry.version}
                </th>
                <td className="py-2 pr-4 tabular">{entry.date}</td>
                <td className="py-2 leading-relaxed">{entry.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </TableScroll>
      </Section>

      <Section id="corrections" title="Corrections">
        <p>
          If a figure here is wrong, it should be fixed rather than defended. The data lives in one
          place in the repository, separate from the interface, so a correction is a change to a
          data file and a new row in the version history above.
        </p>
      </Section>
    </Page>
  )
}
