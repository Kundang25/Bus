# Aadhaar VC-Based Universal Ticketing System (Backend)

A secure, privacy-preserving backend system for issuing and verifying transport tickets using Aadhaar Verifiable Credentials (VCs) and Selective Disclosure JWTs (SD-JWT).

This system is designed for government transport schemes such as Karnataka’s Shakti Scheme, enabling free or subsidised bus travel for eligible women while eliminating fraud, protecting user privacy, and supporting offline-capable verification at gates or conductors’ devices.

## Real-World Case Scenario

Consider Priya, a working woman in Bengaluru who commutes daily on BMTC buses under the Karnataka Shakti Scheme (which provides free bus travel to women domiciled in the state).

Previously, she had to show her full Aadhaar card to the conductor at every boarding, raising concerns about privacy, data exposure, and potential misuse of her personal details.

With this system:  
1. Priya opens the official Aadhaar app on her phone.  
2. The ticketing platform triggers a request for selective disclosure of only two attributes — **Gender** and **Address**.  
3. The Aadhaar app generates an SD-JWT ZIP file containing only these consented claims (nothing else is revealed).  
4. Priya uploads the ZIP to the platform’s mobile/web interface.  
5. The The backend verifies SD-JWT disclosures and structure. Full UIDAI signature verification is partially implemented / mocked for prototype purposes., matches the disclosed claims against the policy (female + Karnataka resident), and issues a time-bound, digitally signed ticket as a QR code.  
6. At the bus gate or while boarding, the conductor scans the QR code using a simple offline device.  
7. The ticket is instantly validated using the platform’s public key — no internet or Aadhaar re-check required.

The result: Priya travels securely and privately, the government prevents fake claims, and conductors get instant, tamper-proof verification.

## Overview

This FastAPI-based backend implements a complete end-to-end pipeline:

- Aadhaar VC Verification using SD-JWT selective disclosure  
- Policy Engine for eligibility checks (e.g., women from Karnataka)  
- Ticket Issuance with platform-signed JWTs  
- QR Code Generation for offline use  
- Gate Verification using public-key cryptography  

The design ensures zero storage of sensitive Aadhaar data, full compliance with selective disclosure principles, and cryptographic guarantees against tampering.

## Architecture
Frontend (React / Mobile)</br>
        ↓</br>
FastAPI Backend</br>
        ↓</br>
├── Aadhaar VC Layer (SD-JWT parsing & disclosure verification)</br>
├── Policy Engine (eligibility rules)</br>
├── Ticketing Layer (JWT signing & QR generation)</br>
└── Gate Verification (JWT validation using public key)</br>


## Project Structure

```bash
AadhaarVC/
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Python dependencies
├── README.md                  # This file
│
├── backend/
│   ├── config.py              # RSA key paths and configuration
│   ├── utils.py               # Helper functions (timestamp, etc.)
│   │
│   ├── aadhaar_vc/            # Aadhaar Verifiable Credential handling
│   │   ├── aadhaar.py         # FastAPI router for /aadhaar/verify
│   │   ├── sdjwt.py           # SD-JWT parsing, disclosure validation & hashing
│   │   ├── policy.py          # Eligibility policy logic
│   │   └── signature.py       # UIDAI signature & issuer verification
│   │
│   └── ticketing/             # Ticket issuance and validation
│       ├── ticket.py          # Ticket payload builder
│       ├── signer.py          # JWT signing with platform private key
│       ├── verifier.py        # JWT verification with platform public key
│       ├── qr.py              # QR code generation
│       ├── ticket_router.py   # /ticket/issue router
│       └── gate.py            # /ticket/verify router
│
├── keys/                      # RSA key directory
│   ├── platform_public.pem    # Public key (safe to distribute)
│   └── platform_private.pem   # Private key (gitignored)
│
└── output/                    # Generated QR codes (gitignored)
```
## Key Management
Platform RSA Key Pair (RS256)</br>
The platform uses a 2048-bit RSA key pair for signing and verifying tickets.</br>
- Creation Commands:
``` bash
 1. Generate private key
openssl genrsa -out keys/platform_private.pem 2048

# 2. Extract public key from private key
openssl rsa -in keys/platform_private.pem -pubout -out keys/platform_public.pem
```

