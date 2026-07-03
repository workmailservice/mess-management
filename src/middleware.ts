import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic check only (cookie presence, no DB call — fast, edge-safe).
// Fine-grained permission checks happen server-side per route/service via
// requirePermission() in src/lib/auth/permissions.ts — never trust this alone.
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/customers/:path*",
    "/attendance/:path*",
    "/billing/:path*",
    "/payments/:path*",
    "/expenses/:path*",
    "/income/:path*",
    "/reminders/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/audit-logs/:path*",
    "/profile/:path*",
  ],
};
