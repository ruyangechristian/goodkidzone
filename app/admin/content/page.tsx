'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import { Trash2, Plus, Loader } from 'lucide-react'

interface Video {
  id: number
  title: string
  description: string
  youtubeUrl: string
  videoId: string
  duration: string
  category: string
  image: string
  createdAt: string
}

export default function ContentManagementPage() {
  const [activeCategory, setActiveCategory] = useState('imikino')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [authChecked, setAuthChecked] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const categories = [
    { id: 'imikino', label: 'Imikino (Movies)' },
    { id: 'ubuzima-imirire', label: 'Ubuzima (Health & Wellness)' },
    { id: 'amateka-umuco', label: 'Amateka n\'Umuco (History & Culture)' },
    { id: 'uburezi', label: 'Uburezi (Education)' },
    { id: 'abana-1-5', label: 'Videwo z\'Abana 1-5 (Kids 1-5)' },
    { id: 'abana-5-14', label: 'Videwo z\'Abana 5-14 (Kids 5-14)' },
    { id: 'short-films', label: 'Short Films' },
    { id: 'religion', label: 'Religion' },
  ]

  // Fetch videos when category changes
  useEffect(() => {
    fetchVideos()
  }, [activeCategory])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/videos?category=${activeCategory}`)
      if (response.ok) {
        const data = await response.json()
        setVideos(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const extractVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : ''
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
      setMessage({ type: 'error', text: 'Please fill in title and YouTube URL' })
      return
    }

    const videoId = extractVideoId(formData.youtubeUrl)
    if (!videoId) {
      setMessage({ type: 'error', text: 'Invalid YouTube URL' })
      return
    }

    try {
      setIsAdding(true)
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          videoId,
          duration: formData.duration || '0:00',
          category: activeCategory,
          image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Video added successfully!' })
        setFormData({ title: '', description: '', youtubeUrl: '', duration: '' })
        fetchVideos()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to add video' })
      }
    } catch (error) {
      console.error('Error adding video:', error)
      setMessage({ type: 'error', text: 'Failed to add video' })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessage({ type: 'success', text: 'Video deleted successfully!' })
        fetchVideos()
      } else {
        setMessage({ type: 'error', text: 'Failed to delete video' })
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      setMessage({ type: 'error', text: 'Failed to delete video' })
    }
  }

  if (!authChecked) {
    return <div className="flex items-center justify-center min-h-screen"><Loader className="animate-spin" /></div>
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">Unauthorized</div>
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Content Management</h1>
          <p className="text-muted-foreground mb-8">Add and manage videos for your categories</p>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {message.text}
            </div>
          )}

          <div className="mb-8 flex gap-4 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/50 rounded-lg border border-border p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Add New Video</h2>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Video title"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Video description"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">YouTube URL</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 10:30"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {isAdding ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
                  {isAdding ? 'Adding...' : 'Add Video'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Videos in {categories.find(c => c.id === activeCategory)?.label}</h2>
              {loading ? (
                <div className="flex justify-center"><Loader className="animate-spin" /></div>
              ) : videos.length === 0 ? (
                <p className="text-muted-foreground">No videos yet. Add one above!</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {videos.map(video => (
                    <div key={video.id} className="bg-muted/50 rounded-lg border border-border p-3">
                      <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{video.description}</p>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-600 rounded hover:bg-red-500/30 text-sm font-semibold transition-all"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
