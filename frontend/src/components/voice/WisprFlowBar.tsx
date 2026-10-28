import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, ShieldAlert, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { parseWisprVoiceIntent, detectVoiceCommand } from '../../services/voiceDictationEngine';
import type { VoiceBugReport } from '../../types';

interface WisprFlowBarProps {
  onTranscriptChange?: (transcript: string) => void;
  onVoiceReportReady?: (report: VoiceBugReport) => void;
  onVoiceCommand?: (command: string) => void;
  activeBuildMode: 'buggy' | 'fixed';
  rawTranscript?: string;
}

export const WisprFlowBar: React.FC<WisprFlowBarProps> = ({
  onTranscriptChange,
  onVoiceReportReady,
  onVoiceCommand,
  activeBuildMode,
  rawTranscript,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(
    rawTranscript ||
      'Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number. The app mistakenly shows an invoice created toast instead of validating the GSTIN field.'
  );

  useEffect(() => {
    if (rawTranscript !== undefined && rawTranscript !== transcript) {
      setTranscript(rawTranscript);
    }
  }, [rawTranscript]);
  const [audioWave, setAudioWave] = useState<number[]>([14, 28, 42, 22, 50, 34, 24, 12, 38, 20]);
  const [detectedCommand, setDetectedCommand] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
          if (onTranscriptChange) onTranscriptChange(currentTranscript);

          // Check for voice commands
          const command = detectVoiceCommand(currentTranscript);
          if (command.isCommand && command.commandType && onVoiceCommand) {
            setDetectedCommand(command.label || command.commandType);
            onVoiceCommand(command.commandType);
            setTimeout(() => setDetectedCommand(null), 3000);
          }
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [onTranscriptChange, onVoiceCommand]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (_) {
          setIsListening(true);
        }
      } else {
        setIsListening(true);
      }
    }
  };

  // Simulate audio visualizer wave when listening
  useEffect(() => {
    if (!isListening) {
      setAudioWave([10, 16, 12, 18, 10, 20, 14, 10, 16, 12]);
      return;
    }

    const interval = setInterval(() => {
      setAudioWave(
        Array.from({ length: 14 }, () => Math.floor(Math.random() * 40) + 10)
      );
    }, 110);

    return () => clearInterval(interval);
  }, [isListening]);

  const parsedIntent = parseWisprVoiceIntent(transcript);

  useEffect(() => {
    if (onVoiceReportReady) {
      onVoiceReportReady({
        id: `VOICE-${Date.now()}`,
        timestamp: Date.now(),
        rawTranscript: transcript,
        dictationSource: 'wispr-flow',
        detectedIntent: parsedIntent,
        isListening,
      });
    }
  }, [transcript, isListening]);

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] space-y-4">
      {/* Wispr Flow Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                isListening ? 'bg-fuchsia-500 animate-ping' : 'bg-violet-600'
              }`}
            />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-violet-600" />
          </div>
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              Wispr Flow Voice Dictation
              <span className="text-[10px] bg-violet-100 text-violet-800 border border-violet-200 px-2 py-0.5 rounded-full font-mono font-bold">
                Hands-Free Mode Active
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Mode: {activeBuildMode}
              </span>
            </span>
          </div>
        </div>

        {/* Live Audio Visualizer */}
        <div className="flex items-center gap-1.5 h-7 px-3.5 py-1 bg-slate-50 rounded-full border border-slate-200/90 shadow-inner">
          <Volume2 className="w-4 h-4 text-violet-600 mr-1" />
          {audioWave.map((h, i) => (
            <span
              key={i}
              className="w-1 bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-full transition-all duration-100"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      {/* Voice Dictation Input Area */}
      <div className="relative">
        <textarea
          rows={2}
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (onTranscriptChange) onTranscriptChange(e.target.value);
          }}
          placeholder="Speak or dictate the bug details using Wispr Flow hands-free..."
          className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 resize-none font-mono font-medium focus:outline-none pr-14 leading-relaxed transition-all shadow-inner"
        />

        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? 'Stop Listening' : 'Start Voice Dictation'}
          className={`absolute right-3 top-3 p-2.5 rounded-xl transition-all shadow-md active:scale-95 ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/25'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Spoken Command Notification Banner */}
      {detectedCommand && (
        <div className="px-4 py-2 bg-violet-50 border border-violet-200 rounded-xl text-xs text-violet-900 font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            Voice Command Executed: <strong>"{detectedCommand}"</strong>
          </span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Structured Intent Synthesis Card */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3.5 text-xs space-y-2.5">
        <div className="flex items-center justify-between text-[11px] border-b border-slate-200/80 pb-2">
          <span className="font-extrabold text-slate-700 tracking-wider flex items-center gap-1.5 uppercase">
            <Cpu className="w-3.5 h-3.5 text-violet-600" />
            Synthesized Bug Intent (Local Engine)
          </span>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold uppercase">
            Severity: {parsedIntent.severity}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
              Observed Defect:
            </span>
            <span className="text-rose-700 font-semibold">{parsedIntent.actualOutcome}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
              Required Validation:
            </span>
            <span className="text-emerald-700 font-semibold">{parsedIntent.expectedOutcome}</span>
          </div>
        </div>
      </div>

      {/* Quick Voice Command Triggers */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
          <Terminal className="w-3.5 h-3.5 text-violet-600" />
          Hands-Free Voice Triggers:
        </span>
        <button
          type="button"
          onClick={() => onVoiceCommand && onVoiceCommand('run_buggy')}
          className="text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-xs"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          "Run Buggy Test"
        </button>
        <button
          type="button"
          onClick={() => onVoiceCommand && onVoiceCommand('run_fixed')}
          className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          "Verify Fixed Test"
        </button>
        <button
          type="button"
          onClick={() => onVoiceCommand && onVoiceCommand('generate_test')}
          className="text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          "Generate Playwright Test"
        </button>
      </div>
    </div>
  );
};
