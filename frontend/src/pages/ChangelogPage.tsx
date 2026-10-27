import React from 'react';
import { Sparkles, ArrowLeft, CheckCircle2, Calendar } from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface ChangelogPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
}

export const ChangelogPage: React.FC<ChangelogPageProps> = ({ onBack, onNavigateToApp }) => {
  const releases = [
    {
      version: 'v1.0.5',
      date: 'October 26, 2026',
      badge: 'Current Stable',
      badgeColor: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
      summary: 'Commercial Invoice GST validation fix & genuine Playwright verification pipeline.',
      changes: [
        'Added statutory GSTIN validation assertion modal with role="alert" in Invoice Sandbox.',
        'Playwright spec verify-fixed.spec.ts passes cleanly with Exit Code 0 across all 7 assertions.',
        'Integrated genuine subprocess runner /api/run-playwright executing MS Edge without mock timers.',
        'Added live telemetry execution logs and audit stream in Test Studio and Logs page.',
      ],
    },
    {
      version: 'v1.0.4',
      date: 'October 25, 2026',
      badge: 'Intentional Bug Baseline',
      badgeColor: 'bg-[#FBF0F3] text-[#D9534F] border-[#EFB6C8]',
      summary: 'Invoice creation bug reproduction baseline for automated regression testing.',
      changes: [
        'Captured bug: submitting $4,850 invoice without GSTIN incorrectly triggered success toast.',
        'Synthesized deterministic Playwright test repro-buggy.spec.ts confirming Exit Code 1 failure.',
        'Established dual-build testing harness comparing buggy vs fixed builds side-by-side.',
      ],
    },
    {
      version: 'v1.0.3',
      date: 'October 20, 2026',
      badge: 'Acoustic Update',
      badgeColor: 'bg-[#F4F1F8] text-[#8174A0] border-[#A888B5]',
      summary: 'Wispr Flow hands-free microphone intake and speech-to-intent engine.',
      changes: [
        'Integrated Wispr Flow concentric audio visualizer with live decibel waveform response.',
        'Added acoustic intent parser detecting entity fields (client, amount, assertion type).',
        'Enabled manual transcript editing before timeline commitment.',
      ],
    },
    {
      version: 'v1.0.2',
      date: 'October 15, 2026',
      badge: 'Security Release',
      badgeColor: 'bg-[#FFF9E6] text-[#B78103] border-[#FFE082]',
      summary: 'Zero-Trust Privacy Scrubber with client-side credential redaction.',
      changes: [
        'Automatic Luhn-10 algorithm redaction for credit card PANs in browser memory heap.',
        'Authorization Bearer and JWT token masking before timeline event storage.',
        'Privacy audit settings toggle with configurable masking presets.',
      ],
    },
    {
      version: 'v1.0.1',
      date: 'October 10, 2026',
      badge: 'Design System',
      badgeColor: 'bg-[#FAF7F2] text-[#6B6275] border-[#EBE7DF]',
      summary: 'Core multi-page architecture with exact brand color palette and typography.',
      changes: [
        'Brand color palette established: #FFD2A0, #EFB6C8, #8174A0, #A888B5 on warm cream #FAF7F2.',
        'Typography integration: Instrument Serif for display, Inter for UI, JetBrains Mono for code.',
        'Responsive AppShell layout with desktop sidebar and mobile navigation drawer.',
      ],
    },
  ];

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

      {/* Header */}
      <header className="pt-16 pb-12 px-6 lg:px-12 border-b border-[#EBE7DF] bg-[#FFFDF9]/60 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-xs font-bold text-[#8174A0]">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>RELEASE HISTORY &amp; AUDIT TRAIL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A24]">
            REPROX Product Changelog
          </h1>
          <p className="text-sm sm:text-base text-[#6B6275] max-w-2xl mx-auto leading-relaxed">
            Track architectural improvements, Playwright code generator updates, and verification results across all releases.
          </p>
        </div>
      </header>

      {/* Main Release Timeline */}
      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="space-y-10 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#EBE7DF]">
          {releases.map((release) => (
            <div key={release.version} className="relative pl-12 space-y-3">
              {/* Timeline Dot */}
              <div className="absolute left-3 top-1.5 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FFFDF9] border-2 border-[#8174A0] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#8174A0]" />
              </div>

              {/* Version & Date */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xl font-bold text-[#1F1A24]">
                  {release.version}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${release.badgeColor}`}>
                  {release.badge}
                </span>
                <span className="text-xs text-[#8174A0] font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{release.date}</span>
                </span>
              </div>

              {/* Card Container */}
              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs space-y-4">
                <p className="text-sm font-semibold text-[#1F1A24] leading-relaxed">
                  {release.summary}
                </p>

                <ul className="space-y-2 text-xs sm:text-[13px] text-[#5A5264]">
                  {release.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8174A0] shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
