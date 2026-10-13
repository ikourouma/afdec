/**
 * Role model shared by the proxy, client components and server code.
 * The database (RLS + helper functions in database/sql-pack-v1.26b-foundation.sql)
 * is the real enforcement. These helpers only decide what to SHOW and where to REDIRECT.
 *
 * See docs/ROLES-AND-PERMISSIONS.md for the full matrix.
 */

export type Role =
  | "super_admin"
  | "admin"
  | "staff"
  | "investor"
  | "member"
  | "registered";

export const ALL_ROLES: Role[] = ["super_admin", "admin", "staff", "investor", "member", "registered"];

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  investor: "Investor",
  member: "Member",
  registered: "Registered",
};

export type AccountStatus = "active" | "suspended" | "revoked";

export function normalizeRole(value: unknown): Role {
  return (ALL_ROLES as string[]).includes(String(value)) ? (value as Role) : "registered";
}

export const isSuperAdminRole = (r?: string | null) => r === "super_admin";
export const isAdminRole = (r?: string | null) => r === "super_admin" || r === "admin";
export const isStaffRole = (r?: string | null) => r === "super_admin" || r === "admin" || r === "staff";
export const isRegisteredRole = (r?: string | null) =>
  !!r && (ALL_ROLES as string[]).includes(r);
export const hasMemberRole = (r?: string | null) =>
  r === "member" || r === "investor" || isStaffRole(r);

/** Admin-console routes only an admin / super admin may open (staff are redirected). */
export const ADMIN_ONLY_PATHS = [
  "/dashboard/admin/users",
  "/dashboard/admin/settings",
  "/dashboard/admin/sponsorships",
  "/dashboard/admin/newsletter",
  "/dashboard/admin/deal-room",
  "/dashboard/admin/audit",
];

export function isAdminOnlyPath(pathname: string) {
  return ADMIN_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/** Where a user lands after signing in. */
export function homeForRole(role: Role): string {
  if (isStaffRole(role)) return "/dashboard/admin";
  if (role === "investor") return "/dashboard/investor";
  if (role === "member") return "/dashboard/member";
  return "/";
}
