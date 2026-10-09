from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.aadhaar_vc.sdjwt import parse_sdjwt_zip
from backend.aadhaar_vc.policy import check_policy

router = APIRouter(
    prefix="/aadhaar",
    tags=["Aadhaar"]
)
#reading sdjwt.zip files
@router.post("/verify")
async def verify_aadhaar(file: UploadFile = File(...)):
    try:
        zip_bytes = await file.read()
        claims = parse_sdjwt_zip(zip_bytes)
        policy_ok = check_policy(claims)

        return {
            "policy_verified": policy_ok,
            "claims": claims
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
