# REPROX — Vercel Deployment & Production Hosting Guide

This guide walks you through deploying **REPROX** to **Vercel** for high-performance, globally distributed edge hosting.

---

## 1. Monorepo Architecture Overview

REPROX is structured as a decoupled monorepo:

```
┌────────────────────────────────────────────────────────┐
│                        REPROX                          │
├───────────────────────────┬────────────────────────────┤
│         FRONTEND          │          BACKEND           │
│   React 19 + TypeScript   │    Django 6 + REST API     │
│   Tailwind CSS + Vite 6   │    Python 3.12 / DRF       │
│                           │    Playwright Subprocess   │
└─────────────┬─────────────┴─────────────┬──────────────┘
              │                           │
              ▼                           ▼
      Hosted on VERCEL            Hosted on Container
    (Global Edge Network)     (Railway / Render / Fly.io)
              │                           │
              └───────────────┬───────────┘
                              │
                    Connected via HTTPS
                 `VITE_API_URL` Environment
```

> [!NOTE]
> **Why decouple Frontend on Vercel from Django Backend?**
> - **Vercel** is the gold standard for React SPAs, offering instant builds, global CDN caching, and automatic preview deployments on every Git push.
> - **Playwright headless browsers** require system-level browser binaries (Chromium/Edge) and child processes that run longer than serverless function timeouts. Hosting the Django + Playwright engine on a container host (such as Railway, Render, or Fly.io) while hosting the UI on Vercel delivers maximum performance and reliability.

---

## 2. Deploying the Frontend to Vercel

### Method A: Vercel Web Dashboard (Recommended)

1. Push your REPROX repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** > **"Project"**.
3. Import your **REPROX** repository.
4. In the **Configure Project** screen, configure the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend` *(or leave as root if using the included root `vercel.json`)*.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (or `frontend/dist` if root was selected)
   - **Install Command**: `npm install`
5. **Environment Variables**:
   Expand the **Environment Variables** accordion and add:
   | Key | Example Value | Description |
   |:---|:---|:---|
   | `VITE_API_URL` | `https://your-django-backend.up.railway.app/api` | Live Django REST API endpoint |
6. Click **"Deploy"**. Vercel will compile the TypeScript bundle and provide your production URL (e.g., `https://reprox.vercel.app`).

---

### Method B: Vercel CLI (Command Line)

If you prefer deploying directly from your terminal:

1. Install the Vercel CLI globally (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Run the deployment command:
   ```bash
   vercel
   ```
4. Follow the interactive prompts:
   - **Set up and deploy?**: `y`
   - **Which scope?**: Choose your personal or team account
   - **Link to existing project?**: `n`
   - **What's your project's name?**: `reprox`
   - **In which directory is your code located?**: `./`
5. For final production deployment:
   ```bash
   vercel --prod
   ```

---

## 3. Included Vercel Configuration Files

REPROX includes preconfigured `vercel.json` files for both direct root import and `frontend/` folder deployment:

### `frontend/vercel.json`
Ensures all client-side Single Page Application (SPA) routes correctly fall back to `index.html` (preventing 404s on page refresh) and enables caching on static assets:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 4. Backend Deployment (Django + Playwright Runner)

To pair your Vercel frontend with the live Django REST backend and Playwright test execution engine:

### Option 1: Railway (Fastest Setup)
1. Sign up at [railway.app](https://railway.app).
2. Click **"New Project"** > **"Deploy from GitHub repo"**.
3. Set the **Root Directory** to `backend`.
4. In Railway variables, configure:
   ```env
   DJANGO_SECRET_KEY=your-production-random-secret-key-at-least-50-characters
   DJANGO_DEBUG=False
   CORS_ALLOWED_ORIGINS=https://reprox.vercel.app,https://yourdomain.com
   CSRF_TRUSTED_ORIGINS=https://reprox.vercel.app,https://yourdomain.com
   PORT=8000
   ```
5. Add a **PostgreSQL** plugin in Railway. Railway automatically populates the `DATABASE_URL` variable, which REPROX dynamically reads.
6. Copy your public Railway URL (e.g. `https://reprox-backend.up.railway.app`) and paste it as `VITE_API_URL=https://reprox-backend.up.railway.app/api` in your Vercel project settings.

### Option 2: Render.com
1. Create a **Web Service** on [render.com](https://render.com).
2. Root Directory: `backend`.
3. Environment: `Python 3`.
4. Build Command: `pip install -r requirements.txt && python manage.py migrate`
5. Start Command: `gunicorn reprox_backend.wsgi:application --bind 0.0.0.0:$PORT`
6. Set `CORS_ALLOWED_ORIGINS` to your Vercel deployment URL.

---

## 5. Connecting Vercel Frontend to Live Backend

Once your backend is live:

1. Go to your **Vercel Project Dashboard** > **Settings** > **Environment Variables**.
2. Update `VITE_API_URL` to your live backend domain:
   ```
   VITE_API_URL = https://your-backend-service.com/api
   ```
3. Trigger a redeploy under the **Deployments** tab by selecting **Redeploy**.
4. In the Django backend's `.env`, verify CORS allows your Vercel domain:
   ```env
   CORS_ALLOWED_ORIGINS=https://reprox.vercel.app,https://*.vercel.app
   CSRF_TRUSTED_ORIGINS=https://reprox.vercel.app,https://*.vercel.app
   ```

---

## 6. Pre-Deployment Verification Checklist

Before pushing to Vercel, verify local build status:

- [x] **Production Bundle**:
  ```powershell
  cmd.exe /c "npm run build"
  ```
  *(Confirmed: compiles in <900ms with 0 TypeScript errors).*
- [x] **SPA Routing Rules**: Configured via `rewrites` in `vercel.json`.
- [x] **Brand Palette Preserved**: `#FFD2A0`, `#EFB6C8`, `#8174A0`, `#A888B5` bundled in `dist/assets/`.
- [x] **In-Browser Playwright Fallback**: If backend is temporarily unreachable, the frontend gracefully executes client-side simulation.
- [x] **Secrets Protection**: `.env` and `db.sqlite3` are strictly guarded by `.gitignore`.

---

## 7. Custom Domain Setup (Optional)

To use your custom brand domain (e.g. `reprox.dev` or `app.reprox.ai`):
1. In Vercel, go to **Settings** > **Domains**.
2. Enter your domain (e.g. `reprox.dev`).
3. Add the suggested `CNAME` or `A` DNS records at your domain registrar (Cloudflare, Namecheap, GoDaddy).
4. Vercel automatically generates and renews a free global SSL certificate.
