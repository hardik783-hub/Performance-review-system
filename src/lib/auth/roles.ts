export type AppRole = "employee" | "manager" | "hr";

const roleLandingPages: Record<AppRole, string> = {
  employee: "/employee",
  manager: "/reviews/manager",
  hr: "/hr",
};

export function getRoleLandingPage(role: AppRole) {
  return roleLandingPages[role];
}

export function getRoleFromClaims(
  groups: string[] = [],
  roleClaim?: string
): AppRole {
  const values = [...groups, roleClaim ?? ""].map((value) =>
    value.toLowerCase().replace(/[\s_-]/g, "")
  );

  if (
    values.some((value) =>
      [
        "hr",
        "hradmin",
        "humanresources",
        "admin",
      ].includes(value)
    )
  ) {
    return "hr";
  }

  if (
    values.some((value) =>
      ["manager", "reviewmanager"].includes(value)
    )
  ) {
    return "manager";
  }

  return "employee";
}

export function canAccessPath(
  role: AppRole,
  pathname: string
) {
  if (pathname.startsWith("/hr")) {
    return role === "hr";
  }

  if (pathname.startsWith("/reviews/manager")) {
    return role === "manager" || role === "hr";
  }

  return true;
}
