import { NextResponse, NextRequest } from "next/server";
import { generatePayFastPaymentData } from "@/lib/payfast";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { tr } from "zod/v4/locales";
// import { POST as payment } from "@/app/api/payment/route";
// import { createPayFastCheckout } from "@/lib/checkout";
/* ====== CORS ====== */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


// /* ====== POST ====== */
// export async function POST(req: Request) {
//   try {
// const {
//   userId,
//   guestId,
//   customerEmail: email,
//   customerFirstName: firstName,
//   customerLastName: lastName,
//   phoneNumber,
//   paymentMethod,
//   shippingMethod,
//   shipping,
//   amount,
// } = await req.json();

// // Safely extract shipping details
// const shippingDetails = shipping || {};
// const {
//   street = null,
//   city = null,
//   stateProvince = null,
//   zipCode = null,
//   country = null,
// } = shippingDetails;

// // Now validate
// if (!userId && !guestId) {
//   return NextResponse.json({ error: "Missing userId or guestId" }, { status: 400, headers: corsHeaders });
// }

// if (!email || !street || !city || !stateProvince || !phoneNumber) {
//   console.log("Validation failed. Values:", { email, street, city, stateProvince, phoneNumber });
//   return NextResponse.json(
//     { error: "Email, street, city, stateProvince and phoneNumber are required" },
//     { status: 400, headers: corsHeaders }
//   );
// }

// if (!userId && !guestId) {
//       return NextResponse.json(
//         { error: "Missing userId or guestId" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     if (!email || !street || !city || !stateProvince || !phoneNumber) {
//       return NextResponse.json(
//         {
//           error:
//             "Email, street, city, stateProvince and phoneNumber are required",
//         },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     /* ====== FETCH CART ITEMS ====== */
//     const cartItems = await prisma.cartItem.findMany({
//       where: userId ? { userId } : { guestId },
//       include: { product: true },
//     });

//     if (cartItems.length === 0) {
//       return NextResponse.json(
//         { error: "Cart is empty" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     /* ====== MERGE DUPLICATE CART ITEMS ====== */
//     const mergedItems = Object.values(
//       cartItems.reduce((acc: Record<string, any>, item) => {
//         const key = `${item.productId}-${item.size ?? ""}-${item.color ?? ""}`;
//         if (!acc[key]) {
//           acc[key] = { ...item };
//         } else {
//           acc[key].quantity += item.quantity;
//         }
//         return acc;
//       }, {})
//     );

//     const totalAmount = mergedItems.reduce((sum, item) => {
//   const price = typeof item.price === "number" ? item.price : 0;
//   return sum + price * item.quantity;
// }, 0);

// let paymentResponse;

// // ✅ Generate PayFast URL directly — same logic as /api/payment


//   console.log("Payment Response:", paymentResponse);

//     /* ====== CREATE ORDER ====== */
// let order;
// try {
//     order = await prisma.order.create({
//       data: {

//         userId: userId || null,
//         guestId: guestId || null,
//         totalAmount,
//         firstName,
//         lastName,
//         email,
//         street,
//         city,
//         stateProvince,
//         zipCode: zipCode || null,
//         country: country || null,
//         phoneNumber,
//         paymentMethod,
//         shippingMethod,
//         paymentStatus: "PENDING",
//         orderItems: {
//           create: mergedItems.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             size: item.size ?? null,
//             color: item.color ?? null,
//             price: item.price ?? 0,
//           })),
//         },
//       },
//       include: {
//         orderItems: {
//           include: { product: true },
//         },
//       },
//     });
//     console.log("✅ Order created bla bla:", order.id);
// } catch (dbError) {
//   console.error("💥 Database write failed:", dbError);
//   throw new Error("Failed to save order to database");
// }

//     const orderId = order.id;



//       const paymentFormData = await generatePayFastPaymentData({
//         amount: totalAmount,
//         email: email,
//         mobile: phoneNumber, // ← this is required!
//         orderId: orderId.toString(),
//         // item_name: "Order from Khurshid Fans",
//         itemDescription: "Order from Khurshid Fans",
//       });

//       if (!paymentFormData) {
//         throw new Error("Failed to generate PayFast URL");
//       }


//           /* ====== WHATSAPP MESSAGE ====== */
//           const waMessage = `Send to confirm your order!
//       Order ID: ${orderId}
//       Name: ${firstName ?? ""} ${lastName ?? ""}
//       Phone: ${phoneNumber}
//       Payment Method: ${paymentMethod}
//       Shipping Method: ${shippingMethod}
//       Address: ${street}, ${city}, ${stateProvince}, ${country ?? ""}
//       Total Amount: Rs. ${totalAmount}`;

//     const waLink = `https://wa.me/923058491064?text=${encodeURIComponent(
//       waMessage
//     )}`;

//     /* ====== CLEAR CART ====== */
//     await prisma.cartItem.deleteMany({
//       where: userId ? { userId } : { guestId },
//     });

