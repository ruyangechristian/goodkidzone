'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, Sparkles, Calendar, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/confirm-modal'
import { Pagination } from '@/components/pagination'

interface Festival {
  _id?: string
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  ticketPrice: number
  availableTickets: number
  category: string
}

type Toast = { type: 'success' | 'error'; message: string }

const emptyForm = {
  title: '', description: '', date: '', time: '', location: '',
  image: '', ticketPrice: 0, availableTickets: 0, category: ''
}

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [toast, setToast] = useState<Toast | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(6)

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState('')
  const [deleting, setDeleting] = useState(false)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchFestivals = async (page = currentPage) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/festivals?page=${page}&limit=${limit}`)
      if (res.ok) {
        const data = await res.json()
        setFestivals(data.data || [])
        if (data.pagination) {
          setTotalPages(data.pagination.pages)
          setCurrentPage(data.pagination.page)
        }
      } else {
        showToast('error', 'Failed to load events')
      }
    } catch {
      showToast('error', 'Network error — could not load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFestivals() }, [currentPage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/festivals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowModal(false)
        setForm(emptyForm)
        fetchFestivals()
        showToast('success', `Event "${form.title}" added successfully!`)
      } else {
        const data = await res.json()
        showToast('error', data.error || 'Failed to add event')
      }
    } catch {
      showToast('error', 'Network error — could not add event')
    } finally {
      setSubmitting(false)
    }
  }

  const requestDelete = (event: Festival) => {
    const id = event._id || String(event.id)
    setDeletingId(id)
    setDeletingName(event.title)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/festivals/${deletingId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        showToast('success', `"${deletingName}" has been deleted.`)
        fetchFestivals()
      } else {
        showToast('error', data.error || 'Failed to delete event')
      }
    } catch {
      showToast('error', 'Network error — could not delete event')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
      setDeletingId(null)
      setDeletingName('')
    }
  }

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
          <h2 className="text-2xl font-bold text-foreground">Festivals Management</h2>
          <p className="text-muted-foreground">Manage events and festivals</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all">
          <Plus size={18} /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-16 bg-card border border-muted rounded-xl">
          <Sparkles size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No events yet</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
            Add Your First Event
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {festivals.map((event) => (
              <div key={event._id || event.id} className="bg-card border border-muted rounded-xl overflow-hidden">
                {event.image && (
                  <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
                    <button
                      onClick={() => requestDelete(event)}
                      className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                      title="Delete event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                  </div>
                  <p className="mt-2 font-semibold text-primary">{event.ticketPrice?.toLocaleString()} RWF</p>
                </div>
              </div>
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}

      {/* Add Event Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Event Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-muted rounded-lg text-sm resize-none h-20" required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
              <Input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />
            </div>
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
            <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Ticket Price (RWF)" value={form.ticketPrice || ''} onChange={(e) => setForm({...form, ticketPrice: parseInt(e.target.value) || 0})} required />
              <Input type="number" placeholder="Available Tickets" value={form.availableTickets || ''} onChange={(e) => setForm({...form, availableTickets: parseInt(e.target.value) || 0})} required />
            </div>
            <Input placeholder="Category (e.g., Festival, Movie Night)" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Event'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Event"
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
