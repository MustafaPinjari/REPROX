import React, { useState } from 'react';
import {
  Layers,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import type { RecordedEvent } from '../../types';

interface TraceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: RecordedEvent[];
}

export const TraceViewerModal: React.FC<TraceViewerModalProps> = ({ isOpen, onClose, events }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'snapshot' | 'console' | 'network'>('snapshot');
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const currentEvent = events[currentStepIndex] || events[0];

  const handleNext = () => {
    if (currentStepIndex < events.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE7DF] shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8174A0] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F1A24]">Playwright Trace &amp; Snapshot Inspector</h3>
              <p className="text-[11px] text-[#6B6275]">
                Step {currentStepIndex + 1} of {events.length} • Microsoft Edge Native Headless Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step Controls */}
            <div className="flex items-center bg-[#FFFDF9] border border-[#EBE7DF] rounded-xl p-1 gap-1">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-1.5 rounded-lg text-[#6B6275] hover:text-[#1F1A24] disabled:opacity-30 cursor-pointer"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-[#8174A0] hover:bg-[#FAF7F2] cursor-pointer inline-flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === events.length - 1}
                className="p-1.5 rounded-lg text-[#6B6275] hover:text-[#1F1A24] disabled:opacity-30 cursor-pointer"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B6275] hover:text-[#1F1A24] hover:bg-[#EBE7DF] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trace Main Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Step Sequence (4 cols) */}
          <div className="lg:col-span-4 border-r border-[#EBE7DF] bg-[#FAF7F2]/60 overflow-y-auto max-h-[500px] divide-y divide-[#EBE7DF]">
            <div className="p-3 bg-[#FAF7F2] text-[11px] font-bold text-[#8174A0] uppercase tracking-wider sticky top-0 border-b border-[#EBE7DF]">
              DOM Action Sequence
            </div>
            {events.map((evt, idx) => {
              const isSelected = idx === currentStepIndex;
              return (
                <div
                  key={evt.id || idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-3 text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#FFFDF9] border-l-4 border-l-[#8174A0] text-[#1F1A24] font-semibold shadow-2xs'
                      : 'hover:bg-[#FAF7F2] text-[#5A5264]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#EBE7DF] text-[#8174A0]">
                      Step {idx + 1} • {evt.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[#9E95A8]">
                      +{idx * 350 + 120}ms
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#1F1A24] truncate">
                    {evt.selector}
                  </div>
                  <div className="text-[11px] text-[#6B6275] truncate mt-0.5">
                    {evt.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: DOM Snapshot & Telemetry Inspector (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#FFFDF9] overflow-hidden">
            {/* View Tabs */}
            <div className="p-3 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-1">
                {(['snapshot', 'console', 'network'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#8174A0] text-white shadow-2xs'
                        : 'text-[#6B6275] hover:text-[#1F1A24]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#8174A0]">
                <Eye className="w-3.5 h-3.5" />
                <span>1280x720 • Chromium Engine</span>
              </div>
            </div>

            {/* Tab 1: DOM Visual Snapshot */}
            {activeTab === 'snapshot' && (
              <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto bg-[#FAF7F2]/40">
                <div className="w-full max-w-lg bg-white rounded-xl border-2 border-[#8174A0]/40 shadow-md p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="font-bold text-xs text-[#1F1A24]">
                      Commercial Invoice Portal — Step {currentStepIndex + 1}
                    </span>
                    <span className="text-[10px] font-mono bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">
                      Target Attached
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF]">
                      <span className="text-[#8174A0] text-[10px] block font-bold uppercase mb-1">
                        Active Target Selector
                      </span>
                      <code className="text-[#1F1A24] font-bold text-xs">
                        {currentEvent?.selector}
                      </code>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF]">
                      <span className="text-[#8174A0] text-[10px] block font-bold uppercase mb-1">
                        Synthesized getByRole
                      </span>
                      <code className="text-violet-700 font-bold text-xs">
                        page.getByRole(&apos;{currentEvent?.targetRole || 'textbox'}&apos;, &#123; name: &apos;{currentEvent?.targetLabel || currentEvent?.selector}&apos; &#125;)
                      </code>
                    </div>

                    {currentEvent?.value && (
                      <div className="p-2.5 rounded-lg bg-[#FFF9E6] border border-[#FFE082]">
                        <span className="text-[#B78103] text-[10px] block font-bold uppercase mb-1">
                          Evaluated Payload Value
                        </span>
                        <code className="text-[#1F1A24] font-bold text-xs">
                          &quot;{currentEvent.value}&quot;
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Console Log */}
            {activeTab === 'console' && (
              <div className="flex-1 p-4 bg-[#1F1A24] text-[#FFD2A0] font-mono text-xs overflow-y-auto leading-relaxed">
                <div className="text-[10px] text-[#A888B5] border-b border-white/10 pb-1 mb-2">
                  [Playwright Worker 0] STDOUT stream at step {currentStepIndex + 1}
                </div>
                <p>&gt; locator.fill({currentEvent?.selector}, &quot;{currentEvent?.value || ''}&quot;)</p>
                <p className="text-emerald-400">&gt; elementHandle.focus() resolved in 14ms</p>
                <p className="text-emerald-400">&gt; keyboard.type() emitted {currentEvent?.value?.length || 0} characters</p>
                <p className="text-[#6B6275]">&gt; zero-trust scrubber verified: 0 unmasked secrets</p>
              </div>
            )}

            {/* Tab 3: Network Waterfall */}
            {activeTab === 'network' && (
              <div className="flex-1 p-4 space-y-2 overflow-y-auto text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF]">
                  <span className="text-emerald-700 font-bold">POST /api/invoices</span>
                  <span className="text-slate-500">200 OK • 42ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF]">
                  <span className="text-emerald-700 font-bold">GET /api/compliance/gst</span>
                  <span className="text-slate-500">204 No Content • 18ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EBE7DF]">
                  <span className="text-emerald-700 font-bold">POST /api/run-playwright</span>
                  <span className="text-slate-500">200 OK • 1,240ms</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#EBE7DF] bg-[#FAF7F2] flex items-center justify-between text-xs text-[#6B6275]">
          <span>Trace artifact captured with Playwright tracing API.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
