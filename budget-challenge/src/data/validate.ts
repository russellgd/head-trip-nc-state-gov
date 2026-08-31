/**
 * Dataset invariants.
 *
 * These rules are the project's guard against the failure mode that matters
 * most for a civic education tool: a number appearing on screen that no
 * official document supports. `validateDataset` runs in the test suite and in
 * development, so a data edit that breaks an invariant fails loudly.
 */
import type { Dataset, Choice, Source } from './types'

export interface ValidationIssue {
  level: 'error' | 'warning'
  where: string
  message: string
}

/** Official North Carolina government hosts. Citations must live on one of these. */
const OFFICIAL_HOSTS = [
  'ncleg.gov',
  'www.ncleg.gov',
  'sites.ncleg.gov',
  'webservices.ncleg.gov',
  'osbm.nc.gov',
  'www.osbm.nc.gov',
  'nc.gov',
  'www.nc.gov',
  'ncdor.gov',
  'www.ncdor.gov',
]

const isIntegerDollars = (n: number): boolean => Number.isInteger(n)

function checkSource(source: Source, where: string, issues: ValidationIssue[]): void {
  if (!source.title.trim()) {
    issues.push({ level: 'error', where, message: 'Source is missing a document title.' })
  }
  if (!source.url.trim()) {
    issues.push({ level: 'error', where, message: 'Source is missing a URL.' })
    return
  }
  let host = ''
  try {
    host = new URL(source.url).hostname
  } catch {
    issues.push({ level: 'error', where, message: `Source URL is not a valid URL: ${source.url}` })
    return
  }
  if (!OFFICIAL_HOSTS.includes(host)) {
    issues.push({
      level: 'error',
      where,
      message: `Source host "${host}" is not an official North Carolina government host.`,
    })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(source.verifiedDate)) {
    issues.push({
      level: 'error',
      where,
      message: `Source is missing a valid "verified through" date (got "${source.verifiedDate}").`,
    })
  }
}

function checkChoice(choice: Choice, where: string, issues: ValidationIssue[]): void {
  const amounts = [
    ['spending.recurring', choice.spending.recurring],
    ['spending.nonrecurring', choice.spending.nonrecurring],
    ['revenue.recurring', choice.revenue.recurring],
    ['revenue.nonrecurring', choice.revenue.nonrecurring],
    ['reserve.recurring', choice.reserve.recurring],
    ['reserve.nonrecurring', choice.reserve.nonrecurring],
  ] as const

  for (const [field, value] of amounts) {
    if (!isIntegerDollars(value)) {
      issues.push({
        level: 'error',
        where,
        message: `${field} must be an integer number of dollars, got ${value}.`,
      })
    }
  }

  const hasMoney = amounts.some(([, value]) => value !== 0)
  const { status, scored } = choice.verification

  // The central rule: only figures traceable to an official document, or
  // arithmetic performed on such figures, may move the running balance.
  if (scored && status !== 'verified' && status !== 'derived') {
    issues.push({
      level: 'error',
      where,
      message: `A choice with verification status "${status}" must not be scored.`,
    })
  }

  if (status === 'derived' && !choice.verification.derivation) {
    issues.push({
      level: 'error',
      where,
      message: 'A "derived" figure must show its arithmetic in verification.derivation.',
    })
  }

  if (hasMoney && scored && choice.sources.length === 0) {
    issues.push({
      level: 'error',
      where,
      message: 'A scored choice that moves money must cite at least one source.',
    })
  }

  if (choice.isEnactedBaseline && hasMoney) {
    issues.push({
      level: 'error',
      where,
      message:
        'The enacted-baseline choice must have zero impact; it is the point all deltas are measured from.',
    })
  }

  if (!choice.description.trim()) {
    issues.push({ level: 'error', where, message: 'Choice is missing a description.' })
  }

  // A choice with no argument on either side reads as editorializing by omission.
  if (!choice.isEnactedBaseline) {
    if (choice.benefits.length === 0) {
      issues.push({ level: 'warning', where, message: 'Choice lists no argument in favor.' })
    }
    if (choice.tradeoffs.length === 0) {
      issues.push({ level: 'warning', where, message: 'Choice lists no trade-off or concern.' })
    }
  }

  for (const [i, source] of choice.sources.entries()) {
    checkSource(source, `${where} > source[${i}]`, issues)
  }
}

