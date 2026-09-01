# S.L. 2026-61 and S.L. 2026-42 reconciliation ledger

Working document. **The application has not been updated from it.** Its purpose is to establish,
provision by provision, what the two technical corrections acts do to the FY 2026-27 General Fund
appropriation totals, so that the baseline anchors can be revised on evidence rather than on a
pattern match.

**Status: not final.** Section 4 lists what is still open. Per the standing instruction, no anchor
moves until every row is reviewed in context and the rows sum exactly to a stated net change.

---

## 0. Method, and a correction to an earlier figure

An earlier pass over S.L. 2026-61 reported **$60,701,444** in additional General Fund
appropriations. **That figure was wrong**, and the way it was produced is worth recording so the
error is not repeated. It came from a regular expression matching the phrase "there is
appropriated", which:

- **missed every reduction**, including the two Forest Service recurring reductions, the Commerce
  administrative operating-cost reduction, the DNCR software-subscription reduction, and the Great
  Trails Fund reduction;
- **missed items below its $1,000,000 threshold**, such as the $20,000 trade commissions
  appropriation and the $200,000 recurring Secretary of State appropriation;
- **misclassified a reserve-funded appropriation** — the $10,000,000 sports championship incentive,
  which is drawn from an existing Economic Development Project Reserve and must not be charged
  again against the General Fund balance;
- **treated S.L. 2026-42 as fiscally inert**, which it is not;
- **counted requirements-and-receipts pairs as net changes** when they offset exactly.

This ledger is built by reading both acts section by section instead.

### The controlling-check problem

Both acts state that they adjust the Part II totals, and **neither states a revised total**:

> "The totals of Part II of S.L. 2026-41, as amended by S.L. 2026-42, are adjusted in accordance
> with the provisions of this act." — S.L. 2026-61, Section 13.1, page 51

> "…then the totals of Part II of that act are adjusted in accordance with the provisions of this
> act." — S.L. 2026-42, Section 12.1, page 18

So there is no consolidated post-corrections figure inside the legislation to check a ledger
against.

**The certified budgets currently posted by OSBM cannot serve as that check.** They are dated
November 2025 and cite the 2025 session laws, so they predate S.L. 2026-41 (July 2026), S.L.
2026-42, and S.L. 2026-61 (ratified 6 August, approved 11 August 2026). A certified budget issued
before the acts cannot reconcile them.

Only one of two documents would close this:

1. a **revised certified budget issued after 11 August 2026**, or
2. a **Fiscal Research Division post-corrections summary**.

**Until one is in hand, any reconciled total rests on this reading alone, and must be labelled as
such.**

### Conventions used below

- **Delta** is the effect on FY 2026-27 **General Fund net appropriations**. Positive spends more.
- A provision that moves money **between budget codes, between line items, or between agencies**
  without changing the total is recorded with a delta of **0** and typed as a reallocation. It is
  listed rather than omitted, because the brief asks for every net-zero transfer.
- A provision funded from a **reserve or another fund** has a General Fund delta of **0** and is
  flagged, because charging it against the General Fund balance would double-count it.
- A provision that changes **requirements and receipts by the same amount** nets to 0.

---

## 1. S.L. 2026-61 (House Bill 268) — complete

### 1a. Provisions that change the General Fund total

