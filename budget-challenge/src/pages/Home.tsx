import { Link } from 'react-router-dom'
import { DATASET } from '../data'
import { formatApprox, formatDollars } from '../lib/format'
import { GeographyBand } from '../components/GeographyBand'
import { Callout } from '../components/Callout'

function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  // A <div> inside a <dl> may hold only <dt> and <dd>, so the note lives in the
  // <dd> rather than as a sibling paragraph.
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-line">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd>
        <span className="mt-1 block tabular text-2xl font-bold text-navy-900">{value}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">{note}</span>
      </dd>
    </div>
  )
}

export function Home() {
  const { baseline } = DATASET

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-500">
            {baseline.fiscalYear} General Fund
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-white sm:text-5xl">
            How Would You Balance North Carolina&rsquo;s Budget?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100">
            North Carolina&rsquo;s General Fund pays for public schools, universities, health care,
            courts, prisons, parks, and the people who run them. Every year the General Assembly
            decides how much each of those gets, how much the state collects in taxes, and how much
            it sets aside. The choices interact: money spent in one place is money not available in
            another.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-100">
            This is a chance to make those choices yourself. Work through the decisions, watch the
            balance change, and see what your budget adds up to.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/challenge"
              className="rounded-md bg-gold-500 px-6 py-3 text-base font-semibold text-navy-900 shadow-sm transition-colors hover:bg-gold-200"
            >
              Take the Challenge
            </Link>
            <Link
              to="/overview"
              className="rounded-md bg-navy-700 px-6 py-3 text-base font-semibold text-white ring-1 ring-navy-100/30 transition-colors hover:bg-navy-800"
            >
              Start with the Budget Overview
            </Link>
          </div>
        </div>
        <GeographyBand className="h-16 w-full text-gold-500" />
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <section aria-labelledby="baseline-heading">
          <h2 id="baseline-heading" className="font-serif text-2xl font-semibold">
            Where the budget starts
          </h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-ink">
            The challenge begins from the budget as enacted for {baseline.fiscalYear}. These three
            figures describe it: what was available, what was committed, and what was deliberately
            left uncommitted. That last figure is the money you start with.
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <Figure
              label="Total General Fund availability"
              value={formatDollars(baseline.totalAvailability)}
              note="Everything the state expected to have available to appropriate."
            />
            <Figure
              label="General Fund net appropriations"
              value={formatDollars(baseline.netAppropriations)}
              note={`Roughly ${formatApprox(baseline.netAppropriations)} committed to agencies and programs.`}
            />
            <Figure
              label="Unappropriated balance"
              value={formatDollars(baseline.unappropriatedBalance)}
              note="Available but not committed. This is your starting balance."
            />
          </dl>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            These are General Fund figures only. They do not include agency receipts, federal funds,
            the Highway Fund, or the Highway Trust Fund, all of which are separate and considerably
            larger in total. The{' '}
            <Link className="font-medium text-carolina-600 underline underline-offset-2" to="/overview">
              Budget Overview
            </Link>{' '}
            explains why that distinction matters.
          </p>
        </section>

        <section aria-labelledby="how-heading" className="mt-12">
          <h2 id="how-heading" className="font-serif text-2xl font-semibold">
            How the challenge works
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: 'One',
                title: 'Make spending choices',
                body: 'Work through decisions in education, health and human services, public safety, the environment, and the rest of the General Fund. Each one offers the enacted policy and one or more documented alternatives.',
              },
              {
                step: 'Two',
                title: 'Decide how to pay',
                body: 'Then turn to taxes and other revenue, and to savings and reserves. The balance updates after every choice, so you can see immediately what a decision costs or frees up.',
              },
              {
                step: 'Three',
                title: 'See what it adds up to',
                body: 'Finish with a summary of your budget: whether it balances, what it does to the state’s recurring position, and how it compares with the budget as enacted.',
              },
            ].map((item) => (
              <li key={item.step} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-line">
                <p className="text-xs font-semibold uppercase tracking-wide text-carolina-600">
                  Step {item.step}
                </p>
                <h3 className="mt-1 font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="learn-heading" className="mt-12">
          <h2 id="learn-heading" className="font-serif text-2xl font-semibold">
            Before you start
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                to: '/overview',
                title: 'Budget Overview',
                body: 'What the General Fund is, how recurring money differs from one-time money, and what this simulation leaves out.',
              },
              {
                to: '/methodology',
                title: 'Methodology and Sources',
                body: 'Where every figure comes from, how the arithmetic works, and what is still unresolved.',
              },
              {
                to: '/glossary',
                title: 'Glossary',
                body: 'Plain-language definitions of the budget terms used throughout, from net appropriations to the rebase.',
              },
              {
                to: '/results',
                title: 'Your results so far',
                body: 'A running summary of the choices you have made. Your answers are saved in this browser.',
              },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block h-full rounded-lg bg-white p-5 shadow-sm ring-1 ring-line transition-shadow hover:shadow-md"
                >
                  <h3 className="font-serif text-lg font-semibold text-carolina-600 underline underline-offset-2">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 space-y-4">
          <Callout tone="caution" title="An independent educational project">
            <p>
              This is not a publication of the State of North Carolina, the General Assembly, the
              Office of State Budget and Management, or any state agency, and it is not affiliated
              with or endorsed by any of them. It was built from public documents as a teaching
              tool.
            </p>
            <p>
              It is not a source for official figures, and it is not a forecast of what any budget
              would actually do. It simplifies choices that in practice involve far more detail than
              a simulation can carry.
            </p>
          </Callout>

          {baseline.provisional ? (
            <Callout tone="caution" title="What is not settled in this version">
              <p>{baseline.provisionalNote}</p>
              <p>
                Enacted amounts throughout are transcribed from the act and check out against the
                totals it states. The alternatives are a different matter: an appropriations act
                does not publish a costed alternative to itself, so where an option changes an
                agency&rsquo;s funding, the amount is a stated percentage of the enacted figure and
                the arithmetic is shown. Those are scales chosen to give a sense of proportion, not
                proposals anyone made. The{' '}
                <Link className="font-medium underline underline-offset-2" to="/methodology">
                  methodology page
                </Link>{' '}
                sets out exactly what each figure rests on.
              </p>
            </Callout>
          ) : null}
        </div>
      </div>
    </div>
  )
}
