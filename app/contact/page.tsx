"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Building2, User, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactGatewayPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    try {
      // Secure route to consolidated lead_intakes table
      const { error } = await supabase.from('lead_intakes').insert({
        source: 'contact_form',
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        organization: formData.get('organization'),
        industry: formData.get('topic'), // Mapping topic to industry column for tracking
        raw_data: {
            phone: formData.get('phone'),
            message: formData.get('message')
        }
      });

      if (error) throw error;
      setSuccess(true);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Transmission failed. Secure connection lost.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-blue-500/30 selection:text-white">
      
      {/* LEFT: Sovereign Branding Block */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#001428] flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#001428] via-transparent to-[#001428]/80"></div>
        
        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terminate & Return
          </Link>
          <div className="mt-16">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-sm flex items-center justify-center">
                <span className="text-blue-500 font-bold text-lg">AfDEC</span>
              </div>
              <div>
                <p className="text-white font-bold tracking-widest uppercase text-xs">African Diaspora Economic Council</p>
                <p className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest">North Carolina</p>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Sovereign <br /> Communications.
            </h1>
            <p className="mt-6 text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
              The African Diaspora Economic Council (AfDEC) is an institutional organization representing the unified interests of diaspora enterprises and transatlantic trade before government agencies and global markets. Submit your institutional inquiries directly to the Executive Board. All corporate transmissions are mapped firmly through Tier-1 encrypted protocols.
            </p>
          </div>
        </div>

        <div className="relative z-10 p-12 border-t border-zinc-900/50">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Encrypted transmission pipeline Active</span>
          </div>
          <p className="text-zinc-600 text-xs leading-relaxed max-w-sm font-medium">
            AfDEC monitors all communications via automated operational telemetry. Expect a response mapping within 24-48 global hours depending on security clearance.
          </p>
        </div>
      </div>

      {/* RIGHT: Transmission Input Block */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-24 relative bg-zinc-950">
        
        {/* Mobile-only back button */}
        <Link href="/" className="lg:hidden absolute top-8 left-8 inline-flex items-center text-xs font-bold text-blue-500 uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Gateway
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Direct Outreach</h2>
            <p className="text-sm font-medium text-zinc-400">Establish contact with the Central Authority.</p>
          </div>

          {success ? (
            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-sm p-8 text-center animate-fade-in relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
               <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Transmission Secured</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-6">Your institutional query has been logged securely under priority routing. The Board will review your credentials shortly.</p>
               <button 
                 onClick={() => setSuccess(false)}
                 className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
               >
                 Submit Follow-up Transmission
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-sm flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-red-200">{errorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input name="first_name" required type="text" className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 pl-10 pr-4 text-white text-sm transition-colors outline-none" placeholder="First" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input name="last_name" required type="text" className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 px-4 text-white text-sm transition-colors outline-none" placeholder="Last" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input name="email" required type="email" className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 pl-10 pr-4 text-white text-sm transition-colors outline-none" placeholder="corp@domain.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Direct Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input name="phone" required type="tel" className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 pl-10 pr-4 text-white text-sm transition-colors outline-none" placeholder="+1..." />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Organization / Entity</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input name="organization" required type="text" className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 pl-10 pr-4 text-white text-sm transition-colors outline-none" placeholder="Entity Name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Transmission Topic</label>
                <select name="topic" required className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 px-4 text-white text-sm transition-colors outline-none appearance-none cursor-pointer">
                   <option value="General Inquiry">General Board Inquiry</option>
                   <option value="Sovereign Partnership">Sovereign / Public Sector Partnership</option>
                   <option value="Infrastructure Investment">Mega-Site Infrastructure Investment</option>
                   <option value="Press / Media">Press / Global Media</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Secure Message Payload</label>
                <textarea name="message" required rows={4} className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm py-3 px-4 text-white text-sm transition-colors outline-none resize-none" placeholder="Provide institutional scope..." />
              </div>

              {/* Strict Privacy Compliance Toggle */}
              <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-sm flex items-start space-x-3">
                <div className="flex items-center h-5 mt-0.5 shrink-0">
                  <input required id="privacy_consent" name="privacy_consent" type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-600 focus:ring-2 cursor-pointer" />
                </div>
                <div className="text-[10px] leading-relaxed text-zinc-400">
                  <p className="mb-2">If I am a user outside the US, I understand AfDEC provides its services from the US, where privacy laws may differ from the laws in my jurisdiction. I consent to transfer my information to the US and to AfDEC's processing my information in accordance with the Privacy Policy.</p>
                  <label htmlFor="privacy_consent" className="font-bold text-zinc-300 cursor-pointer hover:text-white">*I consent to AfDEC’s Privacy Policy.</label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase text-sm py-4 rounded-sm transition-all focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              >
                {isSubmitting ? "Encrypting Routing..." : "Execute Secure Transmission"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
