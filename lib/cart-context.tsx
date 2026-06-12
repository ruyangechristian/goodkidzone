'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface CartItem {
  id: number
  cartItemId: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'cartItemId'> & { selectedColor?: string, selectedSize?: string }) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gkz_cart')
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {}
  }, [])

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('gkz_cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, 'quantity' | 'cartItemId'> & { selectedColor?: string, selectedSize?: string }) => {
    setItems((prev) => {
      const cartItemId = `${item.id}-${item.selectedColor || 'none'}-${item.selectedSize || 'none'}`
      const existing = prev.find((i) => i.cartItemId === cartItemId)
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, cartItemId, quantity: 1 }]
    })
    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId))
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function generateWhatsAppMessage(items: CartItem[], totalPrice: number): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '250781633154'
  
  let message = "Hello! I'd like to order from Good Kidzone:\n\n"
  items.forEach((item) => {
    const details = [item.selectedColor ? `Color: ${item.selectedColor}` : null, item.selectedSize ? `Size: ${item.selectedSize}` : null].filter(Boolean).join(', ')
    const variantText = details ? ` (${details})` : ''
    message += `${item.quantity}x ${item.name}${variantText} - ${(item.price * item.quantity).toLocaleString()} RWF\n`
  })
  message += `\nTotal: ${totalPrice.toLocaleString()} RWF\n\nPlease confirm availability. Thank you!`

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}
