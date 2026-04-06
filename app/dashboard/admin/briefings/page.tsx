"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, CalendarDays, Clock, MoreVertical, Globe, Megaphone } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function BriefingsManagerPage() {
  const [activeTab, setActiveTab] = useState<"briefings" | "alerts">("briefings");
  const [briefings, setBriefings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchData() {
      // Fetch Live Briefings
      const { data: dbBriefings } = await supabase
        .from('news_briefings')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Fetch Live Alerts
      const { data: dbAlerts } = await supabase
        .from('global_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      setBriefings(dbBriefings || []);
      setAlerts(dbAlerts || []);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Intelligence & Alerts Engine</h1>
          <p className="text-zinc-500 font-medium mt-1">Govern the temporal execution of Market Briefings and Global Flash Alerts.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center justify-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold text-white rounded-sm transition-colors shadow-md">
            <Megaphone className="w-4 h-4 mr-2" />
            Issue Global Alert
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Compose Briefing
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-zinc-200 mb-8">
        <button 
          onClick={() => setActiveTab("briefings")}
          className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'briefings' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Market Briefings Database
          {activeTab === 'briefings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab("alerts")}
          className={`pb-3 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'alerts' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Temporal Flash Alerts
          {activeTab === 'alerts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {/* Primary Data Workspace */}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm">
        
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 rounded-t-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder={activeTab === 'briefings' ? "Search intelligence reports..." : "Search alerts..."}
                className="pl-9 pr-4 py-2 w-64 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 border border-zinc-300 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-sm transition-colors">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Status: All
            </button>
          </div>
        </div>

        {/* Dynamic Table Output */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4 w-1/2">
                  {activeTab === 'briefings' ? 'Intelligence Title' : 'Alert Broadcast Message'}
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">
                  {activeTab === 'briefings' ? 'Publication Date' : 'Temporal Logic (Start -> End)'}
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            
            {activeTab === 'briefings' ? (
              <tbody className="divide-y divide-zinc-100 text-sm">
                {isLoading ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Telemetry from Supabase...</td></tr>
                ) : briefings.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold">No Active Briefings. Click "Compose" to instantiate.</td></tr>
                ) : briefings.map((briefing) => (
                  <tr key={briefing.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer">{briefing.title}</p>
                      <div className="flex items-center text-xs text-zinc-500 mt-1 truncate max-w-sm">
                        <Globe className="w-3 h-3 mr-1 shrink-0" /> ID: {briefing.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                        briefing.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        briefing.status === 'inactive' ? 'bg-amber-100 text-amber-700' : 
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                        {briefing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-zinc-700 font-medium whitespace-nowrap">
                        <CalendarDays className="w-4 h-4 mr-2 text-zinc-400" />
                        {new Date(briefing.valid_from).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 flex items-center whitespace-nowrap">
                        <Clock className="w-3 h-3 mr-1" />
                        Expires: {briefing.valid_to ? new Date(briefing.valid_to).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="divide-y divide-zinc-100 text-sm">
                {isLoading ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Telemetry from Supabase...</td></tr>
                ) : alerts.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-zinc-500 font-bold">No Active Alerts Executing.</td></tr>
                ) : alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-zinc-900 mb-1">{alert.message}</p>
                      <div className="flex items-center text-xs font-semibold text-blue-600">
                         {alert.link_url}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                        alert.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {alert.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                      <div className="font-medium">{new Date(alert.valid_from).toLocaleDateString()}</div>
                      <div className="text-zinc-400">to {alert.valid_to ? new Date(alert.valid_to).toLocaleDateString() : 'Active'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:underline">Edit Logic</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-500 flex justify-between items-center">
          <span>Showing latest {activeTab === 'briefings' ? briefings.length : alerts.length} entries natively executing from Supabase.</span>
        </div>
      </div>
    </div>
  );
}
