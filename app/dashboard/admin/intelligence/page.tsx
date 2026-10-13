"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Compass, Search, Plus, Trash2, Save, Star, Edit3, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Row = Record<string, any>;
type Field = { key: string; label: string; type?: "text" | "number" | "textarea" | "select" | "date"; options?: string[]; required?: boolean; wide?: boolean };

const TIER = ["member", "registered"];

/** One editable child table, scoped to the selected country. */
const CHILD_TABLES: { id: string; label: string; table: string; order: string; fields: Field[]; summary: (r: Row) => string; nullableCountry?: boolean; defaults?: Row }[] = [
  {
    id: "indicators", label: "Indicators", table: "country_indicators", order: "year",
    fields: [
      { key: "indicator", label: "Indicator (e.g. inflation_pct)", required: true },
      { key: "year", label: "Year", type: "number", required: true },
      { key: "value", label: "Value", type: "number", required: true },
      { key: "unit", label: "Unit" },
      { key: "source", label: "Source" },
      { key: "source_url", label: "Source URL" },
    ],
    summary: (r) => `${r.indicator} · ${r.year} · ${r.value}${r.unit ? " " + r.unit : ""}`,
  },
  {
    id: "sectors", label: "Sectors", table: "country_sectors", order: "sort_order",
    fields: [
      { key: "sector", label: "Sector", required: true },
      { key: "gdp_share_pct", label: "GDP share %", type: "number" },
      { key: "growth_pct", label: "Growth %", type: "number" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "summary", label: "Summary", type: "textarea", wide: true },
    ],
    summary: (r) => `${r.sector}${r.gdp_share_pct != null ? ` · ${r.gdp_share_pct}% of GDP` : ""}`,
  },
  {
    id: "trade", label: "Trade", table: "country_trade", order: "value_usd",
    fields: [
      { key: "direction", label: "Direction", type: "select", options: ["export", "import"], required: true },
      { key: "product", label: "Product" },
      { key: "partner", label: "Partner country" },
      { key: "value_usd", label: "Value (USD)", type: "number" },
      { key: "share_pct", label: "Share %", type: "number" },
      { key: "year", label: "Year", type: "number" },
    ],
    summary: (r) => `${r.direction}: ${r.product ?? r.partner ?? "—"}${r.value_usd ? ` · $${Number(r.value_usd).toLocaleString()}` : ""}`,
    defaults: { direction: "export" },
  },
  {
    id: "opportunities", label: "Opportunities", table: "country_opportunities", order: "created_at",
    fields: [
      { key: "title", label: "Title", required: true, wide: true },
      { key: "sector", label: "Sector" },
      { key: "stage", label: "Stage" },
      { key: "ticket_min_usd", label: "Ticket min (USD)", type: "number" },
      { key: "ticket_max_usd", label: "Ticket max (USD)", type: "number" },
      { key: "nc_link", label: "North Carolina link" },
      { key: "min_tier", label: "Visible to", type: "select", options: TIER },
      { key: "status", label: "Status", type: "select", options: ["active", "closed", "draft"] },
      { key: "description", label: "Description", type: "textarea", wide: true },
    ],
    summary: (r) => `${r.title} · ${r.min_tier} · ${r.status}`,
    defaults: { min_tier: "member", status: "active", stage: "pipeline" },
  },
  {
    id: "risks", label: "Risk & Mitigation", table: "country_risks", order: "sort_order",
    fields: [
      { key: "title", label: "Title", required: true, wide: true },
      { key: "category", label: "Category", type: "select", options: ["political", "macro", "regulatory", "security", "climate", "fx"], required: true },
      { key: "level", label: "Level", type: "select", options: ["low", "medium", "high"] },
      { key: "min_tier", label: "Visible to", type: "select", options: TIER },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "mitigation", label: "Mitigation", type: "textarea", wide: true },
    ],
    summary: (r) => `${r.title} · ${r.level} · ${r.min_tier}`,
    defaults: { category: "macro", level: "medium", min_tier: "member" },
  },
  {
    id: "reports", label: "Reports", table: "country_reports", order: "published_at", nullableCountry: true,
    fields: [
      { key: "title", label: "Title", required: true, wide: true },
      { key: "report_type", label: "Type", type: "select", options: ["country-brief", "sector", "market-outlook", "risk", "ai-generated"] },
      { key: "min_tier", label: "Visible to", type: "select", options: TIER },
      { key: "status", label: "Status", type: "select", options: ["published", "draft"] },
      { key: "file_url", label: "File URL (https://…)", wide: true },
      { key: "summary", label: "Summary", type: "textarea", wide: true },
    ],
    summary: (r) => `${r.title} · ${r.report_type} · ${r.status}`,
    defaults: { report_type: "country-brief", min_tier: "member", status: "published" },
  },
];

