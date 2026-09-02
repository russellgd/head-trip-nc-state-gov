# The North Carolina Budget Challenge

An independent educational simulation of North Carolina's **FY 2026-27 General Fund**. Visitors
work through budget decisions, watch a running balance change after every choice, and finish with a
summary of the budget they built.

It is a teaching tool for residents, students, public officials, and civic groups. It is **not** a
publication of the State of North Carolina, the General Assembly, the Office of State Budget and
Management, or any state agency, and it is not affiliated with or endorsed by any of them.

---

## Read this first: the state of the data

The application is populated from the text of **S.L. 2026-41**, the Current Operations
Appropriations Act of 2026, read in full (634 pages). Thirty-five decisions span all twelve budget
areas, and a surplus, a balanced budget, and a deficit are all reachable.

There are **two ways through the same dataset**, chosen on the challenge page:

| | Decisions | Time | For |
| --- | ---: | --- | --- |
| **Classroom Challenge** (the default) | 20 | about 30 to 35 minutes | a single class period |
| **Full Challenge** | 35 | about an hour | workshops, assignments, independent study |

They are not two datasets. Every decision in the classroom set is the same decision with the same
amounts, the same recurring split and the same citations, and answers carry over when you switch.
The classroom selection is frozen and enforced by tests; the reasoning behind every inclusion and
exclusion is in `CLASSROOM_MODE_PROPOSAL.md`.

Every enacted figure was checked by re-deriving a total the act itself prints — the 78 agency lines
sum to the stated total net appropriation, the availability statement reconciles line by line, and
the reservations sum to their stated subtotals. Those checks run in the test suite, so a
transcription error fails the build.

The three baseline anchors were confirmed against the act, unchanged:

| Anchor | Amount | Source |
| --- | --- | --- |
| Revised total General Fund availability | $35,374,286,763 | Section 2.2(a) |
| General Fund net appropriations | $34,374,286,763 | Section 2.1(a) |
| Unappropriated balance remaining | $1,000,000,000 | Section 2.2(a) |

**Every option carries a provenance**, shown on screen, in the export, and in the printed report:

| Provenance | Options | What it means |
| --- | ---: | --- |
| Enacted policy | 30 | What S.L. 2026-41 actually does |
| Documented alternative | 12 | The dollar impact equals an amount an official document states |
| Published proposal | 17 | From Governor Stein's Recommended Budget for FY 2026-27, with page and item citations |
| Illustrative allocation scenario | 32 | Constructed for this exercise; **not proposed by any North Carolina official or institution** |

An appropriations act establishes what an agency receives; it does not publish a costed alternative
to itself. So options that change an agency's funding are illustrative allocation scenarios: the
arithmetic is exact and shown, but the percentage is this project's choice. They must never be
described as policy proposals, and each carries a note on what a change of that shape would actually
run into — a uniform percentage is an arithmetic device, not an implementable plan.
`REPLACEMENT_INVENTORY.md` lists the 32 remaining ones with the document that would replace each.

Published proposals score the difference between the Governor's recommended level and the enacted
level, because the Governor's own change columns are measured from the November 2025 certified
budget and adding them to an enacted figure would double-count.

Neither the technical corrections acts (S.L. 2026-42, S.L. 2026-61) nor the certified budget had
been applied at this version, so the baseline is still marked provisional in the app.

**[CONTENT_REPORT.md](./CONTENT_REPORT.md)** is generated from the data
(`npm run report:content`) and states which areas have real choices and whether each outcome is
reachable. **[DATA_NOTES.md](./DATA_NOTES.md)** covers what is verified, what is assumed, and what
remains. **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** covers updating the figures.

## Setup

Requires Node 20 or later.

