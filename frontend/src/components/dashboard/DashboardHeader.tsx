import { Bug, Mic, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';

interface DashboardHeaderProps {
  onRunFullDemo: () => void;
  isExecuting?: boolean;
  onBackToLanding?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRunFullDemo,
  isExecuting = false,
  onBackToLanding,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/90 px-6 py-3.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Identity & Back Navigation */}
        <div className="flex items-center gap-3.5">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing</span>
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/25">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-950 font-mono flex items-center gap-1.5">
                REPROX
              </h1>
              <span className="text-[10px] bg-violet-100/80 text-violet-800 border border-violet-300/80 px-2 py-0.5 rounded-full font-mono font-bold tracking-wide">
                WISPR FLOW EDITION
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">
              Voice-to-Repro Incident Platform & Genuine Playwright Engine
            </p>
          </div>
        </div>

        {/* Incident Status Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-xl text-xs shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono font-bold text-slate-900">REPRO-104</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-semibold truncate max-w-sm">
            Missing GSTIN Validation on Commercial Invoice
          </span>
          <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            CRITICAL REGRESSION
          </span>
        </div>

        {/* Right Controls & Quick Demo Action */}
        <div className="flex items-center gap-3">
          {/* Wispr Flow Status Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200/90 px-3 py-1.5 rounded-xl text-xs text-violet-900 font-bold shadow-xs">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-ping absolute" />
              <Mic className="w-4 h-4 text-violet-600 relative z-10" />
            </div>
            <span className="tracking-wide">Wispr Flow Dictation: Live</span>
          </div>

          {/* Demo Execution Trigger */}
          <button
            type="button"
            onClick={onRunFullDemo}
            disabled={isExecuting}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-600/25 hover:shadow-violet-600/35 active:scale-[0.98] flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white/80" />
            {isExecuting ? 'Executing Real Playwright Pipeline...' : 'Run Live Repro Pipeline'}
          </button>
        </div>
      </div>
    </header>
  );
};
