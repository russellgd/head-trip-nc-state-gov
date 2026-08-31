/**
 * A decorative reference to North Carolina's geography: the west-to-east
 * elevation profile, from the mountains through the piedmont to the sounds and
 * barrier islands of the coast.
 *
 * It is a stylised profile line, not a map and not a state outline, and it
 * carries no seal, emblem, or official mark. Hidden from assistive technology,
 * because it conveys nothing a reader needs.
 */
export function GeographyBand({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Mountains, piedmont, coastal plain, then the sounds and the barrier islands. */}
      <path
        d="M0 78 L40 30 L70 52 L96 22 L130 46 L162 18 L196 44 L232 34 L286 56 L360 50
           L470 62 L620 66 L820 70 L980 72 L1030 71 L1060 74 L1096 72 L1130 75 L1200 74 L1200 80 L0 80 Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M0 78 L40 30 L70 52 L96 22 L130 46 L162 18 L196 44 L232 34 L286 56 L360 50
           L470 62 L620 66 L820 70 L980 72 L1030 71 L1060 74 L1096 72 L1130 75 L1200 74"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  )
}
