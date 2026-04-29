'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle, Lock } from 'lucide-react'
import { useEffect } from 'react'

export default function SignUpPage() {
  const router = useRouter()
  const [showMessage, setShowMessage] = useState(true)

  useEffect(() => {
    // Redirect to signin after showing message
    const timer = setTimeout(() => {
      router.push('/signin')
    }, 4000)
    return () => clearTimeout(timer)
  }, [router])

  if (!showMessage) {
    return null
  }

  const dummyFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  const [formData, setFormData] = useState(dummyFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.error || 'Registration failed' })
        }
        return
      }

      setSuccess(true)
      setSuccessMessage(data.message || 'Registration successful!')
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      
      // Store token and redirect to dashboard
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="flex justify-center mb-6">
              <Lock className="text-red-600" size={48} />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-red-600">Registration Disabled</h1>
              <p className="text-muted-foreground">Admin access only</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium text-center">
                Registration is disabled for this application. Only the admin account can access this platform.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm font-medium mb-2 text-center">Admin Credentials:</p>
              <div className="bg-white rounded p-3 text-center">
                <p className="text-sm"><span className="font-semibold">Username:</span> Admin</p>
                <p className="text-sm"><span className="font-semibold">Password:</span> Amadoullah@12</p>
              </div>
            </div>

            <div className="hidden">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
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
                  Password
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading || success}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || success}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Go to Admin Sign In</span>
              </div>
            </div>

            <Link href="/signin">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Sign In as Admin
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
