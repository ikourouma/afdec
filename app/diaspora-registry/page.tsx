"use client";

import React, { useEffect, useState } from "react";
import { Users, Globe2, MapPin, ShieldCheck, BarChart3, ClipboardList } from "lucide-react";
import { SiteShell } from "@/components/ui/site-shell";
import { DiasporaRegistrationForm } from "@/components/ui/diaspora-registration-form";
import { supabase } from "@/lib/supabase";

const WHY = [
  { icon: BarChart3, title: "Know our community", body: "Understand who the African diaspora in North Carolina is: origins, professions, generations and where we live." },
  { icon: ClipboardList, title: "Listen through surveys", body: "Registered members can be invited to short surveys that directly shape AfDEC programmes and policy advocacy." },
  { icon: Globe2, title: "Connect to opportunity", body: "Trade, investment, events and business support matched to the skills and interests of the community." },
  { icon: ShieldCheck, title: "Your data, protected", body: "Individual records are visible only to authorised AfDEC staff. Anything published is aggregated and anonymous." },
];

export default function DiasporaRegistryPage() {
  const [stats, setStats] = useState<{ members: number; origin_countries: number; residence_states: number } | null>(null);

  useEffect(() => {
    supabase.from("v_diaspora_stats").select("*").maybeSingle().then(({ data }) => data && setStats(data));
  }, []);

  return (
    <SiteShell>
      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">AfDEC Diaspora Registry</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5 max-w-3xl">Be counted. Be heard. Be connected.</h1>
          <p className="text-lg text-zinc-200 max-w-2xl leading-relaxed">
            The Registry is AfDEC&apos;s living record of the African diaspora. It lets us report on the community accurately, run surveys that matter and design services around real needs. Registration is free and takes about three minutes.
          </p>
          {stats && stats.members > 0 && (
            <dl className="mt-10 grid grid-cols-3 max-w-xl gap-px bg-zinc-800 rounded-xl overflow-hidden border border-zinc-800">
              {[
                { icon: Users, label: "Members", value: stats.members },
                { icon: Globe2, label: "Countries of origin", value: stats.origin_countries },
                { icon: MapPin, label: "States", value: stats.residence_states },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 px-5 py-4">
                  <dt className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5"><s.icon className="w-3 h-3" />{s.label}</dt>
                  <dd className="text-2xl font-black text-white">{s.value.toLocaleString()}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className="bg-zinc-950 py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-5 gap-10">
          <aside className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-white">Why register</h2>
            {WHY.map((w) => (
              <div key={w.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-900/60 flex items-center justify-center shrink-0"><w.icon className="w-5 h-5 text-blue-300" /></div>
                <div>
                  <h3 className="text-white font-black text-sm mb-1">{w.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{w.body}</p>
                </div>
              </div>
            ))}
          </aside>
          <div id="register" className="lg:col-span-3 scroll-mt-32">
            <DiasporaRegistrationForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
