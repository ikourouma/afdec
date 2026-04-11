"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Briefcase, FileText, Upload, ChevronRight, 
  ChevronLeft, CheckCircle2, AlertCircle, Loader2, Globe,
  DollarSign, Clock, Users 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { grantApplicationSchema, type GrantApplicationInput, MAX_FILE_SIZE } from "@/lib/fund-schemas";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const STEPS = [
  { id: 1, label: "Entity Profile", icon: Building2 },
  { id: 2, label: "Capital Logic", icon: FileText },
  { id: 3, label: "Document Vault", icon: Upload },
];

export default function GrantApplicationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ ref: string } | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [user, setUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<GrantApplicationInput>({
    resolver: zodResolver(grantApplicationSchema),
    defaultValues: {
      annual_revenue_band: "$0–$50K",
      years_in_operation: 1,
      employee_count: 1,
      timeline_months: 12,
      requested_amount_usd: 5000,
    }
  });

  const watchAllFields = watch();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth?redirect=/diaspora-impact-fund/apply");
        return;
      }
      setUser(user);
      setValue("contact_email", user.email || "");
      setValue("contact_name", user.user_metadata?.full_name || "");
    }

    async function loadProjects() {
      const { data } = await supabase.from("v_active_fund_projects").select("id, title, max_grant_usd, category");
      setProjects(data || []);
    }

    checkAuth();
    loadProjects();
  }, [router, setValue]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "business_name", "business_registration_no", "country", "sector", 
        "years_in_operation", "employee_count", "annual_revenue_band",
        "contact_name", "contact_title", "contact_email", "contact_phone"
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "project_id", "project_title", "project_description", 
        "requested_amount_usd", "impact_statement", "implementation_plan", "timeline_months"
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof GrantApplicationInput) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 10MB limit.");
      return;
    }

    setUploadProgress(prev => ({ ...prev, [fieldName]: 10 }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${fieldName}_${Math.random()}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fund-applications')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('fund-applications')
        .getPublicUrl(filePath);

      setValue(fieldName, publicUrl);
      setUploadProgress(prev => ({ ...prev, [fieldName]: 100 }));
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Ensure the 'fund-applications' bucket exists.");
      setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
    }
  };

  const onSubmit = async (data: GrantApplicationInput) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data: result, error } = await supabase
        .from("fund_applications")
        .insert([{
          ...data,
          applicant_user_id: user.id,
          status: "submitted"
        }])
        .select("reference_number")
        .single();

      if (error) throw error;
      setSuccessData({ ref: result.reference_number });
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>;

  if (successData) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
        <TopNav />
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full text-center bg-zinc-900/40 border border-emerald-900/20 p-12 rounded-2xl backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black mb-4">Application Submitted.</h2>
            <p className="text-zinc-400 mb-10 leading-relaxed">
              Your grant application has been successfully logged into the AfDEC Procurement Gateway. You will receive an official acknowledgement via email within 48 hours.
            </p>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl mb-10 text-left">
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Grant Reference Number</div>
              <div className="text-2xl font-black text-emerald-400 tracking-tight">{successData.ref}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => router.push("/dashboard/member")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-sm transition-all"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => router.push("/")}
                className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold py-4 rounded-sm transition-all"
              >
                Return Home
              </button>
            </div>
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

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 md:py-24">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-emerald-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 uppercase">SME Grant Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight">Impact Fund Application.</h1>
          
          <div className="flex items-center gap-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center gap-2 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    isActive ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
                    isCompleted ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-widest hidden sm:block ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                    {step.label}
                  </span>
                  {step.id < 3 && <div className="w-12 h-px bg-zinc-800 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Legal Business Name</label>
                       <input {...register("business_name")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" placeholder="e.g. AgriLink Solutions Ltd" />
                       {errors.business_name && <p className="text-red-400 text-[10px] font-bold">{errors.business_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Registration Number</label>
                       <input {...register("business_registration_no")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" placeholder="e.g. RC-1234567" />
                       {errors.business_registration_no && <p className="text-red-400 text-[10px] font-bold">{errors.business_registration_no.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Country of Operation</label>
                       <input {...register("country")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" placeholder="e.g. Ghana, Kenya" />
                       {errors.country && <p className="text-red-400 text-[10px] font-bold">{errors.country.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Industry Sector</label>
                       <select {...register("sector")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none appearance-none">
                         <option value="">Select Sector</option>
                         <option value="Agriculture">Agriculture</option>
                         <option value="Health">Health</option>
                         <option value="Energy">Energy</option>
                         <option value="Education">Education</option>
                         <option value="Tech/ICT">Tech & ICT</option>
                         <option value="Manufacturing">Manufacturing</option>
                       </select>
                       {errors.sector && <p className="text-red-400 text-[10px] font-bold">{errors.sector.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Primary Contact Name</label>
                       <input {...register("contact_name")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" />
                       {errors.contact_name && <p className="text-red-400 text-[10px] font-bold">{errors.contact_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Phone</label>
                       <input {...register("contact_phone")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" placeholder="+233..." />
                       {errors.contact_phone && <p className="text-red-400 text-[10px] font-bold">{errors.contact_phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Years in Operation</label>
                       <input {...register("years_in_operation", { valueAsNumber: true })} type="number" className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" />
                       {errors.years_in_operation && <p className="text-red-400 text-[10px] font-bold">{errors.years_in_operation.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Employee Count</label>
                       <input {...register("employee_count", { valueAsNumber: true })} type="number" className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white transition-all outline-none" />
                       {errors.employee_count && <p className="text-red-400 text-[10px] font-bold">{errors.employee_count.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Development Project</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {projects.map((proj) => (
                           <button 
                             key={proj.id} type="button" 
                             onClick={() => setValue("project_id", proj.id)}
                             className={`p-4 text-left border rounded-lg transition-all ${watch("project_id") === proj.id ? 'bg-emerald-950/20 border-emerald-500' : 'bg-zinc-950 border-zinc-800'}`}
                           >
                             <div className="text-white font-bold text-sm">{proj.title}</div>
                             <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{proj.category} — Max Grant ${proj.max_grant_usd?.toLocaleString()}</div>
                           </button>
                         ))}
                       </div>
                       {errors.project_id && <p className="text-red-400 text-[10px] font-bold">{errors.project_id.message}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proposal Title</label>
                       <input {...register("project_title")} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white outline-none" placeholder="e.g. Extension of Maize Processing Plant" />
                       {errors.project_title && <p className="text-red-400 text-[10px] font-bold">{errors.project_title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requested Grant (USD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                          <input {...register("requested_amount_usd", { valueAsNumber: true })} type="number" className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 pl-10 text-white outline-none" />
                        </div>
                        {errors.requested_amount_usd && <p className="text-red-400 text-[10px] font-bold">{errors.requested_amount_usd.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Execution Timeline (Months)</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                          <input {...register("timeline_months", { valueAsNumber: true })} type="number" className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 pl-10 text-white outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Impact Statement</label>
                       <textarea {...register("impact_statement")} rows={4} className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-sm p-3 text-white outline-none resize-none" placeholder="Describe the socio-economic impact of this grant..." />
                       {errors.impact_statement && <p className="text-red-400 text-[10px] font-bold">{errors.impact_statement.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-emerald-950/20 border border-emerald-900/30 p-6 rounded-xl flex items-start gap-4 mb-8">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      All documents are encrypted and stored in AfDEC's Sovereign Data Vault. Only the Fund Committee and authorized procurement officers can access these artifacts. Max 10MB per file.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { id: "business_plan_url" as const, label: "Business Plan / Proposal Executive Summary" },
                      { id: "registration_doc_url" as const, label: "Certificate of Incorporation / Registration" },
                      { id: "financial_statements_url" as const, label: "Financial Statements (Last 12 Months)" },
                    ].map((doc) => (
                      <div key={doc.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-white mb-1">{doc.label}</div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Required PDF / Docx</div>
                        </div>
                        <div className="relative">
                          <input 
                            type="file" accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload(e, doc.id)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          />
                          <div className={`px-6 py-2.5 rounded-sm text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${
                            watch(doc.id) ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}>
                            {uploadProgress[doc.id] === 100 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                            {watch(doc.id) ? 'Uploaded' : 'Select File'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-lg flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-xs text-red-400">{submitError}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-zinc-800/40">
              <button 
                type="button" onClick={prevStep} disabled={currentStep === 1 || isSubmitting}
                className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all ${currentStep === 1 ? 'opacity-0' : 'text-zinc-500 hover:text-white'}`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              {currentStep < 3 ? (
                <button 
                  type="button" onClick={nextStep}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-sm transition-all"
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit" disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-12 py-4 rounded-sm transition-all flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Finalize Submission
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Shield(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  )
}
