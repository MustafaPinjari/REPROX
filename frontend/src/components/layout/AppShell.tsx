import React, { useState } from 'react';
import { 
  Home, 
  PlusCircle, 
  Layers, 
  FileCode, 
  Share2, 
  Settings, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight, 
  ExternalLink,
  Menu,
  X,
  Mic,
  Terminal,
} from 'lucide-react';

export type AppSection = 'home' | 'new-incident' | 'incidents' | 'test-studio' | 'logs' | 'integrations' | 'settings';

interface NavItem {
  id: AppSection;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface AppShellProps {
  currentSection: AppSection;
  onNavigateSection: (section: AppSection) => void;
  onNavigateToLanding: () => void;
  onNavigateToAuth: () => void;
  userEmail?: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentSection,
  onNavigateSection,
  onNavigateToLanding,
  onNavigateToAuth,
  userEmail = 'mustafa@example.com',
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'new-incident', label: 'New Incident', icon: PlusCircle, badge: 'Voice' },
    { id: 'incidents', label: 'Incidents & Sandbox', icon: Layers, badge: 'Demo' },
    { id: 'test-studio', label: 'Test Studio', icon: FileCode },
    { id: 'logs', label: 'Execution Logs', icon: Terminal, badge: 'Live' },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sectionTitles: Record<AppSection, string> = {
    home: 'Home',
    'new-incident': 'New Incident',
    incidents: 'Incidents & Sandbox',
    'test-studio': 'Test Studio',
    logs: 'Execution Logs & Diagnostics',
    integrations: 'Integrations',
    settings: 'Settings',
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1A24] flex font-sans selection:bg-[#EFB6C8] selection:text-[#1F1A24]">
      {/* Left Navigation Sidebar (Desktop 260px) */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#EBE7DF] bg-[#FFFDF9] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-5">
          {/* Brand Mark */}
          <div 
            onClick={onNavigateToLanding}
            className="flex items-center gap-3 mb-8 cursor-pointer group select-none"
            title="Return to Landing Page"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFD2A0] via-[#EFB6C8] to-[#8174A0] p-0.5 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center">
                <span className="font-serif-title text-xl font-bold text-[#8174A0] leading-none">R</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base text-[#1F1A24] leading-tight group-hover:text-[#8174A0] transition-colors">
                REPROX
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#8174A0]">
                Tests That Prove
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigateSection('new-incident')}
            className="w-full mb-6 py-2.5 px-3.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#EFB6C8]" />
            <span>+ New Voice Incident</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FAF7F2] text-[#8174A0] font-semibold shadow-xs border border-[#EBE7DF]'
                      : 'text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8174A0]' : 'text-[#9E95A8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-[#EFB6C8] text-[#1F1A24]'
                          : 'bg-[#F3EFE6] text-[#6B6275]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Artwork & Profile */}
        <div className="p-4 border-t border-[#EBE7DF] space-y-3 bg-[#FAF7F2]/40">
          {/* Artwork Mini Card */}
          <div className="relative rounded-xl overflow-hidden border border-[#EBE7DF] p-3 text-white shadow-xs group">
            <img
              src="/assets/loginPage.png"
              alt="Wispr Flow"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A24]/80 via-[#1F1A24]/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold text-[#FFD2A0] tracking-wider block">
                Wispr Flow SDK
              </span>
              <p className="font-handwriting text-base font-bold text-white drop-shadow-xs">
                No hands. More progress.
              </p>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={userEmail}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#8174A0] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  M
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1F1A24] truncate">
                    Mustafa Pinjari
                  </div>
                  <div className="text-[10px] font-semibold text-[#8174A0] truncate">Pro Plan</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#9E95A8]" />
            </button>

            {/* Profile Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 bg-[#FFFDF9] border border-[#EBE7DF] rounded-xl shadow-lg z-50 text-xs">
                <button
                  onClick={onNavigateToLanding}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#1F1A24] hover:bg-[#FAF7F2] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#8174A0]" />
                  <span>Landing Page</span>
                </button>
                <button
                  onClick={onNavigateToAuth}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#D9534F] hover:bg-[#FBF0F3] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Bar */}
        <header className="h-16 border-b border-[#EBE7DF] bg-[#FFFDF9] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile menu toggle + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="flex items-center gap-2 text-xs">
              <button
                onClick={() => onNavigateSection('home')}
                className="font-medium text-[#6B6275] hover:text-[#1F1A24] transition-colors"
              >
                REPROX
              </button>
              <ChevronRight className="w-3 h-3 text-[#9E95A8]" />
              <span className="font-semibold text-[#1F1A24]">
                {sectionTitles[currentSection]}
              </span>
            </nav>
          </div>

          {/* Right: Search + Notifications + Action + Landing switcher */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E95A8]" />
              <input
                type="text"
                placeholder="Search incidents or selectors... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] text-xs text-[#1F1A24] placeholder:text-[#9E95A8] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
              />
            </div>

            {/* Notification Bell */}
            <button
              title="Notifications"
              className="p-2 rounded-xl text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#FAF7F2] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EFB6C8] ring-2 ring-[#FFFDF9]" />
            </button>

            {/* Quick Landing View link */}
            <button
              onClick={onNavigateToLanding}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] hover:bg-[#F3EFE6] text-xs font-medium text-[#6B6275] hover:text-[#1F1A24] transition-colors"
            >
              <span>Overview</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onNavigateSection('new-incident')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-[#EFB6C8]" />
              <span className="hidden sm:inline">+ New Incident</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 bg-[#FFFDF9] border-b border-[#EBE7DF] space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium ${
                  currentSection === item.id
                    ? 'bg-[#FAF7F2] text-[#8174A0] font-semibold'
                    : 'text-[#6B6275]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
