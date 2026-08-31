import { PROVENANCE, PROVENANCE_MEANING } from './ProvenanceBadge'
import type { Provenance } from '../data/types'

const ORDER: Provenance[] = ['enacted', 'documented', 'illustrative']

/**
 * The notice that opens the challenge.
 *
 * It exists because the distinction it draws is the one a reader is most likely
 * to get wrong, and getting it wrong means leaving with the impression that
 * somebody in North Carolina proposed a change that nobody proposed.
 */
export function ProvenanceLegend() {
  return (
    <section
      aria-labelledby="provenance-heading"
      className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gold-500 print-break-inside-avoid"
    >
      <h2 id="provenance-heading" className="font-serif text-lg font-semibold">
        Before you start: where these choices come from
      </h2>

      <p className="mt-2 leading-relaxed text-ink">
        Some choices reflect enacted or formally proposed policies. Others are illustrative
        percentage changes designed to demonstrate budget trade-offs.{' '}
        <strong>
          Illustrative choices should not be interpreted as proposals made by any North Carolina
          official or institution.
        </strong>
      </p>

      <dl className="mt-4 space-y-3">
        {ORDER.map((provenance) => {
          const style = PROVENANCE[provenance]
          return (
            <div
              key={provenance}
              className={`border-l-4 pl-3 ${style.stripe}`}
            >
              <dt>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style.chip}`}
                >
                  <span aria-hidden="true">{style.glyph}</span>
                  {style.label}
                </span>
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink">
                {PROVENANCE_MEANING[provenance]}
              </dd>
            </div>
          )
        })}
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Every option shows the arithmetic behind its dollar figure. An illustrative option also
        says what a change of that shape would actually run into in practice, because a percentage
        applied evenly across an agency is an arithmetic device rather than something that could be
        carried out as written.
      </p>
    </section>
  )
}
