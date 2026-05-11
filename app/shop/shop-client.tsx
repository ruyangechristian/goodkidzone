'use client'

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { ShoppingCart, Star, Check, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { useCart } from "@/lib/cart-context"
import type { ProductDoc } from "@/lib/db"
import { getPusherClient } from "@/lib/pusher"

const defaultProducts = [
  { id: 1, name: "Colorful Sweatshirt Set", price: 18000, rating: 4.8, image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&h=600&fit=crop", category: "Outfits" },
  { id: 2, name: "Beige Sneaker Shoes", price: 22000, rating: 4.9, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop", category: "Shoes" },
  { id: 3, name: "Brown Leather Shoes", price: 19000, rating: 4.7, image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800&h=600&fit=crop", category: "Shoes" },
  { id: 4, name: "Pink Sparkly Girl Shoes", price: 20000, rating: 4.6, image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=600&fit=crop", category: "Shoes" },
  { id: 5, name: "Blue Orange Clothing Set", price: 17500, rating: 4.9, image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=600&fit=crop", category: "Outfits" },
  { id: 6, name: "Colorful Multi-Sneaker", price: 21000, rating: 4.8, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop", category: "Shoes" },
  { id: 7, name: "Gray Sweatshirt Pants Set", price: 16000, rating: 4.7, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=600&fit=crop", category: "Outfits" },
  { id: 8, name: "Pastel Rainbow Sneaker", price: 23000, rating: 4.9, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop", category: "Shoes" },
]

interface ShopClientProps {
  initialProducts: ProductDoc[]
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [products, setProducts] = useState(initialProducts.length > 0 ? initialProducts : defaultProducts as any[])
  const [addedId, setAddedId] = useState<number | null>(null)
  const [fetching, setFetching] = useState(false)

  const refreshProducts = async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/products?limit=100') // Fetch more for shop
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setProducts(data.data)
        }
      }
    } catch (err) {
      console.error('[GKZ] Failed to refresh shop products:', err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    // Real-time listener
    try {
      const pusher = getPusherClient()
      const channel = pusher.subscribe('gkz-shop')
      
      channel.bind('product-update', () => {
        console.log('[GKZ] Real-time product update received!')
        refreshProducts()
      })

      return () => {
        pusher.unsubscribe('gkz-shop')
      }
    } catch (e) {
      console.error('[GKZ] Pusher subscription failed:', e)
    }
  }, [])

  const handleAddToCart = (product: any) => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      category: product.category 
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background relative">
        {/* Real-time Indicator */}
        {fetching && (
          <div className="fixed top-24 right-8 z-40 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 text-primary font-bold text-xs animate-in slide-in-from-right">
            <Loader2 size={14} className="animate-spin" />
            UPDATING SHOP...
          </div>
        )}

        <PageHero title={t('shop.pageTitle')} subtitle={t('shop.pageSubtitle')} gradient="from-primary via-green-500 to-emerald-500" />
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-muted hover:shadow-xl transition-all group">
                  <div className="h-48 w-full overflow-hidden bg-muted relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">{product.category}</p>
                    <div className="flex items-center gap-1 mb-6">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "drop-shadow-sm" : "opacity-30"} />)}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground ml-1">{product.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-primary">{product.price.toLocaleString()} <span className="text-[10px] tracking-tighter uppercase opacity-60">RWF</span></span>
                      <button onClick={() => handleAddToCart(product)} className={`p-3 rounded-2xl transition-all active:scale-90 shadow-md hover:shadow-lg ${addedId === product.id ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
                        {addedId === product.id ? <Check size={20} strokeWidth={3} /> : <ShoppingCart size={20} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 bg-muted/30 border-t border-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-foreground mb-6">{t('shop.ctaTitle')}</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">{t('shop.ctaSubtitle')}</p>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              Contact Sales Agent
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

