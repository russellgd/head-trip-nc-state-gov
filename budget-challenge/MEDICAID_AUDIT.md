# Medicaid rebase: reconciliation audit

**Audit only. Nothing implemented.** The purpose is to explain the −$28,195,759 residual that
appears when the Medicaid rebase is removed from the Health Benefits aggregate, and to say whether
the split can be built safely.

**Finding: both the rebase and the residual reconcile independently, to the dollar.** The residual
is a real scope difference between the two budgets, not an error.

---

## 1. Both sides reconcile to their own stated totals

Budget code 14445, DHHS – Health Benefits. Both documents measure from the same certified FY 2026-27
base of **$6,544,062,901**.

| | Items | Sum | Document's stated change | |
| --- | ---: | ---: | ---: | --- |
| Enacted (Committee Report, items 94–114) | 15 | $911,823,968 | $911,823,968 | matches |
| Governor (Budget Book, pp. 173–174, items 1–11) | 11 | $1,083,625,931 | $1,083,625,931 | matches |

Enacted revised: $6,544,062,901 + $911,823,968 = **$7,455,886,869**, which is the figure in the act's
own schedule. Governor recommended: $6,544,062,901 + $1,083,625,931 = **$7,627,688,832**.

Aggregate bridge: $7,627,688,832 − $7,455,886,869 = **+$171,801,963**.

Because each side's items sum exactly to the total its own document prints, **an extraction or
classification error is ruled out**.

---

## 2. The rebase

| | Amount |
| --- | ---: |
| Enacted, Committee Report item 99 "Medicaid Rebase" | $847,200,000 recurring |
| Governor, Budget Book p. 174 item 7 "Medicaid Rebase" | $1,047,197,722 recurring |
| **Rebase bridge** | **+$199,997,722 recurring** |

Identical item titles, same budget code, same base, both net of receipts. The enacted item shows
requirements of $2,658,573,067 less receipts of $1,811,373,067, so the federal share is already
netted out on that side; the Governor's figure is likewise an appropriation. This is a like-for-like
comparison.

---

## 3. Where the residual comes from

$171,801,963 − $199,997,722 = **−$28,195,759**, which is simply the difference between what each
budget funds *other than* the rebase:

| | Amount |
| --- | ---: |
| Enacted non-rebase items | +$64,623,968 |
| Governor non-rebase items | +$36,428,209 |
| **Residual** | **−$28,195,759** |

### Enacted non-rebase items

| Item | | Amount |
| ---: | --- | ---: |
| 100 | Rates for Personal Care Services (PCS) | +$70,800,000 |
| 101 | Innovations Waiver Direct Care Worker Wages | +$21,300,000 |
| 106 | Medicaid Enterprise System | +$12,700,000 |
| 103 | Healthy Opportunities Pilot | +$9,000,000 |
| 112 | Medicaid Fraud, Waste, and Abuse Technology | +$1,503,325 |
| 94 | Compensation Increase Reserve | +$933,700 |
| 111 | Program Integrity Positions | +$500,000 |
| 96, 97, 95 | Retirement, health plan, nurse salary adjustments | +$356,431 |
| 98 | Stabilization and Inflation Reserve Transfer | −$22,078,021 |
| 105 | Replacement for the NC Health Works Start-up | −$12,800,000 |
| 114 | Replacement Hospital Receipts | −$10,750,000 |
| 102 | Medicaid Transformation Fund Transfer | −$6,841,467 |
| | **Total** | **+$64,623,968** |

### Governor non-rebase items

| Item | | Amount |
| ---: | --- | ---: |
| 10 | Managed Care Oversight | +$13,666,009 |
| 11 | Medicaid Enterprise System | +$12,679,077 |
| 9 | Innovation Waiver Slots | +$9,339,600 |
| 1 | Compensation Increase Reserve | +$1,132,000 |
| 3 | State Health Plan Contributions | +$148,383 |
| 2 | Retiree Supplement (nonrecurring) | +$122,224 |
| 6 | Vacant Position Reductions | −$659,084 |
| 4, 5, 8 | NC Health Works administration and services; reentry health coverage | $0 |
| | **Total** | **+$36,428,209** |

### Which of the five candidate explanations applies

| Candidate | Verdict |
| --- | --- |
| Other explicit Governor reductions | **Partly.** One item, Vacant Position Reductions at −$659,084. It accounts for 2% of the residual. |
| Receipts or federal matching changes | **No.** Both figures are net appropriations with receipts already removed. The enacted rebase nets $1,811,373,067 of receipts out on its own line. |
| Items in another Medicaid budget code | **No.** Both sides sum exactly to their own document's stated change for 14445, so nothing is missing to another code. |
| Scope differences between the two budgets | **Yes, and this is the explanation.** The two budgets fund different sets of non-rebase items. |
| Extraction or classification error | **No.** Ruled out by the exact reconciliation in section 1. |

**The substance of it.** Three enacted items have no counterpart in the Governor's budget at all —
Personal Care Services rates ($70,800,000), Innovations Waiver direct care worker wages
($21,300,000) and the Healthy Opportunities Pilot ($9,000,000), together $101,100,000. The enacted
budget also takes larger offsetting reductions than the Governor does, chiefly the Stabilization and
Inflation Reserve transfer (−$22,078,021) and the NC Health Works start-up replacement
(−$12,800,000). The Governor in turn funds items the enacted budget does not, notably Managed Care
Oversight ($13,666,009) and Innovation Waiver Slots ($9,339,600). Netting all of that gives
−$28,195,759.

So the residual does **not** mean the Governor recommends less for Medicaid overall. It means the
Governor concentrates the increase in the rebase and does not carry several targeted enacted items.

---

## 4. Verdict

Both conditions are met:

- **The rebase reconciles independently**: identical item on both sides, same base, both net of
  receipts, bridge +$199,997,722.
- **The residual reconciles independently**: it decomposes exactly into identified items on both
  sides, and each side's items sum to its own document's printed total.

The split can therefore be built safely, on the same pattern as the other two: score
+$199,997,722 recurring on a Medicaid rebase decision, and reduce the Health Benefits aggregate to
−$28,195,759 so the two sum back to +$171,801,963.

**Not implemented, per the instruction to audit only.** Two points would need carrying onto the
cards if it goes ahead:

1. **The aggregate option would become negative** — the Governor recommending $28,195,759 less than
   enacted for everything other than the rebase. That reads oddly beside a rebase increase of
   $200m unless the card says why, so it should name the three enacted items the Governor does not
   carry.
2. **The federal match caveat matters more here than anywhere else.** Both figures are General Fund
   appropriations with receipts netted out, so the card shows the state's share only. A change in
   the state share moves considerably more total health spending, and the existing Medicaid card
   already says so; the split would need to keep that.
