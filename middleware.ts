import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // example: token stored in cookie
  const token = req.cookies.get("session")?.value;

  // protect dashboard routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only on dashboard routes
export const config = {
  matcher: ["/dashboard", "/user", "/order", "/products",],
};
