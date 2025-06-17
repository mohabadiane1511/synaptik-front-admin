import { Token, TokenData } from "@/types/auth";
import Cookies from "js-cookie";
import axios from "axios";

const REFRESH_THRESHOLD = 60; // Rafraîchir le token 60 secondes avant expiration

export const tokenService = {
  saveToken(token: Token) {
    console.log("[TokenService] Token reçu:", {
      user_id: token.user_id,
      expires_in: token.expires_in,
      refresh_token_expires_in: token.refresh_token_expires_in
    });

    // S'assurer que les valeurs d'expiration sont des nombres
    const expiresIn = typeof token.expires_in === 'number' ? token.expires_in : parseInt(token.expires_in as any);
    const refreshExpiresIn = typeof token.refresh_token_expires_in === 'number' ? token.refresh_token_expires_in : parseInt(token.refresh_token_expires_in as any);

    const tokenData: TokenData = {
      ...token,
      expires_at: Date.now() + (expiresIn * 1000),
      refresh_token_expires_at: Date.now() + (refreshExpiresIn * 1000)
    };

    console.log("[TokenService] Timestamps calculés:", {
      expires_at: new Date(tokenData.expires_at).toISOString(),
      refresh_token_expires_at: new Date(tokenData.refresh_token_expires_at).toISOString()
    });

    Cookies.set("token", JSON.stringify(tokenData), {
      expires: new Date(tokenData.refresh_token_expires_at),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });
    console.log("[TokenService] Cookie sauvegardé avec succès");
  },

  getToken(): TokenData | null {
    try {
      const tokenStr = Cookies.get("token");
      console.log("[TokenService] Lecture du token:", !!tokenStr);
      if (!tokenStr) return null;
      return JSON.parse(tokenStr);
    } catch (error) {
      console.error("[TokenService] Erreur lors de la lecture du token:", error);
      this.removeToken(); // Supprimer le token invalide
      return null;
    }
  },

  removeToken() {
    console.log("[TokenService] Suppression du token");
    Cookies.remove("token", { path: "/" });
  },

  isTokenExpired(token: TokenData): boolean {
    return Date.now() >= token.expires_at - REFRESH_THRESHOLD * 1000;
  },

  isRefreshTokenExpired(token: TokenData): boolean {
    return Date.now() >= token.refresh_token_expires_at;
  },

  async refreshToken(): Promise<TokenData | null> {
    const currentToken = this.getToken();
    
    if (!currentToken || this.isRefreshTokenExpired(currentToken)) {
      this.removeToken();
      return null;
    }

    try {
      const response = await axios.post<Token>("/api/auth/refresh", {
        refresh_token: currentToken.refresh_token
      });

      const newToken = response.data;
      this.saveToken(newToken);
      return this.getToken();
    } catch (error) {
      this.removeToken();
      return null;
    }
  },

  async getValidToken(): Promise<TokenData | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    if (this.isRefreshTokenExpired(token)) {
      this.removeToken();
      return null;
    }

    if (this.isTokenExpired(token)) {
      return this.refreshToken();
    }

    return token;
  }
}; 