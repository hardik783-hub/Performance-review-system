import type { AppRole } from "@/lib/auth/roles";

export const SESSION_COOKIE = "prs_session";
export const OAUTH_STATE_COOKIE = "prs_oauth_state";
export const OAUTH_NEXT_COOKIE = "prs_oauth_next";

export interface AuthSession {
  sub: string;
  username?: string;
  employeeId?: string;
  email?: string;
  name?: string;
  groups?: string[];
  role: AppRole;
  exp: number;
  iat: number;
}

const encoder = new TextEncoder();

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Missing AUTH_SESSION_SECRET. Generate one with `openssl rand -base64 32` and add it to .env.local."
    );
  }

  return secret;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlToString(value: string) {
  const base64 = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  return atob(base64);
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as AuthSession;

  return (
    typeof session.sub === "string" &&
    ["employee", "manager", "hr"].includes(session.role) &&
    typeof session.exp === "number" &&
    typeof session.iat === "number"
  );
}

export async function createSessionCookieValue(
  session: AuthSession
) {
  const payload = bytesToBase64Url(
    encoder.encode(JSON.stringify(session))
  );
  const signature = await sign(payload);

  return `${payload}.${signature}`;
}

export async function readSessionCookieValue(
  cookieValue?: string
) {
  if (!cookieValue) {
    return null;
  }

  const [payload, signature] = cookieValue.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = await sign(payload);

  if (signature !== expectedSignature) {
    return null;
  }

  const session = JSON.parse(
    base64UrlToString(payload)
  ) as unknown;

  if (!isAuthSession(session)) {
    return null;
  }

  if (session.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return session;
}

export function getSessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export function getShortLivedCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 300,
  };
}
