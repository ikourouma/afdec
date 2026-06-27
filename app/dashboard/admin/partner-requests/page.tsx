import React from "react";
import { Users, Clock } from "lucide-react";

export default function PartnerRequestsStubPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Partner Requests</h1>
        <p className="text-zinc-400">Review and verify incoming institutional and enterprise membership applications.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-blue-500" />
        </div>
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full mb-6">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">In Development — Q3 2026</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Partner Onboarding Matrix</h2>
        <p className="text-zinc-400 max-w-lg mb-8">
          The automated KYC and due diligence integration for incoming partner requests is currently being finalized.
        </p>

        <div className="text-left bg-zinc-950 border border-zinc-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Planned Features</h3>
          <ul className="space-y-3">
            {[
              "Automated compliance and sanctions screening",
              "1-click approval to Member Portal access",
              "Application routing based on sector focus",
              "Historical record of rejected applicants"
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
