"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { 
  Heart, Globe, Building2, User, Mail, Phone,
  ChevronRight, ArrowRight, Loader2, CheckCircle2,
  DollarSign, MessageSquare
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { donorInterestSchema, type DonorInterestInput } from "@/lib/fund-schemas";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

import { Suspense } from "react";

function DonorInterestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  // Pre-fill project from URL if present
  const preSelectedProjectId = searchParams.get("project_id");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(donorInterestSchema),
    defaultValues: {
      inquiry_type: "donor_individual",
      full_name: "",
      email: "",
      organization: "",
      phone: "",
      country: "",
      preferred_project_id: preSelectedProjectId || null,
      message: "",
      contribution_type: "financial",
      estimated_contribution_usd: 0
    }
  });

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase.from("v_active_fund_projects").select("id, title, category");
      setProjects(data || []);
    }
    loadProjects();
  }, []);

  const onSubmit = async (data: DonorInterestInput) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("fund_interests")
        .insert([data]);

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
        <TopNav />
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full text-center bg-zinc-900/40 border border-emerald-900/20 p-12 rounded-2xl backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black mb-4">Interest Received.</h2>
            <p className="text-zinc-400 mb-10 leading-relaxed">
              Thank you for your commitment to Africa's development. An AfDEC Fund Officer will review your inquiry and contact you within 3 business days to discuss contribution pathways and impact metrics.
            </p>
            <button 
              onClick={() => router.push("/diaspora-impact-fund")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-sm transition-all"
            >
              Back to Impact Fund
            </button>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col selection:bg-emerald-500/30">
      <TopNav />
      <Header />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          
          {/* Form Side */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-emerald-500" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Partner Intake</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Register Interest.</h1>
            <p className="text-lg text-zinc-400 mb-12 max-w-xl">
              Whether you are an individual donor, an institutional foundation, or a program partner, your interest is the first step toward continental impact.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-xl space-y-8">
                
                {/* Inquiry Type */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Inquiry Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "donor_individual", label: "Individual Donor", icon: Heart },
                      { id: "donor_institutional", label: "Institutional Partner", icon: Building2 },
                      { id: "program_partner", label: "Program Partner", icon: Globe },
                      { id: "matching_funds", label: "Matching Funds Pledge", icon: DollarSign },
                    ].map((t) => {
                      const Icon = t.icon;
                      const isActive = watch("inquiry_type") === t.id;
                      return (
                        <button 
                          key={t.id} type="button"
                          onClick={() => setValue("inquiry_type", t.id as any)}
                          className={`flex items-center gap-3 p-4 border rounded-lg transition-all text-left ${
                            isActive ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800/60 text-zinc-500 hover:border-zinc-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`} />
                          <span className="text-sm font-bold">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name / Key Contact</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                      <input {...register("full_name")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-sm p-3 pl-10 text-white outline-none transition-all" />
                    </div>
                    {errors.full_name && <p className="text-red-400 text-[10px] font-bold">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Organization (If applicable)</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                      <input {...register("organization")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-sm p-3 pl-10 text-white outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                      <input {...register("email")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-sm p-3 pl-10 text-white outline-none transition-all" />
                    </div>
                    {errors.email && <p className="text-red-400 text-[10px] font-bold">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                      <input {...register("country")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-sm p-3 pl-10 text-white outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Flexible Linkage */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Project (Optional)</label>
                  <select 
                    {...register("preferred_project_id")} 
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-sm p-3 text-white outline-none appearance-none"
                    onChange={(e) => setValue("preferred_project_id", e.target.value === "general" ? null : e.target.value)}
                  >
                    <option value="general">General Fund Contribution (Across all projects)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-zinc-600 font-medium">Select a specific project or leave as General Fund.</p>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contribution Details / Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                    <textarea {...register("message")} rows={5} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/40 rounded-sm p-3 pl-10 text-white outline-none resize-none transition-all" placeholder="Tell us more about your interest..." />
                  </div>
                  {errors.message && <p className="text-red-400 text-[10px] font-bold">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-500 text-white font-bold py-5 rounded-sm transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-xs"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                  Submit Interest
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8">
            <div className="bg-emerald-950/20 border border-emerald-900/30 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-black text-white mb-4">Why Partner?</h3>
              <div className="space-y-4">
                {[
                  "100% Capital Deployment Visibility",
                  "Direct SDG Alignment (2, 3, 4, 7, 8)",
                  "Quarterly Institutional Impact Audits",
                  "Engagement with Afro-NC Economic Corridors",
                  "Recognition in the AfDEC Annual Report"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-400 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl">
              <h3 className="text-sm font-bold text-white mb-2">Institutional Inquiries</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                For complex matching fund inquiries or bilateral government partnerships, you may contact the Fund Chair directly.
              </p>
              <div className="text-emerald-400 text-xs font-bold font-mono">office@afdec-co.org</div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function DonorInterestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
      <DonorInterestForm />
    </Suspense>
  );
}
