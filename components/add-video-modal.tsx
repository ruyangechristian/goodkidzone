'use client'

import { useState } from 'react'
import { X, Loader } from 'lucide-react'

interface AddVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultCategory?: string
  categories?: string[]
}

export function AddVideoModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultCategory = 'short-films',
  categories = []
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
      const response = await fetch('/api/videos', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to add video')
      }

      setFormData({
        title: '',
        description: '',
        youtubeUrl: '',
        duration: '',
        category: defaultCategory,
        image: '',
        folder: '',
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      console.error('[v0] Error adding video:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Add New Video</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Video Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter video title"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter video description"
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">YouTube URL *</label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">e.g., https://youtube.com/watch?v=dQw4w9WgXcQ</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 12 mins"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select category</option>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                <>
                  <option value="short-films">Short Films</option>
                  <option value="religion">Religion</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Folder</label>
            <input
              type="text"
              name="folder"
              value={formData.folder}
              onChange={handleChange}
              placeholder="Leave empty to use category"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Custom Thumbnail URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Leave empty to use YouTube thumbnail"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Adding...' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
