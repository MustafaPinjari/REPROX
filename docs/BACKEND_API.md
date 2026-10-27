# REPROX Backend REST API Specification

Base URL: `http://127.0.0.1:8000/api`

---

## 1. System Health

### `GET /api/health/`
Checks database connectivity and readiness of the Playwright and Wispr Flow engines.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "REPROX Backend Engine",
  "version": "1.0.5",
  "database": "SQLite3 (Active)",
  "playwrightRunner": "Ready",
  "wisprFlowEngine": "Active"
}
```

---

## 2. Authentication (`/api/auth/`)

### `POST /api/auth/login/`
Authenticates a user by email and password. Returns an API token and user profile.

**Request:**
```json
{
  "email": "mustafa@example.com",
  "password": "reprox-demo-pass"
}
```

**Response (200 OK):**
```json
{
  "token": "reprox_token_a1b2c3d4e5f6...",
  "user": {
    "id": 1,
    "username": "mustafa",
    "email": "mustafa@example.com",
    "plan": { "tier": "Pro Plan", "quota": "Unlimited Reproductions" }
  },
  "message": "Authentication successful."
}
```

### `POST /api/auth/recover-password/`
Sends an HMAC recovery link to the user's email.

---

## 3. Incidents (`/api/incidents/`)

### `GET /api/incidents/`
Lists all bug reproduction incidents. Supports query parameters:
- `status`: `buggy`, `fixed`, `review`
- `search`: Filter by keyword

### `POST /api/incidents/`
Creates a new incident record.

---

## 4. Timeline Events (`/api/events/`)

### `GET /api/events/?incident=INC-104`
Retrieves the recorded DOM action sequence for a given incident.

### `POST /api/events/batch/`
Batch synchronizes timeline interactions from the front-end recording engine.

**Request:**
```json
{
  "incident_id": "INC-104",
  "events": [
    {
      "id": "EVT-1",
      "type": "fill",
      "selector": "#clientName",
      "value": "Acme Global Ltd",
      "description": "Entered client name",
      "isPiiMasked": false
    }
  ]
}
```

---

## 5. Playwright Test Runner (`/api/tests/`)

### `POST /api/tests/generate/`
Takes recorded events and synthesizes clean, executable Playwright TypeScript code.

### `POST /api/tests/run/`
Launches a genuine Microsoft Edge browser process against the specified build mode.

**Request:**
```json
{
  "buildMode": "buggy",
  "incident_id": "INC-104"
}
```

**Response (200 OK):**
```json
{
  "buildMode": "buggy",
  "status": "failed",
  "exitCode": 1,
  "totalDurationMs": 3520,
  "reportId": "REP-8F2B1C",
  "steps": [
    { "stepIndex": 1, "description": "Navigate to Sandbox", "status": "passed" },
    { "stepIndex": 5, "description": "Assert GSTIN alert visible", "status": "failed", "errorMessage": "Timed out waiting for [role=\"alert\"]" }
  ]
}
```

---

## 6. Voice Intake & Wispr Flow (`/api/voice/`)

### `POST /api/voice/transcribe/`
Processes speech audio blobs or raw text transcripts. Parses acoustic bug descriptions into structured intent entities.

### `POST /api/voice/parse-intent/`
Extracts entities (`clientName`, `invoiceAmount`, `actionTaken`, `expectedOutcome`, `severity`) directly from text.
