# Copilot Instructions for CIH

## Project Overview
- **Purpose:** Decision intelligence for municipal repair prioritization and budgeting, tailored for Indian infrastructure scenarios.
- **Core Flow:**
  1. **Input:** Citizen/crowd-sourced damage reports (severity, location, usage, confidence, days unresolved)
  2. **Priority Scoring:** `decision/priority_engine.py` computes a weighted, explainable priority score and level (P1/P2/P3)
  3. **Cost Estimation:** `decision/cost_model.py` estimates repair costs using asset type, geometry, state, and confidence
  4. **Budget Optimization:** `decision/optimizer.py` and `decision/budget_optimizer.py` select repairs to maximize impact within a budget
  5. **Explainability:** `decision/explainability.py` generates human-friendly explanations for selections

## Key Components
- **decision/priority_engine.py:** Priority scoring logic, explainability, and weights
- **decision/cost_model.py:** Deterministic, India-calibrated cost estimation (see `COST_BANDS`, `STATE_MULTIPLIERS`)
- **decision/optimizer.py:** Greedy selection of repairs by impact/cost ratio
- **decision/budget_optimizer.py:** Alternative optimizer with similar logic
- **decision/schemas.py:** Input validation for scoring
- **decision/explainability.py:** Generates explanations for selected repairs
- **scripts/demo_decision_flow.py:** End-to-end demo of the full decision pipeline

## Developer Workflows
- **Run Demo:** `python scripts/demo_decision_flow.py`
- **Run Tests:** `pytest tests/`
- **Add/Update Logic:** Update modules in `decision/`, keep scoring/cost logic explainable and deterministic
- **Validation:** Use `decision/schemas.py` for input checks

## Project Conventions
- **All scores and confidences are floats in [0,1]**
- **Cost estimates are in INR, not procurement-grade**
- **Explanations must be concise and human-readable**
- **Prioritization is explainable, not black-box ML**
- **State codes use Indian abbreviations (e.g., 'MH', 'DL')**

## Integration Points
- **No external APIs or databases**
- **All logic is pure Python, no side effects**
- **Inputs/outputs are plain dicts, easy to adapt for REST or CLI**

## Examples
- See `scripts/demo_decision_flow.py` for realistic data and flow
- See `tests/` for minimal test cases and usage patterns

---
For questions or unclear conventions, review the demo script and module docstrings for intent and examples. Suggest improvements in this file if you find recurring patterns or new workflows.
