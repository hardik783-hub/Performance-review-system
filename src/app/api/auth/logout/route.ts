import { NextRequest, NextResponse } from "next/server";

import {
  getCognitoDomain,
  getPostLogoutRedirectUri,
  requireCognitoClientId,
} from "@/lib/auth/config";
import { SESSION_COOKIE } from "@/lib/auth/session";

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
  response.cookies.delete(SESSION_COOKIE);

  return response;
}
