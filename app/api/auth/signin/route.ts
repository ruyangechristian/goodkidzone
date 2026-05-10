import { NextRequest, NextResponse } from 'next/server'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    const errors: Record<string, string> = {}

    if (!email || typeof email !== 'string') {
      errors.email = 'Email is required'
    }

    if (!password || typeof password !== 'string') {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    // Check against admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@goodkidzone.rw'
    const adminPassword = process.env.ADMIN_PASSWORD || ''

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password.',
          errors: {
            email: 'Invalid credentials',
          },
        },
        { status: 401 }
      )
    }

    // Create signed session token
    const token = await signToken({
      email: adminEmail,
      name: 'Admin',
      isAdmin: true,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: 'Sign in successful',
        token,
        user: {
          email: adminEmail,
          name: 'Admin',
          isAdmin: true,
        },
      },
      { status: 200 }
    )

    // Set secure HTTP-only cookie
    response.cookies.set(setAuthCookie(token))

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during sign in' },
      { status: 500 }
    )
  }
}
