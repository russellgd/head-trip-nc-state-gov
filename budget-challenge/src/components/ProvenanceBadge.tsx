import type { Choice, Provenance } from '../data/types'

/**
 * What kind of thing an option is: the enacted policy, an alternative whose
 * amount an official document states, a published proposal, or an illustrative
 * scenario this project constructed.
 *
 * This is deliberately separate from whether the arithmetic is traceable. An
 * illustrative scenario can have exact arithmetic and still be something nobody
 * proposed, and the label has to say which of those it is.
 *
 * Each class is distinguished three ways — by its wording, by a glyph, and by
 * colour — so that none of it depends on colour alone.
 */
export const PROVENANCE: Record<
  Provenance,
  { label: string; glyph: string; chip: string; stripe: string; short: string }
> = {
  enacted: {
    label: 'Enacted policy',
    short: 'Enacted',
    glyph: '§',
    chip: 'bg-navy-900 text-white ring-navy-900',
    stripe: 'border-l-navy-900',
  },
  documented: {
    label: 'Documented alternative',
    short: 'Documented',
    glyph: '✓',
    chip: 'bg-carolina-100 text-navy-800 ring-carolina-600',
    stripe: 'border-l-carolina-500',
  },
  proposal: {
    label: 'Published proposal',
    short: 'Proposal',
    glyph: '✓',
    chip: 'bg-carolina-100 text-navy-800 ring-carolina-600',
    stripe: 'border-l-carolina-500',
  },
  illustrative: {
    label: 'Illustrative allocation scenario',
    short: 'Illustrative',
    glyph: '△',
    chip: 'bg-gold-100 text-gold-700 ring-gold-600',
    stripe: 'border-l-gold-500',
  },
}

/** One-line explanation of each class, used in legends and on the results page. */
export const PROVENANCE_MEANING: Record<Provenance, string> = {
  enacted: 'What S.L. 2026-41 actually does. The reference point every other option is measured from.',
  documented:
    'The dollar impact equals an amount stated in an official document. Not making a reservation the act makes frees exactly what the act reserves.',
  proposal:
    'An alternative published in an official document with an official fiscal estimate behind it.',
  illustrative:
    'A percentage change constructed for this exercise to show the scale of a trade-off. The arithmetic is exact; the policy was not proposed by any North Carolina official or institution.',
}

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const style = PROVENANCE[provenance]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style.chip}`}
    >
      <span aria-hidden="true">{style.glyph}</span>
      {style.label}
    </span>
  )
}

/**
 * A second chip, shown only when an option carries no confirmed figure.
 *
 * Provenance and arithmetic are separate questions, so an option can be a real
 * published proposal and still have no dollar amount behind it yet. Showing one
 * badge without the other would hide half of that.
 */
export function UnsourcedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700 ring-1 ring-gold-600">
      <span aria-hidden="true">?</span>
      Amount not yet sourced
    </span>
  )
}

/** Whether an option needs the illustrative caveat shown alongside it. */
export const isIllustrative = (choice: Choice): boolean => choice.provenance === 'illustrative'
