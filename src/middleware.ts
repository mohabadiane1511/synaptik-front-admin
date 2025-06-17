import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenData } from "./types/auth";
import { isTokenExpired } from "./lib/session";

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/auth/login",
  "/api/auth/tenant/token",
  "/api/auth/refresh"
];

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/auth/login'
  url.search = `redirect=${encodeURIComponent(request.nextUrl.pathname)}`
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  // Vérifier si la route est publique
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    // Récupérer le token depuis les cookies
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      return redirectToLogin(request);
    }

    const token = JSON.parse(session) as TokenData;

    // Vérifier si le token existe et si l'utilisateur est un ADMIN
    if (!token || token.user_role !== "ADMIN") {
      return redirectToLogin(request);
    }

    // Vérifier si le token est expiré
    if (isTokenExpired(token)) {
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Token expiré" },
          { status: 401 }
        );
      }
      return redirectToLogin(request);
    }

    // Pour les routes API, ajouter le token dans les headers
    if (request.nextUrl.pathname.startsWith("/api")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${token.access_token}`);
      
      if (token.tenant_id) {
        requestHeaders.set("X-Tenant-ID", token.tenant_id.toString());
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Erreur:', error);
    return redirectToLogin(request);
  }
}

// Configurer sur quelles routes le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /*.* (files with extensions)
     */
    '/((?!api/auth|_next|static|[\\w-]+\\.\\w+).*)',
  ],
} 