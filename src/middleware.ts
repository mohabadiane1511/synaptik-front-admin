import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenData } from "./types/auth";

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/auth/login",
  "/api/auth/tenant/token",
  "/api/auth/refresh"
];

export async function middleware(request: NextRequest) {
  console.log("[Middleware] URL demandée:", request.nextUrl.pathname);
  
  // Vérifier si la route est publique
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log("[Middleware] Route publique détectée");
    return NextResponse.next();
  }

  try {
    // Récupérer le token depuis les cookies
    const tokenStr = request.cookies.get("token")?.value;
    console.log("[Middleware] Token trouvé dans les cookies:", !!tokenStr);
    
    if (!tokenStr) {
      console.log("[Middleware] Pas de token, redirection vers login");
      return handleUnauthorized(request);
    }

    const token = JSON.parse(tokenStr) as TokenData;
    console.log("[Middleware] Role utilisateur:", token.user_role);
    console.log("[Middleware] Token expires_at:", new Date(token.expires_at).toISOString());

    // Vérifier si le token existe et si l'utilisateur est un ADMIN
    if (!token || token.user_role !== "ADMIN") {
      console.log("[Middleware] Utilisateur non admin");
      return handleUnauthorized(request);
    }

    // Vérifier si le token est expiré
    if (Date.now() >= token.expires_at) {
      // Pour les routes API, renvoyer une erreur 401
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Token expiré" },
          { status: 401 }
        );
      }
      // Pour les routes frontend, rediriger vers la page de login
      return redirectToLogin(request);
    }

    // Pour les routes API, ajouter le token dans les headers
    if (request.nextUrl.pathname.startsWith("/api")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${token.access_token}`);
      
      // Ajouter le tenant_id si disponible
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
    return handleUnauthorized(request);
  }
}

function handleUnauthorized(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }
  return redirectToLogin(request);
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}; 