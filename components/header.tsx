"use client"

import Link from "next/link"
import { Menu, X, Gamepad2, Video, ShoppingBag, Film, Flame, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/context"
import LanguageSwitcher from "@/components/language-switcher"
import CartButton from "@/components/cart-button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { href: "/games", icon: Gamepad2, label: t('nav.games') },
    { href: "/videos", icon: Video, label: t('nav.videos') },
    { href: "/short-films", icon: Film, label: t('nav.shortFilms') },
    { href: "/religion", icon: Flame, label: t('nav.religion') },
    { href: "/festival", icon: Sparkles, label: t('nav.festival') },
    { href: "/shop", icon: ShoppingBag, label: t('nav.shop') },
  ]

  return (
    <header className="sticky top-0 z-40 bg-background/95 border-b border-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <img src="/images/goodkid-zone-logo.png" alt="Goodkid Zone Logo" className="h-16 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors text-sm"
                >
                  <IconComponent size={16} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <CartButton />
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <button className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {t('nav.dashboard')}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-semibold text-sm hover:bg-destructive/20 transition-all"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <Link href="/signin">
                <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:shadow-md transition-all">
                  {t('nav.signIn')}
                </button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <CartButton />
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-1 border-t border-border pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2.5 text-foreground hover:bg-muted rounded-lg font-medium text-left">
                      {t('nav.dashboard')}
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg font-semibold hover:bg-destructive/20 transition-all"
                  >
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-md transition-all">
                    {t('nav.signIn')}
                  </button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
