import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") ?? "";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const skip = (page - 1) * limit;

    // ✅ Type-safe where clause
    const where: Prisma.ContactFormWhereInput = search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              email: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const contacts = await prisma.contactForm.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.contactForm.count({ where });

    return NextResponse.json(
      {
        data: contacts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch contacts" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const contact = await prisma.contactForm.create({
      data: {
        firstName,
        lastName,
        email,
        message,
      },
    });

    return NextResponse.json(
      { message: "Contact submitted successfully", data: contact },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST CONTACT ERROR:", error);

    return NextResponse.json(
      { message: "Failed to submit contact form" },
      { status: 500, headers: corsHeaders }
    );
  }
}
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const { firstName, lastName, email, message } = body;

//     // 🛑 Basic validation
//     if (!firstName || !lastName || !email || !message) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // 📦 Save to database
//     const contact = await prisma.contactForm.create({
//       data: {
//         firstName,
//         lastName,
//         email,
//         message,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Your Message Submitted Successfully",
//         data: contact,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("CONTACT POST ERROR:", error);

//     return NextResponse.json(
//       { message: "Failed to submit contact form" },
//       { status: 500 }
//     );
//   }
// }