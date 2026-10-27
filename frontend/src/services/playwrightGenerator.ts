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
  const testName = options?.testName || 'REPRO-104: Block invoice submission when required GSTIN is missing';
  const targetUrl = options?.targetUrl || 'http://localhost:3000/sandbox/invoice';
  const expectedErrorMessage = options?.expectedErrorMessage || 'GSTIN is required for commercial invoices.';

  const stepLines: string[] = [];

  stepLines.push(`  // 1. Navigate to target application sandbox`);
  stepLines.push(`  await page.goto('${targetUrl}');`);
  stepLines.push(`  await expect(page).toHaveTitle(/REPROX Sandbox|Invoice/i);`);
  stepLines.push(``);

  let stepCounter = 2;

  for (const event of events) {
    const locator = formatPlaywrightLocator(event);

    switch (event.type) {
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
        // If an erroneous toast appears, record assertion
        stepLines.push(`  // ${stepCounter}. Observe system notification`);
        stepLines.push(`  await expect(${locator}).toBeVisible();`);
        stepCounter++;
        break;
      }
    }
  }

  // Add the definitive regression assertion
  stepLines.push(``);
  stepLines.push(`  // Final Acceptance Assertion (Fails on Buggy Build, Passes on Fixed Build)`);
  stepLines.push(`  // Expected: Validation error alert should be visible and contain the required GST notice.`);
  stepLines.push(`  const validationAlert = page.getByRole('alert');`);
  stepLines.push(`  await expect(validationAlert).toBeVisible({ timeout: 4000 });`);
  stepLines.push(`  await expect(validationAlert).toContainText('${expectedErrorMessage}');`);
  stepLines.push(``);
  stepLines.push(`  // Ensure erroneous success toast is NOT present`);
  stepLines.push(`  const successToast = page.getByTestId('success-toast');`);
  stepLines.push(`  await expect(successToast).not.toBeVisible();`);

  return `import { test, expect } from '@playwright/test';

/**
 * REPROX Auto-Synthesized Regression Spec
 * Incident ID: REPRO-104
 * Generated automatically from Wispr Flow Voice dictation & DOM telemetry.
 * 
 * Verifies: Commercial Invoicing GSTIN Compliance
 * Behavior: Submissions without a valid GST number MUST be rejected with a visible validation alert.
 */
test.describe('Commercial Invoice Dispatch Compliance', () => {
  test('${testName}', async ({ page }) => {
${stepLines.join('\n')}
  });
});
`;
}
