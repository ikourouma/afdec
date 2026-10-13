"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, ShieldAlert, UserCircle2, X, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { ALL_ROLES, ROLE_LABEL, type Role } from "@/lib/roles";

interface UserRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: string;
  status: string;
  is_partner_approved: boolean;
  deal_room_approved: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}

const fullName = (u: UserRow) => `${u.first_name || ""} ${u.last_name || ""}`.trim() || "(no name)";
const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : "Never");

export default function UserManagementPage() {
  const { user: me, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [justification, setJustification] = useState("");
  const [reason, setReason] = useState("");
  const [partner, setPartner] = useState(false);
  const [dealRoom, setDealRoom] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.rpc("admin_list_users");
    if (err) setError(err.message);
    else {
      setError(null);
      setUsers((data as UserRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const open = (u: UserRow) => {
    setSelected(u);
    setNewRole(u.role);
    setPartner(u.is_partner_approved);
    setDealRoom(u.deal_room_approved);
    setJustification("");
    setReason("");
    setNotice(null);
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role === roleFilter) &&
        (!needle || `${u.email} ${fullName(u)} ${u.organization}`.toLowerCase().includes(needle))
    );
  }, [users, q, roleFilter]);

  async function run(fn: () => PromiseLike<{ error: { message: string } | null }>, okText: string) {
    setBusy(true);
    setNotice(null);
    const { error: err } = await fn();
    setBusy(false);
    if (err) return setNotice({ kind: "err", text: err.message });
    setNotice({ kind: "ok", text: okText });
    await load();
  }

  // Keep the drawer in sync after reloads
  useEffect(() => {
    if (selected) {
      const fresh = users.find((u) => u.id === selected.id);
      if (fresh) setSelected(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const isSelf = selected?.id === me?.id;
  const targetIsAdmin = selected ? ["admin", "super_admin"].includes(selected.role) : false;
  const locked = isSelf || (targetIsAdmin && !isSuperAdmin);
  const assignable = ALL_ROLES.filter((r) => isSuperAdmin || !["admin", "super_admin"].includes(r));

  const field = "w-full bg-white border border-zinc-300 text-zinc-900 text-sm rounded-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1";

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Identity &amp; Access Management</h1>
          <p className="text-zinc-600 font-medium mt-1">
            Every account on the platform. Click a row to review, change role, suspend or revoke. All changes are audited.
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-50 text-sm font-bold text-zinc-800 rounded-sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && <p role="alert" className="mb-6 border border-red-300 bg-red-50 text-red-800 p-3 text-sm rounded-sm">Could not load users: {error}</p>}

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 rounded-t-md flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              aria-label="Search users"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, organization…"
              className="pl-9 pr-4 py-2 w-72 border border-zinc-300 rounded-sm text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border border-zinc-300 rounded-sm text-sm py-2 px-3 text-zinc-900">
            <option value="all">All roles</option>
            {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </select>
          <span className="text-sm text-zinc-600 ml-auto">{filtered.length} of {users.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-3">Identity</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Access</th>
                <th className="px-6 py-3">Last sign-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading && users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-zinc-600">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-zinc-600">No users match.</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} tabIndex={0} onClick={() => open(u)} onKeyDown={(e) => e.key === "Enter" && open(u)} className="hover:bg-zinc-50 cursor-pointer focus:outline-none focus:bg-blue-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${u.role === "super_admin" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"}`}>
                          {u.role === "super_admin" ? <ShieldAlert className="w-5 h-5" /> : <UserCircle2 className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 leading-tight">{fullName(u)}</p>
                          <p className="text-xs text-zinc-600">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3"><span className="px-2.5 py-1 text-xs uppercase font-bold tracking-wider rounded-full bg-zinc-100 text-zinc-800">{ROLE_LABEL[u.role as Role] ?? u.role}</span></td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold ${u.status === "active" ? "text-emerald-700" : "text-red-700"}`}>{u.status}</span>
                    </td>
                    <td className="px-6 py-3 text-xs text-zinc-700">
                      {u.is_partner_approved ? "Partner " : ""}{u.deal_room_approved ? "· Deal Room" : ""}{!u.is_partner_approved && !u.deal_room_approved ? "—" : ""}
                    </td>
                    <td className="px-6 py-3 text-xs text-zinc-700">{fmt(u.last_sign_in_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[300] flex justify-end" role="dialog" aria-modal="true" aria-label="User profile">
          <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <aside className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900">{fullName(selected)}</h2>
                <p className="text-sm text-zinc-600">{selected.email}</p>
                <p className="text-xs text-zinc-600 mt-1">{selected.organization || "No organization"}</p>
              </div>
              <button aria-label="Close panel" onClick={() => setSelected(null)} className="p-2 hover:bg-zinc-100 rounded-sm"><X className="w-5 h-5 text-zinc-700" /></button>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className={lbl}>Role</dt><dd className="text-zinc-900 font-semibold">{ROLE_LABEL[selected.role as Role] ?? selected.role}</dd></div>
              <div><dt className={lbl}>Status</dt><dd className="text-zinc-900 font-semibold">{selected.status}</dd></div>
              <div><dt className={lbl}>Joined</dt><dd className="text-zinc-800">{fmt(selected.created_at)}</dd></div>
              <div><dt className={lbl}>Last sign-in</dt><dd className="text-zinc-800">{fmt(selected.last_sign_in_at)}</dd></div>
            </dl>

            {notice && <p role="status" className={`text-sm p-3 border rounded-sm ${notice.kind === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>{notice.text}</p>}
            {locked && <p className="text-sm p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-sm">{isSelf ? "You cannot change your own role or status." : "Only a super admin can change an admin account."}</p>}

            <fieldset disabled={locked || busy} className="space-y-3 border-t border-zinc-200 pt-5">
              <legend className="text-sm font-extrabold text-zinc-900">Change role</legend>
              <select aria-label="New role" value={newRole} onChange={(e) => setNewRole(e.target.value)} className={field}>
                {assignable.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
              <input aria-label="Justification" placeholder="Justification (recorded in audit log)" value={justification} onChange={(e) => setJustification(e.target.value)} className={field} />
              <button
                disabled={newRole === selected.role || justification.trim().length < 3}
                onClick={() => run(() => supabase.rpc("admin_set_user_role", { target: selected.id, new_role: newRole, justification }), "Role updated.")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm"
              >Apply role</button>
            </fieldset>

            <fieldset disabled={locked || busy} className="space-y-3 border-t border-zinc-200 pt-5">
              <legend className="text-sm font-extrabold text-zinc-900">Access grants</legend>
              <label className="flex items-center gap-2 text-sm text-zinc-800"><input type="checkbox" checked={partner} onChange={(e) => setPartner(e.target.checked)} /> Partner (intelligence terminal) approved</label>
              <label className="flex items-center gap-2 text-sm text-zinc-800"><input type="checkbox" checked={dealRoom} onChange={(e) => setDealRoom(e.target.checked)} /> Deal Room approved</label>
              <button
                disabled={partner === selected.is_partner_approved && dealRoom === selected.deal_room_approved}
                onClick={() => run(() => supabase.rpc("admin_set_user_access", { target: selected.id, partner_approved: partner, deal_room: dealRoom }), "Access updated.")}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm"
              >Save access</button>
            </fieldset>

            <fieldset disabled={locked || busy} className="space-y-3 border-t border-zinc-200 pt-5">
              <legend className="text-sm font-extrabold text-zinc-900">Account status</legend>
              <input aria-label="Reason" placeholder="Reason (recorded in audit log)" value={reason} onChange={(e) => setReason(e.target.value)} className={field} />
              <div className="flex flex-wrap gap-2">
                {selected.status !== "active" && (
                  <button onClick={() => run(() => supabase.rpc("admin_set_user_status", { target: selected.id, new_status: "active", reason }), "Account reinstated.")} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-sm">Reinstate</button>
                )}
                {selected.status === "active" && (
                  <>
                    <button disabled={reason.trim().length < 3} onClick={() => run(() => supabase.rpc("admin_set_user_status", { target: selected.id, new_status: "suspended", reason }), "Account suspended.")} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-bold rounded-sm">Suspend</button>
                    <button disabled={reason.trim().length < 3} onClick={() => run(() => supabase.rpc("admin_set_user_status", { target: selected.id, new_status: "revoked", reason }), "Access revoked.")} className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-sm font-bold rounded-sm">Revoke access</button>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-600">Suspend blocks sign-in. Revoke also removes partner/Deal Room access and drops the role to Registered.</p>
            </fieldset>
          </aside>
        </div>
      )}
    </div>
  );
}
