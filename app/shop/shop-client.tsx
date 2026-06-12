'use client'

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHero from "@/components/page-hero"
import { ShoppingCart, Star, Check, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { useCart } from "@/lib/cart-context"
import type { ProductDoc } from "@/lib/db"
import { getPusherClient } from "@/lib/pusher"

const defaultProducts = [
  { id: 1, name: "Colorful Sweatshirt Set", price: 18000, rating: 4.8, image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&h=600&fit=crop", category: "Outfits" },
  { id: 2, name: "Beige Sneaker Shoes", price: 22000, rating: 4.9, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop", category: "Shoes" },
]

function PublicProductModal({ product, isOpen, onClose, onAdd }: { product: any, isOpen: boolean, onClose: () => void, onAdd: (p: any, color?: string, size?: string) => void }) {
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

  // Reset selections when product changes
  useEffect(() => {
    setSelectedColor('')
    setSelectedSize('')
    setCurrentImageIdx(0)
  }, [product?.id])

  if (!isOpen || !product) return null

  const allImages = [product.image, ...(product.images || [])].filter(Boolean)
  const colors: string[] = product.colors || []
  const sizes: string[] = product.sizes || []

  const canAdd = (colors.length === 0 || selectedColor) && (sizes.length === 0 || selectedSize)

  const handleNextImage = () => setCurrentImageIdx((prev) => (prev + 1) % allImages.length)
  const handlePrevImage = () => setCurrentImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-3xl shadow-2xl max-w-3xl w-full border border-muted overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
          <X size={20} />
        </button>

        {/* Image Gallery */}
        <div className="md:w-1/2 bg-muted relative group h-64 md:h-auto shrink-0 flex items-center justify-center">
          {allImages.length > 0 ? (
            <>
              <img src={allImages[currentImageIdx]} alt={product.name} className="w-full h-full object-cover" />
              {allImages.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i === currentImageIdx ? 'bg-white scale-125' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-muted-foreground font-bold">No Image</div>
          )}
        </div>

        {/* Details & Selection */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">{product.category}</p>
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 leading-tight">{product.name}</h2>
          
          <div className="flex items-center gap-1 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "drop-shadow-sm" : "opacity-30"} />)}
            </div>
            <span className="text-sm font-bold text-muted-foreground ml-1">{product.rating}</span>
          </div>

          <p className="text-3xl font-black text-primary mb-8">{product.price.toLocaleString()} <span className="text-sm tracking-tighter uppercase opacity-60">RWF</span></p>

          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-foreground mb-3 flex justify-between">
                <span>Color</span>
                {selectedColor && <span className="text-primary text-sm">{selectedColor}</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${selectedColor === c ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-muted text-foreground hover:border-primary/30'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-foreground mb-3 flex justify-between">
                <span>Size</span>
                {selectedSize && <span className="text-primary text-sm">{selectedSize}</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${selectedSize === s ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-muted text-foreground hover:border-primary/30'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4">
            <button
              onClick={() => {
                if (canAdd) {
                  onAdd(product, selectedColor, selectedSize)
                  onClose()
                }
              }}
              disabled={!canAdd}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${canAdd ? 'bg-primary text-primary-foreground hover:shadow-lg hover:-translate-y-1 active:scale-95' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            >
              <ShoppingCart size={22} />
              {!canAdd ? 'Select Options to Add' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ShopClientProps {
  initialProducts: ProductDoc[]
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [products, setProducts] = useState(initialProducts.length > 0 ? initialProducts : defaultProducts as any[])
  const [fetching, setFetching] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [addedId, setAddedId] = useState<string | null>(null)

  const refreshProducts = async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/products?limit=100')
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
    try {
      const pusher = getPusherClient()
      const channel = pusher.subscribe('gkz-shop')
      channel.bind('product-update', () => refreshProducts())
      return () => pusher.unsubscribe('gkz-shop')
    } catch (e) {
      console.error('[GKZ] Pusher subscription failed:', e)
    }
  }, [])

  const handleAddToCart = (product: any, color?: string, size?: string) => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      category: product.category,
      selectedColor: color,
      selectedSize: size
    })
    
    // Show success checkmark briefly on the specific variant added
    const cartItemId = `${product.id}-${color || 'none'}-${size || 'none'}`
    setAddedId(cartItemId)
    setTimeout(() => setAddedId(null), 1500)
  }

  const openProduct = (product: any) => {
    const hasVariants = (product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0) || (product.images && product.images.length > 0)
    if (hasVariants) {
      setSelectedProduct(product)
    } else {
      // If it's a simple product with no variants/gallery, just add it directly
      handleAddToCart(product)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background relative">
        {fetching && (
          <div className="fixed top-24 right-8 z-40 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 text-primary font-bold text-xs animate-in slide-in-from-right">
            <Loader2 size={14} className="animate-spin" />
            UPDATING SHOP...
          </div>
        )}

        <PageHero title={t('shop.pageTitle')} subtitle={t('shop.pageSubtitle')} gradient="from-primary via-green-500 to-emerald-500" />
        <section className="py-12 md:py-16 bg-pattern-doodles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} onClick={() => openProduct(product)} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-muted hover:shadow-xl transition-all group cursor-pointer flex flex-col">
                  <div className="h-48 w-full overflow-hidden bg-muted relative shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Badge for multiple photos */}
                    {product.images && product.images.length > 0 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                        +{product.images.length} Photos
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">{product.category}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-primary">{product.price.toLocaleString()} <span className="text-[10px] tracking-tighter uppercase opacity-60">RWF</span></span>
                        <div className={`p-3 rounded-2xl transition-all shadow-md group-hover:shadow-lg ${addedId?.startsWith(String(product.id)) ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground opacity-90 group-hover:opacity-100'}`}>
                          {addedId?.startsWith(String(product.id)) ? <Check size={20} strokeWidth={3} /> : <ShoppingCart size={20} strokeWidth={2.5} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 border-t border-muted bg-pattern-shapes">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-foreground mb-6">{t('shop.ctaTitle')}</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">{t('shop.ctaSubtitle')}</p>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              Contact Sales Agent
            </button>
          </div>
        </section>
      </main>

      <PublicProductModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAdd={handleAddToCart}
      />

      <Footer />
    </>
  )
}
