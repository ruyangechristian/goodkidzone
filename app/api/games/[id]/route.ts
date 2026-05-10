import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection('games')

    // Try to delete by ObjectId first, then by numeric id
    let result
    try {
      result = await collection.deleteOne({ _id: new ObjectId(id) })
    } catch {
      result = await collection.deleteOne({ id: parseInt(id) })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Game deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[GKZ] Error deleting game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete game' },
      { status: 500 }
    )
  }
}
