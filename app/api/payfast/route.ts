// // app/api/payfast/webhook/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyPayFastSignature } from '@/lib/payfast';

// export async function POST(request: NextRequest) {
//   try {
//     // Parse raw body (required for signature verification)
//     const rawBody = await request.text();
//     const body = Object.fromEntries(new URLSearchParams(rawBody));

//     // Verify signature
//     const isValid = verifyPayFastSignature(
//       body,
//       body.signature,
//       process.env.PAYFAST_PASSPHRASE
//     );

//     if (!isValid) {
//       console.error('Invalid PayFast signature');
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//     }

//     // Handle payment status
//     const { payment_status, m_payment_id, amount_gross } = body;

//     if (payment_status === 'COMPLETE') {
//       // ✅ Payment successful!
//       console.log(`Order ${m_payment_id} paid: R${amount_gross}`);
      
//       // Update your database:
//       // - Mark order as paid
//       // - Send confirmation email
//       // - Fulfill order
//     }

//     // Return 200 OK to stop retries
//     return new NextResponse(null, { status: 200 });
//   } catch (error) {
//     console.error('Webhook error:', error);
//     return NextResponse.json({ error: 'Internal error' }, { status: 500 });
//   }
// }


// app/api/payfast/redirect/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const {
//       amount,
//       itemName,
//       customerEmail,
//       customerFirstName,
//       customerLastName,
//       phoneNumber,
//       street,
//       city,
//       stateProvince,
//       country,
//       zipCode,
//     } = await request.json();

//     // Validate input
//     if (!amount || !customerEmail) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Generate basket_id (FLUX-XXXX)
//     const randomString = Math.random().toString(36).substring(2, 6).toUpperCase().slice(0, 4);
//     const basketId = `FLUX-${randomString}`;

//     // PayFast credentials (store in .env)
//     const merchantId = process.env.PAYFAST_MERCHANT_ID;
//     const securedKey = process.env.PAYFAST_SECURED_KEY;
//     // const merchantId: number = 102;
//     // const securedKey = 'zWHjBp2AlttNu1sK';

//     if (!merchantId || !securedKey) {
//       throw new Error('PayFast credentials missing');
//     }       

// const body = new URLSearchParams({
//   MERCHANT_ID: merchantId.toString(),
//   SECURED_KEY: securedKey,
//   BASKET_ID: basketId,
//   TXNAMT: amount.toString(),
//   CURRENCY_CODE: 'PKR',
// }).toString();


//     // 1. Get ACCESS_TOKEN from PayFast
//     const tokenResponse = await fetch(
//       'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: body,
//       }
//     );

//     console.log(tokenResponse.status);

//     const tokenData = await tokenResponse.json();
//     if (!tokenData.ACCESS_TOKEN) {
//       throw new Error('Failed to get access token');
//     }

//     // 2. Build HTML form with all required fields
//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Redirecting to PayFast...</title>
// </head>
// <body>
//   <form id="payfastForm" method="POST" action="https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction">
//     <input type="hidden" name="CURRENCY_CODE" value="PKR" />
//     <input type="hidden" name="MERCHANT_ID" value="${merchantId}" />
//     <input type="hidden" name="MERCHANT_NAME" value="Khurshid Fans" />
//     <input type="hidden" name="TOKEN" value="${tokenData.ACCESS_TOKEN}" />
//     <input type="hidden" name="BASKET_ID" value="${basketId}" />
//     <input type="hidden" name="TXNAMT" value="${amount}" />
//     <input type="hidden" name="ORDER_DATE" value="${new Date().toISOString()}" />
//     <input type="hidden" name="SUCCESS_URL" value="${process.env.PAYFAST_SUCCESS_URL}" />
//     <input type="hidden" name="FAILURE_URL" value="${process.env.PAYFAST_FAILURE_URL}" />
//     <input type="hidden" name="CHECKOUT_URL" value="${process.env.PAYFAST_CHECKOUT_URL}" />
//     <input type="hidden" name="CUSTOMER_EMAIL_ADDRESS" value="${customerEmail}" />
//     <input type="hidden" name="CUSTOMER_MOBILE_NO" value="${phoneNumber || ''}" />
//     <input type="hidden" name="SIGNATURE" value="SOME-RANDOM-STRING" />
//     <input type="hidden" name="VERSION" value="MERCHANT-CART-0.1" />
//     <input type="hidden" name="TXNDESC" value="${itemName}" />
//     <input type="hidden" name="PROCCODE" value="00" />
//     <input type="hidden" name="TRAN_TYPE" value="ECOMM_PURCHASE" />
//     <input type="hidden" name="STORE_ID" value="" />
//     <input type="hidden" name="RECURRING_TXN" value="" />
//     <input type="hidden" name="MERCHANT_USERAGENT" value="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" />
    
