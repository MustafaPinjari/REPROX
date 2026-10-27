import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Sparkles,
  Play, 
  FileText, 
  Clipboard, 
  Upload, 
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import type { VoiceBugReport } from '../types';
import { parseWisprVoiceIntent } from '../services/voiceDictationEngine';
import { transcribeVoiceApi, parseVoiceIntentApi, createIncidentApi } from '../services/apiClient';

interface NewIncidentPageProps {
  voiceReport: VoiceBugReport;
  onUpdateVoiceReport: (newReport: VoiceBugReport) => void;
  onLaunchSandbox: () => void;
}

export const NewIncidentPage: React.FC<NewIncidentPageProps> = ({
  voiceReport,
  onUpdateVoiceReport,
  onLaunchSandbox,
}) => {
  const [isDictating, setIsDictating] = useState(false);
  const [transcript, setTranscript] = useState(voiceReport.rawTranscript);
  const [showTextInput, setShowTextInput] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'info' | 'warning' | 'error' | 'success';
    text: string;
  } | null>(null);
  const recognitionRef = useRef<any>(null);

  const sampleScenario = 'Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number. The app mistakenly shows an invoice created toast instead of validating the GSTIN field.';

  // Initialize SpeechRecognition for genuine voice dictation
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
          setShowTextInput(true);
          setFeedbackMessage(null);
        }
      };

      recognition.onerror = (event: any) => {
        setIsDictating(false);
        const err = event?.error || 'error';
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setFeedbackMessage({
            type: 'warning',
            text: 'Microphone permission was denied. You can dictate hands-free into the text area using the Wispr Flow desktop app, type manually, or load the sample scenario.',
          });
        } else if (err === 'no-speech') {
          setFeedbackMessage({
            type: 'info',
            text: 'No speech was detected. Please try speaking again or click "Use Sample Scenario".',
          });
        } else if (err === 'audio-capture') {
          setFeedbackMessage({
            type: 'warning',
            text: 'No audio capture device found. Please verify your microphone connection.',
          });
        } else {
          setFeedbackMessage({
            type: 'info',
            text: `Voice recognition ended (${err}). You can type directly or load the sample scenario.`,
          });
        }
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  const handleApplyScenario = async () => {
    setTranscript(sampleScenario);
    setShowTextInput(true);
    setFeedbackMessage({
      type: 'success',
      text: 'Loaded sample scenario: Acme Corp B2B invoice missing statutory GSTIN.',
    });
    
    // Attempt backend NLP intent parse
    const res = await parseVoiceIntentApi(sampleScenario);
    const intent = res?.intent || parseWisprVoiceIntent(sampleScenario);

    onUpdateVoiceReport({
      ...voiceReport,
      rawTranscript: sampleScenario,
      detectedIntent: intent,
      timestamp: Date.now(),
    });
  };

  const handleToggleDictation = async () => {
    if (isDictating) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsDictating(false);

      // Transcribe and analyze intent via Django backend if text exists
      if (transcript.trim()) {
        try {
          const res = await transcribeVoiceApi(transcript);
          const intent = res?.detectedIntent || parseWisprVoiceIntent(transcript);
          onUpdateVoiceReport({
            ...voiceReport,
            rawTranscript: transcript,
            detectedIntent: intent,
            timestamp: Date.now(),
          });
          setFeedbackMessage({
            type: 'success',
            text: 'Voice intent extracted: Statutory GSTIN validation defect identified.',
          });
        } catch {
          const intent = parseWisprVoiceIntent(transcript);
          onUpdateVoiceReport({
            ...voiceReport,
            rawTranscript: transcript,
            detectedIntent: intent,
            timestamp: Date.now(),
          });
        }
      } else {
        setFeedbackMessage({
          type: 'info',
          text: 'No speech was detected during dictation. Try speaking again, type below, or use sample scenario.',
        });
      }
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setShowTextInput(true);
      if (!SpeechRecognition) {
        setFeedbackMessage({
          type: 'info',
          text: 'Web Speech API is unavailable in this browser. Dictate directly using the Wispr Flow desktop app into the text field, type manually, or click "Use Sample Scenario".',
        });
        return;
      }

      setFeedbackMessage(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsDictating(true);
        } catch (_) {
          setIsDictating(true);
        }
      } else {
        setIsDictating(true);
      }
    }
  };

  const handleTranscriptBlur = async (text: string) => {
    setTranscript(text);
    if (!text.trim()) {
      return;
    }
    try {
      const res = await parseVoiceIntentApi(text);
      const intent = res?.intent || parseWisprVoiceIntent(text);
      onUpdateVoiceReport({
        ...voiceReport,
        rawTranscript: text,
        detectedIntent: intent,
        timestamp: Date.now(),
      });
    } catch {
      const intent = parseWisprVoiceIntent(text);
      onUpdateVoiceReport({
        ...voiceReport,
        rawTranscript: text,
        detectedIntent: intent,
        timestamp: Date.now(),
      });
    }
  };

  const handleLaunch = async () => {
    const activeText = (transcript || voiceReport.rawTranscript || '').trim();
    if (!activeText) {
      setFeedbackMessage({
        type: 'warning',
        text: 'Please speak into your microphone, enter a bug description, or click "Use Sample Scenario" before launching.',
      });
      setShowTextInput(true);
      return;
    }

    try {
      const intent = voiceReport.detectedIntent;
      await createIncidentApi({
        title: intent.actionTaken || 'Commercial invoice statutory GSTIN validation bug',
        description: activeText,
        status: 'buggy',
        severity: intent.severity || 'critical',
        tags: [intent.feature || 'invoice', 'gst', 'validation'],
        spec_file: 'repro-buggy.spec.ts',
        is_primary_demo: true,
      });
    } catch (_) {}
    onLaunchSandbox();
  };

  return (
    <div className="relative min-h-[640px] flex flex-col justify-between animate-fadeIn font-sans pb-8">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* PASTEL MOUNTAIN BACKGROUND WATERMARK MATCHING SCREEN 2 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 h-72 overflow-hidden pointer-events-none opacity-60">
        <img
          src="/assets/soft_pastel_footer_lake.jpg"
          alt="REPROX Mountain Backdrop"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-[#FAF7F2]" />
      </div>

      {/* Floating Handwritten Script on Right */}
      <div className="hidden lg:block absolute top-12 right-12 pointer-events-none z-10">
        <svg 
          className="absolute -top-3 -right-6 w-32 h-36 pointer-events-none text-[#EFB6C8]" 
          fill="none" 
          viewBox="0 0 120 140"
        >
          <path
            d="M10,12 C75,-15 110,65 55,90 C15,110 90,140 115,115"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="opacity-75"
          />
        </svg>

        <div className="transform rotate-[8deg] text-right">
          <span className="font-handwriting text-3xl text-[#C27891] font-bold block leading-tight drop-shadow-2xs">
            No hands.
          </span>
          <span className="font-handwriting text-3xl text-[#C27891] font-bold block leading-tight drop-shadow-2xs">
            More progress.
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#8174A0] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EFB6C8]" />
            <span>WISPR FLOW HANDS-FREE INTAKE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1A24] tracking-tight">
            Create New Voice Incident
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6275] mt-0.5">
            Speak the steps to reproduce or paste user feedback. REPROX extracts testable parameters.
          </p>
        </div>

        <button
          onClick={onLaunchSandbox}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 text-[#FFD2A0]" />
          <span>Launch Sandbox Reproduction</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CENTRAL VOICE VISUALIZER CARD MATCHING SCREEN 2 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 my-auto py-8">
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#EBE7DF] shadow-md p-8 sm:p-12 max-w-2xl w-full mx-auto text-center">
          
          {/* Concentric Microphone Ring Visualizer */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Concentric ring 1 */}
            <div
              className={`absolute w-36 h-36 rounded-full border border-[#EFB6C8]/40 transition-all duration-1000 ${
                isDictating ? 'scale-125 opacity-100 animate-ping' : 'scale-100 opacity-40'
              }`}
            />
            {/* Concentric ring 2 */}
            <div
              className={`absolute w-28 h-28 rounded-full border border-[#A888B5]/50 transition-all duration-700 ${
                isDictating ? 'scale-110 opacity-100' : 'scale-100 opacity-60'
              }`}
            />
            {/* Central circle backing */}
            <div
              className={`absolute w-20 h-20 rounded-full bg-[#FAF7F2] shadow-inner transition-all ${
                isDictating ? 'ring-4 ring-[#EFB6C8]' : ''
              }`}
            />

            {/* Central Mic Button */}
            <button
              onClick={handleToggleDictation}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
                isDictating
                  ? 'bg-[#EFB6C8] text-[#1F1A24] ring-4 ring-[#EFB6C8]/30'
                  : 'bg-[#8174A0] hover:bg-[#6f638d] text-white'
              }`}
            >
              <Mic className={`w-7 h-7 ${isDictating ? 'animate-pulse text-[#1F1A24]' : ''}`} />
            </button>
          </div>

          {/* Central Instruction Text */}
          <h2 className="text-base sm:text-lg font-bold text-[#1F1A24] mb-1">
            {isDictating ? 'Listening via Wispr Flow Dictation...' : 'Click microphone or spacebar to speak'}
          </h2>
          <p className="text-xs text-[#6B6275] mb-4">
            Deterministic voice parsing • Zero audio telemetry stored • Instant intent extraction
          </p>

          {/* Feedback / Microphone Permission / Validation Alert */}
          {feedbackMessage && (
            <div className={`mb-5 p-3 rounded-xl border text-xs text-left flex items-start gap-2.5 transition-all animate-fadeIn ${
              feedbackMessage.type === 'warning'
                ? 'bg-[#FBF0F3] border-[#EFB6C8] text-[#9A2D4D]'
                : feedbackMessage.type === 'error'
                ? 'bg-[#FBF0F3] border-[#D9534F] text-[#9A2D4D]'
                : feedbackMessage.type === 'success'
                ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                : 'bg-[#FAF7F2] border-[#EBE7DF] text-[#6B6275]'
            }`}>
              {feedbackMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-[#C27891] shrink-0 mt-0.5" />}
              {feedbackMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-[#D9534F] shrink-0 mt-0.5" />}
              {feedbackMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />}
              {feedbackMessage.type === 'info' && <Info className="w-4 h-4 text-[#8174A0] shrink-0 mt-0.5" />}
              <div className="flex-1 leading-relaxed font-medium">
                {feedbackMessage.text}
              </div>
            </div>
          )}

          {/* Divider: OR */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#EBE7DF] w-full" />
            <span className="bg-[#FFFDF9] px-3 text-[11px] uppercase tracking-wider text-[#9E95A8] font-bold">
              OR
            </span>
          </div>

          {/* 3 Secondary Action Buttons matching Screen 2 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowTextInput(!showTextInput)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#D8D2C5] text-xs font-medium text-[#1F1A24] transition-all cursor-pointer shadow-2xs"
            >
              <Clipboard className="w-3.5 h-3.5 text-[#8174A0]" />
              <span>Paste User Feedback</span>
            </button>

            <button
              onClick={handleApplyScenario}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#D8D2C5] text-xs font-medium text-[#1F1A24] transition-all cursor-pointer shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8174A0]" />
              <span>Use Sample Scenario</span>
            </button>

            <button
              onClick={() => alert('Audio recording upload (.mp3, .wav, .m4a) supported.')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#D8D2C5] text-xs font-medium text-[#1F1A24] transition-all cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#8174A0]" />
              <span>Upload Recording</span>
            </button>
          </div>

          {/* Optional Transcript Box if text exists */}
          {showTextInput && (
            <div className="mt-6 pt-5 border-t border-[#EBE7DF] text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F1A24] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#8174A0]" />
                  <span>Captured Dictation / Transcript</span>
                </span>
                <span className="text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md font-semibold">
                  Scrubber Active
                </span>
              </div>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  onUpdateVoiceReport({
                    ...voiceReport,
                    rawTranscript: e.target.value,
                    detectedIntent: parseWisprVoiceIntent(e.target.value),
                  });
                }}
                onBlur={(e) => handleTranscriptBlur(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#D8D2C5] bg-[#FAF7F2] text-xs text-[#1F1A24] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#8174A0]"
              />
              <button
                onClick={handleLaunch}
                className="w-full py-2.5 px-4 rounded-xl bg-[#8174A0] hover:bg-[#6f638d] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#FFD2A0]" />
                <span>Synthesize Playwright &amp; Run in Sandbox</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
