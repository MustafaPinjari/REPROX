# Playwright Subprocess Runner Architecture & Safe Execution Boundaries

## 1. Philosophy: Genuine Execution with Strict Guardrails
REPROX rejects fake timers and hardcoded mock exit codes. Every test run launches an actual headless browser process, interacts with real DOM elements, and returns the authentic exit code emitted by the test runner.

> [!IMPORTANT]
> **Subprocess Security Reality Check:**
> The current test runner executes as an **isolated Node.js child subprocess on the host system** with restricted environment variables and strict argument allowlisting. It is **NOT** an OS-level sandbox or microVM container. For production multi-tenant environments, isolated container grids (Docker/gVisor/Firecracker) must be used to enforce hardware and network isolation.

---

## 2. Security Safeguards Implemented

### A. Strict Mode Validation & Argument Allowlisting
- Incoming requests to `POST /api/tests/run/` validate `buildMode` against a strict allowlist:
  ```python
  ALLOWED_BUILD_MODES = {'buggy', 'fixed'}
  ```
- Any unauthorized string, path traversal (`../../`), or command separator (`;&|`) is rejected immediately with `400 Bad Request` before any process is invoked.

### B. Environment Secret Stripping (Zero Secret Leakage)
- Under no circumstances does the child process inherit the Django server's environment.
- Sensitive environment variables are stripped before launching the Node process:
  - `DJANGO_SECRET_KEY` → Stripped
  - `WISPR_FLOW_API_KEY` → Stripped
  - `DATABASE_URL` / DB passwords → Stripped
  - Cloud provider credentials (`AWS_*`) → Stripped
- Only a minimal system whitelist (`PATH`, `SYSTEMROOT`, `APPDATA`, `LOCALAPPDATA`, `TEMP`, `TMP`) is passed to the child process.

### C. Resource Exhaustion Protection & Timeouts
- Subprocess execution enforces a hard **35-second timeout**.
- If a script hangs or loops, `subprocess.TimeoutExpired` terminates the child process and records an execution failure report with exit code 124.

### D. Safe Playwright Test Code Synthesis
- In `synthesize_playwright_script()`, all user-supplied selectors, values, and text assertions are serialized using `json.dumps()` rather than naive string concatenation, preventing JavaScript string breakout or code injection.

---

## 3. Dual Build Comparison Setup

The test matrix exercises the same reproduction scenario across two versions of the Commercial Invoicing application:

### Buggy Baseline (`v1.0.4`)
- **Intentional Bug:** B2B commercial invoice submission does not validate the statutory GSTIN field.
- **Observed Behavior:** Submitting an empty GSTIN bypasses validation and renders an erroneous success notification.
- **Playwright Test Result:**
  - `repro-buggy.spec.ts` fails at step 5 waiting for `locator('[role="alert"]')`.
  - Process exits with **Exit Code 1** (Reproduced).

### Fixed Patched Release (`v1.0.5`)
- **Fix:** Added validation modal with `role="alert"` requiring valid GSTIN before invoice generation.
- **Observed Behavior:** Submitting an empty GSTIN halts the dispatch and renders an accessible error alert.
- **Playwright Test Result:**
  - `verify-fixed.spec.ts` passes all 7 assertions cleanly.
  - Process exits with **Exit Code 0** (Verified).

---

## 4. Production Hardening Roadmap
To scale beyond local developer machines:
1. **Containerized Workers:** Dispatch tests to ephemeral Docker containers with CPU (`--cpus=1.0`) and Memory (`--memory=1g`) limits.
2. **Network Egress Filtering:** Restrict container egress traffic exclusively to the target application under test via internal Docker bridge or AWS VPC Security Groups.
3. **Playwright Grid / Selenium Grid:** Scale headless browser workers across an AWS ECS Fargate or Kubernetes cluster with automatic worker lifecycle reclamation.
