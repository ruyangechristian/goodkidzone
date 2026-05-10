'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Gamepad2, ShoppingBag, Video, Sparkles,
  BookOpen, FolderOpen, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/games', icon: Gamepad2, label: 'Games' },
  { href: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { href: '/admin/videos', icon: Video, label: 'Videos' },
  { href: '/admin/folders', icon: FolderOpen, label: 'Video Folders' },
  { href: '/admin/festivals', icon: Sparkles, label: 'Festivals' },
  { href: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/signin')
      return
    }
    // Verify token with API
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuthenticated(true)
        } else {
          localStorage.removeItem('auth_token')
          router.push('/signin')
        }
      })
      .catch(() => {
        router.push('/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) return null

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-foreground text-background flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-background/10">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/goodkid-zone-logo.png" alt="Logo" className="h-10 w-auto brightness-200" />
            <div>
              <h2 className="font-bold text-sm">Goodkid Zone</h2>
              <p className="text-xs opacity-60">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-background/70 hover:text-background hover:bg-background/10'
                }`}
              >
                <Icon size={18} />
                {link.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-background/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-background/70 hover:text-background hover:bg-background/10 transition-all w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {sidebarLinks.find(l => l.href === pathname)?.label || 'Admin'}
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Site
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
