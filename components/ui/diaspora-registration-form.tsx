"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { CheckCircle2 } from "lucide-react";

export const CONSENT_VERSION = "2026-10-v1";

const GENERATIONS = ["First generation (born in Africa)", "Second generation", "Third generation or later", "Friend of the diaspora"];
const INTERESTS = ["Trade & export", "Investment", "Business support", "Events & networking", "Policy & advocacy", "Education & mentorship", "Health", "Culture & heritage"];
const EDUCATION = ["High School", "Associate's", "Bachelor's", "Master's", "Doctorate"];

const input = "w-full bg-zinc-950 border border-zinc-600 rounded-sm px-4 py-3 text-white placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none";
const label = "block text-xs font-bold text-zinc-200 uppercase tracking-widest mb-2";

export function DiasporaRegistrationForm() {
  const { user, profile } = useAuth();
  const [f, setF] = useState({
    full_name: "", email: "", phone: "", country_of_origin: "", generation: "", profession: "", sector: "", organization: "",
    education_level: "", residence_city: "", residence_county: "", residence_state: "North Carolina", residence_country: "United States",
    family_size: 1, family_registry_details: "", contact_preference: "email", open_to_survey: true,
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from the signed-in profile
  useEffect(() => {
    if (!profile) return;
    setF((p) => ({
      ...p,
      email: p.email || profile.email || "",
      full_name: p.full_name || `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim(),
      organization: p.organization || profile.organization || "",
    }));
  }, [profile]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) { setError("Please confirm your consent to join the registry."); return; }
    setBusy(true);
    const { error: err } = await supabase.from("diaspora_registry").insert({
      user_id: user?.id ?? null,
      ...f,
      email: f.email.trim().toLowerCase(),
      family_size: Number(f.family_size) || 1,
      interests,
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    });
    setBusy(false);
    if (err) {
      setError(err.code === "23505" ? "This email is already in the registry. Thank you — no further action is needed." : "We could not save your registration. Please try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="bg-emerald-950/30 border border-emerald-800/60 p-8 rounded-xl text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
        <h3 className="text-xl font-black text-white mb-2">Welcome to the AfDEC Diaspora Registry</h3>
        <p className="text-zinc-200 text-sm">Thank you. We will use your details only for the purposes you agreed to. You can ask us to update or remove them at any time.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-zinc-900/60 border border-zinc-700 rounded-xl p-6 md:p-8 space-y-8">
      <fieldset className="space-y-5">
        <legend className="text-sm font-black text-white uppercase tracking-widest mb-4">About you</legend>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label htmlFor="dr-name" className={label}>Full name *</label><input id="dr-name" required value={f.full_name} onChange={set("full_name")} className={input} autoComplete="name" /></div>
          <div><label htmlFor="dr-email" className={label}>Email *</label><input id="dr-email" required type="email" value={f.email} onChange={set("email")} className={input} autoComplete="email" /></div>
          <div><label htmlFor="dr-phone" className={label}>Phone</label><input id="dr-phone" type="tel" value={f.phone} onChange={set("phone")} className={input} autoComplete="tel" /></div>
          <div><label htmlFor="dr-origin" className={label}>Country of origin / heritage *</label><input id="dr-origin" required value={f.country_of_origin} onChange={set("country_of_origin")} className={input} placeholder="e.g. Ghana, Nigeria, Kenya" /></div>
          <div className="md:col-span-2">
            <label htmlFor="dr-gen" className={label}>Connection to Africa</label>
            <select id="dr-gen" value={f.generation} onChange={set("generation")} className={input}>
              <option value="">Select…</option>
              {GENERATIONS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-sm font-black text-white uppercase tracking-widest mb-4">Where you live</legend>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div><label htmlFor="dr-city" className={label}>City *</label><input id="dr-city" required value={f.residence_city} onChange={set("residence_city")} className={input} /></div>
          <div><label htmlFor="dr-county" className={label}>County</label><input id="dr-county" value={f.residence_county} onChange={set("residence_county")} className={input} /></div>
          <div><label htmlFor="dr-state" className={label}>State *</label><input id="dr-state" required value={f.residence_state} onChange={set("residence_state")} className={input} /></div>
          <div><label htmlFor="dr-country" className={label}>Country *</label><input id="dr-country" required value={f.residence_country} onChange={set("residence_country")} className={input} /></div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-sm font-black text-white uppercase tracking-widest mb-4">Work & education</legend>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label htmlFor="dr-prof" className={label}>Profession *</label><input id="dr-prof" required value={f.profession} onChange={set("profession")} className={input} /></div>
          <div><label htmlFor="dr-sector" className={label}>Sector</label><input id="dr-sector" value={f.sector} onChange={set("sector")} className={input} placeholder="e.g. Technology, Healthcare" /></div>
          <div><label htmlFor="dr-org" className={label}>Organization</label><input id="dr-org" value={f.organization} onChange={set("organization")} className={input} /></div>
          <div>
            <label htmlFor="dr-edu" className={label}>Education level *</label>
            <select id="dr-edu" required value={f.education_level} onChange={set("education_level")} className={input}>
              <option value="">Select…</option>
              {EDUCATION.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-sm font-black text-white uppercase tracking-widest mb-4">Household</legend>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label htmlFor="dr-fam" className={label}>Household size *</label><input id="dr-fam" required type="number" min={1} value={f.family_size} onChange={set("family_size")} className={input} /></div>
          <div><label htmlFor="dr-famd" className={label}>Notes (optional)</label><input id="dr-famd" value={f.family_registry_details} onChange={set("family_registry_details")} className={input} /></div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-black text-white uppercase tracking-widest mb-4">How can AfDEC serve you?</legend>
        <div className="flex flex-wrap gap-3">
          {INTERESTS.map((i) => {
            const on = interests.includes(i);
            return (
              <button key={i} type="button" aria-pressed={on}
                onClick={() => setInterests((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${on ? "bg-blue-600 border-blue-500 text-white" : "border-zinc-600 text-zinc-200 hover:border-zinc-300"}`}>
                {i}
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="dr-contact" className={label}>Preferred contact</label>
            <select id="dr-contact" value={f.contact_preference} onChange={set("contact_preference")} className={input}>
              <option value="email">Email</option><option value="phone">Phone</option><option value="none">Do not contact me</option>
            </select>
          </div>
          <label className="flex items-start gap-3 text-sm text-zinc-200 mt-6 md:mt-8">
            <input type="checkbox" checked={f.open_to_survey} onChange={(e) => setF((p) => ({ ...p, open_to_survey: e.target.checked }))} className="mt-1 h-4 w-4" />
            I am happy to be invited to AfDEC community surveys.
          </label>
        </div>
      </fieldset>

      <div className="border-t border-zinc-700 pt-6 space-y-4">
        <label className="flex items-start gap-3 text-sm text-zinc-100">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4" />
          <span>
            I consent to AfDEC storing the information above in its Diaspora Registry to produce community reporting, run surveys and design services. Only AfDEC staff can see individual records; published statistics are aggregated. See the{" "}
            <a href="/compliance/privacy-policy" className="underline text-blue-300 hover:text-blue-200">Privacy Policy</a>.
          </span>
        </label>
        {error && <p role="alert" className="text-sm font-semibold text-red-300">{error}</p>}
        <button type="submit" disabled={busy} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition-colors">
          {busy ? "Submitting…" : "Join the Diaspora Registry"}
        </button>
      </div>
    </form>
  );
}
