import { NextRequest } from "next/server";

import {
  SESSION_COOKIE,
  readSessionCookieValue,
} from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const session = await readSessionCookieValue(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (!session) {
    return Response.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return Response.json({
    authenticated: true,
    user: {
      sub: session.sub,
      username: session.username,
      employeeId: session.employeeId,
      email: session.email,
      name: session.name,
      role: session.role,
      groups: session.groups ?? [],
    },
  });
}
