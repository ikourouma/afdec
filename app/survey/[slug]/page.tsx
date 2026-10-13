"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/ui/site-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Row = Record<string, any>;
type Answer = string | number | string[];

const field = "w-full bg-zinc-950 border border-zinc-600 rounded-sm px-4 py-3 text-white placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none";

export default function SurveyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const [survey, setSurvey] = useState<Row | null>(null);
  const [questions, setQuestions] = useState<Row[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "unavailable" | "done">("loading");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      // RLS only returns surveys that are open and visible to this visitor's access level.
      const { data: sv } = await supabase.from("surveys").select("*").eq("slug", slug).maybeSingle();
      if (!sv || sv.status !== "open") return setState("unavailable");
      const { data: qs } = await supabase.from("survey_questions").select("*").eq("survey_id", sv.id).order("position");
      setSurvey(sv);
      setQuestions(qs ?? []);
      setState("ready");
    })();
  }, [slug, authLoading]);

  const set = (id: string, v: Answer) => setAnswers((a) => ({ ...a, [id]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const missing = questions.find((q) => q.required && (answers[q.id] === undefined || answers[q.id] === "" || (Array.isArray(answers[q.id]) && (answers[q.id] as string[]).length === 0)));
    if (missing) return setError(`Please answer: “${missing.prompt}”`);
    setBusy(true);
    const { error: err } = await supabase.from("survey_responses").insert({
      survey_id: survey!.id,
      user_id: user?.id ?? null,
      answers,
      meta: { ua: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 120) : null },
    });
    setBusy(false);
    if (err) return setError(err.code === "23505" ? "You have already responded to this survey. Thank you!" : "We could not save your response. Please try again.");
    setState("done");
  }

  return (
    <SiteShell>
      <div className="max-w-2xl mx-auto px-6 py-14">
        {state === "loading" && <p className="text-zinc-300">Loading survey…</p>}

        {state === "unavailable" && (
          <div className="text-center border border-zinc-700 rounded-xl p-10">
            <h1 className="text-2xl font-black text-white mb-3">This survey isn&apos;t available</h1>
            <p className="text-zinc-300 mb-6">It may be closed, not yet open, or reserved for signed-in members.</p>
            <div className="flex justify-center gap-3">
              <Link href={`/auth?redirect=/survey/${slug}`} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-sm">Sign in</Link>
              <Link href="/" className="px-6 py-3 border border-zinc-600 text-white text-xs font-bold uppercase tracking-widest rounded-sm">Home</Link>
            </div>
          </div>
        )}

        {state === "done" && survey && (
          <div role="status" className="text-center border border-emerald-800/60 bg-emerald-950/30 rounded-xl p-10">
            <CheckCircle2 className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
            <h1 className="text-2xl font-black text-white mb-3">Response received</h1>
            <p className="text-zinc-200 mb-6">{survey.thank_you_message}</p>
            <Link href="/diaspora-registry" className="text-sm font-bold text-blue-300 underline">Join the Diaspora Registry to hear about future surveys</Link>
          </div>
        )}

        {state === "ready" && survey && (
          <form onSubmit={submit} className="space-y-8">
            <header>
              <h1 className="text-3xl font-black text-white tracking-tight mb-3">{survey.title}</h1>
              {survey.description && <p className="text-zinc-200 leading-relaxed">{survey.description}</p>}
            </header>

            {questions.map((q, i) => {
              const id = `q-${q.id}`;
              const value = answers[q.id];
              const opts: string[] = q.options ?? [];
              return (
                <fieldset key={q.id} className="space-y-3">
                  <legend className="text-white font-bold">{i + 1}. {q.prompt}{q.required && <span className="text-red-300" aria-label="required"> *</span>}</legend>
                  {q.help_text && <p className="text-sm text-zinc-300">{q.help_text}</p>}

                  {q.type === "single" && opts.map((o) => (
                    <label key={o} className="flex items-center gap-3 text-zinc-100"><input type="radio" name={id} checked={value === o} onChange={() => set(q.id, o)} className="h-4 w-4" /> {o}</label>
                  ))}
                  {q.type === "multi" && opts.map((o) => {
                    const cur = (value as string[] | undefined) ?? [];
                    return (
                      <label key={o} className="flex items-center gap-3 text-zinc-100">
                        <input type="checkbox" checked={cur.includes(o)} onChange={() => set(q.id, cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o])} className="h-4 w-4" /> {o}
                      </label>
                    );
                  })}
                  {q.type === "dropdown" && (
                    <select aria-label={q.prompt} className={field} value={(value as string) ?? ""} onChange={(e) => set(q.id, e.target.value)}>
                      <option value="">Select…</option>{opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  )}
                  {q.type === "text" && <input aria-label={q.prompt} className={field} value={(value as string) ?? ""} onChange={(e) => set(q.id, e.target.value)} />}
                  {q.type === "long_text" && <textarea aria-label={q.prompt} rows={4} className={field} value={(value as string) ?? ""} onChange={(e) => set(q.id, e.target.value)} />}
                  {q.type === "number" && <input aria-label={q.prompt} type="number" className={field} value={(value as string) ?? ""} onChange={(e) => set(q.id, e.target.value)} />}
                  {q.type === "date" && <input aria-label={q.prompt} type="date" className={field} value={(value as string) ?? ""} onChange={(e) => set(q.id, e.target.value)} />}
                  {q.type === "yes_no" && (
                    <div className="flex gap-3">
                      {["Yes", "No"].map((o) => (
                        <button key={o} type="button" aria-pressed={value === o} onClick={() => set(q.id, o)} className={`px-6 py-2 rounded-sm border text-sm font-bold ${value === o ? "bg-blue-600 border-blue-500 text-white" : "border-zinc-600 text-zinc-100"}`}>{o}</button>
                      ))}
                    </div>
                  )}
                  {(q.type === "rating" || q.type === "nps") && (
                    <div className="flex flex-wrap gap-2" role="group" aria-label={q.prompt}>
                      {Array.from({ length: q.type === "rating" ? 5 : 11 }, (_, k) => (q.type === "rating" ? k + 1 : k)).map((n) => (
                        <button key={n} type="button" aria-pressed={value === n} onClick={() => set(q.id, n)} className={`w-11 h-11 rounded-sm border text-sm font-bold ${value === n ? "bg-blue-600 border-blue-500 text-white" : "border-zinc-600 text-zinc-100 hover:border-zinc-300"}`}>{n}</button>
                      ))}
                    </div>
                  )}
                </fieldset>
              );
            })}

            {error && <p role="alert" className="text-sm font-semibold text-red-300">{error}</p>}
            <button disabled={busy} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-sm">{busy ? "Submitting…" : "Submit"}</button>
          </form>
        )}
      </div>
    </SiteShell>
  );
}
