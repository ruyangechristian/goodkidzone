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
    { href: "/games", icon: Gamepad2, label: t('nav.games'), color: "text-blue-500" },
    { href: "/videos", icon: Video, label: t('nav.videos'), color: "text-red-500" },
    { href: "/short-films", icon: Film, label: t('nav.shortFilms'), color: "text-purple-500" },
    { href: "/religion", icon: Flame, label: t('nav.religion'), color: "text-orange-500" },
    { href: "/festival", icon: Sparkles, label: t('nav.festival'), color: "text-pink-500" },
    { href: "/shop", icon: ShoppingBag, label: t('nav.shop'), color: "text-green-500" },
  ]

  return (
    <header className="sticky top-0 z-40 bg-background/80 border-b border-muted/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center gap-2 hover:scale-110 transition-transform active:scale-95 duration-300">
            <img src="/images/goodkid-zone-logo.png" alt="Good Kidzone Logo" className="h-16 w-auto drop-shadow-sm" />
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 flex items-center gap-2 text-foreground font-bold hover:bg-muted/50 rounded-full transition-all hover:scale-105 active:scale-95 text-sm group`}
                >
                  <IconComponent size={18} className={`${link.color} transition-transform group-hover:animate-wiggle`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <CartButton />
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <button className="px-4 py-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                    {t('nav.dashboard')}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-destructive/10 text-destructive rounded-full font-bold text-sm hover:bg-destructive/20 transition-all active:scale-95"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <Link href="/signin">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-extrabold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95">
                  {t('nav.signIn')}
                </button>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <CartButton />
            <button
              className="p-2 text-foreground bg-muted/50 rounded-full hover:text-primary transition-colors active:scale-90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden pb-6 space-y-2 pt-4 border-t border-muted/20 animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3.5 text-foreground hover:bg-muted rounded-2xl transition-all font-bold active:scale-[0.98]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className={link.color} size={20} />
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-3 px-4">
              <LanguageSwitcher />
              {isLoggedIn ? (
                <div className="grid gap-3 pt-2">
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-3.5 text-foreground bg-muted rounded-2xl font-bold text-left">
                      {t('nav.dashboard')}
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3.5 bg-destructive/10 text-destructive rounded-2xl font-bold hover:bg-destructive/20 transition-all"
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-4 bg-primary text-primary-foreground rounded-2xl font-extrabold shadow-lg shadow-primary/20 active:scale-95">
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
