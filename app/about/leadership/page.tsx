"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SideNav, type NavSection } from "@/components/ui/side-nav";
import { supabase } from "@/lib/supabase";
import { 
  Shield, 
  Users, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  UserCheck, 
  Award, 
  Landmark,
  ChevronRight,
  Target,
  FileText,
  Zap,
  Building2,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS: NavSection[] = [
  { id: "council", label: "Sovereign Council" },
  { id: "executive", label: "Executive Mandate" },
  { id: "advisor", label: "Board of Advisors" },
  { id: "governance", label: "Governance Structure" },
];

type Tier = 'council' | 'executive' | 'advisor' | 'governance';

export default function LeadershipHubPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [activeTier, setActiveTier] = useState<Tier>('council');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['council', 'executive', 'advisor', 'governance'].includes(hash)) {
        setActiveTier(hash as Tier);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    async function fetchBoard() {
      try {
        const { data, error } = await supabase
          .from("board_members")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        
        if (!error && data) setMembers(data);
      } catch (err) {
        console.error("Board fetch failure:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBoard();
  }, []);

  const filteredMembers = members.filter(m => (m.role_tier || 'council') === activeTier);

  const tierStyles = {
    council: { 
      accent: "text-blue-500", 
      bg: "bg-blue-600", 
      border: "border-blue-500/30", 
      gradient: "from-blue-600 to-blue-900",
      label: "Sovereign Council" 
    },
    executive: { 
      accent: "text-amber-500", 
      bg: "bg-amber-600", 
      border: "border-amber-500/30", 
      gradient: "from-amber-500 to-amber-900",
      label: "Executive Mandate" 
    },
    advisor: { 
      accent: "text-emerald-500", 
      bg: "bg-emerald-600", 
      border: "border-emerald-500/30", 
      gradient: "from-emerald-600 to-emerald-900",
      label: "Board of Advisors" 
    },
    governance: {
      accent: "text-zinc-400",
      bg: "bg-zinc-800",
      border: "border-zinc-700",
      gradient: "from-zinc-800 to-zinc-950",
      label: "Framework"
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>
      <Breadcrumb />
      
      {/* ── Cinematic Identity Header ── */}
      <section id="section-council" className="relative pt-32 pb-16 border-b border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.1)_0,transparent_50%)]" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 mb-8 rounded-full">
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Institutional Identity Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.95] mb-8 text-glow-blue">
              Leadership &<br />Governance.
            </h1>
            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl">
              The Sovereign Council provides the vision, the Executive Mandate drives the operations, and the Advisors provide the strategic counsel for transatlantic trade.
            </p>
          </div>
        </div>
      </section>

      {/* ── Goldman-Style Trinity Navigation ── */}
      <section className="sticky top-[144px] z-50 bg-zinc-950 border-b border-zinc-900 backdrop-blur-md">
         <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex flex-wrap items-center gap-8 -mb-px">
               {(['council', 'executive', 'advisor', 'governance'] as Tier[]).map((tier) => (
                 <button
                   key={tier}
                   onClick={() => setActiveTier(tier)}
                   className={`py-6 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTier === tier ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   {tierStyles[tier].label}
                   {activeTier === tier && (
                     <motion.div 
                        layoutId="activeTab" 
                        className={`absolute bottom-0 left-0 right-0 h-1 ${tierStyles[tier].bg}`} 
                     />
                   )}
                 </button>
               ))}
            </div>
         </div>
      </section>

      {/* ── Dynamic Tier Content ── */}
      <section className="py-24 min-h-[600px]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          
          <AnimatePresence mode="wait">
            {activeTier === 'governance' ? (
              <motion.div 
                key="governance"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-24"
              >
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                       <h2 className="text-4xl font-black text-white mb-6">Institutional Framework</h2>
                       <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                          AfDEC operates under a robust 501(c)(4) social welfare framework, ensuring that our economic development mandates are protected and aligned with long-term bilateral prosperity.
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                          {[
                            { icon: Landmark, label: "501(c)(4) Status", detail: "Social Welfare Mandate" },
                            { icon: Shield, label: "Fiduciary Trust", detail: "Sovereign Audit Trail" },
                            { icon: Target, label: "Bilateral Impact", detail: "Africa-US Integration" },
                            { icon: Zap, label: "Operational Agility", detail: "Management Mandate" }
                          ].map(item => (
                            <div key={item.label} className="p-4 border border-zinc-900 bg-zinc-900/20 rounded-sm">
                               <item.icon className="w-5 h-5 text-blue-500 mb-2" />
                               <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{item.label}</div>
                               <div className="text-[10px] text-zinc-500 font-bold mt-1">{item.detail}</div>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="p-12 bg-white/5 border border-white/10 rounded-sm">
                       {/* Visual Placeholder for Organogram */}
                       <div className="space-y-6">
                          <div className="w-full h-12 border border-blue-500/50 flex items-center justify-center text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] bg-blue-500/5">Sovereign Council (Board)</div>
                          <div className="flex justify-center h-12"><div className="w-px h-full bg-zinc-800"></div></div>
                          <div className="grid grid-cols-3 gap-6">
                             <div className="h-12 border border-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500 uppercase tracking-widest">Audit</div>
                             <div className="h-12 border border-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500 uppercase tracking-widest">Governance</div>
                             <div className="h-12 border border-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500 uppercase tracking-widest">Programs</div>
                          </div>
                          <div className="flex justify-center h-12"><div className="w-px h-full bg-zinc-800"></div></div>
                          <div className="w-full h-12 border border-amber-500/50 flex items-center justify-center text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] bg-amber-500/5">Executive Secretariat</div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTier}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-16"
              >
                {/* ── Recycled Card Grid (Goldman Structure) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {isLoading ? (
                     <div className="col-span-full py-20 text-center text-zinc-600 font-bold uppercase tracking-[0.5em] animate-pulse">Synchronizing Data...</div>
                   ) : filteredMembers.length === 0 ? (
                     <div className="col-span-full py-20 text-center text-zinc-700 italic">No appointments confirmed for this Mandate Tier.</div>
                   ) : (
                     filteredMembers.map((member) => (
                       <div 
                         key={member.id}
                         onClick={() => setSelectedMember(member)}
                         className={`group bg-zinc-900/30 border ${tierStyles[activeTier].border} p-8 rounded-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[320px] shadow-sm hover:shadow-xl hover:bg-zinc-900/50`}
                       >
                         <div>
                            <div className={`w-14 h-14 rounded-sm bg-gradient-to-br ${tierStyles[activeTier].gradient} flex items-center justify-center text-white font-black text-xl mb-6 shadow-inner`}>
                               {member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{member.name}</h3>
                            <p className={`${tierStyles[activeTier].accent} text-[11px] font-black uppercase tracking-[0.2em] mb-2`}>{member.title}</p>
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{member.sub_title || ""}</p>
                         </div>
                         
                         <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                            <div className="flex space-x-3 text-zinc-700">
                               <ExternalLink className="w-4 h-4 hover:text-blue-400 transition-colors" />
                               <Mail className="w-4 h-4 hover:text-white transition-colors" />
                            </div>
                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400">View Bio →</span>
                         </div>
                       </div>
                     ))
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ── Member Profile Drawer (Impact Profile) ── */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedMember(null)}
               className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-[200]" 
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 z-[210] overflow-y-auto"
            >
               <div className="p-12">
                  <button 
                     onClick={() => setSelectedMember(null)}
                     className="text-zinc-600 hover:text-white mb-12 flex items-center text-xs font-black uppercase tracking-widest"
                  >
                     <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Exit Profile
                  </button>

                  <div className="flex items-start justify-between mb-16">
                     <div>
                        <h2 className="text-4xl font-black text-white mb-2 leading-tight">{selectedMember.name}</h2>
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm ${tierStyles[selectedMember.role_tier as Tier || 'council'].bg} text-white`}>
                              {tierStyles[selectedMember.role_tier as Tier || 'council'].label}
                           </span>
                           <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">· {selectedMember.title}</span>
                        </div>
                     </div>
                     <div className="flex space-x-3">
                        <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-white flex items-center justify-center rounded-sm hover:border-blue-500 transition-colors shadow-lg">
                           <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-white flex items-center justify-center rounded-sm hover:border-emerald-500 transition-colors shadow-lg">
                           <Mail className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-loose prose-p:text-zinc-400 prose-p:text-lg">
                     <div className="flex items-center gap-3 mb-8">
                        <Award className="w-5 h-5 text-blue-500" />
                        <h3 className="text-white text-xl font-black uppercase tracking-[0.2em] m-0">Impact Statement</h3>
                     </div>
                     <div className="italic border-l-2 border-blue-500 pl-8 mb-12 py-1">
                        {selectedMember.bio}
                     </div>
                     
                     <div className="flex items-center gap-3 mb-8">
                        <Landmark className="w-5 h-5 text-zinc-500" />
                        <h4 className="text-zinc-400 text-sm font-black uppercase tracking-[0.3em] m-0">Institutional Mandates</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {selectedMember.committees?.map((c: string) => (
                           <span key={c} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest rounded-sm">{c}</span>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
