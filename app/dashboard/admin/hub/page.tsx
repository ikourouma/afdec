"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, Globe, LayoutGrid, Plus, Save, 
  Trash2, Edit, X, Network, Briefcase, Zap, 
  Landmark, Users, AlertCircle, CheckCircle, Activity
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function HubAdminModule() {
  const [activeTab, setActiveTab] = useState<"locations" | "services" | "stats">("locations");
  const [locations, setLocations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forms state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setIsLoading(true);
    try {
      if (activeTab === "locations") {
        const { data } = await supabase.from("hub_locations").select("*").order("sort_order");
        setLocations(data || []);
      } else if (activeTab === "services") {
        const { data } = await supabase.from("hub_services").select("*").order("sort_order");
        setServices(data || []);
      } else if (activeTab === "stats") {
        const { data } = await supabase.from("hub_stats").select("*").order("sort_order");
        setStats(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleVisibility(id: string, current: boolean, table: string) {
    await supabase.from(table).update({ is_visible: !current }).eq('id', id);
    fetchData();
  }

  async function handleDelete(id: string, table: string) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  }

  function openForm(item: any = null) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingItem(null);
    setIsFormOpen(false);
  }

  async function handleSaveLocation(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      city: formData.get('city'),
      country: formData.get('country'),
      hub_type: formData.get('hub_type'),
      description: formData.get('description'),
      address: formData.get('address'),
      flag: formData.get('flag'),
      status: formData.get('status'),
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      highlights: (formData.get('highlights') as string).split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingItem?.id) {
      await supabase.from('hub_locations').update(updates).eq('id', editingItem.id);
    } else {
      await supabase.from('hub_locations').insert(updates);
    }
    closeForm();
    fetchData();
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      title: formData.get('title'),
      icon_name: formData.get('icon_name'),
      description: formData.get('description'),
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      tags: (formData.get('tags') as string).split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingItem?.id) {
      await supabase.from('hub_services').update(updates).eq('id', editingItem.id);
    } else {
      await supabase.from('hub_services').insert(updates);
    }
    closeForm();
    fetchData();
  }

  async function handleSaveStat(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      value: formData.get('value'),
      label: formData.get('label'),
      sublabel: formData.get('sublabel'),
      sort_order: parseInt(formData.get('sort_order') as string) || 0
    };

    if (editingItem?.id) {
      await supabase.from('hub_stats').update(updates).eq('id', editingItem.id);
    } else {
      await supabase.from('hub_stats').insert(updates);
    }
    closeForm();
    fetchData();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Hub Network Manager</h1>
          <p className="text-zinc-500">Manage hub locations, services, and statistics for the dual-continent page.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab === "locations" ? "Hub" : activeTab === "services" ? "Service" : "Stat"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-zinc-200 mb-8">
        <button
          onClick={() => setActiveTab("locations")}
          className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'locations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'}`}
        >
          <Globe className="w-4 h-4" /> Hub Locations
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'}`}
        >
          <LayoutGrid className="w-4 h-4" /> Services
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'stats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'}`}
        >
          <Activity className="w-4 h-4" /> Stats
        </button>
      </div>

      {/* Data Lists */}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-zinc-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            Loading Data...
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {activeTab === "locations" && locations.map(loc => (
              <div key={loc.id} className="p-4 hover:bg-zinc-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{loc.flag}</div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{loc.city} <span className="text-xs font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full ml-2">{loc.status}</span></h3>
                    <p className="text-sm text-zinc-500 truncate max-w-md">{loc.country} • {loc.hub_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleVisibility(loc.id, loc.is_visible, 'hub_locations')} className={`px-3 py-1.5 text-xs font-semibold rounded ${loc.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {loc.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => openForm(loc)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(loc.id, 'hub_locations')} className="p-2 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === "services" && services.map(svc => (
              <div key={svc.id} className="p-4 hover:bg-zinc-50 flex items-center justify-between transition-colors">
                <div>
                  <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                    {svc.title} 
                    <span className="text-xs font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">{svc.icon_name}</span>
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-2xl truncate">{svc.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleVisibility(svc.id, svc.is_visible, 'hub_services')} className={`px-3 py-1.5 text-xs font-semibold rounded ${svc.is_visible ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                    {svc.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => openForm(svc)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(svc.id, 'hub_services')} className="p-2 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === "stats" && stats.map(stat => (
              <div key={stat.id} className="p-4 hover:bg-zinc-50 flex items-center justify-between transition-colors">
                <div>
                  <div className="text-2xl font-black text-blue-600 mb-1">{stat.value}</div>
                  <h3 className="font-bold text-zinc-900">{stat.label}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">{stat.sublabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openForm(stat)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(stat.id, 'hub_stats')} className="p-2 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {((activeTab === 'locations' && locations.length === 0) || 
              (activeTab === 'services' && services.length === 0) || 
              (activeTab === 'stats' && stats.length === 0)) && !isLoading && (
              <div className="p-12 text-center text-zinc-500">
                No data available. Click "Add New" to create an entry.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-sm" onClick={closeForm} />
          <div className="w-full max-w-md bg-white h-full relative z-10 shadow-2xl flex flex-col border-l border-zinc-200">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <h2 className="text-xl font-bold text-zinc-900">
                {editingItem ? 'Edit' : 'New'} {activeTab === "locations" ? "Hub Location" : activeTab === "services" ? "Service" : "Stat"}
              </h2>
              <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === "locations" && (
                <form id="locationForm" onSubmit={handleSaveLocation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">City</label>
                    <input name="city" defaultValue={editingItem?.city} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Country</label>
                    <input name="country" defaultValue={editingItem?.country} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Hub Type</label>
                      <input name="hub_type" defaultValue={editingItem?.hub_type} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Flag Emoji</label>
                      <input name="flag" defaultValue={editingItem?.flag} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Status</label>
                      <input name="status" defaultValue={editingItem?.status || 'Active'} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Sort Order</label>
                      <input name="sort_order" type="number" defaultValue={editingItem?.sort_order || 0} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Address</label>
                    <input name="address" defaultValue={editingItem?.address} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} rows={3} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Highlights (comma separated)</label>
                    <input name="highlights" defaultValue={editingItem?.highlights?.join(', ')} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </form>
              )}

              {activeTab === "services" && (
                <form id="serviceForm" onSubmit={handleSaveService} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Title</label>
                    <input name="title" defaultValue={editingItem?.title} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Icon Name</label>
                      <input name="icon_name" defaultValue={editingItem?.icon_name || 'Building2'} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Sort Order</label>
                      <input name="sort_order" type="number" defaultValue={editingItem?.sort_order || 0} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} rows={4} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                    <input name="tags" defaultValue={editingItem?.tags?.join(', ')} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </form>
              )}

              {activeTab === "stats" && (
                <form id="statForm" onSubmit={handleSaveStat} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Value</label>
                    <input name="value" defaultValue={editingItem?.value} placeholder="e.g. 6" className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Label</label>
                    <input name="label" defaultValue={editingItem?.label} placeholder="e.g. Hub Cities" className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Sublabel (Optional)</label>
                    <input name="sublabel" defaultValue={editingItem?.sublabel} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">Sort Order</label>
                    <input name="sort_order" type="number" defaultValue={editingItem?.sort_order || 0} className="w-full border border-zinc-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </form>
              )}
            </div>
            
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
              <button onClick={closeForm} className="px-4 py-2 text-zinc-600 font-semibold hover:bg-zinc-200 rounded transition-colors">Cancel</button>
              <button 
                type="submit" 
                form={activeTab === "locations" ? "locationForm" : activeTab === "services" ? "serviceForm" : "statForm"}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-semibold shadow-sm flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
