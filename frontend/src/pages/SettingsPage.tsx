import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Save, 
  Sparkles 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'browser' | 'voice' | 'notifications'>('privacy');
  const [maskBearer, setMaskBearer] = useState(true);
  const [maskPasswords, setMaskPasswords] = useState(true);
  const [maskCreditCards, setMaskCreditCards] = useState(true);
  const [maskTaxIds, setMaskTaxIds] = useState(true);
  const [displayName, setDisplayName] = useState('Mustafa Pinjari');
  const [email, setEmail] = useState('mustafa@example.com');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata (GMT+5:30)');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans max-w-6xl mx-auto pb-10">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION MATCHING SCREEN 6 REFERENCE */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EBE7DF]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8174A0] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>WORKSPACE PREFERENCES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A24] tracking-tight">
            Settings &amp; Privacy Rules
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6275] mt-0.5">
            Configure privacy redactions, browser runner flags, and Wispr Flow voice models.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer self-start sm:self-auto"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-[#FFD2A0]" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TABS BAR MATCHING SCREEN 6 REFERENCE */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[#EBE7DF] pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-[#8174A0] text-white shadow-xs'
              : 'text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2]'
          }`}
        >
          Privacy &amp; Redaction
        </button>
        <button
          onClick={() => setActiveTab('browser')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'browser'
              ? 'bg-[#8174A0] text-white shadow-xs'
              : 'text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2]'
          }`}
        >
          Browser Runner
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-[#8174A0] text-white shadow-xs'
              : 'text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2]'
          }`}
        >
          Voice Models
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#8174A0] text-white shadow-xs'
              : 'text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2]'
          }`}
        >
          Notifications
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2-COLUMN SETTINGS GRID MATCHING SCREEN 6 REFERENCE */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: Privacy Scrubber (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-xs p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#EBE7DF]">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] flex items-center justify-center text-[#8174A0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1F1A24]">
                Zero-Trust Privacy Scrubber
              </h3>
              <p className="text-xs text-[#6B6275]">
                Automatically masks sensitive tokens and credentials before generating Playwright tests.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {/* Toggle Item 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] transition-colors">
              <div className="pr-4">
                <span className="text-xs sm:text-[13px] font-bold text-[#1F1A24] block">
                  Mask Bearer &amp; JWT Authorization Headers
                </span>
                <span className="text-[11px] text-[#6B6275]">
                  Replace live secrets with safe test placeholders: [REDACTED_BEARER_TOKEN]
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMaskBearer(!maskBearer)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  maskBearer ? 'bg-[#8174A0]' : 'bg-[#D8D2C5]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                    maskBearer ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Item 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] transition-colors">
              <div className="pr-4">
                <span className="text-xs sm:text-[13px] font-bold text-[#1F1A24] block">
                  Mask Password &amp; Secret Inputs
                </span>
                <span className="text-[11px] text-[#6B6275]">
                  Replaces input values with randomized test hashes.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMaskPasswords(!maskPasswords)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  maskPasswords ? 'bg-[#8174A0]' : 'bg-[#D8D2C5]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                    maskPasswords ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Item 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] transition-colors">
              <div className="pr-4">
                <span className="text-xs sm:text-[13px] font-bold text-[#1F1A24] block">
                  Mask Payment &amp; Credit Card PANs
                </span>
                <span className="text-[11px] text-[#6B6275]">
                  Luhn-valid patterns scrubbed to [REDACTED_CARD_PAN].
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMaskCreditCards(!maskCreditCards)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  maskCreditCards ? 'bg-[#8174A0]' : 'bg-[#D8D2C5]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                    maskCreditCards ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Item 4 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] transition-colors">
              <div className="pr-4">
                <span className="text-xs sm:text-[13px] font-bold text-[#1F1A24] block">
                  Mask Tax IDs &amp; GST Identifiers
                </span>
                <span className="text-[11px] text-[#6B6275]">
                  Replaces enterprise GSTIN / TIN with synthetic test credentials.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMaskTaxIds(!maskTaxIds)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  maskTaxIds ? 'bg-[#8174A0]' : 'bg-[#D8D2C5]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                    maskTaxIds ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Workspace Profile & Danger Zone (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Workspace Profile Card */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-xs p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#8174A0] tracking-wider uppercase">
              Workspace Profile
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6B6275] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] text-xs font-semibold text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B6275] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] text-xs font-semibold text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6B6275] mb-1">
                  Time Zone
                </label>
                <input
                  type="text"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] text-xs font-semibold text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#EFB6C8] shadow-xs p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-bold text-[#D9534F] tracking-wider uppercase">
              Danger Zone
            </h3>
            <p className="text-[11px] text-[#6B6275] leading-relaxed">
              Permanently delete all captured recordings, synthetic tests, and team credentials.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this workspace?')) {
                  alert('Action cancelled in demo mode.');
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-[#EFB6C8] hover:bg-[#FBF0F3] text-xs font-bold text-[#D9534F] transition-colors cursor-pointer"
            >
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
