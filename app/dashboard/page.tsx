'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Gamepad2, Video, ShoppingBag, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/signin')
      return
    }

    // Set a mock user (in production, validate token and fetch user data)
    setUser({
      email: 'user@example.com',
      name: 'User',
    })
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </main>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 rounded-xl p-8 md:p-12 mb-12 border border-border">
            <div className="flex justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Welcome, {user.name}!
                </h1>
                <p className="text-muted-foreground text-lg">{user.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Continue Your Learning</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Gamepad2,
                  title: '100+ Educational Games',
                  description: 'Explore fun learning games',
                  href: '/games',
                  color: 'from-primary/20 to-primary/5',
                },
                {
                  icon: Video,
                  title: 'Video Library',
                  description: 'Watch educational videos',
                  href: '/videos',
                  color: 'from-accent/20 to-accent/5',
                },
                {
                  icon: ShoppingBag,
                  title: 'Shop',
                  description: 'Browse exclusive merchandise',
                  href: '/shop',
                  color: 'from-secondary/20 to-secondary/5',
                },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link key={index} href={item.href}>
                    <div className={`bg-gradient-to-br ${item.color} border border-border rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer h-full`}>
                      <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="text-foreground" size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Admin Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Admin Controls</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/admin/content">
                <div className="bg-gradient-to-br from-purple/20 to-purple/5 border border-border rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="text-foreground" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Content Management</h3>
                  <p className="text-muted-foreground">Add and manage videos, short films, and religion content</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-muted/50 rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Progress</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Games Played', value: '0' },
                { label: 'Videos Watched', value: '0' },
                { label: 'Points Earned', value: '0' },
                { label: 'Achievements', value: '0' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center border border-border/50">
                  <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                  <p className="text-4xl font-bold text-primary mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
