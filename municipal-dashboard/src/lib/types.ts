// lib/types.ts
// Centralized type definitions for the entire application

/**
 * Asset Priority Levels
 * P1 = Critical (0-2 days SLA)
 * P2 = High (2-5 days SLA)
 * P3 = Moderate (5+ days SLA)
 */
export type PriorityLevel = 'P1' | 'P2' | 'P3';

/**
 * Asset Type Categories
 */
export type AssetType = 'Road' | 'Bridge' | 'Pipeline' | 'Drainage' | 'Pole' | 'Intersection';

/**
 * Infrastructure Asset
 * Core data structure for individual assets being tracked
 */
export interface Asset {
  id: number;
  name: string;
  type: AssetType;
  priority: PriorityLevel;
  riskScore: number;           // 0-100 (higher = more risky)
  impact: number;              // 1-10 (affected citizens/impact)
  slaDays: number;             // Service Level Agreement days
  repairCost: number;          // in lakhs (₹)
  lat: number;                 // Latitude
  lng: number;                 // Longitude
  daysUnresolved?: number;     // How many days issue reported
  confidence?: number;         // 0-1 (validation confidence)
}

/**
 * Decision Score Output
 * Result of priority calculation
 */
export interface DecisionScore {
  assetId: number;
  priorityScore: number;       // 0-1 or 0-100
  priorityLevel: PriorityLevel;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;         // Human-readable justification
  factors: {
    riskWeight: number;
    impactWeight: number;
    slaWeight: number;
    confidenceWeight: number;
  };
}

/**
 * Repair Request/Job
 * Represents a queued repair action
 */
export interface Repair {
  id: string;
  assetId: number;
  assetName: string;
  priority: PriorityLevel;
  estimatedCost: number;       // in lakhs
  estimatedDays: number;
  decisionScore: number;
  explanation: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Budget Information
 */
export interface Budget {
  totalBudget: number;         // in lakhs
  usedBudget: number;          // in lakhs
  remainingBudget: number;     // calculated
  currencyUnit: string;        // 'lakhs' or 'crores'
}

/**
 * Budget Scenario
 * For "what-if" analysis
 */
export interface BudgetScenario {
  budget: number;
  repairs: Array<{
    id: string;
    cost: number;
    priority: number;         // 0-1
  }>;
  selected?: string[];        // IDs of selected repairs
  totalCost?: number;
  utilizationRate?: number;   // 0-1
}

/**
 * Dashboard Statistics
 * KPI metrics shown on homepage
 */
export interface DashboardStats {
  highRisk: number;           // Count of P1 assets
  pending: number;            // Count of pending repairs
  budgetUsed: string;         // Percentage string (e.g., "62%")
  avgTime: string;            // Average resolution time
  totalAssets?: number;
  lastUpdated?: Date;
}

/**
 * Priority Distribution
 * For charts showing P1/P2/P3 breakdown
 */
export interface PriorityStats {
  priority: PriorityLevel;
  count: number;
  percentage?: number;
}

/**
 * Risk Map Data Point
 * Single location on the map
 */
export interface RiskMapPoint {
  id: string;
  lat: number;
  lng: number;
  priority: PriorityLevel;
  score: number;              // 0-1
  asset: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Crowd Report
 * Single citizen report for validation
 */
export interface CrowdReport {
  id: string;
  assetId: number;
  lat: number;
  lng: number;
  time: Date;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
}

/**
 * Validation Result
 * Output of crowd validation layer
 */
export interface ValidationResult {
  assetId: number;
  confidenceScore: number;    // 0-1
  clustered: boolean;
  reportCount: number;
  explanation: string;
}

/**
 * Damage Estimation
 * Output of perception layer
 */
export interface DamageEstimate {
  assetId: number;
  damageSeverity: 'minor' | 'moderate' | 'severe' | 'critical';
  severityScore: number;      // 0-1
  confidence: number;         // 0-1
  reasoning: string;
  measurements?: {
    crackLength?: number;
    crackWidth?: number;
    deformation?: string;
  };
}

/**
 * Navigation Item for Sidebar
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}

/**
 * API Response Wrapper
 * Standardized response format (for future backend)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp?: Date;
}

/**
 * Pagination
 * For future list endpoints
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}