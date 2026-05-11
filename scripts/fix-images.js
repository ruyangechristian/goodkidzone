const { MongoClient } = require('mongodb')
require('dotenv').config()

async function fixImages() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')
    const db = client.db('goodkidzone')
    
    // ... rest of the file ...
  } finally {
    await client.close()
  }
}

fixImages()
