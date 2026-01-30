def optimize_repairs(issues, budget):
    """
    Budget-aware greedy optimization (MVP heuristic).

    issues = [
      {
        "id": X,
        "priority_score": 0.82,
        "repair_cost": 12000
      }
    ]
    """

    if budget <= 0:
        return [], 0

    # Defensive filtering
    valid_issues = [
        i for i in issues
        if i.get("repair_cost", 0) > 0 and i.get("priority_score", 0) > 0
    ]

    # Compute value = impact per rupee
    for issue in valid_issues:
        issue["_value"] = issue["priority_score"] / issue["repair_cost"]

    # Greedy sort
    valid_issues.sort(key=lambda x: x["_value"], reverse=True)

    selected = []
    total_cost = 0

    for issue in valid_issues:
        if total_cost + issue["repair_cost"] <= budget:
            selected.append(issue)
            total_cost += issue["repair_cost"]

    return selected, total_cost
