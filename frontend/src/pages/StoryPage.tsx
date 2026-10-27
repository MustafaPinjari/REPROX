import React from 'react';
import { Sparkles, ArrowLeft, Mic, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface StoryPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onBack, onNavigateToApp }) => {
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

      {/* Hero Banner */}
      <header className="relative pt-16 pb-20 px-6 lg:px-12 overflow-hidden border-b border-[#EBE7DF]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-xs font-bold text-[#8174A0]">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>THE REPROX GENESIS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1F1A24] leading-[1.1]">
            We got tired of writing <br />
            <span className="font-serif-title italic font-normal text-[#8174A0]">
              unreproducible bug tickets.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#6B6275] max-w-2xl mx-auto leading-relaxed pt-2">
            Engineering hours are wasted deciphering vague Slack messages. REPROX was built to transform hands-free voice descriptions directly into deterministic Playwright tests that prove the defect.
          </p>
        </div>
      </header>

      {/* Main Narrative Article */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12 leading-relaxed text-sm sm:text-base text-[#3D3546]">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1F1A24] tracking-tight">
            The Flaky Reproduction Crisis
          </h2>
          <p>
            In modern software teams, bug reports arrive in chaotic forms: a frantic audio note on Slack, a blurry partial screenshot, or a 10-line email describing an invoice submission failure that works fine on staging. Engineers spend an average of 4.2 hours attempting to configure local environments just to reproduce a single edge-case.
          </p>
          <p>
            Traditional automated recording tools captured fragile XPath selectors and unscrubbed session cookies, leaking sensitive customer credentials and breaking on every minor CSS refactor. We needed a system that understood intent, scrubbed sensitive customer data automatically, and emitted robust, role-based Playwright code.
          </p>
        </section>

        {/* Highlight Quote with Mountain Lake Vignette */}
        <div className="relative rounded-2xl overflow-hidden border border-[#EBE7DF] p-8 sm:p-10 my-8 shadow-xs text-center bg-[#FFFDF9]">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="font-handwriting text-3xl sm:text-4xl text-[#8174A0] font-bold block">
              &ldquo;Voice to Repro. Tests that prove.&rdquo;
            </span>
            <p className="text-xs text-[#6B6275] uppercase tracking-wider font-semibold">
              The Guiding Engineering Manifesto
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1F1A24] tracking-tight">
            The Three Pillars of REPROX
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#EFB6C8]/40 text-[#8174A0] flex items-center justify-center font-bold">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1A24]">1. Acoustic Intake</h3>
              <p className="text-xs text-[#6B6275]">
                Continuous hands-free Wispr Flow voice dictation parsed by deterministic intent grammar.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFD2A0]/60 text-[#8174A0] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1A24]">2. Zero-Trust Redaction</h3>
              <p className="text-xs text-[#6B6275]">
                Client-side scrubbing replacing JWTs, cards, and tax IDs before writing code.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#8174A0]/25 text-[#8174A0] flex items-center justify-center font-bold">
                <Terminal className="w-4 h-4 text-[#8174A0]" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1A24]">3. Real Verification</h3>
              <p className="text-xs text-[#6B6275]">
                Real Chromium browser processes executing the exact test to prove failure on buggy and pass on fixed.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-[#1F1A24] tracking-tight">
            Built for Developers Who Ship
          </h2>
          <p>
            Today, REPROX turns chaotic voice bug reports into verifiable engineering artifacts in under 60 seconds. What used to take a full sprint cycle now happens while you sip your morning espresso.
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="pt-8 border-t border-[#EBE7DF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-[#1F1A24] block">Ready to experience hands-free QA?</span>
            <span className="text-xs text-[#6B6275]">Test the commercial invoice bug reproduction right in your browser.</span>
          </div>
          <button
            onClick={onNavigateToApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Open Invoice Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
