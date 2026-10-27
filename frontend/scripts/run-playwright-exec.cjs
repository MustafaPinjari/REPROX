const { chromium } = require('@playwright/test');

async function runRealPlaywrightTest(mode = 'buggy', baseUrl = 'http://127.0.0.1:3000') {
  const startTime = Date.now();
  const logs = [];
  const steps = [];
  let browser = null;

  logs.push(`[PLAYWRIGHT-ENGINE] Launching system Edge browser (Chromium engine)...`);

  try {
    const fs = require('fs');
    const possiblePaths = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
    const edgeExecutable = possiblePaths.find(p => {
      try { return fs.existsSync(p); } catch { return false; }
    });

    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    if (edgeExecutable) {
      launchOptions.executablePath = edgeExecutable;
    } else {
      launchOptions.channel = 'msedge';
    }

    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext();
    const page = await context.newPage();

    logs.push(`[PLAYWRIGHT-ENGINE] Navigating to ${baseUrl}?mode=${mode}`);
    
    // Step 1: Goto sandbox
    const t0 = Date.now();
    await page.goto(`${baseUrl}?mode=${mode}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    steps.push({
      stepIndex: 1,
      description: 'Navigate to LedgerFlow Sandbox',
      locator: `page.goto('${baseUrl}?mode=${mode}')`,
      actionType: 'navigate',
      status: 'passed',
      durationMs: Date.now() - t0,
    });
    logs.push(`✓ Step 1: Navigated to ${baseUrl}?mode=${mode} (${Date.now() - t0}ms)`);

    // Step 2: Fill Client Name
    const t1 = Date.now();
    await page.locator('#clientName').fill('Acme Global Ltd');
    steps.push({
      stepIndex: 2,
      description: 'Fill Client Business Name',
      locator: "page.locator('#clientName').fill('Acme Global Ltd')",
      actionType: 'fill',
      status: 'passed',
      durationMs: Date.now() - t1,
    });
    logs.push(`✓ Step 2: Filled client name (#clientName) (${Date.now() - t1}ms)`);

    // Step 3: Fill Amount
    const t2 = Date.now();
    await page.locator('#invoiceAmount').fill('4850.00');
    steps.push({
      stepIndex: 3,
      description: 'Fill Invoice Amount',
      locator: "page.locator('#invoiceAmount').fill('4850.00')",
      actionType: 'fill',
      status: 'passed',
      durationMs: Date.now() - t2,
    });
    logs.push(`✓ Step 3: Filled invoice total (#invoiceAmount) (${Date.now() - t2}ms)`);

    // Step 4: Clear GSTIN (intentionally omit mandatory tax number)
    const t3 = Date.now();
    await page.locator('#gstinNumber').fill('');
    steps.push({
      stepIndex: 4,
      description: 'Leave Mandatory GSTIN Empty',
      locator: "page.locator('#gstinNumber').fill('')",
      actionType: 'fill',
      status: 'passed',
      durationMs: Date.now() - t3,
    });
    logs.push(`✓ Step 4: Cleared GSTIN input (#gstinNumber) (${Date.now() - t3}ms)`);

    // Step 5: Click Submit
    const t4 = Date.now();
    await page.locator('#dispatchInvoiceBtn').click();
    steps.push({
      stepIndex: 5,
      description: 'Click Generate & Dispatch Invoice',
      locator: "page.locator('#dispatchInvoiceBtn').click()",
      actionType: 'click',
      status: 'passed',
      durationMs: Date.now() - t4,
    });
    logs.push(`✓ Step 5: Triggered invoice dispatch action (${Date.now() - t4}ms)`);

    // Step 6: Assert GSTIN Validation Error Alert
    const t5 = Date.now();
    const alertLocator = page.locator('[role="alert"]');
    
    // In buggy mode, this alert will NOT appear; Playwright will throw TimeoutError!
    try {
      await alertLocator.waitFor({ state: 'visible', timeout: 3000 });
      const text = await alertLocator.textContent();
      
      if (!text.includes('GSTIN is required')) {
        throw new Error(`Expected alert text to include 'GSTIN is required', but got '${text}'`);
      }

      steps.push({
        stepIndex: 6,
        description: 'Assert GSTIN Required Validation Alert is Visible',
        locator: "expect(page.getByRole('alert')).toBeVisible({ timeout: 3000 })",
        actionType: 'assert',
        status: 'passed',
        durationMs: Date.now() - t5,
        actualValue: text.trim(),
      });
      logs.push(`✓ Step 6: Verified statutory GST validation alert visible: "${text.trim()}" (${Date.now() - t5}ms)`);

      // Step 7: Verify success toast is NOT visible
      const t6 = Date.now();
      const toastLocator = page.locator('[data-testid="success-toast"]');
      const toastCount = await toastLocator.count();
      if (toastCount > 0 && await toastLocator.isVisible()) {
        throw new Error('Erroneous success toast rendered despite missing GSTIN!');
      }

      steps.push({
        stepIndex: 7,
        description: 'Assert False Success Toast is Blocked',
        locator: "expect(page.getByTestId('success-toast')).not.toBeVisible()",
        actionType: 'assert',
        status: 'passed',
        durationMs: Date.now() - t6,
      });
      logs.push(`✓ Step 7: Confirmed erroneous success toast was suppressed (${Date.now() - t6}ms)`);

      const totalDuration = Date.now() - startTime;
      logs.push(`[PLAYWRIGHT-SUCCESS] All 7 steps passed! Total time: ${totalDuration}ms. Exit code: 0`);

      return {
        buildMode: mode,
        buildVersion: 'v1.0.5 (Patched)',
        status: 'passed',
        exitCode: 0,
        totalDurationMs: totalDuration,
        passedCount: 7,
        failedCount: 0,
        steps,
        executedAt: new Date().toLocaleTimeString(),
        rawConsoleLogs: logs,
      };

    } catch (assertErr) {
      // In buggy mode, this catch is the GENUINE Playwright assertion failure!
      const failDuration = Date.now() - t5;
      const toastElement = page.locator('[data-testid="success-toast"]');
      let toastText = '';
      try {
        if (await toastElement.isVisible({ timeout: 500 })) {
          toastText = await toastElement.textContent();
        }
      } catch (_) {}

      // Take a real screenshot of the failure state
      let screenshotBase64 = '';
      try {
        const buffer = await page.screenshot();
        screenshotBase64 = buffer.toString('base64');
      } catch (_) {}

      const errorMsg = `Playwright AssertionError: Timed out 3000ms waiting for expect(locator).toBeVisible()\nLocator: locator('[role="alert"]')\nExpected: visible\nReceived: hidden / not in DOM\n` + 
        (toastText ? `Unintended element present in DOM: <div data-testid="success-toast">${toastText.trim()}</div>` : '');

      steps.push({
        stepIndex: 6,
        description: 'Assert GSTIN Required Validation Alert is Visible',
        locator: "expect(page.getByRole('alert')).toBeVisible({ timeout: 3000 })",
        actionType: 'assert',
        status: 'failed',
        durationMs: failDuration,
        errorMessage: errorMsg,
        expectedValue: 'role="alert" with "GSTIN is required for commercial invoices."',
        actualValue: toastText ? `Rendered success toast: "${toastText.trim()}"` : 'Element omitted from DOM',
      });

      steps.push({
        stepIndex: 7,
        description: 'Assert False Success Toast is Blocked',
        locator: "expect(page.getByTestId('success-toast')).not.toBeVisible()",
        actionType: 'assert',
        status: 'pending',
        durationMs: 0,
      });

      logs.push(`❌ Step 6 FAILED: ${errorMsg}`);
      logs.push(`[PLAYWRIGHT-FAILURE] Reproduced Regression! Exit code: 1`);

      const totalDuration = Date.now() - startTime;

      return {
        buildMode: mode,
        buildVersion: 'v1.0.4 (Vulnerable)',
        status: 'failed',
        failureType: 'reproduced_bug',
        exitCode: 1,
        totalDurationMs: totalDuration,
        passedCount: 5,
        failedCount: 1,
        steps,
        failureSignature: {
          step: 6,
          expected: 'Visible validation alert: "GSTIN is required for commercial invoices."',
          received: toastText ? `Omitted validation alert. Emitted success toast: "${toastText.trim()}"` : 'Element not rendered',
          location: 'tests/invoice-gst.spec.ts:32:5',
        },
        screenshotBase64: screenshotBase64 ? `data:image/png;base64,${screenshotBase64}` : undefined,
        executedAt: new Date().toLocaleTimeString(),
        rawConsoleLogs: logs,
      };
    }

  } catch (globalErr) {
    logs.push(`[PLAYWRIGHT-FATAL] ${globalErr.message}`);
    return {
      buildMode: mode,
      buildVersion: mode === 'buggy' ? 'v1.0.4 (Vulnerable)' : 'v1.0.5 (Patched)',
      status: 'failed',
      failureType: 'infrastructure_error',
      exitCode: 1,
      totalDurationMs: Date.now() - startTime,
      passedCount: steps.filter(s => s.status === 'passed').length,
      failedCount: 1,
      steps: steps.length > 0 ? steps : [{
        stepIndex: 1,
        description: 'Browser Harness & Network Initialization',
        locator: 'playwright.chromium.launch()',
        actionType: 'navigate',
        status: 'failed',
        durationMs: Date.now() - startTime,
        errorMessage: `Infrastructure error: ${globalErr.message}`,
      }],
      rawConsoleLogs: logs,
      executedAt: new Date().toLocaleTimeString(),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Allow CLI execution: `node scripts/run-playwright-exec.cjs buggy` or `node scripts/run-playwright-exec.cjs fixed`
if (require.main === module) {
  const mode = process.argv[2] || 'buggy';
  const url = process.argv[3] || 'http://127.0.0.1:3000';
  runRealPlaywrightTest(mode, url).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.exitCode);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runRealPlaywrightTest };
