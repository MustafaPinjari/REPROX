import { describe, it, expect } from 'vitest';
import { scrubText, shouldMaskInput, sanitizeInputValue } from '../src/services/privacyScrubber';
import { parseWisprVoiceIntent, detectVoiceCommand, synthesizeTimelineEventsForReport } from '../src/services/voiceDictationEngine';
import { generatePlaywrightTestScript, formatPlaywrightLocator } from '../src/services/playwrightGenerator';
import { executePlaywrightTest } from '../src/services/testRunner';
import { RecordedEvent } from '../src/types';

describe('Privacy & Credential Scrubber (Zero-Trust Standard)', () => {
  it('scrubs Bearer tokens and API keys', () => {
    const raw = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-ae75 and api_key=sk-1234567890abcdef12345678';
    const result = scrubText(raw);
    expect(result.isMasked).toBe(true);
    expect(result.scrubbedText).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    expect(result.scrubbedText).toContain('[REDACTED_TOKEN]');
    expect(result.scrubbedText).toContain('[REDACTED_API_KEY]');
  });

  it('masks sensitive password and credit card inputs', () => {
    expect(shouldMaskInput('password', 'user_password', 'pwd')).toBe(true);
    expect(shouldMaskInput('text', 'cvv_code', 'cvv')).toBe(true);
    expect(shouldMaskInput('text', 'client_name', 'clientName')).toBe(false);

    const masked = sanitizeInputValue('mySuperSecretPassword123', { inputType: 'password' });
    expect(masked.isMasked).toBe(true);
    expect(masked.value).toBe('••••••••');
  });
});

describe('Wispr Flow Voice Intent & Command Engine', () => {
  it('extracts structured bug intent from natural voice dictation', () => {
    const transcript = 'Customer Acme Corp tries submitting an invoice for $4,850 without entering a GST identification number. The app mistakenly shows an invoice created toast instead of validating the GSTIN field.';
    const intent = parseWisprVoiceIntent(transcript);

    expect(intent.feature).toContain('Commercial Invoice');
    expect(intent.actionTaken).toContain('without');
    expect(intent.expectedOutcome).toContain('GSTIN is required');
    expect(intent.actualOutcome).toContain('Invoice Dispatched Successfully');
  });

  it('dynamically parses real-world food ordering defect on Zepto without dummy data', () => {
    const transcript = 'i cant order food on zepto';
    const intent = parseWisprVoiceIntent(transcript);

    expect(intent.feature).toContain('Zepto');
    expect(intent.feature).toContain('Food Ordering');
    expect(intent.actionTaken).toContain('Zepto');
    expect(intent.expectedOutcome).toContain('Order placed successfully');
    expect(intent.severity).toBe('critical');

    const events = synthesizeTimelineEventsForReport(transcript, intent);
    expect(events.length).toBeGreaterThanOrEqual(4);
    expect(events[0].value).toContain('zeptonow.com');
    expect(events.some(e => e.targetLabel === 'Place Food Order')).toBe(true);

    const script = generatePlaywrightTestScript(events);
    expect(script).toContain('https://www.zeptonow.com');
    expect(script).toContain('Place Food Order');
    expect(script).not.toContain('Acme Global Ltd');
    expect(script).not.toContain('GSTIN');
  });

  it('detects hands-free voice commands accurately', () => {
    expect(detectVoiceCommand('Hey REPROX run buggy test please').commandType).toBe('run_buggy');
    expect(detectVoiceCommand('verify fixed test now').commandType).toBe('run_fixed');
    expect(detectVoiceCommand('generate playwright test').commandType).toBe('generate_test');
    expect(detectVoiceCommand('hello what is the weather').isCommand).toBe(false);
  });
});

describe('Playwright Test Generator', () => {
  it('formats resilient accessible Playwright locators', () => {
    const event: RecordedEvent = {
      id: '1',
      timestamp: 100,
      type: 'fill',
      selector: '#clientName',
      targetRole: 'textbox',
      targetLabel: 'Client Business Name',
      description: 'Entered name',
    };
    expect(formatPlaywrightLocator(event)).toBe("page.getByRole('textbox', { name: 'Client Business Name' })");
  });

  it('synthesizes production Playwright TypeScript test spec', () => {
    const events: RecordedEvent[] = [
      {
        id: '1',
        timestamp: 100,
        type: 'fill',
        selector: '#clientName',
        targetLabel: 'Client Business Name',
        value: 'Acme Global Ltd',
        description: 'Entered client name',
      },
      {
        id: '2',
        timestamp: 200,
        type: 'click',
        selector: '#dispatchInvoiceBtn',
        targetRole: 'button',
        targetLabel: 'Generate & Dispatch Invoice',
        description: 'Clicked dispatch',
      },
    ];

    const script = generatePlaywrightTestScript(events);
    expect(script).toContain("import { test, expect } from '@playwright/test';");
    expect(script).toContain("page.getByLabel('Client Business Name').fill('Acme Global Ltd');");
    expect(script).toContain("page.getByRole('button', { name: 'Generate & Dispatch Invoice' }).click();");
    expect(script).toContain("expect(validationAlert).toContainText('GSTIN is required for commercial invoices.');");
  });
});

describe('Playwright Dual Execution Verifier (Fail vs Pass)', () => {
  it('executes against buggy build and reproduces the failure (Exit Code 1)', async () => {
    const result = await executePlaywrightTest({ buildMode: 'buggy', stepDelayMs: 0 });
    expect(result.exitCode).toBe(1);
    expect(result.status).toBe('failed');
    expect(result.failedCount).toBe(1);
    expect(result.failureSignature).toBeDefined();
    expect(result.failureSignature?.received).toContain('Toast');
  });

  it('executes against fixed build and verifies the fix (Exit Code 0)', async () => {
    const result = await executePlaywrightTest({ buildMode: 'fixed', stepDelayMs: 0 });
    expect(result.exitCode).toBe(0);
    expect(result.status).toBe('passed');
    expect(result.failedCount).toBe(0);
    expect(result.steps.every(s => s.status === 'passed')).toBe(true);
  });
});
