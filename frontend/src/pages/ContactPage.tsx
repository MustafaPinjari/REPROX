import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2, Mic } from 'lucide-react';
import { ReproxLogo } from '../components/brand/ReproxLogo';

interface ContactPageProps {
  onBack: () => void;
  onNavigateToApp: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onNavigateToApp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Enterprise Pilot & Playwright CI Integration');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

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
      <header className="pt-16 pb-10 px-6 lg:px-12 border-b border-[#EBE7DF] bg-[#FFFDF9]/60 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-xs font-bold text-[#8174A0]">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>DEVELOPER RELATIONS &amp; SUPPORT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A24]">
            Connect with the Engineering Team
          </h1>
          <p className="text-sm sm:text-base text-[#6B6275] max-w-2xl mx-auto leading-relaxed">
            Have questions about Wispr Flow integration, custom Playwright AST templates, or enterprise deployments? We respond in under 2 hours.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1F1A24] uppercase tracking-wider">
                Direct Engineering Channels
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-[#3D3546]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF] flex items-center justify-center text-[#8174A0] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F1A24] block">Technical Inquiries</span>
                    <a href="mailto:mustafa@reprox.dev" className="text-[#8174A0] hover:underline">
                      mustafa@reprox.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF] flex items-center justify-center text-[#8174A0] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F1A24] block">Developer Hotline</span>
                    <span>+1 (800) 555-0199 (Mon-Fri 9am-6pm IST)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF] flex items-center justify-center text-[#8174A0] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1F1A24] block">Core Office</span>
                    <span>Bengaluru &amp; San Francisco • Distributed Global Team</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Card */}
            <div className="p-6 rounded-2xl bg-[#FBF0F3] border border-[#EFB6C8] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#8174A0]" />
                <h4 className="text-xs font-bold text-[#1F1A24] uppercase tracking-wider">
                  Test Live Bug Dictation
                </h4>
              </div>
              <p className="text-xs text-[#6B6275] leading-relaxed">
                Rather than filling out a form, try reporting the intentional Commercial Invoice GST bug with your voice right in the sandbox.
              </p>
              <button
                onClick={onNavigateToApp}
                className="w-full py-2 px-3 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Launch Invoice Demo
              </button>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-xs p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1A24]">Message Dispatched Successfully</h3>
                <p className="text-xs sm:text-sm text-[#6B6275] max-w-sm mx-auto">
                  Thank you! An engineer will review your message and respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#EBE7DF] text-xs font-semibold text-[#1F1A24]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-[#1F1A24] mb-2">Send an Engineering Note</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D3546] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mustafa Pinjari"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-xs text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3D3546] mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@acme.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-xs text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3546] mb-1">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-xs text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
                  >
                    <option value="Enterprise Pilot &amp; Playwright CI Integration">
                      Enterprise Pilot &amp; Playwright CI Integration
                    </option>
                    <option value="Wispr Flow Voice SDK Custom Protocol">
                      Wispr Flow Voice SDK Custom Protocol
                    </option>
                    <option value="Zero-Trust Privacy Scrubber Rules">
                      Zero-Trust Privacy Scrubber Rules
                    </option>
                    <option value="Bug Report / Security Disclosure">
                      Bug Report / Security Disclosure
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3546] mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your tech stack, repo setup, or question..."
                    className="w-full p-3.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-xs text-[#1F1A24] focus:outline-none focus:ring-1 focus:ring-[#8174A0] leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white font-semibold text-xs tracking-wide shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
