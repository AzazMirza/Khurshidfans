import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuid } from "uuid";
import { success } from "zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ✅ Correct cart item type
type CartItemWithProduct = {
  id: number;
  quantity: number;
  price: number | null;
  color: string | null;
  size: string | null;
  product: {
    id: number;
    name: string;
    price: number;
    image: string | null;
    sku: string;
  };
};

/* =========================
   GET → Fetch user's cart
========================= */
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const guestId = searchParams.get("guestId");

//     if (!userId && !guestId) {
//       return NextResponse.json(
//         { error: "userId or guestId required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const cartItems: CartItemWithProduct[] =
//       await prisma.cartItem.findMany({
//         where: userId
//           ? { userId: Number(userId) }
//           : { guestId: guestId! },
//         include: {
//           product: {
//             select: {
//               id: true,
//               name: true,
//               price: true,
//               image: true,
//               sku: true,
//             },
//           },
//         },
//       });

//     const formattedCart = cartItems.map((item) => ({
//       id: item.id,
//       quantity: item.quantity,
//       color: item.color,
//       size: item.size,
//       name: item.product.name,
//       price: item.price, // ✅ cart price (from frontend)
//       image: item.product.image,
//       productId: item.product.id,
//       sku: item.product.sku,
//     }));

//     return NextResponse.json(formattedCart, { headers: corsHeaders });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Failed to get cart" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const guestId = searchParams.get("guestId");

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "userId or guestId required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        ...(userId ? { userId: Number(userId) } : { guestId }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            sku: true,
          },
        },
      },
    });

    // Flatten product fields to top-level
    const formattedCart = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      productId: item.product.id,
      sku: item.product.sku,
    }));

    return NextResponse.json(formattedCart, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get cart" },
      { status: 500, headers: corsHeaders }
    );
  }
}


/* =========================
   POST → Add item to cart
========================= */
export async function POST(req: Request) {
  try {
    const {
      userId,
      productId,
      quantity = 1,
      price,
      size,
      color,
      guestId,
    } = await req.json();

    if (!productId || typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Invalid productId or price" },
        { status: 400, headers: corsHeaders }
      );
    }

    let finalGuestId = guestId;
    if (!userId && !finalGuestId) {
      finalGuestId = uuid();
    }

    const existing = await prisma.cartItem.findFirst({
      where: {
        productId,
        size: size ?? null,
        color: color ?? null,
        ...(userId ? { userId } : { guestId: finalGuestId }),
      },
    });

    let CartItem;

    if (existing) {
      CartItem = await prisma.cartItem.update({
        where: { id: existing.id }, // ✅ ONLY unique field
        data: {
          quantity: existing.quantity + quantity,
          price, // ✅ update price if frontend sends new one
        },
        include: { product: true },
      });
    } else {
      CartItem = await prisma.cartItem.create({
        data: {
          userId: userId || null,
          guestId: userId ? null : finalGuestId,
          productId,
          price,
          size: size ?? null,
          color: color ?? null,
          quantity,
        },
        include: { product: true },
      });
    }

    return NextResponse.json(
      { CartItem, guestId: finalGuestId, success  : true },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add to cart" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* =========================
   PUT → Update quantity
========================= */
export async function PUT(req: Request) {
  try {
    const { id, change, userId, guestId } = await req.json();

    if (!id || !change) {
      return NextResponse.json(
        { error: "id and change required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (item.userId && item.userId !== Number(userId)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403, headers: corsHeaders }
      );
    }

    if (item.guestId && item.guestId !== guestId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403, headers: corsHeaders }
      );
    }

    const updatedQty = item.quantity + change;
    if (updatedQty < 1) {
      return NextResponse.json(
        { error: "Minimum quantity is 1" },
        { status: 400, headers: corsHeaders }
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: updatedQty },
    });

    return NextResponse.json(
      { success: true, item: updated },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* =========================
   DELETE → Remove item
========================= */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const userId = searchParams.get("userId");
    const guestId = searchParams.get("guestId");

    if (!id) {
      return NextResponse.json(
        { error: "cartItem id required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (item.userId && item.userId !== Number(userId)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403, headers: corsHeaders }
      );
    }

    if (item.guestId && item.guestId !== guestId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403, headers: corsHeaders }
      );
    }

    await prisma.cartItem.delete({ where: { id } });

    return NextResponse.json(
      { success: true, deletedItemId: id },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete item" },
      { status: 500, headers: corsHeaders }
    );
  }
}





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { v4 as uuid } from "uuid";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// // Handle CORS preflight
// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// // Inline type for cart item with included product
// type CartItemWithProduct = {
//   id: number;
//   quantity: number;
//   color: string | null;
//   price: number;
//   size: string | null; // ✅ matches DB
//   product: {
//     id: number;
//     name: string;
//     price: number;
//     image: string | null;
//     sku: string;
//   };
// };

// // GET → Fetch user's cart
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const guestId = searchParams.get("guestId");

