import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const [gamesCount, productsCount, videosCount, festivalsCount, bookingsCount] = await Promise.all([
      db.collection('games').countDocuments(),
      db.collection('products').countDocuments(),
      db.collection('videos').countDocuments(),
      db.collection('festivals').countDocuments(),
      db.collection('bookings').countDocuments(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        games: gamesCount,
        products: productsCount,
        videos: videosCount,
        festivals: festivalsCount,
        bookings: bookingsCount,
      },
    })
  } catch (error) {
    console.error('[GKZ] Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
