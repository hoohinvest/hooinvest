import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard and admin routes
  if (!session && (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/application') ||
      req.nextUrl.pathname.startsWith('/docs') ||
      req.nextUrl.pathname.startsWith('/admin'))) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/sign-in';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/application/:path*', '/docs/:path*', '/admin/:path*'],
};




