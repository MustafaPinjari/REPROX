import React from 'react';
import { Compass, ArrowLeft, Home, FileCode } from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface NotFoundPageProps {
  onBackToLanding: () => void;
  onNavigateToApp: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToLanding, onNavigateToApp }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A24] font-sans selection:bg-[#EFB6C8] selection:text-[#1F1A24] flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE7DF] px-6 lg:px-12 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B6275] hover:text-[#1F1A24] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing</span>
          </button>
          <ReproxLogo />
          <button
            onClick={onNavigateToApp}
            className="px-4 py-2 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Open App
          </button>
        </div>
      </nav>

      {/* Hero 404 Section */}
      <main className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#FFD2A0] via-[#EFB6C8] to-[#8174A0] p-1 shadow-md mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#FFFDF9] rounded-[22px] flex items-center justify-center">
              <Compass className="w-12 h-12 text-[#8174A0] animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#8174A0] text-white font-mono text-xs font-bold shadow-xs">
            404
          </span>
        </div>

        <div className="space-y-3">
          <span className="font-handwriting text-3xl sm:text-4xl text-[#8174A0] font-bold block">
            &ldquo;Locator timed out in the clouds.&rdquo;
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A24]">
            This Route Does Not Exist
          </h1>
          <p className="text-sm text-[#6B6275] max-w-md mx-auto leading-relaxed">
            The page or trace file you requested could not be resolved by our routing engine. Let&apos;s get you back to reproducing bugs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={onBackToLanding}
            className="px-5 py-2.5 rounded-xl bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#EBE7DF] text-[#1F1A24] text-xs font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-[#8174A0]" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={onNavigateToApp}
            className="px-5 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <FileCode className="w-4 h-4 text-[#EFB6C8]" />
            <span>Launch Test Studio</span>
          </button>
        </div>
      </main>

      {/* Decorative Bottom Landscape Banner */}
      <div className="relative border-t border-[#EBE7DF] bg-[#FFFDF9] py-8 text-center text-xs text-[#6B6275]">
        <p>© 2026 REPROX. Voice to Repro. Tests that prove.</p>
      </div>
    </div>
  );
};
