import jwt
from jwt import InvalidTokenError
from backend.config import PLATFORM_PUBLIC_KEY
from backend.utils import is_expired


def verify_ticket(token: str) -> dict:

    try:
        payload = jwt.decode(
            token,
            PLATFORM_PUBLIC_KEY.read_text(),
            algorithms=["RS256"]
        )
    except InvalidTokenError:
        raise ValueError("Invalid ticket signature")

    expires_at = payload.get("expires_at")
    if expires_at is None:
        raise ValueError("Missing expiry in ticket")

    if is_expired(expires_at):
        raise ValueError("Ticket expired")

    return payload
