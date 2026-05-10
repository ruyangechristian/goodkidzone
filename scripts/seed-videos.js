const { MongoClient } = require('mongodb')

async function seedVideos() {
  const c = new MongoClient(
    'mongodb+srv://Fabrice:Fabrice12@cluster0.bnhnfjq.mongodb.net/goodkidzone?retryWrites=true&w=majority',
    { connectTimeoutMS: 45000, serverSelectionTimeoutMS: 45000 }
  )

  await c.connect()
  const db = c.db('goodkidzone')

  const sampleVideos = [
    // Movies (imikino)
    { title: 'Learn Colors with Kids', youtubeUrl: 'https://www.youtube.com/watch?v=y7S0_x6xP8E', category: 'imikino', videoId: 'y7S0_x6xP8E', duration: '5:00' },
    { title: 'Fun Game for Toddlers', youtubeUrl: 'https://www.youtube.com/watch?v=3-VvX1n_Uks', category: 'imikino', videoId: '3-VvX1n_Uks', duration: '3:30' },
    
    // Kids 5-14 (abana-5-14)
    { title: 'Science Experiment for Kids', youtubeUrl: 'https://www.youtube.com/watch?v=Mc7vW_JzJLo', category: 'abana-5-14', videoId: 'Mc7vW_JzJLo', duration: '10:00' },
    { title: 'Math Tricks', youtubeUrl: 'https://www.youtube.com/watch?v=n-T7S8E0-6Q', category: 'abana-5-14', videoId: 'n-T7S8E0-6Q', duration: '8:15' },
    
    // Quranic (inyigisho-quran)
    { title: 'Learn Quran for Kids', youtubeUrl: 'https://www.youtube.com/watch?v=0WpLp4a7-oE', category: 'inyigisho-quran', videoId: '0WpLp4a7-oE', duration: '12:00' },
    
    // Christian (inyigisho-gikristo)
    { title: 'Bible Stories for Kids', youtubeUrl: 'https://www.youtube.com/watch?v=H7_vS5G0a9w', category: 'inyigisho-gikristo', videoId: 'H7_vS5G0a9w', duration: '15:00' }
  ]

  const now = new Date()
  const videos = sampleVideos.map((v, index) => ({
    ...v,
    id: index + 1,
    description: `Enjoy this educational video about ${v.title.toLowerCase()} for children in Rwanda.`,
    image: `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
    createdAt: now,
    updatedAt: now
  }))

  await db.collection('videos').deleteMany({})
  await db.collection('videos').insertMany(videos)
  
  await c.close()
  console.log(`Seed completed! Inserted ${videos.length} videos.`)
}

seedVideos()