| § | Agency / programme | R/NR | Delta | Type | Source | Cond. | Part II | Avail. |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| 5.2(a) | Dept. of Agriculture & Consumer Services — vacant position funding | R | **+3,757,559** | Restoration | GF balance | No | Yes | No |
| 5.2(b) | NC Forest Service — emergency equipment repair/replacement | R | **−2,000,000** | Reduction | GF balance | No | Yes | No |
| 5.2(c) | NC Forest Service — emergency equipment repair/replacement | NR | **+2,000,000** | New funding | GF balance | No | Yes | No |
| 5.2(d) | NC Forest Service — Prescribed Burning Cost Share | R | **−1,000,000** | Reduction | GF balance | No | Yes | No |
| 5.2(e) | NC Forest Service — Prescribed Burning Cost Share | NR | **+1,000,000** | New funding | GF balance | No | Yes | No |
| 5.4(a) | Dept. of Commerce — EEO coordinator position | R | **+23,489** | Restoration | GF balance | No | Yes | No |
| 5.4(b) | Dept. of Commerce — Administrative Operating Costs | R | **−70,468** | Reduction | Existing appropriation | No | Yes | No |
| 5.5 | Dept. of Commerce — India/Ireland Trade Commissions | R | **+20,000** | New funding | GF balance | No | Yes | No |
| 5.6 | Dept. of Commerce — Energy and Infrastructure Office | R | **+188,431** | Restoration | GF balance | No | Yes | No |
| 5.7 | Dept. of Commerce — 2027 Military World Games | NR | **+25,000,000** | New funding | GF balance | **Partly** | Yes | No |
| 5.8A | Dept. of Commerce — Film and Entertainment Grant Fund | NR | **+15,000,000** | New funding | GF balance | No | Yes | No |
| 5.15(b) | Dept. of Natural & Cultural Resources — Great Trails Fund | NR | **−1,090,000** | Reduction | Existing appropriation | No | Yes | No |
| 5.15(c) | OSBM — six directed grants | NR | **+1,040,000** | New funding | GF balance | No | Yes | No |
| 5.17(a) | DNCR — Office of Education and Outreach (6 FTE) | R | **+481,965** | Restoration | GF balance | No | Yes | No |
| 5.17(c) | DNCR — software subscriptions | R | **−481,965** | Reduction | Existing appropriation | No | Yes | No |
| 5.18 | Wildlife Resources Commission — operations | R | **+1,000,000** | New funding | GF balance | No | Yes | No |
| 6.4(a) | Dept. of Adult Correction — Campbell University Second Chance | NR | **+1,000,000** | New funding | GF balance | No | Yes | No |
| 6.7 | Dept. of Public Safety — National Guard facility closing costs | NR | **+105,000** | New funding | GF balance | No | Yes | No |
| 7.1 | Office of Administrative Hearings — RRC litigation | NR | **+500,000** | New funding | GF balance | No | Yes | No |
| 7.3 | OSBM — Rural Health Care Stabilization Program | NR | **+10,000,000** | New funding | GF balance | No | Yes | No |
| 7.16(c) | Office of State Fire Marshal — 7 FTE | R | **+1,253,491** | New funding | GF balance | No | Yes | No |
| 7.19 | Secretary of State — annual report requirement | R | **+200,000** | New funding | GF balance | No | Yes | No |
| 7.19 | Secretary of State — annual report requirement | NR | **+545,000** | New funding | GF balance | No | Yes | No |
| 7.20 | Secretary of State — intellectual property prosecutor | NR | **+160,000** | New funding | GF balance | No | Yes | No |
| 7.21 | Secretary of State — foreign party land registry (2 FTE) | R | **+255,000** | New funding | GF balance | No | Yes | No |
| 4.4(1) | DHHS, MH/DD/SUS — HBOT 4 Heroes directed grant | NR | **+1,500,000** | Transfer in | State Controller transfer | No | Yes | No |
| 4.4(2) | DHHS — Community Foundation of NC East directed grant | NR | **−1,500,000** | Reduction | Existing appropriation | No | Yes | No |

### 1b. Provisions with no effect on the General Fund total

Listed because the brief asks for every net-zero transfer, reallocation, and reserve-funded item.

