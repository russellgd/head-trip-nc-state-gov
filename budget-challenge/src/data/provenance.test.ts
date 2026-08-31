import { describe, expect, it } from 'vitest'
import { DATASET } from './index'
import { illustrativeOptions, provenanceSummary } from './validate'
import { PROVENANCE, PROVENANCE_MEANING } from '../components/ProvenanceBadge'
import type { Provenance } from './types'

const allChoices = DATASET.decisions.flatMap((d) => d.choices.map((c) => ({ decision: d, choice: c })))

describe('provenance is recorded on every option', () => {
  it('gives every option one of the four provenance values', () => {
    const valid: Provenance[] = ['enacted', 'documented', 'proposal', 'illustrative']
    for (const { decision, choice } of allChoices) {
      expect(valid, `${decision.id}/${choice.id}`).toContain(choice.provenance)
    }
  })

  it('marks exactly the enacted baseline as enacted', () => {
    for (const { decision, choice } of allChoices) {
      expect(choice.provenance === 'enacted', `${decision.id}/${choice.id}`).toBe(
        choice.isEnactedBaseline === true,
      )
    }
  })

  it('counts 30 enacted, 12 documented and 46 illustrative options', () => {
    const counts = provenanceSummary(DATASET)

    expect(counts.enacted).toBe(DATASET.decisions.length)
    expect(counts.illustrative).toBe(46)
    expect(counts.documented).toBe(12)
    expect(counts.proposal).toBe(0)
  })
})

describe('illustrative allocation scenarios', () => {
  const illustrative = illustrativeOptions(DATASET)

  it('are the 46 the replacement inventory tracks', () => {
    expect(illustrative).toHaveLength(46)
  })

  it('each show the arithmetic behind the figure', () => {
    for (const { decision, choice } of illustrative) {
      expect(choice.verification.derivation, `${decision.id}/${choice.id}`).toBeTruthy()
    }
  })

  it('each say plainly that nobody proposed them', () => {
    // The disclaimer travels with the figure, so it survives being read out of
    // context in an export or a printed report.
    for (const { decision, choice } of illustrative) {
      const text = `${choice.verification.derivation} ${choice.verification.note}`
      expect(text, `${decision.id}/${choice.id}`).toMatch(
        /no North Carolina official or institution proposed it|scenario constructed for this exercise/i,
      )
    }
  })

  it('each state what the change would run into in practice', () => {
    // Guards the rule that a uniform percentage must never be presented as
    // something that could simply be applied.
    for (const { decision, choice } of illustrative) {
      expect(choice.implementationNote, `${decision.id}/${choice.id}`).toBeTruthy()
      expect((choice.implementationNote ?? '').length).toBeGreaterThan(80)
    }
  })

  it('each name the document that would replace them', () => {
    for (const { decision, choice } of illustrative) {
      expect(choice.replacementNeeded, `${decision.id}/${choice.id}`).toBeTruthy()
    }
  })

  it('are never described as proposals, policies adopted, or recommendations', () => {
    const asProposal =
      /\b(is|are)\s+(a\s+)?(proposal|proposed|recommendation|recommended)\b|\bproposed by\b|\bdocumented (policy )?proposal\b/i

    for (const { decision, choice } of illustrative) {
      const surface = [choice.label, choice.description].join(' ')
      expect(surface, `${decision.id}/${choice.id}`).not.toMatch(asProposal)
    }
  })
})

describe('the labels shown to a reader', () => {
  it('calls illustrative options "Illustrative allocation scenario" consistently', () => {
    expect(PROVENANCE.illustrative.label).toBe('Illustrative allocation scenario')
  })

  it('states in the legend that no official or institution proposed them', () => {
    expect(PROVENANCE_MEANING.illustrative).toMatch(
      /not proposed by any North Carolina official or institution/i,
    )
  })

  it('distinguishes the three classes by glyph as well as colour', () => {
    const glyphs = (['enacted', 'documented', 'illustrative'] as Provenance[]).map(
      (p) => PROVENANCE[p].glyph,
    )
    expect(new Set(glyphs).size).toBe(3)
  })

  it('distinguishes them by wording as well as glyph', () => {
    const labels = (['enacted', 'documented', 'illustrative'] as Provenance[]).map(
      (p) => PROVENANCE[p].label,
    )
    expect(new Set(labels).size).toBe(3)
  })
})
