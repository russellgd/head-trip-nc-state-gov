import { describe, expect, it } from 'vitest'
import {
  AGENCY_APPROPRIATIONS,
  AVAILABILITY,
  CATEGORY_NET_APPROPRIATIONS,
  ENACTED_TOTALS,
  RESERVATIONS,
} from './enacted'
import { BASELINE } from './baseline'
import { CATEGORIES } from './categories'

const sum = (numbers: number[]): number => numbers.reduce((a, b) => a + b, 0)

/**
 * These tests are the guard against a transcription error in the figures taken
 * from S.L. 2026-41. Each one re-derives a total the act itself prints. A typo
 * in any single agency line breaks at least one of them.
 */
describe('the agency appropriations schedule', () => {
  it('carries every agency line from Section 2.1(a)', () => {
    expect(AGENCY_APPROPRIATIONS).toHaveLength(78)
  })

  it('nets receipts out of requirements on every line', () => {
    for (const agency of AGENCY_APPROPRIATIONS) {
      expect(
        agency.requirements - agency.receipts,
        `${agency.agency}: ${agency.requirements} - ${agency.receipts}`,
      ).toBe(agency.netAppropriation)
    }
  })

  it('sums to the total net appropriation the act states', () => {
    expect(sum(AGENCY_APPROPRIATIONS.map((a) => a.netAppropriation))).toBe(
      ENACTED_TOTALS.netAppropriation,
    )
  })

  it('sums to the total requirements and receipts the act states', () => {
    expect(sum(AGENCY_APPROPRIATIONS.map((a) => a.requirements))).toBe(ENACTED_TOTALS.requirements)
    expect(sum(AGENCY_APPROPRIATIONS.map((a) => a.receipts))).toBe(ENACTED_TOTALS.receipts)
  })

  it('agrees with the baseline anchor for net appropriations', () => {
    expect(ENACTED_TOTALS.netAppropriation).toBe(BASELINE.netAppropriations)
    expect(ENACTED_TOTALS.netAppropriation).toBe(34_374_286_763)
  })

  it('stores every amount as integer dollars', () => {
    for (const agency of AGENCY_APPROPRIATIONS) {
      expect(Number.isInteger(agency.requirements)).toBe(true)
      expect(Number.isInteger(agency.receipts)).toBe(true)
      expect(Number.isInteger(agency.netAppropriation)).toBe(true)
    }
  })
})

describe('mapping agencies onto budget areas', () => {
  it('assigns every agency to exactly one area', () => {
    const known = new Set(CATEGORIES.map((c) => c.id))
    for (const agency of AGENCY_APPROPRIATIONS) {
      expect(known, `${agency.agency} -> ${agency.category}`).toContain(agency.category)
    }
  })

  it('produces area totals that sum back to the act’s grand total', () => {
    expect(sum(Object.values(CATEGORY_NET_APPROPRIATIONS) as number[])).toBe(
      ENACTED_TOTALS.netAppropriation,
    )
  })

  it('gives each area the sum of its own agency lines', () => {
    for (const [category, total] of Object.entries(CATEGORY_NET_APPROPRIATIONS)) {
      const fromAgencies = sum(
        AGENCY_APPROPRIATIONS.filter((a) => a.category === category).map((a) => a.netAppropriation),
      )
      expect(fromAgencies, category).toBe(total)
    }
  })

  it('shows the same totals on the category records the chart reads', () => {
    for (const category of CATEGORIES) {
      const expected = CATEGORY_NET_APPROPRIATIONS[category.id] ?? null
      expect(category.enactedNetAppropriation, category.id).toBe(expected)
    }
  })
})

describe('reservations of revenue', () => {
  it('sums the statutory reservations to the subtotal the act states', () => {
    const statutory = sum(
      RESERVATIONS.filter((r) => r.kind === 'statutory').map((r) => r.amount),
    )
    expect(statutory).toBe(AVAILABILITY.totalStatutoryReservations)
    expect(statutory).toBe(1_152_175_000)
  })

  it('sums the discretionary reservations to the subtotal the act states', () => {
    const discretionary = sum(
      RESERVATIONS.filter((r) => r.kind === 'discretionary').map((r) => r.amount),
    )
    expect(discretionary).toBe(AVAILABILITY.totalDiscretionaryReservations)
    expect(discretionary).toBe(3_017_385_236)
  })

  it('cites a section of the act for each reservation', () => {
    for (const reservation of RESERVATIONS) {
      expect(reservation.section, reservation.id).toMatch(/Section 2\.2/)
      expect(Number.isInteger(reservation.amount)).toBe(true)
    }
  })
})

describe('the availability statement', () => {
  it('reconciles line by line to the revised total availability', () => {
    // Prior year-end balance, plus the consensus forecast and the act's
    // adjustments to it, less both kinds of reservation.
    const derived =
      AVAILABILITY.priorYearEndFundBalance +
      AVAILABILITY.consensusTaxRevenue +
      AVAILABILITY.consensusNonTaxRevenue +
      AVAILABILITY.adjustmentsToTaxRevenue +
      AVAILABILITY.adjustmentsToNonTaxRevenue -
      AVAILABILITY.totalStatutoryReservations -
      AVAILABILITY.totalDiscretionaryReservations

    expect(derived).toBe(AVAILABILITY.revisedTotalAvailability)
    expect(derived).toBe(35_374_286_763)
  })

  it('agrees with the baseline anchors', () => {
    expect(AVAILABILITY.revisedTotalAvailability).toBe(BASELINE.totalAvailability)
    expect(BASELINE.totalAvailability - BASELINE.netAppropriations).toBe(
      BASELINE.unappropriatedBalance,
    )
  })
})
