"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function BoardApplicationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin_url: "",
    justification: "",
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [secondaryLinks, setSecondaryLinks] = useState<string[]>([""]);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...secondaryLinks];
    newLinks[index] = value;
    setSecondaryLinks(newLinks);
  };

  const addLink = () => setSecondaryLinks([...secondaryLinks, ""]);
  const removeLink = (index: number) => setSecondaryLinks(secondaryLinks.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let resume_url = null;

      // 1. Upload Resume
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('candidacy-resumes')
          .upload(filePath, resumeFile);

        if (uploadError) {
          console.error("Resume upload failed:", uploadError);
          // If the bucket doesn't exist yet, we could either fail or continue. The user decision says: 
          // "A secure, private Supabase Storage bucket (candidacy-resumes) will be created"
          // We will attempt to proceed or catch error.
          throw new Error("Failed to upload resume. Please try again later.");
        }
        
        resume_url = filePath;
      }

      // 2. Submit Data
      const validLinks = secondaryLinks.filter(l => l.trim() !== "");
      
      const { error: dbError } = await supabase
        .from('advisor_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          linkedin_url: formData.linkedin_url,
          justification: formData.justification,
          resume_url,
          secondary_links: validLinks
        });

      if (dbError) throw dbError;

      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-black text-white">Board of Advisors Application</h2>
              <p className="text-zinc-400 text-xs mt-1">Submit your candidacy for the Sovereign Council's advisory board.</p>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">Application Received</h3>
                <p className="text-zinc-400 mb-8 max-w-md">Your candidacy has been securely submitted to the Executive Secretariat. We will contact you regarding next steps.</p>
                <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-colors">
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Full Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Dr. Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">LinkedIn Profile URL</label>
                      <input required type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://linkedin.com/in/janedoe" />
                    </div>
                    <button type="button" onClick={() => {
                        if (formData.name && formData.email && formData.linkedin_url) setStep(2);
                        else alert("Please fill in all fields.");
                      }} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-colors mt-4">
                      Continue to Next Step
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Justification Statement</label>
                      <p className="text-[10px] text-zinc-500 mb-2">Why would you like to join the Board of Advisors?</p>
                      <textarea required value={formData.justification} onChange={e => setFormData({...formData, justification: e.target.value})} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Provide your statement here..." />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Resume / CV (PDF)</label>
                      <div className="w-full bg-zinc-950 border border-zinc-800 border-dashed rounded-sm px-4 py-6 text-center flex flex-col items-center">
                        <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                        <p className="text-xs text-zinc-400 mb-4">{resumeFile ? resumeFile.name : "Upload a secure copy of your CV"}</p>
                        <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm cursor-pointer transition-colors">
                          Select File
                          <input type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files && setResumeFile(e.target.files[0])} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Additional URLs</label>
                      <p className="text-[10px] text-zinc-500 mb-2">Business site, YouTube channel, Portfolio, etc.</p>
                      <div className="space-y-3">
                        {secondaryLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input type="url" value={link} onChange={e => handleLinkChange(idx, e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://..." />
                            {secondaryLinks.length > 1 && (
                              <button type="button" onClick={() => removeLink(idx)} className="p-2.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-sm transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addLink} className="mt-3 flex items-center text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                        <Plus className="w-3 h-3 mr-1" /> Add Another Link
                      </button>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-colors">
                        Back
                      </button>
                      <button type="submit" disabled={isSubmitting || !resumeFile} className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-colors">
                        {isSubmitting ? "Submitting..." : "Submit Candidacy"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
