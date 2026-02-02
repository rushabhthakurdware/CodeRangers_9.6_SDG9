// import { Badge } from "@/components/ui/badge";
// import { PRIORITY_META } from "@/lib/constants";

// export default function PriorityBadge({ level }: { level: "P1" | "P2" | "P3" }) {
//   const meta = PRIORITY_META[level];

//   return (
//     <Badge variant={meta.color as any}>
//       {level} · {meta.label}
//     </Badge>
//   );
// }
// components/common/PriorityBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_META } from "@/lib/constants";
import type { PriorityLevel } from "@/lib/types";

interface PriorityBadgeProps {
  level: PriorityLevel | string;
  showLabel?: boolean;
}

/**
 * Priority Badge Component
 * Displays a colored badge for priority levels (P1, P2, P3)
 * 
 * @param level - Priority level (P1, P2, P3)
 * @param showLabel - Whether to show the full label (default: true)
 * 
 * @example
 * <PriorityBadge level="P1" />
 * <PriorityBadge level="P2" showLabel={false} />
 */
export default function PriorityBadge({ 
  level = 'P3', 
  showLabel = true 
}: PriorityBadgeProps) {
  // Ensure level is a valid priority
  if (!level || !['P1', 'P2', 'P3'].includes(level as string)) {
    console.warn(`Invalid priority level: ${level}, defaulting to P3`);
    return (
      <Badge variant="secondary">
        {showLabel ? 'P3 · Moderate' : 'P3'}
      </Badge>
    );
  }

  const validLevel = level as PriorityLevel;
  const meta = PRIORITY_META[validLevel];

  // Fallback in case PRIORITY_META is not properly defined
  if (!meta) {
    console.error(`Priority metadata not found for level: ${validLevel}`);
    return (
      <Badge variant="secondary">
        {showLabel ? `${validLevel} · Unknown` : validLevel}
      </Badge>
    );
  }

  return (
    <Badge variant={meta.color as any}>
      {showLabel ? `${validLevel} · ${meta.label}` : validLevel}
    </Badge>
  );
}