import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { pusherServer } from '@/lib/pusher'
import { ObjectId } from 'mongodb'

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
    const { title, description, youtubeUrl, duration, category, image, folder } = body

    const { db } = await connectToDatabase()
    const videosCollection = db.collection('videos')

    // Find the video first
    const existingVideo = await videosCollection.findOne({ 
      $or: [
        { _id: ObjectId.isValid(id) ? new ObjectId(id) : undefined },
        { id: parseInt(id) || -1 }
      ]
    })

    if (!existingVideo) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date()
    }

    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (duration) updateData.duration = duration
    if (category) updateData.category = category
    if (image) updateData.image = image
    if (folder) updateData.folder = folder
    
    if (youtubeUrl && youtubeUrl !== existingVideo.youtubeUrl) {
      updateData.youtubeUrl = youtubeUrl
      // Extract new video ID
      const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
      const videoId = videoIdMatch ? videoIdMatch[1] : null
      if (videoId) {
        updateData.videoId = videoId
        if (!image) {
          updateData.image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      }
    }

    await videosCollection.updateOne(
      { _id: existingVideo._id },
      { $set: updateData }
    )

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-videos', 'video-update', { message: 'Video updated' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    return NextResponse.json({ success: true, message: 'Video updated successfully' })
  } catch (error) {
    console.error('[GKZ] Error updating video:', error)
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 })
  }
}

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
    const videosCollection = db.collection('videos')

    const result = await videosCollection.deleteOne({ 
      $or: [
        { _id: ObjectId.isValid(id) ? new ObjectId(id) : undefined },
        { id: parseInt(id) || -1 }
      ]
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-videos', 'video-update', { message: 'Video deleted' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' })
  } catch (error) {
    console.error('[GKZ] Error deleting video:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 })
  }
}

