import React, { useState } from 'react';
import type { BuildMode, RecordedEvent } from '../../types';
import { AlertCircle, CheckCircle2, ShieldCheck, ShieldAlert, Sparkles, Building2, DollarSign, FileText } from 'lucide-react';

interface InvoiceAppSandboxProps {
  buildMode: BuildMode;
  onToggleBuildMode: (mode: BuildMode) => void;
  onRecordEvent?: (event: Omit<RecordedEvent, 'id' | 'timestamp'>) => void;
  isRecording?: boolean;
}

export const InvoiceAppSandbox: React.FC<InvoiceAppSandboxProps> = ({
  buildMode,
  onToggleBuildMode,
  onRecordEvent,
  isRecording = false,
}) => {
  const [clientName, setClientName] = useState('Acme Global Ltd');
  const [amount, setAmount] = useState('4850.00');
  const [gstin, setGstin] = useState('');
  const currency = 'USD';
  const paymentTerms = 'Net 30';
  
  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const isBuggy = buildMode === 'buggy';

  const record = (eventData: Omit<RecordedEvent, 'id' | 'timestamp'>) => {
    if (isRecording && onRecordEvent) {
      onRecordEvent(eventData);
    }
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClientName(val);
    record({
      type: 'fill',
      selector: '#clientName',
      targetLabel: 'Client Business Name',
      targetTestId: 'input-client-name',
      targetRole: 'textbox',
      value: val,
      description: `Entered client name: "${val}"`,
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    record({
      type: 'fill',
      selector: '#invoiceAmount',
      targetLabel: 'Invoice Total (USD)',
      targetTestId: 'input-amount',
      targetRole: 'textbox',
      value: val,
      description: `Entered total amount: "$${val}"`,
    });
  };

  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGstin(val);
    record({
      type: 'fill',
      selector: '#gstinNumber',
      targetLabel: 'GST Identification Number (GSTIN)',
      targetTestId: 'input-gstin',
      targetRole: 'textbox',
      value: val,
      description: val ? `Provided GSTIN: "${val}"` : 'Left GSTIN input empty',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessToast(null);

    record({
      type: 'click',
      selector: '#dispatchInvoiceBtn',
      targetRole: 'button',
      targetLabel: 'Generate & Dispatch Invoice',
      targetTestId: 'btn-dispatch-invoice',
      description: 'Clicked "Generate & Dispatch Invoice"',
    });

    // CORE LOGIC: Demonstrates Buggy vs Fixed behavior
    if (!isBuggy) {
      // FIXED VERSION (v1.0.5): Strict GST validation
      if (!gstin || gstin.trim() === '') {
        const error = 'GSTIN is required for commercial invoices.';
        setErrorMessage(error);
        record({
          type: 'assert',
          selector: '[role="alert"]',
          targetRole: 'alert',
          value: error,
          description: `Validation blocked dispatch: ${error}`,
        });
        return;
      }
    }

    // Submission succeeded
    const generatedId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const toastMsg = `Invoice ${generatedId} Dispatched Successfully!`;
    setSuccessToast(toastMsg);

    record({
      type: 'toast',
      selector: '[data-testid="success-toast"]',
      targetTestId: 'success-toast',
      value: toastMsg,
      description: isBuggy
        ? `[SILENT BUG DETECTED] Success toast rendered with missing GSTIN: "${toastMsg}"`
        : `Legitimate success toast rendered: "${toastMsg}"`,
    });
  };

  const populateBugScenario = () => {
    setClientName('Acme Global Ltd');
    setAmount('4850.00');
    setGstin('');
    setErrorMessage(null);
    setSuccessToast(null);

    if (isRecording && onRecordEvent) {
      onRecordEvent({
        type: 'fill',
        selector: '#clientName',
        targetLabel: 'Client Business Name',
        value: 'Acme Global Ltd',
        description: 'Auto-populated client name: "Acme Global Ltd"',
      });
      onRecordEvent({
        type: 'fill',
        selector: '#invoiceAmount',
        targetLabel: 'Invoice Total (USD)',
        value: '4850.00',
        description: 'Auto-populated total amount: "$4850.00"',
      });
      onRecordEvent({
        type: 'fill',
        selector: '#gstinNumber',
        targetLabel: 'GST Identification Number (GSTIN)',
        value: '',
        description: 'Explicitly cleared GSTIN field',
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col h-full">
      {/* Sandbox Header / Build Toggle Bar */}
      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-800">
            TARGET APP SANDBOX: <strong className="text-indigo-600 font-extrabold">LedgerFlow Commercial Billing</strong>
          </span>
        </div>

        {/* Build Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              onToggleBuildMode('buggy');
              setErrorMessage(null);
              setSuccessToast(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all ${
              isBuggy
                ? 'bg-white text-rose-700 shadow-sm font-extrabold border border-rose-200'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            v1.0.4-buggy
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleBuildMode('fixed');
              setErrorMessage(null);
              setSuccessToast(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all ${
              !isBuggy
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            v1.0.5-fixed
          </button>
        </div>
      </div>

      {/* Mode Diagnostic Banner */}
      <div
        className={`px-4 py-2.5 text-xs flex items-center justify-between font-medium ${
          isBuggy
            ? 'bg-rose-50 border-b border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-b border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {isBuggy ? (
            <>
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong className="font-bold">BUG ACTIVE:</strong> Missing GSTIN validation guard. Commercial invoices submit without required GST.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="font-bold">PATCHED:</strong> Guard clause active. Empty GSTIN halts dispatch with accessible error alert.
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={populateBugScenario}
          className="text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1 transition shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Populate Bug Scenario
        </button>
      </div>

      {/* Main Billing Form Content */}
      <div className="p-5 overflow-y-auto flex-1 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Name */}
            <div>
              <label htmlFor="clientName" className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Client Business Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={handleClientNameChange}
                required
                data-testid="input-client-name"
                className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-mono font-medium focus:outline-none transition shadow-xs"
                placeholder="e.g. Acme Global Ltd"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label htmlFor="invoiceAmount" className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                Invoice Total (USD) <span className="text-rose-600">*</span>
              </label>
              <input
                id="invoiceAmount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                required
                data-testid="input-amount"
                className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-mono font-medium focus:outline-none transition shadow-xs"
                placeholder="4850.00"
              />
            </div>
          </div>

          {/* GSTIN Field with Law Requirement Banner */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="gstinNumber" className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                GST Identification Number (GSTIN) <span className="text-rose-600">*</span>
              </label>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-md font-bold tracking-wide">
                Statutory Requirement
              </span>
            </div>

            <input
              id="gstinNumber"
              type="text"
              value={gstin}
              onChange={handleGstinChange}
              data-testid="input-gstin"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold placeholder-slate-400 focus:outline-none transition shadow-xs ${
                errorMessage
                  ? 'border-rose-500 text-rose-900 focus:ring-4 focus:ring-rose-500/15'
                  : 'border-amber-300 text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
              }`}
              placeholder="e.g. 27AAPFU0939F1ZV (Leave blank to trigger bug)"
            />

            <p className="text-[11px] font-medium text-amber-800">
              For B2B commercial invoices over $500, a valid 15-character GSTIN is mandatory. Submissions without it must be blocked.
            </p>
          </div>

          {/* Secondary metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Currency:</span>
              <span className="ml-2 font-mono font-bold text-slate-800">{currency}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Payment Terms:</span>
              <span className="ml-2 font-mono font-bold text-slate-800">{paymentTerms}</span>
            </div>
          </div>

          {/* Error Alert Display */}
          {errorMessage && (
            <div
              role="alert"
              data-testid="validation-error"
              className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3 text-xs text-rose-900 animate-in fade-in shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold block">Validation Failure:</strong>
                <span className="font-semibold">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Toast / Notification */}
          {successToast && (
            <div
              data-testid="success-toast"
              className={`p-3.5 rounded-xl flex items-start gap-3 text-xs animate-in fade-in shadow-xs ${
                isBuggy
                  ? 'bg-amber-50 border border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border border-emerald-300 text-emerald-950'
              }`}
            >
              {isBuggy ? (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="font-extrabold block">
                  {isBuggy ? 'Silent Bug Success Toast (Unintended):' : 'System Notification:'}
                </strong>
                <span className="font-semibold">{successToast}</span>
                {isBuggy && (
                  <p className="text-[11px] font-bold text-amber-800 mt-1">
                    Notice: Invoice was created with NULL GSTIN. This is a critical business logic flaw!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              id="dispatchInvoiceBtn"
              type="submit"
              data-testid="btn-dispatch-invoice"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate & Dispatch Invoice
            </button>
          </div>
        </form>
      </div>

      {/* Sandbox Footer Info */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-medium flex items-center justify-between">
        <span>DOM Observer: {isRecording ? '🟢 Listening to inputs & clicks' : '⚪ Standby'}</span>
        <span className="font-mono text-slate-600 font-bold">Sandbox Port: :3000/sandbox</span>
      </div>
    </div>
  );
};
