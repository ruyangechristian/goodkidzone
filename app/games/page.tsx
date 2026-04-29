'use client'

import Header from "@/components/header"
import { Star, Lock, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import MathGame from "@/components/math-game"

interface Game {
  _id?: string
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

const defaultGames: Game[] = [
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

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      if (response.ok) {
        const data = await response.json()
        setGames(data.data && data.data.length > 0 ? data.data : defaultGames)
      } else {
        setGames(defaultGames)
      }
    } catch (error) {
      console.error('[v0] Error fetching games:', error)
      setGames(defaultGames)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  // Show math game if selected
  if (selectedGame === "math-game") {
    return (
      <>
        <Header />
        <button
          onClick={() => setSelectedGame(null)}
          className="fixed top-20 left-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg z-50 transition-colors"
        >
          ← Back to Games
        </button>
        <MathGame />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <section className="py-12 md:py-16 bg-gradient-to-r from-secondary via-blue-400 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Educational Games</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Pick from our collection of fun, educational games designed to make learning exciting!
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={40} className="animate-spin text-primary" />
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => game.component && setSelectedGame(game.component)}
                >
                  <div className={`${game.color} h-40 w-full relative overflow-hidden`}>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {game.premium && (
                      <div className="absolute top-4 right-4 bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Lock size={14} /> Premium
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{game.title}</h3>
                        <p className="text-sm text-gray-600">{game.category}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{game.description}</p>

                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < Math.floor(game.rating) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{game.rating}</span>
                    </div>

                    <button className="w-full btn-primary bg-secondary text-white">
                      {game.premium ? "Unlock Game" : "Play Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 KidZone Rwanda. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
