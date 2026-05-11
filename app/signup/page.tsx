'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export default function SignUpPage() {
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/signin')
    }, 5000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card rounded-xl shadow-lg p-8 space-y-6 border border-muted">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <Lock className="text-destructive" size={32} />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">{t('auth.registrationDisabled')}</h1>
              <p className="text-muted-foreground">{t('auth.adminOnly')}</p>
            </div>

            <div className="bg-muted border border-muted rounded-lg p-4">
              <p className="text-foreground font-medium text-center text-sm">
                {t('auth.registrationMessage')}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">{t('auth.goToSignIn')}</span>
              </div>
            </div>

            <Link href="/signin">
              <Button className="w-full bg-primary hover:bg-primary/90">
                {t('auth.signInAsAdmin')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
