"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Users, Search, MapPin, Briefcase, GraduationCap, Trash2, Download, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface Reg {
  id: string;
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country_of_origin: string | null;
  residence_city: string | null;
  residence_state: string | null;
  residence_country: string | null;
  residence_county: string | null;
  profession: string | null;
  sector: string | null;
  education_level: string | null;
  family_size: number | null;
  family_registry_details: string | null;
  generation: string | null;
  languages: string[] | null;
  interests: string[] | null;
  open_to_survey: boolean | null;
  consent_at: string | null;
  created_at: string;
}

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function DiasporaAdminPage() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState<Reg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [origin, setOrigin] = useState("all");
  const [surveyOnly, setSurveyOnly] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error: err } = await supabase.from("diaspora_registry").select("*").order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
      setIsLoading(false);
      return;
    }
    const regs = (data as Reg[]) ?? [];
    // Legacy rows were linked to a profile instead of carrying their own name/email.
    const ids = regs.filter((r) => r.user_id && !r.email).map((r) => r.user_id as string);
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, first_name, last_name, email").in("id", ids);
      const byId = new Map((profs ?? []).map((p) => [p.id, p]));
      regs.forEach((r) => {
        const p = r.user_id ? byId.get(r.user_id) : null;
        if (p) {
          r.email = r.email || p.email;
          r.full_name = r.full_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || null;
        }
      });
    }
    setError(null);
    setRows(regs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this registry entry?")) {
      await supabase.from("diaspora_registry").delete().eq("id", id);
      fetchData();
    }
  };

  const origins = useMemo(() => Array.from(new Set(rows.map((r) => r.country_of_origin).filter(Boolean) as string[])).sort(), [rows]);
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (origin === "all" || r.country_of_origin === origin) &&
        (!surveyOnly || r.open_to_survey) &&
        (!n || `${r.full_name} ${r.email} ${r.profession} ${r.residence_city} ${r.residence_state}`.toLowerCase().includes(n))
    );
  }, [rows, q, origin, surveyOnly]);

  const topOrigins = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => r.country_of_origin && m.set(r.country_of_origin, (m.get(r.country_of_origin) || 0) + 1));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [rows]);

  function exportCsv() {
    const head = ["Name", "Email", "Phone", "Country of origin", "Residence country", "State", "City", "County", "Profession", "Sector", "Education", "Family size", "Generation", "Languages", "Interests", "Open to survey", "Registered"];
    const lines = filtered.map((r) =>
      [r.full_name, r.email, r.phone, r.country_of_origin, r.residence_country, r.residence_state, r.residence_city, r.residence_county, r.profession, r.sector, r.education_level, r.family_size, r.generation, (r.languages || []).join("; "), (r.interests || []).join("; "), r.open_to_survey ? "yes" : "no", r.created_at].map(csvCell).join(",")
    );
    const blob = new Blob([[head.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `afdec-diaspora-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Diaspora Registry</h1>
          <p className="text-zinc-600 font-medium mt-1">The living record of the African diaspora AfDEC serves. Powers reporting, surveys and programme design.</p>
        </div>
        <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm">
          <Download className="w-4 h-4" /> Export CSV ({filtered.length})
        </button>
      </div>

      {error && <p role="alert" className="mb-6 p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">Could not load registry: {error}</p>}

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-zinc-200 rounded-md p-4"><p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Registrants</p><p className="text-3xl font-black text-zinc-900">{rows.length}</p></div>
        <div className="bg-white border border-zinc-200 rounded-md p-4"><p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Open to surveys</p><p className="text-3xl font-black text-zinc-900">{rows.filter((r) => r.open_to_survey).length}</p></div>
        <div className="bg-white border border-zinc-200 rounded-md p-4"><p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Top origins</p><p className="text-sm text-zinc-800 mt-1">{topOrigins.length ? topOrigins.map(([c, n]) => `${c} (${n})`).join(" · ") : "—"}</p></div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input aria-label="Search registry" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, profession, city…" className="pl-9 pr-3 py-2 w-72 border border-zinc-300 rounded-sm text-sm text-zinc-900" />
          </div>
          <select aria-label="Country of origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="border border-zinc-300 rounded-sm text-sm py-2 px-3 text-zinc-900">
            <option value="all">All origins</option>
            {origins.map((o) => <option key={o}>{o}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-zinc-800"><input type="checkbox" checked={surveyOnly} onChange={(e) => setSurveyOnly(e.target.checked)} /> Open to surveys only</label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Professional Profile</th>
                <th className="px-6 py-4">Family / Details</th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-600 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing database…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-600 font-bold">No registrants match.</td></tr>
              ) : filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900 mb-1">{reg.full_name || "Name not provided"}</p>
                    <p className="text-xs text-zinc-600 mb-2 flex items-center gap-1"><Mail className="w-3 h-3" />{reg.email || "N/A"}</p>
                    <span className="inline-block px-2.5 py-1 text-xs uppercase font-bold tracking-wider rounded bg-blue-100 text-blue-800">Origin: {reg.country_of_origin || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-800 font-medium">
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-zinc-500" />{[reg.residence_city, reg.residence_state].filter(Boolean).join(", ") || "—"}</div>
                    <div className="text-zinc-600 ml-5">{reg.residence_country} {reg.residence_county && `(${reg.residence_county} County)`}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-800 font-medium space-y-2">
                    <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-zinc-500" />{reg.profession || "—"}{reg.sector && ` — ${reg.sector}`}</div>
                    <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-zinc-500" />{reg.education_level || "—"}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="font-bold text-zinc-800">Family size: {reg.family_size ?? "—"}</span>
                    {reg.family_registry_details && <p className="text-zinc-600 italic max-w-xs truncate">{reg.family_registry_details}</p>}
                    <p className="text-zinc-600 mt-1">{reg.open_to_survey ? "Open to surveys" : "No surveys"}</p>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <button aria-label={`Delete ${reg.full_name || "entry"}`} onClick={() => handleDelete(reg.id)} className="p-2 text-zinc-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
