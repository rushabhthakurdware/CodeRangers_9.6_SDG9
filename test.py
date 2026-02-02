#!/usr/bin/env python3
"""
Test script for the Decision Intelligence API
"""

import requests
import json

BASE_URL = "http://localhost:5000"


def test_health():
    """Test health endpoint"""
    print("\n=== Testing /health ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_analyze_issue():
    """Test analyze-issue endpoint"""
    print("\n=== Testing /analyze-issue ===")
    
    payload = {
        "report": {
            "damage_severity": 0.78,
            "confidence_score": 0.82,
            "days_unresolved": 14,
            "lat": 18.5204,
            "lon": 73.8567
        },
        "asset": {
            "asset_type": "road",
            "severity_level": "severe",
            "geometry": {"area_m2": 3.2}
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/analyze-issue",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_analyze_budget():
    """Test analyze-budget endpoint (alias)"""
    print("\n=== Testing /analyze-budget ===")
    
    payload = {
        "report": {
            "damage_severity": 0.78,
            "confidence_score": 0.82,
            "days_unresolved": 14,
            "lat": 18.5204,
            "lon": 73.8567
        },
        "asset": {
            "asset_type": "road",
            "severity_level": "severe",
            "geometry": {"area_m2": 3.2}
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/analyze-budget",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_optimize_budget():
    """Test optimize-budget endpoint"""
    print("\n=== Testing /optimize-budget ===")
    
    payload = {
        "issues": [
            {"id": 1, "priority_score": 0.82, "repair_cost": 12000},
            {"id": 2, "priority_score": 0.65, "repair_cost": 8000},
            {"id": 3, "priority_score": 0.90, "repair_cost": 5000},
            {"id": 4, "priority_score": 0.55, "repair_cost": 15000}
        ],
        "budget": 50000
    }
    
    response = requests.post(
        f"{BASE_URL}/optimize-budget",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


if __name__ == "__main__":
    print("Starting API tests...")
    print("Make sure the Flask server is running on http://localhost:5000")
    
    tests = [
        ("Health Check", test_health),
        ("Analyze Issue", test_analyze_issue),
        ("Analyze Budget", test_analyze_budget),
        ("Optimize Budget", test_optimize_budget)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, "PASS" if success else "FAIL"))
        except Exception as e:
            print(f"Error: {e}")
            results.append((name, "ERROR"))
    
    print("\n" + "="*50)
    print("TEST RESULTS")
    print("="*50)
    for name, status in results:
        print(f"{name:30} {status}")