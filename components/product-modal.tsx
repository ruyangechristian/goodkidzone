'use client'

import { useState, useEffect } from 'react'
import { X, Loader } from 'lucide-react'

interface Product {
  _id?: string
  id: number
  name: string
  price: number
  category: string
  rating: number
  image?: string
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: Product | null // If provided, we are in EDIT mode
}

export function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: '',
    category: '',
    image: '',
  })

  const isEdit = !!product

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: String(product.price),
        rating: String(product.rating),
        category: product.category,
        image: product.image || '',
      })
    } else {
      setFormData({ name: '', price: '', rating: '', category: '', image: '' })
    }
  }, [product, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating) || 0,
      category: formData.category,
      image: formData.image,
    }

    try {
      const url = isEdit ? `/api/products/${product._id || product.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'add'} product`)
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full border border-muted overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-muted bg-muted/20">
          <h2 className="text-xl font-bold text-foreground">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="hover:bg-muted p-1.5 rounded-lg transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm font-medium border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground ml-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Cool Kids Sneakers"
              required
              className="w-full px-4 py-2.5 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground ml-1">Price (RWF) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="15000"
                required
                className="w-full px-4 py-2.5 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground ml-1">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-2.5 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground ml-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            >
              <option value="">Select category</option>
              <option value="Shoes">Shoes</option>
              <option value="Outfits">Outfits</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground ml-1">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-muted rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {isEdit ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Adding...' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
