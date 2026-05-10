import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

// GET - fetch all bookings
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const bookings = await db.collection('bookings').find({}).sort({ bookingDate: -1 }).toArray()

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    console.error('[GKZ] Error fetching bookings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST - create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, quantity, customerName, email } = body

    if (!eventId || !quantity || !customerName || !email) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const booking = {
      eventId,
      quantity,
      customerName,
      email,
      bookingDate: new Date().toISOString(),
      createdAt: new Date(),
    }

    await db.collection('bookings').insertOne(booking)

    return NextResponse.json({ success: true, data: booking, message: 'Booking confirmed!' }, { status: 201 })
  } catch (error) {
    console.error('[GKZ] Error creating booking:', error)
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
  }
}
