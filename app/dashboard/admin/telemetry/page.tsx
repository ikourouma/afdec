"use client";

import React, { useState, useEffect } from "react";
import { Activity, Star, Filter, ArrowUpRight, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TelemetryAdminPage() {
  const [sentiments, setSentiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    async function fetchTelemetry() {
      const { data } = await supabase.from('market_sentiments').select('*').order('created_at', { ascending: false });
      if (data) {
        setSentiments(data);
        if (data.length > 0) {
          const total = data.reduce((acc, curr) => acc + curr.sentiment_score, 0);
          setAvgScore(Number((total / data.length).toFixed(1)));
        }
      }
      setIsLoading(false);
    }
    fetchTelemetry();
  }, []);

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Market Pulse.</h1>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-blue-200">Live Telemetry</div>
          </div>
          <p className="text-sm text-zinc-500 font-medium">Monitoring real-time enterprise sentiment and platform operational efficiency.</p>
        </div>
      </div>

      {/* Aggregate Score Card */}
      <div className="bg-zinc-900 rounded-md p-8 shadow-2xl relative overflow-hidden mb-8 border border-zinc-800">
         <div className="absolute top-0 right-0 p-8 opacity-10">
           <Activity className="w-32 h-32 text-blue-500" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
           <div>
             <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Global Satisfaction Matrix</h3>
             <div className="flex items-end space-x-4">
               <span className="text-6xl font-black text-white">{avgScore || "0.0"}</span>
               <span className="text-xl text-zinc-500 mb-2 font-medium">/ 5.0</span>
             </div>
           </div>
           <div className="mt-6 md:mt-0 flex space-x-1">
             {[1,2,3,4,5].map((s) => (
               <Star key={s} className={`w-8 h-8 ${Math.round(avgScore) >= s ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
             ))}
           </div>
         </div>
      </div>

      {/* Verbatim Feedback Deck */}
      <div className="bg-white border border-zinc-200 rounded-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50 rounded-t-md">
          <h2 className="text-sm font-bold text-zinc-800 flex items-center tracking-wide uppercase">
            <ShieldAlert className="w-4 h-4 mr-2 text-zinc-400" />
            Direct Intelligence Feed
          </h2>
          <button className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-colors rounded-sm hidden sm:block">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 animate-pulse">Decrypting node streams...</span>
          </div>
        ) : sentiments.length === 0 ? (
           <div className="p-12 pl-14 text-zinc-500 font-medium text-sm border-l-4 border-amber-500 m-8 bg-amber-50 rounded-r-md">
             Awaiting initial market telemetry mapping. No data currently traversing the pipeline.
           </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {sentiments.map((item) => (
              <div key={item.id} className="p-6 md:p-8 hover:bg-blue-50/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${item.sentiment_score >= s ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-200 px-2 py-1 rounded-sm bg-zinc-50">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm">
                  <p className="text-sm text-zinc-700 leading-relaxed font-medium">"{item.improvement_feedback}"</p>
                </div>
                <div className="mt-4 flex items-center text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  <span>Routing Context:</span>
                  <span className="ml-2 text-blue-500 group-hover:text-blue-600 transition-colors">{item.page_context}</span>
                  <ArrowUpRight className="w-3 h-3 ml-1 text-zinc-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
