import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json')

async function initializeStorage() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    try {
      await readFile(BOOKINGS_FILE, 'utf-8')
    } catch {
      const initialData = { bookings: [] }
      await writeFile(BOOKINGS_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('[v0] Error initializing bookings storage:', error)
  }
}

async function readBookings() {
  try {
    await initializeStorage()
    const data = await readFile(BOOKINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[v0] Error reading bookings:', error)
    return { bookings: [] }
  }
}

async function writeBookings(data: any) {
  try {
    await initializeStorage()
    await writeFile(BOOKINGS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[v0] Error writing bookings:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const bookingsData = await readBookings()
    return NextResponse.json(
      { success: true, data: bookingsData.bookings },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, quantity, customerName, email } = body

    if (!eventId || !quantity || !customerName || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const newBooking = {
      id: Date.now(),
      eventId,
      quantity,
      customerName,
      email,
      bookingDate: new Date().toISOString(),
      confirmationCode: `BK${Date.now().toString().slice(-8)}`,
    }

    const bookingsData = await readBookings()
    bookingsData.bookings.push(newBooking)
    await writeBookings(bookingsData)

    console.log('[v0] Booking created:', newBooking.id)
    
    return NextResponse.json(
      {
        success: true,
        data: newBooking,
        message: `Booking confirmed! Your confirmation code is ${newBooking.confirmationCode}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
