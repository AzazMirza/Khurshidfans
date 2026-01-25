// // app/api/payfast/webhook/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyPayFastSignature } from '@/lib/payfast';
// import { prisma } from '@/lib/prisma';

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
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
//     }

//     // Only process successful payments
//     if (body.payment_status === 'COMPLETE') {
//       // Extract data
//       const {
//         m_payment_id, // your order ID (if you passed it)
//         amount_gross,
//         custom_str1, // optional: store guestId/userId here
//         email_address,
//         name_first,
//         name_last,
//       } = body;

//       // TODO: Create order, send WhatsApp, clear cart
//       // Use data from `custom_str1` or look up by email

//       console.log('✅ Payment confirmed:', amount_gross);
//     }

//     // Return 200 OK to stop retries
//     return new NextResponse(null, { status: 200 });
//   } catch (error) {
//     console.error('Webhook error:', error);
//     return NextResponse.json({ error: 'Internal error' }, { status: 500 });
//   }
// }