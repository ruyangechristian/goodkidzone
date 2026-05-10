import { connectToDatabase } from './mongodb'
import { cache } from 'react'

// Server-side data fetching functions with React cache()
// These run on the server only — no API round-trip, no client-side fetch

export interface FolderDoc {
  _id: string
  slug: string
  name: string
  nameEn: string
  description: string
  image: string
  color: string
  order: number
  type: string
}

export interface VideoDoc {
  _id: string
  id: number
  title: string
  description: string
  youtubeUrl?: string
  videoId?: string
  duration?: string
  category: string
  image: string
}

export interface ProductDoc {
  _id: string
  id: number
  name: string
  price: number
  rating: number
  image: string
  category: string
}

export interface GameDoc {
  _id: string
  id: number
  title: string
  description: string
  rating: number
  category: string
  premium: boolean
  color: string
  component?: string
  image?: string
}

export interface FestivalDoc {
  _id: string
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  ticketPrice: number
  availableTickets: number
  category: string
}

// Default folder seeds (used if collection is empty)
const defaultFolders: Omit<FolderDoc, '_id'>[] = [
  { slug: 'imikino', name: 'Imikino', nameEn: 'Movies', description: 'Abakinnyi bapfuye kandi nkarangikira', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop', color: 'from-red-400 to-pink-500', order: 1, type: 'video' },
  { slug: 'ubuzima-imirire', name: 'Ubuzima (Imirire myiza)', nameEn: 'Health & Wellness', description: "Ibihe byimirire myiza n'indwara zitagwayo", image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop', color: 'from-green-400 to-emerald-500', order: 2, type: 'video' },
  { slug: 'amateka-umuco', name: "Amateka n'Umuco", nameEn: 'History & Culture', description: "Amateka y'u Rwanda n'umuco nyarwanda", image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=400&h=300&fit=crop', color: 'from-amber-400 to-orange-500', order: 3, type: 'video' },
  { slug: 'uburezi', name: 'Uburezi', nameEn: 'Education', description: 'Ibigiriro byo kugutsinda mu nzira', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop', color: 'from-blue-400 to-cyan-500', order: 4, type: 'video' },
  { slug: 'abana-1-5', name: "Videwo z'Abana 1-5", nameEn: 'Kids 1-5 Years', description: 'Ibigiriro byiza kuri abana ba miaka 1-5', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop', color: 'from-purple-400 to-pink-500', order: 5, type: 'video' },
  { slug: 'abana-5-14', name: "Videwo z'Abana 5-14", nameEn: 'Kids 5-14 Years', description: 'Ibigiriro byiza kuri abana ba miaka 5-14', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop', color: 'from-indigo-400 to-blue-500', order: 6, type: 'video' },

  { slug: 'ubuzima', name: 'Ubuzima', nameEn: 'Life & Living', description: "Imibereho yo murugo nuko umwana yitara", image: 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&h=300&fit=crop', color: 'from-emerald-400 to-teal-500', order: 1, type: 'short-film' },
  { slug: 'imirire-myiza', name: 'Imirire Myiza', nameEn: 'Healthy Nutrition', description: "Uko umubyeyi yakira umwana n'imirire myiza", image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=300&fit=crop', color: 'from-lime-400 to-green-500', order: 2, type: 'short-film' },
  { slug: 'amateka', name: 'Amateka', nameEn: 'History & Heritage', description: "Igisha umwana ikinyarwanda kiboneye n'amateka", image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=400&h=300&fit=crop', color: 'from-amber-400 to-yellow-500', order: 3, type: 'short-film' },
  { slug: 'uburezi-films', name: 'Uburezi', nameEn: 'Educational Films', description: "Uko umwana yiga mu rugo akanezererwa", image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', color: 'from-blue-400 to-indigo-500', order: 4, type: 'short-film' },
  { slug: 'abana-1-5-films', name: "Film z'Abana 1-5", nameEn: 'Films for Kids 1-5', description: "Filime zishimishije z'abana bato ba miaka 1-5", image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop', color: 'from-pink-400 to-rose-500', order: 5, type: 'short-film' },
  { slug: 'abana-5-14-films', name: "Videwo z'Abana 5-14", nameEn: 'Videos for Kids 5-14', description: "Videwo n'amafilime by'abana ba miaka 5-14", image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=300&fit=crop', color: 'from-violet-400 to-purple-500', order: 6, type: 'short-film' },
  { slug: 'inyigisho-gikristo', name: 'Inyigisho za Gikristo', nameEn: 'Christian Teachings', description: "Reba video wigishe umwana ibijyanye na Bible", image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop', color: 'from-sky-400 to-blue-500', order: 1, type: 'religion' },
  { slug: 'inyigisho-quran', name: 'Inyigisho za Quran', nameEn: 'Quranic Teachings', description: "Reba video wigishe umwana ibijyanye na Islam", image: 'https://images.unsplash.com/photo-1585036156171-384164a8c6c4?w=400&h=300&fit=crop', color: 'from-emerald-400 to-green-500', order: 2, type: 'religion' },
  { slug: 'iyobokamana', name: 'Ni Iyobokamana', nameEn: 'Faith & Spirituality', description: "Ese wifuza kumenya ibijyanye n'iyobokamana?", image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop', color: 'from-amber-400 to-orange-500', order: 3, type: 'religion' },
]

// Serialize MongoDB docs (convert _id to string)
function serialize<T>(docs: T[]): T[] {
  return JSON.parse(JSON.stringify(docs))
}

// Cached: Get folders by type
export const getFoldersByType = cache(async (type: string): Promise<FolderDoc[]> => {
  const { db } = await connectToDatabase()
  let folders = await db.collection('folders').find({ type }).sort({ order: 1 }).toArray()

  if (folders.length === 0) {
    const total = await db.collection('folders').countDocuments()
    if (total === 0) {
      await db.collection('folders').insertMany(defaultFolders.map(f => ({ ...f, createdAt: new Date() })))
      folders = await db.collection('folders').find({ type }).sort({ order: 1 }).toArray()
    }
  }

  return serialize(folders) as FolderDoc[]
})

// Cached: Get videos by category/folder slug
export const getVideosByCategory = cache(async (category: string): Promise<VideoDoc[]> => {
  const { db } = await connectToDatabase()
  const videos = await db.collection('videos').find({ category }).sort({ createdAt: -1 }).toArray()
  return serialize(videos) as VideoDoc[]
})

// Cached: Get all games
export const getGames = cache(async (): Promise<GameDoc[]> => {
  const { db } = await connectToDatabase()
  const games = await db.collection('games').find({}).sort({ id: 1 }).toArray()
  return serialize(games) as GameDoc[]
})

// Cached: Get all products
export const getProducts = cache(async (): Promise<ProductDoc[]> => {
  const { db } = await connectToDatabase()
  const products = await db.collection('products').find({}).sort({ id: 1 }).toArray()
  return serialize(products) as ProductDoc[]
})

// Cached: Get all festivals
export const getFestivals = cache(async (): Promise<FestivalDoc[]> => {
  const { db } = await connectToDatabase()
  const festivals = await db.collection('festivals').find({}).sort({ date: 1 }).toArray()
  return serialize(festivals) as FestivalDoc[]
})
