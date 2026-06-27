"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, ShieldCheck, MapPin, Target } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

export default function ImpactProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from("impact_fund_projects")
        .select("*")
        .eq("slug", params.slug)
        .single();
      
      if (!error && data) {
        // Map impact_fund_projects fields to the UI's expected format
        const mappedProject = {
          ...data,
          hero_image_url: data.cover_image_url,
          funding_goal: data.target_amount_usd,
          funding_raised: data.raised_amount_usd,
          full_content: data.full_description,
          location: data.country,
          type: data.category // Use category instead of flagship type
        };
        setProject(mappedProject);
      }
      setLoading(false);
    }
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 font-sans">
        <div className="sticky top-0 z-[100] w-full flex flex-col">
          <TopNav />
          <FlashBanner />
          <Header />
        </div>
        <main className="max-w-4xl mx-auto px-6 py-32 text-center animate-pulse">
          <div className="h-8 bg-zinc-900 w-1/4 mx-auto rounded mb-8"></div>
          <div className="h-16 bg-zinc-900 w-3/4 mx-auto rounded mb-8"></div>
          <div className="h-96 bg-zinc-900 w-full rounded"></div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 font-sans">
        <div className="sticky top-0 z-[100] w-full flex flex-col">
          <TopNav />
          <FlashBanner />
          <Header />
        </div>
        <main className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-black text-white mb-6">Project Not Found</h1>
          <p className="text-zinc-400">The requested intelligence dossier has been restricted or does not exist.</p>
          <Link href="/diaspora-impact-fund/projects" className="inline-block mt-8 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-sm">
            Return to Directory
          </Link>
        </main>
      </div>
    );
  }

  const percentFunded = project.funding_goal > 0 ? Math.min(100, Math.round((project.funding_raised / project.funding_goal) * 100)) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-24">
        <Link href="/diaspora-impact-fund/projects" className="inline-flex items-center text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Impact Directory
        </Link>

        <article>
          <header className="mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-800">
                {project.type === 'flagship_initiative' ? 'Flagship Initiative' : 'Impact Capital Project'}
              </span>
              {project.location && (
                <div className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  {project.location}
                </div>
              )}
              {project.status === 'active' && (
                <div className="flex items-center text-xs font-bold text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-950/30 rounded border border-emerald-900/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Active Deployment
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
              {project.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl border-l-4 border-amber-500 pl-6 mb-12">
              {project.description}
            </p>

            {project.hero_image_url && (
              <div className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden border border-zinc-800 relative mb-16">
                <img src={project.hero_image_url} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Sidebar Data */}
            <div className="md:col-span-1 order-2 md:order-1">
              <div className="sticky top-32 space-y-8">
                
                {/* Funding Progress Block */}
                {project.funding_goal > 0 && (
                  <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-lg shadow-xl">
                    <Target className="w-8 h-8 text-amber-500 mb-6" />
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Capital Target</h4>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-black text-white">${(project.funding_raised / 1000000).toFixed(1)}M</div>
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-1">Raised of ${(project.funding_goal / 1000000).toFixed(1)}M</div>
                    </div>
                    
                    <div className="w-full h-2 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentFunded}%` }} />
                    </div>

                    <Link href="/diaspora-impact-fund/contribute" className="flex items-center justify-center w-full px-4 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-sm font-bold tracking-widest uppercase transition-colors">
                      Contribute to Fund
                    </Link>
                  </div>
                )}

                <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-zinc-500 mb-4" />
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Verified Framework</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-6">This infrastructure project is directly managed and audited by the Secretariat under the AfDEC Sovereign Mandate.</p>
                  <button className="flex items-center justify-center w-full px-4 py-3 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-white rounded text-[10px] font-bold tracking-widest uppercase transition-colors">
                    <Share2 className="w-3.5 h-3.5 mr-2" /> Share Dossier
                  </button>
                </div>

              </div>
            </div>

            {/* Main Project Content */}
            <div className="md:col-span-3 order-1 md:order-2">
              <div className="prose prose-invert prose-zinc max-w-none prose-h2:text-white prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tight prose-a:text-amber-500">
                {project.full_content ? (
                  <ReactMarkdown>{project.full_content}</ReactMarkdown>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6">Strategic Intelligence</h2>
                    <p className="text-zinc-300 leading-relaxed text-lg mb-8">
                      Detailed feasibility reports, spatial zoning schematics, and bi-national tariff models for the {project.title} are currently restricted. Registered partners may request the complete data-room package via the Sovereign Gateway.
                    </p>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-lg mt-8 text-center">
                       <ShieldCheck className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                       <h3 className="text-xl font-bold text-white mb-2">Data Room Locked</h3>
                       <p className="text-zinc-400 mb-6 text-sm max-w-md mx-auto">Full technical documentation is restricted to cleared Sovereign Network institutional members.</p>
                       <Link href="/auth" className="inline-flex items-center justify-center border border-zinc-700 hover:border-zinc-500 text-white px-6 py-3 text-sm font-bold tracking-widest uppercase rounded transition-colors">
                         Login to Member Portal
                       </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
