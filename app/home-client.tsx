"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Gamepad2, Video, ShoppingBag, Sparkles, ArrowRight, Play, Star } from "lucide-react"
import WavyDivider from "@/components/ui/wavy-divider"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/context"
import type { GameDoc, VideoDoc, ProductDoc } from "@/lib/db"

interface HomeClientProps {
  trendingGames: GameDoc[]
  trendingVideos: VideoDoc[]
}

export default function HomeClient({ trendingGames, trendingVideos }: HomeClientProps) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useTranslation()

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.push('/admin')
    }
  }, [router])

  const slides = [
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20basoma%20-YtJVZEKVd1Skk1htZbF9cqa5kF1HQ3.png",
      alt: "Family reading together",
      title: t('home.heroTitle'),
      subtitle: t('home.heroSubtitle'),
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20batetse-kLBA7DXWbvea8XwquYKy8eNBhbzDrf.png",
      alt: "Family cooking together",
      title: "Playful Learning",
      subtitle: "Discover the world through games",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bishimye%20kubera%20uburezi-q9ePIiqvXVRCFIoriObLlAtLReOSV1.png",
      alt: "Happy children",
      title: "Cultural Identity",
      subtitle: "Learning in Kinyarwanda & English",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Liquid Background Blobs */}
      <div className="blob w-[500px] h-[500px] bg-primary/10 -top-24 -left-24"></div>
      <div className="blob w-[400px] h-[400px] bg-accent/10 top-1/2 -right-24"></div>
      <div className="blob w-[300px] h-[300px] bg-kids-pink/10 bottom-0 left-1/4"></div>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
              } transition-transform duration-[6000ms]`}
            >
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-20">
          <div className="animate-float space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-bold tracking-widest uppercase">
              <Sparkles size={16} className="text-accent" />
              {t('home.welcomeBadge')}
            </div>
            <h1 className="text-5xl md:text-8xl font-extrabold text-white drop-shadow-2xl tracking-tighter">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 drop-shadow-lg font-medium max-w-2xl mx-auto leading-tight">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Link href="/games" className="btn-primary-playful px-10 text-lg">
                <Gamepad2 size={24} />
                {t('home.exploreGames')}
              </Link>
              <Link href="/videos" className="btn-secondary-playful px-10 text-lg bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 shadow-none">
                <Video size={24} />
                {t('home.browseVideos')}
              </Link>
            </div>
          </div>
        </div>

        <WavyDivider color="var(--background)" position="bottom" />
      </section>

      {/* About Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-12">
          <div className="relative inline-block">
            <h2 className="section-title relative z-10">{t('home.aboutTitle')}</h2>
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-accent/30 -z-10 rounded-full skew-x-12"></div>
          </div>
          <p className="section-subtitle mx-auto text-foreground/80 font-medium">
            {t('home.aboutText')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 pt-12">
            {[
              { icon: Gamepad2, title: t('home.feature1Title'), desc: t('home.feature1Desc'), color: "bg-blue-500", shadow: "shadow-blue-500/20" },
              { icon: Video, title: t('home.feature2Title'), desc: t('home.feature2Desc'), color: "bg-red-500", shadow: "shadow-red-500/20" },
              { icon: ShoppingBag, title: t('home.feature3Title'), desc: t('home.feature3Desc'), color: "bg-green-500", shadow: "shadow-green-500/20" },
            ].map((f, i) => (
              <div key={i} className={`card-playful group hover:${f.shadow}`}>
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:animate-bounce shadow-lg`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="section-title mb-0">{t('home.trendingTitle')}</h2>
              <p className="section-subtitle">{t('home.trendingSubtitle')}</p>
            </div>
            <Link href="/games" className="flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingGames.map((game) => (
              <Link key={game.id} href="/games">
                <div className="group relative aspect-square rounded-bubble overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl">{game.title}</h3>
                    <div className="flex items-center gap-2 text-accent text-sm font-bold">
                      <Star size={14} fill="currentColor" /> {game.rating} • {game.category}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Zari Mascot Callout */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-primary via-primary/90 to-kids-purple rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            {/* Mascot Image */}
            <div className="absolute right-0 bottom-0 w-1/3 max-w-[300px] h-auto hidden md:block animate-float">
              <img src="/images/mascot-zari.png" alt="Zari Mascot" className="w-full h-auto drop-shadow-2xl" />
            </div>

            <div className="max-w-2xl relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {t('home.ctaSubtitle')}
              </p>
              <Link href="/signup" className="inline-flex btn-playful bg-accent text-accent-foreground px-12 py-5 text-xl shadow-accent/20 hover:shadow-accent/40">
                {t('home.getStarted')}
                <ArrowRight size={24} strokeWidth={3} />
              </Link>
            </div>

            {/* Decoration */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Exploration Path (Dotted line background) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-20 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1440 3000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 200C300 400 600 100 800 300C1000 500 1200 900 800 1200C400 1500 200 1800 500 2100C800 2400 1200 2200 1300 2600" 
                stroke="var(--primary)" strokeWidth="4" strokeDasharray="12 12" />
        </svg>
      </div>
    </main>
  )
}
