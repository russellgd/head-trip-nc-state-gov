import { describe, expect, it } from 'vitest'
import { DATASET } from '../data'
import { computeTotals, enactedSelections } from '../engine/budget'
import { buildCsv, buildJson, buildRows } from './export'

/** Count CSV fields, respecting quoted fields and doubled quotes. */
function countFields(line: string): number {
  let fields = 1
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      fields += 1
    }
  }

  return fields
}

const selections = { ...enactedSelections(DATASET), 'unappropriated-balance': 'deposit-half' }
const totals = computeTotals(DATASET, selections)

describe('JSON export', () => {
  it('carries the baseline, the results, and every choice', () => {
    const data = JSON.parse(buildJson(DATASET, selections, totals))

    expect(data.baseline.unappropriatedBalance).toBe(1_000_000_000)
    expect(data.results.remainingBalance).toBe(500_000_000)
    expect(data.choices).toHaveLength(DATASET.decisions.length)
    expect(data.dataVerifiedThrough).toBe(DATASET.baseline.verifiedThrough)
  })

  it('says the figures are provisional when they are', () => {
    const data = JSON.parse(buildJson(DATASET, selections, totals))
    expect(data.baselineIsProvisional).toBe(DATASET.baseline.provisional)
  })

  it('names the project as independent rather than official', () => {
    const data = JSON.parse(buildJson(DATASET, selections, totals))
    expect(data.note).toMatch(/independent educational project/i)
    expect(data.note).toMatch(/not a publication of the state/i)
  })

  it('keeps recurring and one-time totals apart', () => {
    const data = JSON.parse(buildJson(DATASET, selections, totals))

    expect(data.results.nonrecurring.reserve).toBe(500_000_000)
    expect(data.results.recurring.reserve).toBe(0)
  })

  it('reports nothing as unscored while every option carries a sourced figure', () => {
    const data = JSON.parse(buildJson(DATASET, selections, totals))
    expect(data.results.decisionsChangedButNotScored).toEqual([])
  })

  it('records each changed decision and its verification status', () => {
    const data = JSON.parse(buildJson(DATASET, selections, totals))
    const row = data.choices.find((c: { decisionId: string }) => c.decisionId === 'unappropriated-balance')

    expect(row.choiceId).toBe('deposit-half')
    expect(row.verificationStatus).toBe('derived')
    expect(row.scored).toBe(true)
  })
})

describe('CSV export', () => {
  it('has one row per decision under the header', () => {
    const lines = buildCsv(DATASET, selections, totals).split('\n')
    const headerIndex = lines.findIndex((l) => l.startsWith('Decision ID'))

    expect(headerIndex).toBeGreaterThan(-1)
    expect(lines.length - headerIndex - 1).toBe(DATASET.decisions.length)
  })

  it('marks whether each row was counted in the balance', () => {
    const csv = buildCsv(DATASET, selections, totals)

    expect(csv).toContain('Counted in the balance')
    expect(csv).toContain('Arithmetic status')
    expect(csv).toContain('Provenance')

    // The interface collapses these behind a disclosure. The export may not
    // drop them, or the record a reader takes away is thinner than the card.
    expect(csv).toContain('Verification note')
    expect(csv).toContain('How it is calculated')
    expect(csv).toContain('What this would run into in practice')
    expect(csv).toContain('What would replace this scenario')
    expect(csv).toContain('Strongest concerns')
    expect(csv).toContain('Sources')
  })

  it('keeps every data row on the same number of columns', () => {
    // A comma inside an unquoted field would silently shift every later column,
    // which is the failure mode that makes a CSV export untrustworthy.
    const lines = buildCsv(DATASET, selections, totals).split('\n')
    const headerIndex = lines.findIndex((l) => l.startsWith('Decision ID'))
    const columns = countFields(lines[headerIndex]!)

    expect(columns).toBe(25)
    for (const line of lines.slice(headerIndex + 1)) {
      expect(countFields(line), line).toBe(columns)
    }
  })

  it('escapes a quote inside a field by doubling it', () => {
    expect(countFields('a,"b,c",d')).toBe(3)
    expect(countFields('a,"say ""hi"", please",d')).toBe(3)
  })
})

describe('export rows', () => {
  it('records the enacted policy for decisions left alone', () => {
    const rows = buildRows(DATASET, enactedSelections(DATASET))
    expect(rows.every((r) => r.isEnacted)).toBe(true)
  })

  it('splits recurring from one-time on every row', () => {
    const row = buildRows(DATASET, selections).find((r) => r.decisionId === 'unappropriated-balance')!

    expect(row.reserveNonrecurring).toBe(500_000_000)
    expect(row.reserveRecurring).toBe(0)
  })
})
