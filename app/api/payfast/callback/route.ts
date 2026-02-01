import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { BASKET_ID, TXNSTATUS } = data;

    if (!BASKET_ID || !TXNSTATUS) {
      return NextResponse.json(
        { error: "Invalid callback data" },
        { status: 400 }
      );
    }

    // Optional: prevent double updates
    const order = await prisma.order.findUnique({
      where: { id: Number(BASKET_ID) },
      select: { paymentStatus: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      return NextResponse.json({ success: true });
    }

    await prisma.order.update({
      where: { id: Number(BASKET_ID) },
      data: {
        paymentStatus:
          TXNSTATUS === "SUCCESS"
            ? PaymentStatus.PAID
            : PaymentStatus.FAILED,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayFast callback error:", error);
    return NextResponse.json(
      { error: "Callback failed" },
      { status: 500 }
    );
  }
}