//     /* ====== SEND EMAIL ====== */
//     try {
//       const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: Number(process.env.EMAIL_PORT),
//         secure: true,
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       const emailHtml = `
//         <h2>Order Confirmation - Khurshid Fans</h2>
//         <p>Hi <strong>${firstName ?? ""} ${lastName ?? ""}</strong>,</p>
//         <p>Thank you for your order.</p>

//         <p><strong>Order ID:</strong> ${orderId}</p>
//         <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
//         <p><strong>Phone:</strong> ${phoneNumber}</p>
//         <p><strong>Payment Method:</strong> ${paymentMethod}</p>
//         <p><strong>Shipping Method:</strong> ${shippingMethod}</p>
//         <p><strong>Address:</strong> ${street}, ${city}, ${stateProvince},${country ?? ""}</p>

//         <h3>Order Items</h3>
//         <ul>
//         ${order.orderItems
//           .map(
//             (item) => `
//           <li>
//             ${item.product?.name ?? "Product"}<br/>
//             Qty: ${item.quantity}<br/>
//             Size: ${item.size ?? "—"}<br/>
//             Color: ${item.color ?? "—"}<br/>
//             Price: Rs. ${item.price}
//           </li>
//         `
//           )
//           .join("")}
//         </ul>
//         `;

//       await transporter.sendMail({
//         from: `"Khurshid Fans" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: `Order Confirmation - ${orderId}`,
//         html: emailHtml,
//       });
//     } catch (emailError) {
//       console.error("Email sending failed:", emailError);
//     }

//     console.log("✅ About to return paymentFormData:", JSON.stringify(paymentFormData, null, 2));

    

//     /* ====== RESPONSE ====== */
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Checkout successful",
//         order,
//         waLink,
//         paymentFormData,
//         paymentMethod, 
//       },
//       { headers: corsHeaders }
//     );
//   } catch (error: any) {
//   console.error("💥 Checkout Error:");
//   console.error("Message:", error.message);
//   console.error("Stack:", error.stack);
//   console.error("Cause:", error.cause);

//     console.error("Checkout Error:", error);
//     return NextResponse.json(
//       { error: error.message || "Checkout failed" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    const {
      userId,
      guestId,
      customerEmail: email,
      customerFirstName: firstName,
      customerLastName: lastName,
      phoneNumber,
      paymentMethod,
      shippingMethod,
      shipping,
      amount,
    } = await req.json();

    // Safely extract shipping details
    const shippingDetails = shipping || {};
    const {
      street = null,
      city = null,
      stateProvince = null,
      zipCode = null,
      country = null,
    } = shippingDetails;

    // Validate input
    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "Missing userId or guestId" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!email || !street || !city || !stateProvince || !phoneNumber) {
      console.log("Validation failed. Values:", {
        email,
        street,
        city,
        stateProvince,
        phoneNumber,
      });
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

    /* ====== MERGE DUPLICATE CART ITEMS ====== */
    const mergedItems = Object.values(
      cartItems.reduce((acc: Record<string, any>, item) => {
        const key = `${item.productId}-${item.size ?? ""}-${item.color ?? ""}`;
        if (!acc[key]) {
          acc[key] = { ...item };
        } else {
          acc[key].quantity += item.quantity;
        }
        return acc;
      }, {})
    );

    const totalAmount = mergedItems.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : 0;
      return sum + price * item.quantity;
    }, 0);

    /* ====== CREATE ORDER & CLEAR CART IN ONE TRANSACTION ====== */
    let order;
    try {
      order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
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
            paymentStatus: "PENDING",
            orderItems: {
              create: mergedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size ?? null,
                color: item.color ?? null,
                price: item.price ?? 0,
              })),
            },
          },
          include: {
            orderItems: {
              include: { product: true },
            },
          },
        });

        // Clear cart in the same transaction
        await tx.cartItem.deleteMany({
          where: userId ? { userId } : { guestId },
        });

        return createdOrder;
      });
      console.log("✅ Order created:", order.id);
    } catch (dbError) {
      console.error("💥 Database write failed:", dbError);
      throw new Error("Failed to save order to database");
    }

    const orderId = order.id;

    /* ====== GENERATE PAYFAST PAYMENT DATA ====== */
    const paymentFormData = await generatePayFastPaymentData({
      amount: totalAmount,
      email,
      mobile: phoneNumber,
      orderId: orderId.toString(),
      itemDescription: "Order from Khurshid Fans",
    });

    if (!paymentFormData) {
      throw new Error("Failed to generate PayFast URL");
    }

    /* ====== WHATSAPP MESSAGE ====== */
    const waMessage = `Send to confirm your order!

Name: ${firstName ?? ""} ${lastName ?? ""}
Phone: ${phoneNumber}
Payment Method: ${paymentMethod}
Shipping Method: ${shippingMethod}
Address: ${street}, ${city}, ${stateProvince}, ${country ?? ""}
Total Amount: Rs. ${totalAmount}`;

    const waLink = `https://wa.me/923058491064?text=${encodeURIComponent(
      waMessage
    )}`;

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
</li>`
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

    console.log(
      "✅ About to return paymentFormData:",
      JSON.stringify(paymentFormData, null, 2)
    );

    /* ====== RESPONSE ====== */
    return NextResponse.json(
      {
        success: true,
        message: "Checkout successful...",
        order,
        waLink,
        paymentFormData,
        paymentMethod,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("💥 Checkout Error:", error);
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

