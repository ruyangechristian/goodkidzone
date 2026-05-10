'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export default function SignInPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.error || 'Sign in failed' })
        }
        return
      }

      setSuccess(true)
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }

      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error) {
      console.error('Sign in error:', error)
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card rounded-xl shadow-lg p-8 space-y-6 border border-border">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">{t('auth.signInTitle')}</h1>
              <p className="text-muted-foreground">{t('auth.signInSubtitle')}</p>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 items-start">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-green-800">{t('auth.signInSuccess')}</p>
                  <p className="text-sm text-green-700">{t('auth.redirecting')}</p>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="font-semibold text-red-800">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@goodkidzone.rw"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || success}
              >
                {isLoading ? t('auth.signingIn') : t('auth.signInTitle')}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
