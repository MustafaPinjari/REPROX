import { useState, useCallback, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { NewIncidentPage } from './pages/NewIncidentPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { TestStudioPage } from './pages/TestStudioPage';
import { LogsPage } from './pages/LogsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { StoryPage } from './pages/StoryPage';
import { BlogPage } from './pages/BlogPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { DocsPage } from './pages/DocsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AppShell, type AppSection } from './components/layout/AppShell';
import type { BuildMode, RecordedEvent, TestExecutionResult, VoiceBugReport } from './types';
import { generatePlaywrightTestScript } from './services/playwrightGenerator';
import { executePlaywrightTest } from './services/testRunner';
import { parseWisprVoiceIntent } from './services/voiceDictationEngine';
import { sanitizeInputValue } from './services/privacyScrubber';

export type AppView =
  | 'landing'
  | 'auth'
  | 'app'
  | 'story'
  | 'blog'
  | 'careers'
  | 'contact'
  | 'docs'
  | 'changelog'
  | '404';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const v = p.get('view');
      if (
        v === 'auth' ||
        v === 'story' ||
        v === 'blog' ||
        v === 'careers' ||
        v === 'contact' ||
        v === 'docs' ||
        v === 'changelog' ||
        v === '404'
      ) {
        return v;
      }
      if (v === 'app' || p.get('mode') === 'buggy' || p.get('mode') === 'fixed') {
        return 'app';
      }
    }
    return 'landing';
  });

  const [currentSection, setCurrentSection] = useState<AppSection>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === 'buggy' || p.get('mode') === 'fixed') {
        return 'incidents';
      }
    }
    return 'home';
  });

  const [userEmail, setUserEmail] = useState<string>('mustafa@example.com');

  const [buildMode, setBuildMode] = useState<BuildMode>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('mode');
      if (p === 'fixed' || p === 'buggy') return p;
    }
    return 'buggy';
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isExecutingBuggy, setIsExecutingBuggy] = useState(false);
  const [isExecutingFixed, setIsExecutingFixed] = useState(false);

  const navigateToView = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'landing') {
        url.searchParams.delete('view');
        url.searchParams.delete('mode');
      } else {
        url.searchParams.set('view', view);
      }
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const p = new URLSearchParams(window.location.search);
      const v = p.get('view') as AppView | null;
      if (v) {
        setCurrentView(v);
      } else if (p.get('mode')) {
        setCurrentView('app');
        setCurrentSection('incidents');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateToApp = () => navigateToView('app');
  const handleNavigateToAuth = () => navigateToView('auth');
  const handleNavigateToLanding = () => navigateToView('landing');

  const handleSignInSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentSection('home');
    navigateToView('app');
  };

  // Initial Voice Report
  const [voiceReport, setVoiceReport] = useState<VoiceBugReport>({
    id: 'VOICE-INIT-104',
    timestamp: Date.now() - 360000,
    rawTranscript:
      'Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number. The app mistakenly shows an invoice created toast instead of validating the GSTIN field.',
    dictationSource: 'wispr-flow',
    detectedIntent: parseWisprVoiceIntent(
      'Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number. The app mistakenly shows an invoice created toast instead of validating the GSTIN field.'
    ),
    isListening: false,
  });

  // Initial timeline events capturing the invoice GST scenario
  const [events, setEvents] = useState<RecordedEvent[]>([
    {
      id: 'EVT-1',
      timestamp: Date.now() - 120000,
      type: 'fill',
      selector: '#clientName',
      targetLabel: 'Client Business Name',
      targetTestId: 'input-client-name',
      targetRole: 'textbox',
      value: 'Acme Global Ltd',
      description: 'Entered client name: "Acme Global Ltd"',
      isPiiMasked: false,
    },
    {
      id: 'EVT-2',
      timestamp: Date.now() - 95000,
      type: 'fill',
      selector: '#invoiceAmount',
      targetLabel: 'Invoice Total (USD)',
      targetTestId: 'input-amount',
      targetRole: 'textbox',
      value: '4850.00',
      description: 'Entered total amount: "$4850.00"',
      isPiiMasked: false,
    },
    {
      id: 'EVT-3',
      timestamp: Date.now() - 70000,
      type: 'fill',
      selector: '#gstinNumber',
      targetLabel: 'GST Identification Number (GSTIN)',
      targetTestId: 'input-gstin',
      targetRole: 'textbox',
      value: '',
      description: 'Left GSTIN input empty (bypassing statutory requirement)',
      isPiiMasked: false,
    },
    {
      id: 'EVT-4',
      timestamp: Date.now() - 45000,
      type: 'click',
      selector: '#dispatchInvoiceBtn',
      targetRole: 'button',
      targetLabel: 'Generate & Dispatch Invoice',
      targetTestId: 'btn-dispatch-invoice',
      description: 'Clicked "Generate & Dispatch Invoice"',
      isPiiMasked: false,
    },
    {
      id: 'EVT-5',
      timestamp: Date.now() - 30000,
      type: 'assert',
      selector: '[role="alert"]',
      targetRole: 'alert',
      value: 'GSTIN is required for commercial invoices.',
      description: 'Validation assert: GSTIN required alert must be visible',
      isPiiMasked: false,
    },
  ]);

  // Generated Playwright code state
  const [generatedCode, setGeneratedCode] = useState<string>(() =>
    generatePlaywrightTestScript(events)
  );

  // Execution results
  const [buggyResult, setBuggyResult] = useState<TestExecutionResult | undefined>(undefined);
  const [fixedResult, setFixedResult] = useState<TestExecutionResult | undefined>(undefined);

  // Synchronize generated code when timeline events update
  const handleEventsChange = useCallback((newEvents: RecordedEvent[]) => {
    setEvents(newEvents);
    const code = generatePlaywrightTestScript(newEvents);
    setGeneratedCode(code);
  }, []);

  // Add recorded event with automatic zero-trust privacy scrubber
  const handleRecordEvent = useCallback(
    (eventData: Omit<RecordedEvent, 'id' | 'timestamp' | 'isPiiMasked'>) => {
      const sanitized = eventData.value
        ? sanitizeInputValue(eventData.value, {
            inputId: eventData.selector,
            inputName: eventData.targetLabel,
          })
        : { value: '', isMasked: false };

      const newEvent: RecordedEvent = {
        ...eventData,
        id: `EVT-${Date.now()}`,
        timestamp: Date.now(),
        value: sanitized.value,
        isPiiMasked: sanitized.isMasked,
      };

      const updated = [...events, newEvent];
      handleEventsChange(updated);
    },
    [events, handleEventsChange]
  );

  // Voice bug dictation receiver
  const handleVoiceReportReceived = useCallback(
    (report: VoiceBugReport) => {
      setVoiceReport(report);
      if (report.detectedIntent?.feature?.includes('invoice') || report.detectedIntent?.feature === 'invoice-gstin') {
        handleRecordEvent({
          type: 'assert',
          selector: '[role="alert"]',
          targetRole: 'alert',
          value: 'GSTIN is required for commercial invoices.',
          description: 'Assertion: GST validation alert must be displayed',
        });
      }
    },
    [handleRecordEvent]
  );

  // Execute test against buggy build (v1.0.4)
  const runBuggyTest = async () => {
    setIsExecutingBuggy(true);
    try {
      const result = await executePlaywrightTest({ buildMode: 'buggy' });
      setBuggyResult(result);
    } catch (err) {
      console.error('Execution against buggy build failed to trigger:', err);
    } finally {
      setIsExecutingBuggy(false);
    }
  };

  // Execute test against fixed build (v1.0.5)
  const runFixedTest = async () => {
    setIsExecutingFixed(true);
    try {
      const result = await executePlaywrightTest({ buildMode: 'fixed' });
      setFixedResult(result);
    } catch (err) {
      console.error('Execution against fixed build failed to trigger:', err);
    } finally {
      setIsExecutingFixed(false);
    }
  };

  // Explicit code regeneration handler
  const handleRegenerateCode = () => {
    const code = generatePlaywrightTestScript(events);
    setGeneratedCode(code);
  };

  // 1. Landing View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigateToApp={handleNavigateToApp}
        onNavigateToAuth={handleNavigateToAuth}
        onNavigateToStory={() => navigateToView('story')}
        onNavigateToBlog={() => navigateToView('blog')}
        onNavigateToCareers={() => navigateToView('careers')}
        onNavigateToContact={() => navigateToView('contact')}
        onNavigateToDocs={() => navigateToView('docs')}
        onNavigateToChangelog={() => navigateToView('changelog')}
      />
    );
  }

  // 2. Authentication View (matching user reference image)
  if (currentView === 'auth') {
    return (
      <AuthPage
        onSignInSuccess={handleSignInSuccess}
        onBackToLanding={handleNavigateToLanding}
      />
    );
  }

  // 3. Marketing & Content Pages
  if (currentView === 'story') {
    return (
      <StoryPage
        onBack={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  if (currentView === 'blog') {
    return (
      <BlogPage
        onBack={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  if (currentView === 'careers') {
    return (
      <CareersPage
        onBack={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  if (currentView === 'contact') {
    return (
      <ContactPage
        onBack={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  if (currentView === 'docs') {
    return (
      <DocsPage
        onBack={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  if (currentView === 'changelog') {
    return (
      <ChangelogPage
        onBack={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  if (currentView === '404') {
    return (
      <NotFoundPage
        onBackToLanding={handleNavigateToLanding}
        onNavigateToApp={handleNavigateToApp}
      />
    );
  }

  // 4. Application Shell View
  return (
    <AppShell
      currentSection={currentSection}
      onNavigateSection={setCurrentSection}
      onNavigateToLanding={handleNavigateToLanding}
      onNavigateToAuth={handleNavigateToAuth}
      userEmail={userEmail}
    >
      {/* Sub-page 1: Home Dashboard */}
      {currentSection === 'home' && (
        <HomePage
          onNavigateToIncidents={() => setCurrentSection('incidents')}
          onNavigateToNewIncident={() => setCurrentSection('new-incident')}
          onNavigateToTestStudio={() => setCurrentSection('test-studio')}
        />
      )}

      {/* Sub-page 2: New Incident Dictation */}
      {currentSection === 'new-incident' && (
        <NewIncidentPage
          voiceReport={voiceReport}
          onUpdateVoiceReport={setVoiceReport}
          onLaunchSandbox={() => setCurrentSection('incidents')}
        />
      )}

      {/* Sub-page 3: Incidents & Interactive Invoice Sandbox */}
      {currentSection === 'incidents' && (
        <IncidentsPage
          onNavigateToNewIncident={() => setCurrentSection('new-incident')}
          buildMode={buildMode}
          onBuildModeChange={(m: BuildMode) => {
            setBuildMode(m);
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.set('mode', m);
              window.history.replaceState({}, '', url.toString());
            }
          }}
          events={events}
          onRecordEvent={handleRecordEvent}
          onToggleRecording={() => setIsRecording((prev) => !prev)}
          onClearTimeline={() => setEvents([])}
          isRecording={isRecording}
          generatedCode={generatedCode}
          onRegenerateCode={handleRegenerateCode}
          buggyResult={buggyResult}
          fixedResult={fixedResult}
          onRunBuggy={runBuggyTest}
          onRunFixed={runFixedTest}
          isExecutingBuggy={isExecutingBuggy}
          isExecutingFixed={isExecutingFixed}
          voiceReport={voiceReport}
          onVoiceReportReceived={handleVoiceReportReceived}
        />
      )}

      {/* Sub-page 4: Test Studio */}
      {currentSection === 'test-studio' && (
        <TestStudioPage
          playwrightCode={generatedCode}
          onRunBuggy={runBuggyTest}
          onRunFixed={runFixedTest}
          isExecutingBuggy={isExecutingBuggy}
          isExecutingFixed={isExecutingFixed}
          lastBuggyResult={buggyResult || null}
          lastFixedResult={fixedResult || null}
        />
      )}

      {/* Sub-page 5: Execution Logs */}
      {currentSection === 'logs' && (
        <LogsPage
          onNavigateToSandbox={() => setCurrentSection('incidents')}
          onNavigateToStudio={() => setCurrentSection('test-studio')}
        />
      )}

      {/* Sub-page 6: Integrations */}
      {currentSection === 'integrations' && <IntegrationsPage />}

      {/* Sub-page 7: Settings */}
      {currentSection === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

export default App;
