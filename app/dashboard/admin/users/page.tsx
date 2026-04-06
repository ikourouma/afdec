"use client";

import React, { useState } from "react";
import { Plus, Search, ShieldAlert, ShieldCheck, Mail, KeyRound, Building2, UserCircle2, ChevronRight, UserPlus, Fingerprint } from "lucide-react";

const mockUsers = [
  {
    id: "ee836fba-5405-4008-8d00-d686c65c50f9",
    name: "Ibrahima Kourouma",
    email: "admin@afronovation.com",
    role: "super_admin",
    status: "active",
    lastLogin: "2 min ago"
  },
  {
    id: "uuid-1234-abcd-5678",
    name: "Jonathan Wright",
    email: "director@afdec.org",
    role: "admin",
    status: "active",
    lastLogin: "4 hours ago"
  },
  {
    id: "uuid-9012-efgh-3456",
    name: "Dr. Sarah Jenkins",
    email: "policy@rt-energy.com",
    role: "member",
    status: "pending_verification",
    lastLogin: "Never"
  }
];

export default function UserManagementPage() {
  const [isProvisioning, setIsProvisioning] = useState(false);

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Identity & Access Management</h1>
          <p className="text-zinc-500 font-medium mt-1">Govern executing authority, RBAC permissions, and internal terminal access.</p>
        </div>
        <button 
          onClick={() => setIsProvisioning(!isProvisioning)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md"
        >
          {isProvisioning ? <ChevronRight className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          {isProvisioning ? "Return to Directory" : "Provision Identity"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Workspace */}
        <div className={`transition-all duration-500 ${isProvisioning ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="bg-white border border-zinc-200 rounded-md shadow-sm">
            
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 rounded-t-md flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search identities by email..."
                    className="pl-9 pr-4 py-2 w-64 border border-zinc-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* User Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-200">
                    <th className="px-6 py-4">Executing Identity</th>
                    <th className="px-6 py-4">Clearance Role</th>
                    <th className="px-6 py-4">Status & Telemetry</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${user.role === 'super_admin' ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                            {user.role === 'super_admin' ? <ShieldAlert className="w-5 h-5" /> : <UserCircle2 className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 leading-tight">{user.name}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                          user.role === 'super_admin' ? 'bg-zinc-900 text-white' : 
                          user.role === 'admin' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-xs text-zinc-700 font-medium">
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          {user.status === 'active' ? 'Operational' : 'Pending Auth Check'}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">
                          Last Ping: {user.lastLogin}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors mr-3">Revoke</button>
                        <button className="text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors">Edit Logic</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Provisioning Panel (Right side creation form) */}
        {isProvisioning && (
          <div className="lg:col-span-4 animate-fade-in">
            <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden sticky top-6">
              <div className="bg-zinc-950 px-6 py-5 border-b border-zinc-800">
                <h3 className="font-bold text-white text-lg flex items-center tracking-tight">
                  <Fingerprint className="w-5 h-5 text-blue-500 mr-2" />
                  System Provisioning
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Establish a new authenticated identity and map Role-Based Access controls securely.</p>
              </div>

              <div className="p-6 space-y-5 bg-zinc-50/50">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">First Name</label>
                    <input type="text" className="w-full bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-3 focus:ring-blue-500 outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Last Name</label>
                    <input type="text" className="w-full bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-3 focus:ring-blue-500 outline-none shadow-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Secure Email Routing</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="email" placeholder="official@afdec.org" className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm focus:ring-blue-500 outline-none shadow-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Initial Passcode</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="text" defaultValue="AfDEC_Temp_892!" className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-300 text-zinc-900 text-sm tracking-widest font-mono rounded-sm focus:ring-blue-500 outline-none shadow-sm" />
                  </div>
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">User will be forced to rotate key upon execution.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Clearance Logic (RBAC)</label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-sm p-3 font-semibold tracking-wide cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                    <option value="member">Tier 3: Standard Member/Partner</option>
                    <option value="admin">Tier 2: Administrator (Content Authority)</option>
                    <option value="super_admin">Tier 1: Super Admin (God Mode)</option>
                  </select>
                </div>

                <button className="w-full mt-4 flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white tracking-wide uppercase rounded-sm transition-colors shadow-md">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Execute Identity
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
