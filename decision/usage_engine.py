import reverse_geocode


def compute_usage_impact(lat, lon, asset_type):

    result = reverse_geocode.search([(lat, lon)])[0]
    # print(result)
    
    pop = result.get('population', 0)
    city_name = result.get('city', '').lower()

    # --- A. Base Usage (Location Density) ---
    # Higher population = higher baseline traffic/usage
    if pop > 5000000: base_usage = 0.9    # Mega-city volumes
    elif pop > 1000000: base_usage = 0.7  # Major urban hub (Pune)
    elif pop > 100000: base_usage = 0.5   # Mid-size town
    else: base_usage = 0.2                # Low-density/Rural

    # --- B. Accessibility Modifier (Network Criticality) ---
    # Assets on roads that connect major hubs have higher failure costs.
    # Heuristic: If it's a "Division" or "District" capital, it's a transit node.
    is_transit_node = "division" in result.get('county', '').lower()
    accessibility_mod = 1.2 if is_transit_node else 1.0

    # --- C. Economic Activity Proxy ---
    # In India, certain cities are 'Industrial' or 'Commercial' powerhouses.
    # You can expand this list with offline knowledge of industrial zones.
    economic_hubs = ["pune", "mumbai", "bangalore", "chennai", "gurgaon", "hyderabad", "surat"]
    economic_proxy = 0.15 if city_name in economic_hubs else 0.0

    # --- Final Calculation ---
    # We cap the impact at 1.0
    total_impact = (base_usage * accessibility_mod) + economic_proxy
    
    return min(round(total_impact, 2), 1.0)

# Example usage
print(compute_usage_impact(21, 79, "road"))  # Pune, Maharashtra