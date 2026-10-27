import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Mic,
  ShieldCheck,
  Code2,
  FileCode,
  ChevronRight,
} from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface DocsPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
}

export const DocsPage: React.FC<DocsPageProps> = ({ onBack, onNavigateToApp }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDocSection, setActiveDocSection] = useState<'quickstart' | 'wispr' | 'synthesis' | 'scrubber' | 'cli'>('quickstart');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navItems = [
    { id: 'quickstart', label: '1. Quickstart & Architecture', icon: Terminal },
    { id: 'wispr', label: '2. Wispr Flow Acoustic Intake', icon: Mic },
    { id: 'synthesis', label: '3. Deterministic Playwright AST', icon: Code2 },
    { id: 'scrubber', label: '4. Zero-Trust PII Redaction', icon: ShieldCheck },
    { id: 'cli', label: '5. Genuine Subprocess Execution', icon: FileCode },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A24] font-sans selection:bg-[#EFB6C8] selection:text-[#1F1A24]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE7DF] px-6 lg:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B6275] hover:text-[#1F1A24] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <ReproxLogo />
          <button
            onClick={onNavigateToApp}
            className="px-4 py-2 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Launch Studio
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-14 pb-10 px-6 lg:px-12 border-b border-[#EBE7DF] bg-[#FFFDF9]/60 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-xs font-bold text-[#8174A0]">
            <BookOpen className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>DEVELOPER DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A24]">
            REPROX Architecture &amp; Playwright Guide
          </h1>
          <p className="text-sm sm:text-base text-[#6B6275] max-w-2xl mx-auto leading-relaxed">
            Learn how REPROX turns Wispr Flow streaming speech into reproducible Playwright regression tests and executes them against native browser engines.
          </p>
        </div>
      </header>

      {/* Main Documentation Container */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left TOC Sidebar (3 cols) */}
          <aside className="lg:col-span-4 sticky top-24 space-y-2 bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8174A0] px-3 block mb-2">
              Documentation Index
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeDocSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDocSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#8174A0] text-white shadow-xs'
                      : 'text-[#5A5264] hover:bg-[#FAF7F2] hover:text-[#1F1A24]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1' : 'opacity-40'}`} />
                </button>
              );
            })}

            <div className="pt-4 border-t border-[#EBE7DF] mt-4 px-3 space-y-2">
              <span className="text-[11px] font-semibold text-[#8174A0] block">
                Source Code &amp; Binaries
              </span>
              <p className="text-[11px] text-[#6B6275] leading-relaxed">
                REPROX tests execute on Microsoft Edge or Chromium in headless mode via Node.js subprocesses.
              </p>
            </div>
          </aside>

          {/* Right Content Area (8 cols) */}
          <main className="lg:col-span-8 space-y-8 bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Section 1: Quickstart */}
            {activeDocSection === 'quickstart' && (
              <section className="space-y-6">
                <div className="border-b border-[#EBE7DF] pb-4">
                  <h2 className="text-2xl font-bold text-[#1F1A24]">Quickstart &amp; Architecture</h2>
                  <p className="text-xs sm:text-sm text-[#6B6275] mt-1">
                    Turn a voice bug report into a passing/failing Playwright test in under 60 seconds.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-[#3D3546]">
                  <p>
                    REPROX operates as a continuous three-stage pipeline:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 font-medium text-xs sm:text-sm text-[#1F1A24] pl-2">
                    <li><strong className="text-[#8174A0]">Acoustic Dictation:</strong> Voice captured via Wispr Flow is parsed into structured intent entities (target element, input values, and expected assertions).</li>
                    <li><strong className="text-[#8174A0]">AST Code Synthesis:</strong> Timeline DOM interactions are translated into deterministic Playwright TypeScript code using semantic <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#8174A0] border border-[#EBE7DF]">getByRole</code> locators.</li>
                    <li><strong className="text-[#8174A0]">Genuine Subprocess Execution:</strong> Tests are executed against both the buggy build (Exit Code 1) and fixed build (Exit Code 0) with live console streaming.</li>
                  </ol>

                  {/* Code Block */}
                  <div className="mt-6 rounded-xl bg-[#1F1A24] text-[#FAF7F2] overflow-hidden border border-black/20">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10 text-xs font-mono">
                      <span className="text-[#A888B5]">terminal</span>
                      <button
                        onClick={() => copyToClipboard('npm run test:e2e:buggy && npm run test:e2e:fixed', 'code-1')}
                        className="flex items-center gap-1.5 text-[11px] text-[#FFD2A0] hover:underline cursor-pointer"
                      >
                        {copiedId === 'code-1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === 'code-1' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-4 font-mono text-xs text-[#FFD2A0] overflow-x-auto leading-relaxed">
{`# Execute genuine Playwright test against buggy build (fails on missing GST alert)
npm run test:e2e:buggy

