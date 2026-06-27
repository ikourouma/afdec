"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Globe, MapPin, Briefcase, GraduationCap, Users } from "lucide-react";

export function DiasporaRegistrationForm() {
  const [formData, setFormData] = useState({
    country_of_origin: "",
    residence_city: "",
    residence_county: "",
    residence_state: "",
    residence_country: "",
    profession: "",
    sector: "",
    education_level: "",
    family_size: 1,
    family_registry_details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in to register.");
        window.location.href = "/auth";
        return;
      }

      const { error } = await supabase
        .from('diaspora_registry')
        .insert({
          user_id: session.user.id,
          ...formData
        });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-950/20 border border-emerald-900/50 p-8 rounded-xl text-center">
        <h3 className="text-xl font-black text-emerald-400 mb-2">Registration Complete</h3>
        <p className="text-zinc-400 text-sm">Thank you for joining the AfDEC Diaspora Registry.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-8 space-y-6">
      <div>
        <h3 className="text-xl font-black text-white mb-1">Diaspora Registry</h3>
        <p className="text-zinc-400 text-xs mb-6">Join the registry to connect with transatlantic economic opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Globe className="w-3 h-3"/> Country of Origin</label>
          <input required type="text" value={formData.country_of_origin} onChange={e => setFormData({...formData, country_of_origin: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="e.g. Nigeria, Kenya..." />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Briefcase className="w-3 h-3"/> Profession</label>
          <input required type="text" value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="e.g. Software Engineer" />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Sector</label>
          <input type="text" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="e.g. Technology, Finance..." />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><GraduationCap className="w-3 h-3"/> Education Level</label>
          <select required value={formData.education_level} onChange={e => setFormData({...formData, education_level: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500">
            <option value="">Select Level</option>
            <option value="High School">High School</option>
            <option value="Bachelor's">Bachelor's Degree</option>
            <option value="Master's">Master's Degree</option>
            <option value="Doctorate">Doctorate / PhD</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin className="w-3 h-3"/> Current Residence</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input required type="text" value={formData.residence_city} onChange={e => setFormData({...formData, residence_city: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="City" />
          <input type="text" value={formData.residence_county} onChange={e => setFormData({...formData, residence_county: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="County (Optional)" />
          <input required type="text" value={formData.residence_state} onChange={e => setFormData({...formData, residence_state: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="State/Province" />
          <input required type="text" value={formData.residence_country} onChange={e => setFormData({...formData, residence_country: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="Country" />
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users className="w-3 h-3"/> Family Details</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required type="number" min="1" value={formData.family_size} onChange={e => setFormData({...formData, family_size: parseInt(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="Family Size" />
          <input type="text" value={formData.family_registry_details} onChange={e => setFormData({...formData, family_registry_details: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-white focus:border-blue-500" placeholder="Additional Details (Optional)" />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition-colors mt-4">
        {isSubmitting ? "Registering..." : "Submit Registration"}
      </button>
    </form>
  );
}
