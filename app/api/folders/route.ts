import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const FOLDERS_FILE = join(DATA_DIR, 'folders.json')

async function initializeStorage() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    try {
      await readFile(FOLDERS_FILE, 'utf-8')
    } catch {
      // File doesn't exist, create it with initial data
      const initialData = {
        imikino: {
          image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
          color: 'from-red-400 to-pink-500'
        },
        'ubuzima-imirire': {
          image: 'https://images.unsplash.com/photo-1505576399279-565b52ce32f0?w=400&h=300&fit=crop',
          color: 'from-green-400 to-emerald-500'
        },
        'amateka-umuco': {
          image: 'https://images.unsplash.com/photo-1514306688772-cfb6f251a545?w=400&h=300&fit=crop',
          color: 'from-amber-400 to-orange-500'
        },
        uburezi: {
          image: 'https://images.unsplash.com/photo-1427504494785-cdaa41d4d527?w=400&h=300&fit=crop',
          color: 'from-blue-400 to-cyan-500'
        },
        'abana-1-5': {
          image: 'https://images.unsplash.com/photo-1503454537688-e47a1d299287?w=400&h=300&fit=crop',
          color: 'from-purple-400 to-pink-500'
        },
        'abana-5-14': {
          image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
          color: 'from-indigo-400 to-blue-500'
        }
      }
      await writeFile(FOLDERS_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('[v0] Error initializing storage:', error)
  }
}

async function readFolders() {
  try {
    await initializeStorage()
    const data = await readFile(FOLDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[v0] Error reading folders:', error)
    return {}
  }
}

async function writeFolders(data: any) {
  try {
    await initializeStorage()
    await writeFile(FOLDERS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[v0] Error writing folders:', error)
  }
}

export async function GET() {
  try {
    const foldersData = await readFolders()
    return NextResponse.json({ success: true, data: foldersData }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching folders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch folders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { folderId, image } = body

    if (!folderId || !image) {
      return NextResponse.json(
        { success: false, error: 'Folder ID and image URL are required' },
        { status: 400 }
      )
    }

    const foldersData = await readFolders()
    
    if (!foldersData[folderId]) {
      return NextResponse.json(
        { success: false, error: 'Folder not found' },
        { status: 404 }
      )
    }

    // Update folder image
    foldersData[folderId].image = image

    await writeFolders(foldersData)

    return NextResponse.json(
      { success: true, message: 'Folder image updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error updating folder:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update folder' },
      { status: 500 }
    )
  }
}
