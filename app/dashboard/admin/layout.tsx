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
  ChevronDown,
  MessageSquare,
  Briefcase,
  ShieldCheck,
  Globe,
  Target,
  Megaphone,
  Calendar,
  Image,
  UserPlus,
  Handshake,
  BadgeDollarSign,
  Newspaper,
  FolderOpen,
  ClipboardList,
  LayoutTemplate,
  Compass,
  ScrollText
} from "lucide-react";
import { supabase, DB_ERROR_EVENT } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL, isAdminOnlyPath } from "@/lib/roles";

// Grouped sidebar navigation
const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { name: "Command Center", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Market Pulse", href: "/dashboard/admin/telemetry", icon: Activity },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Hero Slides", href: "/dashboard/admin/hero", icon: Image },
      { name: "Briefings & Alerts", href: "/dashboard/admin/briefings", icon: Megaphone },
      { name: "Policy Briefs", href: "/dashboard/admin/policy", icon: FileText },
      { name: "Media & Press", href: "/dashboard/admin/media", icon: Newspaper },
      { name: "Pages & SEO", href: "/dashboard/admin/pages", icon: LayoutTemplate },
      { name: "Asset Library", href: "/dashboard/admin/assets", icon: FolderOpen },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Hub Network", href: "/dashboard/admin/hub", icon: Globe },
      { name: "Events", href: "/dashboard/admin/events", icon: Calendar },
      { name: "Portfolio", href: "/dashboard/admin/portfolio", icon: Target },
      { name: "Concierge Inbox", href: "/dashboard/admin/concierge", icon: MessageSquare },
      { name: "Investor Deal Room", href: "/dashboard/admin/deal-room/investor", icon: Briefcase },
      { name: "Fund Applications", href: "/dashboard/admin/deal-room", icon: ClipboardList },
      { name: "Country Intelligence", href: "/dashboard/admin/intelligence", icon: Compass },
      { name: "Surveys", href: "/dashboard/admin/surveys", icon: ClipboardList },
      { name: "Careers", href: "/dashboard/admin/careers", icon: Briefcase },
    ],
  },
  {
    label: "People",
    items: [
      { name: "User Management", href: "/dashboard/admin/users", icon: Users },
      { name: "Council & Staff", href: "/dashboard/admin/staff", icon: ShieldCheck },
      { name: "Diaspora Registry", href: "/dashboard/admin/diaspora", icon: Map },
      { name: "Newsletter", href: "/dashboard/admin/newsletter", icon: Mail },
      { name: "Partner Requests", href: "/dashboard/admin/partner-requests", icon: Handshake },
      { name: "Memberships", href: "/dashboard/admin/memberships", icon: UserPlus },
      { name: "Audit Log", href: "/dashboard/admin/audit", icon: ScrollText },
    ],
  },
  {
    label: "Business",
    items: [
      { name: "Enterprise Entities", href: "/dashboard/admin/businesses", icon: Building2 },
      { name: "Sponsorships", href: "/dashboard/admin/sponsorships", icon: BadgeDollarSign },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  React.useEffect(() => {
    const onErr = (e: Event) => {
      const d = (e as CustomEvent).detail as { status: number; message: string; code?: string };
      setDbError(
        d.code === "42501" || d.status === 403
          ? "Permission denied: your role is not allowed to perform this action."
          : d.status === 401
          ? "Your session has expired. Please sign in again."
          : d.message || "The request failed."
      );
      window.setTimeout(() => setDbError(null), 8000);
    };
    window.addEventListener(DB_ERROR_EVENT, onErr);
    return () => window.removeEventListener(DB_ERROR_EVENT, onErr);
  }, []);
  const { loading, isSignedIn, isStaff, isAdmin, role, profile } = useAuth();
  const adminName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ""}`.trim()
    : profile?.email || "Command Executive";
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Overview": true,
    "Content": true,
    "Operations": true,
    "People": true,
    "Business": true,
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Client-side guard (defence in depth: proxy.ts already blocks on the server, RLS blocks data).
  if (loading || (isSignedIn && !profile)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-300 font-bold uppercase tracking-[0.2em] text-sm">Verifying clearance...</div>
      </div>
    );
  }
  if (!isSignedIn || !isStaff) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <ShieldCheck className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access restricted</h1>
          <p className="text-zinc-300 mb-6">The Command Center is limited to AfDEC staff and administrators.</p>
          <Link href={isSignedIn ? "/dashboard" : "/auth?redirect=/dashboard/admin"} className="inline-block bg-white text-zinc-950 font-bold px-6 py-3 rounded-sm">
            {isSignedIn ? "Go to my dashboard" : "Sign in"}
          </Link>
        </div>
      </div>
    );
  }
  const visibleGroups = sidebarGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => isAdmin || !isAdminOnlyPath(i.href)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans selection:bg-blue-500/30 selection:text-blue-900">
      
      {/* PERSISTENT SIDEBAR */}
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

        {/* Admin Greeting */}
        {isSidebarOpen && (
          <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-900/30">
            <p className="text-[11px] uppercase font-bold text-emerald-400 tracking-widest mb-0.5">Clearance: {role ? ROLE_LABEL[role] : "Staff"}</p>
            <p className="text-sm font-semibold text-zinc-100 truncate">{adminName}</p>
          </div>
        )}

        {/* Grouped Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {isSidebarOpen ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-300 transition-colors rounded-sm"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedGroups[group.label] ? '' : '-rotate-90'}`} />
                </button>
              ) : (
                <div className="h-px bg-zinc-800 my-2 mx-2" />
              )}

              {(isSidebarOpen ? expandedGroups[group.label] : true) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-sm transition-all group ${
                          isActive 
                            ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20" 
                            : "hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
                        }`}
                      >
                        <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                        {isSidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-900 flex flex-col space-y-2">
          {isSidebarOpen ? (
            <>
              <Link href="/" className="flex items-center px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-sm hover:bg-zinc-900 transition-colors w-full">
                <Globe className="w-4 h-4 mr-3" /> Return to Platform
              </Link>
              <Link href={isAdmin ? "/dashboard/admin/settings" : "/dashboard/settings"} className="flex items-center px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-sm hover:bg-zinc-900 transition-colors w-full">
                <Settings className="w-4 h-4 mr-3" /> Settings
              </Link>
              <button 
                onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth'; }}
                className="flex items-center px-3 py-2 mt-2 border-t border-zinc-900 pt-2 text-sm text-red-400 hover:text-red-300 rounded-sm hover:bg-red-950/30 transition-colors w-full"
              >
                <LogOut className="w-4 h-4 mr-3" /> Sign Out
              </button>
            </>
          ) : (
             <button 
                aria-label="Sign out"
                onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth'; }}
                className="flex items-center justify-center w-full py-2 text-red-400 hover:text-red-300 rounded-sm hover:bg-red-950/30 transition-colors"
             >
                <LogOut className="w-5 h-5" />
             </button>
          )}
        </div>
      </aside>

      {/* DYNAMIC WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-zinc-50 relative">
        {/* Toggle button */}
        <button 
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-0 -translate-x-1/2 w-6 h-10 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center rounded-r-md z-[60] shadow-lg focus:outline-none"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Render child pages */}
        <main className="flex-1 overflow-y-auto">
          {dbError && (
            <div role="alert" className="fixed top-4 right-4 z-[500] max-w-md bg-red-700 text-white text-sm font-semibold px-4 py-3 rounded-sm shadow-xl flex items-start gap-3">
              <span>{dbError}</span>
              <button aria-label="Dismiss" onClick={() => setDbError(null)} className="font-black">×</button>
            </div>
          )}
            {children}
        </main>
      </div>
    </div>
  );
}
