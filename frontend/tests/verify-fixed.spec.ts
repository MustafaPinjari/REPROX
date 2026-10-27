import { test, expect } from '@playwright/test';

/**
 * REPROX Live Verification Spec (Fixed Target)
 * Target: http://127.0.0.1:3000?mode=fixed
 * Expected: PASSES all assertions because statutory GST validation is active in v1.0.5.
 */
test.describe('Commercial Invoice Dispatch Fixed Verification', () => {
  test('verify GST validation halts submission and alerts user on v1.0.5', async ({ page }) => {
    // 1. Navigate to target application sandbox in fixed mode
    await page.goto('http://127.0.0.1:3000?mode=fixed');
    await expect(page).toHaveTitle(/REPROX/i);

    // 2. Fill client details
    await page.locator('#clientName').fill('Acme Global Ltd');

    // 3. Fill invoice amount
    await page.locator('#invoiceAmount').fill('4850.00');

    // 4. Intentionally clear statutory GSTIN
    await page.locator('#gstinNumber').fill('');

    // 5. Submit invoice
    await page.locator('#dispatchInvoiceBtn').click();

    // 6. Assert GSTIN validation error is visible and halting submission
    const validationAlert = page.locator('[role="alert"]');
    await expect(validationAlert).toBeVisible({ timeout: 3500 });
    await expect(validationAlert).toContainText('GSTIN is required for commercial invoices.');

    // 7. Ensure erroneous success toast is NOT visible
    const successToast = page.locator('[data-testid="success-toast"]');
    await expect(successToast).not.toBeVisible();
  });
});
