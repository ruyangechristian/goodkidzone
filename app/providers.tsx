'use client'

import { LanguageProvider } from '@/lib/i18n/context'
import { CartProvider } from '@/lib/cart-context'
import CartDrawer from '@/components/cart-drawer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </LanguageProvider>
  )
}
