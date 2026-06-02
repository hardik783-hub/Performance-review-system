export const cognitoConfig = {
  domain:
    process.env.COGNITO_DOMAIN ??
    "https://vaultfinal123.auth.us-east-1.amazoncognito.com",
  userPoolId:
    process.env.COGNITO_USER_POOL_ID ??
    "us-east-1_tz16CeJMW",
  clientId: process.env.COGNITO_CLIENT_ID,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
  scopes:
    process.env.COGNITO_SCOPES ??
    "openid email profile",
};

export function getCognitoDomain() {
  return cognitoConfig.domain.replace(/\/$/, "");
}

export function requireCognitoClientId() {
  if (!cognitoConfig.clientId) {
    throw new Error(
      "Missing COGNITO_CLIENT_ID. Add your Cognito app client ID to .env.local."
    );
  }

  return cognitoConfig.clientId;
}

export function getRedirectUri(origin: string) {
  return (
    process.env.COGNITO_REDIRECT_URI ??
    `${origin}/api/auth/callback`
  );
}

export function getPostLogoutRedirectUri(origin: string) {
  return (
    process.env.COGNITO_POST_LOGOUT_REDIRECT_URI ??
    `${origin}/`
  );
}
