import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

import { pusherServer } from '@/lib/pusher'

// GET - fetch all bookings
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const bookings = await db.collection('bookings').find({}).sort({ bookingDate: -1 }).toArray()

    const serialized = bookings.map(b => ({ ...b, _id: b._id.toString() }))

    return NextResponse.json({ success: true, data: serialized })
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

    const result = await db.collection('bookings').insertOne(booking)
    const insertedBooking = { ...booking, _id: result.insertedId.toString() }

    // Trigger real-time notification for admin
    try {
      await pusherServer.trigger('gkz-admin', 'new-booking', insertedBooking)
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    return NextResponse.json({ success: true, data: insertedBooking, message: 'Booking confirmed!' }, { status: 201 })
  } catch (error) {
    console.error('[GKZ] Error creating booking:', error)
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
  }
}

