import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb+srv://goodkidzone_db_user:Amadoullah%4012@goodkidzone.u6c6b1r.mongodb.net/?appName=goodkidzone'
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not configured')
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  })
  
  try {
    await client.connect()
    const db = client.db('goodkidzone')
    
    cachedClient = client
    cachedDb = db
    
    console.log('[v0] Connected to MongoDB successfully')
    
    return { client, db }
  } catch (error) {
    console.error('[v0] Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
    console.log('[v0] Closed MongoDB connection')
  }
}

export { MongoClient }
