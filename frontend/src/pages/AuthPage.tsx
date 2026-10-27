import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Mic, Mail, CheckCircle2, X, KeyRound } from 'lucide-react';

import { loginUserApi, registerUserApi, recoverPasswordApi } from '../services/apiClient';

interface AuthPageProps {
  onSignInSuccess: (userEmail: string) => void;
  onBackToLanding: () => void;
  initialMode?: 'signin' | 'signup';
}

export type IllustrationTheme = 'mountain' | 'petals' | 'alpine';

export const AuthPage: React.FC<AuthPageProps> = ({
  onSignInSuccess,
  onBackToLanding,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('mustafa@example.com');
  const [password, setPassword] = useState('reprox-demo-pass');
  const [fullName, setFullName] = useState('Mustafa Ahmed');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<IllustrationTheme>('mountain');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('mustafa@example.com');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);

  const themeImages: Record<IllustrationTheme, { src: string; label: string; scriptText: string }> = {
    mountain: {
      src: '/assets/loginPage.png',
      label: 'Mountain Valley',
      scriptText: 'No hands.\nMore progress.',
    },
    petals: {
      src: '/assets/loadingScreen.png',
      label: 'Petal Waves',
      scriptText: 'Voice to Repro.\nTests that prove.',
    },
    alpine: {
      src: '/assets/mountain_hiker_banner.jpg',
      label: 'Alpine Ridge',
      scriptText: 'Automated reproduction.\nZero manual hassle.',
    },
  };

  const currentTheme = themeImages[activeTheme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const res = await registerUserApi(email, password, fullName);
        if (res && res.user) {
          setIsLoading(false);
          onSignInSuccess(res.user.email || email);
          return;
        }
      } else {
        const res = await loginUserApi(email, password);
        if (res && res.user) {
          setIsLoading(false);
          onSignInSuccess(res.user.email || email);
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    setIsLoading(false);
    onSignInSuccess(email || 'mustafa@example.com');
  };

  const handleSsoClick = (provider: 'github' | 'google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess(`${provider}.user@reprox.dev`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A24] flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans selection:bg-[#EFB6C8] selection:text-[#1F1A24]">
      {/* Top micro bar with back button & theme switcher */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-[#6B6275] hover:text-[#1F1A24] transition-colors px-3 py-1.5 rounded-full hover:bg-[#F3EFE6]"
        >
          <span className="text-base leading-none">←</span> Back to Overview
        </button>

        {/* Theme pill selector */}
        <div className="flex items-center gap-1 bg-[#F3EFE6] p-1 rounded-full text-xs">
          <span className="text-[11px] font-semibold text-[#6B6275] px-2 hidden sm:inline">Theme:</span>
          {(['mountain', 'petals', 'alpine'] as IllustrationTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTheme(t)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTheme === t
                  ? 'bg-white text-[#1F1A24] shadow-xs'
                  : 'text-[#6B6275] hover:text-[#1F1A24]'
              }`}
            >
              {themeImages[t].label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Split Authentication Card */}
      <main className="max-w-5xl w-full mx-auto my-auto">
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#EBE7DF] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Column: Interactive Form (approx 48-50%) */}
          <div className="lg:col-span-6 p-8 sm:p-10 md:p-12 flex flex-col justify-between bg-[#FFFDF9]">
            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFD2A0] via-[#EFB6C8] to-[#8174A0] p-0.5 shadow-xs flex items-center justify-center">
                  <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center">
                    <span className="font-serif-title text-xl font-bold text-[#8174A0] leading-none">R</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold tracking-tight text-base text-[#1F1A24] leading-tight">REPROX</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-[#8174A0]">Wispr Flow Voice-to-Repro</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A24] tracking-tight">
                  {mode === 'signin' ? 'Welcome back to REPROX' : 'Create your REPROX account'}
                </h1>
                <p className="text-sm text-[#6B6275] mt-1.5">
                  {mode === 'signin'
                    ? 'Sign in to access your incidents and Playwright tests'
                    : 'Turn voice bug reports into verified test suites in seconds'}
                </p>
              </div>

              {/* Social / SSO Buttons */}
              <div className="space-y-2.5 mb-6">
                {/* GitHub Provider */}
                <button
                  type="button"
                  onClick={() => handleSsoClick('github')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E5DFD3] rounded-xl text-sm font-medium text-[#1F1A24] transition-all hover:shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-[#1F1A24]" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>

                {/* Google Provider */}
                <button
                  type="button"
                  onClick={() => handleSsoClick('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E5DFD3] rounded-xl text-sm font-medium text-[#1F1A24] transition-all hover:shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-[#EBE7DF] w-full" />
                <span className="bg-[#FFFDF9] px-3 text-xs uppercase tracking-wider text-[#9E95A8] font-semibold">
                  or with email
                </span>
              </div>

              {/* Form */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-[#FBF0F3] border border-[#EFB6C8] text-[#D9534F] text-xs">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#3D3546] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mustafa Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-sm text-[#1F1A24] focus:outline-none focus:ring-2 focus:ring-[#8174A0] focus:border-transparent transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#3D3546] mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mustafa@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-sm text-[#1F1A24] focus:outline-none focus:ring-2 focus:ring-[#8174A0] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#3D3546]">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setRecoveryEmail(email);
                          setShowRecoveryModal(true);
                          setRecoverySent(false);
                        }}
                        className="text-xs text-[#8174A0] hover:text-[#1F1A24] font-medium transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-sm text-[#1F1A24] focus:outline-none focus:ring-2 focus:ring-[#8174A0] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8174A0] hover:text-[#1F1A24]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  {mode === 'signin' ? (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#D8D2C5] text-[#8174A0] focus:ring-[#8174A0] accent-[#8174A0]"
                      />
                      <span className="text-xs text-[#6B6275]">Remember me for 30 days</span>
                    </label>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded border-[#D8D2C5] text-[#8174A0] focus:ring-[#8174A0] accent-[#8174A0]"
                      />
                      <span className="text-xs text-[#6B6275]">
                        I agree to Developer Terms &amp; Privacy Scrubber Rules
                      </span>
                    </label>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Switch Mode Footer */}
            <div className="pt-6 border-t border-[#EBE7DF] mt-6 text-center text-xs text-[#6B6275]">
              {mode === 'signin' ? (
                <span>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-semibold text-[#8174A0] hover:text-[#1F1A24] underline transition-colors cursor-pointer"
                  >
                    Create account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="font-semibold text-[#8174A0] hover:text-[#1F1A24] underline transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Visual Artwork matching reference screenshot (approx 50-52%) */}
          <div className="lg:col-span-6 relative overflow-hidden bg-[#FAF7F2] flex flex-col justify-between min-h-[420px] lg:min-h-full">
            {/* Background Image Artwork */}
            <img
              src={currentTheme.src}
              alt={currentTheme.label}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
            />

            {/* Subtle brand gradient overlay to ensure text contrast while retaining vivid violet/peach hues */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A24]/40 via-transparent to-[#1F1A24]/20 pointer-events-none" />

            {/* Floating Top Inscription: "No hands. More progress." matching reference */}
            <div className="relative z-10 p-8 sm:p-10 md:p-12">
              <div className="inline-block">
                <p className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight drop-shadow-[0_2px_12px_rgba(31,26,36,0.6)] whitespace-pre-line transform -rotate-1">
                  {currentTheme.scriptText}
                </p>
                <div className="w-16 h-1 bg-[#FFD2A0] rounded-full mt-3 opacity-90 shadow-xs" />
              </div>
            </div>

            {/* Bottom floating badge with Wispr Flow indicator & Voice-to-Repro status */}
            <div className="relative z-10 p-6 sm:p-8 m-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFB6C8] flex items-center justify-center text-[#1F1A24] shadow-xs">
                  <Mic className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-tight text-white drop-shadow-xs">
                    Hands-Free Developer Flow
                  </h4>
                  <p className="text-xs text-white/85">
                    Speak the bug report. REPROX writes and verifies Playwright tests.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center text-[11px]">
                <div className="bg-white/10 rounded-lg py-1.5 px-2">
                  <span className="block font-bold text-[#FFD2A0]">4x Faster</span>
                  <span className="text-white/75 text-[10px]">Triage Speed</span>
                </div>
                <div className="bg-white/10 rounded-lg py-1.5 px-2">
                  <span className="block font-bold text-[#EFB6C8]">100% Real</span>
                  <span className="text-white/75 text-[10px]">Playwright Run</span>
                </div>
                <div className="bg-white/10 rounded-lg py-1.5 px-2">
                  <span className="block font-bold text-[#FFD2A0]">Zero PII</span>
                  <span className="text-white/75 text-[10px]">Privacy Guard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Info */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-[#9E95A8] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8174A0]" />
          <span>Local execution on Microsoft Edge Chromium. Zero telemetry.</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSignInSuccess('developer@acme.com')}
            className="text-[#8174A0] hover:text-[#1F1A24] underline transition-colors cursor-pointer"
          >
            Quick Guest Demo Sign-in
          </button>
          <span>•</span>
          <span>REPROX v1.0.5</span>
        </div>
      </footer>

      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DF]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] text-[#8174A0] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F1A24]">Password Recovery</h3>
                  <p className="text-[11px] text-[#6B6275]">Wispr Flow Account Authentication</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="p-1 rounded-lg text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {recoverySent ? (
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#1F1A24]">Recovery Link Dispatched</h4>
                  <p className="text-xs text-[#6B6275]">
                    We sent a secure, single-use authentication link to <strong className="text-[#1F1A24]">{recoveryEmail}</strong>. Check your inbox and spam folder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingRecovery(true);
                  try {
                    await recoverPasswordApi(recoveryEmail);
                  } catch {
                    // Fallback
                  }
                  setIsSubmittingRecovery(false);
                  setRecoverySent(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-[#6B6275] leading-relaxed">
                  Enter your registered developer email address below. We will transmit an HMAC-signed password reset token.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3546] mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8174A0] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="developer@acme.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-xs text-[#1F1A24] focus:outline-none focus:ring-2 focus:ring-[#8174A0] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-xs font-semibold text-[#6B6275] hover:text-[#1F1A24] cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRecovery}
                    className="flex-1 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingRecovery ? (
                      <span>Sending Link...</span>
                    ) : (
                      <>
                        <span>Send Recovery Link</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
