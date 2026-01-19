// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import sharp from "sharp";
import cloudinary from "@/lib/cloudinary";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET — Fetch paginated or searched products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const currentPage = parseInt(searchParams.get("page") || "1");
    const limit = 999;
    const skip = (currentPage - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      }),
      ...(category && {
        category: { has: category },
      }),
    };

    const [products, totalProds] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { id: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          price: true,
          size: true,
          pricesBySize: true, // ✅ size → price map
          stock: true,
          category: true,
          sku: true,
          color: true,
          rating: true,
          description: true,
          image: true,
          images: true,
          productDetails: {
            select: {
              motor: true,
              blades: true,
              speedLevels: true,
              remote: true,
              timer: true,
              oscillation: true,
              noiseLevel: true,
              dimensions: true,
              warranty: true,
              motorType: true,
              height: true,
              bladeDiameter: true,
              baseDiameter: true,
              weight: true,
              powerConsumption: true,
              airFlow: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalProds / limit);

    return NextResponse.json(
      { products, totalProds, currentPage, totalPages },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("GET /api/products error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Helper: Upload image to Cloudinary
const uploadImage = async (file: File, folder = "products") => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 2000 })
    .webp({ quality: 90 })
    .toBuffer();

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "image", format: "webp" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || "");
        }
      )
      .end(optimizedBuffer);
  });
};

