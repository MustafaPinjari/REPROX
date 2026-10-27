# REPROX

> **Voice to Repro. Tests that prove.**  
> Transform spoken bug reports into deterministic Playwright tests and verified results. Built for the Wispr Flow Hackathon.

---

## Architecture Overview

REPROX is organized as a clean monorepo:

```
REPROX/
├── backend/            # Django REST Framework Backend (Python 3.14 + SQLite)
│   ├── authentication/ # User profiles, JWT/token auth, password recovery
│   ├── incidents/      # Bug ticket management, statuses & tags
│   ├── events/         # DOM timeline interactions & PII scrubbing
│   ├── tests_runner/   # Playwright AST test synthesis & Edge subprocess runner
│   ├── voice_intake/   # Wispr Flow speech processing & acoustic NLP
│   ├── reprox_backend/ # Django project settings & URL configuration
│   ├── manage.py       # Django CLI
│   └── requirements.txt
│
├── frontend/           # React 19 + TypeScript + Vite 6 + Tailwind Frontend
│   ├── src/            # Complete 15-screen application & design system
│   ├── scripts/        # Native Playwright runner script (Microsoft Edge)
│   ├── tests/          # verify-fixed.spec.ts & repro-buggy.spec.ts
│   ├── package.json
│   └── vite.config.ts
│
├── docs/               # Complete Engineering Documentation
│   ├── ARCHITECTURE.md
│   ├── BACKEND_API.md
│   ├── WISPR_FLOW_INTEGRATION.md
│   └── PLAYWRIGHT_SUBPROCESS_RUNNER.md
│
├── .gitignore          # Monorepo git exclusion rules
├── .env.example        # Environment variable template
├── VERCEL_FRONTEND_RENDER_BACKEND_GUIDE.md # Frontend on Vercel + Backend & DB on Render (Free)
├── FREE_DEPLOYMENT_GUIDE.md   # 100% FREE ($0.00, No Credit Card) full-stack deployment
├── VERCEL_DEPLOYMENT_GUIDE.md # 1-click Vercel hosting instructions
├── render.yaml         # Render 1-click Blueprint for Backend & PostgreSQL DB
├── netlify.toml        # Netlify SPA build configuration
└── vercel.json         # Vercel SPA routing and build configuration
```

---

## 🚀 Recommended Deployment: Vercel (Frontend) + Render (Backend & DB)

To deploy the **Frontend on Vercel** and **Both Backend & Database on Render** (100% Free, No Credit Card), see **[VERCEL_FRONTEND_RENDER_BACKEND_GUIDE.md](file:///c:/Users/mustafa/Desktop/REPROX/VERCEL_FRONTEND_RENDER_BACKEND_GUIDE.md)**:
- **Frontend on Vercel**: High-speed edge CDN for React 19 + TypeScript SPA.
- **Backend on Render**: Full Linux container running Django 6 + Gunicorn via [render.yaml](file:///c:/Users/mustafa/Desktop/REPROX/render.yaml).
- **Database on Render**: Free managed PostgreSQL database (`reprox-db`) linked via internal network.



---

## Quickstart Guide

### 1. Backend Setup (Django)

```powershell
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (SQLite database initialized automatically)
python manage.py migrate

# (Optional) Run Django unit tests
python manage.py test

# Start the Django API server on port 8000
python manage.py runserver 127.0.0.1:8000
```

The Django REST API will be available at `http://127.0.0.1:8000/api/`.  
Check system health at `http://127.0.0.1:8000/api/health/`.

---

### 2. Frontend Setup (React / Vite)

```powershell
# In a separate terminal, navigate to frontend directory
cd frontend

# Install Node dependencies (if not already installed)
npm install

# Start Vite dev server on port 3000
npm run dev

# Production build check (compiles with zero TypeScript errors)
npm run build
```

Open `http://127.0.0.1:3000/` in your browser.

---

## Genuine Playwright Verification Pipeline

REPROX executes genuine headless browser processes using Microsoft Edge Chromium:

```powershell
cd frontend

# 1. Reproduce the bug on v1.0.4 (fails on missing GST validation alert, Exit Code 1)
npm run test:e2e:buggy

# 2. Verify the fix on v1.0.5 (passes all 7 assertions cleanly, Exit Code 0)
npm run test:e2e:fixed

# 3. Run frontend unit tests (Vitest)
npm test
```

---

## Environment Variables Configuration

Copy `.env.example` to `.env` in the root or respective subdirectories:

```env
# Django Backend
DJANGO_SECRET_KEY=reprox-hackathon-insecure-key-2026-prod-grade
DJANGO_DEBUG=True
DJANGO_PORT=8000

# Frontend
VITE_API_URL=http://127.0.0.1:8000/api
FRONTEND_PORT=3000

# Wispr Flow Acoustic Speech Intake (Optional)
WISPR_FLOW_API_KEY=your_api_key_here
WISPR_FLOW_ENDPOINT=https://api.wisprflow.ai/v1
```

---

## Exact Brand Color Palette

- **Warm Peach:** `#FFD2A0`
- **Dusty Rose Pink:** `#EFB6C8`
- **Muted Violet:** `#8174A0`
- **Soft Lavender:** `#A888B5`
- **Surfaces:** Warm Cream (`#FAF7F2`) and Warm Ivory (`#FFFDF9`)
- **Typography:** `Instrument Serif` (editorial headings), `Inter` (UI/controls), `JetBrains Mono` (code/telemetry).
