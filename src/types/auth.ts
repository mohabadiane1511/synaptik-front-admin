import * as z from "zod";

export type UserRole = "ADMIN" | "USER";

export interface LoginRequest {
  email: string;
  password: string;
  tenant_slug: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
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
  expires_in?: number;
  refresh_token_expires_in?: number;
}

export interface AuthError {
  detail: string;
  status: number;
}

export interface TokenData extends Token {
  expires_at: number;
  refresh_token_expires_at: number;
}

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  tenant_slug: z.string().min(1, "Le slug du tenant est requis"),
});

export type LoginForm = z.infer<typeof loginSchema>; 