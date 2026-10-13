"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Globe2, Lock, Settings, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { SiteShell } from "@/components/ui/site-shell";
import { useAuth } from "@/lib/auth";

export default function InvestorDashboardPage() {
  const { profile, loading, isSignedIn } = useAuth();
  const dealRoom = profile?.deal_room_approved
    ? profile.nda_accepted_at ? "Active" : "Approved — NDA pending"
    : "Not requested / under review";

  const cards = [
    { href: "/deal-room", icon: Lock, title: "Deal Room", body: `Status: ${dealRoom}. Offering documents, models and structure papers.` },
    { href: "/africa-intelligence", icon: Globe2, title: "Africa Intelligence Terminal", body: "Country briefs, sector intelligence, risk & mitigation." },
    { href: "/diaspora-impact-fund", icon: Briefcase, title: "Diaspora Impact Fund", body: "Projects, contribution paths and impact reporting." },
    { href: "/dashboard/settings", icon: Settings, title: "Account settings", body: "Profile, password and sign-out." },
  ];

  return (
    <SiteShell>
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Investor dashboard</h1>
          {loading ? (
            <p className="text-zinc-300">Loading…</p>
          ) : !isSignedIn ? (
            <p className="text-zinc-300">Please <Link href="/auth?redirect=/dashboard/investor" className="underline text-blue-300">sign in</Link>.</p>
          ) : (
            <>
              <p className="text-zinc-300 mb-8 flex items-center gap-2">
                Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}.
                {profile?.deal_room_approved && profile.nda_accepted_at ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                <span className="text-sm">Deal Room: {dealRoom}</span>
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                {cards.map((c) => (
                  <Link key={c.href} href={c.href} className="group border border-zinc-700 bg-zinc-900/60 hover:border-blue-500 p-6 rounded-sm transition-colors">
                    <c.icon className="w-7 h-7 text-blue-400 mb-4" />
                    <h2 className="text-lg font-bold text-white mb-1">{c.title}</h2>
                    <p className="text-zinc-300 text-sm mb-4">{c.body}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white">Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
