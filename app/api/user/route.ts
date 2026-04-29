import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
      return NextResponse.json(
        { authenticated: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Return mock user data (in production, validate token and fetch real user data)
    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: 'user_123',
          email: 'user@example.com',
          name: 'User',
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
