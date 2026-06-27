"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

type NewsBriefing = {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  valid_from: string;
};

export function NewsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [newsItems, setNewsItems] = useState<NewsBriefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news_briefings')
          .select('id, title, excerpt, image_url, category, valid_from')
          .eq('status', 'published')
          .order('valid_from', { ascending: false })
          .limit(3);

        if (error) throw error;
        setNewsItems(data || []);
      } catch (err) {
        console.error("Failed to load news briefings", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  useGSAP(() => {
    if (isLoading || newsItems.length === 0) return;
    
    gsap.fromTo(
      ".news-card",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );
  }, [isLoading, newsItems.length]); // Re-run when data loads

  return (
    <section ref={containerRef} className="py-24 bg-zinc-950 border-b border-zinc-900 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-2 block">News & Media</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Global Market Briefings</h2>
          </div>
          <Link href="/news" className="hidden md:flex items-center text-sm font-bold text-zinc-300 hover:text-white group">
            <span className="pb-1 border-b border-zinc-700 group-hover:border-blue-500 transition-colors">View All Press Releases</span>
            <ArrowRight className="w-4 h-4 ml-2 text-zinc-500 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Syncing Intelligence DB...</span>
            </div>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-24 border border-zinc-800 border-dashed rounded-lg bg-zinc-900/30">
            <h3 className="text-2xl font-bold text-white mb-4">Market Briefings Coming Soon</h3>
            <p className="text-zinc-400 font-medium max-w-md mx-auto mb-8">
              The Board of Directors is currently compiling the next intelligence cycle. Be the first to receive embargoed macro intelligence and infrastructure deployment briefs when they are released.
            </p>
            <Link href="/contact?topic=newsletter" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg group">
              Register for Notifications
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => {
              // Parse date
              const dateObj = new Date(item.valid_from);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

              return (
                <Link 
                  href={`/news/${item.id}`}
                  key={item.id} 
                  className="news-card group flex flex-col h-full cursor-pointer opacity-0"
                >
                  {/* Image Container with Hover Zoom */}
                  <div className="relative h-48 md:h-64 w-full overflow-hidden bg-zinc-900 mb-6">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${item.image_url || 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800&auto=format&fit=crop'}')`, filter: 'brightness(0.7)' }}
                    />
                    {/* Content type label */}
                    <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-sm text-xs font-bold text-zinc-200 px-3 py-1 uppercase tracking-wider">
                      {item.category || "Press Release"}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold text-blue-500 mb-3 tracking-widest">{formattedDate}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug group-hover:text-blue-400 transition-colors line-clamp-3">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed mb-6 flex-1 line-clamp-4 text-sm md:text-base">
                      {item.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                      Read Full Briefing
                      <ArrowRight className="w-4 h-4 ml-2 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile View All button */}
        <div className="md:hidden mt-10 text-center">
          <Link href="/news" className="inline-flex items-center text-sm font-bold text-white px-6 py-3 border border-zinc-700 bg-zinc-900 w-full justify-center">
            View All Press Releases
          </Link>
        </div>
      </div>
    </section>
  );
}
