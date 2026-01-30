from flask import Flask, request, jsonify
from decision.priority_engine import compute_priority
from decision.cost_model import estimate_repair_cost
from decision.optimizer import optimize_repairs
from decision.explainability import explain_selection

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "active", "version": "1.0.0"})

@app.route('/analyze-issue', methods=['POST'])
def analyze_issue():
    """
    Input: { "report": {...}, "asset": {...} }
    Output: Priority score + Estimated Cost
    """
    data = request.json
    try:
        report = data.get('report')
        asset = data.get('asset')

        # 1. Get Priority
        priority = compute_priority(report)

        # 2. Get Cost Estimate
        cost = estimate_repair_cost(
            asset_type=asset['asset_type'],
            severity_level=asset['severity_level'],
            geometry=asset['geometry'],
            state_code=asset.get('state_code', 'GJ')
        )

        return jsonify({
            "priority": priority,
            "estimated_cost_inr": cost,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/optimize-budget', methods=['POST'])
def optimize_budget():
    """
    Input: { "issues": [...], "budget": 50000 }
    """
    data = request.json
    issues = data.get('issues', [])
    budget = data.get('budget', 0)

    selected, total_spent = optimize_repairs(issues, budget)
    explanation = explain_selection(selected, budget, total_spent)

    return jsonify({
        "selected_ids": [i['id'] for i in selected],
        "total_spent": total_spent,
        "remaining_budget": budget - total_spent,
        "explanation": explanation
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)