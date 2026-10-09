from fastapi import APIRouter, HTTPException
from backend.ticketing.verifier import verify_ticket


router = APIRouter(prefix="/gate", tags=["Gate"])
#verification at gate
@router.post("/verify")

def verify_gate(data: dict):
    token = data.get("ticket_token")

    if not token:
        raise HTTPException(status_code=400, detail="Ticket token missing")

    try:
        payload = verify_ticket(token)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return {
        "status": "VERIFIED",
        "ticket": payload
    }
