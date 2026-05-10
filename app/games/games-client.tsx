'use client'

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { Star, Lock } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import MathGame from "@/components/math-game"
import ColorShapeMatch from "@/components/games/color-shape-match"
import CountingAnimals from "@/components/games/counting-animals"
import MemoryCards from "@/components/games/memory-cards"
import WordBuilder from "@/components/games/word-builder"
import PuzzleSlider from "@/components/games/puzzle-slider"
import type { GameDoc } from "@/lib/db"

const defaultGames = [
  { id: 1, title: "GUTERANYA - GUKUBA - KUGABANYA", description: "igisha umwana gukora ano mahurizo akina imikino", rating: 4.8, category: "Imibare", premium: false, color: "bg-blue-400", component: "math-game", image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&h=600&fit=crop" },
  { id: 2, title: "IGISHA UMWANA GUSOMA AMAGAMBO", description: "aha umwana akina umukono ahuza amagambo n'amajwi", rating: 4.9, category: "Ururimi", premium: false, color: "bg-green-400", component: "word-builder", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=600&fit=crop" },
  { id: 3, title: "IGISHA UMWANA GUSUBIRAMO IMIBARE", description: "aha umwana akina n'imibare agafata mu mutwe", rating: 4.7, category: "Ubwenge", premium: false, color: "bg-purple-400", component: "counting-animals", image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&h=600&fit=crop" },
  { id: 4, title: "MENYA AMAGAMBO - IBUKA", description: "aha umwana agenda asubiramo amagambo kugirango amenye", rating: 4.6, category: "Inyandiko", premium: false, color: "bg-orange-400", component: "memory-cards", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&h=600&fit=crop" },
  { id: 5, title: "UMUKINO W'AMABARA N'IMITERERE", description: "aha umwana amenya amabara n'imiterere akina", rating: 4.8, category: "Siyensi", premium: false, color: "bg-pink-400", component: "color-shape-match", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop" },
  { id: 6, title: "UMUKINO W'IGISHUSHANYO", description: "aha umwana akina n'ibikoresho akagenda yumva akabifata mu mutwe", rating: 4.7, category: "Amateka", premium: false, color: "bg-yellow-400", component: "puzzle-slider", image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=600&fit=crop" },
]

const gameComponents: Record<string, React.ComponentType> = {
  'math-game': MathGame, 'color-shape-match': ColorShapeMatch, 'counting-animals': CountingAnimals,
  'memory-cards': MemoryCards, 'word-builder': WordBuilder, 'puzzle-slider': PuzzleSlider,
}

interface GamesClientProps { initialGames: GameDoc[] }

export default function GamesClient({ initialGames }: GamesClientProps) {
  const { t } = useTranslation()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const games = initialGames.length > 0 ? initialGames : defaultGames

  if (selectedGame && gameComponents[selectedGame]) {
    const GameComponent = gameComponents[selectedGame]
    return (
      <>
        <Header />
        <button onClick={() => setSelectedGame(null)} className="fixed top-20 left-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-5 rounded-lg z-50 transition-all shadow-lg">
          {t('games.backToGames')}
        </button>
        <GameComponent />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <PageHero title={t('games.pageTitle')} subtitle={t('games.pageSubtitle')} gradient="from-secondary via-blue-400 to-blue-500" />
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game) => (
                <div key={game.id} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all cursor-pointer group" onClick={() => game.component && setSelectedGame(game.component)}>
                  <div className={`${game.color} h-40 w-full relative overflow-hidden`}>
                    {game.image && <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    {game.premium && (
                      <div className="absolute top-4 right-4 bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Lock size={14} /> {t('games.premium')}</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-1">{game.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{game.category}</p>
                    <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(game.rating) ? "currentColor" : "none"} />)}</div>
                      <span className="text-sm text-muted-foreground">{game.rating}</span>
                    </div>
                    <button className="w-full py-2.5 bg-secondary text-white rounded-lg font-semibold hover:shadow-md transition-all">
                      {game.premium ? t('games.unlockGame') : t('games.playNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
