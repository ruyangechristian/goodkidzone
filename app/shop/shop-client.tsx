'use client'

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { ShoppingCart, Star, Check } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { useCart } from "@/lib/cart-context"
import type { ProductDoc } from "@/lib/db"

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
  const products = initialProducts.length > 0 ? initialProducts : defaultProducts
  const [addedId, setAddedId] = useState<number | null>(null)

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <PageHero title={t('shop.pageTitle')} subtitle={t('shop.pageSubtitle')} gradient="from-primary via-green-500 to-emerald-500" />
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all group">
                  <div className="h-40 w-full overflow-hidden bg-muted">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                      </div>
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{product.price.toLocaleString()} RWF</span>
                      <button onClick={() => handleAddToCart(product)} className={`p-2.5 rounded-xl transition-all active:scale-95 ${addedId === product.id ? 'bg-green-500 text-white' : 'bg-accent text-white hover:shadow-lg'}`}>
                        {addedId === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('shop.ctaTitle')}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t('shop.ctaSubtitle')}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
