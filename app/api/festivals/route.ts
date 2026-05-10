import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'

// GET - fetch all festivals
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const festivals = await db.collection('festivals').find({}).sort({ date: 1 }).toArray()

    return NextResponse.json({ success: true, data: festivals })
  } catch (error) {
    console.error('[GKZ] Error fetching festivals:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch festivals' }, { status: 500 })
  }
}

// POST - create a new festival
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, time, location, image, ticketPrice, availableTickets, category } = body

    if (!title || !date) {
      return NextResponse.json({ success: false, error: 'Title and date are required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const maxIdDoc = await db.collection('festivals').find().sort({ id: -1 }).limit(1).toArray()
    const newId = maxIdDoc.length > 0 ? (maxIdDoc[0].id || 0) + 1 : 1

    const festival = {
      id: newId,
      title,
      description: description || '',
      date,
      time: time || '',
      location: location || '',
      image: image || '',
      ticketPrice: ticketPrice || 0,
      availableTickets: availableTickets || 0,
      category: category || 'Event',
      createdAt: new Date(),
    }

    await db.collection('festivals').insertOne(festival)

    return NextResponse.json({ success: true, data: festival }, { status: 201 })
  } catch (error) {
    console.error('[GKZ] Error creating festival:', error)
    return NextResponse.json({ success: false, error: 'Failed to create festival' }, { status: 500 })
  }
}
