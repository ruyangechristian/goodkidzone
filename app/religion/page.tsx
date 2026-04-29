'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import { Heart, Loader, ChevronDown } from "lucide-react"
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

interface ReligionFolder {
  name: string
  description: string
  videos: Video[]
}

export default function ReligionPage() {
  const [religionFolders, setReligionFolders] = useState<ReligionFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null)
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null)

  const defaultReligionFolders: ReligionFolder[] = [
    {
      name: "INYIGISHO ZA GIKEISTO",
      description: "reba video wigishe umwana ibijyanye na bible nuko wamurera azi Imana",
      videos: [
        {
          id: 1,
          title: "Ibiyamakuru by'Inyigisho ya Gikristo",
          description: "Learn about Christian teachings and values from the Bible",
          category: "INYIGISHO ZA GIKEISTO",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20basoma%20-YtJVZEKVd1Skk1htZbF9cqa5kF1HQ3.png",
          folder: "INYIGISHO ZA GIKEISTO",
        },
        {
          id: 2,
          title: "Ese wifuza kumenya ibijyanye na Bibiliya",
          description: "Discover stories and lessons from the Bible",
          category: "INYIGISHO ZA GIKEISTO",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bari%20kuganira-qaSNWc3Pzs9ubNxgWlIyyhxCLdYhIr.jpg",
          folder: "INYIGISHO ZA GIKEISTO",
        },
      ],
    },
    {
      name: "INYIGISHO ZA QURAN",
      description: "reba video wigishe umwana ibijyanye na ISLAM nuko wa murera azi Imana",
      videos: [
        {
          id: 3,
          title: "Kumenya ibijyanye na Quran",
          description: "Explore Islamic teachings and the Quran",
          category: "INYIGISHO ZA QURAN",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bareba%20television-jleJyDHB0QiUacAwrCa4WuG3nAAHwd.jpg",
          folder: "INYIGISHO ZA QURAN",
        },
        {
          id: 4,
          title: "Imigenzo y'ISLAM",
          description: "Islamic principles and teachings for children",
          category: "INYIGISHO ZA QURAN",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bishimye%20kubera%20uburezi-q9ePIiqvXVRCFIoriObLlAtLReOSV1.png",
          folder: "INYIGISHO ZA QURAN",
        },
      ],
    },
    {
      name: "NI IYOBOKAMANA",
      description: "Ese wifuza kumenya ibijyanye na NI IYOBOKAMANA twige iyobokamana",
      videos: [
        {
          id: 5,
          title: "Menya byinshi kumana",
          description: "Learn more about different faiths and beliefs",
          category: "NI IYOBOKAMANA",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20bakina%20umupira-f7OcXcyjJg0Xrhz7WbLXerJd8ayBoO.png",
          folder: "NI IYOBOKAMANA",
        },
        {
          id: 6,
          title: "Amahoro n'Ubwiyunge",
          description: "Peace, unity and respect for all beliefs",
          category: "NI IYOBOKAMANA",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/abana%20batetse-kLBA7DXWbvea8XwquYKy8eNBhbzDrf.png",
          folder: "NI IYOBOKAMANA",
        },
      ],
    },
  ]

  const fetchReligionContent = async () => {
    try {
      const response = await fetch('/api/videos?category=religion')
      if (response.ok) {
        const data = await response.json()
        setReligionFolders(data.data && data.data.length > 0 ? data.data : defaultReligionFolders)
      } else {
        setReligionFolders(defaultReligionFolders)
      }
    } catch (error) {
      console.error('[v0] Error fetching religion content:', error)
      setReligionFolders(defaultReligionFolders)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReligionContent()
    setExpandedFolder(defaultReligionFolders[0].name)
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Religion & Values</h1>
            <p className="text-lg opacity-90">Learn timeless values and moral lessons</p>
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
              {religionFolders.map((folder) => (
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
                                <Heart className="text-white w-14 h-14 fill-white" />
                              </div>
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
