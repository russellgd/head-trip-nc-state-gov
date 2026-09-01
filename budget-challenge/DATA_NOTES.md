# Data notes

What is settled, what is not, and what was deliberately left out. Written so that anyone using this
in a classroom or a workshop can judge the exercise fairly, and so that whoever picks the data work
up next knows exactly where it stands.

**Data verified through:** 2026-08-31
**Dataset version:** 0.2.0
**Primary source:** Current Operations Appropriations Act of 2026, S.L. 2026-41 (Senate Bill 257),
read in full as an eight-part PDF of the enrolled act, 634 pages.

---

## 1. What is verified, and how

Every enacted figure in the dataset was read from the text of S.L. 2026-41 and then checked by
re-deriving a total the act itself prints. Those checks run in the test suite
(`src/data/enacted.test.ts`), so a transcription error fails the build rather than reaching a
reader.

| Check | Result |
| --- | --- |
| 78 agency lines transcribed from the Section 2.1(a) schedule | requirements − receipts = net appropriation on every line |
| Sum of the 78 net appropriations | $34,374,286,763, equal to the act's stated Total Net Appropriation |
| Sum of requirements / receipts | $82,456,429,733 / $48,082,142,970, equal to the act's stated totals |
| Availability statement, Section 2.2(a) | reconciles line by line to $35,374,286,763 |
| Statutory reservations | sum to $1,152,175,000, the act's stated subtotal |
| Discretionary reservations | sum to $3,017,385,236, the act's stated subtotal |
| Availability − net appropriations | $1,000,000,000, equal to the stated Unappropriated Balance Remaining |
| Twelve category totals | sum back to $34,374,286,763 |

### The three baseline anchors: confirmed

All three figures given at the outset of this project were confirmed against the act, unchanged:

| Anchor | Amount | Where it comes from |
| --- | --- | --- |
| General Fund net appropriations | $34,374,286,763 | Section 2.1(a), Total Net Appropriation |
| Revised total General Fund availability | $35,374,286,763 | Section 2.2(a) |
| Unappropriated balance remaining | $1,000,000,000 | Section 2.2(a) |

### Which document controls which figure

Only one document was available, so the ledger is short and unambiguous:

| Figure | Controlling document and section |
| --- | --- |
| Every agency net appropriation, and the area totals built from them | S.L. 2026-41, Section 2.1(a) |
| The three baseline anchors | S.L. 2026-41, Sections 2.1(a) and 2.2(a) |
| Consensus revenue forecast and the act's adjustments to it | S.L. 2026-41, Section 2.2(a) |
| The ten reservations of revenue | S.L. 2026-41, Section 2.2(a), with the operative subsections at 2.2(b), (d), (f), (g), (h), (i), (j), (k) |

---

## 2. The honest limitation: where the *alternatives* come from

This is the part a reader most needs to understand, and it is stated in the application itself as
well as here.

**An appropriations act establishes what an agency receives. It does not publish a costed
alternative to itself.** No document that prices alternatives — the Governor's Recommended Budget
above all — was available to this build. So the alternatives fall into two classes:

Every option carries a **provenance**, recorded in the data, shown on screen, and carried through
the export and the printed report. Provenance is a separate question from whether the arithmetic is
traceable, and conflating the two is how a simulation ends up implying that a scenario it invented
is a proposal somebody made.

| Provenance | Options | What it means |
| --- | ---: | --- |
| **Enacted policy** | 30 | What S.L. 2026-41 actually does. The reference point. |
| **Documented alternative** | 12 | The dollar impact equals an amount an official document states. Not making a reservation the act makes frees exactly what the act reserves: "reserve nothing for the Medicaid Contingency Reserve" frees exactly $333,000,000. The magnitude is documented; this does not assert that anyone proposed it. |
| **Published proposal** | 17 | An alternative from Governor Stein's Recommended Budget for FY 2026-27 (April 2026), citing the page and the constituent recommendations behind it. |
| **Illustrative allocation scenario** | 32 | A percentage change constructed for this exercise — 3%, 5%, 10%, or 20% depending on the size of the line. The arithmetic is exact and shown. **No North Carolina official or institution proposed it**, and it must never be described as a policy proposal. |

Every illustrative option also carries, on its own card, a note on what a change of that shape would
actually run into: appropriations are distributed by statutory formulas and allotments, parts are
committed to entitlements, contracts, debt, or federally required matching, and some lines cannot be
changed without amending statute. **A uniform percentage is an arithmetic device, not an
implementable plan**, and nothing in the application implies otherwise.

