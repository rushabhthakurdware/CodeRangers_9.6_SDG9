def explain_selection(selected, budget, spent):
    if not selected:
        return "No repairs could be selected within the available budget."

    explanation = (
        f"Selected {len(selected)} repairs that deliver the highest "
        f"risk reduction per rupee while staying within the ₹{budget:,} budget. "
        f"This combination maximizes overall infrastructure impact without "
        f"overcommitting funds."
    )

    return explanation
