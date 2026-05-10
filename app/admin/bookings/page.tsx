'use client'

import { useState, useEffect } from 'react'
import { Loader, BookOpen } from 'lucide-react'

interface Booking {
  _id?: string
  eventId: number
  quantity: number
  customerName: string
  email: string
  bookingDate: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bookings</h2>
        <p className="text-muted-foreground">View all event ticket bookings</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={32} className="animate-spin text-primary" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No bookings yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Tickets</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking, i) => (
                  <tr key={booking._id || i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{booking.customerName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{booking.email}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">{booking.quantity}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
