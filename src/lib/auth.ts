import axios from "axios";
import { LoginRequest, Token, TokenData } from "@/types/auth";
import { createSession, deleteSession, getSession } from "./session";

// Configurer axios pour utiliser automatiquement le token
axios.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
    if (session.tenant_id) {
      config.headers["X-Tenant-ID"] = session.tenant_id.toString();
    }
  }
  return config;
});

// Intercepter les erreurs 401 pour rafraîchir le token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true;

      try {
        const session = await getSession();
        if (!session) {
          throw new Error('No session found');
        }

        // Tenter de rafraîchir le token
        const response = await axios.post("/api/auth/refresh", {
          refresh_token: session.refresh_token
        });

        const newToken = response.data;
        const tokenData: TokenData = {
          ...newToken,
          expires_at: Date.now() + ((newToken.expires_in || 3600) * 1000),
          refresh_token_expires_at: Date.now() + ((newToken.refresh_token_expires_in || 86400) * 1000)
        };

        await createSession(tokenData);
        
        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("[Auth] Erreur refresh token:", refreshError);
        await deleteSession();
        if (typeof window !== 'undefined') {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: LoginRequest): Promise<Token> {
    const response = await axios.post<Token>(
      "/api/auth/tenant/token",
      data
    );
    
    const token = response.data;
    
    if (token.user_role !== "ADMIN") {
      throw new Error("Accès non autorisé");
    }

    const tokenData: TokenData = {
      ...token,
      expires_in: token.expires_in || 3600,
      refresh_token_expires_in: token.refresh_token_expires_in || 86400,
      expires_at: Date.now() + ((token.expires_in || 3600) * 1000),
      refresh_token_expires_at: Date.now() + ((token.refresh_token_expires_in || 86400) * 1000)
    };

    await createSession(tokenData);

    return token;
  },

  async getToken() {
    return getSession();
  },

  async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session && session.user_role === "ADMIN" && Date.now() < session.expires_at;
  },

  async logout() {
    await deleteSession();
    window.location.href = "/auth/login";
  }
}; 