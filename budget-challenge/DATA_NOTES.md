# Data notes

What is settled, what is not, and what was deliberately left out. Written so that anyone using this
in a classroom or a workshop can judge the exercise fairly, and so that whoever picks the data work
up next knows exactly where it stands.

**Data verified through:** 2026-08-31
**Dataset version:** 0.1.0

---

## 1. The blocking limitation

**No figure in this build was read from a primary source document.**

The environment this version was built in blocks outbound requests to every host the project needs:

| Host | Status |
| --- | --- |
| `www.ncleg.gov` | blocked by network egress policy |
| `sites.ncleg.gov` | blocked |
| `webservices.ncleg.gov` | blocked |
| `www.osbm.nc.gov` | blocked |

General internet access works, so this is a targeted policy, not an outage. Web search results were
available and were used to confirm that the documents exist and to establish their bill numbers, but
search results are model-generated summaries of snippets. One such summary already returned a
General Fund availability figure that conflicted with the enacted anchors, which is precisely why
they are not treated as a source for dollar amounts here.

The consequence: the baseline anchors are carried as provisional, and almost every policy option is
`pending` and unscored.

### What was confirmed, and how

| Item | How it was established | Confidence |
| --- | --- | --- |
| FY 2026-27 net appropriations, $34,374,286,763 | Supplied in the project brief; independently corroborated by web search against S.L. 2026-41 | Good, but not read from the act |
| Total availability, $35,374,286,763 | Supplied in the brief; reconciles exactly with the other two anchors | Arithmetically consistent, not read from the act |
| Unappropriated balance, $1,000,000,000 | Supplied in the brief; equals availability less net appropriations | Arithmetically consistent, not read from the act |
| S.L. 2026-41 is SB 257, the Current Operations Appropriations Act of 2026 | Web search | Good |
| S.L. 2026-42 is House Bill 56, Budget Technical Corrections | Web search | Good |
| S.L. 2026-61 is House Bill 268, 2026 Budget Technical Corrections II | Web search | Good |

### What is not confirmed

- **Whether the anchors survive the technical corrections.** S.L. 2026-42 and S.L. 2026-61 have not
  been read. A correction can move an appropriation without changing the headline total, so the
  top-line figures may hold while the detail beneath them shifts.
- **Net appropriations by budget area.** None of the twelve areas has a confirmed amount. The
  overview chart therefore has nothing to draw and says so; areas are listed as "not yet verified"
  rather than shown as zero, because zero would be a claim.
- **Every policy option's fiscal impact**, except the derived reserve options described below.
- **The enacted budget's own recurring position.** Not among the published anchors, so the app
  reports a *change* in recurring position rather than an absolute structural balance.
- **Whether every source URL resolves.** The URLs follow the General Assembly's documented patterns
  and appeared in search results, but they could not be requested from this environment. Check them
  before publishing.

---

## 2. What *is* scored, and why that is defensible

Two options, both in **The Unappropriated Balance** decision, move the balance:

| Option | Amount | Derivation |
| --- | --- | --- |
| Deposit the full balance into the Savings Reserve | $1,000,000,000 | The enacted unappropriated balance itself |
| Deposit half the balance into the Savings Reserve | $500,000,000 | $1,000,000,000 ÷ 2 |

These are `derived`, not `verified`: the amount is arithmetic performed on a figure that is itself
one of the baseline anchors, and the arithmetic is shown to the reader on the option. Moving a known
$1,000,000,000 is a calculation, not a forecast of what a policy would cost. Every other option would
require a fiscal estimate from a document, and is therefore unscored.

**A consequence worth knowing before teaching with this version:** because no option increases
spending, a visitor cannot currently produce a deficit through the interface. The deficit path is
fully implemented, warned about, and tested at the component level, but it is unreachable from the
data until spending options carry amounts.

---

## 3. Open questions to resolve with the documents in hand

1. Do the three anchors match S.L. 2026-41 **as amended** by S.L. 2026-42 and S.L. 2026-61? Record
   which document each final figure comes from.
2. What is the net appropriation for each of the twelve budget areas, and do the twelve sum to
   $34,374,286,763? If the official groupings do not map cleanly onto these twelve areas, the
   categories should be changed to match the documents rather than the documents summarised to fit.
3. For each `pending` option, does the Governor's Recommended Budget carry a costed version, and at
   what recurring/nonrecurring split?
4. Which revenue options have an official estimate from the consensus forecast or a bill fiscal
   note? Revenue estimates depend on a forecast, so they need a named source and a date.
5. What does the enacted budget actually deposit into the Savings Reserve, and what is the reserve's
   projected balance? Needed before a withdrawal option can be offered at all.
6. Is the enacted budget's own recurring/nonrecurring split published anywhere? If so, the app could
   report an absolute structural balance instead of only a change.

---

## 4. Deliberate exclusions

These are design decisions, not gaps.

- **One fund.** General Fund net appropriations only. No all-funds figures, agency receipts, federal
  funds, Highway Fund, or Highway Trust Fund. Combining them is the most common way a state budget
  figure gets misreported, and the app refuses to do it.
- **One year.** FY 2026-27. No projection into later years, even though recurring choices plainly
  affect them.
- **Fixed revenue forecast.** Spending choices are not modelled as affecting collections.
- **No interaction between decisions.** Effects are added independently.
- **Discrete options.** Two to four choices where the real decision is a continuous amount.
- **No behavioural or economic modelling.** No multipliers, elasticities, or dynamic scoring.
- **No federal match modelling.** Where a state dollar draws federal dollars, as in Medicaid, only
  the General Fund side is shown. Options where this matters say so in their trade-offs.
- **No positions or caseloads.** Amounts are dollars, not full-time equivalents or people served.
- **No debt service or capital financing detail.**
- **No state seal, emblem, or official mark**, and no UNC branding. The only visual reference to the
  state is an original stylised west-to-east elevation profile.

---

## 5. Editorial rules applied to the content

- Each decision offers the enacted policy plus one or more alternatives. Where only one alternative
  has a plausible documented basis, only one is offered: no false symmetry.
- Every alternative carries both the strongest argument in favour and the strongest concern, and a
  test fails the build if either is missing.
- No ideological labels anywhere, and a test scans all option text for them. The results page
  describes the budget, never the person who built it.
- Descriptions of the enacted policy are written to say *where* the detail lives rather than to
  assert a specific figure, because those figures have not been read.

---

## 6. How to record a change

When any figure changes, update all four:

1. The relevant file in `src/data/`
2. `version` in `src/data/index.ts`
3. `VERSION_HISTORY` in `src/pages/Methodology.tsx`
4. `VERIFIED_THROUGH` in `src/data/sources.ts`, and this file's header

Then run `npm run check`. See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md).
