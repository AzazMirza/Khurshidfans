/// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

/* ============================== GET ============================== */
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const productId = Number(id);

  if (!productId || isNaN(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { productDetails: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(product, { headers: corsHeaders });
  } catch (error) {
    console.error("GET product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* ======================== CLOUDINARY HELPERS ======================== */
async function uploadToCloudinary(file: File | string, folder: string) {
  if (typeof file === "string") return file;

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      }
    );
    stream.end(buffer);
  });
}

async function deleteFromCloudinary(url: string, folder: string) {
  if (!url) return;
  const publicId = url.split("/").pop()?.split(".")[0];
  if (!publicId) return;
  await cloudinary.uploader.destroy(`${folder}/${publicId}`, {
    resource_type: "image",
  });
}

/* ============================== PUT ============================== */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId || isNaN(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400, headers: corsHeaders }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const sku = formData.get("sku") as string | null;

    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : undefined;

    const rating = formData.get("rating")
      ? Number(formData.get("rating"))
      : undefined;

    /* -------- PRICES BY SIZE (JSON) -------- */
    const pricesBySizeString = formData.get("pricesBySize") as string | null;
    let pricesBySize: Prisma.InputJsonValue | undefined = undefined;

    if (pricesBySizeString) {
      try {
        pricesBySize = JSON.parse(pricesBySizeString);
      } catch {
        return NextResponse.json(
          { error: "Invalid pricesBySize JSON" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // ✅ Prevent accidental wipe
    if (pricesBySize && Object.keys(pricesBySize as object).length === 0) {
      pricesBySize = undefined;
    }

    /* -------- ARRAY FIELDS -------- */
    const colorString = formData.get("color") as string | null;
    const color = colorString
      ? colorString.split(",").map(c => c.trim()).filter(Boolean)
      : undefined;

    const sizeString = formData.get("size") as string | null;
    const size = sizeString
      ? sizeString.split(",").map(s => s.trim()).filter(Boolean)
      : undefined;

      

    const categoryString = formData.get("category") as string | null;
    const category = categoryString
      ? categoryString.split(",").map(c => c.trim()).filter(Boolean)
      : undefined;

    /* -------- PRODUCT DETAILS -------- */
    const productDetailsJson = formData.get("productDetails") as string | null;
    let productDetailsData: any = null;

    if (productDetailsJson) {
      try {
        productDetailsData = JSON.parse(productDetailsJson);
      } catch {
        return NextResponse.json(
          { error: "Invalid productDetails JSON" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    /* -------- EXISTING PRODUCT -------- */
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    /* -------- SKU UNIQUE CHECK (✅ ADDED) -------- */
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({ where: { id: productId, sku } });
      if (skuExists) {
        return NextResponse.json(
          { error: "SKU already exists" },
          { status: 409, headers: corsHeaders }
        );
      }
    }

    /* -------- IMAGES -------- */
    const imageFile = formData.get("image") as File | string | null;
    const imagesFiles = formData.getAll("images") as (File | string)[];

    const finalImagePath = imageFile
      ? await uploadToCloudinary(imageFile, "products")
      : existingProduct.image;

    let finalImagePaths: string[] = [];
    for (const img of imagesFiles) {
      if (img) {
        finalImagePaths.push(await uploadToCloudinary(img, "products"));
      }
    }

    if (finalImagePaths.length === 0) {
      finalImagePaths = existingProduct.images;
    }

    /* -------- UPDATE PRODUCT -------- */
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        sku: sku ?? undefined,
        pricesBySize,
        stock,
        rating,
        image: finalImagePath,
        images: finalImagePaths,
        color,
        size,
        category,
      },
    });

    /* -------- UPSERT PRODUCT DETAILS -------- */
    if (productDetailsData) {
      const existingDetails = await prisma.productDetails.findUnique({
        where: { productId },
      });

      if (existingDetails) {
        await prisma.productDetails.update({
          where: { productId },
          data: productDetailsData,
        });
      } else {
        await prisma.productDetails.create({
          data: { productId, ...productDetailsData },
        });
      }
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("PUT product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* ============================== DELETE ============================== */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400, headers: corsHeaders }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (product?.image) await deleteFromCloudinary(product.image, "products");
    for (const img of product?.images || []) {
      await deleteFromCloudinary(img, "products");
    }

    await prisma.productDetails.deleteMany({ where: { productId } });
    await prisma.orderItem.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("DELETE product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500, headers: corsHeaders }
    );
  }
}







// /// app/api/products/[id]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
// // import { promises as fs } from "fs";
// // import path from "path";
// import sharp from "sharp"; 
// import cloudinary from "@/lib/cloudinary";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// export async function GET(request: Request, { params }: RouteParams) {
//   const { id } = await params;
//   if (!id || typeof id !== "string") {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400, headers: corsHeaders }
//     );
//   }

//   const productId = Number(id);
//   if (isNaN(productId) || productId <= 0 || !Number.isInteger(productId)) {
//     return NextResponse.json(
//       { error: "Invalid product ID. Must be a positive integer." },
//       { status: 400, headers: corsHeaders }
//     );
//   }

//   try {
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       include: { productDetails: true },
//     });

//     if (!product) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     return NextResponse.json(product, { headers: corsHeaders });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// // Helper: upload File to Cloudinary
// async function uploadToCloudinary(file: File | string, folder: string) {
//   if (typeof file === "string") return file; // Already a URL

//   const buffer = Buffer.from(await file.arrayBuffer());

//   return new Promise<string>((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder, resource_type: "image" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result?.secure_url || "");
//       }
//     );
//     stream.end(buffer);
//   });
// }

// // Helper: delete image from Cloudinary by URL
// async function deleteFromCloudinary(url: string, folder: string) {
//   if (!url) return;
//   const publicId = url.split("/").pop()?.split(".")[0];
//   if (!publicId) return;
//   await cloudinary.uploader.destroy(`${folder}/${publicId}`, {
//     resource_type: "image",
//   });
// }


// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     /* ------------------ GET & VALIDATE ID ------------------ */
//     const { id } = await params;
//     const productId = Number(id);

//     if (!productId || isNaN(productId) || productId <= 0) {
//       return NextResponse.json(
//         { error: "Invalid product ID" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     /* ------------------ PARSE FORM DATA ------------------ */
//     const formData = await request.formData();

//     const name = formData.get("name") as string | null;
//     const description = formData.get("description") as string | null;
//     const sku = formData.get("sku") as string | null;

//     // const price = formData.get("price")
//     //   ? Number(formData.get("price"))
//     //   : undefined;

//     const stock = formData.get("stock")
//       ? Number(formData.get("stock"))
//       : undefined;

//     const rating = formData.get("rating")
//       ? Number(formData.get("rating"))
//       : undefined;

//       /* ------------------ PRICES BY SIZE (JSON) ------------------ */
//       const pricesBySizeString = formData.get("pricesBySize") as string | null;
//       let pricesBySize: Prisma.InputJsonValue | undefined = undefined;

//       if (pricesBySizeString) {
//         try {
//           pricesBySize = JSON.parse(pricesBySizeString);
//         } catch {
//           return NextResponse.json(
//             { error: "Invalid pricesBySize JSON" },
//             { status: 400, headers: corsHeaders }
//           );
//         }
//       }


//     /* ------------------ ARRAY FIELDS ------------------ */

//     // COLOR → String[]
//     const colorString = formData.get("color") as string | null;
//     const color = colorString
//       ? colorString.split(",").map((c) => c.trim()).filter(Boolean)
//       : undefined;

//     // SIZE → String[]  ✅ (matches Prisma schema)
//     // const sizeString = formData.get("size") as string | null;
//     // const size = sizeString
//     //   ? sizeString.split(",").map((s) => s.trim()).filter(Boolean)
//     //   : undefined;

//     // CATEGORY → String[]
//     const categoryString = formData.get("category") as string | null;
//     const category = categoryString
//       ? categoryString.split(",").map((c) => c.trim()).filter(Boolean)
//       : undefined;

//     /* ------------------ PRODUCT DETAILS (JSON) ------------------ */
//     const productDetailsJson = formData.get("productDetails") as string | null;
//     let productDetailsData: any = null;

//     if (productDetailsJson) {
//       try {
//         productDetailsData = JSON.parse(productDetailsJson);
//       } catch {
//         return NextResponse.json(
//           { error: "Invalid productDetails JSON" },
//           { status: 400, headers: corsHeaders }
//         );
//       }
//     }

//     /* ------------------ FETCH EXISTING PRODUCT ------------------ */
//     const existingProduct = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!existingProduct) {
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     /* ------------------ IMAGES ------------------ */
//     const imageFile = formData.get("image") as File | string | null;
//     const imagesFiles = formData.getAll("images") as (File | string)[];

//     // Main image
//     const finalImagePath = imageFile
//       ? await uploadToCloudinary(imageFile, "products")
//       : existingProduct.image;

//     // Gallery images
//     let finalImagePaths: string[] = [];

//     for (const img of imagesFiles) {
//       if (img) {
//         const uploaded = await uploadToCloudinary(img, "products");
//         finalImagePaths.push(uploaded);
//       }
//     }

//     if (finalImagePaths.length === 0) {
//       finalImagePaths = existingProduct.images;
//     }

//     /* ------------------ UPDATE PRODUCT ------------------ */
//     const updatedProduct = await prisma.product.update({
//       where: { id: productId },
//       data: {
//         name: name ?? undefined,
//         description: description ?? undefined,
//         sku: sku ?? undefined,
//         pricesBySize,
//         stock,
//         rating,
//         image: finalImagePath,
//         images: finalImagePaths,
//         color,
//         // size,
//         category,
//       },
//     });

//     /* ------------------ UPSERT PRODUCT DETAILS ------------------ */
//     if (productDetailsData) {
//       const existingDetails = await prisma.productDetails.findUnique({
//         where: { productId },
//       });

//       if (existingDetails) {
//         await prisma.productDetails.update({
//           where: { productId },
//           data: productDetailsData,
//         });
//       } else {
//         await prisma.productDetails.create({
//           data: { productId, ...productDetailsData },
//         });
//       }
//     }

//     /* ------------------ SUCCESS ------------------ */
//     return NextResponse.json(
//       {
//         message: "Product updated successfully",
//         product: updatedProduct,
//       },
//       { headers: corsHeaders }
//     );
//   } catch (error: any) {
//     console.error("PUT /api/products/[id] error:", error);

//     return NextResponse.json(
//       { error: error.message || "Failed to update product" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// export async function DELETE(request: Request, { params }: RouteParams) {
//   try {
//     const { id } = await params;
//     if (!id) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const productId = Number(id);

//     // Fetch product to delete images from Cloudinary
//     const product = await prisma.product.findUnique({ where: { id: productId } });
//     if (product?.image) await deleteFromCloudinary(product.image, "products");
//     for (const img of product?.images || []) await deleteFromCloudinary(img, "products");

//     // Delete related product details
//     await prisma.productDetails.deleteMany({ where: { productId } });

//     // Delete related order items
//     await prisma.orderItem.deleteMany({ where: { productId } });

//     // Delete the product itself
//     await prisma.product.delete({ where: { id: productId } });

//     return NextResponse.json(
//       { message: "Product deleted successfully" },
//       { headers: corsHeaders }
//     );
//   } catch (error: any) {
//     console.error("DELETE /products error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to delete product" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

