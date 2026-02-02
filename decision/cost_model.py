"""
cost_model.py

Purpose:
Estimate approximate municipal repair costs (INR) for
budget-aware prioritization — NOT procurement billing.

Design principles:
- India-calibrated
- Geometry-aware (area / length / count)
- State-wise cost normalization
- Explainable and deterministic
"""

# ---------------------------------------------------------------------
# Base cost bands (INR)
# These represent small-to-medium municipal repair works
# Inspired by CPWD / State PWD Schedule of Rates (SoR)
# ---------------------------------------------------------------------

COST_BANDS = {
    "road": {  # cost per square meter
        "minor": (3000, 6000),
        "moderate": (8000, 15000),
        "severe": (20000, 40000)
    },
    "drain": {  # cost per running meter
        "minor": (2000, 5000),
        "moderate": (6000, 12000),
        "severe": (18000, 35000)
    },
    "utility_pole": {  # cost per unit
        "minor": (4000, 7000),
        "moderate": (10000, 18000),
        "severe": (25000, 45000)
    }
}

# ---------------------------------------------------------------------
# State-wise cost multipliers (normalized to national baseline = 1.0)
# ---------------------------------------------------------------------

STATE_MULTIPLIERS = {
    "DL": 1.20,   # Delhi
    "MH": 1.15,   # Maharashtra
    "KA": 1.10,   # Karnataka
    "TN": 1.05,   # Tamil Nadu
    "GJ": 1.00,   # Gujarat
    "WB": 0.98,   # West Bengal
    "UP": 0.95,   # Uttar Pradesh
    "RJ": 0.92,   # Rajasthan
    "MP": 0.90,   # Madhya Pradesh
    "BR": 0.88    # Bihar
}

DEFAULT_STATE_MULTIPLIER = 1.0


# ---------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------

def _midpoint(low: float, high: float) -> float:
    return (low + high) / 2


def _geometry_scale(asset_type: str, geometry: dict) -> float:
    """
    Converts damage geometry into a scaling factor.

    Expected geometry:
    - road: {"area_m2": float}
    - drain: {"length_m": float}
    - utility_pole: {"count": int}
    """

    if asset_type == "road":
        return max(geometry.get("area_m2", 1.0), 0.1)

    if asset_type == "drain":
        return max(geometry.get("length_m", 1.0), 0.5)

    if asset_type == "utility_pole":
        return max(geometry.get("count", 1), 1)

    return 1.0


# ---------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------

def estimate_repair_cost(
    asset_type: str,
    severity_level: str,
    geometry: dict,
    state_code: str,
    confidence_score: float = 1.0
) -> int:
    """
    Estimate repair cost in INR.

    Parameters:
    - asset_type: road | drain | utility_pole
    - severity_level: minor | moderate | severe
    - geometry: dict describing damage size
    - state_code: Indian state code (e.g., MH, DL)
    - confidence_score: crowd confidence [0,1]

    Returns:
    - int: estimated cost in INR
    """

    # ---- Validation ----
    if asset_type not in COST_BANDS:
        raise ValueError(f"Unsupported asset type: {asset_type}")

    if severity_level not in COST_BANDS[asset_type]:
        raise ValueError(f"Unsupported severity level: {severity_level}")

    # ---- Base cost (severity-driven) ----
    low, high = COST_BANDS[asset_type][severity_level]
    base_cost = _midpoint(low, high)

    # ---- Geometry scaling ----
    scale = _geometry_scale(asset_type, geometry)
    cost = base_cost * scale

    # ---- State adjustment ----
    # state_multiplier = STATE_MULTIPLIERS.get(
    #     state_code,
    #     DEFAULT_STATE_MULTIPLIER
    # )
    if state_code in STATE_MULTIPLIERS:
        state_multiplier = STATE_MULTIPLIERS[state_code]
        # Optional: print(f"Applying {state_code} multiplier: {state_multiplier}")
    else:
        state_multiplier = DEFAULT_STATE_MULTIPLIER
        # This captures any state not defined in your dictionary
        # Optional: print(f"State {state_code} not found. Using default: {state_multiplier}")
    cost *= state_multiplier

    # ---- Low-confidence buffer (inspection / rework overhead) ----
    confidence_score = max(0.0, min(confidence_score, 1.0))


    return int(round(cost))
