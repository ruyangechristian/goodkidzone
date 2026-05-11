'use client'

import { useState, useEffect } from 'react'
import { X, Loader } from 'lucide-react'

interface AddVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultCategory?: string
  categories?: (string | { label: string; slug: string })[]
  editingVideo?: any | null
}

export function AddVideoModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultCategory = 'short-films',
  categories = [],
  editingVideo = null
}: AddVideoModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
    category: defaultCategory,
    image: '',
    folder: '',
  })

  // Set form data when editing
  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title || '',
        description: editingVideo.description || '',
        youtubeUrl: editingVideo.youtubeUrl || '',
        duration: editingVideo.duration || '',
        category: editingVideo.category || defaultCategory,
        image: editingVideo.image || '',
        folder: editingVideo.folder || '',
      })
    }
  }, [editingVideo])

  // Also update when editingVideo changes
  const [lastEditingId, setLastEditingId] = useState<string | null>(null)
  if (editingVideo && (editingVideo._id || editingVideo.id) !== lastEditingId) {
    setFormData({
      title: editingVideo.title || '',
      description: editingVideo.description || '',
      youtubeUrl: editingVideo.youtubeUrl || '',
      duration: editingVideo.duration || '',
      category: editingVideo.category || defaultCategory,
      image: editingVideo.image || '',
      folder: editingVideo.folder || '',
    })
    setLastEditingId(editingVideo._id || editingVideo.id)
  } else if (!editingVideo && lastEditingId !== null) {
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: '',
      category: defaultCategory,
      image: '',
      folder: '',
    })
    setLastEditingId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = editingVideo 
        ? `/api/videos/${editingVideo._id || editingVideo.id}`
        : '/api/videos'
      
      const method = editingVideo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          youtubeUrl: formData.youtubeUrl,
          duration: formData.duration,
          category: formData.category,
          image: formData.image,
          folder: formData.folder || formData.category,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${editingVideo ? 'update' : 'add'} video`)
      }

      if (!editingVideo) {
        setFormData({
          title: '',
          description: '',
          youtubeUrl: '',
          duration: '',
          category: defaultCategory,
          image: '',
          folder: '',
        })
      }
      
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      console.error(`[GKZ] Error ${editingVideo ? 'updating' : 'adding'} video:`, err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Video Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Learning Kinyarwanda"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this video about?"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">YouTube URL *</label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <p className="text-[10px] text-gray-400 font-medium px-1 uppercase tracking-wider">Supports: Watch links, Shorts, and Embed links</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 15:30"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
              >
                <option value="">Select</option>
                {categories.map(cat => (
                  <option 
                    key={typeof cat === 'string' ? cat : (cat as any).slug} 
                    value={typeof cat === 'string' ? cat : (cat as any).slug}
                  >
                    {typeof cat === 'string' ? cat : (cat as any).label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Custom Thumbnail URL (Optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {editingVideo ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Adding...' : 'Add Video')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

