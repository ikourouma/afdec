"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, Globe2, ShieldCheck, ArrowUpRight, Inbox, FileText, Calendar, Lock, Handshake, UserPlus, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Count = number | null;

interface Tile {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count: Count;
  hint: string;
  attention?: boolean;
  adminOnly?: boolean;
}

async function count(table: string, filter?: (q: any) => any): Promise<Count> {
  let q: any = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c, error } = await q;
  return error ? null : c ?? 0;
}

function Overview() {
  const { profile, isAdmin } = useAuth();
  const params = useSearchParams();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<{ id: string; title: string; when: string; kind: string }[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString();
      const [users, diaspora, mapReq, dealReq, partner, members, leads, events, drafts, subs] = await Promise.all([
        isAdmin ? supabase.rpc("admin_list_users").then((r) => (r.error ? null : (r.data?.length ?? 0))) : Promise.resolve(null),
        count("diaspora_registry"),
        count("partner_map_requests", (q) => q.eq("status", "pending")),
        count("deal_room_access_requests", (q) => q.eq("status", "pending")),
        count("partner_requests", (q) => q.or("status.eq.pending,status.is.null")),
        count("membership_applications", (q) => q.eq("status", "pending")),
        count("lead_intakes", (q) => q.eq("status", "new")),
        count("events", (q) => q.gte("event_date", today)),
        count("insights_articles", (q) => q.neq("status", "published")),
        count("newsletter_subscribers", (q) => q.eq("is_active", true)),
      ]);
      setTiles([
        { label: "Terminal access requests", href: "/dashboard/admin/partner-requests", icon: Handshake, count: mapReq, hint: "Pending review", attention: (mapReq ?? 0) > 0 },
        { label: "Deal Room requests", href: "/dashboard/admin/deal-room/investor", icon: Lock, count: dealReq, hint: "Pending review", attention: (dealReq ?? 0) > 0, adminOnly: true },
        { label: "Partner applications", href: "/dashboard/admin/partner-requests", icon: Handshake, count: partner, hint: "Pending", attention: (partner ?? 0) > 0 },
        { label: "Membership applications", href: "/dashboard/admin/memberships", icon: UserPlus, count: members, hint: "Pending", attention: (members ?? 0) > 0 },
        { label: "New leads & enquiries", href: "/dashboard/admin/concierge", icon: Inbox, count: leads, hint: "Unactioned", attention: (leads ?? 0) > 0 },
        { label: "Draft / unpublished articles", href: "/dashboard/admin/policy", icon: FileText, count: drafts, hint: "In editorial pipeline" },
        { label: "Upcoming events", href: "/dashboard/admin/events", icon: Calendar, count: events, hint: "From today" },
        { label: "Diaspora registry", href: "/dashboard/admin/diaspora", icon: Globe2, count: diaspora, hint: "Registrants" },
        { label: "Platform users", href: "/dashboard/admin/users", icon: Users, count: users, hint: "All accounts", adminOnly: true },
        { label: "Newsletter subscribers", href: "/dashboard/admin/newsletter", icon: Mail, count: subs, hint: "Active", adminOnly: true },
      ]);

      const { data } = await supabase.from("lead_intakes").select("id, first_name, last_name, organization, source, created_at").order("created_at", { ascending: false }).limit(6);
      setRecent((data ?? []).map((l) => ({ id: l.id, title: `${l.first_name || ""} ${l.last_name || ""}`.trim() || l.organization || "Anonymous", when: l.created_at, kind: String(l.source).replace("_", " ") })));
      setLoading(false);
    })();
  }, [isAdmin]);

  const shown = tiles.filter((t) => isAdmin || !t.adminOnly);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-10 bg-zinc-50 min-h-screen">
      {params.get("denied") === "1" && (
        <p role="alert" className="p-3 border border-amber-300 bg-amber-50 text-amber-900 text-sm rounded-sm">That section is limited to administrators. Your role: staff.</p>
      )}
      <div>
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[0.3em]">{profile?.role === "staff" ? "Staff console" : "Administrator"}</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">AfDEC Command Center</h1>
        <p className="text-zinc-400 font-medium mt-1">Live counts from the platform database. Items needing action are highlighted.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-32 bg-white border border-zinc-200 rounded-lg animate-pulse" />)
          : shown.map((t) => (
              <Link key={t.label} href={t.href} className={`group bg-white border rounded-lg p-5 hover:shadow-lg transition-all ${t.attention ? "border-amber-400" : "border-zinc-200 hover:border-blue-300"}`}>
                <div className="flex items-start justify-between mb-4">
                  <t.icon className={`w-5 h-5 ${t.attention ? "text-amber-600" : "text-blue-600"}`} />
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                </div>
                <p className="text-3xl font-black text-zinc-900">{t.count === null ? "—" : t.count}</p>
                <p className="text-sm font-bold text-zinc-800 mt-1">{t.label}</p>
                <p className="text-xs text-zinc-400">{t.count === null ? "No access or table missing" : t.hint}</p>
              </Link>
            ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Latest enquiries</h2>
            <Link href="/dashboard/admin/concierge" className="text-xs font-bold text-blue-700 hover:underline">Open inbox →</Link>
          </div>
          <ul className="divide-y divide-zinc-100">
            {recent.length === 0 && <li className="px-6 py-8 text-sm text-zinc-400">No enquiries yet.</li>}
            {recent.map((r) => (
              <li key={r.id} className="px-6 py-3 flex items-center justify-between text-sm">
                <span className="font-bold text-zinc-900">{r.title}</span>
                <span className="text-xs uppercase text-zinc-400">{r.kind}</span>
                <span className="text-xs text-zinc-400">{new Date(r.when).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4">Quick actions</h2>
          <div className="space-y-2">
            {[
              ["Write a policy brief", "/dashboard/admin/policy"],
              ["Add an event", "/dashboard/admin/events"],
              ["Upload an asset", "/dashboard/admin/assets"],
              ["Edit country intelligence", "/dashboard/admin/intelligence"],
              ["Build a survey", "/dashboard/admin/surveys"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="flex items-center justify-between p-3 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 text-sm font-bold text-zinc-800">
                {label}
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="p-12 text-zinc-400">Loading…</div>}>
      <Overview />
    </Suspense>
  );
}
