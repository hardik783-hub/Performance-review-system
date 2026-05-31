/* eslint-disable @typescript-eslint/no-require-imports */

const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminListGroupsForUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const USER_POOL_ID =
  process.env.COGNITO_USER_POOL_ID ||
  "us-east-1_tz16CeJMW";
const REGION =
  process.env.AWS_REGION ||
  USER_POOL_ID.split("_")[0];

const client =
  new CognitoIdentityProviderClient({
    region: REGION,
  });

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods":
        "GET,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

function getAttribute(attributes = [], name) {
  return attributes.find(
    (attribute) => attribute.Name === name
  )?.Value;
}

function getRole(groups = [], roleClaim = "") {
  const values = [...groups, roleClaim].map(
    (value) =>
      value
        .toLowerCase()
        .replace(/[\s_-]/g, "")
  );

  if (
    values.some((value) =>
      ["hr", "humanresources", "admin"].includes(
        value
      ) || value === "hradmin"
    )
  ) {
    return "hr";
  }

  if (
    values.some((value) =>
      ["manager", "reviewmanager"].includes(
        value
      )
    )
  ) {
    return "manager";
  }

  return "employee";
}

function getDisplayName(user) {
  const name = getAttribute(
    user.Attributes,
    "name"
  );
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
  const email = getAttribute(
    user.Attributes,
    "email"
  );

  return (
    name ||
    fullName ||
    email ||
    user.Username ||
    "Unknown User"
  );
}

async function getGroups(username) {
  const result = await client.send(
    new AdminListGroupsForUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
    })
  );

  return (
    result.Groups?.map(
      (group) => group.GroupName
    ).filter(Boolean) || []
  );
}

exports.handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(200, {});
  }

  try {
    const users = [];
    let paginationToken;

    do {
      const result = await client.send(
        new ListUsersCommand({
          UserPoolId: USER_POOL_ID,
          PaginationToken: paginationToken,
          Limit: 60,
        })
      );

      for (const user of result.Users || []) {
        if (!user.Username) {
          continue;
        }

        const groups = await getGroups(
          user.Username
        );
        const employeeId =
          getAttribute(
            user.Attributes,
            "custom:employeeId"
          ) ||
          getAttribute(
            user.Attributes,
            "employeeId"
          ) ||
          user.Username;

        users.push({
          id:
            getAttribute(
              user.Attributes,
              "sub"
            ) || user.Username,
          username: user.Username,
          employeeId,
          displayName: getDisplayName(user),
          email: getAttribute(
            user.Attributes,
            "email"
          ),
          role: getRole(
            groups,
            getAttribute(
              user.Attributes,
              "custom:role"
            )
          ),
          groups,
        });
      }

      paginationToken =
        result.PaginationToken;
    } while (paginationToken);

    users.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );

    return response(200, { users });
  } catch (error) {
    console.error(error);

    return response(500, {
      success: false,
      message:
        "Unable to list Cognito users",
    });
  }
};
