"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Building2, Globe2, ShieldCheck, ArrowUpRight, Filter, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

const macroMetrics = [
  {
    id: 1,
    label: "Registered Businesses",
    value: "1,248",
    trend: "+12.4%",
    icon: Building2,
    href: "/dashboard/admin/businesses?filter=active",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    id: 2,
    label: "African Diaspora Records",
    value: "8,942",
    trend: "+4.1%",
    icon: Users,
    href: "/dashboard/admin/diaspora?filter=verified",
    color: "text-emerald-600",
    bg: "bg-emerald-100"
  },
  {
    id: 3,
    label: "Sovereign Agencies",
    value: "54",
    trend: "0.0%",
    icon: ShieldCheck,
    href: "/dashboard/admin/agencies",
    color: "text-purple-600",
    bg: "bg-purple-100"
  },
  {
    id: 4,
    label: "Active Markets",
    value: "12",
    trend: "+2",
    icon: Globe2,
    href: "/dashboard/admin/markets",
    color: "text-amber-600",
    bg: "bg-amber-100"
  }
];

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({
    total_submissions: 0,
    active_members: 0,
    infrastructure_rfps: 0,
    market_alerts: 0
  });
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function syncGodModeData() {
      // 1. Fetch Platform Telemetry (Market Indicators)
      const { data: telemetryData } = await supabase
        .from('platform_telemetry')
        .select('*');
      
      setTelemetry(telemetryData || []);

      // 2. Fetch Aggregated Counts
      const [
        { count: subCount }, 
        { count: memberCount },
      ] = await Promise.all([
        supabase.from('sovereign_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      
      setCounts({
        total_submissions: subCount || 0,
        active_members: memberCount || 0,
        infrastructure_rfps: 14, // Mock for now until specialized table
        market_alerts: 5
      });

      // 3. Fetch Recent Submissions (Universal Pipeline)
      const { data: subs } = await supabase
        .from('sovereign_submissions')
        .select(`
          id, 
          type, 
          status, 
          submitted_at, 
          reference_id,
          data
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      setRecentSubmissions(subs || []);
      setIsLoading(false);
    }
    syncGodModeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
        <div className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em]">Synching Command Telemetry...</div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12 bg-zinc-50 min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">God Mode Active</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">AfDEC Universal Command</h1>
          <p className="text-zinc-500 font-medium mt-1">Sovereign control center for global market data and partner vetting.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/admin/cms" className="flex items-center px-4 py-2 border border-zinc-300 text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 rounded-sm transition-colors shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            Manage Content
          </Link>
          <button className="flex items-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold text-white rounded-sm transition-colors shadow-md">
            Generate Sovereign Report
          </button>
        </div>
      </div>

      {/* Macro Metric Cards from Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {telemetry.map((metric) => (
          <div key={metric.id} className="group bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-blue-50 rounded-md">
                 {metric.category === 'gdp' ? <Building2 className="w-5 h-5 text-blue-600" /> : <Globe2 className="w-5 h-5 text-blue-600" />}
              </div>
              <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full ${
                metric.trend_direction === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
              } uppercase`}>
                {metric.trend_direction} Trend
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-black text-zinc-900 tracking-tight mb-1">{metric.value_current}</h3>
              <div className="flex items-center justify-between text-zinc-500 font-medium text-xs tracking-tight">
                <span>{metric.label}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Universal Submission Pipeline */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Pending Board Approvals</h2>
            <div className="flex items-center space-x-2">
               <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-blue-600 uppercase">Live Pipeline</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200">
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Queue Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {recentSubmissions.length > 0 ? recentSubmissions.map((sub, i) => (
                  <tr key={sub.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-zinc-900">{sub.reference_id || `AF-${sub.id.slice(0,5).toUpperCase()}`}</td>
                    <td className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase">{sub.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                        sub.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                        sub.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                        'bg-zinc-50 border-zinc-200 text-zinc-500'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest group-hover:scale-105 transition-transform">Verify</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-xs italic">No pending submissions in the universal inbox.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 text-center">
            <Link href="/dashboard/admin/submissions" className="text-[10px] font-black text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
              Access Master Submission Database →
            </Link>
          </div>
        </div>

        {/* Security & System Telemetry */}
        <div className="space-y-6">
           <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 shadow-2xl">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-6">System Integrity</div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-white font-bold text-sm">User Registry</div>
                       <div className="text-emerald-500 text-[10px] font-medium tracking-tight">Active Nodes Syncing</div>
                    </div>
                    <div className="text-2xl font-black text-white">{counts.active_members}</div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-white font-bold text-sm">Market Intelligence</div>
                       <div className="text-blue-500 text-[10px] font-medium tracking-tight">Q4 Forecast Logs</div>
                    </div>
                    <div className="text-2xl font-black text-white">{counts.market_alerts}</div>
                 </div>
                 <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                    <div>
                       <div className="text-white font-bold text-sm text-red-500">Security Guard</div>
                       <div className="text-zinc-500 text-[10px] font-medium tracking-tight">24h Re-Auth Enforced</div>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-red-600" />
                 </div>
              </div>
           </div>

           <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Board Directives</h3>
              <div className="space-y-3">
                 <button className="w-full text-left p-3 rounded-md bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100 flex items-center justify-between group">
                    <span className="text-xs font-bold text-zinc-700">Update National GDP Stats</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-300 group-hover:text-blue-600" />
                 </button>
                 <button className="w-full text-left p-3 rounded-md bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100 flex items-center justify-between group">
                    <span className="text-xs font-bold text-zinc-700">Refine Corridor Strategy</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-300 group-hover:text-blue-600" />
                 </button>
                 <button className="w-full text-left p-3 rounded-md bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100 flex items-center justify-between group">
                    <span className="text-xs font-bold text-zinc-700">Audit Compliance Vault</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-300 group-hover:text-blue-600" />
                 </button>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
