"use client"

import Link from "next/link"
import { Menu, X, Gamepad2, Video, ShoppingBag, Film, Flame, Sparkles } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <img src="/images/goodkid-zone-logo.png" alt="Goodkid Zone Logo" className="h-16 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/games"
              className="px-4 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Gamepad2 size={18} />
              Games
            </Link>
            <Link
              href="/videos"
              className="px-4 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Video size={18} />
              Videos
            </Link>
            <Link
              href="/short-films"
              className="px-4 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Film size={18} />
              Short Films
            </Link>
            <Link
              href="/religion"
              className="px-4 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Flame size={18} />
              Religion
            </Link>
            <Link
              href="/festival"
              className="px-4 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Sparkles size={18} />
              Festival
            </Link>
            <Link
              href="/shop"
              className="px-4 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
            >
              <ShoppingBag size={18} />
              Shop
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link href="/signin">
              <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:shadow-md transition-all">
                Sign In
              </button>
            </Link>
          </div>

          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/games" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Games
            </Link>
            <Link
              href="/videos"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Videos
            </Link>
            <Link
              href="/short-films"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Short Films
            </Link>
            <Link
              href="/religion"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Religion
            </Link>
            <Link href="/festival" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Festival
            </Link>
            <Link href="/shop" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Shop
            </Link>
            <Link href="/signin" className="block">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-md transition-all">
                Sign In
              </button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
