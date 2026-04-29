import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Video, ApiResponse } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'imikino'

    const { db } = await connectToDatabase()
    const videosCollection = db.collection('videos')

    const videos = await videosCollection
      .find({ category })
      .sort({ createdAt: -1 })
      .toArray()

    console.log('[v0] Fetched videos for category:', category, 'Count:', videos.length)

    return NextResponse.json(
      { success: true, data: videos } as ApiResponse<Video[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching videos:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, youtubeUrl, duration, category, image, folder } = body

    // Validate required fields
    if (!title || !youtubeUrl || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, youtubeUrl, category' } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Extract video ID from YouTube URL
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    const videoId = videoIdMatch ? videoIdMatch[1] : null

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Could not extract video ID from YouTube URL' } as ApiResponse<null>,
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const videosCollection = db.collection('videos')

    // Get the next ID
    const lastVideo = await videosCollection
      .findOne({}, { sort: { id: -1 } })
    const nextId = (lastVideo?.id || 0) + 1

    const newVideo: Video = {
      id: nextId,
      title,
      description: description || '',
      youtubeUrl,
      videoId,
      duration: duration || 'Unknown',
      category,
      image: image || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      folder: folder || category,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await videosCollection.insertOne(newVideo)

    console.log('[v0] Video added successfully:', result.insertedId)

    return NextResponse.json(
      { success: true, data: { ...newVideo, _id: result.insertedId } } as ApiResponse<Video>,
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error adding video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add video' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
