import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Obtener el token y verificar su validez
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Un token es válido si existe y no está expirado
  const isTokenValid = !!token && (token.exp ? Date.now() < Number(token.exp) * 1000 : true);

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
    // Si el token existía pero expiró, mostrar un mensaje
    if (token && token.exp && Date.now() > Number(token.exp) * 1000) {
      // Redirigir a login con parámetro de sesión expirada para mostrar mensaje
      return NextResponse.redirect(new URL('/auth/login?expired=true', req.url));
    }

    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirigir a los usuarios autenticados lejos de páginas de auth
  if ((pathname.startsWith('/auth/login') || pathname === '/') && isTokenValid) {
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
