"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock, ArrowLeft, FileText, Sparkles, AlertTriangle, TrendingUp, Briefcase, Globe, BarChart3, Ship, ShieldAlert } from "lucide-react";
import { SiteShell } from "@/components/ui/site-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Row = Record<string, any>;

const TABS = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "economy", label: "Economy", icon: BarChart3 },
  { id: "sectors", label: "Sectors", icon: TrendingUp },
  { id: "trade", label: "Trade", icon: Ship },
  { id: "opportunities", label: "Opportunities", icon: Briefcase },
  { id: "risk", label: "Risk & Mitigation", icon: ShieldAlert },
  { id: "reports", label: "Reports", icon: FileText },
] as const;
type TabId = (typeof TABS)[number]["id"];

const usd = (n?: number | null) => {
  if (n == null) return "—";
  const v = Number(n);
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
};
const pct = (n?: number | null) => (n == null ? "—" : `${Number(n) >= 0 ? "+" : ""}${Number(n).toFixed(1)}%`);
const pop = (n?: number | null) => (n == null ? "—" : Number(n) >= 1e9 ? `${(Number(n) / 1e9).toFixed(2)}B` : `${(Number(n) / 1e6).toFixed(1)}M`);

const LEVEL_STYLE: Record<string, string> = {
  low: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
  medium: "bg-amber-950/60 text-amber-300 border-amber-800/60",
  high: "bg-red-950/60 text-red-300 border-red-800/60",
};

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-300 border border-dashed border-zinc-700 rounded-lg px-5 py-8 text-center">{children}</p>;
}

function MemberUpsell() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-blue-900/50 bg-blue-950/20 px-5 py-4">
      <p className="text-sm text-zinc-200 flex items-center gap-3">
        <Lock className="w-4 h-4 text-blue-300 shrink-0" />
        Additional content in this section is available to AfDEC members and approved institutional partners.
      </p>
      <Link href="/access-request" className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-sm text-center">
        Request member access
      </Link>
    </div>
  );
}