`REPLACEMENT_INVENTORY.md` lists the 32 remaining illustrative options and the official proposal or
fiscal estimate that would replace each.

### How the Governor's figures are used, and why not directly

The Governor's Recommended Budget measures its own changes from the **November 2025 certified
budget**, not from what the General Assembly later enacted in S.L. 2026-41. Its published change
columns therefore cannot be added to an enacted figure: doing so would double-count everything the
act itself added.

What is comparable is the **level**. For each budget code the Governor publishes a recommended
FY 2026-27 net appropriation, and the act publishes an enacted one. The difference between two
published levels for the same code and year is exact, and that is what these options score. The
Governor's own recurring and nonrecurring figures are shown to the reader on the option regardless,
so nothing is hidden.

Fourteen agency decisions had a comparable recommendation. Sixteen did not, and kept their
illustrative scenarios rather than have a proposal forced into place. A fifteenth proposal is the
Opportunity Scholarship moratorium, described below.

### The one place the Governor's published change figures are scored directly

Every other proposal scores a difference of levels. The Opportunity Scholarship decision scores the
Governor's own published change, and only because that change was shown to equal the
enacted-to-recommended difference:

| Step | Finding |
| --- | --- |
| Enacted FY 2026-27 level | S.L. 2026-41 makes **no change** to the programme. The Committee Report's items 168-176 for budget code 16012 contain no Opportunity Scholarship adjustment, and the programme is funded by the standing statutory schedule at G.S. 115C-562.8, which the act neither appropriates against nor amends. The corrections acts touch it only on administrative points. |
| Governor's FY 2026-27 level | Reduced by **$454,500,000 recurring and $587,500,000 nonrecurring** (Budget Book p. 91, item 3). Both figures are in the FY 2026-27 columns; the page's item totals reconcile to its printed totals. |
| Scored impact | Governor's level less enacted level. Since the enacted change is zero, this equals the published change. |

The base alignment was verified rather than assumed: the Committee Report and the Budget Book both
state a certified FY 2026-27 base of **$913,278,591** for budget code 16012, and the enacted changes
of $20,054,914 reconcile to the $933,333,505 in the act's own schedule.

### The programme's funding level, and what it is not

**G.S. 115C-562.8(b) appropriates $675,000,000 in recurring funds to the Opportunity Scholarship
Grant Fund Reserve for FY 2026-27.** An earlier version of this file wrongly said the level was
unpublished; it is published, in the statute rather than in the appropriations act, which is why the
act carries no line item for it.

That figure is the **statutory recurring appropriation**. It is not the programme's **total funds
available**, which may also include nonrecurring appropriations, balances already held in the
Reserve, and carryforward from prior years. None of those are established by the documents used
here.

**No total recommended funding level is calculated**, and none should be. The Governor's reduction
has a nonrecurring component of $587,500,000 with no established nonrecurring base to subtract it
from; subtracting only against the recurring figure would produce a number that reads like a
programme level while being nothing of the kind. The components do not reconcile into a total, so
no total is stated.

None of this changes the scored impact. The bridge is a difference, and the enacted change is zero
whatever the level turns out to be.

The statute itself was not among the documents available to this build. The FY 2026-27 figure was
supplied by the project owner and is recorded as such in the source ledger; it should be confirmed
against G.S. 115C-562.8(b) before publication.

### Teacher and instructional support pay, split from Public Schools

| | Recurring | Nonrecurring | Total |
| --- | ---: | ---: | ---: |
| Enacted (Committee Report item 37) | $514,733,062 | $83,375,837 | **$598,108,899** |
| Governor (Budget Book p. 70 item 1) | $734,368,000 | $0 | **$734,368,000** |
| **Scored** | **+$219,634,938** | **−$83,375,837** | **+$136,259,101** |

Residual left with the aggregate: $1,104,216,185 − $136,259,101 = **+$967,957,084**.

**This option is deliberately exempt from the recurring-by-convention treatment.** The two
components move in opposite directions, and that is the substance of the choice: the enacted budget
funds part of its increase as a one-time bonus of $500 or $1,000 depending on experience, while the
Governor funds the whole increase as recurring salary. Recurring money continues into every later
year and compounds as staff move up the schedule; a bonus does not. Collapsing the two into a single
net figure would hide exactly the thing worth teaching, and the structural balance would not show it.

**One scope point, disclosed on the card.** The enacted item bundles the salary increase with the
bonus; the Governor's item covers salary only, and a separate item at p. 71 funds a larger public
school bonus of $253,737,000 nonrecurring that is **not part of this bridge and is not scored
anywhere in this project**. The negative nonrecurring figure therefore means the bonus is not
carried inside this item, not that the Governor proposes no bonus.

