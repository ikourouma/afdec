"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Search, 
  Star, 
  ToggleLeft, 
  ToggleRight,
  ArrowLeft,
  XCircle,
  Save,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function StaffManagerPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .order("sort_order", { ascending: true });
    
    if (!error && data) setMembers(data);
    setIsLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      title: formData.get("title"),
      sub_title: formData.get("sub_title"),
      role_tier: formData.get("role_tier"),
      bio: formData.get("bio"),
      image_url: formData.get("image_url"),
      committees: (formData.get("committees") as string).split(",").map(c => c.trim()).filter(c => c),
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
      is_featured: formData.get("is_featured") === "on",
      is_active: true
    };

    if (currentMember?.id) {
      const { error } = await supabase.from("board_members").update(data).eq("id", currentMember.id);
      if (error) console.error("Error updating member:", error);
    } else {
      const { error } = await supabase.from("board_members").insert([data]);
      if (error) console.error("Error inserting member:", error);
    }

    setIsEditing(false);
    setCurrentMember(null);
    fetchMembers();
  }

  async function toggleActive(id: string, currentState: boolean) {
    await supabase.from("board_members").update({ is_active: !currentState }).eq("id", id);
    setMembers(prev => prev.map(m => m.id === id ? { ...m, is_active: !currentState } : m));
  }

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen font-sans bg-zinc-50">
      
      {/* ── Executive Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-sm mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sovereign Council Manager</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">Council Governance</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage the profiles and institutional committees of the AfDEC Board of Directors.</p>
        </div>
        
        <button 
          onClick={() => { setCurrentMember(null); setIsEditing(true); }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-lg flex items-center transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Appoint Member
        </button>
      </div>

      {/* ── Council Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-zinc-400 font-medium italic">Synchronizing Governance Nodes...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-400 font-medium">The Sovereign Council is currently vacated.</div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-white border border-zinc-200 rounded-sm p-6 shadow-sm group hover:border-blue-500/40 transition-all">
              <div className="flex items-start justify-between mb-6">
                 <div className="w-16 h-16 bg-zinc-100 rounded-sm overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-300" />
                    )}
                 </div>
                 <div className="flex space-x-2">
                    <button 
                      onClick={() => { setCurrentMember(member); setIsEditing(true); }}
                      className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleActive(member.id, member.is_active)}
                      className={`p-2 transition-colors ${member.is_active ? 'text-emerald-500 hover:text-zinc-400' : 'text-zinc-300 hover:text-emerald-500'}`}
                    >
                      {member.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-zinc-900 text-lg">{member.name}</h3>
                    {member.is_featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                 </div>
                 <div className="flex items-center gap-2 mb-6">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">{member.title}</p>
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm border ${
                      member.role_tier === 'advisor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      member.role_tier === 'executive' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {member.role_tier || 'council'}
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap gap-1.5 mb-6">
                    {member.committees.map((c: string) => (
                      <span key={c} className="px-2 py-0.5 bg-zinc-50 text-[9px] font-bold text-zinc-500 uppercase rounded-sm border border-zinc-100">{c}</span>
                    ))}
                 </div>

                 <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed italic">
                   {member.bio}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Edit/Add Overlay ── */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[200]" 
               onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[210] flex flex-col"
            >
               <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                    {currentMember ? "Modify Appointment" : "New Council Appointment"}
                  </h2>
                  <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-900">
                    <XCircle className="w-6 h-6" />
                  </button>
               </div>

               <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Full Name</label>
                     <input 
                        name="name" 
                        defaultValue={currentMember?.name} 
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold"
                     />
                  </div>
                  
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Institutional Title</label>
                     <input 
                        name="title" 
                        defaultValue={currentMember?.title} 
                        required
                        placeholder="e.g. Board Chair"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Mandate Tier</label>
                        <select 
                           name="role_tier" 
                           defaultValue={currentMember?.role_tier || "council"} 
                           className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm outline-none text-sm font-bold appearance-none"
                        >
                           <option value="council">Sovereign Council (Blue)</option>
                           <option value="executive">Executive Mandate (Orange)</option>
                           <option value="advisor">Board of Advisors (Green)</option>
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Sub-Title / Region</label>
                        <input 
                           name="sub_title" 
                           defaultValue={currentMember?.sub_title} 
                           placeholder="e.g. West Africa"
                           className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm outline-none text-sm font-bold"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Committees (Comma Separated)</label>
                     <input 
                        name="committees" 
                        defaultValue={currentMember?.committees?.join(", ")} 
                        placeholder="e.g. Audit, Oversight, Strategic"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Display Order</label>
                        <input 
                           name="sort_order" 
                           type="number"
                           defaultValue={currentMember?.sort_order || 0}
                           className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm outline-none text-sm font-bold"
                        />
                     </div>
                     <div className="space-y-4 pt-10">
                        <label className="flex items-center space-x-3 cursor-pointer">
                           <input 
                             name="is_featured" 
                             type="checkbox" 
                             defaultChecked={currentMember?.is_featured}
                             className="w-4 h-4 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500" 
                           />
                           <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Featured Member</span>
                        </label>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Portrait URL</label>
                     <input 
                        name="image_url" 
                        defaultValue={currentMember?.image_url} 
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-sm outline-none text-sm font-medium"
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Institutional Biography</label>
                     <textarea 
                        name="bio" 
                        rows={8}
                        defaultValue={currentMember?.bio} 
                        required
                        className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-sm outline-none text-sm leading-relaxed"
                     />
                  </div>

                  <div className="pt-8 border-t border-zinc-100 flex gap-4">
                     <button 
                        type="submit"
                        className="flex-1 px-8 py-4 bg-zinc-950 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg"
                     >
                       <Save className="w-4 h-4 mr-2" /> Commit to Ledger
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