# Verify test against fixed build v1.0.5 (passes all 7 assertions)
npm run test:e2e:fixed`}
                    </pre>
                  </div>
                </div>
              </section>
            )}

            {/* Section 2: Wispr Flow */}
            {activeDocSection === 'wispr' && (
              <section className="space-y-6">
                <div className="border-b border-[#EBE7DF] pb-4">
                  <h2 className="text-2xl font-bold text-[#1F1A24]">Wispr Flow Acoustic Intake</h2>
                  <p className="text-xs sm:text-sm text-[#6B6275] mt-1">
                    Continuous hands-free dictation with automated grammatical intent extraction.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-[#3D3546]">
                  <p>
                    Wispr Flow enables QA engineers to speak naturally while interacting with an application. Our intent grammar matches common natural language bug patterns:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] space-y-1">
                      <span className="text-xs font-bold text-[#8174A0]">Acoustic Utterance</span>
                      <p className="text-xs italic text-[#5A5264]">
                        &ldquo;Submitting without a GST number shows success instead of error toast.&rdquo;
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] space-y-1">
                      <span className="text-xs font-bold text-[#8174A0]">Extracted AST Assertion</span>
                      <p className="text-xs font-mono text-[#8174A0]">
                        expect(page.getByRole('alert')).toBeVisible()
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Section 3: Synthesis */}
            {activeDocSection === 'synthesis' && (
              <section className="space-y-6">
                <div className="border-b border-[#EBE7DF] pb-4">
                  <h2 className="text-2xl font-bold text-[#1F1A24]">Deterministic Playwright AST</h2>
                  <p className="text-xs sm:text-sm text-[#6B6275] mt-1">
                    Generating resilient, accessible, zero-flakiness test scripts from timeline interactions.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-[#3D3546]">
                  <p>
                    Unlike traditional recorders that output brittle selectors like <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-xs border border-[#EBE7DF]">div &gt; div:nth-child(3) &gt; button</code>, REPROX enforces accessible selector synthesis:
                  </p>

                  {/* Code Block */}
                  <div className="rounded-xl bg-[#1F1A24] text-[#FAF7F2] overflow-hidden border border-black/20">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10 text-xs font-mono">
                      <span className="text-[#A888B5]">repro-buggy.spec.ts</span>
                      <button
                        onClick={() => copyToClipboard(`import { test, expect } from '@playwright/test';\n\ntest('reproduce invoice GST validation bug', async ({ page }) => {\n  await page.goto('http://127.0.0.1:3000/?mode=buggy');\n  await page.fill('#clientName', 'Acme Global Ltd');\n  await page.fill('#invoiceAmount', '4850.00');\n  await page.click('#dispatchInvoiceBtn');\n  await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });\n});`, 'code-2')}
                        className="flex items-center gap-1.5 text-[11px] text-[#FFD2A0] hover:underline cursor-pointer"
                      >
                        {copiedId === 'code-2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === 'code-2' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-4 font-mono text-xs text-[#FFD2A0] overflow-x-auto leading-relaxed">
{`import { test, expect } from '@playwright/test';

test('reproduce invoice GST validation bug', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/?mode=buggy');
  await page.fill('#clientName', 'Acme Global Ltd');
  await page.fill('#invoiceAmount', '4850.00');
  await page.click('#dispatchInvoiceBtn');
  
  // Buggy version fails here (no alert rendered), fixed version passes
  await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
});`}
                    </pre>
                  </div>
                </div>
              </section>
            )}

            {/* Section 4: Scrubber */}
            {activeDocSection === 'scrubber' && (
              <section className="space-y-6">
                <div className="border-b border-[#EBE7DF] pb-4">
                  <h2 className="text-2xl font-bold text-[#1F1A24]">Zero-Trust PII Redaction</h2>
                  <p className="text-xs sm:text-sm text-[#6B6275] mt-1">
                    Redacting live credentials, JWT bearer tokens, and payment data in memory before storage.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-[#3D3546]">
                  <p>
                    The privacy scrubber operates locally in the browser memory heap. It monitors all input changes and applies regex and algorithmic sanitization:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8174A0]" />
                      <span><strong>Credit Cards:</strong> Luhn-10 algorithm check; matches 13-19 digit PAN sequences.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8174A0]" />
                      <span><strong>Authorization Bearer Tokens:</strong> JWT headers matching <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-xs">eyJ...</code></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8174A0]" />
                      <span><strong>Password Fields:</strong> Automatic one-way cryptographic replacement.</span>
                    </li>
                  </ul>
                </div>
              </section>
            )}

            {/* Section 5: CLI */}
            {activeDocSection === 'cli' && (
              <section className="space-y-6">
                <div className="border-b border-[#EBE7DF] pb-4">
                  <h2 className="text-2xl font-bold text-[#1F1A24]">Genuine Subprocess Execution</h2>
                  <p className="text-xs sm:text-sm text-[#6B6275] mt-1">
                    Launching authentic headless browser processes without mock timers or fabricated exit codes.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-[#3D3546]">
                  <p>
                    Vite hosts an internal middleware endpoint at <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#8174A0] border border-[#EBE7DF]">/api/run-playwright</code>. When called, it forks a child process:
                  </p>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] font-mono text-xs text-[#8174A0] space-y-1">
                    <div>node scripts/run-playwright-exec.cjs buggy  =&gt; Exit Code 1</div>
                    <div>node scripts/run-playwright-exec.cjs fixed  =&gt; Exit Code 0</div>
                  </div>
                  <p className="text-xs text-[#6B6275]">
                    Playwright launches Microsoft Edge with full DOM snapshots and console telemetry piped directly to the user interface.
                  </p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