//     <!-- Items (optional but recommended) -->
//     <input type="hidden" name="ITEMS[0][SKU]" value="ORDER-${basketId}" />
//     <input type="hidden" name="ITEMS[0][NAME]" value="${itemName}" />
//     <input type="hidden" name="ITEMS[0][PRICE]" value="${amount}" />
//     <input type="hidden" name="ITEMS[0][QTY]" value="1" />
//   </form>
  
//   <script>
//     document.getElementById('payfastForm').submit();
//   </script>
// </body>
// </html>`;

//     return new NextResponse(html, {
//       headers: { 'Content-Type': 'text/html' },
//     });

//   } catch (error: any) {
//     console.error('PayFast redirect error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// app/api/payfast/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      itemName,
      customerEmail,
      customerFirstName,
      customerLastName,
      phoneNumber,
      street,
      city,
      stateProvince,
      country,
      zipCode,
    } = await request.json();

    if (!amount || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate basket_id
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase().padEnd(4, 'X').slice(0, 4);
    const basketId = `FLUX-${randomString}`;

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const securedKey = process.env.PAYFAST_SECURED_KEY;

    if (!merchantId || !securedKey) {
      throw new Error('PAYFAST_MERCHANT_ID or PAYFAST_SECURED_KEY missing');
    }

    // Get token
    const tokenBody = new URLSearchParams({
      MERCHANT_ID: merchantId,
      SECURED_KEY: securedKey,
      BASKET_ID: basketId,
      TXNAMT: amount.toString(),
      CURRENCY_CODE: 'PKR',
    });

    const tokenRes = await fetch(`https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData?.ACCESS_TOKEN) {
      console.error('Token response:', tokenData);
      throw new Error('No ACCESS_TOKEN received');
    }

    // Build URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khurshidfans.vercel.app';
    const successUrl = `${siteUrl}/success?orderId=${basketId}`;
    const failureUrl = `${siteUrl}/failure?orderId=${basketId}`;
    const checkoutUrl = `${siteUrl}/checkout`;

    // Format date correctly
    const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // ✅ Generate HTML form (NO SIGNATURE)
    const html = `
<!DOCTYPE html>
<html>
<head><title>Redirecting...</title></head>
<body>
  <form id="payfastForm" method="POST" action="https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction">
    <input type="hidden" name="CURRENCY_CODE" value="PKR" />
    <input type="hidden" name="MERCHANT_ID" value="${merchantId}" />
    <input type="hidden" name="MERCHANT_NAME" value="Khurshid Fans" />
    <input type="hidden" name="TOKEN" value="${tokenData.ACCESS_TOKEN}" />
    <input type="hidden" name="BASKET_ID" value="${basketId}" />
    <input type="hidden" name="TXNAMT" value="${amount}" />
    <input type="hidden" name="ORDER_DATE" value="${orderDate}" />
    <input type="hidden" name="SUCCESS_URL" value="${successUrl}" />
    <input type="hidden" name="FAILURE_URL" value="${failureUrl}" />
    <input type="hidden" name="CHECKOUT_URL" value="${checkoutUrl}" />
    <input type="hidden" name="CUSTOMER_EMAIL_ADDRESS" value="${customerEmail}" />
    <input type="hidden" name="CUSTOMER_MOBILE_NO" value="${phoneNumber || ''}" />
    <!-- ❌ REMOVE SIGNATURE -->
    <input type="hidden" name="VERSION" value="MERCHANT-CART-0.1" />
    <input type="hidden" name="TXNDESC" value="${itemName || 'Order'}" />
    <input type="hidden" name="PROCCODE" value="00" />
    <input type="hidden" name="TRAN_TYPE" value="ECOMM_PURCHASE" />
    <input type="hidden" name="STORE_ID" value="" />
    <input type="hidden" name="RECURRING_TXN" value="" />
    <input type="hidden" name="MERCHANT_USERAGENT" value="Next.js App" />
    
    <input type="hidden" name="ITEMS[0][SKU]" value="ORDER-${basketId}" />
    <input type="hidden" name="ITEMS[0][NAME]" value="${itemName || 'Order'}" />
    <input type="hidden" name="ITEMS[0][PRICE]" value="${amount}" />
    <input type="hidden" name="ITEMS[0][QTY]" value="1" />
  </form>
  <script>document.getElementById('payfastForm').submit();</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error: any) {
    console.error('PayFast error:', error.message, error.stack);
    return NextResponse.json({ error: error.message || 'Payment failed' }, { status: 500 });
  }
}