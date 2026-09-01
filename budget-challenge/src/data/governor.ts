/**
 * Governor Stein's Recommended Budget for FY 2026-27, as published.
 *
 * GENERATED from the Budget Book (Office of State Budget and Management,
 * April 2026); do not hand-edit. Each entry carries the recommended FY 2026-27
 * General Fund net appropriation for a budget code, the certified base the
 * Governor measured from, and the largest constituent recommendations with
 * their printed page numbers and item numbers.
 *
 * READ THIS BEFORE USING THESE FIGURES. The Governor's document measures its
 * changes from the NOVEMBER 2025 CERTIFIED BUDGET, not from what the General
 * Assembly later enacted in S.L. 2026-41. So the Governor's own published
 * 'change' columns are NOT the difference from the enacted budget, and adding
 * them to an enacted figure would double-count. What is comparable is the
 * recommended LEVEL against the enacted LEVEL: two published FY 2026-27 net
 * appropriations for the same budget code. Every option built from this file
 * uses that difference and shows the arithmetic.
 */

export interface GovernorItem {
  /** Printed page number in the Budget Book. */
  page: string
  /** Item number within the agency's recommendation list. */
  item: number
  title: string
  recurring: number
  nonrecurring: number
}

export interface GovernorRecommendation {
  /** The decision in this project the recommendation is comparable to. */
  decisionId: string
  /** Budget codes making up the comparison. */
  codes: string[]
  /** Agency names as the Budget Book prints them. */
  names: string[]
  /** Printed page(s) where the recommendation appears. */
  pages: string[]
  /** FY 2026-27 net appropriation in the November 2025 certified budget. */
  certified: number
  /** FY 2026-27 net appropriation the Governor recommends. */
  recommended: number
  /** The Governor's own published change from the certified base. */
  changeFromCertified: { recurring: number; nonrecurring: number }
  /** The largest constituent recommendations, for the option's description. */
  topItems: GovernorItem[]
}

