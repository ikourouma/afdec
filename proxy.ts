import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminOnlyPath, isStaffRole, normalizeRole } from "@/lib/roles";

/**
 * Server-side route guard (Next.js 16 `proxy`, formerly middleware).
 *
 *  - /dashboard/admin/**            staff, admin, super_admin  (admin-only pages: see lib/roles.ts)
 *  - /dashboard/** (other)          any signed-in, active user
 *  - /deal-room/**                  signed-in; the page itself checks approval + NDA
 *  - /africa-intelligence/<country> signed-in ("registered"); the public map teaser stays open
 *  - /insights/data-terminal        signed-in ("registered")
 *  - /diaspora-impact-fund/apply    signed-in
 *
 * This is the first line of defence. The real protection is Row Level Security
 * in the database (database/sql-pack-v1.26b-foundation.sql).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const redirectTo = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    Object.entries(params ?? {}).forEach(([k, v]) => url.searchParams.set(k, v));
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  const isTerminalCountry =
    pathname.startsWith("/africa-intelligence/") && pathname !== "/africa-intelligence/";
  const isDataTerminal = pathname.startsWith("/insights/data-terminal");
  const needsSignIn =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/deal-room") ||
    pathname.startsWith("/diaspora-impact-fund/apply") ||
    isTerminalCountry ||
    isDataTerminal;

  if (!needsSignIn) return response;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isTerminalCountry) {
      const code = pathname.split("/")[2] ?? "";
      return redirectTo("/access-request", { country: code, next: pathname });
    }
    if (isDataTerminal) return redirectTo("/access-request", { next: pathname });
    return redirectTo("/auth", { redirect: pathname });
  }

  // Role + status come from the database, never from user-editable metadata.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  const status = profile?.status ?? "active";

  if (status !== "active") return redirectTo("/auth", { error: status });

  if (pathname.startsWith("/dashboard/admin")) {
    if (!isStaffRole(role)) return redirectTo("/dashboard");
    if (isAdminOnlyPath(pathname) && role === "staff") {
      return redirectTo("/dashboard/admin", { denied: "1" });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/deal-room/:path*",
    "/diaspora-impact-fund/apply/:path*",
    "/africa-intelligence/:path*",
    "/insights/data-terminal/:path*",
  ],
};
