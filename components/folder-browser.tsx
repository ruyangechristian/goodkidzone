'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { Play, Folder, Heart, Loader, ArrowLeft } from "lucide-react"
import { VideoModal } from "@/components/video-modal"
import { useTranslation } from "@/lib/i18n/context"
import type { FolderDoc, VideoDoc } from "@/lib/db"

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

  useEffect(() => {
    if (!selectedFolder) return
    setLoading(true)
    fetch(`/api/videos?category=${selectedFolder}`)
      .then(res => res.json())
      .then(data => setVideos(data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }, [selectedFolder])

  // Folder grid view — folders are pre-loaded from server, no spinner needed
  if (!selectedFolder) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-background">
          <PageHero title={t(heroTitle)} subtitle={t(heroSubtitle)} gradient={heroGradient} />
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {folders.length === 0 ? (
                <div className="text-center py-12">
                  <IconComponent size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground">No folders yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {folders.map((folder) => (
                    <button
                      key={folder.slug}
                      onClick={() => setSelectedFolder(folder.slug)}
                      className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl transition-all h-72"
                    >
                      <img
                        src={folder.image}
                        alt={locale === 'rw' ? folder.name : folder.nameEn}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-between p-6">
                        <div />
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className="text-white" size={24} />
                            <h3 className="text-xl font-bold text-white text-balance">
                              {locale === 'rw' ? folder.name : folder.nameEn}
                            </h3>
                          </div>
                          <p className="text-white/90 text-sm">{folder.description}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="text-white w-16 h-16 fill-white" />
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
        <section className={`py-8 md:py-12 bg-gradient-to-r ${currentFolder?.color || heroGradient} text-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedFolder(null)}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} /> {t('videos.backToFolders')}
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {locale === 'rw' ? currentFolder?.name : currentFolder?.nameEn}
            </h1>
            <p className="text-lg opacity-90">{currentFolder?.description}</p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader size={40} className="animate-spin text-primary" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-12">
                <IconComponent size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">{t('videos.noVideos')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
                  >
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={video.image || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => setSelectedVideo({ id: video.videoId || '', title: video.title })}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors cursor-pointer"
                      >
                        <Play className="text-white w-16 h-16 fill-white" />
                      </button>
                      {video.duration && (
                        <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{video.description}</p>
                      <button
                        onClick={() => setSelectedVideo({ id: video.videoId || '', title: video.title })}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-md transition-all text-sm"
                      >
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
