def select_repairs(issues, budget):
    """
    issues = [
      { "id": X, "priority_score": 0.82, "repair_cost": 12000 }
    ]
    """

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
