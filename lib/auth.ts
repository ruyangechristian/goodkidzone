import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback_dev_secret'

// Simple token encoding: base64(JSON payload) + "." + base64(HMAC signature)
// Not a full JWT library — intentionally lightweight for this project

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function fromBase64url(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8')
}

async function hmacSign(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Buffer.from(signature).toString('base64url')
}

export interface TokenPayload {
  email: string
  name: string
  isAdmin: boolean
  exp: number
}

export async function signToken(payload: Omit<TokenPayload, 'exp'>): Promise<string> {
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  const encoded = base64url(JSON.stringify(fullPayload))
  const signature = await hmacSign(encoded)
  return `${encoded}.${signature}`
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) return null

    const expectedSig = await hmacSign(encoded)
    if (signature !== expectedSig) return null

    const payload: TokenPayload = JSON.parse(fromBase64url(encoded))

    // Check expiry
    if (payload.exp < Date.now()) return null

    return payload
  } catch {
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(token: string): { name: string; value: string; httpOnly: boolean; secure: boolean; sameSite: 'lax'; maxAge: number; path: string } {
  return {
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
}
