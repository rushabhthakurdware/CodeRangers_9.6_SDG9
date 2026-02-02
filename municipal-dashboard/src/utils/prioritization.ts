import type { Asset } from '@/lib/types';
  export function calculatePriorityScore(asset: Asset): number {
  const riskWeight = 0.5;
  const impactWeight = 0.3;
  const slaWeight = 0.2;

  const slaFactor = asset.slaDays <= 2 ? 100 : asset.slaDays <= 5 ? 70 : 40;

  return (
    asset.riskScore * riskWeight +
    asset.impact * 10 * impactWeight +
    slaFactor * slaWeight
  );
}
