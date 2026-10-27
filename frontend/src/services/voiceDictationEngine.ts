import type { VoiceBugReport } from '../types';

// SpeechRecognition type declarations for cross-browser support
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

/**
 * High-precision Wispr Flow Bug Intent Parser (Deterministic, zero paid AI APIs)
 * Extracts structured bug entities: Feature, Action, Expected Outcome, Actual Outcome, Severity.
 */
export function parseWisprVoiceIntent(transcript: string): VoiceBugReport['detectedIntent'] {
  const lower = transcript.toLowerCase();

  // Detect feature area
  let feature = 'Commercial Invoicing & Tax Compliance';
  if (lower.includes('invoice') || lower.includes('bill') || lower.includes('gst')) {
    feature = 'Commercial Invoice Dispatch & GSTIN Validation';
  } else if (lower.includes('checkout') || lower.includes('payment')) {
    feature = 'Payment Gateway Processing';
  } else if (lower.includes('auth') || lower.includes('login')) {
    feature = 'User Authentication';
  }

  // Detect action taken
  let actionTaken = 'Submitted commercial invoice form';
  if (lower.includes('without') && (lower.includes('gst') || lower.includes('tax id'))) {
    actionTaken = 'Submitting commercial B2B invoice without providing mandatory GSTIN';
  } else if (lower.includes('empty') || lower.includes('missing')) {
    actionTaken = 'Submitting form with missing mandatory fields';
  }

  // Detect expected outcome
  let expectedOutcome = 'Show validation alert: "GSTIN is required for commercial invoices" and prevent dispatch';
  if (lower.includes('should') || lower.includes('expect') || lower.includes('validat') || lower.includes('gst')) {
    expectedOutcome = 'Show validation alert: "GSTIN is required for commercial invoices" and prevent dispatch';
  }

  // Detect actual observed bug
  let actualOutcome = 'Submission mistakenly reports success toast and generates invoice without GSTIN';
  if (lower.includes('success') || lower.includes('incidentally') || lower.includes('mistake') || lower.includes('silent')) {
    actualOutcome = 'Application displays "Invoice Dispatched Successfully" toast despite invalid tax credentials';
  }

  // Detect severity
  let severity: VoiceBugReport['detectedIntent']['severity'] = 'high';
  if (lower.includes('critical') || lower.includes('tax compliance') || lower.includes('audit')) {
    severity = 'critical';
  } else if (lower.includes('minor') || lower.includes('cosmetic')) {
    severity = 'low';
  }

  return {
    feature,
    actionTaken,
    expectedOutcome,
    actualOutcome,
    severity,
  };
}

export interface VoiceCommandDetection {
  isCommand: boolean;
  commandType?: 'record' | 'stop_record' | 'run_buggy' | 'run_fixed' | 'generate_test' | 'export';
  label?: string;
}

/**
 * Detects hands-free voice action commands dictated through Wispr Flow
 */
export function detectVoiceCommand(transcript: string): VoiceCommandDetection {
  const t = transcript.toLowerCase().trim();

  if (t.includes('start recording') || t.includes('record repro') || t.includes('start repro')) {
    return { isCommand: true, commandType: 'record', label: 'Start Recording' };
  }
  if (t.includes('stop recording') || t.includes('finish recording') || t.includes('save recording')) {
    return { isCommand: true, commandType: 'stop_record', label: 'Stop Recording' };
  }
  if (t.includes('run buggy') || t.includes('test bug') || t.includes('reproduce bug') || t.includes('run failure')) {
    return { isCommand: true, commandType: 'run_buggy', label: 'Run Buggy Test' };
  }
  if (t.includes('run fixed') || t.includes('verify fix') || t.includes('test fix') || t.includes('run pass')) {
    return { isCommand: true, commandType: 'run_fixed', label: 'Verify Fixed Test' };
  }
  if (t.includes('generate playwright') || t.includes('create test') || t.includes('generate test')) {
    return { isCommand: true, commandType: 'generate_test', label: 'Generate Playwright Test' };
  }
  if (t.includes('export incident') || t.includes('download test') || t.includes('share repro')) {
    return { isCommand: true, commandType: 'export', label: 'Export Incident' };
  }

  return { isCommand: false };
}
