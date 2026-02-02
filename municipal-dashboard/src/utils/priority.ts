export interface PriorityFactors {
  riskSeverity: number;   // 0–100
  citizenReports: number; // 0–100
  assetAge: number;       // 0–100
  costImpact: number;     // 0–100
}

export function calculatePriorityScore(factors: PriorityFactors): number {
  const { riskSeverity, citizenReports, assetAge, costImpact } = factors;

  const score =
    riskSeverity * 0.4 +
    citizenReports * 0.3 +
    assetAge * 0.2 +
    costImpact * 0.1;

  return Math.round(score);
}

export function getPriorityLabel(score: number): "P1" | "P2" | "P3" {
  if (score >= 75) return "P1";
  if (score >= 50) return "P2";
  return "P3";
}
