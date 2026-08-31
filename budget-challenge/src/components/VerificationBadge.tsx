import type { Verification } from '../data/types'

const LABELS: Record<Verification['status'], { text: string; className: string }> = {
  verified: {
    text: 'Sourced',
    className: 'bg-carolina-100 text-navy-800 ring-carolina-400',
  },
  derived: {
    text: 'Calculated from a sourced figure',
    className: 'bg-carolina-100 text-navy-800 ring-carolina-400',
  },
  pending: {
    text: 'Amount not yet sourced',
    className: 'bg-gold-100 text-gold-700 ring-gold-500',
  },
  illustrative: {
    text: 'Illustrative, not counted',
    className: 'bg-gold-100 text-gold-700 ring-gold-500',
  },
}

/**
 * States in words what stands behind a figure. The wording carries the meaning;
 * the colour only reinforces it.
 */
export function VerificationBadge({ verification }: { verification: Verification }) {
  const { text, className } = LABELS[verification.status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${className}`}
    >
      {text}
    </span>
  )
}
