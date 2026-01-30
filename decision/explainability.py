def explain_selection(selected, budget, spent):
    if budget <= 0:
        return "No budget was available for repairs."

    if not selected:
        return (
            "No repairs were selected because all candidate repairs "
            "exceeded the available budget or had insufficient impact."
        )

    utilization = spent / budget

    return (
        f"Selected {len(selected)} repairs that provide the highest "
        f"infrastructure risk reduction per rupee within the ₹{budget:,} budget. "
        f"₹{spent:,} was allocated ({utilization:.0%} utilization), prioritizing "
        f"repairs with the greatest combined impact while respecting fiscal limits."
    )