**Private Key (platform_private.pem):** Used only by the backend (signer.py) to sign issued tickets using the RS256 algorithm. It is never committed to Git and must remain on the secure server.</br>
**Public Key (platform_public.pem):** Used by gate/conductor devices (verifier.py) to verify ticket signatures offline. It can be safely distributed and embedded in mobile apps.
</br>
**UIDAI Public Key**
- Downloaded from official UIDAI developer resources (Authentication Ecosystem → Public Keys section).
- Role in the System (Verifiable Credential / SD-JWT):
 The UIDAI public key is the cryptographic anchor that establishes trust in the credential issuer.
- In every Aadhaar SD-JWT:
- The first part (HEADER.PAYLOAD.SIGNATURE) is signed by UIDAI using their private key.
- The backend (signature.py) calls jwt.decode(..., UIDAI_PUBLIC_KEY, algorithms=["RS256"]) to verify this signature.
- It also checks that the issuer claim (iss) matches the expected UIDAI value.
- This ensures the entire SD-JWT (including the _sd hash commitments) is authentic and has not been tampered with. Without this verification, the system would accept forged credentials.

## Cryptographic Flow
- Ticket Issuance
textTicket payload (dict) </br>
    → jwt.encode(..., PLATFORM_PRIVATE_KEY, algorithm="RS256") </br>
    → signed JWT token</br>
- Gate Verification
textJWT token </br>
    → jwt.decode(..., PLATFORM_PUBLIC_KEY, algorithms=["RS256"]) </br>
    → decoded payload (checks policy_verified, exp, iat)</br>
    
## Aadhaar VC (SD-JWT) Processing 
- The endpoint accepts a ZIP file containing a single file: sdjwt.txt.
-The SD-JWT Contains (Official UIDAI Format): 
An SD-JWT follows the IETF Selective Disclosure JWT specification and uses Base64URL encoding (URL-safe variant used in JWT as per RFC 7515) for all parts with no padding (= characters removed).
```bash
Format:
text<HEADER>.<PAYLOAD>.<SIGNATURE>~<disclosure1>~<disclosure2>~...
```
- Header: JSON object containing alg: "RS256", typ: "JWT", etc. (Base64URL-encoded).
- Payload: JSON object containing standard JWT claims (iss, iat, exp, aud) plus the _sd array — an array of SHA-256 hashes (Base64URL) that cryptographically commit to the disclosed claims.
- Signature: RS256 signature over header.payload created by UIDAI’s private key.
- Disclosures (after each ~): Each disclosure is a Base64URL-encoded JSON array in the exact format:JSON[ "salt", "claim_name", "claim_value" ]Example: ["abc123", "Gender", "FEMALE"]

## Components of sdjwt.zip / sdjwt.txt

- sdjwt.zip: A standard ZIP archive (uploaded via multipart/form-data).
- Inside it: exactly one text file named sdjwt.txt.
- sdjwt.txt content: A single compact string using ~ as the separator (no extra whitespace, no newlines).

## Internal Processing Steps (sdjwt.py)

- Unzip and read sdjwt.txt.
- Split on ~ → JWT part + list of disclosures.
- Verify UIDAI signature + issuer on the JWT part (signature.py).
- Base64URL-decode the JWT payload and extract the _sd array.
- For each disclosure:
- Base64URL-decode → JSON array [salt, claim_name, claim_value].
- Canonicalize using json.dumps(..., separators=(",", ":"), ensure_ascii=False).
- Compute SHA-256 hash → Base64URL (no padding).
- If the computed hash exists in the _sd array → claim is verified and added to verified_claims (keys lower-cased).

**Return only verified claims (gender, address).**</br>

**This guarantees that only explicitly disclosed claims are accepted; undisclosed data remains cryptographically hidden.**</br>

# Important Note (Prototype Disclaimer)

**This is a mockup / prototype implementation.**</br>

It is built to demonstrate how the **UIDAI Aadhaar App (Verifiable Credentials + SD-JWT)** can be integrated into a platform to enable:</br>

- Secure identity verification
- Privacy-preserving authentication
- Real-world service delivery systems (e.g., ticketing, access control, subsidies)

The system is intended as **a reference architecture** for building applications that rely on:

- Selective disclosure
- Cryptographic verification
- Offline-capable identity workflows

It is **not a production-ready UIDAI-integrated system**, but a conceptual and technical demonstration of how such integrations can be designed and implemented.