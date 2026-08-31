/**
 * Money formatting.
 *
 * Two rules run through all of this. Amounts never appear without a sign or a
 * word saying which direction they go, because a bare number in a budget is
 * ambiguous. And nothing relies on colour alone to say whether a figure is a
 * gain or a loss, so every formatted delta carries a "+" or a minus sign, and
 * screen-reader text spells the direction out in words.
 */

const FULL = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** Exact dollars: "$34,374,286,763". Use wherever precision matters. */
export const formatDollars = (amount: number): string => FULL.format(amount)

/**
 * Rounded for headlines: "$34.4 billion", "$500 million", "$0".
 * Never use where a reader might reasonably add the figures up.
 */
export function formatApprox(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs === 0) return '$0'
  if (abs >= 1_000_000_000) {
    const billions = abs / 1_000_000_000
    const digits = billions >= 100 ? 0 : 1
    return `${sign}$${billions.toFixed(digits)} billion`
  }
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000
    const digits = millions >= 100 ? 0 : millions >= 10 ? 1 : 1
    return `${sign}$${Number(millions.toFixed(digits))} million`
  }
  return FULL.format(amount)
}

/** A signed change: "+$40,000,000", "-$25,000,000", "no change". */
export function formatDelta(amount: number): string {
  if (amount === 0) return 'no change'
  const sign = amount > 0 ? '+' : '-'
  return `${sign}${FULL.format(Math.abs(amount))}`
}

/**
 * The same change spelled out for assistive technology, where "+" is easy to
 * miss and a minus sign may be read as a hyphen.
 */
export function describeDelta(amount: number, noun = 'change'): string {
  if (amount === 0) return `no ${noun}`
  const direction = amount > 0 ? 'an increase of' : 'a decrease of'
  return `${direction} ${FULL.format(Math.abs(amount))}`
}

/** How the running balance should be read aloud. */
export function describeBalance(remaining: number): string {
  if (remaining === 0) {
    return 'Balanced. The remaining balance is exactly zero dollars.'
  }
  if (remaining > 0) {
    return `Balanced with a surplus. ${FULL.format(remaining)} remains unappropriated.`
  }
  return `Out of balance. Spending and revenue choices exceed available funds by ${FULL.format(
    Math.abs(remaining),
  )}.`
}
