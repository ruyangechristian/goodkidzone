'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import { Play, Folder, Loader, ArrowLeft } from "lucide-react"
import { VideoModal } from "@/components/video-modal"

interface Video {
  id: number
  title: string
  description: string
  youtubeUrl: string
  videoId: string
  duration: string
  category: string
  image: string
}

interface VideoFolder {
  id: string
  name: string
  nameEn: string
  description: string
  image: string
  color: string
}

const FOLDERS: VideoFolder[] = [
  {
    id: 'imikino',
    name: 'Imikino',
    nameEn: 'Movies',
    description: 'Abakinnyi bapfuye kandi nkarangikira',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
    color: 'from-red-400 to-pink-500'
  },
  {
    id: 'ubuzima-imirire',
    name: 'Ubuzima (Imirire myiza)',
    nameEn: 'Health & Wellness',
    description: 'Ibihe byimirire myiza n\'indwara zitagwayo',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52ce32f0?w=400&h=300&fit=crop',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'amateka-umuco',
    name: 'Amateka n\'Umuco',
    nameEn: 'History & Culture',
    description: 'Amateka y\'u Rwanda n\'umuco nyarwanda',
    image: 'https://images.unsplash.com/photo-1514306688772-cfb6f251a545?w=400&h=300&fit=crop',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'uburezi',
    name: 'Uburezi',
    nameEn: 'Education',
    description: 'Ibigiriro byo kugutsinda mu nzira',
    image: 'https://images.unsplash.com/photo-1427504494785-cdaa41d4d527?w=400&h=300&fit=crop',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'abana-1-5',
    name: 'Videwo z\'Abana 1-5',
    nameEn: 'Kids 1-5 Years',
    description: 'Ibigiriro byiza kuri abana ba miaka 1-5',
    image: 'https://images.unsplash.com/photo-1503454537688-e47a1d299287?w=400&h=300&fit=crop',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'abana-5-14',
    name: 'Videwo z\'Abana 5-14',
    nameEn: 'Kids 5-14 Years',
    description: 'Ibigiriro byiza kuri abana ba miaka 5-14',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
    color: 'from-indigo-400 to-blue-500'
  }
]

export default function VideosPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null)
  const [folders, setFolders] = useState<VideoFolder[]>(FOLDERS)

  // Fetch folder settings on mount
  useEffect(() => {
    const fetchFolderSettings = async () => {
      try {
        const response = await fetch('/api/folders')
        if (response.ok) {
          const data = await response.json()
          // Update folders with fetched images
          const updatedFolders = FOLDERS.map(folder => ({
            ...folder,
            image: data.data[folder.id]?.image || folder.image,
            color: data.data[folder.id]?.color || folder.color
          }))
          setFolders(updatedFolders)
        }
      } catch (error) {
        console.error('[v0] Error fetching folder settings:', error)
        // Use default folders if API fails
      }
    }
    fetchFolderSettings()
  }, [])

  const currentFolder = folders.find(f => f.id === selectedFolder)

  // Fetch videos for selected folder
  useEffect(() => {
    if (!selectedFolder) return

    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/videos?category=${selectedFolder}`)
        if (response.ok) {
          const data = await response.json()
          setVideos(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [selectedFolder])

  // Folder view
  if (!selectedFolder) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-accent to-red-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Videwo Nziza</h1>
              <p className="text-xl opacity-90">
                Hitamo igitabo cyamakunze no kureba videwo ziza
              </p>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl transition-all h-72"
                  >
                    {/* Background Image */}
                    <img
                      src={folder.image}
                      alt={folder.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent`} />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <div />
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <Folder className="text-white" size={24} />
                          <h3 className="text-xl font-bold text-white text-balance">{folder.name}</h3>
                        </div>
                        <p className="text-white/90 text-sm">{folder.description}</p>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="text-white w-16 h-16 fill-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      </>
    )
  }

  // Video list view for selected folder
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="py-8 md:py-12 bg-gradient-to-r from-primary via-accent to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedFolder(null)}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Folders
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">{currentFolder?.name}</h1>
            <p className="text-lg opacity-90">{currentFolder?.description}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={40} className="animate-spin text-primary" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <Folder size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">Nta videwo ziri mu gitabo cyi</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all">
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={video.image || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => setSelectedVideo({ id: video.videoId, title: video.title })}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors cursor-pointer"
                      >
                        <Play className="text-white w-16 h-16 fill-white" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{video.description}</p>
                      <button
                        onClick={() => setSelectedVideo({ id: video.videoId, title: video.title })}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-md transition-all text-sm"
                      >
                        Watch Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
