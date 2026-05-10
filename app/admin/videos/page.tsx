'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, Video } from 'lucide-react'
import { AddVideoModal } from '@/components/add-video-modal'

type VideoTab = 'all' | 'religion' | 'short-films'

interface VideoItem {
  _id?: string
  id: number
  title: string
  category: string
  duration?: string
  videoId?: string
  image?: string
}

const religionCategories = ["INYIGISHO ZA GIKEISTO", "INYIGISHO ZA QURAN", "NI IYOBOKAMANA"]
const filmCategories = ["UBUZIMA", "IMIRIRE MYIZA", "AMATEKA", "UBUREZI", "FILM Z'ABANA IMYAKA 1-5", "VIDEWO Z'ABANA 5-14"]

export default function AdminVideosPage() {
  const [activeTab, setActiveTab] = useState<VideoTab>('all')
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const categoryParam = activeTab === 'all' ? '' : `?category=${activeTab}`
      const res = await fetch(`/api/videos${categoryParam}`)
      if (res.ok) {
        const data = await res.json()
        setVideos(data.data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVideos() }, [activeTab])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
      if (res.ok) fetchVideos()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const tabs: { key: VideoTab; label: string }[] = [
    { key: 'all', label: 'All Videos' },
    { key: 'religion', label: 'Religion' },
    { key: 'short-films', label: 'Short Films' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Videos Management</h2>
          <p className="text-muted-foreground">Manage all video content</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Add Video
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={32} className="animate-spin text-primary" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Video size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No videos found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Duration</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {videos.map((video) => (
                  <tr key={video._id || video.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={video.image || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-20 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground max-w-xs truncate">{video.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                        {video.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{video.duration || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(video._id || String(video.id))}
                        className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddVideoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchVideos() }}
        defaultCategory={activeTab === 'all' ? 'religion' : activeTab}
        categories={activeTab === 'short-films' ? filmCategories : activeTab === 'religion' ? religionCategories : [...religionCategories, ...filmCategories]}
      />
    </div>
  )
}
