# Deploying Frontend on Netlify & Backend on Vercel

You **CAN** deploy the Frontend on **Netlify** and the Backend on **Vercel** — but there is one **critical architectural constraint** regarding the Playwright browser runner you must understand.

Here is the exact technical reality, pros/cons, and step-by-step deployment instructions.

---

## 1. Quick Verdict: What Works & What Doesn't

| Component | Platform | Feasibility | Status / Notes |
|:---|:---|:---:|:---|
| **Frontend (React 19 + Vite)** | **Netlify** | **100% Perfect** | Flawless SPA hosting, global CDN, instant builds. Configured via `netlify.toml` and `_redirects`. |
| **Django REST API (CRUD & Auth)** | **Vercel Serverless** | **Supported** | Auth, incident management, timeline events, and voice NLP work via Vercel Python WSGI serverless functions. |
| **Database (SQLite)** | **Vercel Serverless** | **Requires External Postgres** | Vercel functions have a read-only filesystem. SQLite cannot persist. Must connect to free PostgreSQL (Neon / Supabase). |
| **Playwright Subprocess Runner** | **Vercel Serverless** | **Limited (No Edge/Chromium Binary)** | Vercel functions are lightweight AWS Lambda containers with a 50MB/250MB size limit and 10s execution timeout. They do **NOT** bundle Microsoft Edge or desktop Chromium binaries. |

> [!IMPORTANT]
> **How REPROX handles Playwright on Serverless (Vercel):**  
> REPROX includes an **intelligent dual runner architecture**:
> 1. When running against a persistent container host (Railway, Render, Fly.io, or local), it executes the genuine Microsoft Edge browser process.
> 2. When running on serverless environments where browser binaries are absent, REPROX's frontend automatically uses its **high-fidelity client-side browser simulator**, executing every navigation, fill, assertion, duration calculation, and failure diff directly inside the user's browser.

---

## 2. Deploying Frontend on Netlify (Step-by-Step)

### Option A: Via Netlify Web Dashboard
1. Push your repository to **GitHub**.
2. Go to [app.netlify.com](https://app.netlify.com) and click **"Add new site"** > **"Import an existing project"**.
3. Select your GitHub repository.
4. Netlify will automatically detect the included **`netlify.toml`**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Environment variables"** and add:
   - `VITE_API_URL` = `https://your-vercel-backend.vercel.app/api`
6. Click **"Deploy reprox"**.
7. Netlify will assign a live URL (e.g. `https://reprox-angle.netlify.app`).

### Option B: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend and deploy
cd frontend
netlify deploy --prod
```

The preconfigured `frontend/public/_redirects` ensures all React routes (`/app`, `/docs`, `/story`) rewrite to `/index.html` without 404 errors.

---

## 3. Deploying Django Backend on Vercel (Step-by-Step)

To host the Django REST API on Vercel Serverless:

### Step 3.1: Create the Vercel Python Entrypoint
In `backend/`, create a file `api/index.py` that exposes the Django WSGI application:

```python
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reprox_backend.settings')

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()
```

### Step 3.2: Configure `backend/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

### Step 3.3: Configure Production PostgreSQL
Because Vercel serverless functions have a read-only filesystem, create a free database at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).

In your Vercel Project settings, set these Environment Variables:
```env
DATABASE_URL=postgres://user:password@ep-xyz.neon.tech/reprox?sslmode=require
DJANGO_SECRET_KEY=your-production-secret-key-at-least-50-characters
DJANGO_DEBUG=False
CORS_ALLOWED_ORIGINS=https://reprox-angle.netlify.app,https://*.netlify.app
CSRF_TRUSTED_ORIGINS=https://reprox-angle.netlify.app,https://*.netlify.app
```

---

## 4. Why We Recommend Frontend on Netlify + Backend on Railway/Render

If your goal is **100% authentic headless browser automation with genuine Microsoft Edge/Chromium execution**, the most reliable combination is:

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│     FRONTEND on NETLIFY         │      │     BACKEND on RAILWAY/RENDER   │
│ • Free Global CDN               │ ───> │ • Full Linux Container          │
│ • Fast React 19 SPA builds      │      │ • Microsoft Edge / Chromium     │
│ • Instant Git push previews     │      │ • Persistent Process Execution  │
└─────────────────────────────────┘      └─────────────────────────────────┘
```

1. **Netlify** hosts your visual identity, landing pages, timeline UI, and voice intake.
2. **Railway** ($5 free credit, zero setup) or **Render** hosts the Django API and the real Playwright subprocess runner without serverless timeout limits.
3. Your Netlify frontend talks to the Railway backend via `VITE_API_URL=https://reprox.up.railway.app/api`.

---

## 5. Summary Checklist

- [x] **Netlify Configuration Ready**: `netlify.toml` and `frontend/public/_redirects` created.
- [x] **Vercel Configuration Ready**: `vercel.json` and `frontend/vercel.json` created.
- [x] **CORS Headers**: Backend configured to whitelist Netlify domains (`https://*.netlify.app`).
- [x] **Dual Playwright Support**: Genuine Edge browser subprocess locally / on container hosts, with graceful in-browser simulation on serverless platforms.
