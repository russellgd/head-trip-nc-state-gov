/**
 * Downloadable summaries of a completed challenge.
 *
 * Both formats carry the same thing: the baseline the session started from,
 * every decision and the option chosen, and whether that option's dollars were
 * scored. Exporting an unscored choice without saying so would let a figure of
 * zero read as a finding rather than as an absence of data.
 */
import type { Dataset, Provenance } from '../data/types'
import { resolveChoice, type BudgetTotals, type Selections } from '../engine/budget'

/**
 * Provenance, spelled out for anyone reading the export without the app open.
 * An exported row that said only "derived" would tell a reader the arithmetic
 * was sound while leaving them to assume somebody proposed the policy.
 */
const PROVENANCE_LABELS: Record<Provenance, string> = {
  enacted: 'Enacted policy',
  documented: 'Documented alternative',
  proposal: 'Published proposal',
  illustrative: 'Illustrative allocation scenario (not proposed by any NC official or institution)',
}

export interface ExportRow {
  decisionId: string
  category: string
  decision: string
  choiceId: string
  choice: string
  isEnacted: boolean
  scored: boolean
  /** enacted | documented | proposal | illustrative. See Provenance in data/types. */
  provenance: string
  /** Plain-language form of the same thing, for a reader of the CSV. */
  provenanceLabel: string
  verificationStatus: string
  /**
   * Everything the card keeps behind the "Sources and calculation" disclosure.
   * The interface may collapse it; an export may not omit it, or the record a
   * reader takes away would be weaker than the one they were shown.
   */
  verificationNote: string
  derivation: string
  implementationNote: string
  replacementNeeded: string
  sources: string
  policyDescription: string
  affects: string
  benefits: string
  tradeoffs: string
  spendingRecurring: number
  spendingNonrecurring: number
  revenueRecurring: number
  revenueNonrecurring: number
  reserveRecurring: number
  reserveNonrecurring: number
}

export function buildRows(dataset: Dataset, selections: Selections): ExportRow[] {
  return dataset.decisions.map((decision) => {
    const choice = resolveChoice(decision, selections)
    return {
      decisionId: decision.id,
      category: decision.category,
      decision: decision.title,
      choiceId: choice.id,
      choice: choice.label,
      isEnacted: choice.isEnactedBaseline === true,
      scored: choice.verification.scored,
      provenance: choice.provenance,
      provenanceLabel: PROVENANCE_LABELS[choice.provenance],
      verificationStatus: choice.verification.status,
      verificationNote: choice.verification.note ?? '',
      derivation: choice.verification.derivation ?? '',
      implementationNote: choice.implementationNote ?? '',
      replacementNeeded: choice.replacementNeeded ?? '',
      sources: choice.sources
        .map((source) =>
          [source.title, source.section, source.url, `verified ${source.verifiedDate}`]
            .filter(Boolean)
            .join(' — '),
        )
        .join(' | '),
      policyDescription: choice.description,
      affects: choice.affects.join(' | '),
      benefits: choice.benefits.join(' | '),
      tradeoffs: choice.tradeoffs.join(' | '),
      spendingRecurring: choice.spending.recurring,
      spendingNonrecurring: choice.spending.nonrecurring,
      revenueRecurring: choice.revenue.recurring,
      revenueNonrecurring: choice.revenue.nonrecurring,
      reserveRecurring: choice.reserve.recurring,
      reserveNonrecurring: choice.reserve.nonrecurring,
    }
  })
}

/** How many of the visitor's selected options fall into each provenance class. */
function countByProvenance(dataset: Dataset, selections: Selections): Record<string, number> {
  const counts: Record<string, number> = {
    enacted: 0,
    documented: 0,
    proposal: 0,
    illustrative: 0,
  }
  for (const decision of dataset.decisions) {
    const choice = resolveChoice(decision, selections)
    counts[choice.provenance] = (counts[choice.provenance] ?? 0) + 1
  }
  return counts
}

