// lib/payfast.ts

interface PayFastPayload {
  // User-provided fields (never include merchant credentials here!)
//   return_url: string;
//   cancel_url: string;
//   notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string; // Your order ID
  amount: number;
  item_name: string;
  item_description?: string;
  custom_str1?: string; // Optional: store JSON metadata
}

/**
 * Generate PayFast payment URL with signature
 */
export function generatePayFastPaymentUrl(
  payload: PayFastPayload 
): string {
  const { 
    PAYFAST_MERCHANT_ID,
    PAYFAST_MERCHANT_KEY,
    PAYFAST_PASSPHRASE,
    PAYFAST_RETURN_URL,
    PAYFAST_CANCEL_URL,
    PAYFAST_ITN_URL
  } = process.env;

  if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY) {
    throw new Error('PayFast credentials missing in .env');
  }

  // ✅ Build final payload with SECURE credentials
  const payLoad = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: PAYFAST_RETURN_URL!,
    cancel_url: PAYFAST_CANCEL_URL!,
    notify_url: PAYFAST_ITN_URL!,
    ...payload, // User data merged AFTER credentials
  };

  // Generate signature
  const signature = generateSignature(payLoad, PAYFAST_PASSPHRASE);

  // Build query string
  const params = new URLSearchParams();
  Object.entries(payLoad).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  params.append('signature', signature);

  return `https://www.payfast.co.za/eng/process?${params.toString()}`;
}

/**
 * Generate PayFast signature
 */
function generateSignature(payload: Record<string, any>, passphrase?: string): string {
  // Sort keys alphabetically
  const sortedKeys = Object.keys(payload).sort();
  
  // Build string to sign
  let stringToSign = '';
  sortedKeys.forEach(key => {
    const value = payload[key];
    if (value !== undefined && value !== null && value !== '') {
      stringToSign += `${key}=${encodeURIComponent(String(value))}&`;
    }
  });
  stringToSign = stringToSign.slice(0, -1); // Remove trailing '&'

  // Add passphrase if exists
  if (passphrase) {
    stringToSign += `&passphrase=${encodeURIComponent(passphrase)}`;
  }

  // Generate MD5 hash
  const crypto = require('crypto');
  return crypto.createHash('md5').update(stringToSign).digest('hex');
}

/**
 * Verify PayFast ITN signature
 */
export function verifyPayFastSignature(
  body: Record<string, any>,
  expectedSignature: string,
  passphrase?: string
): boolean {
  const { signature, ...payload } = body;

  // Rebuild string to sign
  const sortedKeys = Object.keys(payload).sort();
  let stringToSign = '';
  sortedKeys.forEach(key => {
    const value = payload[key];
    if (value !== undefined && value !== null && value !== '') {
      stringToSign += `${key}=${encodeURIComponent(String(value))}&`;
    }
  });
  stringToSign = stringToSign.slice(0, -1);

  if (passphrase) {
    stringToSign += `&passphrase=${encodeURIComponent(passphrase)}`;
  }

  const crypto = require('crypto');
  const computedSignature = crypto.createHash('md5').update(stringToSign).digest('hex');
  
  return computedSignature === expectedSignature;
}