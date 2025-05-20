import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Obtener el token y verificar su validez
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Distinguir entre "sin token" y "token expirado"
  const hasToken = !!token;
  const isTokenExpired = hasToken && token.exp ? Date.now() > Number(token.exp) * 1000 : false;
  const isTokenValid = hasToken && !isTokenExpired;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/verify-email',
    '/',
    '/terms',
    '/privacy',
    '/contact',
  ];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Si es una ruta protegida y el token no es válido, redirigir al login
  if (!isPublicRoute && !isTokenValid) {
    // Solo mostrar mensaje de expiración si realmente había un token que expiró
    if (hasToken && isTokenExpired) {
      // Redirigir a login con parámetro de sesión expirada para mostrar mensaje
      return NextResponse.redirect(new URL('/auth/login?expired=true', req.url));
    }
    
    // Sin token, simplemente redirigir al login sin mensaje de error
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirigir a los usuarios autenticados lejos de páginas de auth, pero permitir landing page (/)
  if (pathname.startsWith('/auth/login') && isTokenValid) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Configurar qué rutas usa este middleware
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/:path*',
    '/events/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};
