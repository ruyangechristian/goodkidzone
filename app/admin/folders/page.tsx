'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Loader, FolderOpen } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface VideoFolder {
  _id?: string
  slug: string
  name: string
  nameEn: string
  description: string
  image: string
  color: string
  order: number
  type?: string
}

type FolderType = 'video' | 'short-film' | 'religion'

const typeLabels: Record<FolderType, string> = {
  'video': '🎬 Videos',
  'short-film': '🎞️ Short Films',
  'religion': '🕊️ Religion',
}

export default function AdminFoldersPage() {
  const [folders, setFolders] = useState<VideoFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<FolderType>('video')
  const [form, setForm] = useState({
    name: '', nameEn: '', description: '', image: '', color: 'from-blue-400 to-cyan-500', slug: '', type: 'video' as FolderType
  })

  const fetchFolders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/folders?type=${activeType}`)
      if (res.ok) {
        const data = await res.json()
        setFolders(data.data || [])
      }
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchFolders() }, [activeType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    try {
      if (editingId) {
        const res = await fetch(`/api/folders/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug }),
        })
        if (res.ok) { setEditingId(null); setShowModal(false); fetchFolders() }
      } else {
        const res = await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug, type: activeType }),
        })
        if (res.ok) { setShowModal(false); fetchFolders() }
      }
      setForm({ name: '', nameEn: '', description: '', image: '', color: 'from-blue-400 to-cyan-500', slug: '', type: activeType })
    } catch (error) { console.error('Error:', error) }
  }

  const handleEdit = (folder: VideoFolder) => {
    setEditingId(folder._id || folder.slug)
    setForm({
      name: folder.name, nameEn: folder.nameEn, description: folder.description,
      image: folder.image, color: folder.color, slug: folder.slug, type: (folder.type || 'video') as FolderType,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this folder? Videos inside will not be deleted.')) return
    try {
      const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' })
      if (res.ok) fetchFolders()
    } catch (error) { console.error('Error:', error) }
  }

  const openCreateModal = () => {
    setEditingId(null)
    setForm({ name: '', nameEn: '', description: '', image: '', color: 'from-blue-400 to-cyan-500', slug: '', type: activeType })
    setShowModal(true)
  }

  const gradientOptions = [
    'from-red-400 to-pink-500', 'from-green-400 to-emerald-500',
    'from-amber-400 to-orange-500', 'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500', 'from-indigo-400 to-blue-500',
    'from-teal-400 to-green-500', 'from-rose-400 to-red-500',
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Content Folders</h2>
          <p className="text-muted-foreground">Manage folders for videos, short films, and religion</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add Folder
        </button>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(Object.keys(typeLabels) as FolderType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeType === type
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : folders.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <FolderOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No {typeLabels[activeType]} folders yet</p>
          <button onClick={openCreateModal} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
            Create First Folder
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <div key={folder._id || folder.slug} className="bg-card border border-border rounded-xl overflow-hidden group">
              <div className={`h-32 bg-gradient-to-r ${folder.color} relative overflow-hidden`}>
                {folder.image && (
                  <img src={folder.image} alt={folder.name} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{folder.name}</h3>
                  <p className="text-sm opacity-80">{folder.nameEn}</p>
                </div>
                <span className="absolute top-3 right-3 bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                  {typeLabels[folder.type as FolderType] || folder.type}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">{folder.description}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Slug: <code className="bg-muted px-1 py-0.5 rounded">{folder.slug}</code>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(folder)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Edit2 size={14} /> Rename
                  </button>
                  <button
                    onClick={() => handleDelete(folder._id || folder.slug)}
                    className="px-3 py-2 text-destructive hover:bg-destructive/10 border border-border rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Folder' : `Create ${typeLabels[activeType]} Folder`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Kinyarwanda Name</label>
              <Input placeholder="e.g., Imikino" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">English Name</label>
              <Input placeholder="e.g., Movies" value={form.nameEn} onChange={(e) => setForm({...form, nameEn: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <Input placeholder="Brief description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cover Image URL</label>
              <Input placeholder="https://..." value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Gradient Color</label>
              <div className="grid grid-cols-4 gap-2">
                {gradientOptions.map((g) => (
                  <button key={g} type="button" onClick={() => setForm({...form, color: g})}
                    className={`h-8 rounded-lg bg-gradient-to-r ${g} ${form.color === g ? 'ring-2 ring-foreground ring-offset-2' : ''}`}
                  />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editingId ? 'Save Changes' : 'Create Folder'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
