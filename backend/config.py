from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

PLATFORM_PRIVATE_KEY = BASE_DIR / "keys/platform_private.pem"
PLATFORM_PUBLIC_KEY = BASE_DIR / "keys/platform_public.pem"

TICKET_EXPIRY_SECONDS = 300  
