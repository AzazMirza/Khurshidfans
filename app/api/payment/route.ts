
// app/api/checkout/route.ts
import { NextRequest } from 'next/server';
import { generatePayFastPaymentData } from '@/lib/payfast';
import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  // return NextResponse.json({ success: true }, { status: 219 });
  try {
    const {
      // orderId,
      amount,
      itemName,
      customerEmail,
      customerFirstName,
      customerLastName,
    } = await request.json();

    // Validate input
    if ( !amount || !itemName || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate PayFast URL
    const paymentUrl = generatePayFastPaymentData({
      // m_payment_id: orderId,
      amount: parseFloat(amount.toFixed(2)),
      item_name: itemName,
      name_first: customerFirstName,
      name_last: customerLastName,
      email_address: customerEmail,
    });
    return NextResponse.json({ paymentUrl });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

