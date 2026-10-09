import io
import json
import zipfile
import base64


def b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)

def parse_sdjwt_zip(zip_bytes: bytes) -> dict:

    zip_file = zipfile.ZipFile(io.BytesIO(zip_bytes))

    if "sdjwt.txt" not in zip_file.namelist():
        raise ValueError("sdjwt.txt not found in ZIP")

    sdjwt_raw = zip_file.read("sdjwt.txt").decode("utf-8")

    parts = sdjwt_raw.split("~")
    disclosures = parts[1:] 

    claims = {}

    for d in disclosures:
        if not d or not d.strip():
            continue

        try:
            decoded_bytes = b64url_decode(d)
            if not decoded_bytes:
                continue

            decoded = json.loads(decoded_bytes)
        except Exception:
            continue

        if not isinstance(decoded, list) or len(decoded) != 3:
            continue

        _, claim_name, claim_value = decoded

        if isinstance(claim_name, str):
            claims[claim_name.lower()] = claim_value

    return claims
