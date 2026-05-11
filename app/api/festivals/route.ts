import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { pusherServer } from '@/lib/pusher'


// GET - fetch all festivals with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()
    const festivalsCollection = db.collection('festivals')

    const total = await festivalsCollection.countDocuments({})
    const festivals = await festivalsCollection
      .find({})
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const serialized = festivals.map((f) => ({ ...f, _id: f._id.toString() }))

    return NextResponse.json({ 
      success: true, 
      data: serialized,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    })
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

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-festivals', 'festival-update', { message: 'New event added' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    return NextResponse.json({ success: true, data: festival }, { status: 201 })
  } catch (error) {
    console.error('[GKZ] Error creating festival:', error)
    return NextResponse.json({ success: false, error: 'Failed to create festival' }, { status: 500 })
  }
}

