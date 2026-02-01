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

    // Validate required fields
    if (!amount || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate basket_id (FLUX-XXXX)
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()
      .padEnd(4, 'X')
      .slice(0, 4);
    const basketId = `FLUX-${randomString}`;

    // Get credentials from environment
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const securedKey = process.env.PAYFAST_SECURED_KEY;
    const paymentsuccessUrl = process.env.PAYFAST_SUCCESS_URL;
    const paymentfailUrl = process.env.PAYFAST_CANCEL_URL;

    if (!merchantId || !securedKey) {
      throw new Error('PAYFAST_MERCHANT_ID or PAYFAST_SECURED_KEY missing in environment');
    }

    // ✅ Use ipguat as confirmed by you (NO TRAILING SPACES!)
    const baseUrl = 'https://ipguat.apps.net.pk';

    // Step 1: Get ACCESS_TOKEN
    const tokenBody = new URLSearchParams({
      MERCHANT_ID: merchantId,
      SECURED_KEY: securedKey,
      BASKET_ID: basketId,
      TXNAMT: amount.toString(),
      CURRENCY_CODE: 'PKR',
    });

    const tokenRes = await fetch(`${baseUrl}/Ecommerce/api/Transaction/GetAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData?.ACCESS_TOKEN) {
      console.error('Token response:', tokenData);
      throw new Error('Failed to get PayFast access token');
    }

    // Build callback URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${siteUrl}/paymentsuccessUrl?orderId=${basketId}`;
    const failureUrl = `${siteUrl}/paymentfailUrl?orderId=${basketId}`;
    const checkoutUrl = `${siteUrl}/listing/checkout`;
    

    // Format date as YYYY-MM-DD HH:mm:ss
    const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // ✅ Generate HTML form (NO SIGNATURE FIELD!)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Processing Payment...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; background:#f5f5f5; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:system-ui,-apple-system,sans-serif;">
  <div style="background:white; padding:2rem; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); text-align:center; max-width:400px;">
    <h2 style="color:#009395; margin-top:0;">Redirecting to Payment...</h2>
    <p>Please wait while we securely redirect you to PayFast.</p>
    <div style="margin-top:1.5rem; font-size:0.875rem; color:#666;">
      Order ID: ${basketId}
    </div>
    
    <form id="payfastForm" method="POST" action="${baseUrl}/Ecommerce/api/Transaction/PostTransaction" style="display:none;">
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
      <!-- ❌ SIGNATURE REMOVED - NOT REQUIRED -->
      <input type="hidden" name="VERSION" value="MERCHANT-CART-0.1" />
      <input type="hidden" name="TXNDESC" value="${itemName || 'Order'}" />
      <input type="hidden" name="PROCCODE" value="00" />
      <input type="hidden" name="TRAN_TYPE" value="ECOMM_PURCHASE" />
      <input type="hidden" name="STORE_ID" value="" />
      <input type="hidden" name="RECURRING_TXN" value="" />
      <input type="hidden" name="MERCHANT_USERAGENT" value="Next.js App" />
      
      <!-- Order Items -->
      <input type="hidden" name="ITEMS[0][SKU]" value="ORDER-${basketId}" />
      <input type="hidden" name="ITEMS[0][NAME]" value="${itemName || 'Order'}" />
      <input type="hidden" name="ITEMS[0][PRICE]" value="${amount}" />
      <input type="hidden" name="ITEMS[0][QTY]" value="1" />
    </form>
  </div>

  <script>
    // Auto-submit after 1 second
    setTimeout(() => {
      document.getElementById('payfastForm').submit();
    }, 1000);
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, must-revalidate'
      },
    });

  } catch (error: any) {
    console.error('PayFast API error:', error.message, error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Payment initialization failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}