'use client'

import { useState, useEffect } from 'react'
import { X, Loader, Plus, Trash2 } from 'lucide-react'

interface Product {
  _id?: string
  id: number
  name: string
  price: number
  category: string
  rating: number
  image?: string
  images?: string[]
  colors?: string[]
  sizes?: string[]
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: Product | null
}

function TagInput({ label, tags, setTags, placeholder }: { label: string, tags: string[], setTags: (tags: string[]) => void, placeholder: string }) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = inputValue.trim()
      if (val && !tags.includes(val)) {
        setTags([...tags, val])
      }
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-foreground ml-1">{label}</label>
      <div className="p-2 bg-background border border-muted rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm font-medium">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:bg-primary/20 rounded-full p-0.5">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Type and press Enter to add more..."}
          className="w-full bg-transparent outline-none text-sm px-1 text-foreground"
        />
      </div>
    </div>
  )
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
  
  const [images, setImages] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])

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
      setImages(product.images || [])
      setColors(product.colors || [])
      setSizes(product.sizes || [])
    } else {
      setFormData({ name: '', price: '', rating: '', category: '', image: '' })
      setImages([])
      setColors([])
      setSizes([])
    }
  }, [product, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addImageUrl = () => {
    setImages([...images, ''])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const removeImageUrl = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Filter out empty images
    const validImages = images.filter(img => img.trim() !== '')

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating) || 0,
      category: formData.category,
      image: formData.image,
      images: validImages,
      colors,
      sizes
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
      <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full border border-muted overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-muted bg-muted/20 shrink-0">
          <h2 className="text-xl font-bold text-foreground">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="hover:bg-muted p-1.5 rounded-lg transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
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
              <label className="text-sm font-bold text-foreground ml-1">Primary Image URL *</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
                className="w-full px-4 py-2.5 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground ml-1">Additional Image URLs (Gallery)</label>
              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => updateImageUrl(idx, e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                    />
                    <button type="button" onClick={() => removeImageUrl(idx)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addImageUrl} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add another image
                </button>
              </div>
            </div>

            <div className="border-t border-muted pt-4 space-y-4">
              <TagInput 
                label="Available Colors" 
                tags={colors} 
                setTags={setColors} 
                placeholder="e.g. Red (Press Enter)" 
              />
              <TagInput 
                label="Available Sizes" 
                tags={sizes} 
                setTags={setSizes} 
                placeholder="e.g. Medium or 39 (Press Enter)" 
              />
            </div>

          </form>
        </div>

        <div className="flex gap-3 p-6 border-t border-muted bg-muted/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-muted rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {isEdit ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Adding...' : 'Add Product')}
          </button>
        </div>
      </div>
    </div>
  )
}
