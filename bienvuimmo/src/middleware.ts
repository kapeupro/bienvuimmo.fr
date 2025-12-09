import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bienvuimmo-secret-key-change-in-production';

// Routes protégées qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
  '/api/properties',
  '/api/contacts',
  '/api/mandates',
  '/api/visits',
];

// Routes publiques (pas besoin d'auth)
const publicRoutes = [
  '/',
  '/connexion',
  '/inscription',
  '/annonces',
  '/contact',
  '/tarifs',
  '/fonctionnalites',
  '/api/auth/login',
  '/api/auth/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Récupérer le token
  const token = request.cookies.get('auth-token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Rediriger vers la page de connexion pour les pages
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
    // Retourner 401 pour les API
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  }

  // Vérifier le token
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Ajouter les infos utilisateur aux headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', (payload as any).userId);
    requestHeaders.set('x-user-email', (payload as any).email);
    requestHeaders.set('x-user-role', (payload as any).role);
    requestHeaders.set('x-agency-id', (payload as any).agencyId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // Token invalide
    if (!pathname.startsWith('/api/')) {
      const response = NextResponse.redirect(new URL('/connexion', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
    return NextResponse.json(
      { error: 'Token invalide ou expiré' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/properties/:path*',
    '/api/contacts/:path*',
    '/api/mandates/:path*',
    '/api/visits/:path*',
  ],
};
