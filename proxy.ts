import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a clean client for middleware (standard practice in Next.js 15/16)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get Session from Cookies (Supabase Standard Cookie)
  // Note: auth.getSession() in middleware triggers a session refresh if needed
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Protect Dashboard Routes
  if (pathname.startsWith('/dashboard')) {
    
    // Unauthenticated: Redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Role-Based Authorization
    const role = session.user.user_metadata?.role || 'member';

    // Admin Security: Force re-auth every 24 hours
    if (role === 'admin' && session.last_sign_in_at) {
        const lastSignIn = new Date(session.last_sign_in_at).getTime();
        const now = new Date().getTime();
        const hoursPassed = (now - lastSignIn) / (1000 * 60 * 60);

        if (hoursPassed > 24) {
            // Force Sign-out and redirect
            await supabase.auth.signOut();
            return NextResponse.redirect(new URL('/auth?session_expired=true', request.url));
        }
    }

    // Protect Admin Dashboard from Members
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/member', request.url));
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths for performance
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
