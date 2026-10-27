import React, { useState } from 'react';
import type { BuildMode, RecordedEvent } from '../../types';
import { 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Building2, 
  DollarSign, 
  FileText, 
  ShoppingCart, 
  Star, 
  Package, 
  Check, 
  Search,
} from 'lucide-react';

interface InvoiceAppSandboxProps {
  buildMode: BuildMode;
  onToggleBuildMode: (mode: BuildMode) => void;
  onRecordEvent?: (event: Omit<RecordedEvent, 'id' | 'timestamp'>) => void;
  isRecording?: boolean;
  scenarioFeature?: string;
  scenarioTitle?: string;
}

export const InvoiceAppSandbox: React.FC<InvoiceAppSandboxProps> = ({
  buildMode,
  onToggleBuildMode,
  onRecordEvent,
  isRecording = false,
  scenarioFeature = '',
}) => {
  const isBuggy = buildMode === 'buggy';
  const isEcommerce =
    scenarioFeature.toLowerCase().includes('cart') ||
    scenarioFeature.toLowerCase().includes('amazon') ||
    scenarioFeature.toLowerCase().includes('shop') ||
    scenarioFeature.toLowerCase().includes('card') ||
    scenarioFeature.toLowerCase().includes('product');

  // -------------------------------------------------------------
  // E-COMMERCE / AMAZON STATE
  // -------------------------------------------------------------
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartFeedback, setCartFeedback] = useState<{
    type: 'bug' | 'success';
    message: string;
  } | null>(null);

  // -------------------------------------------------------------
  // INVOICE STATE
  // -------------------------------------------------------------
  const [clientName, setClientName] = useState('Acme Global Ltd');
  const [amount, setAmount] = useState('4850.00');
  const [gstin, setGstin] = useState('');
  const currency = 'USD';
  const paymentTerms = 'Net 30';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const record = (eventData: Omit<RecordedEvent, 'id' | 'timestamp'>) => {
    if (isRecording && onRecordEvent) {
      onRecordEvent(eventData);
    }
  };

  // -------------------------------------------------------------
  // E-COMMERCE ACTIONS
  // -------------------------------------------------------------
  const handleAddToCart = () => {
    record({
      type: 'click',
      selector: '#add-to-cart-button',
      targetRole: 'button',
      targetLabel: 'Add to Cart',
      targetTestId: 'add-to-cart-button',
      description: 'Clicked "Add to Cart" button for Amazon Echo Dot',
    });

    if (isBuggy) {
      // BUGGY: State mutation dropped, cart count stays 0
      setCartCount(0);
      setCartFeedback({
        type: 'bug',
        message: '[SILENT BUG REPRODUCED] Clicked "Add to Cart", but session failed to update cart state. #nav-cart-count remains 0!',
      });
      record({
        type: 'assert',
        selector: '#nav-cart-count',
        targetRole: 'status',
        targetTestId: 'nav-cart-count',
        value: '0',
        description: 'Failed assert: Cart counter remained "0" instead of expected "1"',
      });
    } else {
      // FIXED: State increments atomically to 1
      setCartCount(1);
      setCartFeedback({
        type: 'success',
        message: '✓ Added to Cart: Amazon Echo Dot (5th Gen) - Subtotal (1 item): $49.99',
      });
      record({
        type: 'assert',
        selector: '#nav-cart-count',
        targetRole: 'status',
        targetTestId: 'nav-cart-count',
        value: '1',
        description: 'Verified assert: Cart counter successfully updated to "1"',
      });
    }
  };

  const populateEcommerceBug = () => {
    setCartCount(0);
    setCartFeedback(null);
    if (isRecording && onRecordEvent) {
      onRecordEvent({
        type: 'navigate',
        selector: 'https://www.amazon.com/dp/B09V3HB57G',
        targetLabel: 'Amazon Product Catalog',
        value: 'https://www.amazon.com/dp/B09V3HB57G',
        description: 'Navigated to Amazon Echo Dot catalog page',
      });
    }
  };

  // -------------------------------------------------------------
  // INVOICE ACTIONS
  // -------------------------------------------------------------
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

  const handleInvoiceSubmit = (e: React.FormEvent) => {
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

    if (!isBuggy) {
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

  const populateInvoiceBug = () => {
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
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col h-full font-sans">
      {/* Sandbox Header / Build Toggle Bar */}
      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-800">
            TARGET APP SANDBOX:{' '}
            <strong className="text-[#8174A0] font-extrabold">
              {isEcommerce ? 'Amazon.com Product & Cart Pipeline' : 'LedgerFlow Commercial Billing'}
            </strong>
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
              setCartFeedback(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
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
              setCartFeedback(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
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
                <strong className="font-bold">BUG ACTIVE:</strong>{' '}
                {isEcommerce
                  ? 'Add-to-cart mutation dropped. Shopping cart badge (#nav-cart-count) remains 0.'
                  : 'Missing GSTIN validation guard. Commercial invoices submit without required GST.'}
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="font-bold">PATCHED:</strong>{' '}
                {isEcommerce
                  ? 'Session cart state persists. Shopping cart badge (#nav-cart-count) updates to 1.'
                  : 'Guard clause active. Empty GSTIN halts dispatch with accessible error alert.'}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={isEcommerce ? populateEcommerceBug : populateInvoiceBug}
          className="text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1 transition shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Populate Bug Scenario
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SCENARIO A: AMAZON / E-COMMERCE CART REPRODUCTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isEcommerce ? (
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Mock Amazon Header */}
          <div className="bg-[#131921] text-white p-3 rounded-xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white flex items-center">
                amazon<span className="text-[#FF9900]">.com</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-gray-400 border border-gray-700 px-1.5 py-0.5 rounded">
                Deliver to Seattle 98101
              </span>
            </div>

            <div className="hidden md:flex flex-1 max-w-xs items-center bg-white rounded-md overflow-hidden text-xs text-gray-800 px-2 py-1">
              <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              <span className="text-gray-500">Echo Dot 5th Gen...</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                id="nav-cart"
                data-testid="nav-cart"
                className="flex items-center gap-1.5 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span
                    id="nav-cart-count"
                    data-testid="nav-cart-count"
                    className="absolute -top-1.5 -right-2 bg-[#FF9900] text-[#111] font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-mono shadow-xs"
                  >
                    {cartCount}
                  </span>
                </div>
                <span className="text-xs font-bold text-white hidden sm:inline">Cart</span>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {cartFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in shadow-xs ${
                cartFeedback.type === 'bug'
                  ? 'bg-rose-50 border border-rose-300 text-rose-900'
                  : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              }`}
            >
              {cartFeedback.type === 'bug' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-semibold leading-relaxed">
                {cartFeedback.message}
              </div>
            </div>
          )}

          {/* Product Detail Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-[#FFFDF9] flex flex-col md:flex-row gap-5 items-start">
            {/* Product Image Representation */}
            <div className="w-full md:w-36 h-36 bg-[#F3EFE6] rounded-xl flex flex-col items-center justify-center p-3 text-center border border-[#EBE7DF] shrink-0">
              <Package className="w-10 h-10 text-[#8174A0] mb-2" />
              <span className="text-[10px] font-bold text-gray-700">Echo Dot (5th Gen)</span>
              <span className="text-[9px] text-gray-500">Charcoal Edition</span>
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                Amazon Echo Dot (5th Gen, 2024 Release) | Smart speaker with bigger vibrant sound, helpful Alexa &amp; Bluetooth
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-amber-500">
                <div className="flex items-center">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current opacity-60" />
                </div>
                <span className="text-xs text-gray-600 font-medium">4.7 (84,210 ratings)</span>
              </div>

              <div className="pt-1">
                <span className="text-lg font-extrabold text-gray-900">$49.99</span>
                <span className="text-xs text-gray-500 ml-1.5">Free One-Day Delivery with Prime</span>
              </div>

              <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>In Stock. Ships from and sold by Amazon.com.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <button
                  id="add-to-cart-button"
                  data-testid="add-to-cart-button"
                  type="button"
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-[#FCD200]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="buy-now-button"
                  data-testid="buy-now-button"
                  type="button"
                  onClick={() => alert('Quick checkout invoked in sandbox.')}
                  className="px-5 py-2.5 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center border border-[#FF8F00]"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* SCENARIO B: INVOICE / STATUTORY BILLING REPRODUCTION */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <form onSubmit={handleInvoiceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="pt-2">
              <button
                id="dispatchInvoiceBtn"
                type="submit"
                data-testid="btn-dispatch-invoice"
                className="w-full py-3 px-4 bg-[#8174A0] hover:bg-[#6f638d] active:bg-[#5b5175] text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Generate &amp; Dispatch Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sandbox Footer Info */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-medium flex items-center justify-between">
        <span>DOM Observer: {isRecording ? '🟢 Listening to inputs & clicks' : '⚪ Standby'}</span>
        <span className="font-mono text-slate-600 font-bold">
          Sandbox Target: {isEcommerce ? 'Amazon Catalog' : 'LedgerFlow'}
        </span>
      </div>
    </div>
  );
};
