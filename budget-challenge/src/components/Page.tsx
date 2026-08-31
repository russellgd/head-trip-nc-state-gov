import type { ReactNode } from 'react'

/** Consistent page frame: one h1, a standard measure, and predictable padding. */
export function Page({
  title,
  lede,
  children,
  wide = false,
}: {
  title: string
  lede?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className={`mx-auto px-4 py-10 sm:px-6 sm:py-12 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">{title}</h1>
      {lede ? <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p> : null}
      <div className="mt-8">{children}</div>
    </div>
  )
}

/** A section with a heading that screen readers can navigate by. */
export function Section({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mt-10 first:mt-0">
      <h2 id={id} className="font-serif text-2xl font-semibold">
        {title}
      </h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink">{children}</div>
    </section>
  )
}