// POST — Create a new product with size-based pricing
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    let mainImagePath = "";
    let additionalImages: string[] = [];

    // Parse request
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());

      const mainFile = formData.get("image") as File | null;
      if (mainFile && mainFile.size > 0) {
        mainImagePath = await uploadImage(mainFile);
      }

      const files = formData.getAll("images") as File[];
      for (const file of files) {
        if (file.size > 0) {
          const url = await uploadImage(file);
          additionalImages.push(url);
        }
      }
    } else {
      body = await req.json();
      mainImagePath = body.image || "";
      additionalImages = Array.isArray(body.images) ? body.images : [];
    }

    // Validation
    const requiredFields = ["name", "pricesBySize", "stock", "category"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }
    

    // Check duplicate
    const existingProduct = await prisma.product.findFirst({
      where: { name: body.name },
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 400 }
      );
    }

    // Parse & validate pricesBySize
    // let pricesBySize: Record<string, number>;
    // try {
    //   if (typeof body.pricesBySize === "string") {
    //     pricesBySize = JSON.parse(body.pricesBySize);
    //   } else if (body.pricesBySize && typeof body.pricesBySize === "object") {
    //     pricesBySize = body.pricesBySize;
    //   } else {
    //     throw new Error("Invalid");
    //   }

    //   // Ensure all values are valid numbers
    //   for (const size in pricesBySize) {
    //     const price = Number(pricesBySize[size]);
    //     if (isNaN(price) || price <= 0) {
    //       throw new Error(`Invalid price for size: ${size}`);
    //     }
    //     pricesBySize[size] = price;
    //   }
    // } catch (e) {
    //   return NextResponse.json(
    //     { error: 'pricesBySize must be a valid object like { 18: 5000 }' },
    //     { status: 400 }
    //   );
    // }
    let pricesBySize: Record<string, number> = {};

      try {
        pricesBySize =
          typeof body.pricesBySize === "string"
            ? JSON.parse(body.pricesBySize)
            : body.pricesBySize ?? {};
      } catch {
        pricesBySize = {};
      }
      let pricesByColor: Record<string, number> = {};

      try {
        pricesByColor =
          typeof body.pricesByColor === "string"
            ? JSON.parse(body.pricesByColor)
            : body.pricesByColor ?? {};
      } catch {
        pricesByColor = {};
      }


    // Normalize arrays
    const normalizeArray = (input: any): string[] => {
      if (typeof input === "string")
        return input
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      if (Array.isArray(input))
        return input.map((s) => String(s).trim()).filter(Boolean);
      return [];
    };

    const categoryArray = normalizeArray(body.category);
    const colorArray = normalizeArray(body.color);

    const sizeArray =
          typeof body.size === "string"
            ? body.size.split(",").map((s: string) => s.trim())
            : Array.isArray(body.size)
            ? body.size
            : [];

    const productDetails =
      typeof body.productDetails === "string"
        ? JSON.parse(body.productDetails)
        : body.productDetails || {};

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        price: Number(body.price),
        size: sizeArray,
        pricesBySize,
        pricesByColor,
        stock: Number(body.stock),
        color: colorArray,
        category: categoryArray,
        description: body.description?.trim() || null,
        sku: "TEMP",
        image: mainImagePath,
        images: additionalImages,
        productDetails: {
          create: {
            motor: productDetails.motor || null,
            blades: productDetails.blades || null,
            speedLevels: productDetails.speedLevels || null,
            remote: productDetails.remote || null,
            timer: productDetails.timer || null,
            oscillation: productDetails.oscillation || null,
            noiseLevel: productDetails.noiseLevel || null,
            dimensions: productDetails.dimensions || null,
            warranty: productDetails.warranty || null,
            motorType: productDetails.motorType || null,
            height: productDetails.height || null,
            bladeDiameter: productDetails.bladeDiameter || null,
            baseDiameter: productDetails.baseDiameter || null,
            weight: productDetails.weight || null,
            powerConsumption: productDetails.powerConsumption || null,
            airFlow: productDetails.airFlow || null,
          },
        },
      },
      include: { productDetails: true },
    });

    // Generate SKU
    const formattedName = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    const generatedSku = `${formattedName}_${product.id}`;

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { sku: generatedSku },
      include: { productDetails: true },
    });

    return NextResponse.json(updatedProduct, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { Prisma } from "@prisma/client";
// // import { promises as fs } from "fs";
// // import path from "path";
// import sharp from "sharp";
// import cloudinary from "@/lib/cloudinary";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }
// // GET — Fetch paginated or searched products
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

// const search = searchParams.get("search") || "";
//     const category = searchParams.get("category");
//     const currentPage = parseInt(searchParams.get("page") || "1");

//     const limit = 999;
//     const skip = (currentPage - 1) * limit;

//     const where: Prisma.ProductWhereInput = {
//       ...(search && {
//         OR: [
//           { name: { contains: search, mode: "insensitive" } },
//         ],
//       }),
//       ...(category && {
//         category: {
//           has: category,
//         },
//       }),
//     };

//     const [products, totalProds] = await Promise.all([
//       prisma.product.findMany({
//         where,
//         orderBy: { id: "desc" },
//         skip,
//         take: limit,
//         select: {
//           id: true,
//           name: true,
//           price: true,
//           stock: true,
//           category: true,
//           sku: true,
//           color: true,
//           size: true,
//           rating: true,
//           description: true,
//           image: true,
//           images: true,
//           productDetails: {
//             select: {
//               // id: true,
//               productId: true,
//               motor: true,
//               blades: true,
//               speedLevels: true,
//               remote: true,
//               timer: true,
//               oscillation: true,
//               noiseLevel: true,
//               dimensions: true,
//               warranty: true,
//               motorType: true,
//               height: true,
//               bladeDiameter: true,
//               baseDiameter: true,
//               weight: true,
//               powerConsumption: true,
//               airFlow: true,
//             },
//           },
//         },
//       }),
//       prisma.product.count({ where }),
//     ]);

//     const totalPages = Math.ceil(totalProds / limit);

//     return NextResponse.json(
//       { products, totalProds, currentPage, totalPages },
//       { headers: corsHeaders }
//     );
//   } catch (error: any) {
//     console.error("GET /products error:", error.message);
//     return NextResponse.json(
//       { error: "Failed to fetch products" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }
// //image hendler function
// const uploadImage = async (file: File, folder = "products") => {
//   const buffer = Buffer.from(await file.arrayBuffer());

//   const optimizedBuffer = await sharp(buffer)
//     .resize({ width: 2000 })
//     .webp({ quality: 90 })
//     .toBuffer();

//   const result = await new Promise<any>((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: "image",
//         format: "webp",
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     ).end(optimizedBuffer);
//   });

