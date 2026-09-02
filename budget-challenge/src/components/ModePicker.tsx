import { MODES, type ModeId } from '../data/modes'

/**
 * The choice between the curated path and the whole dataset.
 *
 * Presented as a radio group rather than a toggle, because these are two named
 * things rather than a feature being switched on: each carries its own
 * description and its own length, and a visitor deciding between them needs to
 * read both. Answers are shared, which the panel says, because otherwise
 * switching looks like it might cost the work already done.
 */
export function ModePicker({
  mode,
  onChange,
  decisionCounts,
}: {
  mode: ModeId
  onChange: (mode: ModeId) => void
  decisionCounts: Record<ModeId, number>
}) {
  return (
    <fieldset className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-line">
      <legend className="font-serif text-base font-semibold">Which challenge</legend>
      <div className="mt-3 space-y-2">
        {(Object.values(MODES) as Array<(typeof MODES)[ModeId]>).map((option) => {
          const selected = option.id === mode
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer gap-3 rounded-md p-3 ring-1 transition-colors ${
                selected ? 'bg-carolina-50 ring-carolina-500' : 'bg-white ring-line hover:bg-canvas'
              }`}
            >
              <input
                type="radio"
                name="challenge-mode"
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-carolina-600"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-navy-900">{option.name}</span>
                <span className="block text-xs text-muted">
                  {decisionCounts[option.id]} decisions &middot; {option.duration}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink">
                  {option.summary}
                </span>
              </span>
            </label>
          )
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Your answers are kept when you switch. The balance is totalled over the decisions the
        challenge you are on presents.
      </p>
    </fieldset>
  )
}