| § | What it does | Why the delta is zero |
| --- | --- | --- |
| 1.2 | Stabilization and Inflation Reserve transfers: State Auditor −$500,000, State Board of Elections +$500,000 | Exactly offsetting; a transfer between agencies |
| 5.3(a) | $10,000,000 to Commerce for a PGA championship directed grant | **Reserve-funded**: appropriated "from the Economic Development Project Reserve established in Section 2.2(m) of S.L. 2021-180", not from the General Fund. Also **conditional** on two agreements being entered. Must not be charged against the General Fund balance |
| 5.1 | Farm to School programme funding moved from DPI to DACS | Same amount, same purpose; agency-level shift only. **Amount not stated in the act** (Committee Report p. B22, Item 75) |
| 6.6 | SBI/Samarcand: a reduction and an increase **both** reduced by $116,297 recurring | The paired adjustment offsets exactly. This is the "provision that reduces an earlier budget cut" class |
| 4.7 | Budget Fund 133507 requirements **and** receipts each +$31,897,788 recurring | Requirements and receipts move together; net appropriation unchanged |
| 3.1, 3.2, 3.3 | Community Colleges: ERP reduction, CRM system, and short-term credentials moved between budget codes | Budget code changes only |
| 7.2(a)(b)(c) | State Auditor: 17 FTE and two appropriations moved between budget funds | Within-agency reallocation |
| 7.9(a)(b) | §26.3 repealed, replaced by §26.3A directing $1,000,000 of **existing** OSBM Special Appropriations to CAGC | "Of the funds appropriated in this act"; an allocation, not new money |
| 6.8, 2.3 | Committee Report budget fund numbers corrected | Coding only |
| 9.1, 9.2 | Community college recruitment funds clarified; Labor Market Adjustment Reserve savings preserved | 9.2 explicitly requires the savings to be achieved from other salary lines |
| 10.1, 10.2 | FSU chancellor's residence sale proceeds; SCIF youth detention use | Non-General-Fund / use changes |
| 12.1, 12.2 | Sampson County local sales tax date; vapor registry licensing | No General Fund revenue effect stated |
| 5.9–5.14, 5.16, 6.1–6.3, 6.5, 6.9–6.12, 7.4–7.8, 7.10–7.15, 7.17, 7.18, 7.22–7.25, 8.1, 11.x | Use changes, statutory amendments, reporting, position exemptions | No appropriation amount changed |

### 1c. Conditionality worth flagging

**§5.7, Military World Games, $25,000,000 nonrecurring.** Appropriated in full, but the act makes
the *allocation and expenditure* of $17,500,000 of it contingent on the local organising committee
securing commitments from at least 50 countries with 7,500 participants by 1 August 2026 and
obtaining a federal Special Event Assessment Rating. The remaining $7,500,000 is unconditional. The
appropriation is counted at full value here because the act appropriates the whole sum; the
condition governs whether it can be spent, and unspent funds revert after 30 June 2028.

### 1d. S.L. 2026-61 subtotals

| Measure | Recurring | Nonrecurring | Total |
| --- | ---: | ---: | ---: |
| Gross increases | +$7,179,935 | +$57,850,000 | **+$65,029,935** |
| Gross reductions | −$3,552,433 | −$2,590,000 | **−$6,142,433** |
| **Net change** | **+$3,627,502** | **+$55,260,000** | **+$58,887,502** |

Reconciliation of the net figure: increases of $65,029,935 less reductions of $6,142,433 equals
**$58,887,502**.

These subtotals are **computed, not typed**. The 27 rows above are transcribed into
`src/tools/ledgerCheck.ts` and added by `npm run report:ledger`. A first draft of this table was
hand-added and was wrong by $1,000,000 on the nonrecurring line; the check exists because of it.

---

## 2. S.L. 2026-42 (House Bill 56) — resolved except for one structural question

The earlier pass treated this act as fiscally inert because it contains no sentence of the form
"there is appropriated from the General Fund". It nonetheless adjusts the Part II totals by its own
Section 12.1, and it changes allocations in both directions.

### 2a. Provisions that change the General Fund total

| § | Agency / programme | R/NR | Delta | Type | Source | Cond. | Part II | Avail. |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| 2.5(1) | UNC BOG, Budget Code 16022 — Mountain Area Health Education Center | R | **+1,000,000** | New funding | GF balance | No | Yes | No |
| 2.5(1) | UNC BOG, Budget Code 16022 — Mountain Area Health Education Center | NR | **+2,123,000** | New funding | GF balance | No | Yes | No |
| 2.5(2) | UNC BOG, Budget Code 16011 — Healthcare Workforce Programs Expansion | R | **−1,000,000** | Reduction | Existing appropriation | No | Yes | No |
| 2.5(2) | UNC BOG, Budget Code 16011 — Healthcare Workforce Programs Expansion | NR | **−500,000** | Reduction | Existing appropriation | No | Yes | No |
| 3.5(2) | DHHS — Boys and Girls Homes, Carolyn's Kaleidoscope (Cttee Rpt p. C110, Item 298) | NR | **−500,000** | Reduction | Existing appropriation | No | Yes | No |
| 3.6 | DHHS — Dolly Parton's Imagination Library (p. C31, Item 73) | NR | **−1,000,000** | Reduction | Existing appropriation | No | Yes | No |

