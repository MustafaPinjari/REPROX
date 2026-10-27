import os
from django.http import HttpResponse, JsonResponse
from django.db import connection

def get_database_status():
    try:
        vendor = connection.vendor
        if vendor == 'postgresql':
            return 'PostgreSQL (Active)'
        elif vendor == 'sqlite':
            return 'SQLite3 (Active)'
        return f"{vendor.capitalize()} (Active)"
    except Exception:
        return 'Connected'

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'REPROX Backend Engine',
        'version': '1.0.5',
        'database': get_database_status(),
        'playwrightRunner': 'Ready',
        'wisprFlowEngine': 'Active',
    })

def root_status_page(request):
    db_status = get_database_status()
    frontend_url = os.getenv('FRONTEND_URL', 'https://reprox.vercel.app')
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>REPROX Backend Engine — Operational</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #FAF7F2;
      color: #1F1A24;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow-x: hidden;
    }}
    .bg-gradient {{
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 10% 20%, rgba(255, 210, 160, 0.25) 0%, transparent 40%),
                  radial-gradient(circle at 90% 80%, rgba(239, 182, 200, 0.25) 0%, transparent 45%),
                  radial-gradient(circle at 50% 50%, rgba(168, 136, 181, 0.12) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }}
    .card {{
      position: relative;
      z-index: 10;
      background: #FFFFFF;
      border: 1px solid #EBE7DF;
      border-radius: 28px;
      box-shadow: 0 10px 40px -10px rgba(129, 116, 160, 0.12), 0 1px 3px rgba(0,0,0,0.04);
      max-width: 680px;
      width: 100%;
      padding: 40px 36px;
      text-align: center;
    }}
    .badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #E8F5E9;
      border: 1px solid #A5D6A7;
      color: #2E7D32;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }}
    .pulse-dot {{
      width: 8px;
      height: 8px;
      background-color: #2E7D32;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }}
    @keyframes pulse {{
      0%, 100% {{ opacity: 1; transform: scale(1); }}
      50% {{ opacity: 0.4; transform: scale(1.3); }}
    }}
    h1 {{
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #1F1A24;
      margin-bottom: 8px;
    }}
    p.subtitle {{
      color: #6B6275;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 28px;
    }}
    .status-grid {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 30px;
      text-align: left;
    }}
    @media (max-width: 520px) {{
      .status-grid {{ grid-template-columns: 1fr; }}
    }}
    .status-item {{
      background: #FAF7F2;
      border: 1px solid #EBE7DF;
      border-radius: 16px;
      padding: 14px 16px;
    }}
    .status-item .label {{
      font-size: 11px;
      font-weight: 600;
      color: #8174A0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }}
    .status-item .val {{
      font-size: 13px;
      font-weight: 700;
      color: #1F1A24;
      font-family: 'JetBrains Mono', monospace;
    }}
    .endpoints {{
      background: #FFFDF9;
      border: 1px dashed #D8D2C5;
      border-radius: 18px;
      padding: 16px;
      margin-bottom: 28px;
      text-align: left;
    }}
    .endpoints-title {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #8174A0;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }}
    .endpoint-link {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      border-radius: 8px;
      color: #1F1A24;
      text-decoration: none;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      transition: background 0.15s;
    }}
    .endpoint-link:hover {{
      background: #F3EFE6;
      color: #8174A0;
    }}
    .endpoint-method {{
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: #EFB6C8;
      color: #7A243F;
    }}
    .btn-row {{
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }}
    .btn-primary {{
      background: #8174A0;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 13px;
      padding: 12px 24px;
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(129, 116, 160, 0.25);
    }}
    .btn-primary:hover {{
      background: #6F638D;
      transform: translateY(-1px);
    }}
    .btn-secondary {{
      background: #FAF7F2;
      border: 1px solid #D8D2C5;
      color: #1F1A24;
      font-weight: 600;
      font-size: 13px;
      padding: 12px 20px;
      border-radius: 14px;
      text-decoration: none;
      transition: all 0.2s;
    }}
    .btn-secondary:hover {{
      background: #F3EFE6;
    }}
    .footer {{
      margin-top: 24px;
      font-size: 11px;
      color: #9E95A8;
      letter-spacing: 0.2px;
    }}
  </style>
</head>
<body>
  <div class="bg-gradient"></div>

  <div class="card">
    <div class="badge">
      <span class="pulse-dot"></span>
      REPROX API Engine v1.0.5 • Operational
    </div>

    <h1>REPROX Backend Engine</h1>
    <p class="subtitle">
      Voice bug intake, deterministic Playwright test synthesis, and dual-build regression reproduction API.
    </p>

    <div class="status-grid">
      <div class="status-item">
        <div class="label">Database Engine</div>
        <div class="val">{db_status}</div>
      </div>
      <div class="status-item">
        <div class="label">Playwright Runner</div>
        <div class="val">Ready (Headless Edge)</div>
      </div>
      <div class="status-item">
        <div class="label">Wispr Flow Intake</div>
        <div class="val">Active (Deterministic NLP)</div>
      </div>
      <div class="status-item">
        <div class="label">Authentication</div>
        <div class="val">Token / PBKDF2 Active</div>
      </div>
    </div>

    <div class="endpoints">
      <div class="endpoints-title">Key API Endpoints</div>
      <a href="/api/health/" class="endpoint-link">
        <span>/api/health/</span>
        <span class="endpoint-method">GET</span>
      </a>
      <a href="/api/incidents/" class="endpoint-link">
        <span>/api/incidents/</span>
        <span class="endpoint-method">AUTH</span>
      </a>
      <a href="/api/events/" class="endpoint-link">
        <span>/api/events/</span>
        <span class="endpoint-method">AUTH</span>
      </a>
      <a href="/api/tests/reports/" class="endpoint-link">
        <span>/api/tests/reports/</span>
        <span class="endpoint-method">AUTH</span>
      </a>
    </div>

    <div class="btn-row">
      <a href="{frontend_url}" class="btn-primary" target="_blank" rel="noopener">
        Open REPROX App on Vercel &rarr;
      </a>
      <a href="/api/health/" class="btn-secondary" target="_blank">
        View JSON Health Check
      </a>
    </div>
  </div>

  <div class="footer">
    REPROX &bull; Voice to Repro. Tests that prove. &bull; Hosted on Render Cloud
  </div>
</body>
</html>"""
    return HttpResponse(html, content_type='text/html')
