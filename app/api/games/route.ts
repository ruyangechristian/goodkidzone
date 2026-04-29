import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Game, ApiResponse } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const gamesCollection = db.collection('games')

    const games = await gamesCollection
      .find({})
      .sort({ id: 1 })
      .toArray()

    console.log('[v0] Fetched games. Count:', games.length)

    return NextResponse.json(
      { success: true, data: games } as ApiResponse<Game[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching games:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch games' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    console.log('[v0] Game added successfully:', result.insertedId)

    return NextResponse.json(
      { success: true, data: { ...newGame, _id: result.insertedId } } as ApiResponse<Game>,
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
