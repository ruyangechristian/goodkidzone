'use client'

import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'
import WavyDivider from './ui/wavy-divider'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="relative bg-foreground text-background pt-24 pb-12 overflow-hidden">
      <WavyDivider color="var(--background)" position="top" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/images/goodkid-zone-logo.png" alt="Logo" className="h-12 w-auto brightness-0 invert" />
              <h3 className="font-extrabold text-2xl tracking-tighter">Good Kidzone</h3>
            </div>
            <p className="text-lg opacity-80 max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              {/* Social placeholders could go here */}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg text-primary">{t('footer.explore')}</h3>
            <ul className="space-y-4 text-base opacity-80">
              <li>
                <Link href="/games" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('nav.games')}
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('nav.videos')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link href="/festival" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  {t('nav.festival')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6 relative">
            <h3 className="font-bold text-lg text-primary">{t('footer.contact')}</h3>
            <div className="space-y-4 text-base opacity-80">
              <a href="mailto:goodkidzone@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">
                ✉️ goodkidzone@gmail.com
              </a>
              <div className="space-y-2">
                <a href="tel:+250732222217" className="hover:text-primary transition-colors flex items-center gap-2">
                  📞 +250 732 222 217
                </a>
                <a href="tel:+250788718396" className="hover:text-primary transition-colors flex items-center gap-2">
                  📞 +250 788 718 396
                </a>
                <a href="tel:+250781633154" className="hover:text-primary transition-colors flex items-center gap-2">
                  📞 +250 781 633 154
                </a>
              </div>
              <div className="hover:text-primary transition-colors flex items-start gap-2 max-w-[250px]">
                📍 <span>Kigali City, Nyarugenge District / Street KN 220 St.</span>
              </div>
              <a href="https://instagram.com/GOODKIDZONE" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 font-bold text-pink-500">
                📸 GOOD KIDZONE
              </a>
            </div>
            
            {/* Mascot peeking from the bottom right */}
            <img 
              src="/images/mascot-zari.png" 
              alt="Mascot" 
              className="absolute -right-4 -bottom-12 w-32 h-auto opacity-40 grayscale brightness-200 pointer-events-none hidden md:block"
            />
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-sm opacity-50 font-medium">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0"></div>
    </footer>
  )
}
