import React from 'react';
import type { RecordedEvent } from '../../types';
import { Radio, ShieldCheck, Trash2, PlayCircle, StopCircle, MousePointer, Keyboard, Bell, CheckSquare } from 'lucide-react';

interface InteractionTimelineProps {
  events: RecordedEvent[];
  isRecording: boolean;
  onToggleRecording: () => void;
  onClearTimeline: () => void;
  onSelectEvent?: (event: RecordedEvent) => void;
}

export const InteractionTimeline: React.FC<InteractionTimelineProps> = ({
  events,
  isRecording,
  onToggleRecording,
  onClearTimeline,
  onSelectEvent,
}) => {
  const getEventIcon = (type: RecordedEvent['type']) => {
    switch (type) {
      case 'click':
      case 'submit':
        return <MousePointer className="w-3.5 h-3.5 text-indigo-600" />;
      case 'fill':
        return <Keyboard className="w-3.5 h-3.5 text-amber-600" />;
      case 'toast':
        return <Bell className="w-3.5 h-3.5 text-violet-600" />;
      case 'assert':
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col h-full">
      {/* Timeline Header */}
      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-400'
            }`}
          />
          <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wide">
            INTERACTION TIMELINE ({events.length} STEPS)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleRecording}
            className={`px-3 py-1 text-xs font-mono rounded-lg flex items-center gap-1.5 font-bold transition shadow-xs ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
            }`}
          >
            {isRecording ? (
              <>
                <StopCircle className="w-3.5 h-3.5" />
                Stop Recording
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                Record Events
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClearTimeline}
            title="Clear Timeline"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Sub-header */}
      <div className="px-4 py-2 bg-emerald-50/60 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Zero-Trust Privacy Scrubber Active
        </span>
        <span className="font-mono text-[10px] text-emerald-700 uppercase tracking-wider">
          ISO/SOC2 PII Redaction
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Radio className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-600">No DOM events recorded yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Click "Record Events" or dictate with Wispr Flow to capture interactions.
            </p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id || index}
              onClick={() => onSelectEvent && onSelectEvent(event)}
              className="group bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-sm rounded-xl p-3 transition text-xs space-y-1.5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 flex items-center justify-center font-mono text-[11px] font-bold">
                    {index + 1}
                  </span>
                  <span className="flex items-center gap-1 font-extrabold uppercase tracking-wider text-xs text-slate-800">
                    {getEventIcon(event.type)}
                    {event.type}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-semibold">
                  +{Math.round((event.timestamp % 100000) / 100)}ms
                </span>
              </div>

              <p className="text-slate-800 font-semibold pl-7 text-xs">{event.description}</p>

              <div className="pl-7 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span className="truncate max-w-[260px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {event.selector}
                </span>
                {event.isPiiMasked && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-bold text-[10px]">
                    PII SCRUBBED
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
