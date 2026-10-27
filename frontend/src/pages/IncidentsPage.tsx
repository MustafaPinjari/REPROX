import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Search, 
  ChevronRight, 
  Plus, 
  Calendar, 
  MoreHorizontal, 
  ArrowLeft,
  Sparkles,
  Download,
  Layers,
  Play,
} from 'lucide-react';
import type { BuildMode, RecordedEvent, TestExecutionResult, VoiceBugReport } from '../types';
import { WisprFlowBar } from '../components/voice/WisprFlowBar';
import { InvoiceAppSandbox } from '../components/sandbox/InvoiceAppSandbox';
import { InteractionTimeline } from '../components/timeline/InteractionTimeline';
import { PlaywrightEditor } from '../components/editor/PlaywrightEditor';
import { ExecutionResults } from '../components/execution/ExecutionResults';
import { IncidentReportModal } from '../components/modals/IncidentReportModal';
import { TraceViewerModal } from '../components/modals/TraceViewerModal';
import { fetchIncidentsApi } from '../services/apiClient';

interface IncidentsPageProps {
  onNavigateToNewIncident: () => void;
  buildMode: BuildMode;
  onBuildModeChange: (mode: BuildMode) => void;
  events: RecordedEvent[];
  onRecordEvent: (eventData: Omit<RecordedEvent, 'id' | 'timestamp' | 'isPiiMasked'>) => void;
  onToggleRecording: () => void;
  onClearTimeline: () => void;
  isRecording: boolean;
  generatedCode: string;
  onRegenerateCode: () => void;
  buggyResult?: TestExecutionResult;
  fixedResult?: TestExecutionResult;
  onRunBuggy: () => Promise<void>;
  onRunFixed: () => Promise<void>;
  isExecutingBuggy: boolean;
  isExecutingFixed: boolean;
  voiceReport: VoiceBugReport;
  onVoiceReportReceived: (report: VoiceBugReport) => void;
  activeTab?: 'list' | 'sandbox';
  onActiveTabChange?: (tab: 'list' | 'sandbox') => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({
  onNavigateToNewIncident,
  buildMode,
  onBuildModeChange,
  events,
  onRecordEvent,
  onToggleRecording,
  onClearTimeline,
  isRecording,
  generatedCode,
  onRegenerateCode,
  buggyResult,
  fixedResult,
  onRunBuggy,
  onRunFixed,
  isExecutingBuggy,
  isExecutingFixed,
  voiceReport,
  onVoiceReportReceived,
  activeTab: controlledActiveTab,
  onActiveTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'list' | 'sandbox'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('mode') === 'fixed' || p.get('mode') === 'buggy' || p.get('tab') === 'sandbox') {
        return 'sandbox';
      }
    }
    return 'sandbox';
  });

  const activeTab = controlledActiveTab ?? internalTab;
  const setActiveTab = (tab: 'list' | 'sandbox') => {
    setInternalTab(tab);
    if (onActiveTabChange) onActiveTabChange(tab);
  };

  const [filterMode, setFilterMode] = useState<'all' | 'buggy' | 'fixed' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadRealIncidents = async () => {
      setIsLoading(true);
      const data = await fetchIncidentsApi(filterMode, searchQuery);
      if (isMounted) {
        if (data && Array.isArray(data)) {
          setIncidents(data);
        } else {
          setIncidents([]);
        }
        setIsLoading(false);
      }
    };
    loadRealIncidents();
    return () => { isMounted = false; };
  }, [filterMode, searchQuery]);

  // Construct active incident item so user always sees their spoken scenario
  const activeIncidentItem = {
    id: voiceReport.id || 'INC-104',
    title: voiceReport.detectedIntent.actionTaken || 'Voice Incident Reproduction',
    description: voiceReport.rawTranscript,
    status: buildMode,
    statusLabel: buildMode === 'buggy' ? 'Buggy (v1.0.4)' : 'Fixed (v1.0.5)',
    badgeColor: buildMode === 'buggy' ? 'bg-[#FBF0F3] text-[#C27891] border-[#EFB6C8]' : 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
    iconColor: buildMode === 'buggy' ? 'bg-[#FBF0F3] text-[#C27891] border-[#EFB6C8]' : 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
    time: 'Active Dictation',
    tags: [voiceReport.detectedIntent.feature || 'e-commerce-cart', 'playwright', 'sandbox'],
    specFile: buildMode === 'buggy' ? 'repro-buggy.spec.ts' : 'repro-fixed.spec.ts',
  };

  const filteredIncidents = incidents.length > 0 ? incidents : [activeIncidentItem];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION MATCHING SCREEN 3 REFERENCE */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EBE7DF]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8174A0] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>RECENT INCIDENTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A24] tracking-tight">
            Explore Incidents &amp; Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6275] mt-0.5">
            Review captured issues, generated tests, and verification results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-[#F3EFE6] p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-[#1F1A24] shadow-xs'
                  : 'text-[#6B6275] hover:text-[#1F1A24]'
              }`}
            >
              Incidents List
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-white text-[#1F1A24] shadow-xs'
                  : 'text-[#6B6275] hover:text-[#1F1A24]'
              }`}
            >
              Interactive Sandbox
            </button>
          </div>

          <button
            onClick={() => setShowTraceModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#EBE7DF] text-[#1F1A24] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Inspect DOM Snapshots & Action Latency"
          >
            <Layers className="w-3.5 h-3.5 text-[#8174A0]" />
            <span>Trace Viewer</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#F3EFE6] border border-[#EBE7DF] text-[#1F1A24] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Export Reproduction Document (Markdown/JSON)"
          >
            <Download className="w-3.5 h-3.5 text-[#8174A0]" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onNavigateToNewIncident}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Incident</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* VIEW A: INCIDENTS TABLE MATCHING SCREEN 3 REFERENCE */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'list' ? (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-[#FFFDF9] p-3 rounded-2xl border border-[#EBE7DF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E95A8]" />
              <input
                type="text"
                placeholder="Search incidents, modules, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#EBE7DF] bg-[#FAF7F2] text-xs text-[#1F1A24] placeholder:text-[#9E95A8] focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#8174A0] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6B6275] hover:bg-[#F3EFE6]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('buggy')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'buggy'
                    ? 'bg-[#8174A0] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6B6275] hover:bg-[#F3EFE6]'
                }`}
              >
                Buggy
              </button>
              <button
                onClick={() => setFilterMode('fixed')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'fixed'
                    ? 'bg-[#8174A0] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6B6275] hover:bg-[#F3EFE6]'
                }`}
              >
                Fixed
              </button>
              <button
                onClick={() => setFilterMode('review')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'review'
                    ? 'bg-[#8174A0] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#6B6275] hover:bg-[#F3EFE6]'
                }`}
              >
                Need Review
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6B6275] bg-[#FAF7F2] border border-[#EBE7DF] px-3 py-1 rounded-xl ml-2">
                <Calendar className="w-3.5 h-3.5 text-[#8174A0]" />
                <span>Last 7 days</span>
              </div>
            </div>
          </div>

          {/* Incident Rows List */}
          {isLoading ? (
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] p-12 text-center text-xs text-[#6B6275]">
              Loading incidents from secure API...
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="p-12 text-center bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EBE7DF] text-[#8174A0] flex items-center justify-center mx-auto mb-3">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1F1A24] mb-1">No incidents match current filter</h3>
              <p className="text-xs text-[#6B6275] max-w-sm mx-auto mb-4">
                No incidents found for search "{searchQuery}". You can return to the active reproduction sandbox or dictate a new incident.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-[#FFD2A0]" />
                  <span>Launch Reproduction Sandbox</span>
                </button>
                <button
                  onClick={onNavigateToNewIncident}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8D2C5] hover:bg-[#F3EFE6] text-[#1F1A24] text-xs font-semibold cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8174A0]" />
                  <span>+ Create Incident</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-xs overflow-hidden divide-y divide-[#EBE7DF]">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => {
                    if (inc.status === 'buggy') onBuildModeChange('buggy');
                    if (inc.status === 'fixed') onBuildModeChange('fixed');
                    setActiveTab('sandbox');
                  }}
                  className="p-4 sm:p-5 hover:bg-[#FAF7F2] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-[#D8D2C5] text-[#8174A0] accent-[#8174A0]"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Icon badge */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${inc.iconColor} group-hover:scale-105 transition-transform`}
                    >
                      {inc.status === 'buggy' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : inc.status === 'fixed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <FileCode className="w-4 h-4" />
                      )}
                    </div>

                    {/* Title & description */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#8174A0]">{inc.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${inc.badgeColor}`}>
                          {inc.statusLabel}
                        </span>
                        <span className="text-[11px] text-[#9E95A8] hidden md:inline">{inc.time}</span>
                      </div>

                      <h3 className="text-sm font-bold text-[#1F1A24] truncate group-hover:text-[#8174A0] transition-colors">
                        {inc.title}
                      </h3>
                      <p className="text-xs text-[#6B6275] truncate mt-0.5">{inc.description}</p>

                      {/* Tag badges */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {(inc.tags || []).map((t: string) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EBE7DF] text-[#6B6275] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Spec badge & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block font-mono text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF] text-[#1F1A24]">
                      {inc.specFile}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('sandbox');
                      }}
                      className="p-1 text-[#9E95A8] hover:text-[#1F1A24] cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#9E95A8] group-hover:text-[#8174A0] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────── */
        /* VIEW B: INTERACTIVE SANDBOX & PLAYWRIGHT TEST RUNNER VIEW */
        /* ─────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => setActiveTab('list')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8174A0] hover:text-[#1F1A24] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Incidents List</span>
            </button>
            <span className="text-xs text-[#6B6275]">
              Active Incident: <strong className="text-[#1F1A24]">{voiceReport.id || 'INC-104'} ({voiceReport.detectedIntent.feature || 'Application Verification'})</strong>
            </span>
          </div>

          {/* Wispr Flow Top Bar */}
          <WisprFlowBar
            activeBuildMode={buildMode}
            onVoiceReportReady={onVoiceReportReceived}
          />

          {/* Dual Column Sandbox & Test Verifier */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Target App Sandbox & Timeline */}
            <div className="xl:col-span-6 space-y-6 flex flex-col">
              <div className="h-[460px]">
                <InvoiceAppSandbox
                  buildMode={buildMode}
                  onToggleBuildMode={onBuildModeChange}
                  onRecordEvent={onRecordEvent}
                  isRecording={isRecording}
                  scenarioFeature={voiceReport.detectedIntent.feature}
                  scenarioTitle={voiceReport.detectedIntent.actionTaken}
                />
              </div>

              <div className="h-[360px]">
                <InteractionTimeline
                  events={events}
                  isRecording={isRecording}
                  onToggleRecording={onToggleRecording}
                  onClearTimeline={onClearTimeline}
                />
              </div>
            </div>

            {/* Right: Generated Playwright Editor & Real Execution Results */}
            <div className="xl:col-span-6 space-y-6 flex flex-col">
              <div className="h-[460px]">
                <PlaywrightEditor
                  code={generatedCode}
                  onRegenerateCode={onRegenerateCode}
                />
              </div>

              <div className="h-[360px]">
                <ExecutionResults
                  buggyResult={buggyResult}
                  fixedResult={fixedResult}
                  onRunBuggy={onRunBuggy}
                  onRunFixed={onRunFixed}
                  isExecutingBuggy={isExecutingBuggy}
                  isExecutingFixed={isExecutingFixed}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Reproduction Report Modal */}
      <IncidentReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        voiceReport={voiceReport}
        events={events}
        generatedCode={generatedCode}
        buggyResult={buggyResult}
        fixedResult={fixedResult}
      />

      {/* Playwright Detailed Trace & Snapshot Viewer Modal */}
      <TraceViewerModal
        isOpen={showTraceModal}
        onClose={() => setShowTraceModal(false)}
        events={events}
      />
    </div>
  );
};
