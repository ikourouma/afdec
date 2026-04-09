"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Calendar, MapPin, ArrowRight, Video, Target, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

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
    gsap.fromTo(".event-card",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: eventGridRef.current, start: "top 85%" }
      }
    );
  }, { scope: undefined });

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      <Breadcrumb />

      <main>
        {/* Cinematic Multi-Layer Hero (matching /why-nc) */}
        <section className="relative bg-zinc-950 border-b border-zinc-800/50 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/88 to-zinc-950/25" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-32 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8" ref={headerRef}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-full backdrop-blur-md">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Sovereign Engagements</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
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
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </section>

        {/* Global Events Space */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row gap-12" ref={eventGridRef}>
          
          {/* Main List */}
          <div className="lg:w-2/3 space-y-12">
            {mockEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="event-card group block bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Event Hero */}
                  <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="inline-flex items-center px-3 py-1 bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white rounded-sm">
                        {event.type.includes('Virtual') ? <Video className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Globe2 className="w-3.5 h-3.5 mr-1.5 text-blue-400" />}
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Event Data */}
                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm font-bold text-zinc-500 mb-5">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-zinc-600" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-zinc-600" />
                        {event.location}
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                      {event.title}
                    </h2>

                    <p className="text-zinc-400 font-medium leading-relaxed mb-8">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between">
                      <span className="flex items-center text-sm font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                        Secure Early Registration <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Support Rail */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              <div className="bg-zinc-900 p-8 rounded-lg text-zinc-400 border border-zinc-800">
                <h3 className="text-white font-extrabold text-xl tracking-tight mb-3">Institutional Partnerships</h3>
                <p className="text-sm font-medium leading-relaxed mb-6">Strategic partners with an active Mega-Site project may request closed-door operational sessions during these summits.</p>
                <Link href="/contact" className="inline-flex w-full items-center justify-center p-3.5 bg-blue-600 text-white font-bold text-sm rounded-sm hover:bg-blue-700 transition-colors shadow-sm uppercase tracking-widest">
                  Partner With Us <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-lg space-y-8">
                <div className="space-y-4">
                  <h3 className="text-white font-extrabold text-lg tracking-tight">Advertise With Us</h3>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Showcase your industrial capabilities to a curated audience of sovereign leaders and Fortune 500 decision makers.
                  </p>
                  <Link href="/contact" className="text-blue-500 text-sm font-bold hover:text-blue-400 transition-colors">Download Media Kit →</Link>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="space-y-4">
                  <h3 className="text-white font-extrabold text-lg tracking-tight">Become a Sponsor</h3>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Align your brand with the bi-national mandate. Strategic sponsorship opportunities available for 2026 Summits.
                  </p>
                  <Link href="/invest" className="text-blue-500 text-sm font-bold hover:text-blue-400 transition-colors">Sponsorship Inquiry →</Link>
                </div>
              </div>

              <div className="border border-zinc-800 bg-zinc-900/40 p-8 rounded-lg">
                <h3 className="text-white font-extrabold tracking-tight mb-4 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 mr-2" />
                  Security Protocol
                </h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">
                  Attendance for In-Person Summits requires Tier-1 compliance verification. Credentials must be submitted 45 days prior.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
