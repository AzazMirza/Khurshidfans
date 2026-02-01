import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, guestId } = await req.json();

    // Validation
    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "userId or guestId is required" },
        { status: 400 }
      );
    }

    // Empty cart
    await prisma.cartItem.deleteMany({
      where: userId ? { userId } : { guestId },
    });

    return NextResponse.json({
      success: true,
      message: "Cart emptied successfully",
    });
  } catch (error) {
    console.error("Empty cart error:", error);
    return NextResponse.json(
      { error: "Failed to empty cart" },
      { status: 500 }
    );
  }
}
