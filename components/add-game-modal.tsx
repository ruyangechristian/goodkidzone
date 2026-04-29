'use client'

import { useState } from 'react'
import { X, Loader } from 'lucide-react'

interface AddGameModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddGameModal({ isOpen, onClose, onSuccess }: AddGameModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    rating: '',
    premium: false,
    color: 'bg-blue-400',
    image: '',
  })

  const colors = [
    'bg-blue-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-orange-400',
    'bg-pink-400',
    'bg-yellow-400',
    'bg-red-400',
    'bg-indigo-400',
  ]

  const categories = [
    'Imibare',
    'Ururimi',
    'Ubwenge',
    'Inyandiko',
    'Siyensi',
    'Amateka',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          rating: parseFloat(formData.rating) || 0,
          premium: formData.premium,
          color: formData.color,
          image: formData.image,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add game')
      }

      setFormData({
        title: '',
        description: '',
        category: '',
        rating: '',
        premium: false,
        color: 'bg-blue-400',
        image: '',
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      console.error('[v0] Error adding game:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Add New Game</h2>
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
            <label className="block text-sm font-medium mb-1">Game Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter game title"
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
              placeholder="Enter game description"
              rows={3}
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
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g., 4.8"
              min="0"
              max="5"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-full h-10 rounded-lg border-2 ${color} ${
                    formData.color === color ? 'border-black' : 'border-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="premium"
                checked={formData.premium}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Premium Game</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Game Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
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
              {loading ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
