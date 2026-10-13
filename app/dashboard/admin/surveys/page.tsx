"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Plus, Trash2, Save, ArrowUp, ArrowDown, ArrowLeft, Download, ExternalLink, BarChart3, Edit3 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Row = Record<string, any>;

const QUESTION_TYPES = [
  { id: "single", label: "Single choice", choice: true },
  { id: "multi", label: "Multiple choice", choice: true },
  { id: "dropdown", label: "Dropdown", choice: true },
  { id: "text", label: "Short text" },
  { id: "long_text", label: "Long text" },
  { id: "rating", label: "Rating (1–5)" },
  { id: "nps", label: "Net Promoter (0–10)" },
  { id: "yes_no", label: "Yes / No" },
  { id: "number", label: "Number" },
  { id: "date", label: "Date" },
];
const isChoice = (t: string) => ["single", "multi", "dropdown"].includes(t);

const inputCls = "w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none";
const labelCls = "block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-1";
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

type View = { mode: "list" } | { mode: "edit"; id: string | null } | { mode: "results"; id: string };

export default function SurveysAdminPage() {
  const [view, setView] = useState<View>({ mode: "list" });
  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      {view.mode === "list" && <SurveyList onOpen={setView} />}
      {view.mode === "edit" && <SurveyEditor id={view.id} onBack={() => setView({ mode: "list" })} />}
      {view.mode === "results" && <SurveyResults id={view.id} onBack={() => setView({ mode: "list" })} />}
    </div>
  );
}

