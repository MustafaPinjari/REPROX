export type EventType = 
  | 'navigate' 
  | 'click' 
  | 'fill' 
  | 'select' 
  | 'submit' 
  | 'toast' 
  | 'assert' 
  | 'error';

export interface RecordedEvent {
  id: string;
  timestamp: number;
  type: EventType;
  selector: string;
  targetRole?: string;
  targetLabel?: string;
  targetTestId?: string;
  value?: string;
  maskedValue?: string;
  description: string;
  isPiiMasked?: boolean;
  domSnapshotSnippet?: string;
  status?: 'recorded' | 'executing' | 'passed' | 'failed';
}

export interface VoiceBugReport {
  id: string;
  timestamp: number;
  rawTranscript: string;
  dictationSource: 'wispr-flow' | 'mic-speech' | 'preset-demo';
  detectedIntent: {
    feature: string;
    actionTaken: string;
    expectedOutcome: string;
    actualOutcome: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  };
  audioWaveData?: number[];
  isListening: boolean;
}

export type BuildMode = 'buggy' | 'fixed';

export interface StepExecutionResult {
  stepIndex: number;
  description: string;
  locator: string;
  actionType: EventType;
  status: 'passed' | 'failed' | 'running' | 'pending';
  durationMs: number;
  errorMessage?: string;
  expectedValue?: string;
  actualValue?: string;
}

export interface TestExecutionResult {
  buildMode: BuildMode;
  buildVersion: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  failureType?: 'reproduced_bug' | 'infrastructure_error' | 'assertion_failure';
  exitCode: number;
  totalDurationMs: number;
  passedCount: number;
  failedCount: number;
  steps: StepExecutionResult[];
  failureSignature?: {
    step: number;
    expected: string;
    received: string;
    location: string;
  };
  executedAt?: string;
  screenshotBase64?: string;
  rawConsoleLogs: string[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'reproduced' | 'verified_fixed' | 'recording' | 'triaged';
  createdAt: string;
  appName: string;
  voiceReport: VoiceBugReport;
  timeline: RecordedEvent[];
  generatedTestCode: string;
  buggyExecution?: TestExecutionResult;
  fixedExecution?: TestExecutionResult;
  rootCauseDiff?: {
    file: string;
    lines: { type: 'add' | 'delete' | 'context'; content: string; lineNo?: number }[];
    explanation: string;
  };
}
