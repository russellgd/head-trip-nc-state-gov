import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Category } from '../data/types'
import { formatApprox, formatDollars } from '../lib/format'

export type CategoryWithAmount = Category & { enactedNetAppropriation: number }

const BAR_COLORS = ['#0a2342', '#12365e', '#1b4a7a', '#22688f', '#2f7fb8', '#4e9bcf']

/**
 * The drawn bars only.
 *
 * Loaded on demand, because the charting library is by far the largest
 * dependency in the project and most visitors reach the challenge without ever
 * opening the overview. Hidden from assistive technology: the table beside it
 * carries the same figures.
 */
export default function AppropriationsBars({ categories }: { categories: CategoryWithAmount[] }) {
  return (
    <div className="h-96 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categories.map((c) => ({ name: c.name, value: c.enactedNetAppropriation }))}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
        >
          <CartesianGrid horizontal={false} stroke="#d3dbe4" />
          <XAxis
            type="number"
            tickFormatter={(value: number) => formatApprox(value)}
            stroke="#4d5866"
            fontSize={12}
          />
          <YAxis type="category" dataKey="name" width={190} stroke="#4d5866" fontSize={12} />
          <Tooltip
            formatter={(value) => [formatDollars(Number(value ?? 0)), 'Net appropriation']}
            contentStyle={{ fontSize: 13, borderRadius: 6, borderColor: '#d3dbe4' }}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]}>
            {categories.map((category, i) => (
              <Cell key={category.id} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
