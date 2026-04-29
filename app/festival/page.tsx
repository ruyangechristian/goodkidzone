'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import { Calendar, MapPin, Users, Ticket, Clock, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Event {
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

interface Booking {
  id: number
  eventId: number
  quantity: number
  customerName: string
  email: string
  bookingDate: string
}

export default function FestivalPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({ quantity: 1, name: '', email: '' })
  const [bookingMessage, setBookingMessage] = useState('')

  const defaultEvents: Event[] = [
    {
      id: 1,
      title: 'Amakino ya Watoto (Kids Movie Night)',
      description: 'Special movie screening for kids featuring family-friendly content. Enjoy popcorn and snacks!',
      date: '2026-04-15',
      time: '16:00',
      location: 'Kigali Convention Center',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
      ticketPrice: 5000,
      availableTickets: 150,
      category: 'Movie Night',
    },
    {
      id: 2,
      title: 'Icyamamare cy\'Amakino (Movie Festival)',
      description: 'Grand festival celebrating Rwandan and international films. Multiple screenings throughout the day.',
      date: '2026-04-20',
      time: '09:00',
      location: 'Kigali City Stadium',
      image: 'https://images.unsplash.com/photo-1489599849228-ed4f22d4bdf0?w=800&h=600&fit=crop',
      ticketPrice: 8000,
      availableTickets: 500,
      category: 'Festival',
    },
    {
      id: 3,
      title: 'Ikinyarwanda Kids Variety Show',
      description: 'Live entertainment show featuring music, dance, and performances by talented kids.',
      date: '2026-05-10',
      time: '15:00',
      location: 'Serena Hotel Kigali',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
      ticketPrice: 6000,
      availableTickets: 200,
      category: 'Live Show',
    },
    {
      id: 4,
      title: 'Umuco n\'Amasimbi (Cultural & Arts Festival)',
      description: 'Celebrate Rwandan culture with traditional music, dance, and art exhibitions.',
      date: '2026-05-25',
      time: '10:00',
      location: 'Ethnographic Museum',
      image: 'https://images.unsplash.com/photo-1513741618117-c1b144db76d8?w=800&h=600&fit=crop',
      ticketPrice: 4000,
      availableTickets: 300,
      category: 'Cultural Event',
    },
    {
      id: 5,
      title: 'Itorero ry\'Uburezi (Educational Summit)',
      description: 'Interactive educational workshops and seminars for kids and parents.',
      date: '2026-06-05',
      time: '08:00',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      ticketPrice: 3000,
      availableTickets: 400,
      category: 'Workshop',
    },
  ]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/festivals')
        if (response.ok) {
          const data = await response.json()
          setEvents(data.data && data.data.length > 0 ? data.data : defaultEvents)
        } else {
          setEvents(defaultEvents)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents(defaultEvents)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleBooking = async () => {
    if (!bookingData.name || !bookingData.email || bookingData.quantity < 1) {
      setBookingMessage({ type: 'error', text: 'Please fill all fields' })
      return
    }

    if (!selectedEvent) return

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          quantity: bookingData.quantity,
          customerName: bookingData.name,
          email: bookingData.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBookingMessage({ type: 'success', text: 'Booking confirmed! Check your email for details.' })
        setBookingData({ quantity: 1, name: '', email: '' })
        setTimeout(() => {
          setShowBookingModal(false)
          setBookingMessage('')
        }, 2000)
      } else {
        setBookingMessage({ type: 'error', text: data.error || 'Booking failed' })
      }
    } catch (error) {
      console.error('Booking error:', error)
      setBookingMessage({ type: 'error', text: 'Failed to complete booking' })
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Icyamamare cy\'Abana | Kids Festival</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Discover amazing events and festivals for kids. Book your tickets now for upcoming celebrations!
            </p>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Event Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {event.category}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>

                      {/* Date, Time, Location */}
                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar size={18} className="text-primary" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <Clock size={18} className="text-primary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin size={18} className="text-primary" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <Users size={18} className="text-primary" />
                          <span>{event.availableTickets} tickets available</span>
                        </div>
                      </div>

                      {/* Price and Booking */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">
                          {event.ticketPrice.toLocaleString()} RWF
                        </div>
                        <button
                          onClick={() => {
                            setSelectedEvent(event)
                            setShowBookingModal(true)
                            setBookingMessage('')
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-md transition-all"
                        >
                          <Ticket size={18} />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Tickets - {selectedEvent?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Event Summary */}
            {selectedEvent && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Price per ticket:</strong> {selectedEvent.ticketPrice.toLocaleString()} RWF
                </p>
              </div>
            )}

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Number of Tickets</label>
              <input
                type="number"
                min="1"
                max={selectedEvent?.availableTickets || 1}
                value={bookingData.quantity}
                onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Total Price */}
            {selectedEvent && (
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-lg font-bold text-primary">
                  Total: {(selectedEvent.ticketPrice * bookingData.quantity).toLocaleString()} RWF
                </p>
              </div>
            )}

            {/* Message */}
            {bookingMessage && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  bookingMessage.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {bookingMessage.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-md transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
