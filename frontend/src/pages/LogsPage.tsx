import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Download,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'playwright';
  source: 'runner' | 'playwright' | 'wispr' | 'scrubber';
  message: string;
  details?: string;
  exitCode?: number;
}

interface LogsPageProps {
  onNavigateToSandbox?: () => void;
  onNavigateToStudio?: () => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({ onNavigateToSandbox, onNavigateToStudio }) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'playwright'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>('log-1');

  const initialLogs: LogEntry[] = [
    {
      id: 'log-1',
      timestamp: '17:28:44.102',
      level: 'error',
      source: 'playwright',
      message: 'Assertion failed: expected [role="alert"] to be visible within 5000ms',
      details: `Error: Timed out 5000ms waiting for expect(locator).toBeVisible()\n  Locator: getByRole('alert')\n  Expected: visible\n  Received: <element(s) not found>\n  Call log:\n    - expect.toBeVisible with timeout 5000ms\n    - waiting for getByRole('alert')\n    at tests/repro-buggy.spec.ts:24:48\n    Process exited with Code 1 (Reproduced)`,
      exitCode: 1,
    },
    {
      id: 'log-2',
      timestamp: '17:28:41.890',
      level: 'playwright',
      source: 'playwright',
      message: 'Running 1 test using 1 worker on msedge (Headless)',
      details: 'Browser context launched: Microsoft Edge 131.0.2903.86 (PID 28412)\nViewport: 1280x720\nTracing enabled: screenshots, snapshots, sources',
    },
    {
      id: 'log-3',
      timestamp: '17:28:40.450',
      level: 'info',
      source: 'runner',
      message: 'POST /api/run-playwright received with payload { buildMode: "buggy" }',
      details: 'Spawning child process: node scripts/run-playwright-exec.cjs buggy\nWorking directory: c:/Users/mustafa/Desktop/REPROX',
    },
    {
      id: 'log-4',
      timestamp: '17:27:12.330',
      level: 'info',
      source: 'playwright',
      message: 'Test run verified cleanly against fixed build (v1.0.5)',
      details: '7 passed in 6.9s\n  ✓ fill client name "Acme Global Ltd"\n  ✓ fill invoice amount "4850.00"\n  ✓ leave GSTIN empty\n  ✓ click Generate & Dispatch Invoice\n  ✓ assert GSTIN required alert is visible\n  ✓ assert submit button disabled during validation\n  ✓ snapshot matches expected UI state\nProcess exited with Code 0 (Fixed & Verified)',
      exitCode: 0,
    },
    {
      id: 'log-5',
      timestamp: '17:26:05.118',
      level: 'info',
      source: 'scrubber',
      message: 'Zero-Trust Scrubber redacted input token from DOM recording event',
      details: 'Matched pattern: Bearer JWT / PAN credit card\nMasked string: [REDACTED_CREDENTIAL_SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855]',
    },
    {
      id: 'log-6',
      timestamp: '17:25:30.904',
      level: 'info',
      source: 'wispr',
      message: 'Wispr Flow speech recognized: "Customer Acme Corp tries submitting an invoice for $4,850 without GST..."',
      details: 'Acoustic latency: 142ms\nEntities detected: { client: "Acme Corp", amount: "4850", missingField: "gstin" }\nConfidence score: 0.984',
    },
    {
      id: 'log-7',
      timestamp: '17:24:10.021',
      level: 'warn',
      source: 'runner',
      message: 'Orphaned node worker PID 22272 detected on port 3000; recycled cleanly',
      details: 'Process gracefully terminated via Stop-Process to prevent port conflict increment.',
    },
  ];

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false;
    if (
      searchQuery &&
      !log.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reprox-execution-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelBadge = (level: LogEntry['level'], exitCode?: number) => {
    if (level === 'error' || exitCode === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FBF0F3] text-[#D9534F] border border-[#EFB6C8]">
          <XCircle className="w-3 h-3 text-[#D9534F]" />
          <span>ERROR (Exit 1)</span>
        </span>
      );
    }
    if (exitCode === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]">
          <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
          <span>PASSED (Exit 0)</span>
        </span>
      );
    }
    if (level === 'warn') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF9E6] text-[#B78103] border border-[#FFE082]">
          <AlertTriangle className="w-3 h-3 text-[#B78103]" />
          <span>WARN</span>
        </span>
      );
    }
    if (level === 'playwright') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F4F1F8] text-[#8174A0] border border-[#A888B5]">
          <Terminal className="w-3 h-3 text-[#8174A0]" />
          <span>PLAYWRIGHT</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF7F2] text-[#6B6275] border border-[#EBE7DF]">
        <Clock className="w-3 h-3 text-[#6B6275]" />
        <span>INFO</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EBE7DF]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EBE7DF] text-[11px] font-bold text-[#8174A0] mb-2">
            <Terminal className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>DIAGNOSTICS &amp; AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1A24]">
            Execution Logs &amp; Trace Viewer
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6275] mt-1">
            Real-time stdout/stderr streams, genuine Playwright child process outputs, and zero-trust privacy audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-2 ${
              isLiveStreaming
                ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
                : 'bg-[#FFFDF9] text-[#6B6275] border-[#EBE7DF]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-[#2E7D32] animate-pulse' : 'bg-gray-400'}`} />
            <span>{isLiveStreaming ? 'Live Stream On' : 'Paused'}</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="px-3 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#F3EFE6] text-[#1F1A24] border border-[#EBE7DF] text-xs font-semibold shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            title="Export JSON Logs"
          >
            <Download className="w-3.5 h-3.5 text-[#8174A0]" />
            <span>Export</span>
          </button>

          <button
            onClick={handleClearLogs}
            className="px-3 py-2 rounded-xl bg-[#FFFDF9] hover:bg-[#FBF0F3] text-[#D9534F] border border-[#EBE7DF] hover:border-[#EFB6C8] text-xs font-semibold shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8174A0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs, selectors, exit codes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] text-xs text-[#1F1A24] placeholder-[#8174A0]/60 focus:outline-none focus:border-[#8174A0]"
          />
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'info', 'playwright', 'warn', 'error'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                filterLevel === level
                  ? 'bg-[#8174A0] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#EBE7DF]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / Stream View */}
      <div className="bg-[#FFFDF9] border border-[#EBE7DF] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 bg-[#FAF7F2] border-b border-[#EBE7DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#8174A0]" />
            <span className="text-xs font-bold text-[#1F1A24] uppercase tracking-wider">
              Process Output ({filteredLogs.length} events)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6B6275]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D9534F]" /> 1 Buggy Failed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" /> 1 Fixed Verified
            </span>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Terminal className="w-8 h-8 text-[#8174A0]/40 mx-auto" />
            <p className="text-sm font-semibold text-[#1F1A24]">No log entries found</p>
            <p className="text-xs text-[#6B6275]">
              Run a test in the Sandbox or Test Studio to populate live execution events.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EBE7DF]">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div key={log.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="font-mono text-[11px] text-[#8174A0] shrink-0 pt-0.5 sm:pt-0">
                        {log.timestamp}
                      </span>
                      {getLevelBadge(log.level, log.exitCode)}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF7F2] text-[#6B6275] border border-[#EBE7DF]">
                        {log.source}
                      </span>
                      <span className="text-xs font-semibold text-[#1F1A24] break-all">
                        {log.message}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 text-[#8174A0] transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Trace / Stdout Details */}
                  {isExpanded && log.details && (
                    <div className="px-4 pb-4 pt-1 bg-[#1F1A24] text-[#FAF7F2] font-mono text-xs overflow-x-auto rounded-b-xl mx-4 mb-4 border border-black/20">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                        <span className="text-[10px] text-[#A888B5] uppercase font-bold tracking-wider">
                          Telemetry Inspector &amp; Call Stack
                        </span>
                        <div className="flex items-center gap-3">
                          {onNavigateToStudio && (
                            <button
                              onClick={onNavigateToStudio}
                              className="text-[11px] text-[#FFD2A0] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Open in Test Studio</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                          {onNavigateToSandbox && (
                            <button
                              onClick={onNavigateToSandbox}
                              className="text-[11px] text-[#EFB6C8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Launch Sandbox</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed text-[#FFD2A0]/90 text-[11px]">
                        {log.details}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Footer Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF7F2] to-[#FFFDF9] border border-[#EBE7DF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-[#1F1A24]">
            Want to execute a regression test against both builds?
          </h3>
          <p className="text-xs text-[#6B6275]">
            Launch the Commercial Invoice Sandbox to observe genuine Exit Code 1 (failure) and Exit Code 0 (fix).
          </p>
        </div>
        {onNavigateToSandbox && (
          <button
            onClick={onNavigateToSandbox}
            className="px-5 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Dual Sandbox</span>
          </button>
        )}
      </div>
    </div>
  );
};
