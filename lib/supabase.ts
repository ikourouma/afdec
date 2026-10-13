import { createBrowserClient } from "@supabase/ssr";

// Ensure environment variables exist before initializing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing.");
}

export const DB_ERROR_EVENT = "afdec:db-error";

/**
 * Fetch wrapper: any failed data/storage write is broadcast as a window event so the admin
 * console can show it. Before this, a rejected save (RLS, validation) failed silently.
 */
const reportingFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, init);
  if (typeof window !== "undefined" && !res.ok) {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const method = (init?.method || (typeof input !== "string" && !(input instanceof URL) ? input.method : "GET")).toUpperCase();
    const isData = url.includes("/rest/v1/") || url.includes("/storage/v1/");
    const isNoise = res.status === 406 || res.status === 404 || (method === "GET" && res.status === 400 && url.includes("/rest/v1/rpc/"));
    if (isData && !isNoise) {
      res
        .clone()
        .json()
        .catch(() => ({}))
        .then((body) => {
          window.dispatchEvent(
            new CustomEvent(DB_ERROR_EVENT, {
              detail: { status: res.status, method, message: body?.message || body?.error || res.statusText, code: body?.code },
            })
          );
        });
    }
  }
  return res;
};

// Cookie-based browser client (singleton). The session cookie is what lets
// proxy.ts verify the user and role on the server before a page renders.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: reportingFetch },
});
