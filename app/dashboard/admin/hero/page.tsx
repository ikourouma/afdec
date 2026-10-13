"use client";

import React, { useState, useEffect } from "react";
import { 
  Layout, Image as ImageIcon, Save, Edit3, Trash2, Plus, X, List, Globe 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function HeroContentGovernancePage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<any>({
    type: "single_image",
    title: "",
    subtitle: "",
    media_1: "",
    primary_cta_text: "",
    primary_cta_link: "",
    secondary_cta_type: "button",
    secondary_cta_text: "",
    secondary_cta_link: "",
    event_date: "",
    event_location: "",
    is_active: true,
    sort_order: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });
    setSlides(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await supabase.from('hero_slides').update(form).eq('id', form.id);
    } else {
      await supabase.from('hero_slides').insert([form]);
    }
    setIsFormOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this hero section permanently?")) {
      await supabase.from('hero_slides').delete().eq('id', id);
      fetchData();
    }
  };

  const openForm = (slide?: any) => {
    if (slide) {
      setForm(slide);
    } else {
      setForm({
        type: "single_image", title: "", subtitle: "", media_1: "", primary_cta_text: "", primary_cta_link: "",
        secondary_cta_type: "button", secondary_cta_text: "", secondary_cta_link: "", event_date: "", event_location: "",
        is_active: true, sort_order: 0
      });
    }
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Hero Sections & CTAs</h1>
          <p className="text-zinc-500 font-medium mt-1">Govern the global hero carousel, special announcements, and call-to-actions.</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Hero Slide
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <List className="w-4 h-4" />
            <span>Active Global Hero Slides</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Slide Content</th>
                <th className="px-6 py-4">Media</th>
                <th className="px-6 py-4">CTAs & Routing</th>
                <th className="px-6 py-4 text-center">Status / Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading Hero Database...</td></tr>
              ) : slides.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">No hero slides found.</td></tr>
              ) : slides.map((slide) => (
                <tr key={slide.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900 mb-1">{slide.title}</p>
                    <p className="text-xs text-zinc-500 max-w-xs truncate">{slide.subtitle}</p>
                    {slide.event_date && (
                      <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-100 inline-block px-2 py-0.5 rounded-sm">
                        Event: {slide.event_date}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs text-zinc-600 uppercase font-bold tracking-widest">{slide.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs font-bold text-blue-600">
                        <Globe className="w-3 h-3 mr-1" /> {slide.primary_cta_text}
                      </div>
                      {slide.secondary_cta_text && (
                        <div className="flex items-center text-xs font-medium text-zinc-500">
                          ↳ {slide.secondary_cta_text}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                        slide.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {slide.is_active ? 'Active' : 'Draft'}
                      </span>
                      <span className="text-xs text-zinc-400 font-bold">Order: {slide.sort_order}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openForm(slide)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(slide.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-zinc-200 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 sticky top-0 z-10">
              <h2 className="text-lg font-black text-zinc-900">{form.id ? "Edit Hero Slide" : "Create Hero Slide"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Core Content</h3>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Headline Title</label>
                  <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Subtitle / Briefing</label>
                  <textarea rows={2} required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Media & Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Slide Type</label>
                    <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option value="single_image">Single Image</option>
                      <option value="dual_image">Dual Image Split</option>
                      <option value="video">Background Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Primary Media URL</label>
                    <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.media_1} onChange={e => setForm({...form, media_1: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Routing & Actions (CTAs)</h3>
                <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded border border-blue-100">
                  <div>
                    <label className="block text-xs font-bold text-blue-900 uppercase mb-2">Primary CTA Text</label>
                    <input type="text" required className="w-full bg-white border border-blue-200 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.primary_cta_text} onChange={e => setForm({...form, primary_cta_text: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-900 uppercase mb-2">Primary CTA URL</label>
                    <input type="text" required className="w-full bg-white border border-blue-200 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.primary_cta_link} onChange={e => setForm({...form, primary_cta_link: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Secondary CTA Text</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.secondary_cta_text} onChange={e => setForm({...form, secondary_cta_text: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Secondary CTA URL</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.secondary_cta_link} onChange={e => setForm({...form, secondary_cta_link: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Event Badging (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Event Date</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Oct 12-14, 2026" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Event Location</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Raleigh, NC" value={form.event_location} onChange={e => setForm({...form, event_location: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Visibility & Sorting</h3>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-zinc-300 w-4 h-4" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                    <span className="text-sm font-bold text-zinc-700">Slide is Active</span>
                  </label>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Sort Order</label>
                    <input type="number" className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm flex items-center justify-center transition-colors shadow-lg">
                  <Save className="w-5 h-5 mr-2" /> Commit Hero Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
