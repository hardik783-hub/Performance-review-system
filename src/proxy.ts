import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  readSessionCookieValue,
} from "@/lib/auth/session";
import {
  canAccessPath,
  getRoleLandingPage,
} from "@/lib/auth/roles";

const protectedPaths = [
  "/employee",
  "/hr",
  "/reviews",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await readSessionCookieValue(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (pathname === "/" && session) {
    return NextResponse.redirect(
      new URL(getRoleLandingPage(session.role), request.url)
    );
  }

  if (
    protectedPaths.some(
      (path) =>
        pathname === path || pathname.startsWith(`${path}/`)
    ) &&
    !session
  ) {
    const loginUrl = new URL("/api/auth/login", request.url);

    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (session && !canAccessPath(session.role, pathname)) {
    return NextResponse.redirect(
      new URL(getRoleLandingPage(session.role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/employee/:path*",
    "/hr/:path*",
    "/reviews/:path*",
  ],
};
