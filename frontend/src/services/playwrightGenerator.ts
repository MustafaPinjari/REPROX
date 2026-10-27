import type { RecordedEvent } from '../types';

/**
 * Maps recorded selectors & roles to clean Playwright locator expressions
 */
export function formatPlaywrightLocator(event: RecordedEvent): string {
  if (event.targetRole && event.targetLabel) {
    return `page.getByRole('${event.targetRole}', { name: '${event.targetLabel}' })`;
  }
  if (event.targetLabel) {
    return `page.getByLabel('${event.targetLabel}')`;
  }
  if (event.targetTestId) {
    return `page.getByTestId('${event.targetTestId}')`;
  }
  if (event.selector) {
    if (event.selector.startsWith('http://') || event.selector.startsWith('https://')) {
      return `page.goto('${event.selector}')`;
    }
    return `page.locator('${event.selector}')`;
  }
  return `page.locator('body')`;
}

/**
 * Deterministically synthesizes production Playwright TypeScript test code
 * from an array of recorded events and bug expectations.
 */
export function generatePlaywrightTestScript(
  events: RecordedEvent[],
  options?: {
    testName?: string;
    targetUrl?: string;
    assertBugValidation?: boolean;
    expectedErrorMessage?: string;
  }
): string {
  const testName = options?.testName || 'Spoken Incident Reproduction Verification';
  const targetUrl = options?.targetUrl || 'http://localhost:3000/sandbox';
  const expectedErrorMessage = options?.expectedErrorMessage || 'Action completed with verified state';

  const stepLines: string[] = [];

  // 1. Initial navigation if not already in events
  const hasNavigateStep = events.some((e) => e.type === 'navigate');
  if (!hasNavigateStep) {
    stepLines.push(`  // 1. Navigate to target application sandbox`);
    stepLines.push(`  await page.goto('${targetUrl}');`);
    stepLines.push(``);
  }

  let stepCounter = hasNavigateStep ? 1 : 2;

  for (const event of events) {
    const locator = formatPlaywrightLocator(event);

    switch (event.type) {
      case 'navigate': {
        const url = event.value || event.selector || targetUrl;
        stepLines.push(`  // ${stepCounter}. ${event.description}`);
        stepLines.push(`  await page.goto('${url}');`);
        stepCounter++;
        break;
      }
      case 'fill': {
        const val = event.maskedValue || event.value || '';
        stepLines.push(`  // ${stepCounter}. Fill input field: ${event.description}`);
        stepLines.push(`  await ${locator}.fill('${val}');`);
        stepCounter++;
        break;
      }
      case 'click': {
        stepLines.push(`  // ${stepCounter}. Trigger click: ${event.description}`);
        stepLines.push(`  await ${locator}.click();`);
        stepCounter++;
        break;
      }
      case 'submit': {
        stepLines.push(`  // ${stepCounter}. Submit form action: ${event.description}`);
        stepLines.push(`  await ${locator}.click();`);
        stepCounter++;
        break;
      }
      case 'assert': {
        stepLines.push(`  // ${stepCounter}. Assertion: ${event.description}`);
        stepLines.push(`  await expect(${locator}).toBeVisible();`);
        if (event.value) {
          stepLines.push(`  await expect(${locator}).toContainText('${event.value}');`);
        }
        stepCounter++;
        break;
      }
      case 'toast': {
        stepLines.push(`  // ${stepCounter}. Observe system notification`);
        stepLines.push(`  await expect(${locator}).toBeVisible();`);
        stepCounter++;
        break;
      }
    }
  }

  // If events do not have an explicit assertion, append standard regression assertion
  const hasAssertStep = events.some((e) => e.type === 'assert');
  if (!hasAssertStep) {
    stepLines.push(``);
    stepLines.push(`  // Final Acceptance Assertion (Fails on Buggy Build, Passes on Fixed Build)`);
    stepLines.push(`  const validationAlert = page.getByRole('alert');`);
    stepLines.push(`  await expect(validationAlert).toBeVisible({ timeout: 4000 });`);
    stepLines.push(`  await expect(validationAlert).toContainText('${expectedErrorMessage}');`);
  }

  return `import { test, expect } from '@playwright/test';

/**
 * REPROX Auto-Synthesized Regression Spec
 * Generated automatically from Wispr Flow Voice dictation & DOM telemetry.
 * Test Case: ${testName}
 */
test.describe('Automated Incident Reproduction Spec', () => {
  test('${testName}', async ({ page }) => {
${stepLines.join('\n')}
  });
});
`;
}
