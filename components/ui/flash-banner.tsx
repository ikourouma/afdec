"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, X, Megaphone } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface Alert {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  audience: string | null;
}

/** Site-wide banner driven by the `global_alerts` table (managed in Admin → Briefings & Alerts). */
export function FlashBanner() {
  const { isSignedIn, hasMemberAccess, loading } = useAuth();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    const now = new Date().toISOString();
    supabase
      .from("global_alerts")
      .select("id, message, link_text, link_url, audience, valid_from, valid_to")
      .eq("is_active", true)
      .lte("valid_from", now)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        const match = (data ?? []).find(
          (a) =>
            (!a.valid_to || a.valid_to >= now) &&
            (a.audience === "all" || !a.audience || (a.audience === "members" && (hasMemberAccess || isSignedIn)))
        );
        setAlert((match as Alert) ?? null);
        setDismissed(match ? window.sessionStorage.getItem(`alert-dismissed-${match.id}`) : null);
      });
  }, [loading, isSignedIn, hasMemberAccess]);

  if (!alert || dismissed) return null;

  const internal = alert.link_url?.startsWith("/");

  return (
    <div role="region" aria-label="Site announcement" className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-700 text-white relative z-[55]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-2.5 flex items-center justify-between text-xs sm:text-sm font-medium tracking-wide">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center p-1 bg-white/20 rounded-full">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline font-bold uppercase tracking-widest text-emerald-100 mr-1">
            {alert.audience === "members" ? "Members:" : "Announcement:"}
          </span>
          <span>{alert.message}</span>
        </div>

        <div className="flex items-center space-x-6 shrink-0 ml-4">
          {alert.link_url && alert.link_text &&
            (internal ? (
              <Link href={alert.link_url} className="flex items-center space-x-1 group hover:text-emerald-100 transition-colors">
                <span className="font-bold underline underline-offset-4 decoration-white/40 group-hover:decoration-white">{alert.link_text}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <a href={alert.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 group hover:text-emerald-100 transition-colors">
                <span className="font-bold underline underline-offset-4 decoration-white/40 group-hover:decoration-white">{alert.link_text}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          <button
            onClick={() => {
              window.sessionStorage.setItem(`alert-dismissed-${alert.id}`, "1");
              setDismissed("1");
            }}
            className="text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white rounded-sm p-0.5"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
