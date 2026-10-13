"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, Plus, Save, Trash2, Edit, X, 
  Eye, EyeOff, FilePlus, Download, User, Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadAsset } from "@/lib/assets";
import { ImageField } from "@/components/admin/asset-picker";

export default function PolicyAdminModule() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forms state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("insights_articles")
        .select("*")
        .eq("category", "policy")
        .order("published_at", { ascending: false, nullsFirst: true });
      if (error) setFormError(error.message);
      setBriefs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function togglePublish(id: string, current: boolean) {
    const { error } = await supabase
      .from("insights_articles")
      .update({ status: current ? "draft" : "published", ...(current ? {} : { published_at: new Date().toISOString() }) })
      .eq('id', id);
    if (error) setFormError(error.message);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this policy brief?")) {
      const { error } = await supabase.from("insights_articles").delete().eq('id', id);
      if (error) setFormError(error.code === "42501" ? "Only an admin can delete content." : error.message);
      fetchData();
    }
  }

  function openForm(item: any = null) {
    setEditingItem(item);
    setCoverUrl(item?.cover_image_url || "");
    setDownloadUrl(item?.download_url || "");
    setFormError(null);
    setIsFormOpen(true);
  }

  async function uploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const a = await uploadAsset(file, { folder: "insights" });
      setDownloadUrl(a.public_url || "");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  function closeForm() {
    setEditingItem(null);
    setIsFormOpen(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = String(formData.get('title') || '').trim();
    const publishedAt = formData.get('published_at') as string;
    const updates: Record<string, unknown> = {
      title,
      subtitle: formData.get('subtitle') || null,
      excerpt: formData.get('excerpt'),
      cover_image_url: coverUrl || null,
      content_type: formData.get('content_type'),
      tags: (formData.get('tags') as string).split(',').map(s => s.trim()).filter(Boolean),
      author_name: formData.get('author_name'),
      author_title: formData.get('author_title') || null,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      allow_download: formData.get('allow_download') === 'on',
      download_url: downloadUrl || null,
      download_label: formData.get('download_label') || null,
      is_featured: formData.get('is_featured') === 'on',
      status: formData.get('is_published') === 'on' ? 'published' : 'draft',
      category: 'policy'
    };
    if (!editingItem?.id) {
      updates.slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)}-${Date.now().toString(36)}`;
    }

    const { error } = editingItem?.id
      ? await supabase.from('insights_articles').update(updates).eq('id', editingItem.id)
      : await supabase.from('insights_articles').insert(updates);
    if (error) {
      setFormError(error.message);
      return;
    }
    closeForm();
    fetchData();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Policy Briefs Management</h1>
          <p className="text-zinc-500">Manage publications, research reports, and policy briefs for the insights terminal.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Policy Brief</span>
        </button>
      </div>

      {formError && !isFormOpen && <p role="alert" className="mb-4 p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded">{formError}</p>}

      {/* Data List */}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-zinc-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            Loading Data...
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {briefs.map(brief => (
              <div key={brief.id} className="p-5 hover:bg-zinc-50 flex items-start justify-between transition-colors">
                <div className="flex gap-5">
                  <div className="w-20 h-28 shrink-0 bg-zinc-100 border border-zinc-200 rounded overflow-hidden relative">
                    {brief.cover_image_url ? (
                      <img src={brief.cover_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <FileText className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                        {brief.content_type}
                      </span>
                      {brief.is_featured && (
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 leading-snug mb-1 max-w-xl">{brief.title}</h3>
                    <p className="text-sm text-zinc-500 line-clamp-1 max-w-2xl mb-2">{brief.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {brief.author_name}</div>
                      <div className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {brief.tags?.length || 0} Tags</div>
                      {brief.allow_download && <div className="flex items-center gap-1 text-emerald-600"><Download className="w-3.5 h-3.5" /> Downloadable</div>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button onClick={() => togglePublish(brief.id, brief.is_published)} className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 ${brief.is_published ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'} transition-colors`}>
                    {brief.is_published ? <><Eye className="w-3.5 h-3.5" /> Published</> : <><EyeOff className="w-3.5 h-3.5" /> Draft</>}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openForm(brief)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(brief.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}

            {briefs.length === 0 && !isLoading && (
              <div className="p-16 text-center text-zinc-500 flex flex-col items-center">
                <FilePlus className="w-12 h-12 text-zinc-300 mb-4" />
                <p className="text-lg font-medium text-zinc-900 mb-1">No policy briefs found</p>
                <p className="text-sm">Create your first publication to populate the insights terminal.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm" onClick={closeForm} />
          <div className="w-full max-w-2xl bg-white h-full relative z-10 shadow-2xl flex flex-col border-l border-zinc-200">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
              <h2 className="text-xl font-bold text-zinc-900">
                {editingItem ? 'Edit' : 'New'} Policy Brief
              </h2>
              <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="briefForm" onSubmit={handleSave} className="space-y-6">
                {formError && <p role="alert" className="p-3 border border-red-300 bg-red-50 text-red-800 text-sm rounded">{formError}</p>}
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">Core Information</h3>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Title</label>
                    <input name="title" defaultValue={editingItem?.title} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Subtitle</label>
                    <input name="subtitle" defaultValue={editingItem?.subtitle} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Excerpt</label>
                    <textarea name="excerpt" defaultValue={editingItem?.excerpt} rows={3} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Content Type</label>
                      <select name="content_type" defaultValue={editingItem?.content_type || 'brief'} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                        <option value="brief">Policy Brief</option>
                        <option value="report">Research Report / White Paper</option>
                        <option value="article">Article</option>
                        <option value="data-snapshot">Data Snapshot</option>
                      </select>
                    </div>
                    <ImageField label="Cover image" value={coverUrl} onChange={setCoverUrl} folder="insights" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                    <input name="tags" defaultValue={editingItem?.tags?.join(', ')} placeholder="e.g. Technology, Trade, Policy" className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                {/* Authorship */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">Authorship & Date</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Author Name</label>
                      <input name="author_name" defaultValue={editingItem?.author_name} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Author Title</label>
                      <input name="author_title" defaultValue={editingItem?.author_title} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Published At</label>
                      <input name="published_at" type="datetime-local" defaultValue={editingItem?.published_at ? new Date(editingItem.published_at).toISOString().slice(0, 16) : ''} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                {/* File Attachment */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">File Attachment</h3>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-700">
                    <input type="checkbox" name="allow_download" defaultChecked={editingItem?.allow_download} className="w-4 h-4 text-blue-600 rounded border-zinc-300" />
                    Allow users to download this resource
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pdf-up" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Upload PDF</label>
                      <input id="pdf-up" type="file" accept="application/pdf" onChange={uploadPdf} className="w-full text-sm text-zinc-800" />
                      {downloadUrl && <p className="text-xs text-emerald-700 mt-1 break-all">Attached: {downloadUrl}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Download Button Label</label>
                      <input name="download_label" defaultValue={editingItem?.download_label || 'Download Full Report'} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Visibility */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">Visibility Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-700">
                      <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published !== false} className="w-4 h-4 text-blue-600 rounded border-zinc-300" />
                      Publish immediately
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-700">
                      <input type="checkbox" name="is_featured" defaultChecked={editingItem?.is_featured} className="w-4 h-4 text-blue-600 rounded border-zinc-300" />
                      Feature on insights landing page
                    </label>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3 shrink-0">
              <button onClick={closeForm} className="px-4 py-2 text-zinc-600 font-semibold hover:bg-zinc-200 rounded transition-colors">Cancel</button>
              <button 
                type="submit" 
                form="briefForm"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-semibold shadow-sm flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" /> Save Policy Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
