'use client'

import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-foreground text-background py-12 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Goodkid Zone</h3>
            <p className="text-sm opacity-70">{t('footer.tagline')}</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm">{t('footer.explore')}</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <Link href="/games" className="hover:opacity-100 transition">
                  {t('nav.games')}
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:opacity-100 transition">
                  {t('nav.videos')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:opacity-100 transition">
                  {t('nav.shop')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-sm">{t('footer.contact')}</h3>
            <p className="text-sm opacity-70">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@ubwizaentertainment.rw'}</p>
            <p className="text-sm opacity-70">{process.env.NEXT_PUBLIC_CONTACT_PHONE || '+250 791 263 814'}</p>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-70">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
