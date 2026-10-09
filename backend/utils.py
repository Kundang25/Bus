import time
from datetime import datetime, timedelta

def current_timestamp() -> int:
    return int(time.time())

def expiry_timestamp(minutes: int = 60) -> int:
    return current_timestamp() + (minutes * 60)

def is_expired(expiry_ts: int) -> bool:
    return current_timestamp() > expiry_ts
