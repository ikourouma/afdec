"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { ImageField } from "@/components/admin/asset-picker";

interface Row {
  id?: string;
  page_slug: string;
  page_title: string;
  meta_description: string;
  hero_image_url: string;
  is_published: boolean;
}

const PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About AfDEC" },
  { path: "/about/leadership", label: "Leadership" },
  { path: "/about/strategic-framework", label: "Strategic Framework" },
  { path: "/why-africa", label: "Why Africa" },
  { path: "/why-nc", label: "Why North Carolina" },
  { path: "/corridor", label: "Trade Corridor" },
  { path: "/sectors", label: "Sectors" },
  { path: "/invest", label: "Invest" },
  { path: "/diaspora-impact-fund", label: "Diaspora Impact Fund" },
  { path: "/diaspora-registry", label: "Diaspora Registry" },
  { path: "/africa-intelligence", label: "Africa Intelligence" },
  { path: "/events", label: "Events" },
  { path: "/news", label: "News" },
  { path: "/media", label: "Media & Press" },
  { path: "/insights", label: "Insights" },
  { path: "/careers", label: "Careers" },
  { path: "/contact", label: "Contact" },
  { path: "/faqs", label: "FAQs" },
];

const empty = (path: string): Row => ({ page_slug: path, page_title: "", meta_description: "", hero_image_url: "", is_published: true });

export default function PagesSeoAdmin() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [selected, setSelected] = useState(PAGES[0].path);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function load() {
    const { data } = await supabase.from("page_content").select("id, page_slug, page_title, meta_description, hero_image_url, is_published");
    const m: Record<string, Row> = {};
    (data ?? []).forEach((r) => (m[r.page_slug] = { ...r, page_title: r.page_title || "", meta_description: r.meta_description || "", hero_image_url: r.hero_image_url || "" }));
    setRows(m);
  }
  useEffect(() => {
    void load();
  }, []);

  const row = rows[selected] ?? empty(selected);
  const set = (patch: Partial<Row>) => setRows({ ...rows, [selected]: { ...row, ...patch } });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { page_slug: selected, page_title: row.page_title, meta_description: row.meta_description || null, hero_image_url: row.hero_image_url || null, is_published: row.is_published, updated_by: user?.id, updated_at: new Date().toISOString() };
    const { error } = await supabase.from("page_content").upsert(payload, { onConflict: "page_slug" });
    if (!error) {
      setMsg({ kind: "ok", text: "Saved. Live within 5 minutes (cache)." });
      void load();
    }
  }

  const input = "w-full bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1";

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Pages &amp; SEO</h1>
      <p className="text-zinc-600 font-medium mt-1 mb-8">Override the browser title, search description and social-share image for any public page. Leave a field empty to keep the built-in default.</p>
      {msg && <p role="status" className={`mb-6 p-3 text-sm border rounded-sm ${msg.kind === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>{msg.text}</p>}
      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <ul className="bg-white border border-zinc-200 rounded-md divide-y divide-zinc-100 h-fit">
          {PAGES.map((p) => (
            <li key={p.path}>
              <button onClick={() => { setSelected(p.path); setMsg(null); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${selected === p.path ? "bg-blue-50 font-bold text-blue-800" : "text-zinc-800 hover:bg-zinc-50"}`}>
                {p.label}
                {rows[p.path]?.is_published && rows[p.path]?.page_title && <span className="text-xs text-emerald-700 font-bold">custom</span>}
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={save} className="bg-white border border-zinc-200 rounded-md p-6 space-y-5">
          <p className="text-sm text-zinc-600">Path: <code className="text-zinc-900">{selected}</code></p>
          <div>
            <label htmlFor="seo-title" className={lbl}>Page title (≤ 60 characters)</label>
            <input id="seo-title" maxLength={90} value={row.page_title} onChange={(e) => set({ page_title: e.target.value })} className={input} />
            <p className="text-xs text-zinc-600 mt-1">{row.page_title.length}/60 recommended · “| AfDEC” is appended automatically.</p>
          </div>
          <div>
            <label htmlFor="seo-desc" className={lbl}>Meta description (≤ 160 characters)</label>
            <textarea id="seo-desc" rows={3} maxLength={300} value={row.meta_description} onChange={(e) => set({ meta_description: e.target.value })} className={input} />
            <p className="text-xs text-zinc-600 mt-1">{row.meta_description.length}/160 recommended</p>
          </div>
          <ImageField label="Social share image (1200×630)" folder="general" value={row.hero_image_url} onChange={(url) => set({ hero_image_url: url })} />
          <label className="flex items-center gap-2 text-sm text-zinc-800"><input type="checkbox" checked={row.is_published} onChange={(e) => set({ is_published: e.target.checked })} /> Use these overrides</label>
          <button disabled={!row.page_title} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm"><Save className="w-4 h-4" /> Save</button>
        </form>
      </div>
    </div>
  );
}
