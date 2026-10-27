# REPROX Production Deployment, PostgreSQL Migration & Security Architecture

## 1. PostgreSQL Production Migration

While SQLite3 is appropriate and performant for local offline developer evaluation and rapid test harness execution, production multi-tenant deployments require **PostgreSQL 16+** for concurrent transactions, row-level locking, and connection pooling.

### A. Environment Configuration
Set the following environment variables in your production environment:
```env
DATABASE_URL=postgres://reprox_user:SuperSecurePostgresPassword2026!@postgres-cluster.internal:5432/reprox_prod
CONN_MAX_AGE=600
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=prod-cryptographically-random-50-character-key
```

### B. Django Settings Dynamic Switch
`backend/reprox_backend/settings.py` is pre-configured to detect `DATABASE_URL`:
```python
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres'):
    import urllib.parse
    parsed = urllib.parse.urlparse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': parsed.path.lstrip('/'),
            'USER': parsed.username,
            'PASSWORD': parsed.password,
            'HOST': parsed.hostname,
            'PORT': parsed.port or 5432,
            'CONN_MAX_AGE': 600,
            'OPTIONS': {
                'sslmode': 'require',
            }
        }
    }
```

### C. Migration Steps
1. Install PostgreSQL adapter in virtualenv or Dockerfile:
   ```bash
   pip install psycopg2-binary
   ```
2. Run database migrations:
   ```bash
   python manage.py migrate
   ```
3. Set up **pgBouncer** in transaction pooling mode (`pool_mode = transaction`, `default_pool_size = 20`) to handle high-frequency concurrent API bursts from test runners.

---

## 2. Secrets Management & Zero-Trust Secrets

### A. Secret Storage Architecture
- **Never store production secrets in `.env` files or Git repositories.**
- Store all sensitive configuration in a dedicated secrets manager:
  - **AWS Secrets Manager** / **AWS Systems Manager Parameter Store**
  - **Doppler** or **HashiCorp Vault**
- Inject secrets at container runtime into process memory as environment variables, or retrieve them via SDK at startup.

### B. Prioritized Secret Audit Matrix

| Secret Name | Risk Severity | Current Protection | Production Recommendation |
| :--- | :--- | :--- | :--- |
| `DJANGO_SECRET_KEY` | **Critical** | Loaded from `.env`, stripped from Playwright child env | Rotate every 90 days; inject via AWS Secrets Manager |
| `WISPR_FLOW_API_KEY` | **High** | Stripped from runner child env, graceful fallback | Store in Vault; use IAM role proxy if possible |
| `POSTGRES_PASSWORD` | **Critical** | Not committed; env variable only | IAM Database Authentication or AWS Secrets Manager with auto-rotation |
| `TokenAuthentication Keys` | **High** | Stored hashed in DB, scoped to owner | Implement token TTL expiration and revocation endpoints |

---

## 3. STKS (Single Sign-On / SSO) Login Architecture

For enterprise deployments with Okta, Azure Active Directory, Google Workspace, or GitHub Enterprise:
1. **Protocol:** OpenID Connect (OIDC) or SAML 2.0 with PKCE (Proof Key for Code Exchange).
2. **Architecture:**
   - Client redirects to IdP (`/api/auth/sso/login/<provider>/`).
   - IdP authenticates user with enterprise MFA/hardware key.
   - IdP returns authorization code to `/api/auth/sso/callback/`.
   - Django backend validates JWT signature using IdP public JWKS keys.
   - User account is linked, and a scoped DRF Token or session cookie is issued.
3. **Tenant Domain Isolation:** Auto-route users based on corporate email domain (e.g., `@acmeglobal.com`) to their organization's dedicated SAML federation.

---

## 4. Automated Database Backups & Disaster Recovery

### A. Daily Physical & Logical Backups
1. **Automated pg_dump Snapshots:**
   - Execute daily automated logical backups compressed with gzip:
     ```bash
     pg_dump -Fc -Z 9 -h postgres-cluster.internal -U reprox_user reprox_prod > /backup/reprox_$(date +%Y%m%d_%H%M%S).dump
     ```
   - Encrypt snapshots with GPG / AWS KMS and push to AWS S3 Glacier with 90-day lifecycle retention.
2. **Continuous WAL Archiving (Point-in-Time Recovery - PITR):**
   - Enable `wal_level = replica` and `archive_mode = on` with `pgBackRest` or `wal-g`.
   - Allows point-in-time recovery to any second within the past 14 days in case of accidental data corruption.

---

## 5. Sandboxed & Accelerated Browser Workloads

Running Playwright browsers on multi-tenant production systems requires isolation from the core Django web workers:

### A. Dedicated Worker Architecture
```
[ Django API Server ] 
         │ (Dispatches test job)
         ▼
[ Redis / Celery Queue ]
         │
         ▼
[ Ephemeral Docker / Firecracker MicroVMs ]
  ├── Resource Limit: 1.5 vCPU, 2GB RAM
  ├── Network Policy: Strict egress allowlist (target sandbox URL only)
  ├── Storage: Ephemeral tmpfs (cleared on container exit)
  └── Browser: Chromium / Playwright Headless Grid
```

### B. Hardware Acceleration
- Use Linux headless Chromium flags:
  `--disable-gpu`, `--disable-dev-shm-usage`, `--no-sandbox` (only inside Docker container), `--disable-setuid-sandbox`.
- Mount `/dev/shm` as a shared memory volume (`tmpfs` with at least 512MB) to prevent Chromium out-of-memory browser tab crashes.

---

## 6. Remaining Production Blockers Checklist

- [x] **Tenant Data Isolation:** Implemented `owner` foreign key and strictly filtered queryset queries on incidents and events.
- [x] **Authentication Hardening:** Real DRF Token authentication with PBKDF2 SHA256 password hashing; no auto-user creation.
- [x] **Subprocess Security:** Argument allowlisting, stripped environment secrets, and 35s execution timeout.
- [x] **Zero-Trust PII Redaction:** Automated server-side masking of Bearer tokens, credit cards, emails, and passwords.
- [x] **Verified Playwright Execution:** Real Playwright subprocesses running with genuine exit codes (0 for fixed, 1 for buggy).
- [ ] **Celery Asynchronous Task Queue:** Transition long-running Playwright browser executions (which take 2-5s) to async background Celery tasks with Redis or SQS for high-concurrency throughput.
- [ ] **Docker Compose Production Manifest:** Provide multi-container `docker-compose.prod.yml` with separate `web`, `celery_worker`, `redis`, and `postgres` services.
