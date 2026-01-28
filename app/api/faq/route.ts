import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { sub } from "date-fns";

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
    const where: Prisma.FaqWhereInput = search
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
          ],
        }
      : {};

    const contacts = await prisma.faq.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.faq.count({ where });

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
    console.error("GET Question ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch Questions.." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, subject, message } = body;

    if (!firstName || !lastName || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const contact = await prisma.faq.create({
      data: {
        firstName,
        lastName,
        subject,
        message,
      },
    });

    return NextResponse.json(
      { message: "Question submitted successfully", data: contact },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST Question ERROR:", error);
    return NextResponse.json(
      { message: "Failed to submit Your Question.." },
      { status: 500, headers: corsHeaders }
    );
  }
}
