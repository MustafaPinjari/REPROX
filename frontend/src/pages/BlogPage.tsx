import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Calendar, Clock, ChevronRight } from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface BlogPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBack, onNavigateToApp }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'playwright' | 'security' | 'voice'>('all');

  const articles = [
    {
      id: 'ast-synthesis',
      category: 'playwright',
      categoryLabel: 'Playwright & Compilers',
      title: 'Synthesizing Resilient Playwright Locators from Voice Intent ASTs',
      excerpt: 'Why XPath and brittle CSS selectors fail in production, and how REPROX synthesizes deterministic getByRole and getByTestId locators directly from acoustic entity parsing.',
      date: 'Oct 24, 2026',
      readTime: '6 min read',
      author: 'Mustafa Pinjari',
      badgeColor: 'bg-[#FBF0F3] text-[#8174A0] border-[#EFB6C8]',
    },
    {
      id: 'zero-trust-privacy',
      category: 'security',
      categoryLabel: 'Zero-Trust Security',
      title: 'Zero-Trust Privacy Scrubbing: Preventing Credential Leaks in Test Harnesses',
      excerpt: 'How we redact live JWT bearer headers, Luhn-valid credit card PANs, and tax identification numbers in memory before any script touches persistent storage.',
      date: 'Oct 18, 2026',
      readTime: '8 min read',
      author: 'REPROX Security Research',
      badgeColor: 'bg-[#FAF7F2] text-[#8174A0] border-[#EBE7DF]',
    },
    {
      id: 'dual-browser-verification',
      category: 'playwright',
      categoryLabel: 'Browser Automation',
      title: 'Real vs Simulated Testing: Launching Native Edge Processes in Dev Environments',
      excerpt: 'A technical breakdown of our /api/run-playwright subprocess runner and why simulation timers can never replace genuine browser process exit codes.',
      date: 'Oct 12, 2026',
      readTime: '5 min read',
      author: 'Core Engineering',
      badgeColor: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
    },
    {
      id: 'acoustic-intent-parsing',
      category: 'voice',
      categoryLabel: 'Voice & Acoustics',
      title: 'Whispr Flow Acoustic Integration: Continuous Speech to Bug Reproduction',
      excerpt: 'Handling real-world ambient keyboard noise, false starts, and linguistic nuances during hands-free QA session recording.',
      date: 'Oct 04, 2026',
      readTime: '7 min read',
      author: 'Acoustics Team',
      badgeColor: 'bg-[#FEEAE1] text-[#C2410C] border-[#FAD8C7]',
    },
  ];

  const filtered = articles.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

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
      <header className="pt-16 pb-12 px-6 lg:px-12 border-b border-[#EBE7DF] bg-[#FFFDF9]/60">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-xs font-bold text-[#8174A0]">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>ENGINEERING &amp; ARCHITECTURE JOURNAL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A24]">
            Engineering Deep Dives
          </h1>
          <p className="text-sm sm:text-base text-[#6B6275] max-w-2xl leading-relaxed">
            Technical writings on browser automation, compiler AST synthesis, acoustic intent parsing, and zero-trust credential isolation.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pt-4 overflow-x-auto">
            {(['all', 'playwright', 'security', 'voice'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#8174A0] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6B6275] hover:bg-[#F3EFE6] border border-[#EBE7DF]'
                }`}
              >
                {cat === 'all' ? 'All Articles' : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <article
              key={post.id}
              onClick={onNavigateToApp}
              className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs hover:border-[#8174A0] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${post.badgeColor}`}>
                    {post.categoryLabel}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-[#9E95A8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#1F1A24] group-hover:text-[#8174A0] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B6275] leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EBE7DF] mt-5 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1F1A24]">{post.author}</span>
                <span className="inline-flex items-center gap-1 text-[#8174A0] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};
