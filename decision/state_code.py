import reverse_geocode

def get_state_code_offline(lat, lon):
    # library expects a list of tuples
    result = reverse_geocode.search([(lat, lon)])[0]
    
    
    # result returns {'country_code': 'IN', 'city': 'Pune', 'province': 'Maharashtra'}
    province = result.get('state')
    
    # Simple mapping to your state_codes
    mapping = {
        "Andaman and Nicobar Islands": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR",
        "Assam": "AS", "Bihar": "BR", "Chandigarh": "CH", "Chhattisgarh": "CT",
        "Dadra and Nagar Haveli": "DN", "Daman and Diu": "DD", "Delhi": "DL",
        "Goa": "GA", "Gujarat": "GJ", "Haryana": "HR", "Himachal Pradesh": "HP",
        "Jammu and Kashmir": "JK", "Jharkhand": "JH", "Karnataka": "KA",
        "Kerala": "KL", "Ladakh": "LA", "Lakshadweep": "LD", "Madhya Pradesh": "MP",
        "Maharashtra": "MH", "Manipur": "MN", "Meghalaya": "ML", "Mizoram": "MZ",
        "Nagaland": "NL", "Odisha": "OR", "Puducherry": "PY", "Punjab": "PB",
        "Rajasthan": "RJ", "Sikkim": "SK", "Tamil Nadu": "TN", "Telangana": "TG",
        "Tripura": "TR", "Uttar Pradesh": "UP", "Uttarakhand": "UT", "West Bengal": "WB"
    }
    
    return mapping.get(province, "GJ") # Default to GJ or a baseline


def compute_location_criticality(lat, lon):
    # import reverse_geocode
    result = reverse_geocode.search([(lat, lon)])[0]
    
    # Extract data from reverse_geocode output
    city_name = result.get('city', '')
    pop = result.get('population', 0)
    state = result.get('state', '')

    # --- A. Urbanization Score (0.0 - 1.0) ---
    # Based on population tiers in India (Tier 1 > 5M, Tier 2 > 1M, etc.)
    if pop > 5000000: urban_score = 1.0   # Mega-cities (Mumbai, Delhi)
    elif pop > 1000000: urban_score = 0.8 # Tier 1 (Pune, Bangalore)
    elif pop > 500000: urban_score = 0.6  # Tier 2
    else: urban_score = 0.4               # Rural/Small Town

    # --- B. Infrastructure Proximity (0.0 - 1.0) ---
    # Heuristic: If it's a "District" headquarters or a major 'county', 
    # it's likely near higher-density infra.
    is_admin_hub = 1.0 if "Division" in result.get('county', '') else 0.5
    infra_score = is_admin_hub

    # --- C. Risk Exposure Score (0.0 - 1.0) ---
    # India-specific: High-intensity monsoon or flood-prone regions.
    high_risk_states = ["Maharashtra", "Kerala", "Bihar", "Assam", "West Bengal"]
    risk_score = 0.9 if state in high_risk_states else 0.5

    # --- Final Calculation ---
    location_criticality = (0.5 * urban_score) + (0.3 * infra_score) + (0.2 * risk_score)
    
    return round(location_criticality, 2)


# Example usage
# print(compute_location_criticality(18.5204, 73.8567))  # Pune, Maharashtra