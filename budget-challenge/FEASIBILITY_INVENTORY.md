# Feasibility inventory: three candidate program-level splits

Prepared for review. **Nothing here is implemented.** Each candidate is put through the same
program-level bridge test used for the Opportunity Scholarship split.

## The bridge test

A split is feasible only if all four hold:

1. **Same base.** The Committee Report and the Governor's Budget Book measure from the same
   FY 2026-27 certified base for that budget code.
2. **Enacted program level identified.** A line item in the Committee Report states the enacted
   change for the specific programme, or the absence of one establishes a zero change.
3. **Governor's program level identified.** A line item in the Budget Book states the recommended
   change for a programme of the same scope.
4. **Scope match.** The two items cover the same thing, neither folding in a neighbouring programme
   the other separates out.

Base alignment (point 1) has been confirmed generally: for every budget code checked so far the two
documents state an identical certified FY 2026-27 net appropriation, and the enacted changes
reconcile to the act's own schedule.

---

## 1. Teacher compensation — FEASIBLE

| | |
| --- | --- |
| Parent decision | `public-instruction` (K-12 Public Education) |
| Enacted | Committee Report item 37, "Compensation Increase Reserve – Teachers and Instructional Support": **$514,733,062 recurring + $83,375,837 nonrecurring = $598,108,899** |
| Governor | Budget Book p. 70, item 1, "Compensation Increase – Teachers and Instructional Support": **$734,368,000 recurring**, $0 nonrecurring |
| Bridge | **+$136,259,101** (recurring +$219,634,938; nonrecurring −$83,375,837) |
| Scope | Matching titles, both covering teachers and instructional support |

**Note for implementation.** The recurring and nonrecurring components move in opposite directions:
the Governor funds the whole increase recurrently where the enacted budget uses $83.4m of one-time
money. That is a genuinely interesting structural point for a teaching tool, and it means the option
must carry a real R/NR split rather than the recurring-by-convention treatment used elsewhere.

The Governor's recommendation is described as raising starting teacher salaries to the highest in
the Southeast and providing an 11% average raise, with a separate item for master's pay.

---

## 2. Medicaid rebase — FEASIBLE

| | |
| --- | --- |
| Parent decision | `medicaid-health-benefits` (Health and Human Services) |
| Enacted | Committee Report item 99, "Medicaid Rebase": requirements $2,658,573,067 less receipts $1,811,373,067 = **net appropriation $847,200,000 recurring** |
| Governor | Budget Book p. 174, "Medicaid Rebase": **$1,047,197,722 recurring** |
| Bridge | **+$199,997,722 recurring** |
| Scope | Identical item titles; both figures are net appropriations |

**Note for implementation.** Both documents net receipts out, so the comparison is like for like. This
is the clearest of the three: one named item, one fiscal year, one direction, no split to
apportion. It is also the decision where the federal match caveat matters most, since a state
dollar here draws federal dollars and the General Fund figure understates the effect on total
health spending.

---

## 3. Correctional officer salaries — FEASIBLE

| | |
| --- | --- |
| Parent decision | `adult-correction` (Justice and Public Safety) |
| Enacted | Committee Report item 40, "Correctional Officers – Salary Adjustments": **$47,429,250 recurring** |
| Governor | Budget Book p. 203, item 5, "Correctional Officer Salary Increase": **$82,554,010 recurring** |
| Bridge | **+$35,124,760 recurring** |
| Scope | Clean. Both documents separate correctional officers from probation and parole officers: the enacted budget at item 41 ($4,900,952) and the Governor at p. 203 item 6 ($16,458,017). Neither figure folds the other group in. |

**Note for implementation.** The scope check was the risk here and it passes. If the decision were
widened to "custody staff pay" rather than correctional officers specifically, both probation items
would have to be added to both sides.

---

## If these are implemented

Each split must back its amount out of the parent decision's aggregate proposal, exactly as the
Opportunity Scholarship split does. The mechanism already exists (`governorExcludes` in
`src/data/decisions/appropriations.ts`), and `src/data/nodoublecount.test.ts` would need a case per
split asserting that the program option and the reduced aggregate sum back to the original
aggregate bridge.

Resulting residuals, if all three were split:

| Parent decision | Aggregate bridge | less program | Residual |
| --- | ---: | ---: | ---: |
| `public-instruction` | +$1,104,216,185 | +$136,259,101 | +$967,957,084 |
| `medicaid-health-benefits` | +$171,801,963 | +$199,997,722 | −$28,195,759 |
| `adult-correction` | +$94,109,120 | +$35,124,760 | +$58,984,360 |

The Medicaid residual turning negative is worth pausing on before implementing: it would mean the
Governor recommends less than the enacted budget for everything in that division *other* than the
rebase. That is plausible, but it should be checked item by item against p. 174-180 rather than
taken from the subtraction alone.

---

## Not recommended for splitting

**`state-employee-pay` and `unc-campus-operations`** have no comparable Governor line and already
keep their illustrative scenarios. **`commerce`** fails the scope test at the aggregate level and
would fail it at the programme level for the same reason.