export const GOVERNOR_RECOMMENDATIONS: GovernorRecommendation[] = [
  {
    decisionId: 'public-instruction',
    codes: ['13510'],
    names: ["Public Instruction - General Fund"],
    pages: ['70'],
    certified: 11_947_021_283,
    recommended: 13_604_577_403,
    changeFromCertified: {
      recurring: 1_161_654_857,
      nonrecurring: 495_901_263,
    },
    topItems: [
      {
        page: '70',
        item: 1,
        title: "Compensation Increase \u2013 Teachers and Instructional Support",
        recurring: 734_368_000,
        nonrecurring: 0,
      },
      {
        page: '71',
        item: 7,
        title: "State Employee Bonus - Public School Personnel",
        recurring: 0,
        nonrecurring: 253_737_000,
      },
      {
        page: '70',
        item: 5,
        title: "Compensation Increase Reserve - Non-Certified and Central Office Staff",
        recurring: 103_250_000,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'residential-schools',
    codes: ['13520', '13530', '13540'],
    names: ["Governor Morehead School General Fund", "NC School for the Deaf General Fund", "Eastern NC School for the Deaf General Fund"],
    pages: ['77', '83', '80'],
    certified: 32_534_815,
    recommended: 36_120_976,
    changeFromCertified: {
      recurring: 2_969_106,
      nonrecurring: 617_055,
    },
    topItems: [
      {
        page: '83',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 726_000,
        nonrecurring: 0,
      },
      {
        page: '80',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 549_000,
        nonrecurring: 0,
      },
      {
        page: '77',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 499_000,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'community-college-system',
    codes: ['16800'],
    names: ["NC Community College System - General Fund"],
    pages: ['85'],
    certified: 1_670_600_008,
    recommended: 1_880_055_057,
    changeFromCertified: {
      recurring: 170_018_425,
      nonrecurring: 39_436_624,
    },
    topItems: [
      {
        page: '85',
        item: 2,
        title: "Compensation Increase Reserve - Community Colleges",
        recurring: 80_350_000,
        nonrecurring: 0,
      },
      {
        page: '86',
        item: 10,
        title: "Enrollment Growth Adjustment",
        recurring: 76_021_725,
        nonrecurring: 0,
      },
      {
        page: '85',
        item: 4,
        title: "State Employee Bonus - Community Colleges",
        recurring: 0,
        nonrecurring: 30_335_000,
      },
    ],
  },
  {
    decisionId: 'unc-need-based-aid',
    codes: ['16011', '16012'],
    names: ["UNC Board of Governors - Institutional Programs", "UNC Board of Governors - Related Educational Programs"],
    pages: ['89', '91'],
    certified: 1_060_413_925,
    recommended: 505_470_535,
    changeFromCertified: {
      recurring: -33_096_751,
      nonrecurring: -521_846_639,
    },
    topItems: [
      {
        page: '91',
        item: 3,
        title: "Opportunity Scholarship Moratorium",
        recurring: -454_500_000,
        nonrecurring: -587_500_000,
      },
      {
        page: '89',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 198_248_000,
        nonrecurring: 0,
      },
      {
        page: '89',
        item: 6,
        title: "UNC System Enrollment Growth Adjustment",
        recurring: 153_495_386,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'medicaid-health-benefits',
    codes: ['14445'],
    names: ["DHHS - Health Benefits - General Fund"],
    pages: ['173'],
    certified: 6_544_062_901,
    recommended: 7_627_688_832,
    changeFromCertified: {
      recurring: 1_083_503_707,
      nonrecurring: 122_224,
    },
    topItems: [
      {
        page: '174',
        item: 7,
        title: "Medicaid Rebase",
        recurring: 1_047_197_722,
        nonrecurring: 0,
      },
      {
        page: '174',
        item: 10,
        title: "Managed Care Oversight",
        recurring: 13_666_009,
        nonrecurring: 0,
      },
      {
        page: '174',
        item: 11,
        title: "Medicaid Enterprise System",
        recurring: 12_679_077,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'behavioral-health',
    codes: ['14460'],
    names: ["DHHS - Mental Health/Developmental Disabilities/Substance Abuse Services"],
    pages: ['183'],
    certified: 801_360_836,
    recommended: 852_018_243,
    changeFromCertified: {
      recurring: 48_963_230,
      nonrecurring: 1_694_177,
    },
    topItems: [
      {
        page: '183',
        item: 3,
        title: "Nurse Salary Increase",
        recurring: 21_207_285,
        nonrecurring: 0,
      },
      {
        page: '184',
        item: 6,
        title: "Behavioral Health Units",
        recurring: 12_000_000,
        nonrecurring: 0,
      },
      {
        page: '183',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 8_731_000,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'child-development',
    codes: ['14420'],
    names: ["DHHS - Child Development and Early Education"],
    pages: ['163'],
    certified: 286_033_683,
    recommended: 357_126_631,
    changeFromCertified: {
      recurring: 71_080_092,
      nonrecurring: 12_856,
    },
    topItems: [
      {
        page: '163',
        item: 4,
        title: "Child Care Subsidy Federal Compliance and Statewide Rate Floor",
        recurring: 60_000_000,
        nonrecurring: 0,
      },
      {
        page: '164',
        item: 5,
        title: "NC Pre-K Program Investment",
        recurring: 11_000_000,
        nonrecurring: 0,
      },
      {
        page: '163',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 118_000,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'environmental-quality',
    codes: ['14300'],
    names: ["Department of Environmental Quality - General Fund"],
    pages: ['233'],
    certified: 107_591_615,
    recommended: 177_714_471,
    changeFromCertified: {
      recurring: 9_680_134,
      nonrecurring: 60_442_722,
    },
    topItems: [
      {
        page: '237',
        item: 22,
        title: "Viable Utility Reserve",
        recurring: 0,
        nonrecurring: 15_000_000,
      },
      {
        page: '236',
        item: 17,
        title: "Statewide Flood Resiliency Blueprint and Project Implementation",
        recurring: 748_849,
        nonrecurring: 10_000_000,
      },
      {
        page: '234',
        item: 9,
        title: "PFAS \u2013 Bernard Allen Emergency Drinking Water Fund",
        recurring: 200_000,
        nonrecurring: 10_000_000,
      },
    ],
  },
  {
    decisionId: 'natural-cultural-resources',
    codes: ['14800'],
    names: ["Department of Natural and Cultural Resources - General Fund"],
    pages: ['257'],
    certified: 279_939_967,
    recommended: 336_482_888,
    changeFromCertified: {
      recurring: 40_924_469,
      nonrecurring: 15_618_452,
    },
    topItems: [
      {
        page: '259',
        item: 17,
        title: "State Parks Operating Shortfall",
        recurring: 12_802_419,
        nonrecurring: 0,
      },
      {
        page: '259',
        item: 18,
        title: "Zoo Asia Operating Reserve",
        recurring: 7_124_438,
        nonrecurring: 1_274_400,
      },
      {
        page: '257',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 5_822_000,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'adult-correction',
    codes: ['15010'],
    names: ["Adult Correction - General Fund"],
    pages: ['203'],
    certified: 2_054_220_247,
    recommended: 2_301_698_762,
    changeFromCertified: {
      recurring: 198_952_009,
      nonrecurring: 48_526_506,
    },
    topItems: [
      {
        page: '203',
        item: 5,
        title: "Correctional Officer Salary Increase",
        recurring: 82_554_010,
        nonrecurring: 0,
      },
      {
        page: '204',
        item: 10,
        title: "Medical and Pharmaceutical Services",
        recurring: 40_000_000,
        nonrecurring: 0,
      },
      {
        page: '203',
        item: 2,
        title: "State Employee Bonus",
        recurring: 0,
        nonrecurring: 27_494_000,
      },
    ],
  },
  {
    decisionId: 'courts',
    codes: ['12000'],
    names: ["Judicial - AOC - General Fund"],
    pages: ['192'],
    certified: 802_339_122,
    recommended: 877_409_507,
    changeFromCertified: {
      recurring: 55_209_350,
      nonrecurring: 19_861_035,
    },
    topItems: [
      {
        page: '192',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 35_634_000,
        nonrecurring: 0,
      },
      {
        page: '192',
        item: 2,
        title: "State Employee Bonus",
        recurring: 0,
        nonrecurring: 10_976_000,
      },
      {
        page: '193',
        item: 8,
        title: "Criminal Justice Information Network Transfer",
        recurring: 7_633_904,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'indigent-defense',
    codes: ['12001'],
    names: ["Judicial - AOC - Indigent Defense Services"],
    pages: ['195'],
    certified: 161_780_887,
    recommended: 182_710_624,
    changeFromCertified: {
      recurring: 9_174_070,
      nonrecurring: 11_755_667,
    },
    topItems: [
      {
        page: '196',
        item: 10,
        title: "Private Assigned Counsel Funding Gap",
        recurring: 0,
        nonrecurring: 10_000_000,
      },
      {
        page: '195',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 4_722_000,
        nonrecurring: 0,
      },
      {
        page: '196',
        item: 9,
        title: "Additional Staffing to Respond to Iryna\u2019s Law",
        recurring: 2_904_399,
        nonrecurring: 132_832,
      },
    ],
  },
  {
    decisionId: 'elections',
    codes: ['18025'],
    names: ["State Board of Elections - General"],
    pages: ['151'],
    certified: 10_999_729,
    recommended: 13_108_296,
    changeFromCertified: {
      recurring: 1_726_146,
      nonrecurring: 382_421,
    },
    topItems: [
      {
        page: '151',
        item: 5,
        title: "Securing Election Integrity",
        recurring: 1_000_000,
        nonrecurring: 250_000,
      },
      {
        page: '151',
        item: 1,
        title: "Compensation Increase Reserve",
        recurring: 420_000,
        nonrecurring: 0,
      },
      {
        page: '152',
        item: 7,
        title: "Improving Voter Services",
        recurring: 254_806,
        nonrecurring: 0,
      },
    ],
  },
  {
    decisionId: 'information-technology-operations',
    codes: ['14660'],
    names: ["Governor's Office - Information Technology Services"],
    pages: ['142'],
    certified: 75_092_542,
    recommended: 129_861_153,
    changeFromCertified: {
      recurring: 45_010_532,
      nonrecurring: 9_758_079,
    },
    topItems: [
      {
        page: '142',
        item: 5,
        title: "Essential Cybersecurity Upgrades for State and Local Government",
        recurring: 39_250_000,
        nonrecurring: 5_000_000,
      },
      {
        page: '143',
        item: 6,
        title: "User-Friendly and Secure Online Access to Government Services",
        recurring: 3_500_000,
        nonrecurring: 2_000_000,
      },
      {
        page: '143',
        item: 7,
        title: "Artificial Intelligence",
        recurring: 1_100_000,
        nonrecurring: 1_000_000,
      },
    ],
  },
]

export const GOVERNOR_BY_DECISION = new Map(
  GOVERNOR_RECOMMENDATIONS.map((r) => [r.decisionId, r]),
)
