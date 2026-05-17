"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Users, Phone, MessageCircle, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { useTranslation } from "@/lib/i18n/context"
import { getPusherClient } from "@/lib/pusher"

interface FestivalClientProps {
  initialEvents: any[]
}

const defaultEvents = [
  {
    id: 1,
    title: "Good Kidzone Live! - Kigali",
    description: "A day of fun, learning, and cultural entertainment for the whole family.",
    date: "2024-08-15",
    time: "10:00",
    location: "Kigali Convention Center",
    image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&h=600&fit=crop",
    ticketPrice: 15000,
    availableTickets: 250,
    category: "Family"
  }
]

export default function FestivalClient({ initialEvents }: FestivalClientProps) {
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)
  const [now, setNow] = useState(new Date())
  const [events, setEvents] = useState(initialEvents && initialEvents.length > 0 ? initialEvents : defaultEvents as any[])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const refreshEvents = async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/festivals?limit=100')
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setEvents(data.data)
        }
      }
    } catch (err) {
      console.error('[GKZ] Failed to refresh festivals:', err)
    } finally {
      setFetching(false)
    }
  }

  // Update 'now' every minute for real-time status
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    
    // Real-time listener
    try {
      const pusher = getPusherClient()
      const channel = pusher.subscribe('gkz-festivals')
      
      channel.bind('festival-update', () => {
        console.log('[GKZ] Real-time festival update received!')
        refreshEvents()
      })

      return () => {
        clearInterval(timer)
        pusher.unsubscribe('gkz-festivals')
      }
    } catch (e) {
      console.error('[GKZ] Pusher subscription failed:', e)
      return () => clearInterval(timer)
    }
  }, [])

  const getEventStatus = (dateStr: string, timeStr: string) => {
    const eventDate = new Date(`${dateStr}T${timeStr || '00:00'}`)
    const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 0 && diffHours > -4) return 'live'
    if (diffHours <= 0) return 'past'
    if (diffHours < 24) return 'today'
    return 'upcoming'
  }

  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+250 791 263 814'
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@ubwizaentertainment.rw'
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '250791263814'

  return (
    <>
      <Header />
      <main className="flex-1 bg-background relative">
        {/* Real-time Indicator */}
        {fetching && (
          <div className="fixed top-24 right-8 z-40 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 text-primary font-bold text-xs animate-in slide-in-from-right">
            <Loader2 size={14} className="animate-spin" />
            REFRESHING EVENTS...
          </div>
        )}

        <PageHero title={t('festival.pageTitle')} subtitle={t('festival.pageSubtitle')} gradient="from-purple-600 via-pink-500 to-red-500" />
        <section className="py-12 md:py-16 bg-pattern-doodles min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">{t('festival.upcomingEvents')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {events.map((event) => {
                const status = getEventStatus(event.date, event.time)
                return (
                  <div key={event.id} className="group bg-card border border-muted rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Real-time Status Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {status === 'live' && (
                          <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
                            <span className="w-2 h-2 bg-white rounded-full" /> LIVE NOW
                          </div>
                        )}
                        {status === 'today' && (
                          <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            TODAY
                          </div>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{event.category}</div>
                      
                      <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{event.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-2">{event.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div className="flex items-center gap-2.5 text-foreground font-medium">
                          <Calendar size={18} className="text-primary" />
                          {isMounted ? new Date(event.date).toLocaleDateString() : '...'}
                        </div>
                        <div className="flex items-center gap-2.5 text-foreground font-medium"><Clock size={18} className="text-primary" />{event.time}</div>
                        <div className="flex items-center gap-2.5 text-foreground font-medium"><MapPin size={18} className="text-primary" />{event.location}</div>
                        <div className="flex items-center gap-2.5 text-foreground font-medium"><Users size={18} className="text-primary" />{event.availableTickets} {t('festival.ticketsAvailable')}</div>
                      </div>
                      
                      <div className="flex items-end justify-between mb-6">
                        <div className="text-3xl font-black text-primary">{event.ticketPrice.toLocaleString()} <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">RWF</span></div>
                        <div className="text-xs font-bold text-muted-foreground uppercase">{t('festival.perTicket')}</div>
                      </div>

                      <div className="bg-muted/30 border border-muted/50 rounded-2xl p-5">
                        <p className="text-xs font-black text-muted-foreground uppercase mb-4 tracking-widest">{t('festival.contactTitle')}</p>
                        <div className="flex flex-wrap gap-3">
                          <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:shadow-lg transition-all active:scale-95"><Phone size={14} /> {t('festival.callUs')}</a>
                          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I'd like to book tickets for: ${event.title}`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all active:scale-95"><MessageCircle size={14} /> WhatsApp</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