### Correctional officer pay, split from Adult Correction

| | |
| --- | --- |
| Enacted | Committee Report item 40, "Correctional Officers – Salary Adjustments": **$47,429,250 recurring**, raising each step of the schedule by **13%** in FY 2026-27 |
| Governor | Budget Book p. 203 item 5: **$82,554,010 recurring**, funding **15%** in total — 10% in the first year of the biennium and 5% in the second |
| Scored | **+$35,124,760 recurring**, the incremental appropriation only |
| Residual left with the aggregate | $94,109,120 − $35,124,760 = **+$58,984,360** |

Probation and parole officers are funded separately on both sides — item 41 in the act
($4,900,952) and p. 203 item 6 in the Budget Book ($16,458,017) — and neither figure folds the
other group in.

**A caveat carried on the card.** The two documents do not cost a percentage point the same way:
13% costs $3,648,404 a point in the act, and 15% costs $5,503,601 a point in the Governor's book,
half as much again. The Governor's figures are internally consistent — the first year's 10% is
costed at $55,035,673 and the second year's 15% at exactly one and a half times that — so this is
not an extraction error. The two costings evidently cover different components or populations, and
these documents do not resolve which. The appropriation difference is exact; it is not the price of
two percentage points, and the card says so.

### Medicaid rebase, split from Health Benefits

A rebase funds the projected cost of continuing the Medicaid programme that already exists. The
projection moves with enrollment, service utilisation, medical prices, the capitation rates paid to
managed care plans, and the federal matching rate. **It is not an expansion of eligibility and not a
new benefit**, and the card is tested to make sure it never reads as one.

| | |
| --- | --- |
| Enacted | Committee Report item 99, "Medicaid Rebase": **$847,200,000 recurring** (requirements $2,658,573,067 less receipts $1,811,373,067) |
| Governor | Budget Book p. 174 item 7, "Medicaid Rebase": **$1,047,197,722 recurring** |
| Scored | **+$199,997,722 recurring**, the incremental appropriation only |
| Residual left with the aggregate | $171,801,963 − $199,997,722 = **−$28,195,759** |

Both figures are net of receipts, so the federal share is already removed on each side and the
comparison is like-for-like. Both are entirely recurring in their own documents; nothing here is
converted by convention.

**Neither amount is presented as creating or preventing a shortfall.** No source establishes that
conclusion, so the card does not draw it. What it says is that the two are forecasts of the same
obligation, made at different times, and that they differ by $199,997,722.

**The residual is negative, and it is not a Medicaid cut.** It is the arithmetic net of items each
budget funds and the other does not, and the card names every one of them:

| | Amount |
| --- | ---: |
| Funded by the enacted budget, not carried by the Governor: personal care service rates | $70,800,000 |
| Innovations Waiver direct care worker wages | $21,300,000 |
| Healthy Opportunities Pilot | $9,000,000 |
| Funded by the Governor, not by the enacted budget: Managed Care Oversight | −$13,666,009 |
| Innovations Waiver slots | −$9,339,600 |
| Reductions the Governor states explicitly (Vacant Position Reductions) | −$659,084 |
| Other offsetting items on both sides | the remainder |
| **Residual** | **−$28,195,759** |

Explicit reductions account for about a fortieth of it. Both sides sum exactly to the change each
document states for budget code 14445, so nothing has gone missing to another code; the difference
is one of scope. `MEDICAID_AUDIT.md` carries the full item-by-item reconciliation, and the aggregate
card is tested to state that this is not one policy and to name each item.

### Not double-counting the splits

The UNC aggregate decision previously scored the whole 16011 + 16012 difference, which included the
moratorium. It now scores only the residual:

| | |
| --- | ---: |
| Aggregate bridge (recommended $505,470,535 less enacted $1,377,055,397) | −$871,584,862 |
| less the Opportunity Scholarship moratorium | −$1,042,000,000 |
| **Residual scored by the aggregate decision** | **+$170,415,138** |

`src/data/nodoublecount.test.ts` enforces this for every split, from a table: no two decisions may
anchor the same agency line or the same Governor budget code, each programme option and its reduced
aggregate must sum back to the bridge that existed before the split, each programme decision must
offer continuation of enacted policy as a verified zero option, and no decision may offer more than
one scored proposal.

If you use this in a course, that distinction is worth ten minutes of discussion on its own: the
difference between a number that is *sourced* and a scenario that is *plausible*.

