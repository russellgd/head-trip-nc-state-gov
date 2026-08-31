# Administrator guide

How to update this application after a new budget, a technical correction, or a certified budget
revision. Written for someone comfortable editing a text file and running two commands, not
necessarily for a developer.

**The rule that governs everything below:** if a dollar amount is not stated in an official North
Carolina government document, do not type it in as though it were. Leave the option `pending`. An
absent figure is honest; an invented one is not, and people may cite this.

---

## Where things live

Everything the simulation knows about the budget is under `src/data/`. Nothing under `src/components/`
or `src/pages/` contains a dollar amount, and a test fails if one appears there.

| File | What it holds |
| --- | --- |
| `src/data/baseline.ts` | The three General Fund anchors and the fiscal year |
| `src/data/enacted.ts` | **Generated.** The 78 agency lines from the act's schedule, the ten reservations of revenue, and the availability statement. Do not hand-edit; see below. |
| `src/data/categories.ts` | The twelve budget areas and their enacted appropriations |
| `src/data/sources.ts` | The source ledger, the `cite()` helper, and the verified-through date |
| `src/data/decisions/*.ts` | The policy decisions, grouped by area |
| `src/data/validate.ts` | The rules that reject bad or unsourced data |
| `src/data/index.ts` | Assembles the dataset and carries the `version` |

---

## Before you start: gather the documents

You need these open in front of you. Each figure you enter must be traceable to one, with a section
or page reference.

1. **The appropriations act** — for FY 2026-27, S.L. 2026-41 (Senate Bill 257)
2. **The Joint Conference Committee Report** incorporated into it — the "money report", where the
   line-item detail actually lives
3. **Every technical corrections act since** — S.L. 2026-42 (HB 56), S.L. 2026-61 (HB 268), and any
   later ones. **Check these before treating any figure as final.** A correction can change an
   appropriation without changing the headline total.
4. **The OSBM certified budget** — the authoritative agency-level figures once OSBM has certified
5. **The Governor's Recommended Budget** — the main published source of costed *alternatives*, which
   is what makes an alternative scoreable

---

## Task 1: update the baseline anchors

Open `src/data/baseline.ts`.

```ts
netAppropriations: 34_374_286_763,
totalAvailability: 35_374_286_763,
unappropriatedBalance: 1_000_000_000,
```

Write amounts as integer dollars. Underscores are only for legibility and are ignored by the
computer: `34_374_286_763` is thirty-four billion, three hundred seventy-four million and so on.
Never write cents, decimals, or "34.4 billion".

**The three must reconcile.** Availability less net appropriations must equal the unappropriated
balance. If they do not, the app refuses to start and the tests fail with an explanation. That is
deliberate: a baseline that does not reconcile means one of the three figures was read from the
wrong column.

Once you have checked the anchors against every technical correction, set:

```ts
provisional: false,
provisionalNote: '',
```

That removes the "provisional" banners from the home and methodology pages.

---

## Task 1b: replacing the enacted figures after a new budget

`src/data/enacted.ts` carries every figure transcribed from the act, and it is machine-generated
rather than typed, because 78 agency lines are too many to transcribe by hand reliably. Its header
says so.

Each figure is checked by re-deriving a total the act itself prints, in
`src/data/enacted.test.ts`: the agency lines must sum to the stated total net appropriation, the
availability statement must reconcile line by line, and the reservations must sum to their stated
subtotals. **If you edit this file by hand and make a mistake, those tests will catch it.** That is
what they are for.

The area totals in `src/data/categories.ts` read from `CATEGORY_NET_APPROPRIATIONS` in this file,
so filling in a new year's agency schedule updates the overview chart automatically.

## Task 2: fill in appropriations by budget area

> For FY 2026-27 this is already done: the area totals are summed from the agency schedule in
> `src/data/enacted.ts`. This section applies when adding an area, or when an area's figure comes
> from somewhere other than that schedule.

Open `src/data/categories.ts`. Each area starts as:

```ts
enactedNetAppropriation: null,
sources: [],
```

Replace with the net appropriation and a citation:

```ts
enactedNetAppropriation: 12_345_678_901,
sources: [cite('committeeReport', 'Education, total net appropriation', '2026-09-15')],
```

Add `import { cite } from './sources'` at the top of the file if it is not already there.

`null` means "not confirmed" and is drawn as "not yet verified". Do **not** put `0` for an area you
have not checked: zero is a claim that the area receives nothing.

Filling these in is what makes the chart on the Budget Overview page appear. Nothing else is needed;
the chart draws itself from this data.

**Check your work:** the twelve areas should sum to total net appropriations. If the official
groupings do not map cleanly onto these twelve, change the categories to match the documents rather
than forcing the documents into these twelve.

---

## Task 3: give a policy option a real dollar amount

This is the main task. Open the relevant file in `src/data/decisions/`.

An option currently awaiting a figure looks like this:

```ts
unsourcedOption({
  id: 'larger-raise',
  label: 'Fund a larger salary increase',
  description: 'Raise the statewide teacher salary schedule above the level funded in the enacted budget.',
  affects: [...],
  benefits: [...],
  tradeoffs: [...],
  wouldBeSourcedBy: "The Governor's Recommended Budget for FY 2026-27 carries a costed version...",
}),
```

Once you have an official figure, replace `unsourcedOption` with a full choice object:

