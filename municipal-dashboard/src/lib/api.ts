// export async function fetchDashboardStats() {
//   return {
//     highRisk: 12,
//     pending: 37,
//     budgetUsed: "62%",
//     avgTime: "18 days"
//   };
// }

// export async function fetchRepairs() {
//   return [
//     {
//       id: "R-102",
//       asset: "Road Segment A12",
//       priority: "P1",
//       score: 0.91,
//       cost: 120000,
//       explanation: "High severity damage near hospital zone",
//     },
//     {
//       id: "R-221",
//       asset: "Bridge Joint B4",
//       priority: "P2",
//       score: 0.68,
//       cost: 80000,
//       explanation: "Moderate damage with growing reports",
//     },
//   ];
// }

// export async function fetchPriorityStats() {
//   return [
//     { priority: "P1", count: 8 },
//     { priority: "P2", count: 14 },
//     { priority: "P3", count: 15 },
//   ];
// }

// export async function fetchRiskMapData() {
//   return [
//     {
//       id: "A12",
//       lat: 18.5204,
//       lng: 73.8567,
//       priority: "P1",
//       score: 0.92,
//       asset: "Road Segment A12",
//     },
//     {
//       id: "B07",
//       lat: 18.528,
//       lng: 73.859,
//       priority: "P2",
//       score: 0.67,
//       asset: "Drainage Line B07",
//     },
//   ];
// }

// export async function fetchBudgetScenario() {
//   return {
//     budget: 500000,
//     repairs: [
//       { id: "R-102", cost: 120000, priority: 0.91 },
//       { id: "R-221", cost: 80000, priority: 0.68 },
//       { id: "R-331", cost: 200000, priority: 0.85 },
//     ],
//   };
// }
// lib/api.ts
// Typed API functions with mock implementations (ready for backend integration)

import type {
  Asset,
  DashboardStats,
  PriorityStats,
  Repair,
  Budget,
  RiskMapPoint,
  BudgetScenario,
  ApiResponse,
} from '@/lib/types';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * DASHBOARD APIs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Fetch KPI statistics for dashboard home page
 * @returns Dashboard statistics (high risk count, pending repairs, etc)
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/dashboard/stats');
  // return response.json();

  return {
    highRisk: 12,
    pending: 37,
    budgetUsed: '62%',
    avgTime: '18 days',
    totalAssets: 156,
    lastUpdated: new Date(),
  };
}

/**
 * Fetch priority distribution for chart
 * @returns Array of priority level counts
 */
