from fastapi import APIRouter, HTTPException
from backend.ticketing.ticket import create_ticket

router = APIRouter(prefix="/ticket", tags=["Ticket"])

#verifing ticket policy and claims
@router.post("/issue")
def issue_ticket(data: dict):
    if not data.get("policy_verified"):
        raise HTTPException(status_code=403, detail="Policy not verified")

    claims = data.get("claims", {})
    return {
        "status": "ticket_issued",
        "ticket": create_ticket(claims)
    }
