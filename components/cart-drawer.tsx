'use client'

import { useCart, generateWhatsAppMessage } from '@/lib/cart-context'
import { useTranslation } from '@/lib/i18n/context'
import { X, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart()
  const { t } = useTranslation()

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">{t('shop.cartTitle')}</h2>
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="text-lg">{t('shop.cartEmpty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-card border border-border rounded-xl p-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-sm mt-1">
                      {item.price.toLocaleString()} RWF
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive/80 self-start p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-foreground">{t('shop.cartTotal')}</span>
              <span className="text-primary">{totalPrice.toLocaleString()} RWF</span>
            </div>
            <a
              href={generateWhatsAppMessage(items, totalPrice)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg hover:shadow-xl"
              onClick={() => {
                clearCart()
                setIsCartOpen(false)
              }}
            >
              <MessageCircle size={22} />
              {t('shop.orderWhatsApp')}
            </a>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full px-4 py-2.5 border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {t('shop.continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
