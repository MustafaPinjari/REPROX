/**
 * REPROX Privacy & Credential Scrubber
 * Complies with strict Zero-Trust & Credential Isolation engineering standards.
 * Automatically redacts PII, sensitive credentials, tokens, and financial data
 * before recording into incident events or generating Playwright test suites.
 */

export interface ScrubResult {
  scrubbedText: string;
  isMasked: boolean;
  maskReason?: string;
}

// Patterns for sensitive data detection
const SENSITIVE_PATTERNS = [
  {
    name: 'Bearer Token / JWT',
    regex: /Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_=]*/gi,
    replacement: 'Bearer [REDACTED_TOKEN]',
  },
  {
    name: 'Generic API Key / Secret',
    regex: /(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}|api[_-]?key[_-]?[a-zA-Z0-9]{16,})/gi,
    replacement: '[REDACTED_API_KEY]',
  },
  {
    name: 'Password / Secret Field Value',
    regex: /(password|secret|passcode|auth_token)\s*[:=]\s*["']?([^"',\s]+)["']?/gi,
    replacement: '$1: "[REDACTED_SECRET]"',
  },
  {
    name: 'Credit Card Number',
    regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    replacement: '****-****-****-XXXX',
  },
  {
    name: 'Social Security / National Tax Number',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: 'XXX-XX-XXXX',
  },
];

const SENSITIVE_INPUT_NAMES = [
  'password',
  'passwd',
  'token',
  'secret',
  'apikey',
  'cvv',
  'ssn',
  'creditcard',
  'cardnumber',
  'auth',
];

/**
 * Scrubs raw strings of any embedded credentials or secrets
 */
export function scrubText(text: string): ScrubResult {
  if (!text) return { scrubbedText: text, isMasked: false };

  let scrubbed = text;
  let isMasked = false;
  let reason: string | undefined;

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.regex.test(scrubbed)) {
      scrubbed = scrubbed.replace(pattern.regex, pattern.replacement);
      isMasked = true;
      reason = pattern.name;
    }
  }

  return { scrubbedText: scrubbed, isMasked, maskReason: reason };
}

/**
 * Evaluates an input field's attributes (type, name, id, autocomplete)
 * to decide whether its value must be fully masked during recording.
 */
export function shouldMaskInput(
  inputType?: string,
  inputName?: string,
  inputId?: string,
  autocomplete?: string
): boolean {
  if (inputType === 'password') return true;

  const identifier = `${inputName || ''} ${inputId || ''} ${autocomplete || ''}`.toLowerCase();
  return SENSITIVE_INPUT_NAMES.some((keyword) => identifier.includes(keyword));
}

/**
 * Sanitizes input values before saving to timeline steps or Playwright code
 */
export function sanitizeInputValue(
  value: string,
  options?: { inputType?: string; inputName?: string; inputId?: string }
): { value: string; isMasked: boolean } {
  if (!value) return { value, isMasked: false };

  if (options && shouldMaskInput(options.inputType, options.inputName, options.inputId)) {
    return { value: '••••••••', isMasked: true };
  }

  const { scrubbedText, isMasked } = scrubText(value);
  return { value: scrubbedText, isMasked };
}
