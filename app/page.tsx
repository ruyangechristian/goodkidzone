"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Link from "next/link"
import { Gamepad2, Video, ShoppingBag, Sparkles, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20basoma%20-YtJVZEKVd1Skk1htZbF9cqa5kF1HQ3.png",
      alt: "Family reading together under a tree",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20batetse-kLBA7DXWbvea8XwquYKy8eNBhbzDrf.png",
      alt: "Family cooking healthy meal together",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bishimye%20kubera%20uburezi-q9ePIiqvXVRCFIoriObLlAtLReOSV1.png",
      alt: "Happy children celebrating education",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <section className="relative h-96 md:h-[32rem] overflow-hidden bg-black">
          <div className="relative w-full h-full">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  i === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={slide.image || "/placeholder.svg"} alt={slide.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-3 rounded-full transition-all ${i === currentSlide ? "bg-white w-8" : "bg-white/50 w-3"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Centered Goodkid Zone branding overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Goodkid Zone</h1>
              <p className="text-lg md:text-xl text-white/90 drop-shadow-md">Where Learning Meets Fun</p>
            </div>
          </div>
        </section>

        <section className="relative py-12 md:py-16 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">About Goodkid Zone Rwanda</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A child-centered platform dedicated to supporting holistic development through learning and safe entertainment. We provide educational games, cartoons, songs, and stories in Kinyarwanda that promote strong values, healthy growth, and cultural identity. A trusted space for children and parents, building a future generation that is knowledgeable, confident, healthy, and values-driven.
              </p>
            </div>
          </div>
        </section>

        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  <Sparkles size={16} />
                  Welcome to Learning
                </div>
                <h2 className="section-title">Your Child's Educational Adventure Starts Here</h2>
                <p className="section-subtitle text-xl">
                  Educational games, engaging videos, and cultural content designed for kids in Rwanda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/games" className="btn-primary">
                  Explore Games
                </Link>
                <Link href="/videos" className="btn-secondary">
                  Browse Videos
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-20">
              {[
                {
                  icon: Gamepad2,
                  title: "100+ Educational Games",
                  description: "Math, languages, and critical thinking games that make learning fun.",
                },
                {
                  icon: Video,
                  title: "Curated Video Library",
                  description: "Engaging content covering science, culture, and entertainment.",
                },
                {
                  icon: ShoppingBag,
                  title: "Exclusive Kids Shop",
                  description: "Learning materials and merchandise to enhance the experience.",
                },
              ].map((feature, i) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={i}
                    className="bg-white border border-border rounded-lg shadow-sm hover:shadow-md p-8 space-y-4 transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-primary" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 mb-12">
              <h2 className="section-title text-center">Trending This Week</h2>
              <p className="section-subtitle text-center">Check out what other kids are enjoying right now</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Math Adventure", category: "Game", color: "from-primary to-primary/70" },
                { title: "Nature Explorer", category: "Video", color: "from-secondary to-secondary/70" },
                { title: "Language Quest", category: "Game", color: "from-accent to-accent/70" },
                { title: "Culture Stories", category: "Video", color: "from-primary/50 to-accent/50" },
              ].map((item, i) => (
                <Link key={i} href={item.category === "Game" ? "/games" : "/videos"}>
                  <div
                    className={`relative h-56 rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg bg-gradient-to-br ${item.color} flex flex-col items-center justify-center p-6`}
                  >
                    <h3 className="text-2xl font-bold text-white text-center leading-tight">{item.title}</h3>
                    <p className="text-white/80 text-sm mt-3 font-medium">{item.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent p-12 md:p-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Start Your Learning Journey Today
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Unlimited access to games, videos, and more. Sign up now!
              </p>
              <Link href="/signup">
                <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary-foreground text-primary rounded-lg font-bold text-lg hover:shadow-xl transition-all active:scale-95">
                  Get Started
                  <ArrowUp size={20} />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-12 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Goodkid Zone</h3>
              <p className="text-sm opacity-70">Making education engaging and accessible for every child.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm">Explore</h3>
              <ul className="space-y-2 text-sm opacity-70">
                <li>
                  <Link href="/games" className="hover:opacity-100 transition">
                    Games
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="hover:opacity-100 transition">
                    Videos
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:opacity-100 transition">
                    Shop
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-sm">Contact</h3>
              <p className="text-sm opacity-70">hello@ubwizaentertainment.rw</p>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-70">
            <p>&copy; 2026 Goodkid Zone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
