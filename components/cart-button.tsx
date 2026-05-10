'use client'

import { useCart } from '@/lib/cart-context'
import { ShoppingBag } from 'lucide-react'

export default function CartButton() {
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Open cart"
    >
      <ShoppingBag size={22} className="text-foreground" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
          {totalItems}
        </span>
      )}
    </button>
  )
}
