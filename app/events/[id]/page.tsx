"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, Info, ShieldCheck, CheckCircle } from "lucide-react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { supabase } from "@/lib/supabase";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    title: ""
  });

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (!error && data) {
        setEvent(data);
      }
      setLoading(false);
    }
    fetchEvent();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay or push to supabase event_registrations
    const { error } = await supabase
      .from("event_registrations")
      .insert([
        {
          event_id: params.id,
          form_data: formData,
          status: "registered"
        }
      ]);

    setIsSubmitting(false);
    if (!error) {
      setIsSuccess(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>

      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
        <Link href="/events" className="inline-flex items-center text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Summits & Briefings
        </Link>

        {loading ? (
          <div className="max-w-3xl mx-auto text-center py-20 animate-pulse">
            <div className="w-20 h-20 bg-zinc-900 rounded-lg mx-auto mb-8"></div>
            <div className="h-12 bg-zinc-900 w-3/4 mx-auto rounded mb-6"></div>
            <div className="h-6 bg-zinc-900 w-1/2 mx-auto rounded"></div>
          </div>
        ) : event ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">
                  <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                  Admin Managed Template
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center text-zinc-300 text-sm font-medium bg-zinc-900/50 px-4 py-2 rounded-sm border border-zinc-800">
                    <Calendar className="w-4 h-4 text-blue-500 mr-3" />
                    {new Date(event.event_date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-zinc-300 text-sm font-medium bg-zinc-900/50 px-4 py-2 rounded-sm border border-zinc-800">
                    <MapPin className="w-4 h-4 text-blue-500 mr-3" />
                    {event.location}
                  </div>
                  {event.capacity && (
                    <div className="flex items-center text-zinc-300 text-sm font-medium bg-zinc-900/50 px-4 py-2 rounded-sm border border-zinc-800">
                      <Users className="w-4 h-4 text-blue-500 mr-3" />
                      Capacity: {event.capacity} Delegates
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-3 text-blue-500" />
                  Event Briefing
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{event.description || "Detailed briefing materials are being prepared by the Secretariat."}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Registration */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-lg sticky top-32">
                <h3 className="text-2xl font-black text-white mb-2">Registration</h3>
                <p className="text-sm text-zinc-400 mb-8 leading-relaxed">Secure your credentials for this briefing. Subject to approval.</p>

                {isSuccess ? (
                  <div className="bg-emerald-950/30 border border-emerald-900/50 p-6 rounded-lg text-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">Registration Submitted</h4>
                    <p className="text-sm text-emerald-200/70">Your credentials request has been securely lodged with the Secretariat.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">First Name</label>
                        <input required name="firstName" onChange={handleInputChange} value={formData.firstName} type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input required name="lastName" onChange={handleInputChange} value={formData.lastName} type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input required name="email" onChange={handleInputChange} value={formData.email} type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Organization</label>
                      <input required name="organization" onChange={handleInputChange} value={formData.organization} type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Job Title</label>
                      <input required name="title" onChange={handleInputChange} value={formData.title} type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    
                    <button 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm tracking-widest uppercase py-4 rounded transition-all"
                    >
                      {isSubmitting ? "Processing..." : "Submit Registration"}
                    </button>
                    <p className="text-[11px] text-zinc-600 mt-4 text-center leading-relaxed">
                      By submitting, you agree to the AfDEC security protocols and event terms.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center py-20">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Event Not Found</h1>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed mb-10 max-w-xl mx-auto">
              The requested event could not be located in the system registry.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