export function buildJson(
  dataset: Dataset,
  selections: Selections,
  totals: BudgetTotals,
): string {
  return JSON.stringify(
    {
      product: 'The North Carolina Budget Challenge',
      note: 'An independent educational project. Not a publication of the State of North Carolina.',
      provenanceNotice:
        'Some choices reflect enacted or formally proposed policies. Others are illustrative ' +
        'percentage changes designed to demonstrate budget trade-offs. Illustrative choices ' +
        'should not be interpreted as proposals made by any North Carolina official or ' +
        'institution. Each row below carries a "provenance" field saying which it is.',
      exportedAt: new Date().toISOString(),
      datasetVersion: dataset.version,
      // Which challenge these answers were given to. Two exports with different
      // decision counts are not in conflict; they are different exercises.
      decisionsPresented: dataset.decisions.length,
      fiscalYear: dataset.baseline.fiscalYear,
      dataVerifiedThrough: dataset.baseline.verifiedThrough,
      baselineIsProvisional: dataset.baseline.provisional,
      baseline: {
        netAppropriations: dataset.baseline.netAppropriations,
        totalAvailability: dataset.baseline.totalAvailability,
        unappropriatedBalance: dataset.baseline.unappropriatedBalance,
      },
      results: {
        remainingBalance: totals.remainingBalance,
        structuralChange: totals.structuralChange,
        onetimeChange: totals.onetimeChange,
        // Stated as arithmetic, not as a verdict. Neither figure supports a
        // claim about the state's longer-run position: that would need
        // recurring revenue measured against recurring obligations across the
        // whole budget, and no source in this project separates them.
        balanceRestsOnOneTimeActions: totals.structuralChange < 0 && totals.onetimeChange > 0,
        spendingIncreases: totals.spendingIncreases,
        spendingReductions: totals.spendingReductions,
        revenueIncreases: totals.revenueIncreases,
        revenueReductions: totals.revenueReductions,
        reserveDeposits: totals.reserveDeposits,
        reserveWithdrawals: totals.reserveWithdrawals,
        recurring: {
          spending: totals.spending.recurring,
          revenue: totals.revenue.recurring,
          reserve: totals.reserve.recurring,
        },
        nonrecurring: {
          spending: totals.spending.nonrecurring,
          revenue: totals.revenue.nonrecurring,
          reserve: totals.reserve.nonrecurring,
        },
        decisionsChanged: totals.changedDecisionIds.length,
        decisionsChangedButNotScored: totals.unscoredSelectionIds,
        choicesByProvenance: countByProvenance(dataset, selections),
      },
      byCategory: totals.byCategory,
      choices: buildRows(dataset, selections),
    },
    null,
    2,
  )
}

const CSV_HEADERS: Array<[keyof ExportRow, string]> = [
  ['decisionId', 'Decision ID'],
  ['category', 'Budget area'],
  ['decision', 'Decision'],
  ['choiceId', 'Option ID'],
  ['choice', 'Option chosen'],
  ['isEnacted', 'Is the enacted policy'],
  ['scored', 'Counted in the balance'],
  ['provenance', 'Provenance'],
  ['provenanceLabel', 'What that means'],
  ['verificationStatus', 'Arithmetic status'],
  ['policyDescription', 'What the option does'],
  ['verificationNote', 'Verification note'],
  ['derivation', 'How it is calculated'],
  ['implementationNote', 'What this would run into in practice'],
  ['replacementNeeded', 'What would replace this scenario'],
  ['affects', 'Who or what this affects'],
  ['benefits', 'Strongest argument in favour'],
  ['tradeoffs', 'Strongest concerns'],
  ['sources', 'Sources'],
  ['spendingRecurring', 'Spending change, recurring'],
  ['spendingNonrecurring', 'Spending change, one-time'],
  ['revenueRecurring', 'Revenue change, recurring'],
  ['revenueNonrecurring', 'Revenue change, one-time'],
  ['reserveRecurring', 'Reserve change, recurring'],
  ['reserveNonrecurring', 'Reserve change, one-time'],
]

/** Quote a CSV field, doubling any embedded quotes. */
function csvCell(value: string | number | boolean): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function buildCsv(
  dataset: Dataset,
  selections: Selections,
  totals: BudgetTotals,
): string {
  const lines: string[] = []

  lines.push(csvCell('The North Carolina Budget Challenge'))
  lines.push(
    csvCell(
      'Some choices reflect enacted or formally proposed policies. Others are illustrative ' +
        'percentage changes designed to demonstrate budget trade-offs. Illustrative choices ' +
        'should not be interpreted as proposals made by any North Carolina official or institution.',
    ),
  )
  lines.push(csvCell(`Fiscal year,${dataset.baseline.fiscalYear}`))
  lines.push(`Data verified through,${csvCell(dataset.baseline.verifiedThrough)}`)
  lines.push(`Dataset version,${csvCell(dataset.version)}`)
  lines.push(`Decisions presented,${dataset.decisions.length}`)
  lines.push(`Starting unappropriated balance,${totals.startingBalance}`)
  lines.push(`Remaining balance,${totals.remainingBalance}`)
  lines.push(`Change in recurring position,${totals.structuralChange}`)
  lines.push(`Change from one-time actions,${totals.onetimeChange}`)
  lines.push(
    `Balance rests partly on one-time actions,${
      totals.structuralChange < 0 && totals.onetimeChange > 0
    }`,
  )
  lines.push('')

  const byProvenance = countByProvenance(dataset, selections)
  lines.push('Choices selected by provenance')
  for (const [key, label] of Object.entries(PROVENANCE_LABELS) as Array<[Provenance, string]>) {
    lines.push(`${csvCell(label)},${byProvenance[key] ?? 0}`)
  }
  lines.push('')

  lines.push(CSV_HEADERS.map(([, label]) => csvCell(label)).join(','))
  for (const row of buildRows(dataset, selections)) {
    lines.push(CSV_HEADERS.map(([key]) => csvCell(row[key])).join(','))
  }

  return lines.join('\n')
}

/** Hand the visitor a file. Nothing leaves the browser. */
export function downloadFile(filename: string, contents: string, mimeType: string): void {
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