//     if (!userId && !guestId) {
//       return NextResponse.json(
//         { error: "userId or guestId required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // Fetch cart items from database
//     const cartItems: CartItemWithProduct[] = await prisma.cartItem.findMany({
//       where: {
//         ...(userId ? { userId: Number(userId) } : { guestId }),
//       },
//       include: {
//         product: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image: true,
//             sku: true,
//             color: true,    // ✅ include color
//             size: true,     // ✅ include size
//           },
//         },
//       },
//     });

//     // Flatten product fields to top-level for frontend
//     const formattedCart = cartItems.map((item) => ({
//       id: item.id,
//       quantity: item.quantity,
//       color: item.color,
//       size: item.size,
//       name: item.product.name,
//       price: item.price,
//       image: item.product.image,
//       productId: item.product.id,
//       sku: item.product.sku,
//     }));

//     return NextResponse.json(formattedCart, { headers: corsHeaders });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Failed to get cart" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }




// // POST → Add item to cart
// export async function POST(req: Request) {
//   try {
//     const {
//       userId,
//       productId,
//       quantity = 1,
//       price,
//       size,
//       color,
//       guestId,
//     } = await req.json();

//     if (!productId) {
//       return NextResponse.json(
//         { error: "Missing productId" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     let finalGuestId = guestId;

//     // Create guest session if needed
//     if (!userId && !finalGuestId) {
//       finalGuestId = uuid();
//     }

//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     // ✅ FIX: include size + color in lookup
//     const existing = await prisma.cartItem.findFirst({
//       where: {
//         productId,
//         size: size ?? null,
//         color: color ?? null,
//         ...(userId
//           ? { userId }
//           : { guestId: finalGuestId }),
//       },
//     });

//     let cartItem;

//     if (existing) {
//       cartItem = await prisma.cartItem.update({
//         where: { id: existing.id ,size: existing.size, color: existing.color},
//         data: {
//           quantity: existing.quantity + quantity,
//         },
//         include: { product: true },
//       });
//     } else {
//       cartItem = await prisma.cartItem.create({
//         data: {
//           userId: userId || null,
//           guestId: userId ? null : finalGuestId,
//           productId,
//           price,
//           size: size ?? null,
//           color: color ?? null,
//           quantity,
//         },
//         include: { product: true },
//       });
//     }

//     return NextResponse.json(
//       { cartItem, guestId: finalGuestId },
//       { status: 201, headers: corsHeaders }
//     );
//   } catch (error: any) {
//     console.error("Add to cart error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to add to cart" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// // PUT → Update cart item (with ownership check)
// export async function PUT(req: Request) {
//   try {
//     const { id, change, userId, guestId } = await req.json();

//     if (!id || !change)
//       return NextResponse.json(
//         { error: "id and change (+1 or -1) required" },
//         { status: 400, headers: corsHeaders }
//       );

//     const item = await prisma.cartItem.findUnique({ where: { id } });

//     if (!item)
//       return NextResponse.json(
//         { error: "Cart item not found" },
//         { status: 404, headers: corsHeaders }
//       );

//     // Protect ownership
//     if (item.userId && String(item.userId) !== userId) {
//       return NextResponse.json(
//         { error: "Unauthorized update attempt" },
//         { status: 403, headers: corsHeaders }
//       );
//     }

//     if (item.guestId && item.guestId !== guestId) {
//       return NextResponse.json(
//         { error: "Unauthorized update attempt" },
//         { status: 403, headers: corsHeaders }
//       );
//     }

//     // Calculate new quantity
//     const updatedQty = item.quantity + change;

//     // Quantity cannot go below 1
//     if (updatedQty < 1) {
//       return NextResponse.json(
//         { error: "Minimum quantity is 1" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const updated = await prisma.cartItem.update({
//       where: { id },
//       data: { quantity: updatedQty },
//     });

//     return NextResponse.json(
//       { success: true, item: updated },
//       { headers: corsHeaders }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Failed to update quantity" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// // DELETE → Remove single item
// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const id = Number(searchParams.get("id"));
//     const userId = searchParams.get("userId");
//     const guestId = searchParams.get("guestId");

//     if (!id)
//       return NextResponse.json(
//         { success: false, error: "cartItem id required" },
//         { status: 400, headers: corsHeaders }
//       );

//     // Find item first
//     const item = await prisma.cartItem.findUnique({ where: { id } });

//     if (!item)
//       return NextResponse.json(
//         { success: false, error: "Cart item not found" },
//         { status: 404, headers: corsHeaders }
//       );

//     // Protect ownership
//     if (item.userId && String(item.userId) !== userId) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized delete attempt" },
//         { status: 403, headers: corsHeaders }
//       );
//     }

//     if (item.guestId && item.guestId !== guestId) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized delete attempt" },
//         { status: 403, headers: corsHeaders }
//       );
//     }

//     // Safe delete
//     await prisma.cartItem.delete({ where: { id } });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Item deleted successfully",
//         deletedItemId: id,
//       },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to delete item" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }
