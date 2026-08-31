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
against. The OSBM certified budget would supply one, and it is not available to this build:
`osbm.nc.gov` is blocked by the network policy, and the certified budget has not been uploaded as a
file. **Until such a document is in hand, any reconciled total rests on this reading alone, and
should be labelled as such.**

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

## 2. S.L. 2026-42 (House Bill 56) — partially resolved

The earlier pass treated this act as fiscally inert because it contains no sentence of the form
"there is appropriated from the General Fund". It nonetheless adjusts the Part II totals by its own
Section 12.1, and it changes allocations in both directions.

### 2a. Rows established

| § | Agency / programme | R/NR | Delta | Type | Notes |
| --- | --- | --- | ---: | --- | --- |
| 2.5(1) | UNC BOG, Budget Code 16022 — MAHEC at UNC-Chapel Hill | R | **+1,000,000** | New funding | |
| 2.5(1) | UNC BOG, Budget Code 16022 — MAHEC at UNC-Chapel Hill | NR | **+2,123,000** | New funding | |
| 2.5(2) | UNC BOG, Budget Code 16011 — Healthcare Workforce Programs Expansion | R | **−1,000,000** | Reduction | Offsets 2.5(1) recurring exactly |
| 2.5(2) | UNC BOG, Budget Code 16011 — Healthcare Workforce Programs Expansion | NR | **−500,000** | Reduction | |
| 3.6 | DHHS — Dolly Parton's Imagination Library (Cttee Rpt p. C31, Item 73) | NR | **−1,000,000** | Reduction | |
| 3.5(2) | DHHS — Boys and Girls Homes, Carolyn's Kaleidoscope (p. C110, Item 298) | NR | **−500,000** | Reduction | Paired with 3.5(1) |

### 2b. Rows established as net-zero

| § | What it does | Why the delta is zero |
| --- | --- | --- |
| 2.3(1)(2) | DPI State Textbook Fund Sunset: **requirements** reduction and **receipts** reduction each decreased by $836,594 recurring; revised reduction $59,409,859 | Requirements and receipts move together |
| 4.6(1)(2) | DNCR: Complete the Trails Fund −$5,516,000 NR; Great Trails Fund +$5,516,000 NR | Exactly offsetting |
| 4.7 | $650,000 NR moved from the Great Trails Fund to OSBM for three directed grants | Within the General Fund. **Repealed by S.L. 2026-61 §5.15(a)**, so it does not stand |
| 2.7 | BRIGHT Institute name corrected | No amount changed |
| 1.1(a)(b) | Helene fund transfer sources corrected | Transfer sourcing |
| 1.2 | Fair Bluff riverwalk transfer reduced $5,000,000 → $4,500,000 | Transfer from Budget Code 24558 / Fund 206842, **not a General Fund appropriation** — see open item |
| 3.5(1) | State Controller transfers $500,000 NR from Budget Code 24558 to OSBM for a directed grant | Same open question on the source code |

### 2c. Open — the block that must be totalled

**§6.2, enacting SECTION 26.10 of S.L. 2026-41 ("OSBM Directed Grant Changes"), pages 13–14.**
This is a long schedule that creates new directed grants (Camp Grier $2,500,000; Town of
Yanceyville $500,000; Lenoir County Sheriff $200,000; Charlotte Healthcare Coalition $500,000; Care
Ring $200,000; Southeastern Healthcare $100,000; Cabarrus County $10,000, and others) **and**
reduces at least twenty-one existing directed grants (Greensboro water/wastewater −$1,000,000;
Guilford Technical CC Aviation Center −$2,123,000; Greensboro Science Center −$500,000; Diaper Bank
−$500,000; Town of Yanceyville airport −$1,000,000; and more).

It has not been totalled here. Doing it correctly means transcribing every subdivision on both
sides and determining whether the schedule is self-funding or a net change. Until that is done, no
net figure for S.L. 2026-42 can be stated.

---

## 3. Summary as it stands

| # | Measure | Amount |
| --- | --- | ---: |
| 1 | Gross new General Fund appropriations (S.L. 2026-61) | **+$65,029,935** |
| 2 | Gross appropriation reductions (S.L. 2026-61) | **−$6,142,433** |
| 3 | Net change to Part II appropriations (S.L. 2026-61) | **+$58,887,502** |
| 3a | Net change to Part II appropriations (S.L. 2026-42) | **not yet determined** — §6.2 outstanding |
| 4 | Change to General Fund availability | **none identified in either act** |
| 5 | Reconciled net appropriations | **cannot be stated** until 3a resolves |
| 6 | Reconciled unappropriated balance | **cannot be stated** until 3a resolves |

If S.L. 2026-42 were to prove net-neutral — which it may well be, since its directed-grant schedule
looks self-funding — the anchors would become net appropriations **$34,433,174,265** and an
unappropriated balance of **$941,112,498**. **That is an illustration of the arithmetic, not a
result**, and it must not be used until §6.2 is totalled. `npm run report:ledger` prints it with the
same warning attached.

---

## 4. What is still open

1. **S.L. 2026-42 §6.2 (SECTION 26.10)** must be transcribed and totalled in both directions.
2. **Committee Report line items** referenced but not quantified in the acts: the Farm to School
   amount (p. B22, Item 75) for S.L. 2026-61 §5.1, and confirmation of the base amounts behind
   several reductions. The Committee Report is now available and these can be looked up.
3. **Budget Code 24558 / Budget Fund 206842** must be identified. If it is a disaster reserve rather
   than a General Fund code, the Fair Bluff and Boys and Girls Homes transfers do not touch the
   General Fund total; if it is General Fund, two rows change.
4. **A controlling check.** Neither act states a revised total. The OSBM certified budget, or a
   Fiscal Research Division consolidated post-corrections summary, would settle the whole exercise
   in one line. Neither is available: `osbm.nc.gov` is blocked by this environment's network policy,
   so the certified budget would have to be uploaded as a file.
5. **Whether S.L. 2026-52 and S.L. 2026-54** — cited in S.L. 2026-61 §§7.19 and 7.21 as the statutes
   being implemented — carry appropriations of their own. They are outside the scope named in the
   brief, but they are referenced by provisions inside it.
