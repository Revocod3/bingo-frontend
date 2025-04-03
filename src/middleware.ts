import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  
  const { pathname } = req.nextUrl;
  
  // Agregar logs para depuración
  console.log(`Middleware - Path: ${pathname}, Authenticated: ${isAuthenticated}`);
  
  // Proteger rutas que requieren autenticación
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    console.log('Middleware - Redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  // Redirigir a los usuarios autenticados lejos de páginas de auth
  if ((pathname.startsWith('/auth/login') || pathname === '/') && isAuthenticated) {
    console.log('Middleware - Redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
}

// Configurar qué rutas usa este middleware
export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
};
