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
    businesses: 0,
    diaspora: 0,
    agencies: 0,
    markets: 0
  });

  React.useEffect(() => {
    async function syncTelemetry() {
      const [{ count: leadCount }, { count: profileCount }] = await Promise.all([
        supabase.from('lead_intakes').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);
      
      setCounts({
        businesses: leadCount || 0,
        diaspora: profileCount || 0,
        agencies: 54, // Hardcoded Sovereign limit
        markets: 12
      });
    }
    syncTelemetry();
  }, []);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">Global Overview</h1>
          <p className="text-zinc-500 font-medium mt-2">Executive telemetry and macro registration data for Q4 2026.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-zinc-300 text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 rounded-sm transition-colors shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            Time Range: YTD
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md">
            Generate Board Report
          </button>
        </div>
      </div>

      {/* Macro Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Dynamic Businesses Card */}
        <Link href="/dashboard/admin/businesses?filter=active" className="group bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-md bg-blue-100`}><Building2 className={`w-6 h-6 text-blue-600`} /></div>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700`}>Live Tracking</div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-zinc-900 tracking-tight mb-1">{counts.businesses}</h3>
            <div className="flex items-center justify-between text-zinc-500 font-medium text-sm"><span>Registered Businesses</span><ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500" /></div>
          </div>
        </Link>
        
        {/* Dynamic Diaspora Card */}
        <Link href="/dashboard/admin/users" className="group bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-md bg-emerald-100`}><Users className={`w-6 h-6 text-emerald-600`} /></div>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700`}>Verified Users</div>
          </div>
          <div>
            <h3 className="text-4xl font-black text-zinc-900 tracking-tight mb-1">{counts.diaspora}</h3>
            <div className="flex items-center justify-between text-zinc-500 font-medium text-sm"><span>System Profiles</span><ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500" /></div>
          </div>
        </Link>
        
        {macroMetrics.slice(2).map((metric) => (
          <Link key={metric.id} href={metric.href} className="group bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
            {/* Hover Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-md ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                metric.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {metric.trend}
              </div>
            </div>
            
            <div>
              <h3 className="text-4xl font-black text-zinc-900 tracking-tight mb-1">{metric.value}</h3>
              <div className="flex items-center justify-between text-zinc-500 font-medium text-sm">
                <span>{metric.label}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Primary Data Table Preview */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <h2 className="text-lg font-bold text-zinc-900">Recent Enterprise Registrations</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="pl-9 pr-4 py-2 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Entity / Organization</th>
                <th className="px-6 py-4">Primary Contact</th>
                <th className="px-6 py-4">Industry Sector</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {[
                { org: "Apex Agricultural Dev", contact: "sarah@apexagri.com", sector: "Agriculture", status: "Verified" },
                { org: "Nigerian Logistics Hub", contact: "ops@nlh-trade.ng", sector: "Infrastructure", status: "Pending Audit" },
                { org: "Research Triangle Energy", contact: "director@rt-energy.com", sector: "Clean Tech", status: "Verified" },
                { org: "West African Telecom", contact: "infrastructure@wat.co", sector: "Telecommunications", status: "New Registry" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-900">{row.org}</td>
                  <td className="px-6 py-4 text-zinc-500">{row.contact}</td>
                  <td className="px-6 py-4 text-zinc-600">{row.sector}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      row.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                      row.status === 'New Registry' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 text-center">
          <Link href="/dashboard/admin/businesses" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
            View Full Organization Database →
          </Link>
        </div>
      </div>

    </div>
  );
}
