import type { ReactNode } from 'react'

/**
 * Lets a wide table scroll sideways inside its own box instead of pushing the
 * whole page sideways on a narrow screen.
 *
 * The wrapper is focusable and labelled because a region that scrolls has to be
 * reachable by keyboard; otherwise a keyboard user cannot see the columns that
 * are off screen.
 */
export function TableScroll({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      {children}
    </div>
  )
}
