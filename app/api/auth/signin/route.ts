import { NextRequest, NextResponse } from 'next/server'

// Admin credentials - hardcoded for this application
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'Amadoullah@12'

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

    // Check against admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password. Only the admin account can sign in.',
          errors: {
            email: 'Invalid credentials',
          },
        },
        { status: 401 }
      )
    }

    // Create session token for valid admin credentials
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const response = NextResponse.json(
      {
        success: true,
        message: 'Sign in successful',
        token: sessionToken,
        user: {
          email: email,
          name: 'Admin',
          isAdmin: true,
        },
      },
      { status: 200 }
    )

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during sign in' },
      { status: 500 }
    )
  }
}
