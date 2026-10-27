import { test, expect } from '@playwright/test';

/**
 * REPROX Live Regression Spec (Buggy Target)
 * Target: http://127.0.0.1:3000?mode=buggy
 * Expected: FAILS on line 26 because GST validation guard is missing in v1.0.4.
 */
test.describe('Commercial Invoice Dispatch Buggy Reproduction', () => {
  test('reproduce missing GST validation failure on v1.0.4', async ({ page }) => {
    // 1. Navigate to target application sandbox in buggy mode
    await page.goto('http://127.0.0.1:3000?mode=buggy');
    await expect(page).toHaveTitle(/REPROX/i);

    // 2. Fill client details
    await page.locator('#clientName').fill('Acme Global Ltd');

    // 3. Fill invoice amount
    await page.locator('#invoiceAmount').fill('4850.00');

    // 4. Intentionally clear statutory GSTIN
    await page.locator('#gstinNumber').fill('');

    // 5. Submit invoice
    await page.locator('#dispatchInvoiceBtn').click();

    // 6. Assert GSTIN validation error is visible
    // FAILS on v1.0.4: validation error is omitted, false success toast emitted instead.
    const validationAlert = page.locator('[role="alert"]');
    await expect(validationAlert).toBeVisible({ timeout: 3500 });
    await expect(validationAlert).toContainText('GSTIN is required for commercial invoices.');
  });
});
