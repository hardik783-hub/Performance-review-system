import {
  cognitoConfig,
  getCognitoDomain,
  getRedirectUri,
  requireCognitoClientId,
} from "@/lib/auth/config";
import { getRoleFromClaims } from "@/lib/auth/roles";
import type { AuthSession } from "@/lib/auth/session";

interface CognitoTokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  token_type: "Bearer";
}

interface CognitoUserInfo {
  sub: string;
  username?: string;
  employeeId?: string;
  email?: string;
  name?: string;
  "cognito:username"?: string;
}

function decodeJwtPayload(token?: string) {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  const base64 = payload
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(payload.length / 4) * 4, "=");

  return JSON.parse(atob(base64)) as Record<string, unknown>;
}

function buildTokenHeaders() {
  const headers = new Headers({
    "content-type": "application/x-www-form-urlencoded",
  });

  if (cognitoConfig.clientSecret) {
    headers.set(
      "authorization",
      `Basic ${btoa(
        `${requireCognitoClientId()}:${cognitoConfig.clientSecret}`
      )}`
    );
  }

  return headers;
}

export async function exchangeCodeForTokens(
  code: string,
  origin: string
) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: requireCognitoClientId(),
    code,
    redirect_uri: getRedirectUri(origin),
  });

  const response = await fetch(`${getCognitoDomain()}/oauth2/token`, {
    method: "POST",
    headers: buildTokenHeaders(),
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Cognito token exchange failed: ${response.status} ${details}`
    );
  }

  return (await response.json()) as CognitoTokenResponse;
}

export async function fetchCognitoUserInfo(accessToken: string) {
  const response = await fetch(`${getCognitoDomain()}/oauth2/userInfo`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Cognito userInfo failed: ${response.status} ${details}`
    );
  }

  return (await response.json()) as CognitoUserInfo;
}

export function createAuthSession(
  tokens: CognitoTokenResponse,
  userInfo: Partial<CognitoUserInfo> = {}
): AuthSession {
  const now = Math.floor(Date.now() / 1000);
  const idClaims = decodeJwtPayload(tokens.id_token);
  const sub =
    userInfo.sub ??
    (typeof idClaims?.sub === "string"
      ? idClaims.sub
      : undefined);

  if (!sub) {
    throw new Error(
      "Cognito session is missing a user subject."
    );
  }

  const tokenExpiresAt =
    typeof idClaims?.exp === "number"
      ? idClaims.exp
      : now + tokens.expires_in;
  const expiresAt = Math.min(
    tokenExpiresAt,
    now + 8 * 60 * 60
  );
  const groups = idClaims?.["cognito:groups"];
  const normalizedGroups = Array.isArray(groups)
    ? groups.filter(
        (group): group is string =>
          typeof group === "string"
      )
    : [];
  const roleClaim =
    typeof idClaims?.["custom:role"] === "string"
      ? idClaims["custom:role"]
      : typeof idClaims?.role === "string"
        ? idClaims.role
        : undefined;

  return {
    sub,
    username:
      userInfo["cognito:username"] ??
      userInfo.username ??
      (typeof idClaims?.["cognito:username"] === "string"
        ? idClaims["cognito:username"]
        : undefined),
    employeeId:
      userInfo.employeeId ??
      (typeof idClaims?.["custom:employeeId"] === "string"
        ? idClaims["custom:employeeId"]
        : typeof idClaims?.employeeId === "string"
          ? idClaims.employeeId
          : undefined),
    email:
      userInfo.email ??
      (typeof idClaims?.email === "string"
        ? idClaims.email
        : undefined),
    name:
      userInfo.name ??
      (typeof idClaims?.name === "string"
        ? idClaims.name
        : undefined),
    groups: normalizedGroups,
    role: getRoleFromClaims(normalizedGroups, roleClaim),
    iat: now,
    exp: expiresAt,
  };
}
