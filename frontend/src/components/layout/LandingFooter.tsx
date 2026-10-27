import React from 'react';
import { 
  Mail, 
  Phone, 
  Sun, 
  Home, 
  Sparkles, 
  GitBranch, 
  CreditCard, 
  BookOpen, 
  Clock, 
  User, 
  Feather, 
  FileText, 
  Mic, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  FileSpreadsheet
} from 'lucide-react';
import { ReproxLogo } from '../brand/ReproxLogo';

interface LandingFooterProps {
  onNavigateToApp?: () => void;
  onNavigateToAuth?: () => void;
  onNavigateToStory?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToCareers?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToDocs?: () => void;
  onNavigateToChangelog?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateToApp,
  onNavigateToAuth,
  onNavigateToStory,
  onNavigateToBlog,
  onNavigateToCareers,
  onNavigateToContact,
  onNavigateToDocs,
  onNavigateToChangelog,
}) => {
  return (
    <footer className="relative bg-[#FAF7F2] overflow-hidden pt-12 sm:pt-16 font-sans select-none border-t border-[#EBE7DF]">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP NAVIGATION & BRAND GRID */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start">
          
          {/* Brand Column (Left, ~32%) */}
          <div className="lg:col-span-4 lg:pr-10 space-y-4">
            <div 
              onClick={onNavigateToApp} 
              className="cursor-pointer inline-block"
              title="REPROX Home"
            >
              <ReproxLogo />
            </div>

            <p className="text-xs sm:text-[13px] text-[#5A5264] leading-relaxed max-w-sm font-normal">
              AI-powered bug reporting and test generation for real developers. Turn complex issues into
              clear, reproducible tests and ship with confidence.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#E5DFD3] hover:border-[#8174A0] flex items-center justify-center text-[#1F1A24] transition-all shadow-2xs hover:scale-105"
                title="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#E5DFD3] hover:border-[#8174A0] flex items-center justify-center text-[#1F1A24] transition-all shadow-2xs hover:scale-105"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              <a
                href="mailto:mustafa@reprox.dev"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#E5DFD3] hover:border-[#8174A0] flex items-center justify-center text-[#1F1A24] transition-all shadow-2xs hover:scale-105"
                title="Email Support"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>

              <a
                href="tel:+18005550199"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#E5DFD3] hover:border-[#8174A0] flex items-center justify-center text-[#1F1A24] transition-all shadow-2xs hover:scale-105"
                title="Developer Hotline"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#E5DFD3] hover:border-[#8174A0] flex items-center justify-center text-[#1F1A24] transition-all shadow-2xs hover:scale-105 cursor-pointer"
                title="Theme Settings"
              >
                <Sun className="w-3.5 h-3.5 text-[#8174A0]" />
              </button>
            </div>

            {/* Handwritten script note: "Let's build fewer bugs." with looping pink thread */}
            <div className="relative pt-2 pl-2">
              <svg 
                className="absolute -top-2 left-28 w-40 h-24 pointer-events-none text-[#EFB6C8]" 
                fill="none" 
                viewBox="0 0 160 90"
              >
                <path
                  d="M10,25 C45,-15 110,5 95,45 C80,85 140,80 155,50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="opacity-70"
                />
              </svg>

              <span className="font-handwriting text-2xl sm:text-3xl text-[#C27891] font-bold rotate-[-3deg] inline-block tracking-wide drop-shadow-2xs">
                Let&apos;s build fewer bugs.
              </span>
            </div>
          </div>

          {/* Thin Vertical Separation Line 1 */}
          <div className="hidden lg:block w-[1px] bg-[#EBE7DF] h-52 self-center mx-2" />

          {/* Right Columns Grid: PRODUCT, COMPANY, PROJECTS (8 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative lg:pl-6">
            
            {/* Column 1: PRODUCT */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-[#8174A0] tracking-widest uppercase">
                PRODUCT
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-[#3D3546]">
                <li>
                  <a
                    href="#product"
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group"
                  >
                    <Home className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Features</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>How it works</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Pricing</span>
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToDocs}
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Docs</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToChangelog}
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Changelog</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: COMPANY (REPROX Core) */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-[#8174A0] tracking-widest uppercase">
                COMPANY
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-[#3D3546]">
                <li>
                  <a
                    href="#about"
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group"
                  >
                    <User className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>About</span>
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToStory}
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                  >
                    <Feather className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Our Story</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToBlog}
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Blog</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToCareers}
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Careers</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToContact}
                    className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#8174A0] group-hover:scale-110 transition-transform" />
                    <span>Contact</span>
                  </button>
                </li>
                {onNavigateToAuth && (
                  <li>
                    <button
                      type="button"
                      onClick={onNavigateToAuth}
                      className="flex items-center gap-2 hover:text-[#8174A0] transition-colors group cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5 text-[#8174A0]" />
                      <span className="font-semibold text-[#8174A0]">Developer Sign In</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: PROJECTS / PRODUCT MODULES */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-[#8174A0] tracking-widest uppercase">
                PROJECTS
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-[#3D3546]">
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToApp}
                    className="flex items-center gap-2.5 hover:text-[#8174A0] transition-colors group text-left cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-[6px] bg-[#EFB6C8]/40 text-[#8174A0] flex items-center justify-center shrink-0">
                      <Mic className="w-3 h-3" />
                    </span>
                    <span>Voice Dictation Engine</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToApp}
                    className="flex items-center gap-2.5 hover:text-[#8174A0] transition-colors group text-left cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-[6px] bg-[#A888B5]/40 text-[#8174A0] flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-3 h-3" />
                    </span>
                    <span>Invoice Billing Sandbox</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToApp}
                    className="flex items-center gap-2.5 hover:text-[#8174A0] transition-colors group text-left cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-[6px] bg-[#FFD2A0]/60 text-[#8174A0] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                    <span>Zero-Trust Privacy Scrubber</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToApp}
                    className="flex items-center gap-2.5 hover:text-[#8174A0] transition-colors group text-left cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-[6px] bg-[#8174A0]/20 text-[#8174A0] flex items-center justify-center shrink-0">
                      <Terminal className="w-3 h-3" />
                    </span>
                    <span>Playwright Synthesizer</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onNavigateToApp}
                    className="flex items-center gap-2.5 hover:text-[#8174A0] transition-colors group text-left cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-[6px] bg-[#EFB6C8]/35 text-[#8174A0] flex items-center justify-center shrink-0">
                      <Cpu className="w-3 h-3" />
                    </span>
                    <span>Microsoft Edge Runner</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Right Handwritten script note: "From issues to impact." with looping pink thread */}
            <div className="hidden sm:block absolute -top-5 -right-6 sm:-right-8 lg:-right-10 pointer-events-none">
              <svg 
                className="absolute -top-3 -right-6 w-32 h-36 pointer-events-none text-[#EFB6C8]" 
                fill="none" 
                viewBox="0 0 120 140"
              >
                <path
                  d="M10,12 C75,-15 110,65 55,90 C15,110 90,140 115,115"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="opacity-70"
                />
              </svg>

              <div className="transform rotate-[8deg] text-right">
                <span className="font-handwriting text-2xl sm:text-3xl text-[#C27891] font-bold block leading-tight drop-shadow-2xs">
                  From issues
                </span>
                <span className="font-handwriting text-2xl sm:text-3xl text-[#C27891] font-bold block leading-tight drop-shadow-2xs">
                  to impact.
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. LOWER SECTION: PASTEL MOUNTAIN LAKE & REPROX WATERMARK */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[330px] overflow-hidden mt-6">
        {/* Soft Pastel Mountain Lake Artwork Background */}
        <img
          src="/assets/soft_pastel_footer_lake.jpg"
          alt="REPROX Soft Pastel Sunset Mountain Lake"
          className="w-full h-full object-cover object-bottom"
        />

        {/* Soft top gradient blend smoothly merging warm cream (#FAF7F2) into pastel sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent h-28 pointer-events-none" />

        {/* Giant Watermark: "R E P R O X" behind landscape / rising above lake */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span 
            className="font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[12.5rem] tracking-[0.08em] uppercase text-white/45 drop-shadow-[0_2px_12px_rgba(255,210,160,0.5)]"
            style={{
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
            }}
          >
            REPROX
          </span>
        </div>

        {/* Bottom subtle water reflection tint */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#FAF7F2]/40 to-transparent pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. COPYRIGHT BAR */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="relative z-20 bg-[#FAF7F2] py-4 px-6 border-t border-[#EBE7DF]">
        <div className="max-w-[1380px] mx-auto flex items-center justify-center gap-4 text-[11px] sm:text-xs text-[#6B6275] font-medium">
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8174A0]" />
            <div className="h-[1px] bg-[#EBE7DF] w-24 sm:w-48" />
          </div>

          <div className="text-center whitespace-nowrap">
            <span>&copy; 2026 REPROX. All rights reserved. Built by </span>
            <strong className="text-[#1F1A24] font-semibold">Mustafa Pinjari.</strong>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-1 justify-start">
            <div className="h-[1px] bg-[#EBE7DF] w-24 sm:w-48" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#8174A0]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
