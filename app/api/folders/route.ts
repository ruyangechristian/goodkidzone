import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'

// Default folders by type (seeded if collection is empty)
const defaultFolders = [
  // Video folders
  { slug: 'imikino', name: 'Imikino', nameEn: 'Movies', description: 'Abakinnyi bapfuye kandi nkarangikira', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop', color: 'from-red-400 to-pink-500', order: 1, type: 'video' },
  { slug: 'ubuzima-imirire', name: 'Ubuzima (Imirire myiza)', nameEn: 'Health & Wellness', description: "Ibihe byimirire myiza n'indwara zitagwayo", image: 'https://images.unsplash.com/photo-1505576399279-565b52ce32f0?w=400&h=300&fit=crop', color: 'from-green-400 to-emerald-500', order: 2, type: 'video' },
  { slug: 'amateka-umuco', name: "Amateka n'Umuco", nameEn: 'History & Culture', description: "Amateka y'u Rwanda n'umuco nyarwanda", image: 'https://images.unsplash.com/photo-1514306688772-cfb6f251a545?w=400&h=300&fit=crop', color: 'from-amber-400 to-orange-500', order: 3, type: 'video' },
  { slug: 'uburezi', name: 'Uburezi', nameEn: 'Education', description: 'Ibigiriro byo kugutsinda mu nzira', image: 'https://images.unsplash.com/photo-1427504494785-cdaa41d4d527?w=400&h=300&fit=crop', color: 'from-blue-400 to-cyan-500', order: 4, type: 'video' },
  { slug: 'abana-1-5', name: "Videwo z'Abana 1-5", nameEn: 'Kids 1-5 Years', description: 'Ibigiriro byiza kuri abana ba miaka 1-5', image: 'https://images.unsplash.com/photo-1503454537688-e47a1d299287?w=400&h=300&fit=crop', color: 'from-purple-400 to-pink-500', order: 5, type: 'video' },
  { slug: 'abana-5-14', name: "Videwo z'Abana 5-14", nameEn: 'Kids 5-14 Years', description: 'Ibigiriro byiza kuri abana ba miaka 5-14', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop', color: 'from-indigo-400 to-blue-500', order: 6, type: 'video' },

  // Short Film folders
  { slug: 'ubuzima', name: 'Ubuzima', nameEn: 'Life & Living', description: "Imibereho yo murugo nuko umwana yitara", image: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&h=300&fit=crop', color: 'from-emerald-400 to-teal-500', order: 1, type: 'short-film' },
  { slug: 'imirire-myiza', name: 'Imirire Myiza', nameEn: 'Healthy Nutrition', description: "Uko umubyeyi yakira umwana n'imirire myiza", image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=300&fit=crop', color: 'from-lime-400 to-green-500', order: 2, type: 'short-film' },
  { slug: 'amateka', name: 'Amateka', nameEn: 'History & Heritage', description: "Igisha umwana ikinyarwanda kiboneye n'amateka", image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=400&h=300&fit=crop', color: 'from-amber-400 to-yellow-500', order: 3, type: 'short-film' },
  { slug: 'uburezi-films', name: 'Uburezi', nameEn: 'Educational Films', description: "Uko umwana yiga mu rugo akanezererwa", image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', color: 'from-blue-400 to-indigo-500', order: 4, type: 'short-film' },
  { slug: 'abana-1-5-films', name: "Film z'Abana 1-5", nameEn: 'Films for Kids 1-5', description: "Filime zishimishije z'abana bato ba miaka 1-5", image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop', color: 'from-pink-400 to-rose-500', order: 5, type: 'short-film' },
  { slug: 'abana-5-14-films', name: "Videwo z'Abana 5-14", nameEn: 'Videos for Kids 5-14', description: "Videwo n'amafilime by'abana ba miaka 5-14", image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=300&fit=crop', color: 'from-violet-400 to-purple-500', order: 6, type: 'short-film' },

  // Religion folders
  { slug: 'inyigisho-gikristo', name: 'Inyigisho za Gikristo', nameEn: 'Christian Teachings', description: "Reba video wigishe umwana ibijyanye na Bible", image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop', color: 'from-sky-400 to-blue-500', order: 1, type: 'religion' },
  { slug: 'inyigisho-quran', name: 'Inyigisho za Quran', nameEn: 'Quranic Teachings', description: "Reba video wigishe umwana ibijyanye na Islam", image: 'https://images.unsplash.com/photo-1585036156171-384164a8c6c4?w=400&h=300&fit=crop', color: 'from-emerald-400 to-green-500', order: 2, type: 'religion' },
  { slug: 'iyobokamana', name: 'Ni Iyobokamana', nameEn: 'Faith & Spirituality', description: "Ese wifuza kumenya ibijyanye n'iyobokamana?", image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop', color: 'from-amber-400 to-orange-500', order: 3, type: 'religion' },
]

// GET - fetch folders, optionally filtered by type
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const { db } = await connectToDatabase()

    const query = type ? { type } : {}
    let folders = await db.collection('folders').find(query).sort({ order: 1 }).toArray()

    // Seed defaults if collection is completely empty
    if (folders.length === 0) {
      const existing = await db.collection('folders').countDocuments()
      if (existing === 0) {
        await db.collection('folders').insertMany(defaultFolders.map(f => ({ ...f, createdAt: new Date() })))
        folders = await db.collection('folders').find(query).sort({ order: 1 }).toArray()
      }
    }

    return NextResponse.json({ success: true, data: folders })
  } catch (error) {
    console.error('[GKZ] Error fetching folders:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch folders' }, { status: 500 })
  }
}

// POST - create a new folder
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, nameEn, description, image, color, slug, type } = body

    if (!name || !nameEn) {
      return NextResponse.json({ success: false, error: 'Name fields are required' }, { status: 400 })
    }

    const folderType = type || 'video'
    const { db } = await connectToDatabase()

    // Get next order within the same type
    const maxOrder = await db.collection('folders').find({ type: folderType }).sort({ order: -1 }).limit(1).toArray()
    const nextOrder = maxOrder.length > 0 ? (maxOrder[0].order || 0) + 1 : 1

    const folder = {
      slug: slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      nameEn,
      description: description || '',
      image: image || '',
      color: color || 'from-blue-400 to-cyan-500',
      order: nextOrder,
      type: folderType,
      createdAt: new Date(),
    }

    await db.collection('folders').insertOne(folder)

    return NextResponse.json({ success: true, data: folder }, { status: 201 })
  } catch (error) {
    console.error('[GKZ] Error creating folder:', error)
    return NextResponse.json({ success: false, error: 'Failed to create folder' }, { status: 500 })
  }
}
