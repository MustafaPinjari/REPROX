# REPROX — 100% Free Production Deployment Guide ($0.00 Forever)

This guide shows you how to deploy the entire **REPROX** full-stack application **completely free** with **NO credit card required**.

---

## The Recommended 100% Free Stack

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│       FRONTEND (100% FREE)      │      │       BACKEND (100% FREE)       │
│         VERCEL or NETLIFY       │      │           RENDER.COM            │
│  • Free Hobby Tier ($0/mo)      │ ───> │  • Free Web Service ($0/mo)     │
│  • Global Edge CDN              │      │  • Python 3 + Django + Gunicorn │
│  • Unlimited automatic builds   │      │  • NO credit card required      │
│  • NO credit card required      │      └────────────────┬────────────────┘
└─────────────────────────────────┘                       │
                                                          ▼
                                         ┌─────────────────────────────────┐
                                         │      DATABASE (100% FREE)       │
                                         │            NEON.TECH            │
                                         │  • Free Serverless PostgreSQL   │
                                         │  • 0.5 GB storage (forever)     │
                                         │  • NO credit card required      │
                                         └─────────────────────────────────┘
```

---

## Step 1: Create Free PostgreSQL Database (Neon.tech) — 2 Minutes

Vercel and Render require an external database for persistent storage (local SQLite files reset on free server restarts).

1. Go to **[neon.tech](https://neon.tech)** and sign up with your **GitHub** account (no credit card needed).
2. Click **"Create Project"**.
   - Project Name: `reprox-db`
   - Region: Choose nearest to you (e.g. `US East` or `EU Central`).
3. Once created, copy your **Connection String** from the dashboard. It looks like:
   ```text
   postgres://alex:AbCdEf123456@ep-cool-cloud-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this string — you will use it as `DATABASE_URL` in Step 2.

---

## Step 2: Deploy Django Backend on Render.com (Free) — 4 Minutes

Render provides a 100% free Web Service tier that runs Python/Django web servers 24/7.

1. Go to **[render.com](https://render.com)** and sign up with **GitHub** (no credit card required).
2. Click **"New +"** in the top navigation and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and connect your REPROX repo.
4. Configure the service settings:
   - **Name**: `reprox-backend`
   - **Region**: Same region as your Neon database (e.g. `Ohio, USA` or `Frankfurt`).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && python manage.py migrate
     ```
   - **Start Command**:
     ```bash
     gunicorn reprox_backend.wsgi:application --bind 0.0.0.0:$PORT
     ```
   - **Instance Type**: Select **"Free"** ($0/month).

5. Scroll down to **"Environment Variables"** and add:
   | Key | Value | Notes |
   |:---|:---|:---|
   | `DATABASE_URL` | *Paste your Neon.tech connection string from Step 1* | Enables production PostgreSQL |
   | `DJANGO_SECRET_KEY` | `reprox-production-secret-key-live-free-2026-secure` | 50+ random characters |
   | `DJANGO_DEBUG` | `False` | Production security |
   | `CORS_ALLOWED_ORIGINS` | `*` *(or your Vercel/Netlify URL after Step 3)* | Allows cross-origin API calls |
   | `CSRF_TRUSTED_ORIGINS` | `https://*.vercel.app,https://*.netlify.app` | Prevents CSRF rejections |
   | `PYTHON_VERSION` | `3.12.0` | Standard Python runtime |

6. Click **"Deploy Web Service"**.
7. Wait ~2 minutes for the build to complete. Render will display your live backend URL, for example:
   ```text
   https://reprox-backend.onrender.com
   ```
   *Verify it works by opening `https://reprox-backend.onrender.com/api/health/` in your browser. You will see `{"status":"healthy","database":"connected"}`.*

---

## Step 3: Deploy Frontend on Vercel or Netlify (Free) — 2 Minutes

Choose whichever platform you prefer (both are 100% free, no credit card needed):

### Option A: Deploy on Vercel
1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **"Add New..."** > **"Project"** and select your REPROX repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **"Environment Variables"** and add:
   ```env
   VITE_API_URL = https://reprox-backend.onrender.com/api
   ```
   *(Replace with your actual Render URL from Step 2, appending `/api`)*.
5. Click **"Deploy"**.

### Option B: Deploy on Netlify
1. Go to **[app.netlify.com](https://app.netlify.com)** and sign in with GitHub.
2. Click **"Add new site"** > **"Import an existing project"** and select your repo.
3. Netlify will auto-detect the included `netlify.toml`:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. In **"Environment variables"**, add:
   ```env
   VITE_API_URL = https://reprox-backend.onrender.com/api
   ```
5. Click **"Deploy reprox"**.

---

## Step 4: Final 1-Minute Connection Verification

1. Open your live frontend URL (e.g. `https://reprox.vercel.app` or `https://reprox.netlify.app`).
2. Go to **"Sign In / Sign Up"** and register a new test user account.
3. Open **"Create New Voice Incident"** and click **"Use Sample Scenario"**.
4. Click **"Launch Sandbox Reproduction"**.
5. Click **"Execute Buggy Spec"** and observe the verified defect reproduction (Exit Code 1).
6. Click **"Verify Fixed Spec"** and observe all 7 steps passing (Exit Code 0).

---

## Free Tier Notes & Limitations

- **Render Free Web Service "Cold Starts"**: On Render's free tier, the backend spins down after 15 minutes of inactivity. When a new request arrives, it takes ~20–30 seconds to wake up. Once awake, all requests respond instantly.
- **Neon Database**: Free forever, up to 0.5 GB of data storage, which can comfortably store tens of thousands of bug reproduction timeline events.
- **Zero Incurred Charges**: None of these three services (Vercel, Netlify, Render Free, Neon Free) require credit cards for signup.
