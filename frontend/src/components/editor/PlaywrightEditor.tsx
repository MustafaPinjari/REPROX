import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, RefreshCw, FileCode } from 'lucide-react';

interface PlaywrightEditorProps {
  code: string;
  onRegenerateCode?: () => void;
  specFilename?: string;
}

export const PlaywrightEditor: React.FC<PlaywrightEditorProps> = ({
  code,
  onRegenerateCode,
  specFilename = 'tests/repro-scenario.spec.ts',
}) => {
  const [copied, setCopied] = useState(false);

  const cleanFilename = specFilename.includes('/') ? specFilename.split('/').pop()! : specFilename;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSpecFile = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/typescript' });
    element.href = URL.createObjectURL(file);
    element.download = cleanFilename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const lines = code.split('\n');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col h-full">
      {/* Editor Tab Bar */}
      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-violet-600" />
          <span className="text-xs font-mono font-extrabold text-slate-900">
            {specFilename.startsWith('tests/') ? specFilename : `tests/${cleanFilename}`}
          </span>
          <span className="text-[10px] font-mono bg-violet-100 text-violet-800 border border-violet-200 px-2 py-0.5 rounded-full font-bold">
            Playwright v1.49 Spec
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onRegenerateCode && (
            <button
              type="button"
              onClick={onRegenerateCode}
              title="Regenerate from timeline"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-lg transition text-xs flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={copyToClipboard}
            className="px-2.5 py-1 text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition text-xs flex items-center gap-1.5 font-mono font-bold shadow-xs"
            title="Copy Spec to Clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={downloadSpecFile}
            className="px-2.5 py-1 text-violet-800 hover:text-violet-950 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition text-xs flex items-center gap-1.5 font-mono font-bold shadow-xs"
            title="Download .spec.ts"
          >
            <Download className="w-3.5 h-3.5 text-violet-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Code Viewer (GitHub/Linear Light Style) */}
      <div className="flex-1 bg-slate-50/70 p-4 font-mono text-xs overflow-y-auto leading-relaxed select-text border-b border-slate-200/80">
        <div className="table w-full">
          {lines.map((line, i) => (
            <div key={i} className="table-row hover:bg-violet-50/50 transition-colors">
              <span className="table-cell select-none pr-4 text-right text-slate-400 font-mono text-[11px] w-8">
                {i + 1}
              </span>
              <span className="table-cell whitespace-pre font-mono text-slate-900 font-medium">
                {line.startsWith('//') ? (
                  <span className="text-slate-400 italic">{line}</span>
                ) : line.includes('import ') ? (
                  <span className="text-purple-700 font-bold">{line}</span>
                ) : line.includes('test(') || line.includes('test.describe(') ? (
                  <span className="text-blue-700 font-bold">{line}</span>
                ) : line.includes('expect(') ? (
                  <span className="text-amber-800 font-bold">{line}</span>
                ) : line.includes('page.') ? (
                  <span className="text-slate-900 font-semibold">{line}</span>
                ) : (
                  line
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Command Helper Footer */}
      <div className="px-4 py-2.5 bg-slate-100/80 text-xs flex items-center justify-between text-slate-600 font-mono">
        <span className="flex items-center gap-2 truncate">
          <Terminal className="w-4 h-4 text-violet-600 shrink-0" />
          <span className="text-slate-800 font-bold">npx playwright test tests/{cleanFilename}</span>
        </span>
        <span className="text-emerald-700 font-extrabold text-[11px] shrink-0">
          GENUINE PLAYWRIGHT CLI
        </span>
      </div>
    </div>
  );
};