```bash
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check and produce a static build in `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm test` | Run the full test suite once |
| `npm run test:watch` | Re-run tests as files change |
| `npm run test:coverage` | Coverage for the engine and data layer |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | oxlint |
| `npm run check` | Type-check, lint, and test together |
| `npm run report:content` | Regenerate the content-completeness report |
| `npm run report:replacements` | Regenerate the replacement inventory |

Three browser checks run against a build. Start `npm run build && npm run preview` first:

| Command | What it does |
| --- | --- |
| `npm run verify:a11y` | axe-core audit of every page at desktop and mobile widths |
| `npm run verify:keyboard` | Tab order, focus visibility, keyboard completion, reduced motion |
| `npm run verify:screenshots` | Screenshots at three viewports, with a sideways-scroll check |

They use the Chromium bundled with the container image. Set `CHROMIUM_PATH` if yours is elsewhere.

## Deployment

The build is entirely static: no server, no database, no login, no API. Hash routing is used so it
works from any static host and from a subdirectory with no rewrite rules.

```bash
npm run build      # writes dist/
```

Upload `dist/` to any static host: GitHub Pages, Netlify, Cloudflare Pages, S3, or a university web
server. `vite.config.ts` sets `base: './'`, so the site works from a subdirectory without changes.

### Deploying to GitHub Pages

```bash
npm run build
npx gh-pages -d dist        # or commit dist/ to a gh-pages branch
```

## Privacy

No accounts, no analytics, no cookies, no third-party requests. No email addresses, ZIP codes, or
demographic data are collected, and there is no field in which to enter them. Fonts are system
fonts, deliberately, so that rendering the page does not send a visitor's IP address to a font host.

A visitor's answers are kept in `localStorage` under one key (`nc-budget-challenge/v1`), which holds
choice ids and nothing else. "Reset to the enacted budget" clears it.

---

## How it is put together

```
src/
  data/            Everything the simulation knows about the budget
    types.ts       The data contract, with the sign conventions
    baseline.ts    The three FY 2026-27 General Fund anchors
    categories.ts  The twelve budget areas
    sources.ts     The source ledger and the cite() helper
    validate.ts    Invariants; refuses unsourced figures
    decisions/     Policy decisions, one file per group of areas
  engine/
    budget.ts      Pure calculation. No DOM, no storage, no network.
  components/      Interface pieces
  pages/           Home, Overview, Challenge, Results, Methodology, Glossary
  lib/             Formatting, storage, export, challenge state
scripts/           Browser-based verification
```

**Data is separate from the interface.** No component contains a dollar amount; a test
(`src/data/no-hardcoded-amounts.test.ts`) scans `components/` and `pages/` and fails if one appears.
Publishing a new budget year means editing files under `src/data` and nothing else.

### The calculation

```
remaining balance = baseline unappropriated balance
                  + revenue increases
                  - revenue reductions
                  - spending increases
                  + spending reductions
                  - additional reserve deposits
                  + reserve withdrawals
```

Every amount is an integer number of dollars. Recurring and nonrecurring amounts are stored
separately and are never added together except in a total explicitly labelled as such. Alongside the
balance, the app reports the **change in recurring position** — recurring revenue less recurring
spending and reserve commitments — so a budget balanced with one-time money is visible as such.

A budget is balanced at zero or above. A deficit produces a warning but is never blocked; seeing the
consequence is the point of the exercise.

### Verification statuses

Two independent axes, deliberately not collapsed into one.

**Arithmetic status** — can the figure be traced?

| Status | Scored | Meaning |
| --- | --- | --- |
| `verified` | yes | The amount is stated in an official NC government document, cited on the option |
| `derived` | yes | Arithmetic on a verified figure, with the calculation shown to the reader |
| `pending` | **no** | No official figure confirmed yet |

**Provenance** — did anyone propose the policy?

| Provenance | Meaning |
| --- | --- |
| `enacted` | What the act actually does |
| `documented` | The dollar impact equals an amount an official document states |
| `proposal` | Published in an official document with a fiscal estimate behind it |
| `illustrative` | Constructed for this exercise; not proposed by anyone. Must carry an implementation note and a statement of what would replace it |

`src/data/validate.ts` rejects a citation on any host that is not an official North Carolina
government domain.

## Accessibility

Built to WCAG 2.2 AA. Verified with axe-core across all six pages at desktop and mobile widths
(no violations), plus a scripted keyboard walkthrough.

- Full keyboard operation, with a skip link and a visible gold focus ring on every control
- Focus moves to the new card when you advance to the next decision
- Balance changes are announced through a polite live region, in full sentences
- No colour-only indicators: status is always a word plus a symbol, and every amount carries a sign
- Wide tables scroll inside labelled, focusable regions rather than pushing the page sideways
- Reduced-motion preference removes all transitions
- Charts are decorative; the same figures are in an adjacent data table

## Testing

```bash
npm test
```

Covers the calculation engine (the governing equation in both expanded and collapsed form, recurring
versus one-time handling, deficits, per-category attribution), dataset integrity (every invariant,
including that no unsourced figure can be scored), formatting, export, and the interface (selection,
persistence, reset, keyboard use, live-region announcements).

## Licence and use

Built for classroom and public-workshop use. Reuse and adapt it; if you publish a modified version,
please keep the independent-project disclaimer and update the source ledger to match your data.
