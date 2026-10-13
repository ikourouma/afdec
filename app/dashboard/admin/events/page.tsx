"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit3, Trash2, X, Save, Clock, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ImageField } from "@/components/admin/asset-picker";

export default function EventsAdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [form, setForm] = useState<any>({
    title: "", description: "", event_date: "", location: "", capacity: 100, image_url: "", status: "published", is_featured: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setEvents(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      event_date: new Date(form.event_date).toISOString(),
      location: form.location,
      capacity: form.capacity,
      image_url: form.image_url || null,
      status: form.status || "published",
      is_featured: !!form.is_featured,
    };
    const { error } = form.id
      ? await supabase.from('events').update(payload).eq('id', form.id)
      : await supabase.from('events').insert([payload]);
    if (error) return; // the console banner explains the failure
    setIsFormOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this event? This will also delete all registrations.")) {
      await supabase.from('events').delete().eq('id', id);
      fetchData();
    }
  };

  const openForm = (eventObj?: any) => {
    if (eventObj) {
      setForm({
        ...eventObj,
        image_url: eventObj.image_url || "",
        event_date: new Date(new Date(eventObj.event_date).getTime() - new Date(eventObj.event_date).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      });
    } else {
      setForm({
        title: "", description: "", event_date: "", location: "", capacity: 100, image_url: "", status: "published", is_featured: false
      });
    }
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Event Engine</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage bilateral summits, trade missions, and virtual sessions.</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <Calendar className="w-4 h-4" />
            <span>Scheduled Events</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-center">Capacity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Calendar...</td></tr>
              ) : events.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-zinc-500 font-bold">No events scheduled.</td></tr>
              ) : events.map((ev) => (
                <tr key={ev.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900 mb-1">{ev.title}</p>
                    <p className="text-xs text-zinc-500 max-w-xs truncate">{ev.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1 text-zinc-700 font-medium">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{new Date(ev.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-zinc-500">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{new Date(ev.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-zinc-700">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="truncate max-w-[150px]">{ev.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center space-x-2 bg-zinc-100 px-3 py-1 rounded-full">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-700">{ev.capacity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button aria-label={`Edit ${ev.title}`} onClick={() => openForm(ev)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button aria-label={`Delete ${ev.title}`} onClick={() => handleDelete(ev.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
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
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-zinc-200 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 sticky top-0 z-10">
              <h2 className="text-lg font-black text-zinc-900">{form.id ? "Edit Event" : "Create Event"}</h2>
              <button aria-label="Close" onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Event Title</label>
                <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Description</label>
                <textarea rows={4} required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Event Date & Time</label>
                  <input type="datetime-local" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Max Capacity</label>
                  <input type="number" min="1" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value) || 100})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Location (Physical or Virtual URL)</label>
                <input type="text" required className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </div>

              <ImageField label="Event image" folder="events" value={form.image_url || ""} onChange={(url) => setForm({...form, image_url: url})} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-2">Visibility</label>
                  <select className="w-full bg-zinc-50 border border-zinc-300 rounded-sm px-3 py-2 text-sm" value={form.status || "published"} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="published">Published</option>
                    <option value="draft">Draft (hidden)</option>
                  </select>
                </div>
                <label className="flex items-end gap-2 text-sm font-medium text-zinc-700 pb-2"><input type="checkbox" checked={!!form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /> Featured</label>
              </div>
              <div className="pt-6 border-t border-zinc-200">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-sm flex items-center justify-center transition-colors shadow-lg">
                  <Save className="w-5 h-5 mr-2" /> Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
