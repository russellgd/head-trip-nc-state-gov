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

  it('counts the four provenance classes', () => {
    const counts = provenanceSummary(DATASET)

    expect(counts.enacted).toBe(DATASET.decisions.length)
    expect(counts.documented).toBe(12)
    expect(counts.proposal).toBe(19)
    expect(counts.illustrative).toBe(32)
  })

  it('accounts for every option', () => {
    const counts = provenanceSummary(DATASET)
    const total = DATASET.decisions.reduce((n, d) => n + d.choices.length, 0)

    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(total)
  })
})

describe('illustrative allocation scenarios', () => {
  const illustrative = illustrativeOptions(DATASET)

  it('are the ones the replacement inventory tracks', () => {
    expect(illustrative).toHaveLength(32)
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

describe('published proposals', () => {
  const proposals = DATASET.decisions.flatMap((d) =>
    d.choices.filter((c) => c.provenance === 'proposal').map((c) => ({ decision: d, choice: c })),
  )

  it('cite the Governor’s Recommended Budget with a page reference', () => {
    // Searched rather than taken by position: a proposal may cite several
    // documents, and which comes first is not meaningful.
    for (const { decision, choice } of proposals) {
      const governorSource = choice.sources.find((s) => /Governor/i.test(s.title))
      expect(governorSource, `${decision.id}/${choice.id} cites no Governor source`).toBeDefined()
      expect(governorSource!.section, `${decision.id}/${choice.id}`).toMatch(/p\. \d+/)
    }
  })

  it('show the subtraction of the two published levels', () => {
    for (const { decision, choice } of proposals) {
      expect(choice.verification.derivation, `${decision.id}/${choice.id}`).toMatch(
        /less the enacted/i,
      )
    }
  })

  it('warn that the Governor’s own change columns use a different base', () => {
    // Adding the Governor's published change to an enacted figure would
    // double-count, and the option has to say so where a reader will see it.
    for (const { decision, choice } of proposals) {
      expect(choice.verification.note, `${decision.id}/${choice.id}`).toMatch(
        /certified budget|not from the budget the General Assembly/i,
      )
    }
  })

  it('carry no implementation note or replacement statement', () => {
    // Those belong to illustrative scenarios. A real proposal needs neither.
    for (const { decision, choice } of proposals) {
      expect(choice.implementationNote, `${decision.id}/${choice.id}`).toBeUndefined()
      expect(choice.replacementNeeded, `${decision.id}/${choice.id}`).toBeUndefined()
    }
  })

  it('leave both directions available on every agency-funding decision', () => {
    // Replacing an illustrative option must not remove a direction from the
    // decisions built on a percentage of an agency appropriation. A decision
    // built entirely from documented policy, such as the Opportunity
    // Scholarship moratorium, legitimately offers only the direction that was
    // actually proposed, and inventing an opposite would defeat the point.
    for (const decision of DATASET.decisions) {
      const hasIllustrative = decision.choices.some((c) => c.provenance === 'illustrative')
      if (!hasIllustrative) continue

      const effects = decision.choices
        .filter((c) => !c.isEnactedBaseline)
        .map((c) => c.spending.recurring + c.spending.nonrecurring)
      if (effects.every((e) => e === 0)) continue
      expect(effects.some((e) => e > 0), `${decision.id} has no option that spends more`).toBe(true)
      expect(effects.some((e) => e < 0), `${decision.id} has no option that spends less`).toBe(true)
    }
  })
})
