import { describe, expect, it } from 'vitest'
import { DATASET } from './index'
import { CATEGORIES } from './categories'
import { collectSources, errorsOnly, validateDataset } from './validate'

describe('dataset integrity', () => {
  it('passes every validation rule', () => {
    const errors = errorsOnly(validateDataset(DATASET))
    expect(errors, JSON.stringify(errors, null, 2)).toEqual([])
  })

  it('offers between 20 and 30 decisions', () => {
    expect(DATASET.decisions.length).toBeGreaterThanOrEqual(20)
    expect(DATASET.decisions.length).toBeLessThanOrEqual(30)
  })

  it('covers all twelve budget areas', () => {
    const used = new Set(DATASET.decisions.map((d) => d.category))
    for (const category of CATEGORIES) {
      expect(used, `no decision in category "${category.id}"`).toContain(category.id)
    }
    expect(CATEGORIES).toHaveLength(12)
  })

  it('gives every decision a question and an enacted baseline description', () => {
    for (const decision of DATASET.decisions) {
      expect(decision.question.trim(), decision.id).not.toBe('')
      expect(decision.enactedBaseline.trim(), decision.id).not.toBe('')
      expect(decision.title.trim(), decision.id).not.toBe('')
    }
  })

  it('offers two to four mutually exclusive options per decision', () => {
    for (const decision of DATASET.decisions) {
      expect(decision.choices.length, decision.id).toBeGreaterThanOrEqual(2)
      expect(decision.choices.length, decision.id).toBeLessThanOrEqual(4)

      const ids = decision.choices.map((c) => c.id)
      expect(new Set(ids).size, `${decision.id} has duplicate choice ids`).toBe(ids.length)
    }
  })

  it('offers exactly one enacted option per decision, with zero impact', () => {
    for (const decision of DATASET.decisions) {
      const enacted = decision.choices.filter((c) => c.isEnactedBaseline)
      expect(enacted, decision.id).toHaveLength(1)

      const choice = enacted[0]!
      for (const bucket of [choice.spending, choice.revenue, choice.reserve]) {
        expect(bucket.recurring, decision.id).toBe(0)
        expect(bucket.nonrecurring, decision.id).toBe(0)
      }
    }
  })
})

describe('no unsupported dollar amount can reach the running balance', () => {
  it('scores only figures that are verified or derived', () => {
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        if (choice.verification.scored) {
          expect(
            choice.verification.status,
            `${decision.id}/${choice.id} is scored`,
          ).toMatch(/^(verified|derived)$/)
        }
      }
    }
  })

  it('never scores a pending or illustrative figure', () => {
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        if (choice.verification.status === 'pending' || choice.verification.status === 'illustrative') {
          expect(choice.verification.scored, `${decision.id}/${choice.id}`).toBe(false)
        }
      }
    }
  })

  it('requires a citation behind every scored figure that moves money', () => {
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        const moves =
          choice.spending.recurring !== 0 ||
          choice.spending.nonrecurring !== 0 ||
          choice.revenue.recurring !== 0 ||
          choice.revenue.nonrecurring !== 0 ||
          choice.reserve.recurring !== 0 ||
          choice.reserve.nonrecurring !== 0

        if (moves && choice.verification.scored) {
          expect(
            choice.sources.length,
            `${decision.id}/${choice.id} moves money with no source`,
          ).toBeGreaterThan(0)
        }
      }
    }
  })

  it('shows the arithmetic behind every derived figure', () => {
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        if (choice.verification.status === 'derived') {
          expect(choice.verification.derivation, `${decision.id}/${choice.id}`).toBeTruthy()
        }
      }
    }
  })

  it('carries a zero amount on every unscored option, so nothing leaks if scoring is switched on by mistake', () => {
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        if (choice.verification.scored) continue
        for (const bucket of [choice.spending, choice.revenue, choice.reserve]) {
          expect(bucket.recurring, `${decision.id}/${choice.id}`).toBe(0)
          expect(bucket.nonrecurring, `${decision.id}/${choice.id}`).toBe(0)
        }
      }
    }
  })
})

describe('amounts', () => {
  it('stores every amount as integer dollars', () => {
    const amounts: Array<[string, number]> = [
      ['baseline.netAppropriations', DATASET.baseline.netAppropriations],
      ['baseline.totalAvailability', DATASET.baseline.totalAvailability],
      ['baseline.unappropriatedBalance', DATASET.baseline.unappropriatedBalance],
    ]

    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        for (const [name, bucket] of [
          ['spending', choice.spending],
          ['revenue', choice.revenue],
          ['reserve', choice.reserve],
        ] as const) {
          amounts.push([`${decision.id}/${choice.id}.${name}.recurring`, bucket.recurring])
          amounts.push([`${decision.id}/${choice.id}.${name}.nonrecurring`, bucket.nonrecurring])
        }
      }
    }

    for (const [where, value] of amounts) {
      expect(Number.isInteger(value), `${where} = ${value}`).toBe(true)
    }
  })

  it('uses the enacted anchors the project brief specifies', () => {
    expect(DATASET.baseline.netAppropriations).toBe(34_374_286_763)
    expect(DATASET.baseline.totalAvailability).toBe(35_374_286_763)
    expect(DATASET.baseline.unappropriatedBalance).toBe(1_000_000_000)
  })
})

describe('citations', () => {
  it('cites only official North Carolina government hosts', () => {
    const allowed = new Set(['ncleg.gov', 'www.ncleg.gov', 'sites.ncleg.gov', 'webservices.ncleg.gov', 'osbm.nc.gov', 'www.osbm.nc.gov', 'nc.gov', 'www.nc.gov', 'ncdor.gov', 'www.ncdor.gov'])

    for (const source of collectSources(DATASET)) {
      expect(allowed, source.url).toContain(new URL(source.url).hostname)
    }
  })

  it('gives every citation a title, a section, and a verified-through date', () => {
    for (const source of collectSources(DATASET)) {
      expect(source.title.trim()).not.toBe('')
      expect(source.section.trim(), source.title).not.toBe('')
      expect(source.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('cites a source for the baseline itself', () => {
    expect(DATASET.baseline.sources.length).toBeGreaterThan(0)
  })
})

describe('neutrality', () => {
  it('gives every alternative both an argument in favor and a trade-off', () => {
    for (const decision of DATASET.decisions) {
      for (const choice of decision.choices) {
        if (choice.isEnactedBaseline) continue
        expect(choice.benefits.length, `${decision.id}/${choice.id}`).toBeGreaterThan(0)
        expect(choice.tradeoffs.length, `${decision.id}/${choice.id}`).toBeGreaterThan(0)
      }
    }
  })

  it('avoids ideological labels in user-facing option text', () => {
    // The results page describes budget choices, never the person making them.
    const labels = /\b(liberal|conservative|progressive|left-wing|right-wing|partisan|Democrat|Republican)\b/i

    for (const decision of DATASET.decisions) {
      const text = [
        decision.title,
        decision.question,
        decision.enactedBaseline,
        decision.background ?? '',
        ...decision.choices.flatMap((c) => [
          c.label,
          c.description,
          ...c.benefits,
          ...c.tradeoffs,
          ...c.affects,
        ]),
      ].join(' ')

      expect(text, decision.id).not.toMatch(labels)
    }
  })
})
