import jwt
from backend.config import UIDAI_PUBLIC_KEY

def verify_uidai_signature(sdjwt_compact: str):
    token = sdjwt_compact.split("~")[0]
    jwt.decode(
        token,
        UIDAI_PUBLIC_KEY.read_text(),
        algorithms=["RS256"],
        options={"verify_aud": False}
    )
