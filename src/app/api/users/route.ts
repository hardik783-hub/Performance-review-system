import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  type AttributeType,
  type UserType,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest } from "next/server";

import { cognitoConfig } from "@/lib/auth/config";
import { getRoleFromClaims } from "@/lib/auth/roles";
import {
  SESSION_COOKIE,
  readSessionCookieValue,
} from "@/lib/auth/session";
import type { CognitoUserSummary } from "@/types/review";

export const runtime = "nodejs";

const client = new CognitoIdentityProviderClient({
  region:
    process.env.AWS_REGION ??
    cognitoConfig.userPoolId.split("_")[0],
});

function getAttribute(
  attributes: AttributeType[] = [],
  name: string
) {
  return attributes.find(
    (attribute) => attribute.Name === name
  )?.Value;
}

function getDisplayName(user: UserType) {
  const name = getAttribute(user.Attributes, "name");
  const givenName = getAttribute(
    user.Attributes,
    "given_name"
  );
  const familyName = getAttribute(
    user.Attributes,
    "family_name"
  );
  const fullName = [givenName, familyName]
    .filter(Boolean)
    .join(" ");
  const email = getAttribute(user.Attributes, "email");

  return (
    name ||
    fullName ||
    email ||
    user.Username ||
    "Unknown User"
  );
}

async function getGroups(username: string) {
  const result = await client.send(
    new AdminListGroupsForUserCommand({
      UserPoolId: cognitoConfig.userPoolId,
      Username: username,
    })
  );

  return (
    result.Groups?.map((group) => group.GroupName).filter(
      (group): group is string => Boolean(group)
    ) ?? []
  );
}

export async function GET(request: NextRequest) {
  const session = await readSessionCookieValue(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (!session) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      { cache: "no-store" }
    );
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") ??
          "application/json",
      },
    });
  }

  try {
    const users: CognitoUserSummary[] = [];
    let paginationToken: string | undefined;

    do {
      const result = await client.send(
        new ListUsersCommand({
          UserPoolId: cognitoConfig.userPoolId,
          PaginationToken: paginationToken,
          Limit: 60,
        })
      );

      for (const user of result.Users ?? []) {
        if (!user.Username) {
          continue;
        }

        const groups = await getGroups(user.Username);
        const role = getRoleFromClaims(
          groups,
          getAttribute(user.Attributes, "custom:role")
        );
        const employeeId =
          getAttribute(user.Attributes, "custom:employeeId") ??
          getAttribute(user.Attributes, "employeeId") ??
          user.Username;

        users.push({
          id:
            getAttribute(user.Attributes, "sub") ??
            user.Username,
          username: user.Username,
          employeeId,
          displayName: getDisplayName(user),
          email: getAttribute(user.Attributes, "email"),
          role,
          groups,
        });
      }

      paginationToken = result.PaginationToken;
    } while (paginationToken);

    users.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );

    return Response.json({ users });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message:
          "Unable to list Cognito users. Check AWS credentials and cognito-idp permissions.",
      },
      { status: 500 }
    );
  }
}
