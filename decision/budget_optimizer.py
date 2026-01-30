# decision/budget_optimizer.py

def select_repairs(repairs, budget):
    """
    repairs: list of dicts
      {
        "id": int,
        "cost": int,
        "priority": float
      }
    budget: int
    """

    # compute value score
    for r in repairs:
        r["value"] = r["priority"] / r["cost"]

    # sort by impact per cost
    repairs_sorted = sorted(repairs, key=lambda x: x["value"], reverse=True)

    selected = []
    spent = 0

    for r in repairs_sorted:
        if spent + r["cost"] <= budget:
            selected.append(r)
            spent += r["cost"]

    return {
        "selected_repairs": [r["id"] for r in selected],
        "budget_used": spent,
        "utilization": round(spent / budget, 2)
    }

