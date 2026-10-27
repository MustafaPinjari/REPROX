# Wispr Flow Acoustic Speech Intake & Intent Parsing Architecture

## Executive Reality Check & Integration Status
- **Wispr Flow Official Product (wisprflow.ai):** Wispr Flow is primarily a native macOS and Windows desktop application providing universal dictation into any desktop active input field. It currently does not provide an open public cloud REST API for raw audio file upload (`/v1/transcribe`).
- **Working Implementation & Resilient Fallback:** 
  - REPROX implements a client-side audio intake pipeline utilizing the W3C standard **Web Speech API** (`window.SpeechRecognition` / `window.webkitSpeechRecognition`) coupled with the Web Audio API (`AudioContext`, `AnalyserNode`) for live microphone frequency and decibel visualization.
  - The transcribed natural language speech is dispatched to the backend (`/api/voice/parse-intent/`), where REPROX's **deterministic NLP grammar engine** extracts test entities, target selectors, expected vs actual behaviors, and assertions.
  - If a team runs a dedicated Wispr Flow proxy or transcription bridge, REPROX supports passing audio buffers via `WISPR_FLOW_ENDPOINT` and `WISPR_FLOW_API_KEY`. Otherwise, the browser speech recognition + deterministic NLP grammar is the active, verified, working path.

---

## 1. Acoustic Intake & Audio Analysis Pipeline
1. **Live Microphone Web Speech API:** Continuously captures spoken audio using the browser's speech recognition pipeline. Decibel audio wave energy animates the concentric microphone visualizer in real time.
2. **Deterministic NLP Intent Grammar:** Transcripts are parsed into structured Playwright AST targets:
   - Feature classification (invoice-gstin, auth, settings)
   - Entities (Client business name, invoice total, missing statutory fields)
   - Discrepancy (Action taken vs expected outcome vs actual outcome)
   - Target selector mapping (`#clientName`, `#invoiceAmount`, `#gstinNumber`, `[role="alert"]`)

---

## 2. Intent Parsing Grammar Matrix

| User Utterance | Detected Entity | Target Selector | Synthesized Assertion |
| :--- | :--- | :--- | :--- |
| *"Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number."* | Client: `Acme Corp`<br>Amount: `4850`<br>Missing: `GSTIN` | `#clientName`<br>`#invoiceAmount`<br>`#gstinNumber` | `expect(page.getByRole('alert')).toBeVisible()` |
| *"The app mistakenly shows an invoice created toast instead of validating the GSTIN field."* | Bug: False success toast<br>Expected: Validation error | `[role="alert"]` | `expect(page.locator('[role="alert"]')).toContainText('GSTIN is required')` |

---

## 3. Hands-Free Voice Commands
Voice commands supported in the interface:
- *"Start recording"* → Begins DOM interaction capture
- *"Stop recording"* → Finalizes timeline events
- *"Run buggy test"* → Triggers genuine Playwright test on v1.0.4 (Exit Code 1)
- *"Verify fixed test"* → Triggers genuine Playwright test on v1.0.5 (Exit Code 0)
- *"Export incident"* → Downloads reproduction report in Markdown or JSON
