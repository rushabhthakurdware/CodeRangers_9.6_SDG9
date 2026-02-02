// export const PRIORITY_META = {
//   P1: {
//     label: "Critical",
//     color: "destructive",
//   },
//   P2: {
//     label: "High",
//     color: "warning",
//   },
//   P3: {
//     label: "Moderate",
//     color: "secondary",
//   },
// } as const;
// lib/constants.ts
// Centralized constants for the application

import type { PriorityLevel } from '@/lib/types';

/**
 * Priority level metadata (colors, labels, descriptions)
 */
export const PRIORITY_META: Record<PriorityLevel, { label: string; color: string; description: string }> = {
  P1: {
    label: 'Critical',
    color: 'destructive', // Red - danger
    description: 'Immediate action required. Safety risk.',
  },
  P2: {
    label: 'High',
    color: 'warning', // Orange - warning
    description: 'Should be addressed within 2-5 days.',
  },
  P3: {
    label: 'Moderate',
    color: 'secondary', // Green - success
    description: 'Can be scheduled within 5+ days.',
  },
} as const;

/**
 * SLA (Service Level Agreement) days by priority
 */
export const SLA_DAYS: Record<PriorityLevel, number> = {
  P1: 2,
  P2: 5,
  P3: 10,
} as const;

/**
 * Risk score thresholds for classification
 */
export const RISK_THRESHOLDS = {
  CRITICAL: 80,  // >= 80: Critical risk
  HIGH: 60,      // >= 60: High risk
  MEDIUM: 40,    // >= 40: Medium risk
  LOW: 0,        // < 40: Low risk
} as const;

/**
 * Impact score ranges
 */
export const IMPACT_RANGES = {
  VERY_HIGH: { min: 9, max: 10, label: 'Very High (9000+ affected)' },
  HIGH: { min: 7, max: 8, label: 'High (1000-9000 affected)' },
  MEDIUM: { min: 5, max: 6, label: 'Medium (100-1000 affected)' },
  LOW: { min: 1, max: 4, label: 'Low (<100 affected)' },
} as const;

/**
 * Asset types
 */
export const ASSET_TYPES = {
  ROAD: 'Road',
  BRIDGE: 'Bridge',
  PIPELINE: 'Pipeline',
  DRAINAGE: 'Drainage',
  POLE: 'Pole',
  INTERSECTION: 'Intersection',
} as const;

/**
 * Repair status options
 */
export const REPAIR_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

/**
 * Budget currency options
 */
export const CURRENCY = {
  LAKHS: 'lakhs',      // Indian currency (1 lakh = 100,000)
  CRORES: 'crores',    // Indian currency (1 crore = 10 million)
  USD: 'USD',
} as const;

/**
 * Damage severity levels
 */
export const DAMAGE_SEVERITY = {
  MINOR: 'minor',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  CRITICAL: 'critical',
} as const;

/**
 * Confidence score ranges
 */
export const CONFIDENCE_RANGES = {
  VERY_HIGH: { min: 0.8, max: 1.0, label: 'Very High (80-100%)' },
  HIGH: { min: 0.6, max: 0.79, label: 'High (60-79%)' },
  MEDIUM: { min: 0.4, max: 0.59, label: 'Medium (40-59%)' },
  LOW: { min: 0.0, max: 0.39, label: 'Low (<40%)' },
} as const;

/**
 * Priority scoring weights
 * Used in prioritization algorithm
 */
export const PRIORITY_WEIGHTS = {
  RISK_SEVERITY: 0.3,        // 30% - How severe the damage is
  LOCATION_CRITICALITY: 0.25, // 25% - How critical the location is
  USAGE_IMPACT: 0.2,          // 20% - How many people are affected
  CONFIDENCE_SCORE: 0.15,     // 15% - How confident we are in the report
  TIME_FACTOR: 0.1,           // 10% - How long it's been unresolved
} as const;

/**
 * Priority score thresholds for classification
 */
export const PRIORITY_SCORE_THRESHOLDS = {
  P1: { min: 0.75, max: 1.0 },   // Critical: 75-100%
  P2: { min: 0.5, max: 0.75 },   // High: 50-75%
  P3: { min: 0.0, max: 0.5 },    // Moderate: 0-50%
} as const;

/**
 * Sorting options
 */
export const SORT_OPTIONS = [
  { value: 'priority', label: 'Priority (High to Low)' },
  { value: 'risk', label: 'Risk Score (High to Low)' },
  { value: 'impact', label: 'Impact (High to Low)' },
  { value: 'sla', label: 'SLA (Urgent First)' },
  { value: 'cost', label: 'Cost (High to Low)' },
] as const;

/**
 * Map default configuration
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 28.6139, lng: 77.209 } as const,
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
} as const;

/**
 * UI Colors
 */
export const UI_COLORS = {
  P1: '#dc2626',        // Red for critical
  P2: '#f97316',        // Orange for high
  P3: '#16a34a',        // Green for moderate
  SUCCESS: '#22c55e',
  WARNING: '#eab308',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

/**
 * Time formats
 */
export const TIME_FORMATS = {
  DATE: 'MMM dd, yyyy',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * API endpoints (for future backend integration)
 */
export const API_ENDPOINTS = {
  DASHBOARD: '/api/dashboard',
  ASSETS: '/api/assets',
  REPAIRS: '/api/repairs',
  BUDGET: '/api/budget',
  MAP: '/api/map',
  REPORTS: '/api/reports',
  VALIDATION: '/api/validation',
  DECISIONS: '/api/decisions',
} as const;

/**
 * Toast/notification types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load data. Please try again.',
  SAVE_FAILED: 'Failed to save changes. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please contact support.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  CREATED: 'Item created successfully.',
  UPDATED: 'Item updated successfully.',
} as const;