export default function CountryBriefPage() {
  const params = useParams<{ country: string }>();
  const iso3 = String(params?.country ?? "").toUpperCase();
  const { loading: authLoading, hasMemberAccess } = useAuth();
  const [tab, setTab] = useState<TabId>("overview");
  const [state, setState] = useState<"loading" | "ready" | "notfound" | "error">("loading");
  const [profile, setProfile] = useState<Row | null>(null);
  const [indicators, setIndicators] = useState<Row[]>([]);
  const [sectors, setSectors] = useState<Row[]>([]);
  const [trade, setTrade] = useState<Row[]>([]);
  const [opps, setOpps] = useState<Row[]>([]);
  const [risks, setRisks] = useState<Row[]>([]);
  const [reports, setReports] = useState<Row[]>([]);

  useEffect(() => {
    if (authLoading || !/^[A-Z]{3}$/.test(iso3)) {
      if (!authLoading) setState("notfound");
      return;
    }
    let active = true;
    (async () => {
      const [p, ind, sec, tr, op, rk, rp] = await Promise.all([
        supabase.from("country_profiles").select("*").eq("country_code", iso3).maybeSingle(),
        supabase.from("country_indicators").select("*").eq("country_code", iso3).order("year", { ascending: false }),
        supabase.from("country_sectors").select("*").eq("country_code", iso3).order("sort_order"),
        supabase.from("country_trade").select("*").eq("country_code", iso3).order("value_usd", { ascending: false }),
        supabase.from("country_opportunities").select("*").eq("country_code", iso3),
        supabase.from("country_risks").select("*").eq("country_code", iso3).order("sort_order"),
        supabase.from("country_reports").select("*").or(`country_code.eq.${iso3},country_code.is.null`).order("published_at", { ascending: false }),
      ]);
      if (!active) return;
      if (p.error) return setState("error");
      if (!p.data) return setState("notfound");
      setProfile(p.data);
      setIndicators(ind.data ?? []);
      setSectors(sec.data ?? []);
      setTrade(tr.data ?? []);
      setOpps(op.data ?? []);
      setRisks(rk.data ?? []);
      setReports(rp.data ?? []);
      setState("ready");
    })();
    return () => { active = false; };
  }, [authLoading, iso3]);

  const indicatorHistory = useMemo(() => {
    const byKey: Record<string, Row[]> = {};
    indicators.forEach((i) => { (byKey[i.indicator] ||= []).push(i); });
    return byKey;
  }, [indicators]);

  const kpis = profile
    ? [
        { label: "GDP", value: usd(profile.gdp_usd) },
        { label: "GDP growth", value: pct(profile.gdp_growth_pct) },
        { label: "Population", value: pop(profile.population) },
        { label: "FDI inflows", value: usd(profile.fdi_inflows_usd) },
      ]
    : [];

  return (
    <SiteShell>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">
        <Link href="/africa-intelligence" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to the Intelligence Terminal
        </Link>

        {(state === "loading" || authLoading) && <p className="text-zinc-300">Loading country brief…</p>}
        {state === "notfound" && !authLoading && <Empty>No brief has been published for “{iso3}” yet.</Empty>}
        {state === "error" && <Empty>The brief could not be loaded. Please try again shortly.</Empty>}

        {state === "ready" && profile && (
          <>
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">{profile.region}</span>
                {profile.afdec_priority && <span className="text-[11px] font-black uppercase tracking-widest text-yellow-300 border border-yellow-700/60 rounded-full px-2.5 py-0.5">AfDEC priority market</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{profile.flag ? `${profile.flag} ` : ""}{profile.country_name}</h1>
              {profile.capital && <p className="text-sm text-zinc-300 mt-1">Capital: {profile.capital}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 rounded-xl overflow-hidden mt-6 border border-zinc-800">
                {kpis.map((k) => (
                  <div key={k.label} className="bg-zinc-900 px-5 py-4">
                    <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest mb-1">{k.label}</div>
                    <div className="text-2xl font-black text-white">{k.value}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-400 mt-3">
                {profile.data_year ? `Data year ${profile.data_year}. ` : ""}
                {profile.data_source ? `Source: ${profile.data_source}. ` : ""}
                {profile.data_as_of ? `As of ${profile.data_as_of}.` : ""}
              </p>
            </header>

            <div role="tablist" aria-label="Country brief sections" className="flex gap-1 overflow-x-auto border-b border-zinc-800 mb-8">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                    tab === t.id ? "border-blue-500 text-white" : "border-transparent text-zinc-300 hover:text-white"
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              ))}
            </div>

            <section role="tabpanel" className="space-y-6">
              {tab === "overview" && (
                <div className="space-y-6">
                  {profile.overview ? <p className="text-zinc-100 leading-relaxed">{profile.overview}</p> : <Empty>Overview not yet published.</Empty>}
                  {[
                    ["Political context", profile.political_context],
                    ["Business climate", profile.business_climate],
                    ["North Carolina corridor", profile.nc_corridor_summary],
                    ["AfDEC assessment", profile.afdec_notes],
                  ].map(([title, body]) =>
                    body ? (
                      <div key={title as string} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                        <h2 className="text-xs font-black text-blue-300 uppercase tracking-widest mb-2">{title}</h2>
                        <p className="text-sm text-zinc-200 leading-relaxed">{body}</p>
                      </div>
                    ) : null,
                  )}
                </div>
              )}

              {tab === "economy" &&
                (Object.keys(indicatorHistory).length === 0 ? (
                  <Empty>Historical indicators have not been published for this country yet. Headline figures are shown above.</Empty>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-zinc-800">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-900 text-zinc-300 text-xs uppercase tracking-widest">
                        <tr><th className="text-left px-4 py-3">Indicator</th><th className="text-left px-4 py-3">Year</th><th className="text-right px-4 py-3">Value</th><th className="text-left px-4 py-3">Source</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {indicators.map((i) => (
                          <tr key={i.id}>
                            <td className="px-4 py-3 text-zinc-100 font-semibold">{String(i.indicator).replace(/_/g, " ")}</td>
                            <td className="px-4 py-3 text-zinc-300">{i.year}</td>
                            <td className="px-4 py-3 text-right text-white font-black">{Number(i.value).toLocaleString()}{i.unit ? ` ${i.unit}` : ""}</td>
                            <td className="px-4 py-3 text-zinc-300">{i.source ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

              {tab === "sectors" &&
                (sectors.length === 0 ? <Empty>Sector intelligence is being compiled.</Empty> : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {sectors.map((s) => (
                      <div key={s.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                        <h2 className="text-white font-black mb-1">{s.sector}</h2>
                        <p className="text-xs text-zinc-300 mb-3">
                          {s.gdp_share_pct != null && `${s.gdp_share_pct}% of GDP`}{s.gdp_share_pct != null && s.growth_pct != null && " · "}{s.growth_pct != null && `${pct(s.growth_pct)} growth`}
                        </p>
                        {s.summary && <p className="text-sm text-zinc-200 leading-relaxed">{s.summary}</p>}
                        {s.key_players?.length > 0 && <p className="text-xs text-zinc-300 mt-3">Key players: {s.key_players.join(", ")}</p>}
                      </div>
                    ))}
                  </div>
                ))}

              {tab === "trade" &&
                (trade.length === 0 ? <Empty>Trade data has not been published for this country yet.</Empty> : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {(["export", "import"] as const).map((dir) => (
                      <div key={dir} className="rounded-lg border border-zinc-800 overflow-hidden">
                        <h2 className="bg-zinc-900 px-4 py-3 text-xs font-black text-blue-300 uppercase tracking-widest">{dir === "export" ? "Top exports" : "Top imports"}</h2>
                        <ul className="divide-y divide-zinc-800">
                          {trade.filter((t) => t.direction === dir).map((t) => (
                            <li key={t.id} className="px-4 py-3 flex justify-between gap-4 text-sm">
                              <span className="text-zinc-100">{t.product ?? t.partner ?? "—"}{t.partner && t.product ? <span className="text-zinc-300"> · {t.partner}</span> : null}</span>
                              <span className="text-white font-black shrink-0">{usd(t.value_usd)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}

              {tab === "opportunities" && (
                <>
                  {!hasMemberAccess && <MemberUpsell />}
                  {opps.length === 0 ? <Empty>No opportunities are visible at your access level.</Empty> : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {opps.map((o) => (
                        <div key={o.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h2 className="text-white font-black">{o.title}</h2>
                            {o.stage && <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 border border-blue-900 rounded-full px-2 py-0.5">{o.stage}</span>}
                          </div>
                          {o.sector && <p className="text-xs text-zinc-300 mb-2">{o.sector}</p>}
                          {o.description && <p className="text-sm text-zinc-200 leading-relaxed">{o.description}</p>}
                          <p className="text-xs text-zinc-300 mt-3">
                            {(o.ticket_min_usd || o.ticket_max_usd) && `Ticket: ${usd(o.ticket_min_usd)} – ${usd(o.ticket_max_usd)}`}
                            {o.nc_link && ` · NC link: ${o.nc_link}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === "risk" && (
                <>
                  {!hasMemberAccess && <MemberUpsell />}
                  {risks.length === 0 ? <Empty>No risk assessments are visible at your access level.</Empty> : (
                    <div className="space-y-4">
                      {risks.map((r) => (
                        <div key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-300" />
                            <h2 className="text-white font-black">{r.title}</h2>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">{r.category}</span>
                            <span className={`ml-auto text-[11px] font-black uppercase tracking-widest border rounded-full px-2.5 py-0.5 ${LEVEL_STYLE[r.level] ?? LEVEL_STYLE.medium}`}>{r.level}</span>
                          </div>
                          {r.description && <p className="text-sm text-zinc-200 leading-relaxed">{r.description}</p>}
                          {r.mitigation && (
                            <p className="text-sm text-emerald-200 leading-relaxed mt-3 border-t border-zinc-800 pt-3">
                              <span className="font-black uppercase tracking-widest text-[11px] text-emerald-300 block mb-1">Mitigation</span>
                              {r.mitigation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {tab === "reports" && (
                <>
                  {!hasMemberAccess && <MemberUpsell />}
                  {reports.length === 0 ? <Empty>No reports are available at your access level.</Empty> : (
                    <ul className="space-y-3">
                      {reports.map((r) => (
                        <li key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-white font-black">{r.title}</h2>
                              {r.is_ai_generated && <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-purple-300 border border-purple-800 rounded-full px-2 py-0.5"><Sparkles className="w-3 h-3" /> AI-assisted</span>}
                            </div>
                            <p className="text-xs text-zinc-300">{String(r.report_type).replace(/-/g, " ")} · {new Date(r.published_at).toLocaleDateString()}</p>
                            {r.summary && <p className="text-sm text-zinc-200 mt-2">{r.summary}</p>}
                          </div>
                          {r.file_url && /^https?:\/\//.test(r.file_url) && (
                            <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="shrink-0 px-5 py-2.5 border border-zinc-600 hover:border-zinc-300 text-white text-xs font-black uppercase tracking-widest rounded-sm text-center">
                              Download
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>
    </SiteShell>
  );
}
