import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // change to your domain in production
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search")?.trim() || "";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const isNumeric = !isNaN(Number(query));

    // Enum-safe status check
    const statusMatch = Object.values(OrderStatus).includes(
      query.toUpperCase() as OrderStatus
    );

    const results = await prisma.order.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          
          {
            street: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: query,
              mode: "insensitive",
            },
          },
          
          {
            phoneNumber: {
              contains: query,
              mode: "insensitive",
            },
          },
          

          ...(statusMatch
            ? [
                {
                  status: {
                    equals: query.toUpperCase() as OrderStatus,
                  },
                },
              ]
            : []),

          ...(isNumeric
            ? [
                {
                  id: Number(query),
                },
              ]
            : []),
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      // take: 20,
    });

    return NextResponse.json(results, { headers: corsHeaders });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
