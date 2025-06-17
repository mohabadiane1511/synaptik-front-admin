export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface LoginRequest {
  email: string;
  password: string;
  tenant_slug: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_role: UserRole;
  tenant_id?: number;
  tenant_name?: string;
  tenant_slug?: string;
  user_id: number;
  expires_in?: number; // Optionnel car ajouté côté client
  refresh_token_expires_in?: number; // Optionnel car ajouté côté client
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthError {
  detail: string;
  status: number;
}

export interface TokenData extends Token {
  expires_at: number; // timestamp d'expiration
  refresh_token_expires_at: number; // timestamp d'expiration du refresh token
} 