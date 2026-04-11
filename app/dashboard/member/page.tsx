"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Building2, Globe2, FileText, ArrowRight, Menu, X, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MemberDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ first_name?: string; last_name?: string; organization?: string; email?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    async function loadSession() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, organization')
        .eq('id', session.user.id)
        .single();
        
      setProfile({
        ...profileData,
        email: session.user.email
      });

      // Fetch applications
      const { data: apps } = await supabase
        .from('fund_applications')
        .select('id, reference_number, status, project_title, submitted_at')
        .eq('applicant_user_id', session.user.id)
        .order('submitted_at', { ascending: false });
      
      setApplications(apps || []);
      setIsLoading(false);
    }
    loadSession();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Authenticating Terminal...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 font-sans">
      
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

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-900 bg-zinc-950 px-6 py-6 space-y-6 animate-fade-in absolute w-full z-40 shadow-2xl">
           <div className="flex flex-col space-y-1">
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Identity</span>
             <span className="text-sm font-bold text-zinc-100">{profile?.first_name} {profile?.last_name}</span>
             <span className="text-xs text-zinc-500">{profile?.email}</span>
           </div>
           <hr className="border-zinc-900" />
           <button 
            onClick={handleSignOut}
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest w-full text-left"
          >
            Terminate Session
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <main className="max-w-[1200px] mx-auto p-6 md:p-12 lg:px-12 lg:py-20">
        <div className="mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Welcome back, {profile?.first_name || 'Partner'}.
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-medium max-w-2xl leading-relaxed">
            You are securely connected to the African Diaspora Economic Council partner portal. Access your deployment pipelines, strategic infrastructure RFPs, and sovereign intelligence.
          </p>
        </div>

        {/* Responsive Grid of Link Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <Link href="/dashboard/member/expansion" className="bg-zinc-900 border border-zinc-800 p-6 rounded-md group hover:border-blue-500 transition-all flex flex-col justify-between">
            <div>
              <Building2 className="w-8 h-8 text-blue-500 mb-6" />
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Enterprise Expansion</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Track the status of your organization's deployment applications and physical infrastructure requests.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-400 uppercase tracking-widest border-t border-zinc-800 pt-4">
              Access Pipeline <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/news" className="bg-zinc-900 border border-zinc-800 p-6 rounded-md group hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div>
              <FileText className="w-8 h-8 text-emerald-500 mb-6" />
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">AfDEC Market Briefings</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Read strategic market analyses, policy changes, and Q4 infrastructure forecasts drafted by the Board.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-400 uppercase tracking-widest border-t border-zinc-800 pt-4">
              View Intelligence <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/dashboard/member/concierge" className="bg-zinc-900 border border-zinc-800 p-6 rounded-md group hover:border-purple-500 transition-all flex flex-col justify-between">
            <div>
              <Globe2 className="w-8 h-8 text-purple-500 mb-6" />
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">AfDEC Secure Concierge</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Direct encrypted communication link. Submit strategic inquiries, compliance files, or schedule advisory sessions with the Board.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-400 uppercase tracking-widest border-t border-zinc-800 pt-4">
              Open Comm-Link <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/dashboard/member/registry" className="bg-zinc-900 border border-zinc-800 p-6 rounded-md group hover:border-amber-500 transition-all flex flex-col justify-between">
            <div>
              <ShieldCheck className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Business Registry</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Manage your registered sovereign entity status, compliance documents, and institutional profiles.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-400 uppercase tracking-widest border-t border-zinc-800 pt-4">
              Access Vault <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* Impact Fund Applications Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">Impact Fund Applications</h2>
            <Link href="/diaspora-impact-fund/apply" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
              New Application
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-all">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Reference No.</div>
                    <div className="text-lg font-black text-white">{app.reference_number}</div>
                    <p className="text-sm text-zinc-500">{app.project_title}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Status</div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${
                        app.status === 'submitted' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                        app.status === 'under_review' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                        app.status === 'shortlisted' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                        app.status === 'approved' || app.status === 'funded' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Submitted</div>
                      <div className="text-xs font-bold text-zinc-300">{new Date(app.submitted_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-500 mb-4">No active grant applications found.</p>
                <Link href="/diaspora-impact-fund/apply" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">
                  Submit SME Grant Proposal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-zinc-900 flex items-start md:items-center text-xs text-zinc-500 font-medium">
          <ShieldCheck className="w-4 h-4 mr-2 text-zinc-600 shrink-0 mt-0.5 md:mt-0" />
          <p>This portal is actively monitored. All accessed intelligence and telemetry conform to established non-disclosure protocols.</p>
        </div>
      </main>
    </div>
  );
}
