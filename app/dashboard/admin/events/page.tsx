import React from "react";
import { Calendar, Clock } from "lucide-react";

export default function EventsStubPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Event Engine</h1>
        <p className="text-zinc-400">Manage bilateral summits, trade missions, and virtual networking sessions.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full mb-6">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">In Development — Q3 2026</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Global Events Coordinator</h2>
        <p className="text-zinc-400 max-w-lg mb-8">
          The central scheduling and ticketing infrastructure for AfDEC&apos;s physical and virtual events is currently in development.
        </p>

        <div className="text-left bg-zinc-950 border border-zinc-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Planned Features</h3>
          <ul className="space-y-3">
            {[
              "Creation of multi-day Summit itineraries",
              "RSVP and ticketing management",
              "Virtual event link distribution",
              "Post-event attendance reporting"
            ].map((feature, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span className="text-sm text-zinc-400">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
