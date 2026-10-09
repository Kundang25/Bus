import jwt
from backend.config import PLATFORM_PRIVATE_KEY

def sign_ticket(ticket: dict) -> str:
    return jwt.encode(
        ticket,
        PLATFORM_PRIVATE_KEY.read_text(),
        algorithm="RS256"
    )
