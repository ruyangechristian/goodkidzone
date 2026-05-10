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
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { db } = await connectToDatabase()

    let result
    try {
      result = await db.collection('festivals').deleteOne({ _id: new ObjectId(id) })
    } catch {
      result = await db.collection('festivals').deleteOne({ id: parseInt(id) })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Festival not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Festival deleted' })
  } catch (error) {
    console.error('[GKZ] Error deleting festival:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete festival' }, { status: 500 })
  }
}
