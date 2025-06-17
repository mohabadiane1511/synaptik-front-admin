import axios from "axios";
import { LoginRequest, Token } from "@/types/auth";
import { tokenService } from "./token";

// Configurer axios pour utiliser automatiquement le token
axios.interceptors.request.use(async (config) => {
  const token = await tokenService.getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token.access_token}`;
    if (token.tenant_id) {
      config.headers["X-Tenant-ID"] = token.tenant_id.toString();
    }
  }
  return config;
});

// Intercepter les erreurs 401 pour rafraîchir le token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = await tokenService.refreshToken();
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
        return axios(originalRequest);
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
    console.log("[AuthService] Réponse du backend:", response.data);
    const token = response.data;
    
    if (token.user_role !== "ADMIN") {
      throw new Error("Accès non autorisé");
    }

    // Définir des valeurs par défaut pour l'expiration
    const tokenWithExpiry: Token = {
      ...token,
      expires_in: 3600, // 1 heure par défaut
      refresh_token_expires_in: 86400 // 24 heures par défaut
    };

    tokenService.saveToken(tokenWithExpiry);
    return tokenWithExpiry;
  },

  getToken() {
    return tokenService.getToken();
  },

  isAuthenticated(): boolean {
    const token = tokenService.getToken();
    return !!token && token.user_role === "ADMIN" && !tokenService.isTokenExpired(token);
  },

  async logout() {
    tokenService.removeToken();
    window.location.href = "/auth/login";
  }
}; 