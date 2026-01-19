import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET → fetch current theme
export async function GET() {
  const theme = await prisma.theme.findUnique({
    where: { id: 1 },
    select: {
      pr: true,
      se: true,
      bg: true,
      tx: true,
    },
  });

  return NextResponse.json(
    {  ...theme },
    { headers: corsHeaders }
  );
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("Incoming request body:", body);

//     const { pr, se, tx, bg } = body;

//     if (!pr || !se || !tx || !bg) {
//       console.log("Missing value(s):", { pr, se, tx, bg });
//       return NextResponse.json(
//         { error: "All 4 colors are required: pr, se, tx, bg" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // Convert HEX → RGB
//     const prRgb = hexToRgb(pr);
//     const seRgb = hexToRgb(se);
//     const txRgb = hexToRgb(tx);
//     const bgRgb = hexToRgb(bg);

//     console.log("Converted RGB values:", { prRgb, seRgb, txRgb, bgRgb });

//     const theme = await prisma.theme.upsert({
//       where: { id: 1 },
//       update: {
//         pr: prRgb,
//         se: seRgb,
//         tx: txRgb,
//         bg: bgRgb
//       },
//       create: {
//         id: 1,
//         pr: prRgb,
//         se: seRgb,
//         tx: txRgb,
//         bg: bgRgb
//       }
//     });

//     console.log("DB upsert result:", theme);

//     return NextResponse.json(
//       { success: true, theme },
//       { headers: corsHeaders }
//     );

//   } catch (error) {
//     console.error("POST /theme error:", error);
//     return NextResponse.json(
//       { error: "Invalid JSON or database issue" },
//       { status: 400, headers: corsHeaders }
//     );
//   }
// }

// // Helper function
// function hexToRgb(hex: string) {
//   hex = hex.replace("#", "");

//   if (hex.length === 3) {
//     hex = hex.split("").map((x) => x + x).join("");
//   }

//   const r = parseInt(hex.substring(0, 2), 16);
//   const g = parseInt(hex.substring(2, 4), 16);
//   const b = parseInt(hex.substring(4, 6), 16);

//   return `rgb(${r},${g},${b})`;
// }



// POST → create/update theme
export async function POST(req: Request) {
  try {
    const { pr, se, tx, bg } = await req.json();

    if (!pr || !se || !tx || !bg) {
      return NextResponse.json(
        { error: "All 4 colors are required: pr, se, tx, bg" },
        { status: 400, headers: corsHeaders }
      );
    }

    // UPSERT: create if not exists, otherwise update
    const theme = await prisma.theme.upsert({
      where: { id: 1 },
      update: { pr, se, tx, bg },
      create: { id: 1, pr, se, tx, bg }
    });

    return NextResponse.json(
      { success: true, theme },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid JSON or database issue" },
      { status: 400, headers: corsHeaders }
    );
  }
}
