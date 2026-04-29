import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const VIDEOS_FILE = join(DATA_DIR, 'videos.json')

async function initializeStorage() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    try {
      await readFile(VIDEOS_FILE, 'utf-8')
    } catch {
      const initialData = {
        imikino: [],
        'ubuzima-imirire': [],
        'amateka-umuco': [],
        uburezi: [],
        'abana-1-5': [],
        'abana-5-14': [],
        'short-films': [],
        religion: [],
      }
      await writeFile(VIDEOS_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('[v0] Error initializing storage:', error)
  }
}

async function readVideos() {
  try {
    await initializeStorage()
    const data = await readFile(VIDEOS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[v0] Error reading videos:', error)
    return {
      imikino: [],
      'ubuzima-imirire': [],
      'amateka-umuco': [],
      uburezi: [],
      'abana-1-5': [],
      'abana-5-14': [],
      'short-films': [],
      religion: [],
    }
  }
}

async function writeVideos(data: any) {
  try {
    await initializeStorage()
    await writeFile(VIDEOS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[v0] Error writing videos:', error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'imikino'
    const videoId = parseInt(params.id)

    const videosData = await readVideos()

    if (!videosData[category]) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    const initialLength = videosData[category].length
    videosData[category] = videosData[category].filter((v: any) => v.id !== videoId)

    if (videosData[category].length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }

    // Write updated videos back to file
    await writeVideos(videosData)

    console.log('[v0] Video deleted:', videoId)
    return NextResponse.json(
      { success: true, message: 'Video deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error deleting video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}
