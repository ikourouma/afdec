"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Building2, Globe2, FileText, ArrowRight, Menu, X, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MemberDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ id?: string; first_name?: string; last_name?: string; organization?: string; email?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [managedCards, setManagedCards] = useState<any[]>([]);
  const [investments, setInvestments] = useState<{ total: number; count: number }>({ total: 0, count: 0 });
  const [insights, setInsights] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ id: string; title: string; message: string; type: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/auth');
        return;
      }

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, organization')
        .eq('id', session.user.id)
        .single();
        
      setProfile({
        ...profileData,
        email: session.user.email
      });

      // 2. Fetch Managed Navigation Cards (Everything Managed)
      const { data: contentData } = await supabase
        .from('managed_content')
        .select('content')
        .eq('slug', 'member_dashboard_cards')
        .single();
      
      if (contentData?.content) {
        setManagedCards(contentData.content as any[]);
      }

      // 3. Fetch Investment Summary
      const { data: ledgerData } = await supabase
        .from('investment_ledger')
        .select('amount')
        .eq('user_id', session.user.id);
      
      if (ledgerData) {
        const total = ledgerData.reduce((acc, curr) => acc + Number(curr.amount), 0);
        setInvestments({ total, count: ledgerData.length });
      }

      // 4. Fetch Saved Insights
      const { data: insightsData } = await supabase
        .from('saved_insights')
        .select('*')
        .eq('user_id', session.user.id)
        .order('saved_at', { ascending: false })
        .limit(3);
      
      setInsights(insightsData || []);

      // 5. Fetch Fund Applications
      const { data: apps } = await supabase
        .from('fund_applications')
        .select('id, reference_number, status, project_title, submitted_at')
        .eq('applicant_user_id', session.user.id)
        .order('submitted_at', { ascending: false });
      
      setApplications(apps || []);

      // 6. Set up Real-Time Notification Listener
      const channel = supabase
        .channel(`public:notifications:user_id=eq.${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            setNotification(payload.new as any);
            // Auto-hide after 10 seconds
            setTimeout(() => setNotification(null), 10000);
          }
        )
        .subscribe();

      setIsLoading(false);
      return () => {
        supabase.removeChannel(channel);
      }
    }
    loadData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  // Helper to map icon string to Component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-8 h-8 text-blue-500 mb-6" />;
      case 'FileText': return <FileText className="w-8 h-8 text-emerald-500 mb-6" />;
      case 'Globe2': return <Globe2 className="w-8 h-8 text-purple-500 mb-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8 text-amber-500 mb-6" />;
      default: return <FileText className="w-8 h-8 text-zinc-500 mb-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
        <div className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Authenticating Terminal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
      
      {/* Real-time Sovereign Toast Alert */}
      {notification && (
        <div className="fixed top-8 right-8 z-[200] animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-zinc-900/90 border border-blue-500/50 backdrop-blur-xl p-5 rounded-lg shadow-2xl shadow-blue-500/20 max-w-sm flex items-start space-x-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="p-2 bg-blue-500/10 rounded-md">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div className="pr-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">{notification.title}</h4>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-zinc-600 hover:text-white transition-colors absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 flex items-center justify-center rounded-sm">
            <span className="text-blue-500 font-bold text-sm tracking-tight">AfDEC</span>
          </div>
          <span className="font-bold tracking-widest uppercase text-xs text-zinc-300 hidden sm:inline">Partner Portal</span>
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs font-medium text-zinc-400 border-r border-zinc-800 pr-6">
             <UserIcon className="w-4 h-4 text-zinc-500" />
             <span>{profile?.first_name} {profile?.last_name}</span>
             {profile?.organization && <span className="text-zinc-600">({profile.organization})</span>}
          </div>
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-sm border border-emerald-900/50 uppercase">
            Verified
          </span>
          <button 
            onClick={handleSignOut}
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Terminate Session
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           className="md:hidden text-zinc-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="max-w-[1400px] mx-auto p-6 md:p-12 lg:px-12 lg:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Welcome Header */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Welcome back, {profile?.first_name || 'Partner'}.
            </h1>
            <p className="text-base md:text-lg text-zinc-400 font-medium max-w-2xl leading-relaxed">
              You are securely connected to the African Diaspora Economic Council partner portal. Access your deployment pipelines, strategic infrastructure RFPs, and sovereign intelligence.
            </p>
          </div>

          {/* Portfolio Snapshot */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4">Sovereign Portfolio Telemetry</div>
              <div className="text-4xl font-black text-white mb-2">
                ${investments.total.toLocaleString()}
              </div>
              <p className="text-xs text-zinc-500 font-medium">Total contribution across {investments.count} institutional deployments.</p>
            </div>
            <Link href="/dashboard/member/investments" className="mt-8 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest flex items-center">
              View Detailed Ledger <ArrowRight className="w-3 h-3 ml-2" />
            </Link>
          </div>
        </div>

        {/* Dynamic Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {(managedCards.length > 0 ? managedCards : [
            { id: 1, title: 'Enterprise Expansion', description: 'Track deployment status.', href: '/dashboard/member/expansion', icon: 'Building2', color: 'blue' },
            { id: 2, title: 'Market Briefings', description: 'Read strategic forecasts.', href: '/news', icon: 'FileText', color: 'emerald' },
            { id: 3, title: 'Secure Concierge', description: 'Direct board link.', href: '/dashboard/member/concierge', icon: 'Globe2', color: 'purple' },
            { id: 4, title: 'Business Registry', description: 'Manage profiles.', href: '/dashboard/member/registry', icon: 'ShieldCheck', color: 'amber' }
          ]).map((card) => (
            <Link 
              key={card.id} 
              href={card.href} 
              className={`bg-zinc-900 border border-zinc-800 p-6 rounded-md group hover:border-${card.color}-500 transition-all flex flex-col justify-between`}
            >
              <div>
                {getIcon(card.icon)}
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{card.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>
              <div className={`flex items-center text-xs font-bold text-${card.color}-400 uppercase tracking-widest border-t border-zinc-800 pt-4`}>
                Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Impact Fund Applications Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">Active Applications</h2>
              <Link href="/diaspora-impact-fund/apply" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                New Application
              </Link>
            </div>

            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-zinc-700 transition-all">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{app.reference_number}</div>
                      <div className="text-md font-bold text-white">{app.project_title}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest text-center ${
                      app.status === 'submitted' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                      app.status === 'under_review' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                      app.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      'bg-zinc-800 border-zinc-700 text-zinc-500'
                    }`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-500">No active applications found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Intelligence Vault (Saved Insights) */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">Intelligence Vault</h2>
              <Link href="/africa-intelligence" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest">
                Browse Markets
              </Link>
            </div>

            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <div key={insight.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-lg flex items-center justify-between group hover:bg-zinc-900 transition-all">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{insight.country_iso3}</div>
                      <div className="text-md font-bold text-white mb-2">{insight.country_name}</div>
                      <p className="text-xs text-zinc-500 line-clamp-1 italic">{insight.note || "Strategic briefing bookmarked."}</p>
                    </div>
                    <Link href={`/africa-intelligence?iso3=${insight.country_iso3}`} className="p-2 bg-zinc-800 rounded-md text-zinc-400 group-hover:text-purple-400 group-hover:bg-purple-900/20 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-500">No saved market briefings.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex items-start md:items-center text-xs text-zinc-500 font-medium">
          <ShieldCheck className="w-4 h-4 mr-2 text-zinc-600 shrink-0" />
          <p>This portal is actively monitored. All accessed intelligence and telemetry conform to established non-disclosure protocols (NDP-2026).</p>
        </div>
      </main>
    </div>
  );
}
