import { TokenData } from '@/types/auth'
import Cookies from 'js-cookie'

const COOKIE_NAME = 'session'
const MAX_AGE = 7 * 24 * 60 * 60 // 7 jours

export async function createSession(token: TokenData) {
  try {
    Cookies.set(COOKIE_NAME, JSON.stringify(token), {
      expires: new Date(token.refresh_token_expires_at),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  } catch (error) {
    console.error('[Session] Erreur lors de la création de la session:', error)
    throw error
  }
}

export async function getSession(): Promise<TokenData | null> {
  try {
    const session = Cookies.get(COOKIE_NAME)

    if (!session) {
      return null
    }

    return JSON.parse(session) as TokenData
  } catch (error) {
    console.error('[Session] Erreur lors de la lecture de la session:', error)
    return null
  }
}

export async function updateSession(token: TokenData) {
  await createSession(token)
}

export async function deleteSession() {
  try {
    Cookies.remove(COOKIE_NAME, { path: '/' })
  } catch (error) {
    console.error('[Session] Erreur lors de la suppression de la session:', error)
  }
}

// Fonction utilitaire pour vérifier si un token est expiré
export function isTokenExpired(token: TokenData): boolean {
  return Date.now() >= token.expires_at
}

// Fonction utilitaire pour vérifier si un refresh token est expiré
export function isRefreshTokenExpired(token: TokenData): boolean {
  return Date.now() >= token.refresh_token_expires_at
} 