from fastapi import FastAPI
from backend.api import aadhaar, ticket, gate

tags_metadata = [
    {
        "name": "Aadhaar",
        "description": "Verify Aadhaar VC (SD-JWT) and extract claims"
    },
    {
        "name": "Ticket",
        "description": "Issue cryptographically signed event tickets"
    },
    {
        "name": "Gate",
        "description": "Verify ticket QR at entry gate"
    },
    {
        "name": "Health",
        "description": "Service health check"
    }
]
#fastapi connections and integrations
app = FastAPI(
    title="Aadhaar VC Ticketing Platform",
    openapi_tags=tags_metadata
)

app.include_router(aadhaar.router)
app.include_router(ticket.router)
app.include_router(gate.router)

@app.get("/", tags=["Health"])
def health():
    return {"status": "running"}
