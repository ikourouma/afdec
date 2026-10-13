"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Copy, FileText, Trash2, Upload, Search, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { ASSET_FOLDERS, type Asset, deleteAsset, isImage, prettySize, uploadAsset } from "@/lib/assets";

export default function AssetLibraryPage() {
  const { isAdmin } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState("all");
  const [q, setQ] = useState("");
  const [uploadFolder, setUploadFolder] = useState("general");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("assets").select("*").order("created_at", { ascending: false });
    if (error) setMsg({ kind: "err", text: error.message });
    setAssets((data as Asset[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setMsg(null);
    let ok = 0;
    for (const f of files) {
      try {
        await uploadAsset(f, { folder: uploadFolder });
        ok++;
      } catch (err) {
        setMsg({ kind: "err", text: `${f.name}: ${err instanceof Error ? err.message : "failed"}` });
      }
    }
    setBusy(false);
    if (ok) setMsg({ kind: "ok", text: `${ok} file${ok > 1 ? "s" : ""} uploaded.` });
    await load();
  }

  async function saveMeta() {
    if (!selected) return;
    const { error } = await supabase
      .from("assets")
      .update({ title: selected.title, alt_text: selected.alt_text, folder: selected.folder })
      .eq("id", selected.id);
    setMsg(error ? { kind: "err", text: error.message } : { kind: "ok", text: "Details saved." });
    await load();
  }

  async function remove() {
    if (!selected || !confirm(`Delete "${selected.title || selected.file_name}"? Pages using it will show a broken image.`)) return;
    try {
      await deleteAsset(selected);
      setSelected(null);
      setMsg({ kind: "ok", text: "Asset deleted." });
      await load();
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Delete failed" });
    }
  }

  const visible = assets.filter(
    (a) => (folder === "all" || a.folder === folder) && (!q || `${a.title} ${a.file_name} ${a.alt_text}`.toLowerCase().includes(q.toLowerCase()))
  );
  const input = "w-full bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1";

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Asset Library</h1>
          <p className="text-zinc-600 font-medium mt-1">Every image and document used on the site. Upload once, reuse anywhere via the “Library” button on any image field.</p>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Upload folder" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} className="border border-zinc-300 rounded-sm text-sm py-2.5 px-3 text-zinc-900 bg-white">
            {ASSET_FOLDERS.map((f) => <option key={f} value={f}>Upload to: {f}</option>)}
          </select>
          <button onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold rounded-sm">
            <Upload className="w-4 h-4" /> {busy ? "Uploading…" : "Upload files"}
          </button>
          <input ref={fileRef} type="file" multiple hidden accept="image/*,application/pdf" onChange={onFiles} />
        </div>
      </div>

      {msg && <p role="status" className={`mb-6 p-3 text-sm border rounded-sm ${msg.kind === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>{msg.text}</p>}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input aria-label="Search assets" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search assets…" className="pl-9 pr-3 py-2 border border-zinc-300 rounded-sm text-sm text-zinc-900 w-64" />
        </div>
        {["all", ...ASSET_FOLDERS].map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${folder === f ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500"}`}>{f}</button>
        ))}
        <span className="ml-auto text-sm text-zinc-600">{visible.length} assets</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 content-start">
          {loading && <p className="col-span-full text-zinc-600">Loading…</p>}
          {!loading && visible.length === 0 && <p className="col-span-full text-zinc-600 border border-dashed border-zinc-300 rounded-sm p-10 text-center">No assets in this view.</p>}
          {visible.map((a) => (
            <button key={a.id} onClick={() => setSelected(a)} className={`text-left bg-white border rounded-sm overflow-hidden ${selected?.id === a.id ? "border-blue-600 ring-2 ring-blue-200" : "border-zinc-200 hover:border-zinc-400"}`}>
              <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center">
                {isImage(a) && a.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.public_url} alt={a.alt_text || a.title || ""} className="w-full h-full object-cover" loading="lazy" />
                ) : <FileText className="w-8 h-8 text-zinc-500" />}
              </div>
              <div className="p-2">
                <p className="text-xs font-bold text-zinc-900 truncate">{a.title || a.file_name}</p>
                <p className="text-xs text-zinc-600">{a.folder} · {prettySize(a.size_bytes)}</p>
              </div>
            </button>
          ))}
        </div>

        <aside className="bg-white border border-zinc-200 rounded-md p-5 h-fit lg:sticky lg:top-6 space-y-4">
          {!selected ? (
            <p className="text-sm text-zinc-600">Select an asset to edit its title, alt text and folder, copy its URL, or delete it.</p>
          ) : (
            <>
              {isImage(selected) && selected.public_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.public_url} alt={selected.alt_text || ""} className="w-full rounded-sm border border-zinc-200" />
              )}
              <p className="text-xs text-zinc-600">{selected.file_name} · {selected.width && selected.height ? `${selected.width}×${selected.height} · ` : ""}{prettySize(selected.size_bytes)}</p>
              <div><label htmlFor="as-title" className={lbl}>Title</label><input id="as-title" className={input} value={selected.title || ""} onChange={(e) => setSelected({ ...selected, title: e.target.value })} /></div>
              <div><label htmlFor="as-alt" className={lbl}>Alt text (accessibility)</label><input id="as-alt" className={input} value={selected.alt_text || ""} onChange={(e) => setSelected({ ...selected, alt_text: e.target.value })} /></div>
              <div><label htmlFor="as-folder" className={lbl}>Folder</label>
                <select id="as-folder" className={input} value={selected.folder} onChange={(e) => setSelected({ ...selected, folder: e.target.value })}>
                  {ASSET_FOLDERS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={saveMeta} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-bold rounded-sm">Save</button>
                <button onClick={async () => { await navigator.clipboard.writeText(selected.public_url || ""); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 hover:bg-zinc-50 text-sm font-bold text-zinc-800 rounded-sm">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy URL"}
                </button>
                {isAdmin && (
                  <button onClick={remove} className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-sm font-bold rounded-sm"><Trash2 className="w-4 h-4" /> Delete</button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
