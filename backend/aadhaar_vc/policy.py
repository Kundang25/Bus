from typing import Dict

def check_policy(claims: Dict) -> bool:

    if not isinstance(claims, dict):
        return False

    gender = claims.get("gender") or claims.get("Gender")
    address = claims.get("address") or claims.get("Address")

    if not isinstance(gender, str):
        return False

    if gender.strip().lower() != "female":
        return False
    
    address_str = ""

    if isinstance(address, str):
        address_str = address

    elif isinstance(address, dict):
        address_str = " ".join(str(v) for v in address.values())

    else:
        return False

    if "karnataka" not in address_str.lower():
        return False

    return True
