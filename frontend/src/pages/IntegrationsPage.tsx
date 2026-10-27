import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  Mic, 
  Code2, 
  Sparkles 
} from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'wispr-flow',
      name: 'Wispr Flow Voice SDK',
      category: 'Voice Input',
      description: 'Zero-latency hands-free bug dictation with continuous acoustic streaming.',
      connected: true,
      tag: 'Acoustic Core',
      ping: 'Active <1ms',
      iconBg: 'bg-[#EFB6C8]/40 text-[#8174A0]',
      type: 'mic',
    },
    {
      id: 'playwright-cli',
      name: 'Playwright Native CLI',
      category: 'Browser Engine',
      description: 'Local Chromium / Microsoft Edge subprocess runner on localhost:3000.',
      connected: true,
      tag: 'Verified',
      ping: 'Active <3ms',
      iconBg: 'bg-[#A888B5]/40 text-[#8174A0]',
      type: 'code',
    },
    {
      id: 'github-actions',
      name: 'GitHub Actions CI/CD',
      category: 'Continuous Integration',
      description: 'Auto-dispatch regression tests against pull requests before merging fixes.',
      connected: true,
      tag: 'v2 Workflow',
      ping: 'Active <1ms',
      iconBg: 'bg-[#FFD2A0]/60 text-[#8174A0]',
      type: 'github',
    },
    {
      id: 'slack',
      name: 'Slack Alerts & Notifications',
      category: 'Collaboration',
      description: 'Post verified pass/fail summaries and duration metrics into #dev-alerts.',
      connected: false,
      tag: 'Incoming Webhook',
      ping: 'Disconnected',
      iconBg: 'bg-[#EFB6C8]/30 text-[#8174A0]',
      type: 'slack',
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, connected: !item.connected } : item))
    );
  };

  return (
    <div className="relative space-y-6 animate-fadeIn font-sans max-w-5xl mx-auto pb-10">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* TOP-RIGHT CORNER ARTWORK & SCRIPT MATCHING SCREEN 5 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block absolute -top-4 right-0 pointer-events-none z-10 w-64 h-36 overflow-hidden rounded-2xl opacity-75">
        <img
          src="/assets/soft_pastel_footer_lake.jpg"
          alt="REPROX Mountain Stack"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FAF7F2]/40 to-[#FAF7F2]" />
        
        {/* Handwritten script note */}
        <div className="absolute top-4 right-6 text-right">
          <svg 
            className="absolute -top-3 -right-6 w-24 h-28 pointer-events-none text-[#EFB6C8]" 
            fill="none" 
            viewBox="0 0 100 120"
          >
            <path
              d="M10,12 C65,-15 90,65 45,90 C15,105 70,125 95,105"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="opacity-70"
            />
          </svg>
          <span className="font-handwriting text-2xl text-[#C27891] font-bold block rotate-[6deg] leading-tight drop-shadow-2xs">
            Connect your
          </span>
          <span className="font-handwriting text-2xl text-[#C27891] font-bold block rotate-[6deg] leading-tight drop-shadow-2xs">
            dev stack.
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="pb-3 border-b border-[#EBE7DF]">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8174A0] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
          <span>CONNECTED ECOSYSTEM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A24] tracking-tight">
          Integrations &amp; Webhooks
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6275] mt-0.5">
          Connect your voice input hardware, CI/CD runners, and developer issue trackers.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2x2 INTEGRATIONS GRID MATCHING SCREEN 5 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs flex flex-col justify-between hover:border-[#8174A0] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    {item.type === 'mic' ? (
                      <Mic className="w-5 h-5" />
                    ) : item.type === 'code' ? (
                      <Code2 className="w-5 h-5" />
                    ) : item.type === 'github' ? (
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1F1A24] leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#8174A0]">{item.category}</span>
                  </div>
                </div>

                {/* Status indicator / button */}
                <button
                  onClick={() => toggleIntegration(item.id)}
                  className="cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  {item.connected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#A5D6A7]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#6B6275] bg-[#FAF7F2] px-3.5 py-1 rounded-full border border-[#EBE7DF] hover:bg-[#F3EFE6]">
                      Connect
                    </span>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#6B6275] leading-relaxed mb-4">{item.description}</p>
            </div>

            <div className="pt-3.5 border-t border-[#EBE7DF] flex items-center justify-between text-[11px] text-[#9E95A8] font-mono">
              <span>Protocol: {item.tag}</span>
              <span className={item.connected ? 'text-[#2E7D32] font-semibold' : 'text-[#6B6275]'}>
                {item.ping}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
