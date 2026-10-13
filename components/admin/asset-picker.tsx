"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileText, ImageIcon, Search, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ASSET_FOLDERS, type Asset, isImage, uploadAsset } from "@/lib/assets";

/** Modal that lets staff pick an existing asset or upload a new one. */
export function AssetPicker({
  open,
  onClose,
  onSelect,
  accept = "image",
  defaultFolder = "general",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  accept?: "image" | "any";
  defaultFolder?: string;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [folder, setFolder] = useState("all");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("assets").select("*").order("created_at", { ascending: false }).limit(300);
    setAssets((data as Asset[]) ?? []);
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  if (!open) return null;

  const visible = assets.filter(
    (a) =>
      (accept === "any" || isImage(a)) &&
      (folder === "all" || a.folder === folder) &&
      (!q || `${a.title} ${a.file_name} ${a.alt_text}`.toLowerCase().includes(q.toLowerCase()))
  );

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const a = await uploadAsset(file, { folder: folder === "all" ? defaultFolder : folder });
      await load();
      onSelect(a);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Asset library">
      <button aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-md shadow-2xl flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200">
          <h2 className="text-lg font-extrabold text-zinc-900 mr-auto">Asset library</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input aria-label="Search assets" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-8 pr-3 py-2 border border-zinc-300 rounded-sm text-sm text-zinc-900 w-44" />
          </div>
          <select aria-label="Folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="border border-zinc-300 rounded-sm text-sm py-2 px-2 text-zinc-900">
            <option value="all">All folders</option>
            {ASSET_FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <button onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold rounded-sm">
            <Upload className="w-4 h-4" /> {busy ? "Uploading…" : "Upload"}
          </button>
          <input ref={fileRef} type="file" hidden accept={accept === "image" ? "image/*" : "image/*,application/pdf"} onChange={onFile} />
          <button aria-label="Close library" onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-sm"><X className="w-5 h-5 text-zinc-400" /></button>
        </div>
        {error && <p role="alert" className="m-4 mb-0 p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded-sm">{error}</p>}
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {visible.length === 0 && <p className="col-span-full text-zinc-400 text-sm py-10 text-center">No assets yet. Upload one to get started.</p>}
          {visible.map((a) => (
            <button key={a.id} onClick={() => { onSelect(a); onClose(); }} className="text-left border border-zinc-200 hover:border-blue-500 rounded-sm overflow-hidden bg-zinc-50 group">
              <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center overflow-hidden">
                {isImage(a) && a.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.public_url} alt={a.alt_text || a.title || ""} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <FileText className="w-8 h-8 text-zinc-400" />
                )}
              </div>
              <p className="px-2 py-1.5 text-xs font-semibold text-zinc-800 truncate">{a.title || a.file_name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** URL text box + "Choose from library" + preview. Drop-in for any `image_url` field. */
export function ImageField({
  label,
  value,
  onChange,
  folder = "general",
  altValue,
  onAltChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  altValue?: string;
  onAltChange?: (alt: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const id = React.useId();
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex gap-2">
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or choose from library" className="flex-1 bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-bold text-zinc-800 rounded-sm whitespace-nowrap">
          <ImageIcon className="w-4 h-4" /> Library
        </button>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt={altValue || "Selected image preview"} className="mt-2 h-24 rounded-sm border border-zinc-200 object-cover" />
      )}
      <AssetPicker
        open={open}
        onClose={() => setOpen(false)}
        defaultFolder={folder}
        onSelect={(a) => {
          onChange(a.public_url || "");
          if (onAltChange && a.alt_text) onAltChange(a.alt_text);
        }}
      />
    </div>
  );
}
