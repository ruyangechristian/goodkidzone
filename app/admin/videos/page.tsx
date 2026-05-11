'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, Video, AlertCircle, CheckCircle, Pencil } from 'lucide-react'
import { AddVideoModal } from '@/components/add-video-modal'
import ConfirmModal from '@/components/confirm-modal'
import { Pagination } from '@/components/pagination'

type VideoTab = 'all' | 'religion' | 'short-films'

interface VideoItem {
  _id?: string
  id: number
  title: string
  category: string
  duration?: string
  videoId?: string
  youtubeUrl?: string
  image?: string
}

type Toast = { type: 'success' | 'error'; message: string }

const religionCategories = [
  { label: "Christian Teachings", slug: "inyigisho-gikristo" },
  { label: "Quranic Teachings", slug: "inyigisho-quran" },
  { label: "Faith & Spirituality", slug: "iyobokamana" }
]

const filmCategories = [
  { label: "Life & Living", slug: "ubuzima" },
  { label: "Healthy Nutrition", slug: "imirire-myiza" },
  { label: "History & Heritage", slug: "amateka" },
  { label: "Educational Films", slug: "uburezi-films" },
  { label: "Films for Kids (1-5 Years)", slug: "abana-1-5-films" },
  { label: "Films for Kids (5-14 Years)", slug: "abana-5-14-films" }
]

export default function AdminVideosPage() {
  const [activeTab, setActiveTab] = useState<VideoTab>('all')
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState('')
  const [deleting, setDeleting] = useState(false)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchVideos = async (page = currentPage) => {
    setLoading(true)
    try {
      const categoryParam = activeTab === 'all' ? '' : `&category=${activeTab}`
      const res = await fetch(`/api/videos?page=${page}&limit=${limit}${categoryParam}`)
      if (res.ok) {
        const data = await res.json()
        setVideos(data.data || [])
        if (data.pagination) {
          setTotalPages(data.pagination.pages)
          setCurrentPage(data.pagination.page)
        }
      } else {
        showToast('error', 'Failed to load videos')
      }
    } catch {
      showToast('error', 'Network error — could not load videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    if (currentPage !== 1) {
      setCurrentPage(1) 
    } else {
      fetchVideos()
    }
  }, [activeTab])

  useEffect(() => { 
    fetchVideos() 
  }, [currentPage])

  const requestDelete = (video: VideoItem) => {
    const id = video._id || String(video.id)
    setDeletingId(id)
    setDeletingName(video.title)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/videos/${deletingId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        showToast('success', `"${deletingName}" has been deleted.`)
        fetchVideos()
      } else {
        showToast('error', data.error || 'Failed to delete video')
      }
    } catch {
      showToast('error', 'Network error — could not delete video')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
      setDeletingId(null)
      setDeletingName('')
    }
  }

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video)
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingVideo(null)
    setShowModal(true)
  }

  const getCategoryLabel = (slug: string) => {
    const allCats = [...religionCategories, ...filmCategories]
    const cat = allCats.find(c => c.slug === slug)
    return cat ? cat.label : slug
  }

  const tabs: { key: VideoTab; label: string }[] = [
    { key: 'all', label: 'All Content' },
    { key: 'religion', label: 'Religion' },
    { key: 'short-films', label: 'Short Films' },
  ]

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl font-semibold text-white animate-in slide-in-from-top duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Videos Management</h2>
          <p className="text-muted-foreground">Manage all video content</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Add Video
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-muted pb-2">
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
        <div className="text-center py-16 bg-card border border-muted rounded-xl">
          <Video size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No videos found</p>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Add Your First Video
          </button>
        </div>
      ) : (
        <>
          <div className="bg-card border border-muted rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Thumbnail</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Duration</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {videos.map((video) => (
                    <tr key={video._id || video.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        {(() => {
                          // Extract ID from URL if videoId is missing
                          let vidId = video.videoId;
                          if (!vidId && video.youtubeUrl) {
                            const match = video.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
                            vidId = match ? match[1] : null;
                          }
                          
                          const thumbUrl = video.image && video.image.startsWith('http') 
                            ? video.image 
                            : vidId 
                              ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`
                              : '/images/video-placeholder.png'; // Fallback if all fails

                          return (
                            <img
                              src={thumbUrl}
                              alt={video.title}
                              className="w-20 h-12 rounded-lg object-cover shadow-sm border border-muted bg-muted flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=120&fit=crop';
                              }}
                            />
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground max-w-xs truncate">{video.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-wider">
                          {getCategoryLabel(video.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-muted-foreground">{video.duration || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(video)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-90"
                            title="Edit video"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => requestDelete(video)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all active:scale-90"
                            title="Delete video"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}

      {/* Add/Edit Video Modal */}
      <AddVideoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchVideos(); showToast('success', editingVideo ? 'Video updated successfully!' : 'Video added successfully!') }}
        editingVideo={editingVideo}
        defaultCategory={activeTab === 'all' ? 'religion' : activeTab}
        categories={activeTab === 'short-films' ? filmCategories : activeTab === 'religion' ? religionCategories : [...religionCategories, ...filmCategories]}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Video"
        message={`Are you sure you want to delete "${deletingName}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Yes, Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); setDeletingName('') }}
      />
    </div>
  )
}
