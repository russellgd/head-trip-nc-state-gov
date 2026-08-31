import { useId, type ReactNode } from 'react'

type Tone = 'note' | 'caution' | 'limit'

const TONES: Record<Tone, { ring: string; bg: string; heading: string }> = {
  note: { ring: 'ring-carolina-400', bg: 'bg-carolina-50', heading: 'text-navy-900' },
  caution: { ring: 'ring-gold-500', bg: 'bg-gold-100', heading: 'text-gold-700' },
  limit: { ring: 'ring-line', bg: 'bg-white', heading: 'text-navy-900' },
}

/**
 * A boxed aside. The title always states the point in words, so the box never
 * depends on its colour to be understood.
 */
export function Callout({
  tone = 'note',
  title,
  children,
}: {
  tone?: Tone
  title: string
  children: ReactNode
}) {
  const styles = TONES[tone]
  // Several of these can appear on one page. Naming each after its own heading
  // keeps them distinguishable when a screen reader lists the page's landmarks.
  const headingId = useId()

  return (
    <aside
      aria-labelledby={headingId}
      className={`rounded-lg p-5 ring-1 ${styles.ring} ${styles.bg} print-break-inside-avoid`}
    >
      <h3 id={headingId} className={`font-serif text-base font-semibold ${styles.heading}`}>
        {title}
      </h3>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink">{children}</div>
    </aside>
  )
}
