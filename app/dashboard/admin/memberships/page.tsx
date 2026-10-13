"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Search, Trash2, CheckCircle, XCircle, Eye, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MembershipsAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false });
    setMembers(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('membership_applications').update({ status }).eq('id', id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this membership application?")) {
      await supabase.from('membership_applications').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Membership Management</h1>
          <p className="text-zinc-500 font-medium mt-1">Review and manage membership applications and active members.</p>
        </div>
        <div className="flex items-center space-x-3 bg-zinc-100 p-1.5 rounded-sm">
          <div className="px-4 py-2 bg-white rounded shadow-sm text-sm font-bold text-zinc-800">
            Total Applications: {members.length}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-700 font-bold text-sm">
            <UserPlus className="w-4 h-4" />
            <span>Membership Applications</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Loading applications...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500 font-bold">No membership applications found.</td></tr>
              ) : members.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{m.full_name || m.email}</p>
                    <p className="text-xs text-zinc-500">{m.email}</p>
                  </td>
                  <td className="px-6 py-4 text-zinc-700 font-medium">{m.organization || "Individual"}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{m.tier || "Standard"}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                      m.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      m.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {m.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => updateStatus(m.id, 'approved')} className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(m.id, 'rejected')} className="p-2 text-zinc-400 hover:text-red-600 transition-colors" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
