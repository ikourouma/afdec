"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

/** Homepage call-to-action for the Diaspora Registry. Shows live aggregate counts when available. */
export function DiasporaRegistryStrip() {
  const [stats, setStats] = useState<{ members: number; origin_countries: number } | null>(null);

  useEffect(() => {
    supabase.from("v_diaspora_stats").select("members, origin_countries").maybeSingle().then(({ data }) => data && setStats(data));
  }, []);

  return (
    <section aria-labelledby="registry-strip-title" className="bg-emerald-950/30 border-y border-emerald-900/50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 id="registry-strip-title" className="text-xl md:text-2xl font-black text-white tracking-tight">Are you part of the African diaspora?</h2>
            <p className="text-zinc-200 text-sm md:text-base mt-1 max-w-2xl">
              Join the AfDEC Diaspora Registry so we can represent, survey and serve our community with real data.
              {stats && stats.members > 0 ? ` ${stats.members.toLocaleString()} members from ${stats.origin_countries} countries have already registered.` : ""}
            </p>
          </div>
        </div>
        <Link href="/diaspora-registry" className="inline-flex items-center justify-center gap-2 shrink-0 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-colors">
          Join the Registry <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
