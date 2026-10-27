import React from 'react';
import { 
  Play, 
  Mic, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal,
  Activity,
} from 'lucide-react';

interface HomePageProps {
  onNavigateToIncidents: () => void;
  onNavigateToNewIncident: () => void;
  onNavigateToTestStudio: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToIncidents,
  onNavigateToNewIncident,
  onNavigateToTestStudio,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* HERO BANNER MATCHING SCREEN 1 REFERENCE */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#EBE7DF] bg-[#FFFDF9] shadow-xs grid grid-cols-1 lg:grid-cols-12 min-h-[340px]">
        
        {/* Left Copy Column (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between z-10">
          <div>
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEEAE1] border border-[#FAD8C7] text-[11px] font-bold text-[#C2410C] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
              <span>AI-Powered QA for Real Developers</span>
            </div>

            {/* Headline with Instrument Serif accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1F1A24] tracking-tight leading-[1.12] mb-3">
              From a{' '}
              <span className="font-serif-title italic font-normal text-[#8174A0]">
                bug
              </span>{' '}
              in your head
              <br />
              to a test in your repo.
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#6B6275] leading-relaxed max-w-lg mb-6">
              Describe the issue. Reproduce it. Get a Playwright test, a clear report, and a fix — all with your voice.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToNewIncident}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-[#EFB6C8]" />
              <span>Start a new incident</span>
            </button>

            <button
              onClick={onNavigateToIncidents}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#D8D2C5] text-[#1F1A24] text-xs font-medium shadow-2xs transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#8174A0] fill-[#8174A0]" />
              <span>Watch demo</span>
            </button>
          </div>
        </div>

        {/* Right Artwork & Floating Workflow Cards Column (5 cols) */}
        <div className="lg:col-span-5 relative overflow-hidden bg-[#FAF7F2] min-h-[280px] lg:min-h-full flex items-center justify-center p-6">
          {/* Pastel Mountain Lake Background */}
          <img
            src="/assets/soft_pastel_footer_lake.jpg"
            alt="REPROX Mountain Workflow"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-transparent to-transparent pointer-events-none w-1/3" />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none" />

          {/* 4 Floating Step Cards matching reference */}
          <div className="relative z-10 w-full max-w-xs space-y-2.5">
            {/* Step 1 */}
            <div className="p-2.5 px-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 shadow-xs flex items-center gap-2.5 transform transition-transform hover:translate-x-1">
              <div className="w-7 h-7 rounded-lg bg-[#EFB6C8]/40 text-[#8174A0] flex items-center justify-center shrink-0">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#1F1A24] block leading-tight">You speak the bug</span>
                <span className="text-[10px] text-[#6B6275]">Wispr Flow dictation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 px-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 shadow-xs flex items-center gap-2.5 transform transition-transform hover:translate-x-1">
              <div className="w-7 h-7 rounded-lg bg-[#A888B5]/40 text-[#8174A0] flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#1F1A24] block leading-tight">We capture your actions</span>
                <span className="text-[10px] text-[#6B6275]">Zero-trust scrubber</span>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              onClick={onNavigateToTestStudio}
              className="p-2.5 px-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 shadow-xs flex items-center gap-2.5 transform transition-transform hover:translate-x-1 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FFD2A0]/60 text-[#8174A0] flex items-center justify-center shrink-0">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#1F1A24] block leading-tight">Generate Playwright test</span>
                <span className="text-[10px] text-[#6B6275]">Role-based selectors</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-2.5 px-3 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 shadow-xs flex items-center gap-2.5 transform transition-transform hover:translate-x-1">
              <div className="w-7 h-7 rounded-lg bg-[#8174A0]/25 text-[#8174A0] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#1F1A24] block leading-tight">Verify on buggy and fixed</span>
                <span className="text-[10px] text-[#6B6275]">Real Edge browser run</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4 METRIC CARDS MATCHING REFERENCE SCREEN 1 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs">
          <div className="flex items-center justify-between text-[#6B6275] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6275]">TOTAL INCIDENTS</span>
            <span className="w-2 h-2 rounded-full bg-[#8174A0]" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1F1A24]">24</span>
            <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
              +6 this week
            </span>
          </div>
          <p className="text-[11px] text-[#9E95A8]">100% captured via Wispr Flow</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs">
          <div className="flex items-center justify-between text-[#6B6275] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6275]">VERIFIED REGRESSIONS</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1F1A24]">19</span>
            <span className="text-[11px] font-semibold text-[#8174A0] bg-[#FAF7F2] px-2 py-0.5 rounded-md">
              79.1% verified
            </span>
          </div>
          <p className="text-[11px] text-[#9E95A8]">Executed via Microsoft Edge</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs">
          <div className="flex items-center justify-between text-[#6B6275] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6275]">FLAKY TEST REDUCTION</span>
            <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
              4.2x Faster
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1F1A24]">92%</span>
            <span className="text-xs text-[#6B6275]">accuracy</span>
          </div>
          <p className="text-[11px] text-[#9E95A8]">Deterministic selectors</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs">
          <div className="flex items-center justify-between text-[#6B6275] mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6275]">P I I SCRUBBED</span>
            <ShieldCheck className="w-4 h-4 text-[#8174A0]" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-[#1F1A24]">1,420</span>
            <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
              Zero Leak
            </span>
          </div>
          <p className="text-[11px] text-[#9E95A8]">Tokens, JWT &amp; GST scrubbed</p>
        </div>
      </div>
    </div>
  );
};
