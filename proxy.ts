import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || "SUPER_SECRET_FALLBACK_FOR_DEV";
  const token = await getToken({ 
    req, 
    secret,
    secureCookie: process.env.NODE_ENV === 'production',
  });
  const { pathname } = req.nextUrl;
  
  // LOG COOKIES TO DEBUG SESSION ISSUES
  const allCookies = req.cookies.getAll().map(c => c.name);
  console.log(`PROXY_DEBUG: PATH=${pathname} HAS_TOKEN=${!!token} COOKIES=[${allCookies.join(', ')}]`);

  // 1. AUTH REDIRECT RULE: If token exists and on login page (/), redirect to /dashboard
  if (pathname === '/' && token) {
    console.log('PROXY_DEBUG: REDIRECTING_TO_DASHBOARD');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. UNAUTH REDIRECT RULE: If no token and trying to access protected routes, redirect to /
  const protectedRoutes = ['/dashboard', '/settings', '/analytics', '/budget', '/wallets'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    console.log('PROXY_DEBUG: UNAUTH_REDIRECT_TO_HOME');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
