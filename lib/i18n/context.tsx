'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import en from './translations/en.json'
import rw from './translations/rw.json'

export type Locale = 'en' | 'rw'

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string ? T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K : never }[keyof T]
  : never

type TranslationKey = NestedKeyOf<typeof en>

const translations: Record<Locale, typeof en> = { en, rw }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Fallback: return the key itself
    }
  }
  return typeof current === 'string' ? current : path
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('gkz_locale') as Locale | null
    if (saved && (saved === 'en' || saved === 'rw')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('gkz_locale', newLocale)
  }, [])

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[locale] as unknown as Record<string, unknown>, key)
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  
  // During SSR or if provider is missing, return a dummy t function to prevent crashing
  if (!context) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: (key: string) => key // Just return the key
    }
  }
  
  return context
}
