import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Registration is disabled — admin-only access
  return NextResponse.json(
    {
      success: false,
      error: 'Registration is disabled. Only the admin account can access this platform.',
    },
    { status: 403 }
  )
}
