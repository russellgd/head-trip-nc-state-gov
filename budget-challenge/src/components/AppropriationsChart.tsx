import { Suspense, lazy } from 'react'
import type { Category } from '../data/types'
import { formatDollars } from '../lib/format'
import { TableScroll } from './TableScroll'
import type { CategoryWithAmount } from './AppropriationsBars'

// The charting library is the heaviest thing in the project and is needed on
// one section of one page, so it is fetched only when there is a chart to draw.
const AppropriationsBars = lazy(() => import('./AppropriationsBars'))

/**
 * Enacted net appropriations by budget area.
 *
 * The table below the chart is the accessible representation and is always
 * rendered; the bars are a visual restatement of it. An area with no confirmed
 * figure is listed as unverified rather than drawn as a zero-length bar, which
 * would assert that the area receives nothing.
 */
export function AppropriationsChart({ categories }: { categories: Category[] }) {
  const withAmounts = categories
    .filter((c): c is CategoryWithAmount => c.enactedNetAppropriation !== null)
    .sort((a, b) => b.enactedNetAppropriation - a.enactedNetAppropriation)

  const missing = categories.filter((c) => c.enactedNetAppropriation === null)

  return (
    <div>
      {withAmounts.length > 0 ? (
        <Suspense
          fallback={<div className="h-96 w-full animate-pulse rounded-lg bg-navy-100" aria-hidden="true" />}
        >
          <AppropriationsBars categories={withAmounts} />
        </Suspense>
      ) : (
        <div className="rounded-lg bg-gold-100 p-5 ring-1 ring-gold-500">
          <h3 className="font-serif text-base font-semibold text-gold-700">
            This chart has no data to draw yet
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Net appropriations by budget area come from the money report incorporated into
            S.L. 2026-41, read together with the two technical corrections acts and the certified
            budget. Those figures have not been confirmed for this build, and the chart shows
            nothing rather than showing an estimate. Every area is listed below, so what is missing
            is visible rather than implied.
          </p>
        </div>
      )}

      <TableScroll label="Scrollable table: net appropriations by budget area">
      <table className="mt-6 w-full min-w-[26rem] text-left text-sm">
        <caption className="pb-3 text-left text-sm text-muted">
          Enacted FY 2026-27 General Fund net appropriations by budget area. This table carries the
          same information as the chart above.
        </caption>
        <thead>
          <tr className="border-b-2 border-navy-900">
            <th scope="col" className="py-2 pr-4 font-semibold text-navy-900">
              Budget area
            </th>
            <th scope="col" className="py-2 text-right font-semibold text-navy-900">
              Net appropriation
            </th>
          </tr>
        </thead>
        <tbody>
          {withAmounts.map((category) => (
            <tr key={category.id} className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal text-ink">
                {category.name}
              </th>
              <td className="tabular py-2 text-right text-ink">
                {formatDollars(category.enactedNetAppropriation)}
              </td>
            </tr>
          ))}
          {missing.map((category) => (
            <tr key={category.id} className="border-b border-line">
              <th scope="row" className="py-2 pr-4 font-normal text-ink">
                {category.name}
              </th>
              <td className="py-2 text-right text-gold-700">Not yet verified</td>
            </tr>
          ))}
        </tbody>
      </table>
      </TableScroll>
    </div>
  )
}
