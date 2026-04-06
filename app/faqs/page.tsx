"use client";

import React, { useState, useRef } from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Plus, Minus, Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const faqs = [
  {
    category: "Sovereign Logistics",
    q: "How does AfDEC integrate with the North Carolina deep-water pipeline?",
    a: "We established direct data corridors linking Raleigh's industrial logistics output to key West African port terminals. AfDEC functions to expedite clearing protocols and align corporate cargo vectors natively into African macro-development plans."
  },
  {
    category: "Deal Rooms",
    q: "What security clearance is required to view active capital projects?",
    a: "Active deal rooms are locked under Tier-2 'Admin' or Tier-1 'Super Admin' verification schemas. Enterprises must submit a formal application via our Communication Gateway. Once validated, your profile is granted encrypted terminal access."
  },
  {
    category: "Capital Tranches",
    q: "Are the investment portfolios syndicated or direct injections?",
    a: "AfDEC prioritizes direct sovereign capital injections into vetted infrastructure. We bypass bloated syndications whenever possible to ensure our North Carolina corporate partners secure dominant equity and highly expedited ROI."
  },
  {
    category: "Global Compliance",
    q: "Does the platform adhere to African Union Data Governance frameworks?",
    a: "Absolutely. Our architecture utilizes regionalized telemetry nodes, ensuring absolute compliance with both US federal intelligence standards and African Union digital privacy protocols. Your IP remains physically siloed."
  },
  {
    category: "Agritech Investments",
    q: "How are yields physically verified across the agricultural belt?",
    a: "We utilize multi-spectral drone telemetry and localized IoT sensors feeding directly back to our Central Command Dashboard. This guarantees board members in NC receive live, immutable yield projections."
  }
];

export default function FAQHubPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-zinc-300 selection:bg-blue-500/30 selection:text-white flex flex-col">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <Header />
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-24">
        
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Execution Directives.</h1>
          <p className="text-lg text-zinc-400 max-w-lg mx-auto font-medium">
            Search our centralized repository of operational mechanics and institutional clearance guidelines.
          </p>
          
          <div className="mt-10 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query the database..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full py-4 pl-12 pr-6 text-white text-sm transition-colors outline-none"
            />
          </div>
        </div>

        <div className="space-y-4" ref={listRef}>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 p-8 border border-dashed border-zinc-800 rounded-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Zero Query Matches Found in the Data Lake.</span>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`border transition-colors duration-300 ${isOpen ? 'bg-zinc-900 border-zinc-700 shadow-[0_0_30px_rgba(37,99,235,0.05)]' : 'bg-transparent border-zinc-800 hover:border-zinc-700'}`}
                >
                  <button 
                    onClick={() => toggleOpen(idx)}
                    className="w-full text-left px-6 py-6 flex items-start justify-between focus:outline-none"
                  >
                    <div className="pr-8">
                       <span className="block text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-2">{faq.category}</span>
                       <h3 className={`text-lg font-bold tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-zinc-300'}`}>
                         {faq.q}
                       </h3>
                    </div>
                    <div className={`mt-1 w-6 h-6 flex shrink-0 items-center justify-center rounded-full border transition-all ${isOpen ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-zinc-700 text-zinc-500'}`}>
                      {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                  </button>
                  
                  <div 
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? '500px' : '0', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="px-6 pb-8 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 mt-2 pt-6 font-medium">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <Footer />
    </main>
  );
}
