"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  FileText, 
  Users, 
  Building2,
  Mail,
  Map,
  Activity,
  LogOut,
  Settings,
  ChevronLeft,
  MessageSquare,
  Briefcase,
  ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Command Executive");

  React.useEffect(() => {
    async function loadAdminSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (session.user.email?.toLowerCase() === 'afdecadmin@afronovation.com') {
          setAdminName("Ibrahima Kourouma");
        } else {
          const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', session.user.id).maybeSingle();
          if (profile?.first_name) {
            setAdminName(`${profile.first_name} ${profile.last_name || ''}`);
          }
        }
      }
    }
    loadAdminSession();
  }, []);

  const navigation = [
    { name: "Global Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Market Pulse", href: "/dashboard/admin/telemetry", icon: Activity },
    { name: "Hero UI Engine", href: "/dashboard/admin/hero", icon: Layers },
    { name: "Market Briefings", href: "/dashboard/admin/briefings", icon: FileText },
    { name: "Diaspora Registry", href: "/dashboard/admin/diaspora", icon: Users },
    { name: "Enterprise Entities", href: "/dashboard/admin/businesses", icon: Building2 },
    { name: "Communications Control", href: "/dashboard/admin/concierge", icon: MessageSquare },
    { name: "Deal Rooms", href: "/dashboard/admin/deal-room", icon: Briefcase },
    { name: "Sovereign Council", href: "/dashboard/admin/staff", icon: ShieldCheck },
    { name: "User Management", href: "/dashboard/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans selection:bg-blue-500/30 selection:text-blue-900">
      
      {/* PERSISTENT SIDEBAR - Midnight Sapphire Theme */}
      <aside 
        className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-zinc-950 border-r border-zinc-900 text-zinc-300 flex flex-col transition-all duration-300 z-50 shrink-0`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-900 shrink-0 justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-sm flex items-center justify-center">
                <span className="text-blue-500 font-bold text-sm">AF</span>
              </div>
              <span className="text-white font-bold tracking-widest uppercase text-xs">Command Center</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-sm flex items-center justify-center mx-auto">
              <span className="text-blue-500 font-bold text-sm">AF</span>
            </div>
          )}
        </div>

        {/* Global Admin Greeting */}
        {isSidebarOpen && (
          <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-900/30">
            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest mb-0.5">Clearance: God Mode</p>
            <p className="text-sm font-semibold text-zinc-100 truncate">{adminName}</p>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {isSidebarOpen && <h3 className="px-3 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4 mt-2">Executive Modules</h3>}
          
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-sm transition-all group ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20" 
                    : "hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {isSidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-900 flex flex-col space-y-2">
          {isSidebarOpen ? (
            <>
              <button className="flex items-center px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-sm hover:bg-zinc-900 transition-colors w-full">
                <Settings className="w-4 h-4 mr-3" /> Settings
              </button>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-sm hover:bg-red-950/30 transition-colors w-full"
              >
                <LogOut className="w-4 h-4 mr-3" /> Terminate Session
              </button>
            </>
          ) : (
             <button 
                onClick={() => window.location.href = '/auth'}
                className="flex items-center justify-center w-full py-2 text-red-400 hover:text-red-300 rounded-sm hover:bg-red-950/30 transition-colors"
             >
                <LogOut className="w-5 h-5" />
             </button>
          )}
        </div>
      </aside>

      {/* DYNAMIC WORKSPACE - Clean Silver Data CRM Theme */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-zinc-50 relative">
        {/* Toggle button overlapping workspace */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-0 -translate-x-1/2 w-6 h-10 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center rounded-r-md z-[60] shadow-lg focus:outline-none"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Render child pages directly here */}
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
