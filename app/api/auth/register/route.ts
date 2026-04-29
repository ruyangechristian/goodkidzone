import { NextRequest, NextResponse } from 'next/server'

// In-memory user store (for development - replace with database in production)
const users: Map<string, { id: string; email: string; password: string; name: string; createdAt: Date }> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, confirmPassword, name } = body

    // Validation
    const errors: Record<string, string> = {}

    if (!email || typeof email !== 'string') {
      errors.email = 'Valid email is required'
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email format'
    }

    if (!password || typeof password !== 'string') {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.name = 'Name is required'
    }

    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      errors.email = 'Email already registered'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: password, // In production, hash this with bcrypt
      name: name.trim(),
      createdAt: new Date(),
    }

    users.set(email.toLowerCase(), newUser)

    // Create auth token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful!',
        token: sessionToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
