import { NextRequest, NextResponse } from "next/server";

import {
  getCognitoDomain,
  getPostLogoutRedirectUri,
  requireCognitoClientId,
} from "@/lib/auth/config";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
} from "@/lib/auth/session";

const authCookies = [
  SESSION_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_NEXT_COOKIE,
];

function expireAuthCookies(response: NextResponse) {
  authCookies.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  });
}

export async function GET(request: NextRequest) {
  const logoutUrl = new URL(`${getCognitoDomain()}/logout`);

  logoutUrl.searchParams.set(
    "client_id",
    requireCognitoClientId()
  );
  logoutUrl.searchParams.set(
    "logout_uri",
    getPostLogoutRedirectUri(request.nextUrl.origin)
  );

  const response = NextResponse.redirect(logoutUrl);
  expireAuthCookies(response);

  return response;
}
