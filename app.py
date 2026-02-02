from flask import Flask, request, jsonify

from decision import (
    compute_priority,
    estimate_repair_cost,
    optimize_repairs,
    validate_priority_input
)

from decision.state_code import get_state_code_offline, compute_location_criticality
from decision.usage_engine import compute_usage_impact

app = Flask(__name__)


# ----------------------------------------------------
# Health Check
# ----------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "active",
        "service": "Decision Intelligence Layer",
        "version": "1.0.0"
    })


# ----------------------------------------------------
# Analyze Single Issue
# ----------------------------------------------------
@app.route("/analyze-issue", methods=["POST"])
def analyze_issue():
    """
    Analyze a single infrastructure issue and compute priority + cost.
    
    Input:
    {
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
        "geometry": { "area_m2": 3.2 }
      }
    }
    """

    data = request.get_json(force=True)

    try:
        report = data["report"]
        asset = data["asset"]

        lat, lon = report["lat"], report["lon"]

        # ------------------------------------------------
        # Derived signals (Perception → Decision boundary)
        # ------------------------------------------------
        state_code = get_state_code_offline(lat, lon)
        location_criticality = compute_location_criticality(lat, lon)
        usage_impact = compute_usage_impact(lat, lon, asset["asset_type"])

        # ------------------------------------------------
        # Priority scoring input (validated)
        # ------------------------------------------------
        priority_input = {
            "damage_severity": report["damage_severity"],
            "location_criticality": location_criticality,
            "usage_impact": usage_impact,
            "confidence_score": report["confidence_score"],
            "days_unresolved": report["days_unresolved"]
        }

        validate_priority_input(priority_input)
        priority = compute_priority(priority_input)

        # ------------------------------------------------
        # Cost estimation
        # ------------------------------------------------
        cost = estimate_repair_cost(
            asset_type=asset["asset_type"],
            severity_level=asset["severity_level"],
            geometry=asset["geometry"],
            state_code=state_code,
            confidence_score=report["confidence_score"]
        )

        return jsonify({
            "priority": priority,
            "estimated_cost_inr": cost,
            "state_code": state_code,
            "location_criticality": location_criticality,
            "usage_impact": usage_impact,
            "status": "success"
        })

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------------------
# Analyze Budget (Alias for analyze-issue)
# ----------------------------------------------------
@app.route("/analyze-budget", methods=["POST"])
def analyze_budget():
    """
    Alias endpoint for analyze-issue.
    Accepts the same input format.
    """
    return analyze_issue()


# ----------------------------------------------------
# Budget Optimization
# ----------------------------------------------------
@app.route("/optimize-budget", methods=["POST"])
def optimize_budget():
    """
    Optimize repair selection based on budget constraints.
    
    Input:
    {
      "issues": [
        { "id": 1, "priority_score": 0.82, "repair_cost": 12000 },
        { "id": 2, "priority_score": 0.65, "repair_cost": 8000 }
      ],
      "budget": 50000
    }
    """

    data = request.get_json(force=True)

    try:
        issues = data.get("issues", [])
        budget = data.get("budget", 0)

        if not isinstance(issues, list):
            return jsonify({"error": "issues must be a list"}), 400
        
        if not isinstance(budget, (int, float)) or budget < 0:
            return jsonify({"error": "budget must be a non-negative number"}), 400

        selected, total_spent = optimize_repairs(issues, budget)

        return jsonify({
            "selected_ids": [i["id"] for i in selected],
            "total_spent": total_spent,
            "remaining_budget": budget - total_spent,
            "selection_count": len(selected),
            "status": "success"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------------------------------
# Run
# ----------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')