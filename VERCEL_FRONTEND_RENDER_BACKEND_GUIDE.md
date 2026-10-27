# Complete Guide: Frontend on Vercel + Backend & Database on Render (100% Free)

This guide walks you through deploying **REPROX** with:
- **Frontend**: Hosted on **Vercel** (React 19 + TypeScript + Vite)
- **Backend**: Hosted on **Render** (Django 6 REST API + Gunicorn)
- **Database**: Hosted on **Render** (Render Free PostgreSQL Database)

Both platforms are **100% Free** with **NO credit card required**.

---

## Architecture Flow

```
┌─────────────────────────────────┐
│       FRONTEND on VERCEL        │
│    https://reprox.vercel.app    │
│  • React 19 + Vite 6 + Tailwind │
│  • Global Edge CDN              │
└───────────────┬─────────────────┘
                │
                │ HTTPS REST API Requests
                │ `VITE_API_URL=https://reprox-backend.onrender.com/api`
                ▼
┌────────────────────────────────────────────────────────┐
│                        RENDER                          │
│                                                        │
│   ┌───────────────────────────────────────────────┐    │
│   │        BACKEND WEB SERVICE (Free Tier)        │    │
│   │    https://reprox-backend.onrender.com        │    │
│   │  • Python 3.12 + Django + Gunicorn            │    │
│   │  • Token Authentication & Zero-Trust Scrubbing│    │
│   └───────────────────────┬───────────────────────┘    │
│                           │                            │
│                           │ Internal Network           │
│                           │ `DATABASE_URL`             │
│                           ▼                            │
│   ┌───────────────────────────────────────────────┐    │
│   │      POSTGRESQL DATABASE (Free Tier)          │    │
│   │    `reprox-db`                                │    │
│   │  • Managed PostgreSQL on Render               │    │
│   └───────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

---

## Step 1: Deploy Backend & Database on Render (5 Minutes)

You can deploy both the database and the Django backend together using the included **`render.yaml` Blueprint** (1 Click) or manually via the dashboard.

### Option A: 1-Click Blueprint (Recommended)
1. Push your repository to **GitHub**.
2. Log in to **[dashboard.render.com](https://dashboard.render.com)** (sign in with GitHub, no credit card required).
3. Click **"New +"** in the top navigation bar and select **"Blueprint"**.
4. Connect your **REPROX** GitHub repository.
5. Render will automatically detect the **`render.yaml`** file in your repo:
   - It will show **1 Web Service** (`reprox-backend`) and **1 Database** (`reprox-db`).
   - Both are set to the **Free** tier ($0/month).
6. Click **"Apply"**.
7. Render will automatically:
   - Create your PostgreSQL database (`reprox-db`).
   - Generate a secure `DJANGO_SECRET_KEY`.
   - Wire the database connection string into the backend.
   - Run `pip install -r requirements.txt && python manage.py migrate`.
   - Start the Gunicorn web server.
8. Once deployment finishes, copy your live backend URL from the dashboard:
   ```text
   https://reprox-backend.onrender.com
   ```
   *(Verify it by opening `https://reprox-backend.onrender.com/api/health/` in your browser. You will see `{"status":"healthy","database":"connected"}`)*.

---

### Option B: Manual Setup on Render (If Not Using Blueprint)
If you prefer creating them one by one in the Render UI:

#### 1. Create the Database on Render:
1. Click **"New +"** > **"PostgreSQL"**.
2. Name: `reprox-db`.
3. Database: `reprox`.
4. User: `reprox_user`.
5. Region: Choose whichever is closest (e.g., `Ohio (US East)` or `Frankfurt (EU Central)`).
6. Plan: Select **Free**.
7. Click **"Create Database"**.
8. In the database dashboard, copy the **"Internal Database URL"** (e.g. `postgres://reprox_user:pass@dpg-xxxxxx-a/reprox`).

#### 2. Create the Backend Web Service on Render:
1. Click **"New +"** > **"Web Service"**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name**: `reprox-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Same region as your database.
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn reprox_backend.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan**: **Free**.
4. Scroll to **"Environment Variables"** and add:
   - `DATABASE_URL` = *(Paste the Internal Database URL from the step above)*
   - `DJANGO_SECRET_KEY` = `reprox-secure-production-random-secret-key-2026`
   - `DJANGO_DEBUG` = `False`
   - `CORS_ALLOWED_ORIGINS` = `*`
   - `CSRF_TRUSTED_ORIGINS` = `https://*.vercel.app,https://*.onrender.com`
   - `PYTHON_VERSION` = `3.12.0`
5. Click **"Create Web Service"**.

---

## Step 2: Deploy Frontend on Vercel (2 Minutes)

Now connect your React frontend to the live Render backend.

1. Go to **[vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Select your **REPROX** GitHub repository and click **"Import"**.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **"Environment Variables"** and add:
   ```env
   VITE_API_URL = https://reprox-backend.onrender.com/api
   ```
   *(Important: Replace with your actual Render URL and make sure to append `/api` at the end)*.
6. Click **"Deploy"**.
7. In ~60 seconds, Vercel will complete the build and assign your live production URL (e.g., `https://reprox.vercel.app`).

---

## Step 3: Test & Verify End-to-End

1. Open your live Vercel URL in your browser (`https://reprox.vercel.app`).
2. **Register/Login**: Navigate to the Auth page and create an account. You will receive a genuine authentication token stored in localStorage and verified against your Render PostgreSQL database.
3. **Voice Intake**: Go to **"Create New Voice Incident"** and click **"Use Sample Scenario"**.
4. **Interactive Timeline**: Click **"Launch Sandbox Reproduction"** and verify that timeline events and zero-trust scrubbed values are displayed.
5. **Dual Verifier**: Click **"Execute Buggy Spec"** (observe Exit Code 1 defect reproduction) and then click **"Verify Fixed Spec"** (observe Exit Code 0 fix verification).

---

## Important Tips for Render's Free Tier

> [!NOTE]
> **Render Free Web Service "Spin Down"**:
> On Render's free tier, the backend web service goes to sleep after 15 minutes of inactivity.
> When you make the first request after it has been asleep, it takes **20–30 seconds** to wake up (a cold start).
> Once it is awake, all API responses take only **50–150ms**.
> REPROX's frontend automatically handles network delays gracefully with built-in loading spinners.
