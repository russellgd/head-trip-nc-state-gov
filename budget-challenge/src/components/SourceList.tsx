import type { Source } from '../data/types'

/** Citations, with the section and the date a person last checked the figure. */
export function SourceList({ sources, label = 'Sources' }: { sources: Source[]; label?: string }) {
  if (sources.length === 0) {
    return (
      <p className="text-sm text-muted">
        No source is cited here, because no dollar figure is claimed.
      </p>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-navy-900">{label}</h4>
      <ul className="mt-2 space-y-3">
        {sources.map((source) => (
          <li key={`${source.url}-${source.section}`} className="text-sm leading-relaxed">
            <a
              href={source.url}
              className="font-medium text-carolina-600 underline underline-offset-2 hover:text-navy-800"
              target="_blank"
              rel="noreferrer"
            >
              {source.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {source.section ? <span className="block text-muted">{source.section}</span> : null}
            <span className="block text-xs text-muted">
              Verified through {source.verifiedDate}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
