// lib/payfast.ts

import { NextRequest } from 'next/server';

interface PayFastPayload {

  // item_name: string;    // TXNDESC
  amount: number;           // TXNAMT
  email: string;            // CUSTOMER_EMAIL_ADDRESS
  mobile: string;           // CUSTOMER_MOBILE_NO
  orderId: string;          // BASKET_ID (your order ID)
  itemDescription?: string; // TXNDESC
}

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_SECURED_KEY = process.env.PAYFAST_SECURED_KEY;

if (!PAYFAST_MERCHANT_ID || !PAYFAST_SECURED_KEY) {
  throw new Error('Missing PayFast Pakistan credentials in environment variables');
}

/**
 * Step 1: Get access token from PayFast Pakistan
 */
// async function getAccessToken(
//   basketId: string,
//   txnAmt: number,
//   currencyCode = 'PKR'
// ): Promise<string> {
//   // Ensure environment variables are defined
//   const MERCHANT_ID = process.env.PAYFAST_PAK_MERCHANT_ID;
//   const SECURED_KEY = process.env.PAYFAST_PAK_SECURED_KEY;

//   if (!MERCHANT_ID || !SECURED_KEY) {
//     throw new Error(
//       'Missing PAYFAST_PAK_MERCHANT_ID or PAYFAST_PAK_SECURED_KEY in environment variables'
//     );
//   }

//   // ✅ Fixed URL: removed trailing spaces!
//   const url = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken';

//   // ✅ Build params safely (no undefined values)
//   const params = new URLSearchParams();
//   params.append('MERCHANT_ID', MERCHANT_ID);
//   params.append('SECURED_KEY', SECURED_KEY);
//   params.append('BASKET_ID', basketId);
//   params.append('TXNAMT', txnAmt.toString());
//   params.append('CURRENCY_CODE', currencyCode);

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     });

//     if (!response.ok) {
//       const errorText = await response.text().catch(() => 'Unknown error');
//       throw new Error(
//         `PayFast token request failed: ${response.status} ${response.statusText}. Body: ${errorText}`
//       );
//     }

//     const data = await response.json().catch((err) => {
//       throw new Error(`Invalid JSON response from PayFast: ${err.message}`);
//     });

//     if (!data?.ACCESS_TOKEN) {
//       throw new Error(
//         `PayFast did not return ACCESS_TOKEN. Response: ${JSON.stringify(data)}`
//       );
//     }

//     return data.ACCESS_TOKEN;
//   } catch (error: any) {
//     console.error('❌ PayFast getAccessToken error:', error.message);
//     throw error;
//   }
// }
/**
 * Step 2: Generate full transaction data for frontend form submission
 */
// export async function generatePayFastPaymentUrl(
//   payload: PayFastPayload
// ) {
//   const { amount, email, mobile, orderId, itemDescription = 'Order Payment' } = payload;

//   // Get token
//   const token = await getAccessToken(orderId, amount);

//   // Prepare form fields for frontend
//   const formData = {
//     MERCHANT_ID: PAYFAST_MERCHANT_ID,
//     TOKEN: token,
//     BASKET_ID: orderId,
//     TXNAMT: amount.toString(),
//     CURRENCY_CODE: 'PKR',
//     ORDER_DATE: new Date().toISOString().slice(0, 19).replace('T', ' '),
//     SUCCESS_URL: `${process.env.NEXT_PUBLIC_SITE_URL}/success?orderId=${orderId}`,
//     FAILURE_URL: `${process.env.NEXT_PUBLIC_SITE_URL}/failure?orderId=${orderId}`,
//     CHECKOUT_URL: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
//     CUSTOMER_EMAIL_ADDRESS: email,
//     CUSTOMER_MOBILE_NO: mobile,
//     TXNDESC: itemDescription,
//     PROCCODE: '00',
//     TRAN_TYPE: 'ECOMM_PURCHASE',
//     VERSION: 'MERCHANT-CART-0.1',
//     MERCHANT_NAME: 'Khurshid Fans',
//     MERCHANT_USERAGENT: 'Next.js App',
//   };

//   return formData;
// }


// lib/payfast.ts

interface PayFastPayload {
  amount: number;
  email: string;
  mobile: string;
  orderId: string;
  itemDescription?: string;
}

/**
 * Generates payment form data for PayFast gateway.
 * This initiates a server-side token request and returns
 * all fields needed for frontend form submission.
 */
export async function generatePayFastPaymentData(
  payload: PayFastPayload
) {
  const {
    amount,
    email,
    mobile,
    orderId,
    itemDescription = 'Order Payment',
  } = payload;


  const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
  const SECURED_KEY = process.env.PAYFAST_SECURED_KEY;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  if (!MERCHANT_ID || !SECURED_KEY) {
    throw new Error('Missing PAYFAST_MERCHANT_ID or PAYFAST_SECURED_KEY');
  }

  // Get access token from PayFast
  const token = await getAccessToken(orderId, amount);

  return {
    MERCHANT_ID,
    TOKEN: token,
    BASKET_ID: orderId,
    TXNAMT: amount.toString(),
    CURRENCY_CODE: 'PKR',
    ORDER_DATE: new Date().toISOString().slice(0, 19).replace('T', ' '),
    SUCCESS_URL: `${SITE_URL}/success?orderId=${orderId}`,
    FAILURE_URL: `${SITE_URL}/failure?orderId=${orderId}`,
    CHECKOUT_URL: `${SITE_URL}/checkout`,
    CUSTOMER_EMAIL_ADDRESS: email,
    CUSTOMER_MOBILE_NO: mobile,
    TXNDESC: itemDescription,
    PROCCODE: '00',
    TRAN_TYPE: 'ECOMM_PURCHASE',
    VERSION: 'MERCHANT-CART-0.1',
    MERCHANT_NAME: 'Khurshid Fans',
    MERCHANT_USERAGENT: 'Next.js App',
  };
}

// --- Helper: Get Access Token ---
async function getAccessToken(basketId: string, txnAmt: number): Promise<string> {
  const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
  const SECURED_KEY = process.env.PAYFAST_SECURED_KEY!;

  const url = 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken'; // sandbox

  const params = new URLSearchParams();
  params.append('MERCHANT_ID', MERCHANT_ID);
  params.append('SECURED_KEY', SECURED_KEY);
  params.append('BASKET_ID', basketId);
  params.append('TXNAMT', txnAmt.toString());
  params.append('CURRENCY_CODE', 'PKR');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    throw new Error(`Token request failed: ${response.status} – ${text}`);
  }

  const data = await response.json();
  if (!data?.ACCESS_TOKEN) {
    throw new Error('No ACCESS_TOKEN received from PayFast');
  }

  return data.ACCESS_TOKEN;
}