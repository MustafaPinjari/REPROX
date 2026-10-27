/**
 * REPROX Django Backend API Client
 * Connects the React/TypeScript frontend to the Django REST Framework backend on port 8000.
 * Enforces TokenAuthentication with safe credential handling and tenant isolation.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const TOKEN_KEY = 'reprox_auth_token';
const USER_KEY = 'reprox_auth_user';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getAuthHeaders(includeJson = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

export interface BackendHealthResponse {
  status: string;
  service: string;
  version: string;
  database: string;
  playwrightRunner: string;
  wisprFlowEngine: string;
}

export async function checkBackendHealth(): Promise<BackendHealthResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health/`);
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. INCIDENTS API (Owner Scoped)
// ─────────────────────────────────────────────────────────────
export async function fetchIncidentsApi(statusFilter?: string, searchQuery?: string) {
  try {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    if (searchQuery) params.set('search', searchQuery);

    const res = await fetch(`${API_BASE_URL}/incidents/?${params.toString()}`, {
      headers: getAuthHeaders(false),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/incidents/ unavailable, using local state:', err);
  }
  return null;
}

export async function createIncidentApi(data: {
  incident_id?: string;
  title: string;
  description: string;
  status?: string;
  severity?: string;
  tags?: string[];
  spec_file?: string;
  is_primary_demo?: boolean;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/incidents/ creation failed:', err);
  }
  return null;
}

export async function deleteIncidentApi(incidentId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend delete incident failed:', err);
    return false;
  }
}


// ─────────────────────────────────────────────────────────────
// 2. TIMELINE EVENTS API (Owner Scoped + PII Redacted)
// ─────────────────────────────────────────────────────────────
export async function syncTimelineEventsApi(incidentId: string, events: any[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/events/batch/`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ incident_id: incidentId, events }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/events/batch/ unavailable, using local state:', err);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 3. PLAYWRIGHT TESTS & GENUINE SUBPROCESS RUNNER API
// ─────────────────────────────────────────────────────────────
export async function generatePlaywrightTestApi(events: any[], incidentId = 'INC-104') {
  try {
    const res = await fetch(`${API_BASE_URL}/tests/generate/`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ events, incident_id: incidentId }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/tests/generate/ unavailable, using local synthesis:', err);
  }
  return null;
}

export async function runPlaywrightTestApi(buildMode: 'buggy' | 'fixed', incidentId = 'INC-104') {
  // First try Django backend runner
  try {
    const res = await fetch(`${API_BASE_URL}/tests/run/`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ buildMode, incident_id: incidentId }),
    });
    if (res.ok) return await res.json();
  } catch {
    // If backend port 8000 is not reachable, fallback to frontend dev middleware
    try {
      const res = await fetch('/api/run-playwright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: buildMode, buildMode }),
      });
      if (res.ok) return await res.json();
    } catch (err2) {
      console.error('All Playwright runner endpoints failed:', err2);
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 4. WISPR FLOW ACOUSTIC INTAKE API
// ─────────────────────────────────────────────────────────────
export async function transcribeVoiceApi(transcriptText: string, audioBlob?: Blob) {
  try {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      if (transcriptText) formData.append('transcript', transcriptText);

      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Token ${token}`;

      const res = await fetch(`${API_BASE_URL}/voice/transcribe/`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (res.ok) return await res.json();
    } else {
      const res = await fetch(`${API_BASE_URL}/voice/transcribe/`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ transcript: transcriptText, source: 'browser-speech-nlp' }),
      });
      if (res.ok) return await res.json();
    }
  } catch (err) {
    console.warn('Backend /api/voice/transcribe/ unavailable, using local speech parser:', err);
  }
  return null;
}

export async function parseVoiceIntentApi(transcriptText: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/voice/parse-intent/`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ transcript: transcriptText }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/voice/parse-intent/ unavailable, using local intent grammar:', err);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 5. AUTHENTICATION API
// ─────────────────────────────────────────────────────────────
export async function loginUserApi(email: string, password?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password || 'reprox-demo-pass' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setAuthToken(data.token);
        if (typeof window !== 'undefined' && data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      }
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/auth/login/ unavailable, using local session:', err);
  }
  return null;
}

export async function registerUserApi(email: string, password: string, fullName?: string) {
  try {
    const names = (fullName || '').split(' ');
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        first_name: names[0] || '',
        last_name: names.slice(1).join(' ') || '',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setAuthToken(data.token);
        if (typeof window !== 'undefined' && data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      }
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/auth/register/ unavailable:', err);
  }
  return null;
}

export async function fetchMeApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: getAuthHeaders(false),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/auth/me/ unavailable:', err);
  }
  return null;
}

export async function recoverPasswordApi(email: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/recover-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend /api/auth/recover-password/ unavailable:', err);
  }
  return null;
}
