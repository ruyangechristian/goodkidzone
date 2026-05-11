import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { pusherServer } from '@/lib/pusher'
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
    const collection = db.collection('products')

    let result
    try {
      result = await collection.deleteOne({ _id: new ObjectId(id) })
    } catch {
      result = await collection.deleteOne({ id: parseInt(id) })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-shop', 'product-update', { message: 'Product deleted' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[GKZ] Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const body = await request.json()
    const { name, price, rating, category, image } = body

    const { db } = await connectToDatabase()
    const collection = db.collection('products')

    const updateData: any = {
      updatedAt: new Date()
    }
    if (name) updateData.name = name
    if (price !== undefined) updateData.price = parseFloat(price.toString())
    if (rating !== undefined) updateData.rating = parseFloat(rating.toString())
    if (category) updateData.category = category
    if (image !== undefined) updateData.image = image

    let result
    try {
      result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )
    } catch {
      result = await collection.updateOne(
        { id: parseInt(id) },
        { $set: updateData }
      )
    }

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-shop', 'product-update', { message: 'Product updated' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    return NextResponse.json(
      { success: true, message: 'Product updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[GKZ] Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

