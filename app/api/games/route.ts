import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { Game, ApiResponse } from '@/lib/models'
import { pusherServer } from '@/lib/pusher'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()
    const gamesCollection = db.collection('games')

    const total = await gamesCollection.countDocuments({})
    const games = await gamesCollection
      .find({})
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const serialized = games.map((g) => ({ ...g, _id: g._id.toString() }))

    return NextResponse.json(
      { 
        success: true, 
        data: serialized,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      } as unknown as ApiResponse<Game[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('[GKZ] Error fetching games:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<null>,
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, rating, category, premium, color, image } = body

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, category' } as ApiResponse<null>,
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const gamesCollection = db.collection('games')

    // Get the next ID
    const lastGame = await gamesCollection
      .findOne({}, { sort: { id: -1 } })
    const nextId = (lastGame?.id || 0) + 1

    const newGame: Game = {
      id: nextId,
      title,
      description: description || '',
      rating: rating || 0,
      category,
      premium: premium || false,
      color: color || 'bg-blue-400',
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await gamesCollection.insertOne(newGame)
    const insertedGame = { ...newGame, _id: result.insertedId.toString() }

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-games', 'game-update', { message: 'New game added' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    console.log('[v0] Game added successfully:', result.insertedId)

    return NextResponse.json(
      { success: true, data: insertedGame } as unknown as ApiResponse<Game>,
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error adding game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add game' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
