import React from 'react';
import { ReproxLogo } from '../components/brand/ReproxLogo';
import { LandingFooter } from '../components/layout/LandingFooter';
import {
  Mic,
  Play,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Terminal,
  Globe,
  FileText,
  Layers,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToApp: () => void;
  onNavigateToAuth?: () => void;
  onNavigateToStory?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToCareers?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToDocs?: () => void;
  onNavigateToChangelog?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToApp,
  onNavigateToAuth,
  onNavigateToStory,
  onNavigateToBlog,
  onNavigateToCareers,
  onNavigateToContact,
  onNavigateToDocs,
  onNavigateToChangelog,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#171717] font-sans selection:bg-[#EFB6C8]/40 selection:text-slate-900">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#EBE7DF] px-6 lg:px-12 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer text-left focus:outline-none"
          >
            <ReproxLogo />
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a
              href="#product"
              className="hover:text-slate-950 transition-colors relative py-1 text-slate-950"
            >
              Product
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-950 rounded-full" />
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-950 transition-colors py-1"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-950 transition-colors py-1"
            >
              Pricing
            </a>
            <button
              type="button"
              onClick={onNavigateToDocs}
              className="hover:text-slate-950 transition-colors py-1 cursor-pointer font-semibold text-sm text-slate-700"
            >
              Docs
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateToAuth || onNavigateToApp}
              className="hidden sm:inline-block text-sm font-bold text-slate-700 hover:text-slate-950 cursor-pointer transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onNavigateToApp}
              className="px-4 py-2 bg-[#564B78] hover:bg-[#483E67] active:scale-[0.98] text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="product" className="relative pt-12 pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-5 space-y-7 pt-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              AI-Powered QA for Real Developers
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl font-sans font-bold tracking-tight text-slate-950 leading-[1.08]">
                Don't type the bug.
              </h1>
              <h2 className="text-5xl sm:text-6xl font-serif-title italic font-normal text-slate-950 leading-[1.1]">
                Just speak.
              </h2>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
              REPROX turns your spoken bug reports into real browser reproductions,
              Playwright tests, and verified results — so you can ship with
              confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onNavigateToApp}
                className="px-6 py-3.5 bg-[#564B78] hover:bg-[#483E67] text-white font-bold text-sm rounded-xl shadow-md shadow-[#564B78]/25 hover:shadow-lg hover:shadow-[#564B78]/35 flex items-center gap-2.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Mic className="w-4 h-4 text-[#EFB6C8]" />
                <span>Start with voice</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToApp}
                className="px-5 py-3.5 bg-transparent hover:bg-black/5 text-slate-900 border border-slate-300 font-bold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-slate-900 text-slate-900 ml-0.5" />
                </div>
                <span>Watch demo</span>
              </button>
            </div>

            {/* Micro Feature Badges Row */}
            <div className="pt-6 flex flex-wrap items-center gap-y-3 gap-x-5 text-xs font-semibold text-slate-500 border-t border-[#EBE7DF]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-700" />
                Real browser execution
              </span>
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-700" />
                Playwright tests
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                Clear reports
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-700" />
                Built for developers
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Composition */}
          <div className="lg:col-span-7 relative">
            {/* Top Annotation Script */}
            <div className="absolute -top-6 left-8 z-20 flex items-center gap-2 pointer-events-none">
              <span className="font-handwriting text-2xl text-[#E11D48] rotate-[-5deg] tracking-wide font-bold">
                From this in your head...
              </span>
              <svg className="w-8 h-8 text-[#E11D48] rotate-[-10deg]" viewBox="0 0 40 40" fill="none">
                <path d="M5 25 C15 35, 30 25, 32 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                <path d="M26 13 L32 10 L34 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Main Interactive Product Mockup Card */}
            <div className="relative bg-white border border-[#E7E3DA] rounded-2xl p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] max-w-xl mx-auto z-10">
              {/* Card Window Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-xs font-mono font-bold text-slate-800 ml-2">REPROX Studio</span>
                </div>
                <span className="text-[10px] font-mono bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-bold">
                  Wispr Flow v1.4
                </span>
              </div>

              {/* Mockup Internal Layout */}
              <div className="grid grid-cols-12 gap-3">
                {/* Mini Sidebar */}
                <div className="col-span-3 space-y-1 pr-2 border-r border-slate-100 text-[11px] font-semibold text-slate-500">
                  <div className="p-1.5 rounded-md hover:bg-slate-50">Home</div>
                  <div className="p-1.5 rounded-md bg-violet-50 text-violet-900 font-bold">New Incident</div>
                  <div className="p-1.5 rounded-md hover:bg-slate-50">Incidents</div>
                  <div className="p-1.5 rounded-md hover:bg-slate-50">Test Studio</div>
                  <div className="p-1.5 rounded-md hover:bg-slate-50">Integrations</div>
                  <div className="p-1.5 rounded-md hover:bg-slate-50">Settings</div>
                </div>

                {/* Main Voice Listening Area */}
                <div className="col-span-9 pl-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">New Incident</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: REPRO-104</span>
                  </div>

                  {/* Pulsing Voice Listening Sphere */}
                  <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-center space-y-2">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#EFB6C8]/30 animate-ping absolute" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8174A0] to-[#EFB6C8] flex items-center justify-center text-white relative z-10 shadow-sm">
                        <Mic className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-800">Listening...</div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-left">
                      <p className="text-[11px] text-slate-700 italic font-serif-title leading-snug">
                        "When I try to create an invoice without a GST number it still shows success..."
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Auto-detecting steps...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Workflow Steps Cards (Right of Mockup) */}
            <div className="hidden sm:flex flex-col gap-2.5 absolute top-4 right-0 lg:-right-6 z-20 w-56">
              <div className="bg-white/95 backdrop-blur-md border border-[#E7E3DA] p-2.5 rounded-xl shadow-lg text-[11px] font-bold text-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-right-4">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>We capture your actions</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-[#E7E3DA] p-2.5 rounded-xl shadow-lg text-[11px] font-bold text-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-right-6">
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <span>Generate Playwright test</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-[#E7E3DA] p-2.5 rounded-xl shadow-lg text-[11px] font-bold text-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-right-8">
                <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span>Run against buggy and fixed versions</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-[#E7E3DA] p-2.5 rounded-xl shadow-lg text-[11px] font-bold text-slate-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-right-10">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Give you a clear report</span>
              </div>
            </div>

            {/* Overlapping Code Showcase Card (Bottom Left of Hero Visual) */}
            <div className="mt-4 sm:-mt-10 sm:ml-4 bg-[#0D1117] text-slate-200 border border-slate-800 rounded-xl p-4 shadow-2xl max-w-sm sm:max-w-md relative z-30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-violet-400 font-bold">
                  <FileText className="w-3 h-3" />
                  tests/invoice-gst.spec.ts
                </span>
                <span>Playwright v1.49</span>
              </div>
              <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-300">
                <code>
                  <span className="text-purple-400">test</span>(<span className="text-emerald-300">'invoice should show GST validation'</span>, <span className="text-cyan-300">async</span> (&#123; page &#125;) =&gt; &#123;{'\n'}
                  {'  '}<span className="text-cyan-300">await</span> page.<span className="text-blue-300">goto</span>(<span className="text-emerald-300">'/commercial/invoice'</span>);{'\n'}
                  {'  '}<span className="text-cyan-300">await</span> page.<span className="text-blue-300">fill</span>(<span className="text-amber-300">'#customerName'</span>, <span className="text-emerald-300">'Acme Corp'</span>);{'\n'}
                  {'  '}<span className="text-cyan-300">await</span> page.<span className="text-blue-300">fill</span>(<span className="text-amber-300">'#amount'</span>, <span className="text-emerald-300">'5000'</span>);{'\n'}
                  {'  '}<span className="text-cyan-300">await</span> page.<span className="text-blue-300">click</span>(<span className="text-amber-300">'#dispatchBtn'</span>);{'\n'}
                  {'  '}<span className="text-cyan-300">await</span> <span className="text-purple-400">expect</span>(page.<span className="text-blue-300">locator</span>(<span className="text-amber-300">'[role="alert"]'</span>)).<span className="text-blue-300">toBeVisible</span>();{'\n'}
                  &#125;);
                </code>
              </pre>
            </div>

            {/* Overlapping Buggy vs Fixed Result Thumbnails (Bottom Right of Hero Visual) */}
            <div className="mt-3 sm:-mt-16 sm:ml-auto mr-2 max-w-xs space-y-2 relative z-40">
              {/* Buggy Card */}
              <div className="bg-white border border-rose-200 rounded-xl p-2.5 shadow-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-rose-700">
                  <span className="flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Buggy Version (v1.0.4)
                  </span>
                  <span className="bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200">
                    Failed
                  </span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-mono">
                  [!] Unintended Toast: "Invoice Created!"
                </div>
              </div>

              {/* Fixed Card */}
              <div className="bg-white border border-emerald-200 rounded-xl p-2.5 shadow-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                  <span className="flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Fixed Version (v1.0.5)
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                    Passed ✓
                  </span>
                </div>
                <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-800 font-bold">
                  Alert: "GST number is required"
                </div>
              </div>
            </div>

            {/* Bottom Annotation Script */}
            <div className="absolute -bottom-8 right-12 z-20 flex items-center gap-2 pointer-events-none">
              <svg className="w-8 h-8 text-[#E11D48] rotate-[10deg]" viewBox="0 0 40 40" fill="none">
                <path d="M5 10 C15 5, 25 20, 32 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                <path d="M25 32 L32 30 L34 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-handwriting text-2xl text-[#E11D48] rotate-[5deg] tracking-wide font-bold">
                ...to this in your repo.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. CORE FEATURES SECTION */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#EBE7DF]">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
                CORE FEATURES
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif-title font-normal text-slate-950 tracking-tight leading-tight">
                Built for real development workflows.
              </h2>
            </div>
            <p className="text-slate-600 font-medium text-sm sm:text-base max-w-md leading-relaxed">
              Voice-first bug reporting, real browser interactions, Playwright test
              generation, and verified results — all in one seamless flow.
            </p>
          </div>

          {/* 4-Column Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-[#E7E3DA] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD2A0]/40 text-[#C2410C] flex items-center justify-center font-bold">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Voice-First Capture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Just speak the issue. REPROX transcribes and understands it in
                natural developer speech.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-[#E7E3DA] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFB6C8]/40 text-[#BE185D] flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Interaction Recording
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Captures real user interactions and DOM states directly in your web application.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-[#E7E3DA] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#8174A0]/25 text-[#564B78] flex items-center justify-center font-bold">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Playwright Test Generation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Creates clean, editable, production-grade Playwright tests from your actual reproduction steps.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-[#E7E3DA] p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A888B5]/30 text-[#6B21A8] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Verify & Compare
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Run against buggy and fixed versions with clear browser evidence and actionable patch diffs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. HOW IT WORKS SECTION */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#EBE7DF]">
        <div className="max-w-[1400px] mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif-title font-normal text-slate-950 tracking-tight">
              From voice to verified tests in minutes.
            </h2>
          </div>

          {/* 4-Step Process Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {/* Step 01 */}
            <div className="relative bg-white border border-[#E7E3DA] p-6 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#FFD2A0]/40 text-[#C2410C] flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-slate-300">01</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Describe
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Speak or type the issue. REPROX understands intent and context automatically.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative bg-white border border-[#E7E3DA] p-6 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#EFB6C8]/40 text-[#BE185D] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-slate-300">02</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Reproduce
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Capture real browser interactions and DOM states with user consent and privacy masking.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative bg-white border border-[#E7E3DA] p-6 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#8174A0]/25 text-[#564B78] flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-slate-300">03</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Generate
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Create a resilient, type-safe Playwright test suite automatically with exact locators.
              </p>
            </div>

            {/* Step 04 */}
            <div className="relative bg-white border border-[#E7E3DA] p-6 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#A888B5]/30 text-[#6B21A8] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="font-mono text-2xl font-black text-slate-300">04</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Verify
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Run, compare against fixed code, and get a complete evidence package for your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. DEEP FOREST GREEN FEATURE BANNER (4x faster) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto rounded-3xl bg-[#0C3428] text-white p-8 sm:p-12 lg:p-16 overflow-hidden relative shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174636] border border-[#235D49] text-xs font-bold text-[#6EE7B7]">
                REAL RESULTS
              </div>

              <h2 className="text-5xl sm:text-6xl font-serif-title font-normal tracking-tight text-white leading-[1.08]">
                4 x faster
                <span className="block italic text-[#6EE7B7]/90 font-serif-title">
                  than trying to explain it.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-emerald-100/80 font-medium leading-relaxed max-w-lg">
                Turn vague bug reports into reproducible tests and clear evidence.
                Spend less time in meetings and more time shipping.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToApp}
                  className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-[#0C3428] font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <span>See how it works</span>
                  <ArrowRight className="w-4 h-4 text-[#0C3428]" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Res 3D Mossy Rock & Laptop Composition */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Mint Handwritten Annotation Over Rock */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="font-handwriting text-2xl text-[#6EE7B7] rotate-[-8deg] tracking-wide font-bold drop-shadow-md block">
                  Less back and forth.
                </span>
                <span className="font-handwriting text-2xl text-[#6EE7B7] rotate-[-5deg] tracking-wide font-bold drop-shadow-md block ml-4">
                  More shipped code.
                </span>
              </div>

              {/* High-Resolution Rock & Laptop Image */}
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-emerald-900/40">
                <img
                  src="/assets/rock_laptop_showcase.jpg"
                  alt="REPROX 3D Laptop on Rock Platform"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Realistic Pinned Sticky Note on the Rock */}
              <div className="absolute -bottom-4 right-6 z-30 bg-[#FFF5C0] text-slate-800 p-4 rounded shadow-2xl rotate-[6deg] border border-[#F3E79B] w-36 font-handwriting select-none transform hover:rotate-0 transition-transform">
                <div className="w-3 h-3 rounded-full bg-red-400/80 mx-auto -mt-2 mb-2 shadow-xs" />
                <div className="text-lg leading-tight font-bold space-y-0.5">
                  <div className="text-slate-900">Speak</div>
                  <div className="text-slate-900">Capture</div>
                  <div className="text-slate-900">Test</div>
                  <div className="text-slate-900">Verify</div>
                  <div className="text-emerald-700 font-black">Ship ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. VOICE-FIRST INCIDENTS & EVIDENCE SECTIONS */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#EBE7DF]">
        <div className="max-w-[1400px] mx-auto space-y-24">
          {/* Sub-Section A: Speak naturally. REPROX handles the rest. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy & Bullet List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
                VOICE-FIRST INCIDENTS
              </div>

              <h2 className="text-4xl sm:text-5xl font-serif-title font-normal text-slate-950 tracking-tight leading-tight">
                Speak naturally.
                <span className="block font-serif-title italic">REPROX handles the rest.</span>
              </h2>

              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                Describe the issue in your own words. REPROX transcribes your
                voice, extracts key details, and helps you reproduce it in a real
                browser.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Accurate transcription with Wispr Flow integration</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Automatic field & intent extraction (Zero paid AI APIs)</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Privacy-first with automated PII & credential redaction</span>
                </div>
              </div>
            </div>

            {/* Right: Describe the issue Mockup Card */}
            <div className="lg:col-span-7 relative">
              {/* Coral Annotation */}
              <div className="absolute -top-7 right-8 z-20 flex items-center gap-2 pointer-events-none">
                <span className="font-handwriting text-2xl text-[#E11D48] rotate-[6deg] tracking-wide font-bold">
                  Just talk. We'll structure it.
                </span>
                <svg className="w-8 h-8 text-[#E11D48] rotate-[15deg]" viewBox="0 0 40 40" fill="none">
                  <path d="M5 10 C15 5, 25 20, 32 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                  <path d="M25 32 L32 30 L34 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="bg-white border border-[#E7E3DA] rounded-2xl p-6 shadow-xl max-w-xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Describe the issue</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-slate-600">
                    <span className="px-2 py-0.5 bg-white text-slate-900 rounded shadow-xs">Voice</span>
                    <span className="px-2 py-0.5">Text</span>
                    <span className="px-2 py-0.5">Template</span>
                  </div>
                </div>

                {/* Voice Visualizer Area */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#EFB6C8]/40 text-[#BE185D] mx-auto flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Listening...</div>
                  <div className="flex items-center justify-center gap-1 h-4">
                    <span className="w-1 h-3 bg-violet-500 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-fuchsia-500 rounded-full animate-pulse" />
                    <span className="w-1 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-purple-500 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Auto-filled details panel */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Auto-filled details:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-medium">Feature:</span>
                      <span className="font-bold text-slate-800">Invoice</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Action Taken:</span>
                      <span className="font-bold text-slate-800">Submit invoice without GST number</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Expected Behavior:</span>
                      <span className="font-bold text-emerald-700">Should show validation error</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Actual Behavior:</span>
                      <span className="font-bold text-rose-700">Shows success and creates invoice</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Section B: See the bug. See the fix. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Copy & Bullet List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
                REAL EXECUTION & EVIDENCE
              </div>

              <h2 className="text-4xl sm:text-5xl font-serif-title font-normal text-slate-950 tracking-tight leading-tight">
                See the bug.
                <span className="block font-serif-title italic">See the fix.</span>
              </h2>

              <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base">
                Run the generated test against both buggy and fixed versions. Get
                real screenshots, logs, and traces — no guessing.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Actual Playwright execution with real Chromium processes</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Clear pass / fail exit codes (Exit 1 vs Exit 0)</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Screenshots, console logs, and verified traces</span>
                </div>
              </div>
            </div>

            {/* Right: Dual Verifier Buggy vs Fixed Evidence Cards */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Buggy Card */}
                <div className="bg-white border border-rose-200/90 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-mono font-bold text-slate-900">
                        Buggy Version (v1.0.4)
                      </span>
                    </div>
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                      Failed (12.4s)
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="text-[10px] font-mono text-slate-500">1 of 7 assertions failed</div>
                    <div className="bg-white p-2 border border-slate-200 rounded text-[11px] font-mono space-y-1">
                      <div className="text-slate-400">#clientName: Acme Corp</div>
                      <div className="text-slate-400">#gstin: [EMPTY]</div>
                      <div className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Rendered: "Invoice Dispatched Successfully!"
                      </div>
                    </div>
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] font-bold text-rose-800">
                      Expected: GST number is required
                      <br />
                      Received: Invoice Dispatched Successfully
                    </div>
                  </div>
                </div>

                {/* Fixed Card */}
                <div className="bg-white border border-emerald-200/90 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono font-bold text-slate-900">
                        Fixed Version (v1.0.5)
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      Passed (14.1s)
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="text-[10px] font-mono text-slate-500">7 of 7 assertions passed</div>
                    <div className="bg-white p-2 border border-slate-200 rounded text-[11px] font-mono space-y-1">
                      <div className="text-slate-400">#clientName: Acme Corp</div>
                      <div className="text-slate-400">#gstin: [EMPTY]</div>
                      <div className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-bold">
                        Alert: "GST number is required"
                      </div>
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                      <span>Verified Fix ✓</span>
                      <button
                        type="button"
                        onClick={onNavigateToApp}
                        className="text-[10px] font-mono text-emerald-700 underline"
                      >
                        View trace -&gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 7. TRUSTED BY DEVELOPERS & TESTIMONIAL */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#EBE7DF]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Logos */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
              TRUSTED BY DEVELOPERS
            </div>

            <h2 className="text-4xl sm:text-5xl font-serif-title font-normal text-slate-950 tracking-tight leading-tight">
              Used by teams who care about quality.
            </h2>

            <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base max-w-md">
              REPROX fits naturally into modern development workflows, from solo
              developers to fast-moving engineering teams.
            </p>

            {/* Developer Tool Logos */}
            <div className="flex flex-wrap items-center gap-8 pt-4 grayscale opacity-80 hover:opacity-100 transition-opacity">
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                GitHub
              </span>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
                ▲ Vercel
              </span>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                Linear
              </span>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                Notion
              </span>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight">
                Figma
              </span>
            </div>
          </div>

          {/* Right Column: Testimonial Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#E7E3DA] rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 relative">
              {/* Peach Large Quotation Mark */}
              <div className="text-6xl font-serif-title leading-none text-[#FFD2A0] select-none -mb-6">
                “
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed font-sans">
                "REPROX saved us hours of back and forth. I just speak the bug,
                get a real test and share the report. It feels like pair
                programming with a QA engineer."
              </blockquote>

              <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#8174A0] to-[#EFB6C8] flex items-center justify-center font-bold text-white text-sm">
                  AM
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Aarav Mehta</div>
                  <div className="text-xs text-slate-500 font-medium">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 8. CTA BANNER WITH SCENIC MOUNTAIN HIKER ARTWORK */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto relative rounded-3xl overflow-hidden shadow-2xl min-h-[480px] flex items-center">
          {/* Panoramic High-Res Mountain Background */}
          <img
            src="/assets/mountain_hiker_banner.jpg"
            alt="Scenic mountain landscape with solitary hiker"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Soft Tint Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full md:w-3/5" />

          {/* Right Handwritten Annotation Script */}
          <div className="hidden lg:flex absolute top-12 right-20 z-20 pointer-events-none flex-col items-end">
            <span className="font-handwriting text-3xl text-slate-900 rotate-[4deg] tracking-wide font-bold drop-shadow-sm">
              Real bugs.
            </span>
            <span className="font-handwriting text-3xl text-slate-900 rotate-[-2deg] tracking-wide font-bold drop-shadow-sm">
              Real tests.
            </span>
            <span className="font-handwriting text-3xl text-[#564B78] rotate-[2deg] tracking-wide font-bold drop-shadow-sm">
              Faster releases.
            </span>
          </div>

          {/* Left Content Box */}
          <div className="relative z-10 p-8 sm:p-14 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-xs font-bold text-[#C2410C]">
              READY TO BUILD BETTER SOFTWARE?
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif-title font-normal tracking-tight text-slate-950 leading-[1.08]">
              Stop guessing.
              <span className="block italic font-serif-title text-[#564B78]">
                Start testing.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              Join developers who turn bugs into tests and ship with confidence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onNavigateToApp}
                className="px-6 py-3.5 bg-[#564B78] hover:bg-[#483E67] text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToApp}
                className="px-5 py-3.5 bg-white/90 hover:bg-white text-slate-900 border border-slate-300 font-bold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <div className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-slate-900 text-slate-900 ml-0.5" />
                </div>
                <span>Watch demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 9. FOOTER (Matching Exact Reference Layout & Typography) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <LandingFooter
        onNavigateToApp={onNavigateToApp}
        onNavigateToAuth={onNavigateToAuth}
        onNavigateToStory={onNavigateToStory}
        onNavigateToBlog={onNavigateToBlog}
        onNavigateToCareers={onNavigateToCareers}
        onNavigateToContact={onNavigateToContact}
        onNavigateToDocs={onNavigateToDocs}
        onNavigateToChangelog={onNavigateToChangelog}
      />
    </div>
  );
};
