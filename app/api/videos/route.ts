import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { Video, ApiResponse } from '@/lib/models'
import { pusherServer } from '@/lib/pusher'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const folder = searchParams.get('folder')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()
    const videosCollection = db.collection('videos')

    let query: any = {}
    
    if (folder) {
      // Fetch specific folder (support legacy where folder slug was saved in category)
      query = { 
        $or: [
          { folder: folder },
          { category: folder }
        ]
      }
    } else if (category && category !== 'all' && category !== '') {
      // Fallback for Admin "All Content" tabs that request by broad category
      if (category === 'religion') {
        query = { $or: [{ type: 'religion' }, { category: { $in: ['inyigisho-gikristo', 'inyigisho-quran', 'iyobokamana', 'INYIGISHO ZA GIKRISTO', 'INYIGISHO ZA QURAN', 'NI IYOBOKAMANA'] } }] }
      } else if (category === 'short-films') {
        query = { $or: [{ type: 'short-film' }, { category: { $in: ['ubuzima', 'imirire-myiza', 'amateka', 'uburezi-films', 'abana-1-5-films', 'abana-5-14-films', 'UBUZIMA', 'IMIRIRE MYIZA', 'AMATEKA', 'UBUREZI', "FILM Z'ABANA IMYAKA 1-5", "VIDEWO Z'ABANA 5-14"] } }] }
      } else {
        query = { $or: [{ type: category }, { category }] }
      }
    }

    const total = await videosCollection.countDocuments(query)
    const videos = await videosCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    console.log('[GKZ] Fetched videos for category:', category, 'Count:', videos.length)

    const serialized = videos.map((v) => ({ ...v, _id: v._id.toString() }))

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
      } as unknown as ApiResponse<Video[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('[GKZ] Error fetching videos:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' } as ApiResponse<null>,
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
    const { title, titleEn, description, descriptionEn, youtubeUrl, duration, category, image, folder } = body

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
      titleEn: titleEn || '',
      description: description || '',
      descriptionEn: descriptionEn || '',
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
    const insertedVideo = { ...newVideo, _id: result.insertedId.toString() }

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-videos', 'video-update', { message: 'New video added' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    console.log('[GKZ] Video added successfully:', result.insertedId)

    return NextResponse.json(
      { success: true, data: insertedVideo } as unknown as ApiResponse<Video>,
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
