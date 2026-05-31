import { NextRequest, NextResponse } from "next/server";

import {
  cognitoConfig,
  getCognitoDomain,
  getRedirectUri,
  requireCognitoClientId,
} from "@/lib/auth/config";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  getShortLivedCookieOptions,
} from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const state = crypto.randomUUID();
  const nextPath =
    request.nextUrl.searchParams.get("next");
  const authorizeUrl = new URL(
    `${getCognitoDomain()}/oauth2/authorize`
  );

  authorizeUrl.searchParams.set(
    "client_id",
    requireCognitoClientId()
  );
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", cognitoConfig.scopes);
  authorizeUrl.searchParams.set(
    "redirect_uri",
    getRedirectUri(request.nextUrl.origin)
  );
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(
    OAUTH_STATE_COOKIE,
    state,
    getShortLivedCookieOptions()
  );
  if (nextPath?.startsWith("/")) {
    response.cookies.set(
      OAUTH_NEXT_COOKIE,
      nextPath,
      getShortLivedCookieOptions()
    );
  }

  return response;
}
