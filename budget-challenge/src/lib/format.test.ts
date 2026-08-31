import { describe, expect, it } from 'vitest'
import { describeBalance, describeDelta, formatApprox, formatDelta, formatDollars } from './format'

describe('formatDollars', () => {
  it('writes exact dollars with separators and no cents', () => {
    expect(formatDollars(34_374_286_763)).toBe('$34,374,286,763')
    expect(formatDollars(0)).toBe('$0')
    expect(formatDollars(-500_000_000)).toBe('-$500,000,000')
  })
})

describe('formatApprox', () => {
  it('rounds large figures for headline use', () => {
    expect(formatApprox(34_374_286_763)).toBe('$34.4 billion')
    expect(formatApprox(1_000_000_000)).toBe('$1.0 billion')
    expect(formatApprox(500_000_000)).toBe('$500 million')
    expect(formatApprox(0)).toBe('$0')
  })

  it('keeps the direction of negative figures', () => {
    expect(formatApprox(-1_500_000_000)).toBe('-$1.5 billion')
  })
})

describe('formatDelta', () => {
  it('always carries an explicit sign, so colour is never the only cue', () => {
    expect(formatDelta(40_000_000)).toBe('+$40,000,000')
    expect(formatDelta(-25_000_000)).toBe('-$25,000,000')
    expect(formatDelta(0)).toBe('no change')
  })
})

describe('screen reader text', () => {
  it('spells out the direction of a change in words', () => {
    expect(describeDelta(40_000_000)).toBe('an increase of $40,000,000')
    expect(describeDelta(-40_000_000)).toBe('a decrease of $40,000,000')
    expect(describeDelta(0, 'spending change')).toBe('no spending change')
  })

  it('distinguishes balanced, surplus, and deficit in words', () => {
    expect(describeBalance(0)).toMatch(/^Balanced\./)
    expect(describeBalance(1_000)).toMatch(/surplus/)
    expect(describeBalance(-1_000)).toMatch(/Out of balance/)
    expect(describeBalance(-1_000)).toContain('$1,000')
  })
})
