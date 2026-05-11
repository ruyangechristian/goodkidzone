'use client'

import { useTranslation } from '@/lib/i18n/context'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'rw' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-muted hover:bg-muted transition-colors"
      aria-label="Switch language"
    >
      <Globe size={14} />
      <span>{locale === 'en' ? 'KN' : 'EN'}</span>
    </button>
  )
}
