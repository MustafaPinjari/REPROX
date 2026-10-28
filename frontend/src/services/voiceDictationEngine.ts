import type { VoiceBugReport, RecordedEvent } from '../types';

/**
 * High-precision Wispr Flow Bug Intent Parser (Deterministic, zero paid AI APIs)
 * Extracts structured bug entities: Feature, Action, Expected Outcome, Actual Outcome, Severity.
 */
export function parseWisprVoiceIntent(transcript: string): VoiceBugReport['detectedIntent'] {
  const lower = transcript.toLowerCase();

  // 1. Detect feature area & target app
  let feature = 'Application Workflow Verification';
  let actionTaken = 'Executed user workflow actions';
  let expectedOutcome = 'Application validates input and updates state cleanly';
  let actualOutcome = transcript;
  let severity: VoiceBugReport['detectedIntent']['severity'] = 'high';

  const isFoodDelivery =
    lower.includes('zepto') ||
    lower.includes('food') ||
    lower.includes('swiggy') ||
    lower.includes('zomato') ||
    lower.includes('blinkit') ||
    lower.includes('grocery') ||
    lower.includes('groceries') ||
    lower.includes('meal') ||
    lower.includes('doordash') ||
    lower.includes('instacart') ||
    (lower.includes('order') && (lower.includes('cant') || lower.includes("can't") || lower.includes('fail')));

  if (isFoodDelivery) {
    const appName = lower.includes('swiggy')
      ? 'Swiggy'
      : lower.includes('zomato')
      ? 'Zomato'
      : lower.includes('blinkit')
      ? 'Blinkit'
      : 'Zepto';
    feature = `${appName} Quick Commerce & Food Ordering`;
    actionTaken = `Placing food & groceries order on ${appName}`;
    expectedOutcome = `Order placed successfully with confirmed ETA within 10 minutes`;
    actualOutcome = transcript || `Cannot order food on ${appName}; checkout fails or times out`;
    severity = 'critical';
  } else if (
    lower.includes('amazon') ||
    lower.includes('cart') ||
    lower.includes('card') ||
    lower.includes('item') ||
    lower.includes('buy') ||
    lower.includes('shop') ||
    lower.includes('product')
  ) {
    feature = 'Amazon E-Commerce Cart & Checkout Pipeline';
    actionTaken = 'Adding selected product item to shopping cart on Amazon';
    expectedOutcome = 'Item attached to cart session with cart badge count incrementing to 1';
    actualOutcome = transcript || 'Item is not getting added to cart; cart count remains 0 despite click';
    severity = 'critical';
  } else if (lower.includes('invoice') || lower.includes('bill') || lower.includes('gst') || lower.includes('tax')) {
    feature = 'Commercial Invoice Dispatch & GSTIN Validation';
    actionTaken = 'Submitting commercial B2B invoice without providing mandatory GSTIN';
    expectedOutcome = 'Show validation alert: "GSTIN is required for commercial invoices" and prevent dispatch';
    actualOutcome = 'Application displays "Invoice Dispatched Successfully" toast despite invalid tax credentials';
    severity = 'critical';
  } else if (lower.includes('auth') || lower.includes('login') || lower.includes('password') || lower.includes('signin')) {
    feature = 'User Authentication & Session Access Control';
    actionTaken = 'Submitting user credentials on authentication portal';
    expectedOutcome = 'Authenticated user issued session token and redirected to dashboard';
    actualOutcome = transcript || 'Authentication rejected; session token missing or login loop triggered';
    severity = 'high';
  } else if (lower.includes('checkout') || lower.includes('payment') || lower.includes('stripe')) {
    feature = 'Payment Gateway Processing & Settlement';
    actionTaken = 'Submitting card payment transaction';
    expectedOutcome = 'Payment authorized and receipt confirmation toast displayed';
    actualOutcome = transcript || 'Gateway rejected transaction without explanatory validation error';
    severity = 'critical';
  } else {
    // Dynamic free-form bug extraction
    const appMatch = transcript.match(/(?:on|in|for|at)\s+([A-Za-z0-9_-]+)/i);
    const detectedApp = appMatch ? appMatch[1] : 'Application';
    feature = `${detectedApp.charAt(0).toUpperCase() + detectedApp.slice(1)} Client Workflow Verification`;
    actionTaken = `Executed action on ${detectedApp}`;
    expectedOutcome = 'Target action completes successfully with confirmed UI response';
    actualOutcome = transcript;
    severity = lower.includes('critical') || lower.includes('block') || lower.includes('cant') || lower.includes("can't") ? 'critical' : 'high';
  }

  return {
    feature,
    actionTaken,
    expectedOutcome,
    actualOutcome,
    severity,
  };
}

/**
 * Automatically synthesizes realistic, testable Playwright recorded events
 * based on the user's spoken voice report.
 */
