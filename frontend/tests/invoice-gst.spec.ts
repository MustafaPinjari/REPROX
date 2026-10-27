import { test, expect } from '@playwright/test';

/**
 * REPROX Auto-Synthesized Regression Spec
 * Incident ID: REPRO-104
 * Generated automatically from Wispr Flow Voice dictation & DOM telemetry.
 * 
 * Verifies: Commercial Invoicing GSTIN Compliance
 * Target App: LedgerFlow Billing Sandbox (:3000)
 * Behavior: Submissions without a valid GST number MUST be rejected with a visible validation alert.
 */
test.describe('Commercial Invoice Dispatch Compliance', () => {
  test('REPRO-104: Block invoice submission when required GSTIN is missing', async ({ page }) => {
    // 1. Navigate to target application sandbox
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/REPROX/i);

    // 2. Fill input field: Client Business Name
    await page.getByRole('textbox', { name: 'Client Business Name' }).fill('Acme Global Ltd');

    // 3. Fill input field: Invoice Total (USD)
    await page.getByRole('textbox', { name: 'Invoice Total (USD)' }).fill('4850.00');

    // 4. Clear GSTIN input (simulating customer omission of mandatory tax ID)
    await page.getByRole('textbox', { name: 'GST Identification Number (GSTIN)' }).fill('');

    // 5. Submit invoice dispatch action
    await page.getByRole('button', { name: 'Generate & Dispatch Invoice' }).click();

    // 6. Final Acceptance Assertion:
    // When run against Buggy Build (v1.0.4) -> FAILS (Exit Code 1): Alert is omitted, silent success toast emitted instead.
    // When run against Fixed Build (v1.0.5) -> PASSES (Exit Code 0): Alert is rendered, dispatch blocked.
    const validationAlert = page.getByRole('alert');
    await expect(validationAlert).toBeVisible({ timeout: 4000 });
    await expect(validationAlert).toContainText('GSTIN is required for commercial invoices.');

    // 7. Ensure erroneous success toast is NOT present
    const successToast = page.getByTestId('success-toast');
    await expect(successToast).not.toBeVisible();
  });
});
