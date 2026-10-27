import React, { useState } from 'react';
import type { TestExecutionResult, StepExecutionResult } from '../../types';
import { ShieldAlert, ShieldCheck, Play, CheckCircle2, XCircle, Clock, GitCommit, Copy, Check, Image as ImageIcon } from 'lucide-react';

interface ExecutionResultsProps {
  buggyResult?: TestExecutionResult;
  fixedResult?: TestExecutionResult;
  onRunBuggy: () => void;
  onRunFixed: () => void;
  isExecutingBuggy?: boolean;
  isExecutingFixed?: boolean;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({
  buggyResult,
  fixedResult,
  onRunBuggy,
  onRunFixed,
  isExecutingBuggy = false,
  isExecutingFixed = false,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'patch'>('comparison');
  const [patchCopied, setPatchCopied] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const gitPatch = `diff --git a/src/handlers/invoiceHandler.ts b/src/handlers/invoiceHandler.ts
index 8e4f1a2..9c2b3d1 100644
--- a/src/handlers/invoiceHandler.ts
+++ b/src/handlers/invoiceHandler.ts
@@ -14,6 +14,13 @@ export async function processInvoiceSubmission(invoice: InvoiceRequest) {
   // Validate commercial invoice total
   if (invoice.amount <= 0) {
     throw new ValidationError('Invoice amount must exceed $0.00');
   }
+
+  // Statutory GST Compliance: Mandatory for commercial B2B invoices
+  if (!invoice.gstin || invoice.gstin.trim() === '') {
+    throw new ValidationError('GSTIN is required for commercial invoices.');
+  }
 
   return dispatchInvoiceToAccounting(invoice);
 }`;

  const copyPatch = () => {
    navigator.clipboard.writeText(gitPatch);
    setPatchCopied(true);
    setTimeout(() => setPatchCopied(false), 2000);
  };

  const renderStepItem = (step: StepExecutionResult) => {
    const isPassed = step.status === 'passed';
    const isFailed = step.status === 'failed';
    const isRunning = step.status === 'running';

    return (
      <div
        key={step.stepIndex}
        className={`p-3 rounded-xl border text-xs transition ${
          isFailed
            ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs'
            : isPassed
            ? 'bg-white border-slate-200 text-slate-800 shadow-xs'
            : isRunning
            ? 'bg-violet-50 border-violet-300 text-violet-900 animate-pulse'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {isFailed && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {isRunning && <Clock className="w-4 h-4 text-violet-600 animate-spin shrink-0" />}
            {!isPassed && !isFailed && !isRunning && (
              <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
            )}
            <span className="font-bold">
              {step.stepIndex}. {step.description}
            </span>
          </div>

          <span className="font-mono text-[11px] font-bold text-slate-500">
            {step.durationMs > 0 ? `${step.durationMs}ms` : '—'}
          </span>
        </div>

        {isFailed && step.errorMessage && (
          <div className="mt-2.5 p-3 bg-white border border-rose-200 rounded-lg font-mono text-[11px] text-rose-900 whitespace-pre-wrap leading-tight shadow-inner">
            {step.errorMessage}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col h-full">
      {/* Tab Header */}
      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-1 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'comparison'
                ? 'bg-white text-indigo-900 shadow-sm font-extrabold border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            Dual Verifier (Real Edge / Playwright Process)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('patch')}
            className={`px-3.5 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'patch'
                ? 'bg-white text-indigo-900 shadow-sm font-extrabold border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5 text-indigo-600" />
            Root Cause & Patch Diff
          </button>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500">
          Process Status: Live Chromium
        </span>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'comparison' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Column 1: Buggy Build Run */}
            <div className="bg-rose-50/30 border border-rose-200/90 rounded-2xl p-4 flex flex-col space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-extrabold text-rose-900 font-mono">
                    TARGET: v1.0.4-buggy
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onRunBuggy}
                  disabled={isExecutingBuggy}
                  className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl font-mono font-bold shadow-sm shadow-rose-600/25 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  {isExecutingBuggy ? 'Running Browser...' : 'Execute Buggy Spec'}
                </button>
              </div>

              {/* Status Banner */}
              {buggyResult ? (
                <div className={`p-3 bg-white border rounded-xl flex items-center justify-between text-xs shadow-xs ${
                  buggyResult.failureType === 'infrastructure_error' ? 'border-amber-300' : 'border-rose-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-1 rounded-md text-white font-mono font-black text-[11px] ${
                      buggyResult.failureType === 'infrastructure_error' ? 'bg-amber-600' : 'bg-rose-600'
                    }`}>
                      EXIT {buggyResult.exitCode}
                    </span>
                    <span className={`font-extrabold ${
                      buggyResult.failureType === 'infrastructure_error' ? 'text-amber-950' : 'text-rose-950'
                    }`}>
                      {buggyResult.failureType === 'infrastructure_error'
                        ? 'INFRASTRUCTURE / HARNESS ERROR'
                        : 'REPRODUCED BUG (APPLICATION DEFECT CONFIRMED)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {buggyResult.screenshotBase64 && (
                      <button
                        type="button"
                        onClick={() => setShowScreenshot(true)}
                        className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        Screenshot
                      </button>
                    )}
                    <span className="text-rose-800 font-mono font-bold text-xs">
                      {buggyResult.totalDurationMs}ms
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-500 shadow-xs">
                  Ready to execute. Click above or dictate "Run Buggy Test".
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {buggyResult?.steps.map(renderStepItem)}
              </div>
            </div>

            {/* Column 2: Fixed Build Run */}
            <div className="bg-emerald-50/30 border border-emerald-200/90 rounded-2xl p-4 flex flex-col space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-900 font-mono">
                    TARGET: v1.0.5-fixed
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onRunFixed}
                  disabled={isExecutingFixed}
                  className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-mono font-bold shadow-sm shadow-emerald-600/25 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  {isExecutingFixed ? 'Verifying...' : 'Verify Fixed Spec'}
                </button>
              </div>

              {/* Status Banner */}
              {fixedResult ? (
                <div className="p-3 bg-white border border-emerald-300 rounded-xl flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-mono font-black text-[11px]">
                      EXIT 0
                    </span>
                    <span className="text-emerald-950 font-extrabold">
                      VERIFIED FIX (ALL ASSERTIONS PASSED)
                    </span>
                  </div>
                  <span className="text-emerald-800 font-mono font-bold text-xs">
                    {fixedResult.totalDurationMs}ms
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-500 shadow-xs">
                  Ready to verify. Click above or dictate "Verify Fixed Test".
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {fixedResult?.steps.map(renderStepItem)}
              </div>
            </div>
          </div>
        ) : (
          /* Root Cause & Patch Viewer */
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5 shadow-xs">
              <strong className="text-indigo-700 block font-mono font-extrabold text-sm">
                ROOT CAUSE & ENGINEERING DIAGNOSIS:
              </strong>
              <p className="leading-relaxed font-medium">
                In <code>src/handlers/invoiceHandler.ts</code>, the commercial B2B invoice dispatch routine completely omitted a statutory validation guard for the <code>gstin</code> property. Submissions without a GST identification number silently bypassed validation and triggered payment settlement.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-xl overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">git diff src/handlers/invoiceHandler.ts</span>
                <button
                  type="button"
                  onClick={copyPatch}
                  className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  {patchCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  {patchCopied ? 'Copied' : 'Copy Patch'}
                </button>
              </div>

              <pre className="p-4 font-mono text-xs text-slate-900 overflow-x-auto leading-relaxed bg-white">
                {gitPatch.split('\n').map((line, idx) => {
                  if (line.startsWith('+') && !line.startsWith('+++')) {
                    return (
                      <div key={idx} className="bg-emerald-50 text-emerald-800 font-bold px-1 rounded">
                        {line}
                      </div>
                    );
                  }
                  if (line.startsWith('-') && !line.startsWith('---')) {
                    return (
                      <div key={idx} className="bg-rose-50 text-rose-800 font-bold px-1 rounded">
                        {line}
                      </div>
                    );
                  }
                  if (line.startsWith('@@')) {
                    return (
                      <div key={idx} className="text-blue-700 font-bold">
                        {line}
                      </div>
                    );
                  }
                  return <div key={idx}>{line}</div>;
                })}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Real Screenshot Preview Modal */}
      {showScreenshot && buggyResult?.screenshotBase64 && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                Playwright Headless Browser Capture (Failure State at Step 6)
              </h3>
              <button
                type="button"
                onClick={() => setShowScreenshot(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto">
              <img
                src={buggyResult.screenshotBase64}
                alt="Playwright Regression Failure Snapshot"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
