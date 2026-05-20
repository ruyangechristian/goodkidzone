const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// Parse .env.local manually
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const matches = envContent.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/)
const MONGODB_URI = matches ? matches[1] : null

if (!MONGODB_URI) {
  console.error('[GKZ Migration] Could not find MONGODB_URI in .env.local')
  process.exit(1)
}

async function run() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db('goodkidzone')
    console.log('[GKZ Migration] Connected to MongoDB')

    const updates = {
      'ubuzima-imirire': '/images/ubuzima.jpg',
      'ubuzima': '/images/ubuzima.jpg',
      'amateka-umuco': '/images/amateka.jpg',
      'amateka': '/images/amateka.jpg',
      'uburezi': '/images/uburezi.jpg',
      'uburezi-films': '/images/uburezi.jpg',
      'abana-1-5': '/images/abana_television.jpg',
      'abana-5-14': '/images/abana_television.jpg',
      'abana-1-5-films': '/images/abana_television.jpg',
      'abana-5-14-films': '/images/abana_television.jpg'
    }

    for (const [slug, imagePath] of Object.entries(updates)) {
      const result = await db.collection('folders').updateOne(
        { slug },
        { $set: { image: imagePath } }
      )
      console.log(`[GKZ Migration] Updated slug "${slug}": matched ${result.matchedCount}, modified ${result.modifiedCount}`)
    }

    console.log('[GKZ Migration] Completed successfully!')
  } catch (error) {
    console.error('[GKZ Migration] Error:', error)
  } finally {
    await client.close()
  }
}

run()
