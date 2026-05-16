const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI

const defaultGames = [
  { id: 1, title: "GUTERANYA - GUKUBA - KUGABANYA", titleEn: "ADDITION - MULTIPLICATION - DIVISION", description: "igisha umwana gukora ano mahurizo akina imikino", descriptionEn: "Teaches the child to solve math puzzles while playing", rating: 4.8, category: "Imibare", categoryEn: "Math", premium: false, color: "bg-blue-400", component: "math-game", image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&h=600&fit=crop" },
  { id: 2, title: "IGISHA UMWANA GUSOMA AMAGAMBO", titleEn: "WORD READING", description: "aha umwana akina umukono ahuza amagambo n'amajwi", descriptionEn: "The child matches words and sounds while playing", rating: 4.9, category: "Ururimi", categoryEn: "Language", premium: false, color: "bg-green-400", component: "word-builder", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=600&fit=crop" },
  { id: 3, title: "IGISHA UMWANA GUSUBIRAMO IMIBARE", titleEn: "NUMBER REVIEW", description: "aha umwana akina n'imibare agafata mu mutwe", descriptionEn: "The child plays with numbers and memorizes them", rating: 4.7, category: "Ubwenge", categoryEn: "Logic", premium: false, color: "bg-purple-400", component: "counting-animals", image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&h=600&fit=crop" },
  { id: 4, title: "MENYA AMAGAMBO - IBUKA", titleEn: "MEMORY CARDS", description: "aha umwana agenda asubiramo amagambo kugirango amenye", descriptionEn: "The child reviews words to memorize them", rating: 4.6, category: "Inyandiko", categoryEn: "Reading", premium: false, color: "bg-orange-400", component: "memory-cards", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&h=600&fit=crop" },
  { id: 5, title: "UMUKINO W'AMABARA N'IMITERERE", titleEn: "COLORS & SHAPES", description: "aha umwana amenya amabara n'imiterere akina", descriptionEn: "The child learns colors and shapes while playing", rating: 4.8, category: "Siyensi", categoryEn: "Science", premium: false, color: "bg-pink-400", component: "color-shape-match", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop" },
  { id: 6, title: "UMUKINO W'IGISHUSHANYO", titleEn: "PUZZLE SLIDER", description: "aha umwana akina n'ibikoresho akagenda yumva akabifata mu mutwe", descriptionEn: "The child plays with shapes to memorize images", rating: 4.7, category: "Amateka", categoryEn: "History", premium: false, color: "bg-yellow-400", component: "puzzle-slider", image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=600&fit=crop" },
]

const defaultProducts = [
  { id: 1, name: "Colorful Sweatshirt Set", price: 18000, rating: 4.8, image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&h=600&fit=crop", category: "Outfits", imageType: "url" },
  { id: 2, name: "Beige Sneaker Shoes", price: 22000, rating: 4.9, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop", category: "Shoes", imageType: "url" },
  { id: 3, name: "Brown Leather Shoes", price: 19000, rating: 4.7, image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800&h=600&fit=crop", category: "Shoes", imageType: "url" },
  { id: 4, name: "Pink Sparkly Girl Shoes", price: 20000, rating: 4.6, image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=600&fit=crop", category: "Shoes", imageType: "url" },
  { id: 5, name: "Blue Orange Clothing Set", price: 17500, rating: 4.9, image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=600&fit=crop", category: "Outfits", imageType: "url" },
  { id: 6, name: "Colorful Multi-Sneaker", price: 21000, rating: 4.8, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop", category: "Shoes", imageType: "url" },
  { id: 7, name: "Gray Sweatshirt Pants Set", price: 16000, rating: 4.7, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop", category: "Outfits", imageType: "url" },
  { id: 8, name: "Pastel Rainbow Sneaker", price: 23000, rating: 4.9, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop", category: "Shoes", imageType: "url" },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db('goodkidzone')
    console.log('[GKZ] Connected to MongoDB')

    await db.collection('games').deleteMany({})
    await db.collection('products').deleteMany({})
    console.log('[GKZ] Cleared existing data')

    const now = new Date()
    await db.collection('games').insertMany(defaultGames.map(g => ({ ...g, createdAt: now, updatedAt: now })))
    console.log(`[GKZ] Inserted ${defaultGames.length} games`)

    await db.collection('products').insertMany(defaultProducts.map(p => ({ ...p, createdAt: now, updatedAt: now })))
    console.log(`[GKZ] Inserted ${defaultProducts.length} products`)

    console.log('[GKZ] Database seeding completed!')
  } catch (error) {
    console.error('[GKZ] Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

seedDatabase()
