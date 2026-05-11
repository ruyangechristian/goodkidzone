'use client'

import { useState, useEffect } from 'react'
import { Gamepad2, ShoppingBag, Video, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  games: number
  products: number
  videos: number
  festivals: number
  bookings: number
}

const statCards = [
  { key: 'games', label: 'Games', icon: Gamepad2, href: '/admin/games', color: 'from-blue-500 to-cyan-500' },
  { key: 'products', label: 'Products', icon: ShoppingBag, href: '/admin/products', color: 'from-green-500 to-emerald-500' },
  { key: 'videos', label: 'Videos', icon: Video, href: '/admin/videos', color: 'from-purple-500 to-pink-500' },
  { key: 'festivals', label: 'Festivals', icon: Sparkles, href: '/admin/festivals', color: 'from-orange-500 to-red-500' },
  { key: 'bookings', label: 'Bookings', icon: BookOpen, href: '/admin/bookings', color: 'from-indigo-500 to-blue-500' },
] as const

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ games: 0, products: 0, videos: 0, festivals: 0, bookings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin 👋</h1>
        <p className="opacity-80">Here&apos;s an overview of your Good Kidzone content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          const value = stats[card.key]
          return (
            <Link key={card.key} href={card.href}>
              <div className="bg-card border border-muted rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    value
                  )}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/games">
            <div className="bg-card border border-muted rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Gamepad2 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Manage Games</p>
                <p className="text-sm text-muted-foreground">Add, edit, or remove games</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/products">
            <div className="bg-card border border-muted rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ShoppingBag size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Manage Products</p>
                <p className="text-sm text-muted-foreground">Update your shop inventory</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/videos">
            <div className="bg-card border border-muted rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Video size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Manage Videos</p>
                <p className="text-sm text-muted-foreground">Add videos to your library</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
