import { useId, useState, type ReactNode } from 'react'

/**
 * A collapsible panel for material a reader should be able to reach but should
 * not have to read.
 *
 * Built from a button and a region rather than `<details>` so that the expanded
 * state is stated explicitly through `aria-expanded` and `aria-controls`, and so
 * that print can force every panel open: a printed report has no way to expand
 * anything, and the technical record must survive the transition to paper.
 * `.disclosure-panel` is overridden in the print stylesheet for exactly that.
 *
 * What may go in here is limited by design. Sources, arithmetic and background
 * belong to the reader who wants them; whether an option is illustrative, what
 * it costs, and what it trades away are shown on the card whether anyone opens
 * anything or not.
 */
export function Disclosure({
  label,
  children,
  tone = 'default',
}: {
  label: string
  children: ReactNode
  /** 'quiet' for the technical panel, which should not compete with the policy. */
  tone?: 'default' | 'quiet'
}) {
  const panelId = useId()
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-sm text-sm font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carolina-600 ${
          tone === 'quiet' ? 'text-muted hover:text-navy-800' : 'text-carolina-600 hover:text-navy-800'
        }`}
      >
        <span aria-hidden="true" className={open ? 'rotate-90' : ''}>
          ▸
        </span>
        {label}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="disclosure-panel mt-3 space-y-3 border-l-2 border-carolina-100 pl-4"
      >
        {children}
      </div>
    </div>
  )
}
