'use client'

import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AddVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  defaultCategory?: string
  dynamicFolders?: any[]
  editingVideo?: any | null
}

export function AddVideoModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultCategory = 'short-film',
  dynamicFolders = [],
  editingVideo = null
}: AddVideoModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
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
        titleEn: editingVideo.titleEn || '',
        description: editingVideo.description || '',
        descriptionEn: editingVideo.descriptionEn || '',
        youtubeUrl: editingVideo.youtubeUrl || '',
        duration: editingVideo.duration || '',
        category: editingVideo.category || defaultCategory,
        image: editingVideo.image || '',
        folder: editingVideo.folder || '',
      })
    }
  }, [editingVideo, defaultCategory])

  // Also update when editingVideo changes
  const [lastEditingId, setLastEditingId] = useState<string | null>(null)
  if (editingVideo && (editingVideo._id || editingVideo.id) !== lastEditingId) {
    setFormData({
      title: editingVideo.title || '',
      titleEn: editingVideo.titleEn || '',
      description: editingVideo.description || '',
      descriptionEn: editingVideo.descriptionEn || '',
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
      titleEn: '',
      description: '',
      descriptionEn: '',
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
          titleEn: formData.titleEn,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          youtubeUrl: formData.youtubeUrl,
          duration: formData.duration,
          category: formData.category,
          image: formData.image,
          folder: formData.folder,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${editingVideo ? 'update' : 'add'} video`)
      }

      if (!editingVideo) {
        setFormData({
          title: '',
          titleEn: '',
          description: '',
          descriptionEn: '',
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

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Kinyarwanda Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Kwiga Kinyarwanda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">English Title</label>
              <Input
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                placeholder="e.g. Learning Kinyarwanda"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Kinyarwanda Description</label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Iyi video ivuga ku..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">English Description</label>
            <Input
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              placeholder="What is this video about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">YouTube URL *</label>
            <Input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              required
            />
            <p className="text-[10px] text-muted-foreground font-medium px-1 uppercase tracking-wider mt-1">Supports: Watch links, Shorts, and Embed links</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 15:30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Content Type *</label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value, folder: '' }))
                }}
                required
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
              >
                <option value="video">Standard Video</option>
                <option value="short-film">Short Film</option>
                <option value="religion">Religion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Target Folder *</label>
              <select
                name="folder"
                value={formData.folder}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
              >
                <option value="">Select Folder</option>
                {dynamicFolders.filter(f => f.type === formData.category || (!f.type && formData.category === 'video')).map(folder => (
                  <option key={folder.slug} value={folder.slug}>
                    {folder.nameEn ? `${folder.nameEn} / ${folder.name}` : folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Custom Thumbnail URL (Optional)</label>
            <Input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {editingVideo ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Adding...' : 'Add Video')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