---

## 3. What is still unresolved

1. **The technical corrections have not been applied.** S.L. 2026-42 (House Bill 56) and S.L.
   2026-61 (House Bill 268) were not available. A correction can move an appropriation without
   changing the headline total, so the top-line anchors may well hold while individual agency lines
   beneath them have changed. The baseline is therefore still marked provisional in the application.
2. **The certified budget has not been checked.** OSBM's certified FY 2025-27 agency budgets are the
   authoritative agency-level figures once certification is complete.
3. **The committee report was not available.** The money report incorporated into the act at Section
   45.2 carries detail below the agency level — individual programmes and line items — which would
   support far more specific decisions than agency totals allow.
4. **No costed alternatives.** The Governor's Recommended Budget would replace most of the `derived`
   percentage options with real proposals carrying official fiscal estimates. This is the single
   highest-value addition remaining.
5. **Recurring / nonrecurring splits are assumed, not sourced.** See the next section.

---

## 4. Assumptions recorded as assumptions

- **Agency appropriation changes are treated as recurring.** The act's schedule does not split
  agency totals into recurring and nonrecurring parts. An operating budget continues from year to
  year, so a change to one is counted as recurring throughout. This applies to the published
  proposals as well: the difference between the Governor's recommended level and the enacted level
  has no published recurring split, because the Governor's own split is measured from a different
  base, so the same rule is applied and stated on the option. Where the act does state a split it
  is followed: Section 2.2(b) says the $450,000,000 Savings Reserve transfer is nonrecurring, and it
  is stored that way.
- **Reservation changes are treated as nonrecurring.** They are reservations of a single year's
  availability.
- **Revenue adjustments are treated as nonrecurring**, because the availability statement presents
  them as adjustments to FY 2026-27 availability. A change to the consensus forecast itself is
  treated as recurring, since that is the ongoing revenue base.
- **Agency-to-area mapping.** The act groups agencies under eight headings; this project uses twelve
  areas. Every one of the 78 agencies is assigned to exactly one area, the assignments are visible
  in `src/data/enacted.ts`, and the twelve totals are asserted to sum to the act's grand total. Two
  assignments are judgement calls worth naming: the Department of Labor and the Department of
  Commerce are both placed in Economic and Community Development, following the act's own
  "Agriculture, Natural, and Economic Resources" grouping; and the General Fund Reserve for the pay
  plan is placed in General Government and State Workforce, since it funds state employee
  compensation across all agencies.

---

## 5. Deliberate exclusions

These are design decisions, not gaps.

- **One fund.** General Fund net appropriations only. No all-funds figures, agency receipts, federal
  funds, Highway Fund, or Highway Trust Fund. Combining them is the most common way a state budget
  figure gets misreported, and the app refuses to do it.
- **One year.** FY 2026-27, with no projection into later years.
- **Fixed revenue forecast.** Spending choices are not modelled as affecting collections.
- **No interaction between decisions.** Effects are added independently.
- **Discrete options.** Two or three choices where the real decision is a continuous amount.
- **Thirty decisions.** The act runs to 634 pages and contains thousands of individual items.
- **No behavioural or economic modelling.** No multipliers, elasticities, or dynamic scoring.
- **No federal match modelling.** Where a state dollar draws federal dollars, as in Medicaid, only
  the General Fund side is shown. Options where this matters say so in their trade-offs.
- **No positions or caseloads.** Amounts are dollars, not full-time equivalents or people served.
- **No debt service or capital financing detail.**
- **No state seal, emblem, or official mark**, and no UNC branding. The only visual reference to the
  state is an original stylised west-to-east elevation profile.

---

## 6. Editorial rules applied to the content

- Each decision offers the enacted policy plus alternatives, and the enacted option is always
  labelled as enacted. No proposed alternative is presented as law.
- Every alternative carries both the strongest argument in favour and the strongest concern, and a
  test fails the build if either is missing.
- No ideological labels anywhere, and a test scans all option text for them. The results page
  describes the budget, never the person who built it.
- Every scored figure cites the act and the section it came from, and every `derived` figure prints
  its arithmetic where the reader can see it.

---

## 7. How to record a change

When any figure changes, update all four:

1. The relevant file in `src/data/`
2. `version` in `src/data/index.ts`
3. `VERSION_HISTORY` in `src/pages/Methodology.tsx`
4. `VERIFIED_THROUGH` in `src/data/sources.ts`, and this file's header

Then run `npm run check` and regenerate `CONTENT_REPORT.md`. See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md).
