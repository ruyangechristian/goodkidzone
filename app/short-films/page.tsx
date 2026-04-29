'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import { Play, Loader, ChevronDown } from "lucide-react"
import { VideoModal } from "@/components/video-modal"

interface Video {
  id: number
  title: string
  description: string
  youtubeUrl?: string
  videoId?: string
  duration?: string
  category: string
  image: string
  folder?: string
}

interface FilmFolder {
  name: string
  description: string
  videos: Video[]
}

export default function ShortFilmsPage() {
  const [filmFolders, setFilmFolders] = useState<FilmFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null)
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null)

  const defaultFilmFolders: FilmFolder[] = [
    {
      name: "UBUZIMA",
      description: "imibereho yo murugo nuko umwana yitara",
      videos: [
        {
          id: 1,
          title: "Imibereho Myiza",
          description: "Learn about healthy home life and daily routines",
          duration: "12 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bashimye%20kubera%20uburezi-q9ePIiqvXVRCFIoriObLlAtLReOSV1.png",
          category: "UBUZIMA",
          folder: "UBUZIMA",
        },
        {
          id: 2,
          title: "Kunywa Amazi Menshi",
          description: "The importance of drinking water and staying hydrated",
          duration: "8 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bari%20kurya-0WaZrKA3NmftSBjUZi3diI9ZpmNgc3.png",
          category: "UBUZIMA",
          folder: "UBUZIMA",
        },
      ],
    },
    {
      name: "IMIRIRE MYIZA",
      description: "uko umubyeyi yakira umwana nuko umwana yitwara",
      videos: [
        {
          id: 3,
          title: "Ibiryo Byiza by'Umwana",
          description: "Nutritious foods that help children grow strong",
          duration: "14 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20basoma%20-YtJVZEKVd1Skk1htZbF9cqa5kF1HQ3.png",
          category: "IMIRIRE MYIZA",
          folder: "IMIRIRE MYIZA",
        },
        {
          id: 4,
          title: "Ibyerekeye Imirire",
          description: "How parents feed children with love and care",
          duration: "11 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20batetse-kLBA7DXWbvea8XwquYKy8eNBhbzDrf.png",
          category: "IMIRIRE MYIZA",
          folder: "IMIRIRE MYIZA",
        },
      ],
    },
    {
      name: "AMATEKA",
      description: "igisha umwana ikinyarwanda kiboneye",
      videos: [
        {
          id: 5,
          title: "Amateka y'Inyanja",
          description: "Historical stories from Rwanda and the world",
          duration: "15 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bakina%20umupira-f7OcXcyjJg0Xrhz7WbLXerJd8ayBoO.png",
          category: "AMATEKA",
          folder: "AMATEKA",
        },
        {
          id: 6,
          title: "Amateka y'Inyemezamigambo",
          description: "Teaching Rwandan culture and heritage",
          duration: "16 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bambuka%20umuhanda-Yz51tLeawE9nyHLVhWKczbZ9vZ34Ol.jpg",
          category: "AMATEKA",
          folder: "AMATEKA",
        },
      ],
    },
    {
      name: "UBUREZI",
      description: "uko umwana yiga mu rugo no kwishuri",
      videos: [
        {
          id: 7,
          title: "Imigisha y'Amajwi",
          description: "Learning mathematics at home and school",
          duration: "13 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed-1M2J430Y5jgNG84r6R0XpZL0Z7wdwC.png",
          category: "UBUREZI",
          folder: "UBUREZI",
        },
        {
          id: 8,
          title: "Imigisha y'Ururimi",
          description: "Language learning for academic success",
          duration: "14 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/word-search-eeu53wCGctIUx6jEg4f8hEBDg3eyvZ.jpg",
          category: "UBUREZI",
          folder: "UBUREZI",
        },
      ],
    },
    {
      name: "FILM Z'ABANA IMYAKA 1-5",
      description: "amasomo umwana yakwiga akabasha kwiyungura ubwenge",
      videos: [
        {
          id: 9,
          title: "Abana Bakina mu Nda",
          description: "Fun activities for toddlers to develop their minds",
          duration: "8 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bakina%20umupira-f7OcXcyjJg0Xrhz7WbLXerJd8ayBoO.png",
          category: "FILM Z'ABANA IMYAKA 1-5",
          folder: "FILM Z'ABANA IMYAKA 1-5",
        },
        {
          id: 10,
          title: "Imishwantire y'Abana",
          description: "Songs and rhymes for young learners",
          duration: "10 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mqdefault-IBQwYsXpCTx3e8Le7DBxUg9P8IKMV9.jpg",
          category: "FILM Z'ABANA IMYAKA 1-5",
          folder: "FILM Z'ABANA IMYAKA 1-5",
        },
      ],
    },
    {
      name: "VIDEWO Z'ABANA 5-14",
      description: "umubyeyi n'umwana",
      videos: [
        {
          id: 11,
          title: "Umwana no Umubyeyi",
          description: "Stories about parent-child relationships and bonding",
          duration: "17 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20batetse-kLBA7DXWbvea8XwquYKy8eNBhbzDrf.png",
          category: "VIDEWO Z'ABANA 5-14",
          folder: "VIDEWO Z'ABANA 5-14",
        },
        {
          id: 12,
          title: "Imikino y'Umwana",
          description: "Games and adventures for school-age children",
          duration: "18 mins",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stickman-maze-run-1gFg76HcDOyDe0aDkX1pZvmAU3Jf8k.jpg",
          category: "VIDEWO Z'ABANA 5-14",
          folder: "VIDEWO Z'ABANA 5-14",
        },
      ],
    },
  ]

  const fetchShortFilms = async () => {
    try {
      const response = await fetch('/api/videos?category=short-films')
      if (response.ok) {
        const data = await response.json()
        setFilmFolders(data.data && data.data.length > 0 ? data.data : defaultFilmFolders)
      } else {
        setFilmFolders(defaultFilmFolders)
      }
    } catch (error) {
      console.error('[v0] Error fetching short films:', error)
      setFilmFolders(defaultFilmFolders)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShortFilms()
    setExpandedFolder(defaultFilmFolders[0].name)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Short Films</h1>
            <p className="text-lg opacity-90">Amazing stories that inspire and entertain</p>
          </div>
        </section>

        {/* Folders Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size={40} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {filmFolders.map((folder) => (
                <div key={folder.name} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFolder(expandedFolder === folder.name ? null : folder.name)}
                    className="w-full bg-card p-6 hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{folder.name}</h3>
                      <p className="text-muted-foreground">{folder.description}</p>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-foreground transition-transform ${expandedFolder === folder.name ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expandedFolder === folder.name && (
                    <div className="bg-background p-6 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {folder.videos.map((video) => (
                          <div
                            key={video.id}
                            onClick={() => setSelectedVideo({ id: video.videoId || '', title: video.title })}
                            className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
                          >
                            <div className="relative overflow-hidden h-56">
                              <img
                                src={video.image || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Play className="text-white w-16 h-16 fill-white" />
                              </div>
                              {video.duration && (
                                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                  {video.duration}
                                </span>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-lg text-foreground mb-2">{video.title}</h4>
                              <p className="text-muted-foreground text-sm">{video.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <VideoModal 
        isOpen={selectedVideo !== null}
        videoId={selectedVideo?.id || ''}
        title={selectedVideo?.title || ''}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  )
}
