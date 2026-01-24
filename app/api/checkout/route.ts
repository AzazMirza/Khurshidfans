import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

/* ====== CORS ====== */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/* ====== POST ====== */

export async function POST(req: Request) {
  try {
    const {
      userId,
      guestId,
      email,
      street,
      city,
      stateProvince,
      zipCode,
      country,
      phoneNumber,
      firstName,
      lastName,
      paymentMethod,
      shippingMethod,
    } = await req.json();

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "Missing userId or guestId" },
        { status: 400, headers: corsHeaders }
      );
    }
    //  const address = `${street}, ${city}, ${stateProvince}, ${zipCode ?? ""}, ${country ?? ""}`;
    if (!email || !street || !city || !stateProvince || !phoneNumber) {
      return NextResponse.json(
        {
          error:
            "Email, street, city, stateProvince and phoneNumber are required",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    /* ====== FETCH CART ITEMS ====== */

    const cartItems = await prisma.cartItem.findMany({
      where: userId ? { userId } : { guestId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400, headers: corsHeaders }
      );
    }

    /* ====== CALCULATE TOTAL ====== */

    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);

    /* ====== CREATE ORDER ====== */

    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        guestId: guestId || null,
        totalAmount,
        firstName,
        lastName,
        email,
        street,
        city,
        stateProvince,
        zipCode: zipCode || null,
        country: country || null,
        phoneNumber,
        paymentMethod,
        shippingMethod,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size ?? null,
            color: item.color ?? null,
            price: item.product?.price ?? 0,
          })),
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    const orderId = order.id;

    /* ====== WHATSAPP MESSAGE ====== */

    const waMessage = `Send to confirm your order!
      Order ID: ${orderId}
      Name: ${firstName ?? ""} ${lastName ?? ""}
      Phone: ${phoneNumber}
      Payment Method: ${paymentMethod}
      Shipping Method: ${shippingMethod}
      Address: ${street}, ${city}, ${stateProvince}, ${country ?? ""}

      Total Amount: Rs. ${totalAmount}`;

    const waLink = `https://wa.me/923096237788?text=${encodeURIComponent(
      waMessage
    )}`;

    /* ====== CLEAR CART ====== */

    await prisma.cartItem.deleteMany({
      where: userId ? { userId } : { guestId },
    });

    /* ====== SEND EMAIL ====== */

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailHtml = `
        <h2>Order Confirmation - Khurshid Fans</h2>
        <p>Hi <strong>${firstName ?? ""} ${lastName ?? ""}</strong>,</p>
        <p>Thank you for your order.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Shipping Method:</strong> ${shippingMethod}</p>
        <p><strong>Address:</strong> ${street}, ${city}, ${stateProvince},${country ?? ""}</p>

        <h3>Order Items</h3>
        <ul>
          ${order.orderItems
            .map(
              (item) => `
            <li>
              ${item.product?.name ?? "Product"}<br/>
              Qty: ${item.quantity}<br/>
              Size: ${item.size ?? "—"}<br/>
              Color: ${item.color ?? "—"}<br/>
              Price: Rs. ${item.price}
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      await transporter.sendMail({
        from: `"Khurshid Fans" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    /* ====== RESPONSE ====== */

    return NextResponse.json(
      {
        success: true,
        message: "Checkout successful",
        order,
        waLink,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* ====== GET ====== */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const guestId = url.searchParams.get("guestId");

    const whereClause: any = {};
    if (userId) whereClause.userId = Number(userId);
    if (guestId) whereClause.guestId = guestId;

    const orders = await prisma.order.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500, headers: corsHeaders }
    );
  }
}