// ─────────────────────────────────────────────── LIST
function SurveyList({ onOpen }: { onOpen: (v: View) => void }) {
  const [surveys, setSurveys] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("surveys").select("*").order("created_at", { ascending: false });
    if (err) setError(err.message);
    setSurveys(data ?? []);
    const { data: resp } = await supabase.from("survey_responses").select("survey_id");
    const c: Record<string, number> = {};
    (resp ?? []).forEach((r) => { c[r.survey_id] = (c[r.survey_id] ?? 0) + 1; });
    setCounts(c);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function remove(s: Row) {
    if (!window.confirm(`Delete “${s.title}” and all its responses? This cannot be undone.`)) return;
    const { error: err } = await supabase.from("surveys").delete().eq("id", s.id);
    if (err) setError(err.message);
    load();
  }

  const badge: Record<string, string> = { open: "bg-emerald-100 text-emerald-800", draft: "bg-zinc-100 text-zinc-700", closed: "bg-amber-100 text-amber-800" };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-3"><ClipboardList className="w-7 h-7 text-blue-600" /> Surveys</h1>
          <p className="text-zinc-600 font-medium mt-1">Build surveys, share the public link with the Diaspora Registry, and export the results.</p>
        </div>
        <button onClick={() => onOpen({ mode: "edit", id: null })} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-sm"><Plus className="w-4 h-4" /> New survey</button>
      </div>
      {error && <p role="alert" className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">{error}</p>}
      <div className="bg-white border border-zinc-200 rounded-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200">
            <tr><th className="px-5 py-3">Survey</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Audience</th><th className="px-5 py-3">Responses</th><th className="px-5 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {surveys.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-zinc-600">No surveys yet.</td></tr>}
            {surveys.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-50">
                <td className="px-5 py-4"><p className="font-bold text-zinc-900">{s.title}</p><p className="text-xs text-zinc-600">/survey/{s.slug}</p></td>
                <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${badge[s.status]}`}>{s.status}</span></td>
                <td className="px-5 py-4 text-zinc-800 capitalize">{s.audience}</td>
                <td className="px-5 py-4 text-zinc-900 font-bold">{counts[s.id] ?? 0}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <a aria-label={`Open public page for ${s.title}`} href={`/survey/${s.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-blue-700"><ExternalLink className="w-4 h-4" /></a>
                    <button aria-label={`Results for ${s.title}`} onClick={() => onOpen({ mode: "results", id: s.id })} className="p-2 text-zinc-500 hover:text-blue-700"><BarChart3 className="w-4 h-4" /></button>
                    <button aria-label={`Edit ${s.title}`} onClick={() => onOpen({ mode: "edit", id: s.id })} className="p-2 text-zinc-500 hover:text-blue-700"><Edit3 className="w-4 h-4" /></button>
                    <button aria-label={`Delete ${s.title}`} onClick={() => remove(s)} className="p-2 text-zinc-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────── EDITOR
type Q = { id?: string; _key: string; type: string; prompt: string; help_text: string; required: boolean; optionsText: string };
const newQ = (): Q => ({ _key: crypto.randomUUID(), type: "single", prompt: "", help_text: "", required: false, optionsText: "" });

function SurveyEditor({ id, onBack }: { id: string | null; onBack: () => void }) {
  const [s, setS] = useState<Row>({ title: "", slug: "", description: "", status: "draft", audience: "public", thank_you_message: "Thank you. Your response has been recorded." });
  const [qs, setQs] = useState<Q[]>([newQ()]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [sv, qq] = await Promise.all([
        supabase.from("surveys").select("*").eq("id", id).maybeSingle(),
        supabase.from("survey_questions").select("*").eq("survey_id", id).order("position"),
      ]);
      if (sv.data) setS(sv.data);
      setQs((qq.data ?? []).map((q) => ({ id: q.id, _key: q.id, type: q.type, prompt: q.prompt, help_text: q.help_text ?? "", required: q.required, optionsText: (q.options ?? []).join("\n") })));
      setLoading(false);
    })();
  }, [id]);

  const move = (i: number, d: -1 | 1) => setQs((c) => { const n = [...c]; const j = i + d; if (j < 0 || j >= n.length) return c; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const update = (i: number, patch: Partial<Q>) => setQs((c) => c.map((q, k) => (k === i ? { ...q, ...patch } : q)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSaved(false);
    const bad = qs.findIndex((q) => !q.prompt.trim() || (isChoice(q.type) && q.optionsText.split("\n").filter((x) => x.trim()).length < 2));
    if (qs.length === 0) return setError("Add at least one question.");
    if (bad >= 0) return setError(`Question ${bad + 1} needs a prompt${isChoice(qs[bad].type) ? " and at least two options" : ""}.`);
    setBusy(true);
    const payload = {
      title: s.title, slug: s.slug || slugify(s.title), description: s.description || null, status: s.status, audience: s.audience,
      thank_you_message: s.thank_you_message || null, updated_at: new Date().toISOString(),
    };
    const sv = id
      ? await supabase.from("surveys").update(payload).eq("id", id).select("id").single()
      : await supabase.from("surveys").insert(payload).select("id").single();
    if (sv.error) { setBusy(false); return setError(sv.error.code === "23505" ? "That URL slug is already used by another survey." : sv.error.message); }
    const surveyId = sv.data.id;

    if (removed.length) {
      const del = await supabase.from("survey_questions").delete().in("id", removed);
      if (del.error) { setBusy(false); return setError(del.error.message); }
    }
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const row = {
        survey_id: surveyId, position: i + 1, type: q.type, prompt: q.prompt.trim(), help_text: q.help_text || null, required: q.required,
        options: isChoice(q.type) ? q.optionsText.split("\n").map((x) => x.trim()).filter(Boolean) : [],
      };
      const r = q.id ? await supabase.from("survey_questions").update(row).eq("id", q.id) : await supabase.from("survey_questions").insert(row);
      if (r.error) { setBusy(false); return setError(r.error.message); }
    }
    setBusy(false);
    setSaved(true);
    setTimeout(onBack, 700);
  }

  if (loading) return <p className="text-zinc-600">Loading…</p>;

  return (
    <form onSubmit={save} className="space-y-8">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-zinc-900"><ArrowLeft className="w-4 h-4" /> All surveys</button>
      <h1 className="text-2xl font-extrabold text-zinc-900">{id ? "Edit survey" : "New survey"}</h1>
      {error && <p role="alert" className="p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">{error}</p>}
      {saved && <p role="status" className="p-3 border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm rounded-sm">Saved.</p>}

      <section className="bg-white border border-zinc-200 rounded-md p-6 grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><label htmlFor="sv-title" className={labelCls}>Title</label><input id="sv-title" required className={inputCls} value={s.title} onChange={(e) => setS({ ...s, title: e.target.value, slug: id || s.slug_touched ? s.slug : slugify(e.target.value) })} /></div>
        <div><label htmlFor="sv-slug" className={labelCls}>Public URL (/survey/…)</label><input id="sv-slug" required className={inputCls} value={s.slug} onChange={(e) => setS({ ...s, slug: slugify(e.target.value), slug_touched: true })} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label htmlFor="sv-status" className={labelCls}>Status</label><select id="sv-status" className={inputCls} value={s.status} onChange={(e) => setS({ ...s, status: e.target.value })}><option value="draft">Draft</option><option value="open">Open</option><option value="closed">Closed</option></select></div>
          <div><label htmlFor="sv-aud" className={labelCls}>Audience</label><select id="sv-aud" className={inputCls} value={s.audience} onChange={(e) => setS({ ...s, audience: e.target.value })}><option value="public">Anyone with the link</option><option value="registered">Signed-in users</option><option value="members">Members only</option></select></div>
        </div>
        <div className="md:col-span-2"><label htmlFor="sv-desc" className={labelCls}>Introduction</label><textarea id="sv-desc" rows={3} className={inputCls} value={s.description ?? ""} onChange={(e) => setS({ ...s, description: e.target.value })} /></div>
        <div className="md:col-span-2"><label htmlFor="sv-thanks" className={labelCls}>Thank-you message</label><input id="sv-thanks" className={inputCls} value={s.thank_you_message ?? ""} onChange={(e) => setS({ ...s, thank_you_message: e.target.value })} /></div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black text-zinc-900">Questions</h2>
        {qs.map((q, i) => (
          <div key={q._key} className="bg-white border border-zinc-200 rounded-md p-5 grid md:grid-cols-[1fr_220px] gap-4">
            <div className="space-y-3">
              <div><label htmlFor={`q-${i}-p`} className={labelCls}>Question {i + 1}</label><input id={`q-${i}-p`} className={inputCls} value={q.prompt} onChange={(e) => update(i, { prompt: e.target.value })} /></div>
              <div><label htmlFor={`q-${i}-h`} className={labelCls}>Help text (optional)</label><input id={`q-${i}-h`} className={inputCls} value={q.help_text} onChange={(e) => update(i, { help_text: e.target.value })} /></div>
              {isChoice(q.type) && (
                <div><label htmlFor={`q-${i}-o`} className={labelCls}>Options (one per line)</label><textarea id={`q-${i}-o`} rows={4} className={inputCls} value={q.optionsText} onChange={(e) => update(i, { optionsText: e.target.value })} /></div>
              )}
            </div>
            <div className="space-y-3">
              <div><label htmlFor={`q-${i}-t`} className={labelCls}>Type</label><select id={`q-${i}-t`} className={inputCls} value={q.type} onChange={(e) => update(i, { type: e.target.value })}>{QUESTION_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800"><input type="checkbox" checked={q.required} onChange={(e) => update(i, { required: e.target.checked })} className="h-4 w-4" /> Required</label>
              <div className="flex gap-1">
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="p-2 border border-zinc-300 rounded-sm text-zinc-700 disabled:opacity-40"><ArrowUp className="w-4 h-4" /></button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === qs.length - 1} className="p-2 border border-zinc-300 rounded-sm text-zinc-700 disabled:opacity-40"><ArrowDown className="w-4 h-4" /></button>
                <button type="button" aria-label="Remove question" onClick={() => { if (q.id) { if (!window.confirm("Removing this question also removes its answers from results. Continue?")) return; setRemoved((r) => [...r, q.id!]); } setQs((c) => c.filter((_, k) => k !== i)); }} className="p-2 border border-red-300 rounded-sm text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setQs((c) => [...c, newQ()])} className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 hover:border-zinc-500 text-zinc-800 text-sm font-bold rounded-sm"><Plus className="w-4 h-4" /> Add question</button>
      </section>

      <div className="flex items-center gap-4">
        <button disabled={busy} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm"><Save className="w-4 h-4" />{busy ? "Saving…" : "Save survey"}</button>
        {s.status !== "open" && <p className="text-xs text-zinc-600">The survey is only reachable by respondents when its status is “Open”.</p>}
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────── RESULTS
function SurveyResults({ id, onBack }: { id: string; onBack: () => void }) {
  const [survey, setSurvey] = useState<Row | null>(null);
  const [qs, setQs] = useState<Row[]>([]);
  const [resp, setResp] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        supabase.from("surveys").select("*").eq("id", id).maybeSingle(),
        supabase.from("survey_questions").select("*").eq("survey_id", id).order("position"),
        supabase.from("survey_responses").select("*").eq("survey_id", id).order("submitted_at", { ascending: false }),
      ]);
      if (a.error || b.error || c.error) setError((a.error || b.error || c.error)!.message);
      setSurvey(a.data); setQs(b.data ?? []); setResp(c.data ?? []);
    })();
  }, [id]);

  const stats = useMemo(() => qs.map((q) => {
    const vals = resp.map((r) => r.answers?.[q.id]).filter((v) => v !== undefined && v !== null && v !== "");
    const out: Row = { q, n: vals.length };
    if (["single", "dropdown", "yes_no"].includes(q.type)) {
      const m: Record<string, number> = {};
      vals.forEach((v) => { m[String(v)] = (m[String(v)] ?? 0) + 1; });
      out.counts = Object.entries(m).sort((x, y) => y[1] - x[1]);
    } else if (q.type === "multi") {
      const m: Record<string, number> = {};
      vals.flat().forEach((v: any) => { m[String(v)] = (m[String(v)] ?? 0) + 1; });
      out.counts = Object.entries(m).sort((x, y) => y[1] - x[1]);
    } else if (q.type === "rating" || q.type === "number") {
      const nums = vals.map(Number).filter((x) => !isNaN(x));
      out.avg = nums.length ? nums.reduce((p, c) => p + c, 0) / nums.length : null;
    } else if (q.type === "nps") {
      const nums = vals.map(Number).filter((x) => !isNaN(x));
      const pro = nums.filter((x) => x >= 9).length, det = nums.filter((x) => x <= 6).length;
      out.nps = nums.length ? Math.round(((pro - det) / nums.length) * 100) : null;
    } else out.texts = vals.slice(0, 50);
    return out;
  }), [qs, resp]);

  function exportCsv() {
    const header = ["submitted_at", "user_id", ...qs.map((q) => q.prompt)];
    const lines = resp.map((r) => [r.submitted_at, r.user_id ?? "anonymous", ...qs.map((q) => { const v = r.answers?.[q.id]; return Array.isArray(v) ? v.join("; ") : v; })].map(csvCell).join(","));
    const blob = new Blob([[header.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${survey?.slug ?? "survey"}-responses.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!survey) return <p className="text-zinc-600">{error ?? "Loading…"}</p>;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-zinc-900"><ArrowLeft className="w-4 h-4" /> All surveys</button>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-extrabold text-zinc-900">{survey.title}</h1><p className="text-zinc-600">{resp.length} {resp.length === 1 ? "response" : "responses"}</p></div>
        <button onClick={exportCsv} disabled={resp.length === 0} className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 hover:border-zinc-500 text-zinc-800 text-sm font-bold rounded-sm disabled:opacity-40"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      {error && <p role="alert" className="p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">{error}</p>}
      {stats.map(({ q, n, counts, avg, nps, texts }, i) => (
        <section key={q.id} className="bg-white border border-zinc-200 rounded-md p-5">
          <h2 className="font-bold text-zinc-900">{i + 1}. {q.prompt}</h2>
          <p className="text-xs text-zinc-600 mb-3">{n} answered</p>
          {counts && (counts.length === 0 ? <p className="text-sm text-zinc-600">No answers yet.</p> : (
            <ul className="space-y-2">
              {counts.map(([label, c]: [string, number]) => (
                <li key={label} className="text-sm">
                  <div className="flex justify-between text-zinc-800 mb-1"><span>{label}</span><span className="font-bold">{c} ({n ? Math.round((c / n) * 100) : 0}%)</span></div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${n ? (c / n) * 100 : 0}%` }} /></div>
                </li>
              ))}
            </ul>
          ))}
          {avg !== undefined && <p className="text-2xl font-black text-zinc-900">{avg === null ? "—" : avg.toFixed(2)} <span className="text-sm font-semibold text-zinc-600">average</span></p>}
          {nps !== undefined && <p className="text-2xl font-black text-zinc-900">{nps === null ? "—" : nps} <span className="text-sm font-semibold text-zinc-600">NPS</span></p>}
          {texts && (texts.length === 0 ? <p className="text-sm text-zinc-600">No answers yet.</p> : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">{texts.map((t: any, k: number) => <li key={k} className="text-sm text-zinc-800 border-l-2 border-zinc-300 pl-3">{String(t)}</li>)}</ul>
          ))}
        </section>
      ))}
    </div>
  );
}
