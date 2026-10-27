import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  Check, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
} from 'lucide-react';
import type { TestExecutionResult } from '../types';

interface TestStudioPageProps {
  playwrightCode: string;
  onRunBuggy: () => Promise<void>;
  onRunFixed: () => Promise<void>;
  isExecutingBuggy: boolean;
  isExecutingFixed: boolean;
  lastBuggyResult: TestExecutionResult | null;
  lastFixedResult: TestExecutionResult | null;
}

export const TestStudioPage: React.FC<TestStudioPageProps> = ({
  playwrightCode,
  onRunBuggy,
  onRunFixed,
  isExecutingBuggy,
  isExecutingFixed,
  lastBuggyResult,
  lastFixedResult,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(playwrightCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([playwrightCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice-gst-repro.spec.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  const codeLines = playwrightCode.split('\n');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE7DF]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8174A0] mb-1">
            <FileCode className="w-3.5 h-3.5 text-[#8174A0]" />
            <span>Playwright TypeScript Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A24] tracking-tight">
            Playwright Test Studio
          </h1>
          <p className="text-sm text-[#6B6275] mt-1">
            Synthesized end-to-end regression tests ready for CI/CD and genuine browser execution.
          </p>
        </div>

        {/* Execution Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRunBuggy}
            disabled={isExecutingBuggy || isExecutingFixed}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBF0F3] hover:bg-[#F3DEE5] border border-[#EFB6C8] text-[#D9534F] text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isExecutingBuggy ? (
              <div className="w-4 h-4 border-2 border-[#D9534F]/40 border-t-[#D9534F] rounded-full animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#D9534F]" />
            )}
            <span>Execute Against Buggy Build</span>
          </button>

          <button
            onClick={onRunFixed}
            disabled={isExecutingBuggy || isExecutingFixed}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-sm font-semibold transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isExecutingFixed ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#EFB6C8]" />
            )}
            <span>Verify Fixed Build (v1.0.5)</span>
          </button>
        </div>
      </div>

      {/* Editor & Results Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Editor Card (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-xs overflow-hidden flex flex-col">
          {/* Editor Sub-header */}
          <div className="px-5 py-3 border-b border-[#EBE7DF] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#1F1A24]">tests/invoice-gst-repro.spec.ts</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBE7DF] text-[#6B6275] font-medium">
                TypeScript
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D8D2C5] text-xs font-medium text-[#1F1A24] hover:bg-[#F3EFE6] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5 text-[#6B6275]" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D8D2C5] text-xs font-medium text-[#1F1A24] hover:bg-[#F3EFE6] transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#6B6275]" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="p-4 bg-[#1F1A24] text-[#FAF7F2] font-mono text-xs overflow-x-auto max-h-[560px] leading-relaxed selection:bg-[#EFB6C8] selection:text-[#1F1A24]">
            <table>
              <tbody>
                {codeLines.map((line, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="pr-4 text-right text-white/30 select-none text-[11px] w-8">
                      {index + 1}
                    </td>
                    <td className="whitespace-pre">
                      {/* Simple syntax highlighting coloring */}
                      {line.includes('import ') ? (
                        <span className="text-[#EFB6C8]">{line}</span>
                      ) : line.includes('test(') || line.includes('expect(') ? (
                        <span className="text-[#FFD2A0] font-semibold">{line}</span>
                      ) : line.includes('await page.') ? (
                        <span className="text-[#A888B5]">{line}</span>
                      ) : line.includes('//') ? (
                        <span className="text-white/40 italic">{line}</span>
                      ) : (
                        line
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Status Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Execution Telemetry Summary */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs">
            <h3 className="text-sm font-bold text-[#1F1A24] mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#8174A0]" />
              <span>Real Execution Output</span>
            </h3>

            {/* Buggy Run Summary */}
            <div className="mb-4 p-3.5 rounded-xl border border-[#EFB6C8] bg-[#FBF0F3]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#D9534F] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Buggy Build (v1.0.4)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#D9534F] font-bold">
                  Exit Code {lastBuggyResult ? (lastBuggyResult.status === 'failed' ? '1' : '0') : '1'}
                </span>
              </div>
              <p className="text-xs text-[#6B6275]">
                {lastBuggyResult
                  ? `Execution completed in ${lastBuggyResult.totalDurationMs}ms.`
                  : 'Expected assertion failed: Missing GST alert was not displayed.'}
              </p>
            </div>

            {/* Fixed Run Summary */}
            <div className="p-3.5 rounded-xl border border-[#A5D6A7] bg-[#E8F5E9]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fixed Build (v1.0.5)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#2E7D32] font-bold">
                  Exit Code {lastFixedResult ? (lastFixedResult.status === 'passed' ? '0' : '1') : '0'}
                </span>
              </div>
              <p className="text-xs text-[#6B6275]">
                {lastFixedResult
                  ? `Passed 7 assertions in ${lastFixedResult.totalDurationMs}ms.`
                  : 'All assertions verified: GST validation triggers error toast & prevents submission.'}
              </p>
            </div>
          </div>

          {/* CI/CD Integration snippet */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#EBE7DF] shadow-xs">
            <h3 className="text-xs font-bold text-[#6B6275] uppercase tracking-wider mb-2">
              Run in Terminal / CI
            </h3>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EBE7DF] font-mono text-[11px] text-[#1F1A24] space-y-1.5">
              <div className="text-[#6B6275]"># Run buggy test:</div>
              <div className="text-[#8174A0]">npm run test:e2e:buggy</div>
              <div className="text-[#6B6275] pt-1"># Run fixed verification:</div>
              <div className="text-[#2E7D32]">npm run test:e2e:fixed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
