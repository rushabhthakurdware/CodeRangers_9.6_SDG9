# Change "def select_repairs" to "def compute_priority" 
# OR add the logic for scoring here.

def compute_priority(data: dict):
    # Based on your demo_decision_flow.py, this function 
    # should return a dict with score, level, and explanation.
    
    # Placeholder logic to satisfy your tests:
    score = (data['damage_severity'] * 0.4) + (data['location_criticality'] * 0.4) + (data['usage_impact'] * 0.2)
    
    return {
        "priority_score": round(score, 2),
        "priority_level": "P1" if score > 0.7 else "P2",
        "explanation": "High impact area with significant damage."
    }

def select_repairs(issues, budget):
    """
    issues = [
      { "id": X, "priority_score": 0.82, "repair_cost": 12000 }
    ]
    """
    if budget <= 0:
        return [], 0

    issues = sorted(
        issues,
        key=lambda x: x["priority_score"] / x["repair_cost"],
        reverse=True
    )

    selected = []
    total_cost = 0

    for issue in issues:
        if total_cost + issue["repair_cost"] <= budget:
            selected.append(issue)
            total_cost += issue["repair_cost"]

    return selected, total_cost
