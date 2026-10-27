import React from 'react';
import { Sparkles, ArrowLeft, MapPin, ArrowRight } from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface CareersPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onBack, onNavigateToApp }) => {
  const roles = [
    {
      id: 'compiler-ast-engineer',
      title: 'Senior Playwright & AST Compiler Engineer',
      team: 'Core Synthesis',
      location: 'Remote (Global) / San Francisco',
      type: 'Full-time',
      compensation: '$180,000 – $220,000 • 0.25% - 0.75%',
      description: 'Design and optimize our deterministic TypeScript test code generator. Transform high-level voice reproduction timelines into clean, robust Playwright scripts targeting resilient accessible roles.',
      tags: ['TypeScript', 'Playwright', 'AST Compilers', 'Babel'],
    },
    {
      id: 'browser-infrastructure',
      title: 'Staff Systems & Browser Engine Engineer',
      team: 'Execution Infrastructure',
      location: 'Remote (US/EU/APAC)',
      type: 'Full-time',
      compensation: '$190,000 – $230,000 • 0.3% - 0.8%',
      description: 'Build local and cloud sandboxed Chromium/Edge execution environments. Manage low-latency subprocess piping, deterministic DOM snapshot diffing, and zero-trust memory isolation.',
      tags: ['Chromium', 'Edge', 'Node.js', 'Linux Cgroups', 'Docker'],
    },
    {
      id: 'acoustics-ai',
      title: 'Acoustic AI & Voice Protocol Researcher',
      team: 'Voice Intake',
      location: 'Remote (Global)',
      type: 'Full-time',
      compensation: '$175,000 – $210,000 • 0.2% - 0.6%',
      description: 'Integrate next-generation streaming speech-to-intent pipelines with Wispr Flow. Filter ambient mechanical noise and extract complex parameterized bug assertions in real time.',
      tags: ['Audio DSP', 'Wispr Flow', 'Streaming Speech', 'NLP'],
    },
    {
      id: 'devrel-lead',
      title: 'Founding Developer Relations & QA Architect',
      team: 'Developer Experience',
      location: 'Remote (Global)',
      type: 'Full-time',
      compensation: '$160,000 – $190,000 • 0.2% - 0.5%',
      description: 'Champion hands-free test automation among front-end and QA communities. Build open-source demo suites, author high-impact architectural guides, and interface with engineering leaders.',
      tags: ['Technical Writing', 'E2E Testing', 'Developer Education'],
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
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-xs font-bold text-[#8174A0]">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>JOIN THE ENGINEERING CORE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A24]">
            Build the Future of Autonomous QA
          </h1>
          <p className="text-sm sm:text-base text-[#6B6275] max-w-2xl mx-auto leading-relaxed">
            We are solving the hardest challenges in compilers, browser automation, and acoustic speech parsing. Come build the tools developers rely on every day.
          </p>
        </div>
      </header>

      {/* Roles List */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE7DF]">
          <h2 className="text-lg font-bold text-[#1F1A24]">Open Engineering Positions</h2>
          <span className="text-xs text-[#6B6275] font-semibold">{roles.length} roles available</span>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs hover:border-[#8174A0] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-[#8174A0]">
                    {role.team}
                  </span>
                  <span className="text-xs text-[#9E95A8] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {role.location}
                  </span>
                  <span className="text-xs text-[#2E7D32] font-semibold">
                    {role.compensation}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#1F1A24] group-hover:text-[#8174A0] transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6275] leading-relaxed">
                  {role.description}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {role.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EBE7DF] text-[#6B6275]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href="mailto:careers@reprox.dev?subject=Application:%20"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] shrink-0"
              >
                <span>Apply for Role</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
