'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import { Calendar, MapPin, Users, Clock, Phone, Mail, MessageCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import type { FestivalDoc } from '@/lib/db'

const defaultEvents = [
  { id: 1, title: 'Amakino ya Watoto (Kids Movie Night)', description: 'Special movie screening for kids featuring family-friendly content.', date: '2026-04-15', time: '16:00', location: 'Kigali Convention Center', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop', ticketPrice: 5000, availableTickets: 150, category: 'Movie Night' },
  { id: 2, title: "Icyamamare cy'Amakino (Movie Festival)", description: 'Grand festival celebrating Rwandan and international films.', date: '2026-04-20', time: '09:00', location: 'Kigali City Stadium', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&h=600&fit=crop', ticketPrice: 8000, availableTickets: 500, category: 'Festival' },
  { id: 3, title: 'Ikinyarwanda Kids Variety Show', description: 'Live entertainment show featuring music, dance, and performances.', date: '2026-05-10', time: '15:00', location: 'Serena Hotel Kigali', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop', ticketPrice: 6000, availableTickets: 200, category: 'Live Show' },
]

interface FestivalClientProps { initialEvents: FestivalDoc[] }

export default function FestivalClient({ initialEvents }: FestivalClientProps) {
  const { t } = useTranslation()
  const events = initialEvents.length > 0 ? initialEvents : defaultEvents

  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+250 791 263 814'
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@ubwizaentertainment.rw'
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '250791263814'

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <PageHero title={t('festival.pageTitle')} subtitle={t('festival.pageSubtitle')} gradient="from-purple-600 via-pink-500 to-red-500" />
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">{t('festival.upcomingEvents')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">{event.category}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-foreground"><Calendar size={16} className="text-primary" />{new Date(event.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2 text-foreground"><Clock size={16} className="text-primary" />{event.time}</div>
                      <div className="flex items-center gap-2 text-foreground"><MapPin size={16} className="text-primary" />{event.location}</div>
                      <div className="flex items-center gap-2 text-foreground"><Users size={16} className="text-primary" />{event.availableTickets} {t('festival.ticketsAvailable')}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary mb-4">{event.ticketPrice.toLocaleString()} RWF<span className="text-sm font-normal text-muted-foreground ml-1">/{t('festival.perTicket')}</span></div>
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-3">{t('festival.contactTitle')}</p>
                      <div className="flex flex-wrap gap-2">
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:shadow-md transition-all"><Phone size={14} /> {t('festival.callUs')}</a>
                        <a href={`mailto:${email}`} className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-muted transition-all"><Mail size={14} /> {t('festival.emailUs')}</a>
                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I'd like to book tickets for: ${event.title}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-all"><MessageCircle size={14} /> WhatsApp</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
