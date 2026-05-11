'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { Play, Folder, Heart, Loader, ArrowLeft, Loader2 } from "lucide-react"
import { VideoModal } from "@/components/video-modal"
import { useTranslation } from "@/lib/i18n/context"
import type { FolderDoc, VideoDoc } from "@/lib/db"
import { getPusherClient } from "@/lib/pusher"

interface FolderBrowserProps {
  folders: FolderDoc[]
  heroTitle: string
  heroSubtitle: string
  heroGradient: string
  folderIcon?: 'folder' | 'heart'
}

export default function FolderBrowser({
  folders,
  heroTitle,
  heroSubtitle,
  heroGradient,
  folderIcon = 'folder',
}: FolderBrowserProps) {
  const { t, locale } = useTranslation()
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [videos, setVideos] = useState<VideoDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null)

  const currentFolder = folders.find(f => f.slug === selectedFolder)
  const IconComponent = folderIcon === 'heart' ? Heart : Folder

  const fetchVideos = (slug: string) => {
    setLoading(true)
    fetch(`/api/videos?category=${slug}`)
      .then(res => res.json())
      .then(data => setVideos(data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!selectedFolder) return
    fetchVideos(selectedFolder)
  }, [selectedFolder])

  useEffect(() => {
    try {
      const pusher = getPusherClient()
      const channel = pusher.subscribe('gkz-videos')
      
      channel.bind('video-update', () => {
        console.log('[GKZ] Real-time video update received!')
        if (selectedFolder) {
          fetchVideos(selectedFolder)
        }
      })

      return () => {
        pusher.unsubscribe('gkz-videos')
      }
    } catch (e) {
      console.error('[GKZ] Pusher subscription failed:', e)
    }
  }, [selectedFolder])

  // Folder grid view
  if (!selectedFolder) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-background relative">
          <div className="blob w-[300px] h-[300px] bg-primary/10 top-20 -left-20"></div>
          <PageHero title={t(heroTitle)} subtitle={t(heroSubtitle)} gradient={heroGradient} />
          
          <section className="py-16 md:py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {folders.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-bubble">
                  <IconComponent size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-xl text-muted-foreground font-bold">No folders found yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {folders.map((folder) => (
                    <button
                      key={folder.slug}
                      onClick={() => setSelectedFolder(folder.slug)}
                      className="group relative overflow-hidden rounded-bubble bg-card border-2 border-transparent hover:border-primary/20 shadow-xl hover:shadow-2xl transition-all h-80"
                    >
                      <img
                        src={folder.image}
                        alt={locale === 'rw' ? folder.name : folder.nameEn}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <div className="text-left space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                              <IconComponent size={20} />
                            </div>
                            <h3 className="text-2xl font-extrabold text-white leading-tight">
                              {locale === 'rw' ? folder.name : folder.nameEn}
                            </h3>
                          </div>
                          <p className="text-white/80 text-sm font-medium line-clamp-2">{folder.description}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none">
                        <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                          <Play className="text-white w-10 h-10 fill-white" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  // Folder content view
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <section className={`py-12 md:py-20 bg-gradient-to-br ${currentFolder?.color || heroGradient} text-white relative overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button
              onClick={() => setSelectedFolder(null)}
              className="inline-flex items-center gap-2 mb-8 px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-full transition-all font-bold backdrop-blur-md border border-white/20 active:scale-95"
            >
              <ArrowLeft size={20} /> {t('videos.backToFolders')}
            </button>
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter leading-tight animate-in slide-in-from-left duration-500">
                {locale === 'rw' ? currentFolder?.name : currentFolder?.nameEn}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 font-medium leading-relaxed">
                {currentFolder?.description}
              </p>
            </div>
          </div>
          {/* Section Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -z-0"></div>
        </section>

        <section className="py-16 md:py-24 bg-grid-dots">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader size={60} className="animate-spin text-primary opacity-50" />
                <p className="text-muted-foreground font-bold animate-pulse">{t('common.loading')}</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-24 bg-muted/20 rounded-bubble border-2 border-dashed border-muted-foreground/20">
                <IconComponent size={64} className="mx-auto text-muted-foreground mb-4 opacity-30" />
                <p className="text-xl text-muted-foreground font-bold">{t('videos.noVideos')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="group bg-card rounded-bubble overflow-hidden border-2 border-transparent hover:border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                  >
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={video.image || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <button
                        onClick={() => setSelectedVideo({ id: video.videoId || '', title: video.title })}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                          <Play className="text-white w-8 h-8 fill-white" />
                        </div>
                      </button>
                      {video.duration && (
                        <span className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-extrabold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-6 flex-1">
                        {video.description}
                      </p>
                      <button
                        onClick={() => setSelectedVideo({ id: video.videoId || '', title: video.title })}
                        className="btn-primary-playful w-full py-3.5 text-sm"
                      >
                        <Play size={16} fill="currentColor" />
                        {t('videos.watchNow')}
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
      <Footer />
    </>
  )
}
