// app/api/payfast/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyPayFastSignature } from '@/lib/payfast';

export async function POST(request: NextRequest) {
  try {
    // Parse raw body (required for signature verification)
    const rawBody = await request.text();
    const body = Object.fromEntries(new URLSearchParams(rawBody));

    // Verify signature
    const isValid = verifyPayFastSignature(
      body,
      body.signature,
      process.env.PAYFAST_PASSPHRASE
    );

    if (!isValid) {
      console.error('Invalid PayFast signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Handle payment status
    const { payment_status, m_payment_id, amount_gross } = body;

    if (payment_status === 'COMPLETE') {
      // ✅ Payment successful!
      console.log(`Order ${m_payment_id} paid: R${amount_gross}`);
      
      // Update your database:
      // - Mark order as paid
      // - Send confirmation email
      // - Fulfill order
    }

    // Return 200 OK to stop retries
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}