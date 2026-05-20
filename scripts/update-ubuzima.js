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

    const folderUpdates = {
      'imikino': {
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
        description: 'Abakinnyi bapfuye kandi nkarangikira',
        descriptionEn: 'Exciting movies and animations for kids'
      },
      'ubuzima-imirire': {
        image: '/images/ubuzima.jpg',
        description: "Ibihe byimirire myiza n'indwara zitagwayo",
        descriptionEn: 'Learn about healthy eating and good habits'
      },
      'amateka-umuco': {
        image: '/images/amateka.jpg',
        description: "Amateka y'u Rwanda n'umuco nyarwanda",
        descriptionEn: 'Discover Rwandan history and rich culture'
      },
      'uburezi': {
        image: '/images/uburezi.jpg',
        description: "uko umwana yakwigira mu rugo",
        descriptionEn: 'Educational content to help you succeed'
      },
      'abana-1-5': {
        image: '/images/abana_television.jpg',
        description: "filime zishimishije z'abana b'imyaka 1 - 5",
        descriptionEn: 'Great videos for toddlers aged 1-5'
      },
      'abana-5-14': {
        image: '/images/abana_5_14_television.jpg',
        description: "filime zishimishije z'abana b'imyaka 5 - 14",
        descriptionEn: 'Engaging content for kids aged 5-14'
      },
      'ubuzima': {
        image: '/images/ubuzima.jpg',
        description: "imibereho yo mu rugo n'uko umwana yitwara",
        descriptionEn: 'Daily life routines and behaviors'
      },
      'imirire-myiza': {
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=300&fit=crop',
        description: "imirire myiza kubana",
        descriptionEn: 'Proper nutrition guidelines for children'
      },
      'amateka': {
        image: '/images/amateka.jpg',
        description: "Igisha umwana ikinyarwanda kiboneye n'amateka",
        descriptionEn: 'Teach children history and heritage'
      },
      'uburezi-films': {
        image: '/images/uburezi.jpg',
        description: "uko umwana yakwigira mu rugo",
        descriptionEn: 'Fun educational activities at home'
      },
      'abana-1-5-films': {
        image: '/images/abana_television.jpg',
        description: "filime zishimishije z'abana b'imyaka 1 - 5",
        descriptionEn: 'Entertaining short films for kids 1-5'
      },
      'abana-5-14-films': {
        image: '/images/abana_5_14_television.jpg',
        description: "filime zishimishije z'abana b'imyaka 5 - 14",
        descriptionEn: 'Great short films for kids aged 5-14'
      },
      'inyigisho-gikristo': {
        image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop',
        description: "Reba video wigishe umwana ibijyanye na Bible",
        descriptionEn: 'Watch videos to teach your child about the Bible'
      },
      'inyigisho-quran': {
        image: 'https://images.unsplash.com/photo-1585036156171-384164a8c6c4?w=400&h=300&fit=crop',
        description: "Reba video wigishe umwana ibijyanye na Islam",
        descriptionEn: 'Watch videos to teach your child about Islam'
      },
      'iyobokamana': {
        image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
        description: "Ese wifuza kumenya ibijyanye n'iyobokamana?",
        descriptionEn: 'Do you want to learn about faith and spirituality?'
      }
    }

    for (const [slug, fields] of Object.entries(folderUpdates)) {
      const result = await db.collection('folders').updateOne(
        { slug },
        { $set: fields }
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
