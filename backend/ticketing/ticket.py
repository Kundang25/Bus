import uuid
from backend.ticketing.signer import sign_ticket
from backend.ticketing.qr import generate_ticket_qr
from backend.utils import current_timestamp, expiry_timestamp


def create_ticket(claims: dict) -> dict:
    payload = {
        "ticket_id": str(uuid.uuid4()),
        "gender": claims.get("gender"),
        "state": "karnataka",
        "issued_at": current_timestamp(),
        "expires_at": expiry_timestamp(minutes=60),
        "issuer": "AadhaarVC-Ticketing"
    }

    token = sign_ticket(payload)
    qr_base64 = generate_ticket_qr(token)

    return {
        "ticket_payload": payload,
        "ticket_token": token,
        "ticket_qr_base64": qr_base64
    }
