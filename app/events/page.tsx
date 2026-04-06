"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Calendar, MapPin, ArrowRight, Video, Target, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";

const mockEvents = [
  {
    id: 1,
    title: "The Africa Innovation & Trade Summit",
    date: "December 12-14, 2026",
    location: "Raleigh Convention Center, NC",
    type: "In-Person Executive Summit",
    description: "The premier bilateral convergence of Fortune 500 executives and African sovereign leaders. Features exclusive closed-door deal rooms and physical infrastructure procurement sessions.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Quarterly Diaspora Integrations Briefing",
    date: "January 08, 2027",
    location: "Global Broadcast (Secure Link)",
    type: "Virtual Telemetry Stream",
    description: "Live economic briefing from the Board of Directors detailing Q1 infrastructure forecasts and the latest regulatory shifts in the West African tech corridor.",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function GlobalEventsPage() {
  const headerRef = useRef(null);
  const eventGridRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, { y: 30, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".event-card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: eventGridRef.current, start: "top 80%" }
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-50 shadow-sm">
        <TopNav />
        <Header />
      </div>

      <main>
        {/* Dynamic Dark Sovereign Header */}
        <div className="bg-zinc-950 pt-24 pb-32 px-6 lg:px-12 border-b border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#002f6c] bg-opacity-[0.03] pattern-grid-lg"></div>
          
          <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8" ref={headerRef}>
             <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm mb-6">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Sovereign Engagements</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                Summits & Direct Briefings
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
                Gain direct access to bilateral procurement sessions, high-level policy broadcasts, and elite physical symposiums hosted by the Council.
              </p>
            </div>
            
            {/* Year Filter */}
            <div className="flex space-x-2">
               <button className="px-6 py-3 bg-blue-600 font-bold text-sm text-white rounded-sm hover:bg-blue-700 transition-colors shadow-lg">2026 Season</button>
               <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 font-bold text-sm text-zinc-400 rounded-sm hover:text-white transition-colors">2027 Pipeline</button>
            </div>
          </div>
        </div>

        {/* Global Events Space */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12" ref={eventGridRef}>
          
          {/* Main List */}
          <div className="lg:w-2/3 space-y-12">
            
            {mockEvents.map((event) => (
              <div key={event.id} className="event-card group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
                
                {/* Event Hero */}
                <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden shrink-0">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className={`inline-flex items-center px-3 py-1 bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white rounded-sm`}>
                       {event.type.includes('Virtual') ? <Video className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Globe2 className="w-3.5 h-3.5 mr-1.5 text-blue-400" />}
                       {event.type}
                    </span>
                  </div>
                </div>

                {/* Event Data */}
                <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                   <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm font-bold text-zinc-500 mb-5">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                        {event.location}
                      </div>
                   </div>

                   <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight mb-4 group-hover:text-blue-700 transition-colors leading-tight">
                     {event.title}
                   </h2>

                   <p className="text-zinc-600 font-medium leading-relaxed mb-8">
                     {event.description}
                   </p>

                   <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                     <button className="flex items-center text-sm font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                       Secure Early Registration <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                </div>
              </div>
            ))}
            
          </div>

          {/* Right Support Rail */}
          <div className="lg:w-1/3">
             <div className="sticky top-32 space-y-8">
                {/* Board Inquiry */}
                <div className="bg-zinc-950 p-8 rounded-lg text-zinc-400">
                  <h3 className="text-white font-extrabold text-xl tracking-tight mb-3">Host a Bilateral Session</h3>
                  <p className="text-sm font-medium leading-relaxed mb-6">Strategic partners with an active Mega-Site project may request closed-door operational sessions during these summits.</p>
                  <Link href="/auth" className="inline-flex w-full items-center justify-center p-3.5 bg-blue-600 text-white font-bold text-sm rounded-sm hover:bg-blue-700 transition-colors shadow-sm uppercase tracking-widest">
                    Request Integration <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
                
                 {/* Security Reminders */}
                <div className="border border-zinc-200 bg-white p-8 rounded-lg">
                  <h3 className="text-zinc-900 font-extrabold tracking-tight mb-4 flex items-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" />
                    Security Protocol
                  </h3>
                  <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                    Attendance for In-Person Executive Summits requires rigorous Tier-1 compliance verification. Partner organizations must submit their corporate credentials 45 days prior to the engagement date.
                  </p>
                </div>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