//   return result.secure_url;
// };
// export async function POST(req: Request) {
//   try {
//     const contentType = req.headers.get("content-type") || "";
//     let body: any = {};

//     let mainImagePath = "";
//     let additionalImages: string[] = [];

//     // PARSE REQUEST
//     if (contentType.includes("multipart/form-data")) {
//       const formData = await req.formData();
//       body = Object.fromEntries(formData.entries());

//       const mainFile = formData.get("image") as File | null;

//       if (mainFile) {
//         mainImagePath = await uploadImage(mainFile);
//       }

//       const files = formData.getAll("images") as File[];
//       for (const file of files) {
//         const url = await uploadImage(file);
//         additionalImages.push(url);
//       }
//     } else {
//       body = await req.json();
//       mainImagePath = body.image || "";
//       additionalImages = body.images || [];
//     }

//     // VALIDATION
//     const requiredFields = ["name", "price", "stock", "category"];
//     const missingFields = requiredFields.filter((f) => !body[f]);

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     const existingProduct = await prisma.product.findFirst({
//       where: { name: body.name },
//     });

//     if (existingProduct) {
//       return NextResponse.json(
//         { error: "Product already exists" },
//         { status: 400 }
//       );
//     }

//     // DATA NORMALIZATION
//     const categoryArray =
//       typeof body.category === "string"
//         ? body.category.split(",").map((c: string) => c.trim())
//         : Array.isArray(body.category)
//         ? body.category
//         : [];

//         const colorArray =
//           typeof body.color === "string"
//             ? body.color.split(",").map((c: string) => c.trim())
//             : Array.isArray(body.color)
//             ? body.color
//             : [];

//         const sizeArray =
//           typeof body.size === "string"
//             ? body.size.split(",").map((s: string) => s.trim())
//             : Array.isArray(body.size)
//             ? body.size
//             : [];

//     const productDetails =
//       typeof body.productDetails === "string"
//         ? JSON.parse(body.productDetails)
//         : body.productDetails || {};

//     // CREATE PRODUCT
//     const product = await prisma.product.create({
//       data: {
//         name: body.name,
//         price: Number(body.price),
//         stock: Number(body.stock),
//         color: colorArray,
//         size: sizeArray,
//         category: categoryArray,
//         description: body.description || null,
//         sku: "TEMP",
//         image: mainImagePath,
//         images: additionalImages,
//         productDetails: {
//           create: {
//             motor: productDetails.motor || null,
//             blades: productDetails.blades || null,
//             speedLevels: productDetails.speedLevels || null,
//             remote: productDetails.remote || null,
//             timer: productDetails.timer || null,
//             oscillation: productDetails.oscillation || null,
//             noiseLevel: productDetails.noiseLevel || null,
//             dimensions: productDetails.dimensions || null,
//             warranty: productDetails.warranty || null,
//             motorType: productDetails.motorType || null,
//             height: productDetails.height || null,
//             bladeDiameter: productDetails.bladeDiameter || null,
//             baseDiameter: productDetails.baseDiameter || null,
//             weight: productDetails.weight || null,
//             powerConsumption: productDetails.powerConsumption || null,
//             airFlow: productDetails.airFlow || null,
//           },
//         },
//       },
//       include: { productDetails: true },
//     });

//     // SKU GENERATION
//     const formattedName = body.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "_")
//       .replace(/^_|_$/g, "");

//     const generatedSku = `${formattedName}_${product.id}`;

//     const updatedProduct = await prisma.product.update({
//       where: { id: product.id },
//       data: { sku: generatedSku },
//       include: { productDetails: true },
//     });

//     return NextResponse.json(updatedProduct, { status: 201 });
//   } catch (error: any) {
//     console.error("POST /products error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to create product" },
//       { status: 500 }
//     );
//   }
// }
