'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, Sparkles, Calendar, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', location: '',
    image: '', ticketPrice: 0, availableTickets: 0, category: ''
  })

  const fetchFestivals = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/festivals')
      if (res.ok) {
        const data = await res.json()
        setFestivals(data.data || [])
      }
    } catch (error) { console.error('Error:', error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchFestivals() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/festivals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowModal(false)
        setForm({ title: '', description: '', date: '', time: '', location: '', image: '', ticketPrice: 0, availableTickets: 0, category: '' })
        fetchFestivals()
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      const res = await fetch(`/api/festivals/${id}`, { method: 'DELETE' })
      if (res.ok) fetchFestivals()
    } catch (error) { console.error('Error:', error) }
  }

  return (
    <div className="space-y-6">
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
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Sparkles size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No events yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {festivals.map((event) => (
            <div key={event._id || event.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
                  <button
                    onClick={() => handleDelete(event._id || String(event.id))}
                    className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
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
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Event Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none h-20" required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
              <Input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} required />
            </div>
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
            <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Ticket Price (RWF)" value={form.ticketPrice || ''} onChange={(e) => setForm({...form, ticketPrice: parseInt(e.target.value) || 0})} required />
              <Input type="number" placeholder="Available Tickets" value={form.availableTickets || ''} onChange={(e) => setForm({...form, availableTickets: parseInt(e.target.value) || 0})} required />
            </div>
            <Input placeholder="Category (e.g., Festival, Movie Night)" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
            <Button type="submit" className="w-full">Add Event</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