export function synthesizeTimelineEventsForReport(
  transcript: string,
  _intent?: VoiceBugReport['detectedIntent']
): RecordedEvent[] {
  const lower = transcript.toLowerCase();
  const now = Date.now();
  const isFoodDelivery =
    lower.includes('zepto') ||
    lower.includes('food') ||
    lower.includes('swiggy') ||
    lower.includes('zomato') ||
    lower.includes('blinkit') ||
    lower.includes('grocery') ||
    lower.includes('groceries') ||
    lower.includes('meal') ||
    lower.includes('doordash') ||
    lower.includes('instacart') ||
    (lower.includes('order') && (lower.includes('cant') || lower.includes("can't") || lower.includes('fail')));

  // Scenario 1: Zepto / Quick Commerce Food & Grocery Ordering
  if (isFoodDelivery) {
    const appName = lower.includes('swiggy')
      ? 'Swiggy'
      : lower.includes('zomato')
      ? 'Zomato'
      : lower.includes('blinkit')
      ? 'Blinkit'
      : 'Zepto';
    const domain = lower.includes('swiggy')
      ? 'https://www.swiggy.com'
      : lower.includes('zomato')
      ? 'https://www.zomato.com'
      : lower.includes('blinkit')
      ? 'https://www.blinkit.com'
      : 'https://www.zeptonow.com';

    return [
      {
        id: `EVT-${now}-1`,
        timestamp: now - 85000,
        type: 'navigate',
        selector: domain,
        targetLabel: `${appName} Quick Commerce & Food Delivery`,
        value: domain,
        description: `Navigate to ${appName} food ordering platform`,
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-2`,
        timestamp: now - 65000,
        type: 'fill',
        selector: 'input[placeholder*="Search"]',
        targetRole: 'searchbox',
        targetLabel: 'Search for groceries & food',
        targetTestId: 'input-search-catalog',
        value: 'Fresh Meal Box',
        description: 'Searched catalog for food item: "Fresh Meal Box"',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-3`,
        timestamp: now - 45000,
        type: 'click',
        selector: '#add-food-item-btn',
        targetRole: 'button',
        targetLabel: 'Add to Cart',
        targetTestId: 'btn-add-food-item',
        description: 'Clicked "Add to Cart" for selected food item',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-4`,
        timestamp: now - 25000,
        type: 'click',
        selector: '#place-order-btn',
        targetRole: 'button',
        targetLabel: 'Place Food Order',
        targetTestId: 'btn-place-order',
        description: 'Clicked "Place Food Order" button at checkout',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-5`,
        timestamp: now - 5000,
        type: 'assert',
        selector: '[data-testid="order-confirmation"]',
        targetRole: 'status',
        targetTestId: 'order-confirmation',
        value: 'Order Confirmed - Arriving in 10 mins',
        description: `Assert ${appName} order confirmation screen is displayed with ETA`,
        isPiiMasked: false,
      },
    ];
  }

  // E-Commerce / Amazon Add-to-Cart Failure Scenario
  if (
    lower.includes('amazon') ||
    lower.includes('cart') ||
    lower.includes('card') ||
    lower.includes('item') ||
    lower.includes('shop')
  ) {
    return [
      {
        id: `EVT-${now}-1`,
        timestamp: now - 80000,
        type: 'navigate',
        selector: 'https://www.amazon.com/dp/B09V3HB57G',
        targetLabel: 'Amazon Product Detail Page',
        value: 'https://www.amazon.com/dp/B09V3HB57G',
        description: 'Navigate to Amazon product catalog detail page',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-2`,
        timestamp: now - 60000,
        type: 'click',
        selector: '#add-to-cart-button',
        targetRole: 'button',
        targetLabel: 'Add to Cart',
        targetTestId: 'add-to-cart-button',
        description: 'Clicked "Add to Cart" button',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-3`,
        timestamp: now - 40000,
        type: 'click',
        selector: '#nav-cart',
        targetRole: 'link',
        targetLabel: 'Shopping Cart',
        targetTestId: 'nav-cart',
        description: 'Clicked Shopping Cart header icon to inspect session items',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-4`,
        timestamp: now - 20000,
        type: 'assert',
        selector: '#nav-cart-count',
        targetRole: 'status',
        targetTestId: 'nav-cart-count',
        value: '1',
        description: 'Assert Cart Item Counter displays "1"',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-5`,
        timestamp: now - 5000,
        type: 'assert',
        selector: '[data-name="Active Items"]',
        targetRole: 'region',
        targetTestId: 'active-cart-items',
        value: 'In Stock',
        description: 'Assert selected product is present in active cart list',
        isPiiMasked: false,
      },
    ];
  }

  // Authentication Failure Scenario
  if (lower.includes('auth') || lower.includes('login') || lower.includes('password')) {
    return [
      {
        id: `EVT-${now}-1`,
        timestamp: now - 60000,
        type: 'navigate',
        selector: 'https://app.reprox.dev/login',
        targetLabel: 'Login Portal',
        value: 'https://app.reprox.dev/login',
        description: 'Navigate to user authentication portal',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-2`,
        timestamp: now - 45000,
        type: 'fill',
        selector: '#userEmail',
        targetRole: 'textbox',
        targetLabel: 'Email Address',
        value: 'qa.engineer@company.com',
        description: 'Entered account email: "qa.engineer@company.com"',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-3`,
        timestamp: now - 30000,
        type: 'fill',
        selector: '#userPassword',
        targetRole: 'textbox',
        targetLabel: 'Account Password',
        value: '••••••••••••',
        maskedValue: '[REDACTED_PASSWORD]',
        description: 'Entered account password',
        isPiiMasked: true,
      },
      {
        id: `EVT-${now}-4`,
        timestamp: now - 15000,
        type: 'click',
        selector: '#submitLoginBtn',
        targetRole: 'button',
        targetLabel: 'Sign In',
        description: 'Clicked "Sign In" button',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-5`,
        timestamp: now - 5000,
        type: 'assert',
        selector: '[role="alert"]',
        targetRole: 'alert',
        value: 'Invalid credentials or expired session token',
        description: 'Assert authentication error banner is visible',
        isPiiMasked: false,
      },
    ];
  }

  // Commercial Invoicing & Statutory Tax Compliance Scenario
  if (
    lower.includes('invoice') ||
    lower.includes('gst') ||
    lower.includes('tax') ||
    lower.includes('acme') ||
    lower.includes('bill') ||
    !lower.trim()
  ) {
    return [
      {
        id: `EVT-${now}-1`,
        timestamp: now - 120000,
        type: 'fill',
        selector: '#clientName',
        targetLabel: 'Client Business Name',
        targetTestId: 'input-client-name',
        targetRole: 'textbox',
        value: 'Acme Global Ltd',
        description: 'Entered client name: "Acme Global Ltd"',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-2`,
        timestamp: now - 95000,
        type: 'fill',
        selector: '#invoiceAmount',
        targetLabel: 'Invoice Total (USD)',
        targetTestId: 'input-amount',
        targetRole: 'textbox',
        value: '4850.00',
        description: 'Entered total amount: "$4850.00"',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-3`,
        timestamp: now - 70000,
        type: 'fill',
        selector: '#gstinNumber',
        targetLabel: 'GST Identification Number (GSTIN)',
        targetTestId: 'input-gstin',
        targetRole: 'textbox',
        value: '',
        description: 'Left GSTIN input empty (omitted statutory tax id)',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-4`,
        timestamp: now - 45000,
        type: 'click',
        selector: '#dispatchInvoiceBtn',
        targetRole: 'button',
        targetLabel: 'Generate & Dispatch Invoice',
        targetTestId: 'btn-dispatch-invoice',
        description: 'Clicked "Generate & Dispatch Invoice"',
        isPiiMasked: false,
      },
      {
        id: `EVT-${now}-5`,
        timestamp: now - 30000,
        type: 'assert',
        selector: '[role="alert"]',
        targetRole: 'alert',
        value: 'GSTIN is required for commercial invoices.',
        description: 'Validation assert: GSTIN required alert must be visible',
        isPiiMasked: false,
      },
    ];
  }

  // Dynamic Free-form Application Reproduction for ANY other domain or app
  const appMatch = transcript.match(/(?:on|in|for|at)\s+([A-Za-z0-9_-]+)/i);
  const detectedApp = appMatch ? appMatch[1] : 'Application';
  const appSlug = detectedApp.toLowerCase().replace(/[^a-z0-9]/g, '');
  const domain = `https://www.${appSlug || 'app'}.com`;

  return [
    {
      id: `EVT-${now}-1`,
      timestamp: now - 80000,
      type: 'navigate',
      selector: domain,
      targetLabel: `${detectedApp} Application Interface`,
      value: domain,
      description: `Navigate to ${detectedApp} main portal (${domain})`,
      isPiiMasked: false,
    },
    {
      id: `EVT-${now}-2`,
      timestamp: now - 55000,
      type: 'fill',
      selector: '#actionInput',
      targetLabel: 'Action Parameter Input',
      targetTestId: 'input-action-field',
      targetRole: 'textbox',
      value: transcript.slice(0, 45),
      description: `Entered workflow parameter: "${transcript.slice(0, 45)}"`,
      isPiiMasked: false,
    },
    {
      id: `EVT-${now}-3`,
      timestamp: now - 30000,
      type: 'click',
      selector: '#submitActionBtn',
      targetRole: 'button',
      targetLabel: 'Submit Workflow Action',
      targetTestId: 'btn-submit-action',
      description: `Clicked action execution trigger on ${detectedApp}`,
      isPiiMasked: false,
    },
    {
      id: `EVT-${now}-4`,
      timestamp: now - 5000,
      type: 'assert',
      selector: '[role="status"]',
      targetRole: 'status',
      targetTestId: 'status-banner',
      value: 'Action completed successfully',
      description: `Assert ${detectedApp} displays confirmed completion state`,
      isPiiMasked: false,
    },
  ];
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
