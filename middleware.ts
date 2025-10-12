import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const url = new URL(request.url);
  if (!sessionCookie) {
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard"],
};