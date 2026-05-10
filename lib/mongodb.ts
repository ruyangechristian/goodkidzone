import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error(
    'MONGODB_URI is not configured. Please add it to your .env.local file.'
  )
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  // Return cached connection if still alive
  if (cachedClient && cachedDb) {
    try {
      // Quick ping to verify connection is still alive
      await cachedDb.command({ ping: 1 })
      return { client: cachedClient, db: cachedDb }
    } catch {
      // Connection died — clear cache and reconnect
      console.log('[GKZ] Cached connection lost, reconnecting...')
      cachedClient = null
      cachedDb = null
    }
  }

  const client = new MongoClient(uri!, {
    serverApi: {
      version: '1',
      strict: false,
      deprecationErrors: true,
    },
    // Increased timeouts for Atlas free tier cold starts
    connectTimeoutMS: 45000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 45000,
    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 1,
  })

  try {
    await client.connect()
    const db = client.db('goodkidzone')

    cachedClient = client
    cachedDb = db

    console.log('[GKZ] Connected to MongoDB')
    return { client, db }
  } catch (error) {
    console.error('[GKZ] Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}

export { MongoClient }
