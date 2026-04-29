const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://goodkidzone_db_user:Amadoullah@12@goodkidzone.u6c6b1r.mongodb.net/?appName=goodkidzone'

const defaultGames = [
  {
    id: 1,
    title: "GUTERANYA - GUKUBA - KUGABANYA",
    description: "igisha umwana gukora ano mahurizo akina imikino",
    rating: 4.8,
    category: "Imibare",
    premium: false,
    color: "bg-blue-400",
    component: "math-game",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed-1M2J430Y5jgNG84r6R0XpZL0Z7wdwC.png"
  },
  {
    id: 2,
    title: "IGISHA UMWANA GUSOMA AMAGAMBO AKURIKIRA",
    description: "aha umwana akina umukono ahuza amagambo n'amajwi akamenya neza gusoma amagambo",
    rating: 4.9,
    category: "Ururimi",
    premium: false,
    color: "bg-green-400",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/word-search-eeu53wCGctIUx6jEg4f8hEBDg3eyvZ.jpg"
  },
  {
    id: 3,
    title: "IGISHA UMWANA GUSUBIRAMO IMIBARE KUGERA 100",
    description: "aha umwana akina n'inyuguti agafata mu mutwe inyuguti anakina",
    rating: 4.7,
    category: "Ubwenge",
    premium: true,
    color: "bg-purple-400",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stickman-maze-run-1gFg76HcDOyDe0aDkX1pZvmAU3Jf8k.jpg"
  },
  {
    id: 4,
    title: "MENYA AMAGAMBO UMWANA ASHOBORA GUSUBIRAMO",
    description: "aha umwana agenda asubiramo amagambo kugirango amenye kuvuga neza",
    rating: 4.6,
    category: "Inyandiko",
    premium: false,
    color: "bg-orange-400",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnnn-XDJgaXttaF9AObQAUiwGhD4Tf2Tvnc.jpg"
  },
  {
    id: 5,
    title: "UMUKINO UMWANA AKINA AKAMENYA IBIKORESHO BIMURI HAFI",
    description: "aha umwana agenda amenya ibikinisho n'ibindi bimufasha mu myigire y'ubwenge no kwagurra ubwonko",
    rating: 4.8,
    category: "Siyensi",
    premium: true,
    color: "bg-pink-400",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mqdefault-IBQwYsXpCTx3e8Le7DBxUg9P8IKMV9.jpg"
  },
  {
    id: 6,
    title: "UMUKINO W'AMATEKA N'UMUCO",
    description: "aha umwana akina n'ibikoresho bya kera akagenda yumva amajwi ajyanye nuko byitwa akabifata mu mutwe",
    rating: 4.7,
    category: "Amateka",
    premium: false,
    color: "bg-yellow-400",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnmed3-9X5DN1dC0SMZTRnxqIqSpIlbvr629D.jpg"
  },
]

const defaultProducts = [
  {
    id: 1,
    name: "Colorful Sweatshirt Set",
    price: 18000,
    rating: 4.8,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rBVa3V_iyHaAEbCTAAbxcfWGtRk728.jpg.jpeg-K52esmomkwxH9ip1aBzI08Ep1ej6kO.webp",
    category: "Outfits",
    imageType: "url",
  },
  {
    id: 2,
    name: "Beige Sneaker Shoes",
    price: 22000,
    rating: 4.9,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e56048d5-6849-4f4f-8b7e-ab416544c285.jpg.jpeg-HHZF1BiWcv9bfswhbA6V5dT5Ws2hIg.webp",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 3,
    name: "Brown Leather Shoes",
    price: 19000,
    rating: 4.7,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images.jfif-Vsu6J4AKueIy4aX57LaRWHsNhu6CEF.jpeg",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 4,
    name: "Pink Sparkly Girl Shoes",
    price: 20000,
    rating: 4.6,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/61NaabhO7vL._AC_UF1000%2C1000_QL80_.jpg-kOYulDSjQm1WbG6E3mvmufwxRpQRtG.jpeg",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 5,
    name: "Blue Orange Clothing Set",
    price: 17500,
    rating: 4.9,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6613cb75a323b407bd014d6e-kaoayi-kids-clothing-for-boy-spring.jpg-PMEfz8bpPAhHjm1CNyaVaZyDm44Mrn.jpeg",
    category: "Outfits",
    imageType: "url",
  },
  {
    id: 6,
    name: "Colorful Multi-Sneaker",
    price: 21000,
    rating: 4.8,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/403795-mnpc-erkek-cocuk-gunluk-spor-ayakkabi-yesil-renk-10002-20ye-c5-9e-c4-b0l-2011.jpg-3eOkBDpCpOY6Td6W4667XWt8Cjwu4Z.jpeg",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 7,
    name: "Gray Sweatshirt Pants Set",
    price: 16000,
    rating: 4.7,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71k6JCP3Z8L._AC_UY1000_.jpg-DbahurOlq2KqofOuz6N41foSHY65Yy.jpeg",
    category: "Outfits",
    imageType: "url",
  },
  {
    id: 8,
    name: "Pastel Rainbow Sneaker",
    price: 23000,
    rating: 4.9,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/360_F_502208226_wn8UCWkBLahAxjLZpVKXqf1ruWwchY8i.jpg-0HcXfLrUhcHi4ZT1Zhh0x0IiwJjpUy.jpeg",
    category: "Shoes",
    imageType: "url",
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db('goodkidzone')

    console.log('[v0] Connected to MongoDB')

    // Clear existing data
    await db.collection('games').deleteMany({})
    await db.collection('products').deleteMany({})

    console.log('[v0] Cleared existing data')

    // Insert games
    const gamesWithDates = defaultGames.map(game => ({
      ...game,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    const gamesResult = await db.collection('games').insertMany(gamesWithDates)
    console.log(`[v0] Inserted ${gamesResult.insertedCount} games`)

    // Insert products
    const productsWithDates = defaultProducts.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    const productsResult = await db.collection('products').insertMany(productsWithDates)
    console.log(`[v0] Inserted ${productsResult.insertedCount} products`)

    console.log('[v0] Database seeding completed successfully!')
  } catch (error) {
    console.error('[v0] Error seeding database:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('[v0] Connection closed')
  }
}

seedDatabase()
