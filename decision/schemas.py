# decision/schemas.py

def validate_priority_input(data: dict):
    required_fields = {
        "damage_severity": (0, 1),
        "location_criticality": (0, 1),
        "usage_impact": (0, 1),
        "confidence_score": (0, 1),
        "days_unresolved": (0, None)
    }

    for field, bounds in required_fields.items():
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

        value = data[field]

        if not isinstance(value, (int, float)):
            raise TypeError(f"{field} must be numeric")

        min_val, max_val = bounds
        if min_val is not None and value < min_val:
            raise ValueError(f"{field} below minimum {min_val}")

        if max_val is not None and value > max_val:
            raise ValueError(f"{field} above maximum {max_val}")

    return True