```ts
{
  id: 'larger-raise',
  label: 'Fund a larger salary increase',
  description: 'Raise the statewide teacher salary schedule above the level funded in the enacted budget.',
  spending: { recurring: 248_000_000, nonrecurring: 0 },
  revenue: { recurring: 0, nonrecurring: 0 },
  reserve: { recurring: 0, nonrecurring: 0 },
  affects: [...],       // keep what is already there
  benefits: [...],
  tradeoffs: [...],
  sources: [
    cite('governorRecommendation', 'Public Instruction, teacher compensation', '2026-09-15'),
  ],
  verification: {
    status: 'verified',
    scored: true,
    note: "The Governor's recommended budget states this amount for FY 2026-27.",
  },
}
```

Add `import { cite } from '../sources'` at the top of the file if it is not there.

### The sign conventions — get these right

| Field | Positive means | Negative means |
| --- | --- | --- |
| `spending` | spends **more** General Fund money | spends **less** |
| `revenue` | raises **more** revenue | raises **less** |
| `reserve` | **deposits** more into reserves | **withdraws** from reserves |

A cut of $50 million is `spending: { recurring: -50_000_000, nonrecurring: 0 }`. A tax reduction is
`revenue: { recurring: -50_000_000, nonrecurring: 0 }`.

### Recurring versus nonrecurring

Put ongoing money in `recurring` and one-time money in `nonrecurring`. Split them as the document
splits them. If a document gives one combined figure without a split, put it in whichever the
document says it is; if the document does not say, leave the option `pending` and note the question
in `DATA_NOTES.md`. Guessing the split defeats the purpose of tracking them separately.

### Choosing a verification status

| Status | Use when | Scored |
| --- | --- | --- |
| `verified` | The amount is stated in a document you have read, cited in `sources` | yes |
| `derived` | You calculated it from a verified figure; you must fill in `derivation` showing the arithmetic | yes |
| `pending` | You do not have an official figure | no |
| `illustrative` | A round number to make a teaching point, not an estimate | no |

The validator rejects `scored: true` on a `pending` or `illustrative` option, so a mistake here fails
the tests rather than reaching a visitor.

---

## Task 4: add a source document

Open `src/data/sources.ts` and add an entry to `DOCUMENTS`:

```ts
newDocument: {
  title: 'Full official title of the document',
  url: 'https://www.ncleg.gov/...',
},
```

Then add a matching entry to `SOURCE_LEDGER` with a `role` explaining what it is used for; that is
what appears on the methodology page.

The URL must be on an official North Carolina government host. The validator maintains the allowed
list (`OFFICIAL_HOSTS` in `src/data/validate.ts`) and rejects anything else. If you need to cite a
state host that is not yet listed — a department site, for instance — add it there, and only if it is
genuinely an official state domain.

---

## Task 5: add or remove a decision

To add one, copy an existing decision in the relevant `src/data/decisions/` file and edit it. Rules
the validator enforces:

- Two to four options
- Exactly one option marked `isEnactedBaseline: true`, with all amounts zero
- Unique `id` for the decision and for each option within it
- Every non-enacted option has at least one `benefit` and one `tradeoff`

To remove one, delete it. Visitors who had chosen an option in it will fall back to the enacted
policy automatically; their other answers are kept.

To add a whole new budget area, add it to `src/data/categories.ts` and to the `CategoryId` union in
`src/data/types.ts`. The navigation, the results breakdown, and the chart all read from that list.

---

## Task 6: publish

After any data change, do all four:

1. Bump `version` in `src/data/index.ts` (`0.1.0` to `0.2.0`, and so on)
2. Add a row to `VERSION_HISTORY` in `src/pages/Methodology.tsx` saying what changed
3. Update `VERIFIED_THROUGH` in `src/data/sources.ts` to the date you did the checking
4. Update the header and the open questions in `DATA_NOTES.md`

Then:

```bash
npx vite-node src/tools/contentReport.ts > CONTENT_REPORT.md   # refresh the report
npm run check                                # type-check, lint, and the full test suite
npm run build                                # writes dist/
```

`CONTENT_REPORT.md` is the quickest way to see where the data stands: which areas still have no
real choices, and whether a surplus, a balanced budget, and a deficit are each reachable. While any
of those three is unreachable, the challenge cannot be played end to end, and the report says so at
the top.

There is an acceptance gate for exactly this in `src/engine/playability.test.ts`, marked
`it.skip`. Un-skip it once the dataset is populated; it then fails the build if the data ever stops
being playable.

`npm run check` must pass. It will fail if the baseline does not reconcile, if an unsourced figure
is marked as scored, if a citation points at a non-government host, if an amount is not a whole
number of dollars, if an option is missing an argument or a trade-off, or if a dollar amount has
been typed into a component.

Then upload `dist/` to your static host.

### Worth running before a public release

Start `npm run preview`, then:

```bash
npm run verify:a11y         # accessibility audit of every page
npm run verify:keyboard     # keyboard operation and reduced motion
npm run verify:screenshots  # phone, tablet, and desktop layouts
```

And check by hand:

- Open several source links and confirm they still resolve. The General Assembly reorganises URLs.
- Read the Methodology page as a visitor would and confirm it describes what the data now contains.
- Confirm no proposed policy reads as though it were enacted law.

---

## If something goes wrong

**`npm run check` fails with "Baseline does not reconcile".** Availability less net appropriations
does not equal the unappropriated balance. One of the three is from the wrong column or the wrong
document.

**"A choice with verification status pending must not be scored".** An option has `scored: true`
without a confirmed figure. Either cite the source and set `verified`, or set `scored: false`.

**"Source host ... is not an official North Carolina government host".** The citation points
somewhere else. Use the official document, not a news article or a summary.

**"must be an integer number of dollars".** An amount has a decimal point, or was written in
millions. Write whole dollars.

**A test says a component contains a dollar amount.** A figure was typed into the interface instead
of the data layer. Move it into `src/data/` so it carries a citation.
