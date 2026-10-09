# Shakti Yatra – Aadhaar VC Ticketing System (Frontend)

This frontend application simulates a secure, Aadhaar-based ticket verification system for public transport. It demonstrates how identity verification, eligibility enforcement, and offline validation can be achieved using a layered trust architecture inspired by UIDAI’s Verifiable Credential ecosystem.

## 1. Overview

The application provides a conductor-facing dashboard to:

- Select state, bus, and route
- Generate trip QR codes
- Simulate passenger scans and validation
- Maintain a rolling verification history
- Integrate with backend services for logging and audit

The system is designed to reflect real-world constraints such as offline verification, privacy preservation, and scalable transport operations.

## 2. Frontend Architecture

The frontend follows a modular React architecture:

### UI Layer
- Dashboard, QR display, validation modal, history view

### State Layer
- Manages:
  - Trip details (state, bus, route)
  - Passenger state
  - Verification status
  - Counters and history (latest 25)

### Data Layer
- Mock datasets for buses, routes, and passengers
- State-based filtering using helper functions

### Service Layer
- Integration with backend via `BridgeandReport`
- Handles:
  - Data submission (scan events)
  - Report retrieval (history)

### Security Simulation
- Base64 encoding/decoding of payloads
- Simulates secure transport of identity data

## 3. Simplified Frontend Workflow

1. **Trip Setup**
   - Conductor selects state, bus, and route
   - QR code is generated for the trip

2. **Passenger Scan**
   - Passenger data is fetched (mock)
   - Eligibility is checked:
     - Gender = Female
     - Address matches selected state

3. **Validation Result**
   - UI displays VALID / INVALID
   - Counters update in real time

4. **Data Logging**
   - Scan result is sent to backend via Bridge API

5. **History View**
   - Latest 25 records are displayed (local + backend)

## 4. Cosmitude Bridge Integration (Core System Layer)

The Cosmitude Bridge acts as the **data orchestration and persistence layer** of the system.

It enables structured communication between the frontend and backend using a **multi-form, flow-based architecture**.

### 4.1 Purpose of Bridge Integration

- Persist passenger verification data
- Enable structured form-based data storage
- Support retrieval and reporting of historical data
- Facilitate secure data flow across system components

### 4.2 Data Flow Through Bridge

1. **Capture Data (Frontend)**
   - On each passenger scan, the system collects:
     - Name, Age, Gender, Address
     - Verification result (valid / invalid)

2. **Encode & Send**
   - Data is encoded using Base64
   - Sent to backend using:
     ```js
     BridgeandReport(formData, "saveForumBridges2")
     ```

3. **Store via Bridge**
   - Data is stored in a structured multi-form format
   - Each field is internally mapped using unique field IDs
   - Ensures consistent and organized data storage

4. **Fetch History**
   - Data is retrieved using:
     ```js
     BridgeandReport(formData, "reportGeneration")
     ```
   - Backend returns stored records

5. **Decode & Display**
   - Frontend decodes the received data
   - Extracts the latest 25 entries:
     ```js
     alldata.slice(-25).reverse()
     ```
   - Displays results in the history UI

### 4.3 Role in Verification and Validation

The Bridge enables:

#### 1. Verification Logging
- Every scan is recorded with full context
- Acts as an audit trail

#### 2. Data Consistency
- Ensures uniform structure across all entries

#### 3. Validation Support
- Stores verification results (true/false)
- Allows post-validation analysis

#### 4. Cross-Form Data Flow
- Data can be passed across forms and flows
- Enables chaining of processes (verification → reporting)

## 5. Role of OVSE in This System

Offline Verification Seeking Entities (OVSEs) are systems that verify credentials without real-time connectivity to the issuer.

### In This Project

The **Conductor Dashboard acts as an OVSE simulation**.

### Responsibilities of OVSE

- Perform local verification (no UIDAI dependency)
- Enforce eligibility policies
- Validate access instantly
- Operate in low-connectivity environments

### Mapping to Frontend

| OVSE Function | Implementation |
|--------------|--------------|
| Offline validation | Local eligibility logic |
| Identity verification | Simulated via dataset |
| Policy enforcement | Gender + state checks |
| Ticket validation | UI + backend logging |
| Fast decision making | Instant UI feedback |

## 6. End-to-End Flow
UIDAI (Issuer)</br>
↓ credential (simulated)</br>
Aadhaar App (Holder)</br>
↓ shares data</br>
Platform Backend + Bridge</br>
↓ verifies + stores</br>
Frontend (OVSE Simulation)</br>
↓ validates locally</br>
Passenger Access Granted / Denied</br>

## 7. Architectural Principles

- Separation of Identity, Authorization, and Verification
- Offline-first validation
- Minimal exposure of user data
- Structured data handling via Bridge
- Scalable transport verification model

## 8. Setup

```bash
cd frontend
npm install
npm run dev
```
##. Environment Variables
```bash
VITE_API_BASE_URL=YOUR_BACKEND_URL
VITE_BRIDGE_API_URL=YOUR_BRIDGE_API
VITE_ENABLE_AADHAAR_VERIFICATION=true
```
## 9. Learn more:

- Cosmitude Website: https://www.cosmitude.com  
- Cosmitude Bridge Platform: https://bridge.cosmitude.com  

## 10. Disclaimer

**This project is a prototype implementation** designed to demonstrate how Aadhaar-based verification, validation systems, and offline-capable transport workflows can be architected.

- It uses mock data and simulated cryptographic flows  
- No real Aadhaar data or UIDAI integration is performed  
- The system is intended as a conceptual and technical model  

This prototype can be extended into real-world systems for:

- Identity verification  
- Eligibility validation  
- Secure ticketing and access control  
- Offline-first verification environments (OVSE-based systems)