export function validateDataset(dataset: Dataset): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const { baseline } = dataset
  for (const [field, value] of [
    ['netAppropriations', baseline.netAppropriations],
    ['totalAvailability', baseline.totalAvailability],
    ['unappropriatedBalance', baseline.unappropriatedBalance],
  ] as const) {
    if (!isIntegerDollars(value)) {
      issues.push({
        level: 'error',
        where: `baseline.${field}`,
        message: `Baseline ${field} must be an integer number of dollars.`,
      })
    }
  }

  // The three anchors have to describe the same budget: what is available, less
  // what is appropriated, is what remains unappropriated.
  const impliedRemainder = baseline.totalAvailability - baseline.netAppropriations
  if (impliedRemainder !== baseline.unappropriatedBalance) {
    issues.push({
      level: 'error',
      where: 'baseline',
      message:
        `Baseline does not reconcile: availability (${baseline.totalAvailability}) ` +
        `less net appropriations (${baseline.netAppropriations}) is ${impliedRemainder}, ` +
        `but unappropriatedBalance is ${baseline.unappropriatedBalance}.`,
    })
  }

  for (const [i, source] of baseline.sources.entries()) {
    checkSource(source, `baseline > source[${i}]`, issues)
  }
  if (baseline.sources.length === 0) {
    issues.push({ level: 'error', where: 'baseline', message: 'Baseline must cite its sources.' })
  }

  const categoryIds = new Set(dataset.categories.map((c) => c.id))
  if (categoryIds.size !== dataset.categories.length) {
    issues.push({ level: 'error', where: 'categories', message: 'Duplicate category id.' })
  }

  for (const category of dataset.categories) {
    if (
      category.enactedNetAppropriation !== null &&
      !isIntegerDollars(category.enactedNetAppropriation)
    ) {
      issues.push({
        level: 'error',
        where: `category "${category.id}"`,
        message: 'enactedNetAppropriation must be an integer number of dollars or null.',
      })
    }
    if (category.enactedNetAppropriation !== null && category.sources.length === 0) {
      issues.push({
        level: 'error',
        where: `category "${category.id}"`,
        message: 'A category that states an appropriation amount must cite a source.',
      })
    }
    for (const [i, source] of category.sources.entries()) {
      checkSource(source, `category "${category.id}" > source[${i}]`, issues)
    }
  }

  const decisionIds = new Set<string>()
  for (const decision of dataset.decisions) {
    const where = `decision "${decision.id}"`

    if (decisionIds.has(decision.id)) {
      issues.push({ level: 'error', where, message: 'Duplicate decision id.' })
    }
    decisionIds.add(decision.id)

    if (!categoryIds.has(decision.category)) {
      issues.push({ level: 'error', where, message: `Unknown category "${decision.category}".` })
    }

    const baselines = decision.choices.filter((c) => c.isEnactedBaseline)
    if (baselines.length !== 1) {
      issues.push({
        level: 'error',
        where,
        message: `Expected exactly one choice marked isEnactedBaseline, found ${baselines.length}.`,
      })
    }

    if (decision.choices.length < 2 || decision.choices.length > 4) {
      issues.push({
        level: 'error',
        where,
        message: `Expected 2-4 options, found ${decision.choices.length}.`,
      })
    }

    const choiceIds = new Set<string>()
    for (const choice of decision.choices) {
      if (choiceIds.has(choice.id)) {
        issues.push({ level: 'error', where, message: `Duplicate choice id "${choice.id}".` })
      }
      choiceIds.add(choice.id)
      checkChoice(choice, `${where} > choice "${choice.id}"`, issues)
    }
  }

  return issues
}

export const errorsOnly = (issues: ValidationIssue[]): ValidationIssue[] =>
  issues.filter((i) => i.level === 'error')

/** Every distinct source across the dataset, for the source ledger page. */
export function collectSources(dataset: Dataset): Source[] {
  const byUrl = new Map<string, Source>()
  const add = (s: Source) => {
    if (!byUrl.has(s.url)) byUrl.set(s.url, s)
  }
  dataset.baseline.sources.forEach(add)
  dataset.categories.forEach((c) => c.sources.forEach(add))
  dataset.decisions.forEach((d) => d.choices.forEach((c) => c.sources.forEach(add)))
  return [...byUrl.values()].sort((a, b) => a.title.localeCompare(b.title))
}

/** Counts used by the data-integrity panel on the methodology page. */
export function verificationSummary(dataset: Dataset): Record<string, number> {
  const counts: Record<string, number> = { verified: 0, derived: 0, pending: 0, illustrative: 0 }
  for (const decision of dataset.decisions) {
    for (const choice of decision.choices) {
      counts[choice.verification.status] = (counts[choice.verification.status] ?? 0) + 1
    }
  }
  return counts
}
