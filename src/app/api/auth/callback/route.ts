import { NextRequest, NextResponse } from "next/server";

import {
  createAuthSession,
  exchangeCodeForTokens,
  fetchCognitoUserInfo,
} from "@/lib/auth/cognito";
import {
  canAccessPath,
  getRoleLandingPage,
} from "@/lib/auth/roles";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  createSessionCookieValue,
  getSessionCookieOptions,
} from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(
    OAUTH_STATE_COOKIE
  )?.value;
  const nextPath =
    request.cookies.get(OAUTH_NEXT_COOKIE)?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(
      new URL("/?authError=invalid_state", request.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(
      code,
      request.nextUrl.origin
    );
    const userInfo = await fetchCognitoUserInfo(
      tokens.access_token
    ).catch((error) => {
      console.warn(
        "Cognito userInfo request failed; using ID token claims instead.",
        error
      );

      return undefined;
    });
    const session = createAuthSession(tokens, userInfo);
    const cookieValue = await createSessionCookieValue(session);
    const expires = new Date(session.exp * 1000);
    const landingPath =
      nextPath && canAccessPath(session.role, nextPath)
        ? nextPath
        : getRoleLandingPage(session.role);
    const response = NextResponse.redirect(
      new URL(landingPath, request.url)
    );

    response.cookies.set(
      SESSION_COOKIE,
      cookieValue,
      getSessionCookieOptions(expires)
    );
    response.cookies.delete(OAUTH_STATE_COOKIE);
    response.cookies.delete(OAUTH_NEXT_COOKIE);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(
      new URL("/?authError=callback_failed", request.url)
    );
  }
}