export async function fetchPriorityStats(): Promise<PriorityStats[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/dashboard/priority-stats');
  // return response.json();

  return [
    { priority: 'P1', count: 8, percentage: 20 },
    { priority: 'P2', count: 14, percentage: 35 },
    { priority: 'P3', count: 18, percentage: 45 },
  ];
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * REPAIR APIs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Fetch all assets for repair prioritization
 * @returns Array of infrastructure assets
 */
export async function fetchAssets(): Promise<Asset[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/assets');
  // return response.json();

  return [
    {
      id: 1,
      name: 'Bridge – Sector 12',
      type: 'Bridge',
      priority: 'P1',
      riskScore: 92,
      lat: 28.6139,
      lng: 77.2090,
      impact: 9,
      repairCost: 45,
      slaDays: 2,
      daysUnresolved: 14,
      confidence: 0.82,
    },
    {
      id: 2,
      name: 'Main Road – Block B',
      type: 'Road',
      priority: 'P2',
      riskScore: 76,
      lat: 28.6120,
      lng: 77.2150,
      impact: 9,
      repairCost: 45,
      slaDays: 5,
      daysUnresolved: 7,
      confidence: 0.71,
    },
    {
      id: 3,
      name: 'Water Pipeline – Zone 4',
      type: 'Pipeline',
      priority: 'P3',
      riskScore: 54,
      lat: 28.6185,
      lng: 77.2025,
      impact: 6,
      repairCost: 25,
      slaDays: 10,
      daysUnresolved: 2,
      confidence: 0.65,
    },
  ];
}

/**
 * Fetch all repairs (already prioritized)
 * @returns Array of repair requests sorted by priority
 */
export async function fetchRepairs(): Promise<Repair[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/repairs');
  // return response.json();

  return [
    {
      id: 'R-102',
      assetId: 1,
      assetName: 'Bridge – Sector 12',
      priority: 'P1',
      estimatedCost: 200,
      estimatedDays: 10,
      decisionScore: 0.91,
      explanation: 'High severity damage near hospital zone with sustained reports',
      status: 'pending',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-29'),
    },
    {
      id: 'R-221',
      assetId: 2,
      assetName: 'Main Road – Block B',
      priority: 'P2',
      estimatedCost: 150,
      estimatedDays: 7,
      decisionScore: 0.68,
      explanation: 'Moderate damage with growing crowd reports',
      status: 'pending',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-28'),
    },
  ];
}

/**
 * Fetch a single asset by ID
 * @param id Asset ID
 * @returns Single asset or null
 */
export async function fetchAssetById(id: number): Promise<Asset | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/assets/${id}`);
  // return response.json();

  const assets = await fetchAssets();
  return assets.find((a) => a.id === id) || null;
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * BUDGET APIs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Fetch current budget information
 * @returns Budget data with totals and usage
 */
export async function fetchBudget(): Promise<Budget> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/budget');
  // return response.json();

  const totalBudget = 500;
  const usedBudget = 320;

  return {
    totalBudget,
    usedBudget,
    remainingBudget: totalBudget - usedBudget,
    currencyUnit: 'lakhs',
  };
}

/**
 * Fetch budget optimization scenario
 * Shows what repairs can be done with available budget
 * @param budget Available budget in lakhs
 * @returns Scenario with selected repairs and utilization
 */
export async function fetchBudgetScenario(
  budget: number
): Promise<BudgetScenario> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/budget/scenario?budget=${budget}`);
  // return response.json();

  const repairs = [
    { id: 'R-102', cost: 200, priority: 0.91 },
    { id: 'R-221', cost: 150, priority: 0.72 },
    { id: 'R-331', cost: 200, priority: 0.55 },
  ];

  // Greedy selection: highest priority first
  let totalCost = 0;
  const selected: string[] = [];

  for (const repair of repairs) {
    if (totalCost + repair.cost <= budget) {
      selected.push(repair.id);
      totalCost += repair.cost;
    }
  }

  return {
    budget,
    repairs,
    selected,
    totalCost,
    utilizationRate: totalCost / budget,
  };
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MAP APIs
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Fetch risk map data points
 * @returns Array of risk map points (assets with location)
 */
export async function fetchRiskMapData(): Promise<RiskMapPoint[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/map/risk-points');
  // return response.json();

  return [
    {
      id: 'A12',
      lat: 28.6139,
      lng: 77.2090,
      priority: 'P1',
      score: 0.92,
      asset: 'Bridge – Sector 12',
      riskLevel: 'critical',
    },
    {
      id: 'B07',
      lat: 28.6120,
      lng: 77.2150,
      priority: 'P2',
      score: 0.68,
      asset: 'Main Road – Block B',
      riskLevel: 'high',
    },
    {
      id: 'Z04',
      lat: 28.6185,
      lng: 77.2025,
      priority: 'P3',
      score: 0.54,
      asset: 'Water Pipeline – Zone 4',
      riskLevel: 'medium',
    },
  ];
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ERROR HANDLING & UTILITIES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

/**
 * Mock API error for demo purposes
 * Remove in production
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Wrapper for future API calls
 * Handles auth, errors, logging
 */
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // TODO: Implement proper API client
  // - Add auth headers
  // - Handle rate limiting
  // - Retry logic
  // - Error standardization

  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getToken()}`,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `API error: ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}