**Subtotal outside §6.2: recurring $0; nonrecurring +$123,000.**

The recurring pair in §2.5 offsets exactly: the MAHEC increase is funded by the Healthcare
Workforce Programs reduction. The nonrecurring MAHEC increase of $2,123,000 matches, to the dollar,
the reduction of the Guilford Technical Community College Aviation Center directed grant in §6.2
below — money moved from OSBM directed grants to the UNC Board of Governors.

### 2b. Provisions with no effect on the General Fund total

| § | What it does | Why the delta is zero |
| --- | --- | --- |
| 1.2 | Fair Bluff riverwalk transfer reduced $5,000,000 → $4,500,000 | Transfer out of **Budget Code 24558, the Hurricane Florence Disaster Recovery Fund** (Committee Report Part 5), not a General Fund appropriation |
| 3.5(1) | State Controller transfers $500,000 NR to OSBM for the Boys and Girls Homes Lake Waccamaw campus | Same fund. The purpose is **re-funded from the Florence Disaster Recovery Fund** while the General Fund grant is reduced by the same amount in §3.5(2). This is the "reserve-funded appropriation that should not be charged again" case, in reverse: the General Fund side is a genuine reduction, and the disaster-fund side must not be added back |
| 2.3(1)(2) | DPI State Textbook Fund Sunset: **requirements** and **receipts** reductions each decreased by $836,594 recurring; revised reduction $59,409,859 | Requirements and receipts move together |
| 4.6(1)(2) | DNCR: Complete the Trails Fund −$5,516,000 NR; Great Trails Fund +$5,516,000 NR | Exactly offsetting |
| 4.7 | $650,000 NR moved from the Great Trails Fund to OSBM for three directed grants | Within the General Fund. **Repealed by S.L. 2026-61 §5.15(a)**, so it does not stand |
| 9.1 | SCIF project authorisations raised: DPS23-3 to $63,785,000, DPS23-7 to $84,103,000 | **State Capital and Infrastructure Fund** authorisations. SCIF is funded by a reservation of revenue above the appropriation line and is not a General Fund net appropriation |
| 1.1, 2.6, 2.7, 2.8, 3.1–3.4, 4.1–4.5, 4.8, 5.1, 5.2, 6.1, 8.1, 8.3, 11.2, 11.3 | Statutory amendments, recipient and purpose clarifications, effective dates | No appropriation amount changed |

### 2c. §6.2 (SECTION 26.10) — totalled, but its effect is ambiguous

| Component | Amount |
| --- | ---: |
| (a) Eight new directed grants | +$5,010,000 |
| (b) Two directed-grant increases | +$600,000 |
| (b) Twelve directed-grant reductions | −$6,233,000 |

Subdivisions (2), (15)–(20) and (22)–(28) change recipients, titles or permitted purposes without
changing an amount. Subdivisions (3) and (4) offset exactly within Craven County. Subdivision (21)
removes $10,000 from a Rowan County grant and (a)(8) gives $10,000 to Cabarrus County for the same
volunteer fire department, so that pair offsets too.

**The act does not say whether (b)'s reductions lower the appropriation or free capacity within
it.** Subsection (a) allocates its grants "of the funds appropriated in this act to the Office of
State Budget and Management – Special Appropriations", which is a carve-out of an existing
appropriation, not new money. Whether the reductions in (b) shrink that line, or simply make room
inside it, decides the whole section:

| Reading | §26.10 net | S.L. 2026-42 net |
| --- | ---: | ---: |
| **A** — §26.10 redistributes within an unchanged appropriation line | $0 | **+$123,000** |
| **B** — (b)'s reductions lower the line; (a) is a carve-out of the remainder | −$5,633,000 | **−$5,510,000** |

