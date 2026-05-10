import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          email: payload.email,
          name: payload.name,
          isAdmin: payload.isAdmin,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}
