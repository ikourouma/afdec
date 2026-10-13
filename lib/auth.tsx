"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  type AccountStatus,
  type Role,
  hasMemberRole,
  isAdminRole,
  isStaffRole,
  isSuperAdminRole,
  normalizeRole,
} from "@/lib/roles";

export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: Role;
  status: AccountStatus;
  is_partner_approved: boolean;
  deal_room_approved: boolean;
  nda_accepted_at: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  isSignedIn: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasMemberAccess: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const PROFILE_COLUMNS =
  "id, email, first_name, last_name, organization, role, status, is_partner_approved, deal_room_approved, nda_accepted_at";

/**
 * One shared auth/profile state for the whole app (replaces the many
 * independent supabase.auth.getSession() calls).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", u.id).maybeSingle();
    if (data) {
      setProfile({ ...(data as Profile), role: normalizeRole((data as Profile).role) });
    } else {
      setProfile(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
    await loadProfile(data.user ?? null);
  }, [loadProfile]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setUser(data.session?.user ?? null);
      await loadProfile(data.session?.user ?? null);
      if (active) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Defer the DB call so it never runs inside the auth callback lock.
      setTimeout(() => {
        void loadProfile(session?.user ?? null);
      }, 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.assign("/");
  }, []);

  const value = useMemo<AuthState>(() => {
    const role = profile?.role ?? null;
    const active = !profile || profile.status === "active";
    return {
      user,
      profile,
      role,
      loading,
      isSignedIn: !!user,
      isStaff: active && isStaffRole(role),
      isAdmin: active && isAdminRole(role),
      isSuperAdmin: active && isSuperAdminRole(role),
      hasMemberAccess: active && (hasMemberRole(role) || !!profile?.is_partner_approved),
      refresh,
      signOut,
    };
  }, [user, profile, loading, refresh, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
