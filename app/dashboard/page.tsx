"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { homeForRole } from "@/lib/roles";

/** Sends each signed-in user to the right dashboard. Roles come from profiles.role only. */
export default function DashboardRootRedirect() {
  const router = useRouter();
  const { loading, isSignedIn, role } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isSignedIn) {
      router.replace("/auth?redirect=/dashboard");
      return;
    }
    router.replace(homeForRole(role ?? "registered") === "/" ? "/dashboard/member" : homeForRole(role ?? "registered"));
  }, [loading, isSignedIn, role, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-pulse text-zinc-300 font-bold uppercase tracking-[0.2em] text-sm">
        Authenticating Identity...
      </div>
    </div>
  );
}
