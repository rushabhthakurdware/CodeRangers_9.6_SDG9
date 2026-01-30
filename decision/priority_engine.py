# decision/priority_engine.py

WEIGHTS = {
    "severity": 0.30,
    "criticality": 0.25,
    "usage": 0.20,
    "confidence": 0.15,
    "time": 0.10
}

MAX_DAYS = 30  # cap time influence

def compute_time_score(days_unresolved: int) -> float:
    """
    Linearly increases urgency up to MAX_DAYS.
    """
    return min(days_unresolved / MAX_DAYS, 1.0)

def compute_priority(inputs: dict):
    """
    Computes explainable priority score.
    """

    time_score = compute_time_score(inputs["days_unresolved"])

    score = (
        WEIGHTS["severity"] * inputs["damage_severity"] +
        WEIGHTS["criticality"] * inputs["location_criticality"] +
        WEIGHTS["usage"] * inputs["usage_impact"] +
        WEIGHTS["confidence"] * inputs["confidence_score"] +
        WEIGHTS["time"] * time_score
    )

    score = round(score, 2)

    if score >= 0.75:
        level = "P1"
    elif score >= 0.5:
        level = "P2"
    else:
        level = "P3"

    explanation = generate_explanation(inputs, time_score, score)

    return {
        "priority_score": score,
        "priority_level": level,
        "explanation": explanation
    }

def generate_explanation(inputs, time_score, score):
    reasons = []

    if inputs["damage_severity"] > 0.7:
        reasons.append("high damage severity")

    if inputs["location_criticality"] > 0.7:
        reasons.append("critical location")

    if inputs["usage_impact"] > 0.6:
        reasons.append("significant public usage")

    if inputs["confidence_score"] > 0.75:
        reasons.append("strong crowd consensus")

    if time_score > 0.5:
        reasons.append("issue unresolved over time")

    reason_str = ", ".join(reasons[:3])  # keep it human-readable

    return f"Priority score {score} due to {reason_str}."
