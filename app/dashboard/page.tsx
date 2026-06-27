"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function routeUser() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      const role = session.user.user_metadata?.role || session.user.app_metadata?.role || 'member';
      const email = session.user.email?.toLowerCase();

      const isSuperAdmin = 
        role === 'super_admin' || 
        role === 'admin' || 
        email === 'afdecadmin@afronovation.com' || 
        email === 'admin@afronovation.com';

      if (isSuperAdmin) {
        router.push('/dashboard/admin');
      } else if (role === 'investor') {
        router.push('/dashboard/investor');
      } else {
        router.push('/dashboard/member');
      }
    }
    
    routeUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-pulse text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm">
        Authenticating Identity...
      </div>
    </div>
  );
}