The two readings differ by **$5,633,000**. Nothing in either act settles it, and the section does
not self-balance under either: (a) totals $5,010,000 against a net reduction in (b) of $5,633,000,
a difference of $623,000 that is not accounted for within the section.

### 2d. One provision that cannot be quantified at all

**§8.2** grants sworn law enforcement employees of the State Bureau of Investigation and Alcohol Law
Enforcement whose salaries are not set under §41.17(a) a **13% salary increase** in FY 2026-27. No
dollar amount is stated, and the act does not say whether it is absorbed within existing salary
appropriations or requires more. It needs a fiscal note or the certified budget.

---

## 3. Summary as it stands

| # | Measure | Amount |
| --- | --- | ---: |
| 1 | Gross new General Fund appropriations (S.L. 2026-61) | **+$65,029,935** |
| 2 | Gross appropriation reductions (S.L. 2026-61) | **−$6,142,433** |
| 3 | Net change to Part II appropriations (S.L. 2026-61) | **+$58,887,502** |
| 3a | Net change to Part II appropriations (S.L. 2026-42) | **+$123,000** (Reading A) or **−$5,510,000** (Reading B) |
| 4 | Change to General Fund availability | **none identified in either act** |
| 5 | Reconciled net appropriations | $34,433,297,265 (A) or $34,427,664,265 (B) |
| 6 | Reconciled unappropriated balance | $940,989,498 (A) or $946,622,498 (B) |

Neither pair may be used. `npm run report:ledger` prints both with the same warning attached.

**On availability (item 4).** Nothing in either act changes General Fund availability. S.L. 2026-61
Part XII amends a local sales tax effective date and vapor product licensing without a stated
General Fund revenue effect; S.L. 2026-42 Part XI likewise. The reservations of revenue in S.L.
2026-41 §2.2(a) are untouched except for the net-zero adjustment in S.L. 2026-61 §1.2. So the
availability anchor of $35,374,286,763 stands, and every change above falls on the appropriation
side, reducing the unappropriated balance dollar for dollar.

---

## 4. What is still open

The ledger has been carried as far as the statutory text allows. Three things remain, and the first
two cannot be resolved by reading the acts again.

1. **The §26.10 structural question**, worth $5,633,000. Requires a document showing the OSBM –
   Special Appropriations line before and after corrections.
2. **S.L. 2026-42 §8.2**, the 13% SBI and ALE salary increase, with no amount stated.
3. **A controlling post-corrections total.** Both acts say only that the Part II totals "are
   adjusted in accordance with the provisions of this act" and neither states a revised figure.
   No document currently available postdates 11 August 2026.

### What would close it

Exactly one of two documents:

1. A **revised certified budget issued after 11 August 2026**, the date S.L. 2026-61 was approved.
2. A **Fiscal Research Division post-corrections summary**.

Two documents that might look like candidates and are not:

- **The certified budgets currently posted on the OSBM website.** Dated November 2025 and citing
  the 2025 session laws, they predate all three acts. They must not be used or requested as the
  controlling reconciliation source.
- **The Governor's Recommended Budget**, now in hand. Dated April 2026, it predates the enacted act
  and both corrections. Its role in this project is to supply costed alternatives, not a baseline.

Until one of the two qualifying documents is available, **both readings stand**. Neither is to be
selected, and neither pair of anchors is to be presented as authoritative.

### Resolved since the first draft

- **Budget Code 24558 identified** as the Hurricane Florence Disaster Recovery Fund, which settles
  the two transfer rows in S.L. 2026-42 §§1.2 and 3.5(1).
- **Farm to School quantified** at $2,500,000 nonrecurring (Committee Report p. B22, Item 75,
  Budget Fund 101180). S.L. 2026-61 §5.1 moves it from Public Instruction to Agriculture and
  Consumer Services in the same amount: no change to the Part II total, but a $2,500,000 shift
  between two budget areas that would matter to the area totals if they were rebuilt.
- **§6.2 totalled** in both directions, with the internal offsets identified.
- **SCIF authorisation changes** established as outside the General Fund net appropriation.
