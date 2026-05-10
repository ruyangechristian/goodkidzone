import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// PUT - update/rename a folder
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, nameEn, description, image, color, slug } = body

    const { db } = await connectToDatabase()

    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (name) update.name = name
    if (nameEn) update.nameEn = nameEn
    if (description !== undefined) update.description = description
    if (image !== undefined) update.image = image
    if (color) update.color = color
    if (slug) update.slug = slug

    let result
    try {
      result = await db.collection('folders').updateOne({ _id: new ObjectId(id) }, { $set: update })
    } catch {
      result = await db.collection('folders').updateOne({ slug: id }, { $set: update })
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Folder not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Folder updated' })
  } catch (error) {
    console.error('[GKZ] Error updating folder:', error)
    return NextResponse.json({ success: false, error: 'Failed to update folder' }, { status: 500 })
  }
}

// DELETE - delete a folder
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
      result = await db.collection('folders').deleteOne({ _id: new ObjectId(id) })
    } catch {
      result = await db.collection('folders').deleteOne({ slug: id })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Folder not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Folder deleted' })
  } catch (error) {
    console.error('[GKZ] Error deleting folder:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete folder' }, { status: 500 })
  }
}