const PROFILE_FIELDS: Field[] = [
  { key: "capital", label: "Capital" },
  { key: "flag", label: "Flag emoji" },
  { key: "gdp_usd", label: "GDP (USD)", type: "number" },
  { key: "gdp_growth_pct", label: "GDP growth %", type: "number" },
  { key: "population", label: "Population", type: "number" },
  { key: "fdi_inflows_usd", label: "FDI inflows (USD)", type: "number" },
  { key: "data_year", label: "Data year", type: "number" },
  { key: "data_source", label: "Data source" },
  { key: "data_as_of", label: "Data as of", type: "date" },
  { key: "overview", label: "Overview", type: "textarea", wide: true },
  { key: "political_context", label: "Political context", type: "textarea", wide: true },
  { key: "business_climate", label: "Business climate", type: "textarea", wide: true },
  { key: "nc_corridor_summary", label: "North Carolina corridor summary", type: "textarea", wide: true },
  { key: "afdec_notes", label: "AfDEC assessment", type: "textarea", wide: true },
];

const inputCls = "w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none";

function FieldInput({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  const id = `f-${f.key}`;
  const common = { id, required: f.required, value: value ?? "", className: inputCls };
  return (
    <div className={f.wide || f.type === "textarea" ? "md:col-span-2" : ""}>
      <label htmlFor={id} className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-1">{f.label}</label>
      {f.type === "textarea" ? (
        <textarea rows={3} {...common} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === "select" ? (
        <select {...common} onChange={(e) => onChange(e.target.value)}>
          {f.options!.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input {...common} type={f.type ?? "text"} step={f.type === "number" ? "any" : undefined} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function clean(fields: Field[], row: Row): Row {
  const out: Row = {};
  fields.forEach((f) => {
    const v = row[f.key];
    out[f.key] = v === "" || v === undefined ? null : f.type === "number" ? Number(v) : v;
  });
  return out;
}

export default function IntelligenceAdminPage() {
  const [countries, setCountries] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("profile");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadCountries = useCallback(async () => {
    const { data, error: err } = await supabase.from("country_profiles").select("*").order("country_name");
    if (err) setError(err.message);
    setCountries(data ?? []);
  }, []);
  useEffect(() => { loadCountries(); }, [loadCountries]);

  const selected = countries.find((c) => c.country_code === code) ?? null;
  const visible = useMemo(() => countries.filter((c) => c.country_name?.toLowerCase().includes(q.toLowerCase()) || c.country_code?.toLowerCase().includes(q.toLowerCase())), [countries, q]);

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-3"><Compass className="w-7 h-7 text-blue-600" /> Country Intelligence</h1>
        <p className="text-zinc-600 font-medium mt-1">Maintain the data behind the Africa Intelligence Terminal and each country brief. Rows marked “registered” or “member” are enforced by the database, not the page.</p>
      </div>
      {error && <p role="alert" className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">{error}</p>}
      {notice && <p role="status" className="mb-4 p-3 border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm rounded-sm">{notice}</p>}

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <aside className="bg-white border border-zinc-200 rounded-md overflow-hidden">
          <div className="p-3 border-b border-zinc-200 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-6 top-1/2 -translate-y-1/2" />
            <input aria-label="Search countries" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search countries…" className={`${inputCls} pl-9`} />
          </div>
          <ul className="max-h-[70vh] overflow-y-auto divide-y divide-zinc-100">
            {visible.map((c) => (
              <li key={c.country_code}>
                <button onClick={() => { setCode(c.country_code); setTab("profile"); setNotice(null); }} className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between gap-2 hover:bg-zinc-50 ${code === c.country_code ? "bg-blue-50 font-bold" : ""}`}>
                  <span className="text-zinc-900">{c.flag ? `${c.flag} ` : ""}{c.country_name}</span>
                  <span className="flex items-center gap-2 text-xs text-zinc-600">{c.afdec_priority && <Star className="w-3 h-3 text-amber-500 fill-amber-500" aria-label="Priority market" />}{c.country_code}</span>
                </button>
              </li>
            ))}
            {visible.length === 0 && <li className="p-6 text-sm text-zinc-600 text-center">No countries found.</li>}
          </ul>
        </aside>

        <section className="bg-white border border-zinc-200 rounded-md min-h-[400px]">
          {!selected ? (
            <p className="p-12 text-center text-zinc-600">Select a country to edit its profile and intelligence data.</p>
          ) : (
            <>
              <div className="px-6 pt-5 border-b border-zinc-200">
                <h2 className="text-xl font-black text-zinc-900 mb-3">{selected.country_name} <span className="text-zinc-500 text-sm font-bold">{selected.country_code}</span></h2>
                <div role="tablist" className="flex gap-1 overflow-x-auto">
                  {[{ id: "profile", label: "Profile" }, ...CHILD_TABLES].map((t) => (
                    <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                      className={`shrink-0 px-4 py-2.5 text-xs font-black uppercase tracking-widest border-b-2 -mb-px ${tab === t.id ? "border-blue-600 text-blue-700" : "border-transparent text-zinc-600 hover:text-zinc-900"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-6">
                {tab === "profile" ? (
                  <ProfileEditor key={selected.country_code} country={selected} onError={setError} onSaved={() => { setNotice("Profile saved."); loadCountries(); }} />
                ) : (
                  <ChildEditor key={`${selected.country_code}-${tab}`} spec={CHILD_TABLES.find((t) => t.id === tab)!} code={selected.country_code} onError={setError} />
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ProfileEditor({ country, onError, onSaved }: { country: Row; onError: (m: string | null) => void; onSaved: () => void }) {
  const [form, setForm] = useState<Row>(country);
  const [priority, setPriority] = useState<boolean>(!!country.afdec_priority);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("country_profiles").update({ ...clean(PROFILE_FIELDS, form), afdec_priority: priority }).eq("country_code", country.country_code);
    setBusy(false);
    if (error) return onError(error.message);
    onError(null);
    onSaved();
  }

  return (
    <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
      {PROFILE_FIELDS.map((f) => <FieldInput key={f.key} f={f} value={form[f.key]} onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))} />)}
      <label className="md:col-span-2 flex items-center gap-3 text-sm font-semibold text-zinc-800">
        <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} className="h-4 w-4" /> AfDEC priority market
      </label>
      <div className="md:col-span-2 pt-2">
        <button disabled={busy} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm"><Save className="w-4 h-4" />{busy ? "Saving…" : "Save profile"}</button>
      </div>
    </form>
  );
}

function ChildEditor({ spec, code, onError }: { spec: (typeof CHILD_TABLES)[number]; code: string; onError: (m: string | null) => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(spec.table).select("*");
    query = spec.nullableCountry ? query.or(`country_code.eq.${code},country_code.is.null`) : query.eq("country_code", code);
    const { data, error } = await query.order(spec.order, { ascending: false });
    if (error) onError(error.message);
    setRows(data ?? []);
    setLoading(false);
  }, [spec, code, onError]);
  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const payload = { ...clean(spec.fields, editing) };
    const { error } = editing.id
      ? await supabase.from(spec.table).update(payload).eq("id", editing.id)
      : await supabase.from(spec.table).insert({ ...payload, country_code: code });
    if (error) return onError(error.message);
    onError(null);
    setEditing(null);
    load();
  }

  async function remove(r: Row) {
    if (!window.confirm("Delete this row?")) return;
    const { error } = await supabase.from(spec.table).delete().eq("id", r.id);
    if (error) onError(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-600">{rows.length} {rows.length === 1 ? "row" : "rows"}{spec.nullableCountry ? " (includes multi-country reports)" : ""}</p>
        <button onClick={() => setEditing({ ...(spec.defaults ?? {}) })} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-sm"><Plus className="w-4 h-4" /> Add</button>
      </div>

      {editing && (
        <form onSubmit={save} className="grid md:grid-cols-2 gap-4 p-5 mb-6 border border-blue-200 bg-blue-50/40 rounded-md">
          {spec.fields.map((f) => <FieldInput key={f.key} f={f} value={editing[f.key]} onChange={(v) => setEditing((p) => ({ ...p!, [f.key]: v }))} />)}
          <div className="md:col-span-2 flex gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-sm"><Save className="w-4 h-4" /> Save</button>
            <button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-zinc-800 text-sm font-bold rounded-sm"><X className="w-4 h-4" /> Cancel</button>
          </div>
        </form>
      )}

      {loading ? <p className="text-sm text-zinc-600">Loading…</p> : rows.length === 0 ? (
        <p className="text-sm text-zinc-600 border border-dashed border-zinc-300 rounded-md p-8 text-center">Nothing here yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-100 border border-zinc-200 rounded-md">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="text-zinc-900 font-medium">{spec.summary(r)}</span>
              <span className="flex gap-1 shrink-0">
                <button aria-label="Edit row" onClick={() => setEditing(r)} className="p-2 text-zinc-500 hover:text-blue-700"><Edit3 className="w-4 h-4" /></button>
                <button aria-label="Delete row" onClick={() => remove(r)} className="p-2 text-zinc-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
